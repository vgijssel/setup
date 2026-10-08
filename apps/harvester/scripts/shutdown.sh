#!/usr/bin/env bash
# Graceful full-cluster shutdown of the 3-node Harvester cluster (illusion,
# the-dome, the-toy-factory). Harvester has no one-button cluster shutdown; this
# automates the manual sequence documented in apps/network/harvester.md
# ("Graceful Shutdown & Restart"), which is itself the upstream KB adapted to
# this cluster (all three nodes control-plane, storage on the switchless mesh).
#
# Needs no local kubeconfig or kube context. Every kubectl call runs *on* a node
# over SSH, as root via sudo, against that node's own
# /etc/rancher/rke2/rke2.yaml — the same kubeconfig the node itself uses. So the
# only inputs are SSH access and the node IPs, and there is no way to aim this at
# the wrong cluster by having the wrong context selected.
#
# Order matters — it is the reverse of install order:
#   0. pre-flight: reach a node, confirm it is Harvester, Longhorn quiet, SSH+ICMP
#   1. stop every VM guest-side (ACPI), gate on "no VirtualMachineInstances left"
#   2. disable the addons holding PVs, so their volumes detach
#   3. HARD GATE: every longhorn volume must read "detached"
#   4. identify the etcd leader
#   5. shut down the two non-leaders over SSH, one at a time, fully down each
#   6. shut down the leader last
#
# Steps 1 and 3 are what prevent data loss; leader-last (5/6) is what lets etcd
# regain quorum cleanly on the way back up. Every kubectl call happens before any
# node goes down, because the API dies with the node running it.
#
# Deliberately does NOT use Maintenance Mode: it drains one node onto the other
# two and needs two nodes up, so with all three going down it only adds churn.
#
# Deliberately does NOT force-stop a VM that will not shut down. A straggler
# aborts the run instead — a forced stop risks exactly the guest filesystem
# corruption this script exists to avoid.
#
# Usage:
#   moon run harvester:shutdown                # prompts before mutating anything
#   moon run harvester:shutdown -- --dry-run   # print the plan, change nothing
#   moon run harvester:shutdown -- --yes       # unattended
#
# Environment:
#   HARVESTER_NODES        seed node addresses to find a live one through
#   HARVESTER_SSH_USER     SSH user on the nodes (default: rancher)
#   HARVESTER_KUBECONFIG   kubeconfig path ON THE NODE (default the rke2 one)
#   HARVESTER_REMOTE_KUBECTL  kubectl path ON THE NODE, if auto-detection fails
#   HARVESTER_ADDONS       space-separated addons to disable first
#   HARVESTER_VM_TIMEOUT   seconds to wait for guests to power off (default 600)
#
# Restart is the mirror image and is intentionally manual — see the "Restart"
# section of apps/network/harvester.md (network first, etcd leader first, then
# verify the Mellanox mesh before re-enabling addons).

# SC2310: kube() and node_is_up() are deliberately called in `||` and `while`
# conditions — reading cluster state and probing liveness are both things we test
# rather than assert. Both are thin wrappers whose only meaningful command is the
# trailing ssh, so set -e being suspended inside them cannot hide a failure.
# shellcheck disable=SC2310
set -euo pipefail

# Seeds only: enough to reach one live node. The authoritative node list is then
# read from the cluster itself, so a replaced or re-addressed node does not need
# this default updated. IPs per apps/network/harvester.md "IP Assignments" — the
# node addresses, never the VIP (192.168.20.9), since we need to talk to a
# specific node and the VIP moves.
SEED_NODES="${HARVESTER_NODES:-192.168.20.10 192.168.20.11 192.168.20.12}"
SSH_USER="${HARVESTER_SSH_USER:-rancher}"
# Readable only by root on the node, hence sudo for every kubectl call.
REMOTE_KUBECONFIG="${HARVESTER_KUBECONFIG:-/etc/rancher/rke2/rke2.yaml}"
VM_TIMEOUT="${HARVESTER_VM_TIMEOUT:-600}"
ADDON_TIMEOUT="${HARVESTER_ADDON_TIMEOUT:-300}"
NODE_DOWN_TIMEOUT="${HARVESTER_NODE_DOWN_TIMEOUT:-300}"
# Only used when ICMP is unavailable and "fully off" cannot be observed directly.
POWEROFF_GRACE="${HARVESTER_POWEROFF_GRACE:-60}"
# Addons that hold PersistentVolumes, so their volumes must detach before power
# off. rancher-vcluster runs the Rancher that manages the downstream clusters and
# keeps its own PV; monitoring/logging hold the Prometheus/Grafana/Loki PVCs.
# Addons not listed (pcidevices-controller, harvester-seeder, ...) are stateless
# and are left alone rather than churned.
ADDONS="${HARVESTER_ADDONS:-rancher-monitoring rancher-logging rancher-vcluster}"

DRY_RUN=false
ASSUME_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
  --dry-run) DRY_RUN=true ;;
  --yes | -y) ASSUME_YES=true ;;
  -h | --help)
    # Two expressions, not one `# \?`: BSD sed's BRE has no optional operator,
    # so `\?` would be matched literally and nothing would be stripped.
    sed -n '2,49p' "${BASH_SOURCE[0]}" | sed -e 's|^# ||' -e 's|^#||'
    exit 0
    ;;
  *)
    echo "ERROR: unknown argument '$1' (try --help)" >&2
    exit 2
    ;;
  esac
  shift
done

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
# Note: no local kubectl — it runs on the node. jq parses the JSON locally so
# that no jq program has to survive a round trip through a remote shell.
require jq
require ssh
require ping

log() { echo "==> $*"; }
warn() { echo "WARNING: $*" >&2; }
die() {
  echo "ERROR: $*" >&2
  exit 1
}

# Every mutating call goes through run(), so --dry-run is honoured in one place.
run() {
  if [[ "${DRY_RUN}" == "true" ]]; then
    echo "    [dry-run] $*"
  else
    "$@"
  fi
}

# Same, for a call whose failure carries no information — `shutdown -h now` tears
# its own SSH connection down as it runs, so its exit status is meaningless.
run_tolerant() {
  if [[ "${DRY_RUN}" == "true" ]]; then
    echo "    [dry-run] $*"
    return 0
  fi
  "$@" || true
  return 0
}

# `ping` spells its per-probe timeout differently per platform: -t seconds on
# macOS, -W on Linux. Resolve it once into an argv array.
OS_NAME="$(uname -s)"
PING_IS_MACOS="${IS_MACOS:-}"
if [[ -z "${PING_IS_MACOS}" ]]; then
  if [[ "${OS_NAME}" == "Darwin" ]]; then PING_IS_MACOS=true; else PING_IS_MACOS=false; fi
fi
if [[ "${PING_IS_MACOS}" == "true" ]]; then
  PING_ARGS=(-c 1 -t 2)
else
  PING_ARGS=(-c 1 -W 2)
fi

SSH_OPTS=(-n -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10)

# ---------------------------------------------------------------------------
# 0. Pre-flight
# ---------------------------------------------------------------------------

log "Pre-flight: looking for a reachable node among: ${SEED_NODES}"
CONTROL_NODE=""
for seed in ${SEED_NODES}; do
  if ssh "${SSH_OPTS[@]}" "${SSH_USER}@${seed}" true >/dev/null 2>&1; then
    CONTROL_NODE="${seed}"
    break
  fi
  echo "      ${seed} unreachable"
done
[[ -n "${CONTROL_NODE}" ]] ||
  die "cannot SSH to any node as '${SSH_USER}' (tried: ${SEED_NODES})"
log "Driving the cluster through ${CONTROL_NODE}"

ssh "${SSH_OPTS[@]}" "${SSH_USER}@${CONTROL_NODE}" sudo -n true >/dev/null 2>&1 ||
  die "passwordless sudo unavailable for ${SSH_USER} on ${CONTROL_NODE}; it is needed to read ${REMOTE_KUBECONFIG}"

# RKE2 ships kubectl outside the default PATH and the directory is root-only, so
# probe the known locations as root rather than assuming one. Override with
# HARVESTER_REMOTE_KUBECTL if a release moves it somewhere else again.
REMOTE_KUBECTL="${HARVESTER_REMOTE_KUBECTL:-}"
if [[ -z "${REMOTE_KUBECTL}" ]]; then
  for cand in /var/lib/rancher/rke2/bin/kubectl /usr/local/bin/kubectl /opt/rke2/bin/kubectl /usr/bin/kubectl; do
    if ssh "${SSH_OPTS[@]}" "${SSH_USER}@${CONTROL_NODE}" sudo -n test -x "${cand}" >/dev/null 2>&1; then
      REMOTE_KUBECTL="${cand}"
      break
    fi
  done
fi
[[ -n "${REMOTE_KUBECTL}" ]] ||
  die "no kubectl found on ${CONTROL_NODE} — set HARVESTER_REMOTE_KUBECTL to its path"
log "Using ${REMOTE_KUBECTL} --kubeconfig ${REMOTE_KUBECONFIG} (as root, on the node)"

# Run kubectl on the node, as root, against the node's own kubeconfig.
#
# ssh concatenates its command arguments and the remote shell re-parses the
# result, which would strip the quotes out of a JSON patch body and mangle it.
# printf '%q' re-quotes every argument so it survives that second parse intact.
kube() {
  local remote_cmd
  remote_cmd="$(printf '%q ' sudo -n "${REMOTE_KUBECTL}" --kubeconfig "${REMOTE_KUBECONFIG}" "$@")"
  # SC2029: expanding client-side is the whole point — remote_cmd is the
  # already-%q-quoted command line we want the remote shell to receive verbatim.
  # shellcheck disable=SC2029
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${CONTROL_NODE}" "${remote_cmd}"
}

kube version --request-timeout=15s >/dev/null 2>&1 ||
  die "kubectl on ${CONTROL_NODE} cannot reach the Kubernetes API"

# Confirms this really is the Harvester cluster and not some other RKE2 cluster
# that happens to answer on that address.
kube get crd settings.harvesterhci.io >/dev/null 2>&1 ||
  die "${CONTROL_NODE} serves a Kubernetes API with no harvesterhci.io CRDs — this is not the Harvester cluster"

# The authoritative node list comes from the cluster, not from SEED_NODES: node
# name is the hostname (so the etcd static pod is etcd-<name>) and InternalIP is
# the VLAN 20 management address.
NODES_JSON="$(kube get nodes -o json)"
mapfile -t NODE_LINES < <(
  jq -r '.items[]
         | "\(.metadata.name) \(.status.addresses[] | select(.type=="InternalIP") | .address)"' \
    <<<"${NODES_JSON}" || true
)
[[ ${#NODE_LINES[@]} -gt 0 ]] || die "no nodes found"

log "Cluster reports ${#NODE_LINES[@]} node(s):"
for line in "${NODE_LINES[@]}"; do
  echo "      ${line}"
done
# The documented topology is exactly three control-plane nodes. More or fewer is
# not fatal (nodes do get replaced), but it means doc and reality have drifted.
[[ ${#NODE_LINES[@]} -eq 3 ]] ||
  warn "expected 3 nodes per apps/network/harvester.md; found ${#NODE_LINES[@]}"

NOT_READY="$(jq -r '.items[]
  | select(([.status.conditions[] | select(.type=="Ready" and .status=="True")] | length) == 0)
  | .metadata.name' <<<"${NODES_JSON}")"
[[ -z "${NOT_READY}" ]] ||
  die "node(s) not Ready: ${NOT_READY//$'\n'/, } — fix the cluster before shutting it down"

# Checked for every node up front: discovering a broken SSH path to the third
# node after the API is already gone leaves no way to finish the shutdown.
log "Pre-flight: checking SSH and sudo on every node as '${SSH_USER}'"
for line in "${NODE_LINES[@]}"; do
  read -r name ip <<<"${line}"
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${ip}" true >/dev/null 2>&1 ||
    die "cannot SSH to ${name} (${ip}) as ${SSH_USER} — the shutdown would strand this node"
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${ip}" sudo -n true >/dev/null 2>&1 ||
    die "passwordless sudo unavailable for ${SSH_USER} on ${name} (${ip})"
  echo "      ${name} (${ip}) ssh+sudo ok"
done

# "Fully off" is observed by ICMP going silent. If ICMP never worked (blocked by
# firewall policy, or no route because we came in over the mesh rather than the
# LAN), a dead ping would read as "node already down" and the next node would be
# taken down too early — so prove ICMP works now, and degrade explicitly if not.
DOWN_PROBE=ping
for line in "${NODE_LINES[@]}"; do
  read -r name ip <<<"${line}"
  if ! ping "${PING_ARGS[@]}" "${ip}" >/dev/null 2>&1; then
    DOWN_PROBE=ssh
    warn "no ICMP reply from ${name} (${ip}); falling back to an SSH probe plus a ${POWEROFF_GRACE}s settle delay per node"
    break
  fi
done
[[ "${DOWN_PROBE}" == "ping" ]] && log "ICMP works to every node; power-off will be confirmed by ping going silent"

# Longhorn must be quiet. A volume that is attached but not healthy is mid-
# rebuild; powering off now is one of the three documented ways to lose data.
log "Pre-flight: checking Longhorn health"
VOLUMES_JSON="$(kube get volumes.longhorn.io -A -o json)"
UNHEALTHY="$(jq -r '.items[]
  | select(.status.state == "attached")
  | select((.status.robustness // "unknown") != "healthy")
  | "\(.metadata.namespace)/\(.metadata.name) state=\(.status.state) robustness=\(.status.robustness // "unknown")"' \
  <<<"${VOLUMES_JSON}")"
if [[ -n "${UNHEALTHY}" ]]; then
  echo "${UNHEALTHY}" >&2
  die "attached volume(s) are not healthy — wait out the rebuild before shutting down"
fi

LH_NODES_BAD="$(kube get nodes.longhorn.io -A -o json | jq -r '.items[]
  | select(([.status.conditions[]? | select(.type=="Ready" and .status=="True")] | length) == 0)
  | .metadata.name')"
[[ -z "${LH_NODES_BAD}" ]] ||
  die "longhorn node(s) not Ready: ${LH_NODES_BAD//$'\n'/, }"

VOLUME_COUNT="$(jq '.items | length' <<<"${VOLUMES_JSON}")"
log "Longhorn is quiet (${VOLUME_COUNT} volume(s), none rebuilding)"

cat <<EOF

This will SHUT DOWN the entire Harvester cluster:
  driven through ${CONTROL_NODE} (root kubectl over SSH)
  nodes          $(printf '%s ' "${NODE_LINES[@]##* }")
  addons off     ${ADDONS}
  down probe     ${DOWN_PROBE}
  dry run        ${DRY_RUN}

Before continuing, confirm out-of-band (see apps/network/harvester.md):
  * a support bundle has been generated (Support -> Generate Support Bundle) —
    it is the before/after diff if the cluster returns in a strange state
  * the Omada gateway will be up and serving DHCP before the nodes boot again,
    if any node IP is DHCP-reserved rather than truly static
  * you hold a console/IPMI path to each node — once two nodes are down the VIP
    and the API are gone and SSH is the only way back in

EOF

if [[ "${ASSUME_YES}" != "true" && "${DRY_RUN}" != "true" ]]; then
  read -r -p "Type 'shutdown' to power the cluster down: " reply </dev/tty
  [[ "${reply}" == "shutdown" ]] || die "aborted"
fi

# ---------------------------------------------------------------------------
# 1. Stop every VM, guest-side first
# ---------------------------------------------------------------------------

log "Step 1/6: stopping every VirtualMachine (graceful ACPI shutdown)"
VMS_JSON="$(kube get virtualmachines.kubevirt.io -A -o json 2>/dev/null || echo '{"items":[]}')"
VM_COUNT="$(jq '.items | length' <<<"${VMS_JSON}")"

if [[ "${VM_COUNT}" -eq 0 ]]; then
  log "No VirtualMachines defined; nothing to stop"
else
  while read -r ns name strategy; do
    [[ -n "${ns}" ]] || continue
    # KubeVirt rejects a VM carrying both spec.running and spec.runStrategy, and
    # which one a Harvester VM uses depends on when it was created — so patch
    # whichever field the object actually has. Halted is what the UI's "Stop"
    # button sets: ACPI poweroff honouring terminationGracePeriodSeconds, not a
    # kill. No --force / --grace-period=0 anywhere, by design.
    if [[ "${strategy}" == "null" ]]; then
      log "Stopping ${ns}/${name} (spec.running=false)"
      run kube -n "${ns}" patch virtualmachine "${name}" --type merge \
        -p '{"spec":{"running":false}}'
    else
      log "Stopping ${ns}/${name} (spec.runStrategy=Halted, was ${strategy})"
      run kube -n "${ns}" patch virtualmachine "${name}" --type merge \
        -p '{"spec":{"runStrategy":"Halted"}}'
    fi
  done < <(jq -r '.items[] | "\(.metadata.namespace) \(.metadata.name) \(.spec.runStrategy // "null")"' <<<"${VMS_JSON}" || true)
fi

# Gate: no VirtualMachineInstances left. A VMI that lingers means a guest is
# still writing, which is the single most likely cause of data loss here.
log "Waiting up to ${VM_TIMEOUT}s for every guest to power off"
if [[ "${DRY_RUN}" == "true" ]]; then
  echo "    [dry-run] would wait for 'kubectl get vmi -A' to report no resources"
else
  deadline=$((SECONDS + VM_TIMEOUT))
  while :; do
    vmi_json="$(kube get virtualmachineinstances.kubevirt.io -A -o json 2>/dev/null || echo '{"items":[]}')"
    remaining="$(jq -r '[.items[] | "\(.metadata.namespace)/\(.metadata.name)"] | join(" ")' <<<"${vmi_json}")"
    [[ -z "${remaining}" ]] && break
    if ((SECONDS >= deadline)); then
      die "still running after ${VM_TIMEOUT}s: ${remaining}
Shut these guests down from inside (sudo shutdown -h now) and re-run. This
script will not force-stop them: a forced stop risks the guest filesystem
corruption the graceful sequence exists to prevent."
    fi
    sleep 10
  done
  log "All guests are off"
fi

# ---------------------------------------------------------------------------
# 2. Disable the addons holding PVs
# ---------------------------------------------------------------------------
# Note: step 2 of the upstream procedure — breaking the link to an external
# standalone Rancher — does not apply here. Rancher runs as the rancher-vcluster
# addon on this cluster, so it is handled below rather than by scaling the
# cattle-system deployments (which the embedded Rancher would just scale back).

log "Step 2/6: disabling addons that hold PersistentVolumes"
ADDONS_JSON="$(kube get addons.harvesterhci.io -A -o json 2>/dev/null || echo '{"items":[]}')"
DISABLED_ANY=false

for addon in ${ADDONS}; do
  # Look the addon up by name across namespaces rather than hardcoding one
  # (rancher-monitoring lives in cattle-monitoring-system, rancher-vcluster in
  # harvester-system, and that mapping has moved between releases).
  entry="$(jq -r --arg n "${addon}" '.items[]
    | select(.metadata.name == $n)
    | "\(.metadata.namespace) \(.spec.enabled)"' <<<"${ADDONS_JSON}")"
  if [[ -z "${entry}" ]]; then
    log "Addon ${addon} not present; skipping"
    continue
  fi
  read -r ns enabled <<<"${entry}"
  if [[ "${enabled}" != "true" ]]; then
    log "Addon ${ns}/${addon} already disabled"
    continue
  fi
  log "Disabling addon ${ns}/${addon}"
  run kube -n "${ns}" patch addons.harvesterhci.io "${addon}" --type merge \
    -p '{"spec":{"enabled":false}}'
  DISABLED_ANY=true
done

if [[ "${DISABLED_ANY}" == "true" && "${DRY_RUN}" != "true" ]]; then
  log "Waiting up to ${ADDON_TIMEOUT}s for addons to report Disabled"
  deadline=$((SECONDS + ADDON_TIMEOUT))
  while :; do
    pending="$(kube get addons.harvesterhci.io -A -o json | jq -r --arg list "${ADDONS}" '
      ($list | split(" ")) as $want
      | .items[]
      | select(.metadata.name as $n | $want | index($n))
      | select((.status.status // "") | test("Disabled") | not)
      | "\(.metadata.namespace)/\(.metadata.name)=\(.status.status // "?")"' | tr '\n' ' ')"
    [[ -z "${pending// /}" ]] && break
    if ((SECONDS >= deadline)); then
      # Soft timeout: the volume-detach gate below is the authoritative check,
      # so report and fall through to it rather than failing on addon status
      # strings, which have changed names across Harvester releases.
      warn "addons still not Disabled after ${ADDON_TIMEOUT}s: ${pending}"
      break
    fi
    sleep 10
  done
fi

# ---------------------------------------------------------------------------
# 3. HARD GATE: every volume detached
# ---------------------------------------------------------------------------

log "Step 3/6: verifying every Longhorn volume is detached (anti-corruption gate)"
if [[ "${DRY_RUN}" == "true" ]]; then
  echo "    [dry-run] would require every volumes.longhorn.io STATE to be 'detached'"
else
  deadline=$((SECONDS + ADDON_TIMEOUT))
  while :; do
    attached="$(kube get volumes.longhorn.io -A -o json | jq -r '.items[]
      | select(.status.state != "detached")
      | ([.status.kubernetesStatus.workloadsStatus[]?.podName] | join(",")) as $pods
      | "  \(.metadata.name) state=\(.status.state) node=\(.status.currentNodeID // "-") workload=\(if $pods == "" then "-" else $pods end)"')"
    [[ -z "${attached}" ]] && break
    if ((SECONDS >= deadline)); then
      echo "${attached}" >&2
      die "volume(s) still attached after ${ADDON_TIMEOUT}s.
Cutting power before volumes detach is a documented cause of data loss. Find the
workload above still holding each volume, stop it, and re-run."
    fi
    sleep 10
  done
  log "All volumes detached"
fi

# ---------------------------------------------------------------------------
# 4. Identify the etcd leader
# ---------------------------------------------------------------------------

log "Step 4/6: identifying the etcd leader"
ETCD_POD="$(kube -n kube-system get pods -l component=etcd -o json 2>/dev/null |
  jq -r '.items[0].metadata.name // ""' || true)"
if [[ -z "${ETCD_POD}" ]]; then
  # RKE2 runs etcd as a static pod named etcd-<hostname>; fall back to that if
  # the label selector finds nothing.
  read -r first_node _ <<<"${NODE_LINES[0]}"
  ETCD_POD="etcd-${first_node}"
fi

ETCD_TLS="/var/lib/rancher/rke2/server/tls/etcd"
ETCD_STATUS="$(kube exec -n kube-system "${ETCD_POD}" -- env ETCDCTL_API=3 etcdctl \
  endpoint status --cluster -w json \
  --cacert "${ETCD_TLS}/server-ca.crt" \
  --cert "${ETCD_TLS}/server-client.crt" \
  --key "${ETCD_TLS}/server-client.key" 2>/dev/null || true)"

LEADER_IP=""
if [[ -n "${ETCD_STATUS}" ]]; then
  # The member whose own member_id equals the reported leader id is the leader.
  LEADER_ENDPOINT="$(jq -r 'map(select(.Status.header.member_id == .Status.leader)) | .[0].Endpoint // ""' \
    <<<"${ETCD_STATUS}" 2>/dev/null || true)"
  LEADER_IP="$(sed -E 's|^https?://||; s|:[0-9]+$||' <<<"${LEADER_ENDPOINT:-}")"
fi

if [[ -z "${LEADER_IP}" ]]; then
  # Leader-last is about etcd regaining quorum cleanly on the way back up, not
  # about volume data (already safe past step 3). So a failed detection degrades
  # to "pick one and record it" rather than aborting a shutdown this far in.
  read -r _ fallback_ip <<<"${NODE_LINES[-1]}"
  LEADER_IP="${fallback_ip}"
  warn "could not determine the etcd leader from ${ETCD_POD}; treating ${LEADER_IP} as last-to-stop"
fi

LEADER_NAME=""
for line in "${NODE_LINES[@]}"; do
  read -r n i <<<"${line}"
  if [[ "${i}" == "${LEADER_IP}" ]]; then
    LEADER_NAME="${n}"
    break
  fi
done
log "etcd leader: ${LEADER_NAME:-unknown} (${LEADER_IP}) — it stops last and must be powered on FIRST on restart"

# ---------------------------------------------------------------------------
# 5 & 6. Shut down non-leaders one at a time, leader last
# ---------------------------------------------------------------------------

node_is_up() {
  local ip="$1"
  if [[ "${DOWN_PROBE}" == "ping" ]]; then
    ping "${PING_ARGS[@]}" "${ip}" >/dev/null 2>&1
  else
    ssh "${SSH_OPTS[@]}" "${SSH_USER}@${ip}" true >/dev/null 2>&1
  fi
}

wait_until_down() {
  local name="$1" ip="$2"
  if [[ "${DRY_RUN}" == "true" ]]; then
    echo "    [dry-run] would wait for ${name} (${ip}) to stop answering (${DOWN_PROBE})"
    return 0
  fi
  log "Waiting up to ${NODE_DOWN_TIMEOUT}s for ${name} (${ip}) to reach full power-off"
  local deadline=$((SECONDS + NODE_DOWN_TIMEOUT))
  while node_is_up "${ip}"; do
    if ((SECONDS >= deadline)); then
      die "${name} (${ip}) still responds after ${NODE_DOWN_TIMEOUT}s — check it on the console before taking the next node down"
    fi
    sleep 5
  done
  if [[ "${DOWN_PROBE}" != "ping" ]]; then
    # sshd stops answering well before the disks are flushed and the board is
    # off, so without ICMP the only safe move is to wait out a fixed margin.
    log "${name} stopped answering SSH; waiting ${POWEROFF_GRACE}s for it to finish powering off"
    sleep "${POWEROFF_GRACE}"
  fi
  log "${name} is down"
}

shutdown_node() {
  local name="$1" ip="$2"
  log "Shutting down ${name} (${ip})"
  # run_tolerant: the connection dies with the node, so the exit status says
  # nothing. wait_until_down is the real check.
  run_tolerant ssh "${SSH_OPTS[@]}" "${SSH_USER}@${ip}" sudo -n shutdown -h now
  wait_until_down "${name}" "${ip}"
}

log "Step 5/6: shutting down the non-leader nodes, one at a time"
for line in "${NODE_LINES[@]}"; do
  read -r name ip <<<"${line}"
  [[ "${ip}" == "${LEADER_IP}" ]] && continue
  shutdown_node "${name}" "${ip}"
done

log "Step 6/6: shutting down the etcd leader last"
for line in "${NODE_LINES[@]}"; do
  read -r name ip <<<"${line}"
  [[ "${ip}" == "${LEADER_IP}" ]] || continue
  shutdown_node "${name}" "${ip}"
done

cat <<EOF

==> Harvester cluster is fully down. It is now safe to cut rack power.

Record for the restart (apps/network/harvester.md, "Restart"):
  etcd leader           ${LEADER_NAME:-unknown} (${LEADER_IP})  <- power this on FIRST, alone, ~3 min
  addons to re-enable   ${ADDONS}

Restart order: network (Omada switch + gateway, LACP converged, DHCP/DNS) ->
etcd leader alone -> the other two nodes -> verify the control plane and the
Mellanox storage fabric -> re-enable the addons -> start VMs in batches.
EOF
