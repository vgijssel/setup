# Harvester HA Cluster — Configuration Reference

3-node Harvester HCI cluster (**1.8.2**) deployed on VLAN 20 (Servers,
`192.168.20.0/24`).

Two physical fabrics: management and VM networks run over the Omada LAG on VLAN
20, while Longhorn replication, live migration and RWX volume traffic run over a
switchless Mellanox 25G mesh — see "Storage & Live Migration Fabric" below.

## Network Placement

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| VLAN | 20 (Servers) | Per network.md: servers live on VLAN 20 |
| Subnet | `192.168.20.0/24` | Standard `192.168.<vlan>.0/24` scheme |
| Gateway | `192.168.20.1` | Omada gateway SVI |
| DNS | `192.168.20.1` | Gateway forwards upstream |
| NTP | `pool.ntp.org` | Or gateway if it serves NTP |

## IP Assignments

Reserved below the DHCP pool (`.100`–`.199`), static or DHCP-reserved by MAC:

| Role | Hostname | IP | Switch LAG | Notes |
|------|----------|-----|------------|-------|
| Node 1 | `illusion` | `192.168.20.10` | LAG 1 | |
| Node 2 | `the-dome` | `192.168.20.11` | LAG 2 | |
| Node 3 | `the-toy-factory` | `192.168.20.12` | LAG 3 | |
| Cluster VIP | — | `192.168.20.9` | — | Management VIP — must NOT be assigned to any node |

## Cluster Configuration

| Parameter | Value |
|-----------|-------|
| Cluster token | *(generate a random ASCII string at deploy time)* |
| Management VIP | `192.168.20.9` |
| Nodes | `illusion`, `the-dome`, `the-toy-factory` |
| Node IPs | `192.168.20.10`, `192.168.20.11`, `192.168.20.12` |
| DNS servers | `192.168.20.1` |
| NTP servers | `pool.ntp.org` |
| Proxy | None (direct internet via gateway) |
| Management interface VLAN ID | **Not specified** — left empty in the installer; untagged, inherits LAG PVID 20 |
| SSH authorized keys | `https://github.com/mvgijssel.keys` |

## SSH Access

Public keys come from GitHub rather than being pasted per node:

```
https://github.com/mvgijssel.keys
```

In the installer's SSH keys prompt, enter that URL. In a config file, use the
`github:` shorthand — it resolves to exactly the same URL:

```yaml
os:
  ssh_authorized_keys:
    - "github:mvgijssel"
```

Notes:
- Keys are installed for the default `rancher` user.
- The list is fetched **at install time** and baked into the node. Adding or
  removing a key on GitHub later does not propagate to installed nodes — update
  `os.ssh_authorized_keys` on the running cluster for that.
- The fetch needs working DNS and outbound HTTPS at install time, i.e. the same
  VLAN 20 → gateway path that NTP uses. If NTP resolution fails, key fetch fails too.

## Switch Port Profile — Omada LAG (Active LACP)

Each node's NICs are bonded to the Omada switch as a **LAG group with Active
LACP** (802.3ad, dynamic). One LAG group per node:

| Node | LAG group | Harvester bond mode |
|------|-----------|---------------------|
| `illusion` | LAG 1 | `802.3ad` (LACP) |
| `the-dome` | LAG 2 | `802.3ad` (LACP) |
| `the-toy-factory` | LAG 3 | `802.3ad` (LACP) |

Omada configuration (Site → Devices → Switch → LAG):
- **Type**: LAG (LACP) — *Active*, not Static
- **Members**: the ports for that single node only (never mix nodes in one LAG)
- **Profile**: VLAN 20 untagged (PVID 20) on the LAG interface

Harvester side (installer network stage / `harvester-installer` config):
- Bond mode `802.3ad`, all management NICs as slaves
- **VLAN ID: not specified.** The installer's management-interface VLAN ID is
  optional and we deliberately leave it empty — the interface stays untagged and
  inherits VLAN 20 from the LAG's PVID.

Why we don't set the installer VLAN ID:
- **One source of truth.** The VLAN is defined once, in Omada (LAG PVID 20).
  Setting it in the installer as well means two places must agree; a mismatch
  costs management reachability and a console/IPMI trip to fix.
- **Install-time consistency.** ISO/PXE boot talks untagged before any installer
  config applies, so boot, DHCP, install and post-install management all behave
  identically on an untagged PVID.
- **Hard to change later.** The management interface (including its VLAN ID) is
  fixed at install; moving the management VLAN afterwards is a reinstall, not a
  live reconfiguration. Fewer variables baked in is better.
- **Costs nothing.** Tagged VM networks come from the Harvester
  ClusterNetwork/VLAN config, not the management interface — the same LAG can
  carry VLAN 20 untagged for management plus other VLANs tagged for VMs.

Set it only if the LAG becomes a pure tagged trunk with no native VLAN, or if
management must live on a VLAN other than the LAG's PVID. Neither applies today.
If that changes, both ends move together: `vlan_id: 20` in the installer **and**
VLAN 20 as a tagged member with no untagged/native VLAN on the Omada LAG —
changing only one side locks you out of management.

Notes:
- Both ends must agree: Active LACP on the switch requires `802.3ad` on the node.
  A mismatch (e.g. switch Active LACP vs node `active-backup`) leaves the LAG
  blocking/flapping.
- Management itself needs no trunking — inter-VLAN traffic routes through the
  Omada gateway per firewall policy. **VM networks do:** add VLANs 30
  (Automation/HAOS), 70 (Media) and 80 (Shared Services) as *tagged* members of
  the same LAG rather than adding separate access ports. Each becomes a Harvester
  ClusterNetwork/VLAN that guests attach to, while VLAN 20 stays untagged for
  node management.

## Storage & Live Migration Fabric — Mellanox 25G Mesh

Each node has a dual-port 25 GbE Mellanox card. The six ports are cabled **node
to node in a full mesh** — no switch is involved, so every pair of nodes has
exactly one dedicated cable:

| Cable | Between |
|-------|---------|
| 1 | `illusion` ↔ `the-dome` |
| 2 | `the-dome` ↔ `the-toy-factory` |
| 3 | `illusion` ↔ `the-toy-factory` |

This fabric carries **east-west traffic only**. It has no gateway, no DHCP and no
path off the three nodes, which is why only Longhorn replication, live migration and
RWX volume traffic live here — see "What does not belong on the mesh" below. Anything
whose client might sit outside these three nodes does not qualify, which is the whole
constraint behind guest-cluster RWX.

### Harvester objects

| Object | Value |
|--------|-------|
| ClusterNetwork | `storage` |
| VlanConfig uplink NICs | both Mellanox ports on each node |
| Bond mode | **`broadcast`** (see below) |
| MTU | 9000 (jumbo) — must be identical across every VlanConfig of this cluster network |
| Host interfaces created | bridge `storage-br`, bond `storage-bo` |

Notes:
- Harvester models an uplink as *one NIC or one bond*, and the VlanConfigs of a
  cluster network must together cover **every** node — the storage-network webhook
  refuses to apply otherwise. A single cluster-wide VlanConfig named `storage`
  suffices here because the two Mellanox ports enumerate identically on all three
  nodes; if that ever stops being true, split it into one VlanConfig per node.
- The NAD Harvester generates for these settings has **no `mtu` key**, so the pod
  side inherits the bridge MTU. The VlanConfig declaring 9000 is therefore not
  proof of jumbo frames end to end — check the hosts (`ip link show storage-br`)
  and a `ping -M do -s 8972` between two pods on the network.

### Bond mode must be `broadcast`

A bond normally assumes all its member ports reach the same L2 domain. Here the
two ports reach *different peers*, so every other mode is broken:

| Mode | Why it fails on a switchless mesh |
|------|-----------------------------------|
| `active-backup` | only the active port carries traffic → one peer unreachable |
| `802.3ad` (LACP) | cannot negotiate a single LAG with two different partners |
| `balance-xor` / `balance-rr` / `balance-tlb` / `balance-alb` | hashes or round-robins frames onto whichever cable, so a share of them arrive at the wrong node and are dropped |
| `broadcast` | ✅ sends every frame out **both** ports; the peer it wasn't addressed to discards it |

`broadcast` is loop-free without STP because a bond does not forward between its
own members, and a Linux bridge never sends a frame back out its ingress port.
Costs: per-node egress caps at ~25 Gb/s because every frame is duplicated, and
each node also receives every frame meant for the third node and discards it — so
mesh-NIC rx counters read higher than the traffic actually addressed to that node,
and drop counters may tick. Expected, not a fault.

This is deliberately the opposite of the management NICs, which are `802.3ad` into
an Omada LAG (previous section). Two fabrics, two bond modes, for different
reasons.

### Networks on the fabric

`storage-network` and `vm-migration-network` reuse the **same** cluster network with
different VLAN IDs and non-overlapping CIDRs. Harvester's webhook only rejects
overlapping IP *ranges*, so sharing `storage` is supported; separate VLANs keep the
broadcast domains and per-traffic-type `tcpdump`/counter output readable.

`rwx-network` is the exception: it runs in **share mode**, reusing
`storage-network`'s VLAN *and* range rather than taking a third VLAN of its own. Its
alternative ("Dedicated Network") would need another VLAN and CIDR and buys nothing
here — RWX and replication already contend for the same ~25 Gb/s per node, and a
dedicated range would be a second thing to size. Share mode also means enabling it
needs **no change to `storage-network`**, which is what keeps it a zero-downtime
operation (see "Applying and changing").

| Setting | VLAN | Range | Carries | Pod interface |
|---------|-----:|-------|---------|---------------|
| `storage-network` | 100 | `172.16.100.0/24` | Longhorn engine ↔ replica replication | `lhnet1` on `instance-manager` pods |
| `vm-migration-network` | 101 | `172.16.101.0/24` | KubeVirt live-migration memory pages | `migration0` on `virt-handler` pods |
| `rwx-network` | 100 | `172.16.100.0/24` (**shares** `storage-network`) | RWX NFS: mount client ↔ `share-manager` | `lhnet2` on `longhorn-csi-plugin`; a storage-network IP per `share-manager` pod |

```yaml
apiVersion: harvesterhci.io/v1beta1
kind: Setting
metadata:
  name: storage-network
value: '{"vlan":100,"clusterNetwork":"storage","range":"172.16.100.0/24"}'
---
apiVersion: harvesterhci.io/v1beta1
kind: Setting
metadata:
  name: vm-migration-network
value: '{"vlan":101,"clusterNetwork":"storage","range":"172.16.101.0/24"}'
---
apiVersion: harvesterhci.io/v1beta1
kind: Setting
metadata:
  name: rwx-network
value: '{"share-storage-network":true}'
```

Every network on this fabric follows `172.16.<vlan>.0/24` — the third octet **is**
the VLAN ID, so a stray address in a `tcpdump` or a pod annotation identifies its
VLAN without a lookup. Any new network on the fabric takes the next free VLAN from
102 upwards and the matching range.

Get this right before the first apply: changing a configured storage range means
stopping every VM in the cluster (see "Applying and changing"), so renumbering for
cosmetics later is not worth the outage.

VLANs 100/101 exist **only inside the `storage` cluster network**, on the direct
cables. They must never be configured on the Omada switch, and therefore cannot
collide with the home VLAN scheme (10–90) in network.md.

#### Addressing rules

- `172.16.0.0/12`, not `192.168.x`: the PiKVM advertises `192.168.0.0/16` into the
  NetBird mesh (network.md), so a `192.168.x` storage subnet would be shadowed by
  that route for every mesh client.
- Must not overlap Harvester's own CIDRs: `10.42.0.0/16`, `10.43.0.0/16`,
  `10.52.0.0/16`, `10.53.0.0/16`.
- Prefix must be `/16` or longer. Both use a `/24` so adding nodes or disks never
  runs into the sizing floor below.

#### Range sizing (webhook-enforced minimums)

| Setting | Minimum usable IPs |
|---------|--------------------|
| `storage-network` alone | `(nodes × 2) + (disks × 2)` + concurrent image uploads/downloads |
| `storage-network` with `rwx-network` sharing it | `(nodes × 3) + (disks × 2)` + uploads/downloads + **32** |
| `vm-migration-network` | `1 per non-witness node` |

These are cluster-wide totals, not per-node. The trailing **32** is a fixed buffer for
future RWX volumes, not a per-node figure. Share mode is enabled, so the second row
applies: 3 nodes with 9 disks need `9 + 18 + 32 ≈ 61` of the 254 usable addresses in
`172.16.100.0/24` — roughly 4× headroom, which is why adding disks needs no range
change.

Undersizing surfaces later rather than at apply time: `instance-manager` /
`backing-image-manager` / `longhorn-csi-plugin` / `virt-handler` pods fail to start on
a *newly added* node or disk once the range is exhausted.

#### RWX volumes — share mode and its consumers

Longhorn serves an RWX volume by running a `share-manager` pod that exports it over
NFS; in share mode that NFS endpoint lives on `172.16.100.0/24`. **Whoever mounts the
volume must therefore be able to reach the mesh**, and the mesh is a dead end with no
gateway. That splits cleanly into two cases:

| Consumer | Works? | Requirement |
|----------|--------|-------------|
| Harvester-side / in-cluster pods | ✅ out of the box | `longhorn-csi-plugin` performs the mount and holds `lhnet2` on the storage network |
| Guest Kubernetes cluster via `harvester-csi-driver` | ⚠️ only with extra config | the *guest VM* mounts the NFS export itself, so it needs a **second NIC** on a VM network using cluster network `storage` + VLAN 100, with a **manually assigned** `172.16.100.x` address |

For the guest case, three things are load-bearing:

- **Reserve the guest IPs with `exclude` on `storage-network`.** Guest addresses are
  hand-assigned while Whereabouts hands out the rest of the range, so without an
  `exclude` the two collide.
- **MTU 9000 on the guest NIC.** Same L2, no router — a mismatch black-holes large
  frames silently instead of triggering PMTUD.
- **Pin those VMs to these three nodes.** The fabric has no path off `illusion`,
  `the-dome` and `the-toy-factory`.

**Sequencing trap:** adding `exclude` is a change to the **`storage-network`** setting,
which costs every-VM-stopped (table below). Enabling `rwx-network` costs nothing.
So if guest-cluster RWX is ever wanted, decide the `exclude` block during a window
where VMs are already down — deciding it later is a full-cluster outage for a
one-line edit.

No RWX volumes exist yet; this is the network groundwork for them.

### Applying and changing

| Setting | Prerequisite | Impact |
|---------|-------------|--------|
| `storage-network` | **every VM stopped**, no attached Longhorn volume, no in-flight image upload/download | restarts Longhorn pods plus Prometheus/Grafana/Alertmanager and the VM-import controller; workloads stay down until VMs are started by hand |
| `vm-migration-network` | no migration in progress — VMs may keep running | KubeVirt restarts all `virt-handler` pods; running VMs unaffected |
| `rwx-network` (share mode) | `storage-network` already `configured=True`; no attached non-migratable RWX volume. **VMs may keep running** | restarts every `longhorn-csi-plugin` pod, so VM disk provisioning, volume attach/detach and **live migration** are disrupted until they settle. Do not overlap with rolling node maintenance — one, wait for green, then the other |

Harvester drives Longhorn's `endpoint-network-for-rwx-volume` from `rwx-network`.
Never set the Longhorn setting directly.

Configure all three from **Advanced → Settings** in the UI where possible; it fills
in the JSON and runs the same webhook — `rwx-network` in particular is a two-click
"Share Storage Network" choice there. Revert `storage-network` /
`vm-migration-network` by clearing `value`; revert `rwx-network` to
`{"share-storage-network":false}`, which sends RWX traffic back to the pod network.

### Verification

```bash
# all three settings report configured=True
kubectl get settings.harvesterhci.io storage-network vm-migration-network rwx-network -o yaml

# every node's VlanStatus is Ready, and the uplink is the broadcast bond
kubectl get vlanstatus
kubectl get vlanconfig -o custom-columns='NAME:.metadata.name,CN:.spec.clusterNetwork,NICS:.spec.uplink.nics,BOND:.spec.uplink.bondOptions.mode,MTU:.spec.uplink.linkAttributes.mtu'

# replication really uses 172.16.100.x — this map is where each engine dials replicas
kubectl -n longhorn-system get engines.longhorn.io -o json \
| jq -r '.items[] | "\(.metadata.name) node=\(.spec.nodeID)\n  \(.status.currentReplicaAddressMap)"'

# migration pods hold a 172.16.101.x address
kubectl -n harvester-system get pods -l kubevirt.io=virt-handler -o json \
| jq -r '.items[] | "\(.spec.nodeName) \(.metadata.annotations["k8s.v1.cni.cncf.io/network-status"] | fromjson | map(select(.interface=="migration0")) | .[0].ips[0] // "NO-IP")"'

# RWX share mode took effect: every csi-plugin pod has lhnet2 on 172.16.100.x
kubectl -n longhorn-system get pods -l app=longhorn-csi-plugin -o json \
| jq -r '.items[] | "\(.spec.nodeName) \(.metadata.annotations["k8s.v1.cni.cncf.io/network-status"] | fromjson | map(select(.interface=="lhnet2")) | .[0].ips[0] // "NO-IP")"'
```

Because each node pair is its own cable, **validate all three pairs** after any
cabling or bond change — a dead link stays invisible until those two specific
nodes must talk. Attach a pod to the storage NAD on each node and run
`iperf3 -P 8` across every pair; expect 22–24 Gb/s at MTU 9000. A successful live
migration proves only the one pair it ran on.

### What does not belong on the mesh

| Traffic | Where it stays | Why |
|---------|---------------|-----|
| VM guest networks | Omada LAG, VLANs 30/70/80 | guests need the gateway; the mesh is a dead end |
| Node management, etcd, RKE2, API VIP | VLAN 20 untagged on the LAG | fixed at install and needs the gateway |
| Backup target (S3) | VLAN 20 | internet-bound; no Harvester setting moves it |
| Longhorn control plane, CSI | pod network | not movable, negligible volume |
| RWX volume traffic | **on the mesh** — `rwx-network` share mode, VLAN 100 | the one exception in this table: deliberately moved off the pod network. Guest-cluster consumers need a second NIC on VLAN 100 — see "RWX volumes — share mode and its consumers" |

### Failure modes

- **One dead cable isolates one node *pair*.** Nothing forwards through the third
  node, so replicas on that pair go degraded and migrations between them time out
  (the source VM keeps running). The other two pairs are unaffected. With RWX in
  share mode this also reaches workloads: a client on one end of the dead cable and
  the `share-manager` on the other means the NFS mount hangs rather than errors, so
  the symptom is a wedged pod, not a failed one.
- **No QoS between storage, migration and RWX.** All three share one ~25 Gb/s egress
  budget per node and Harvester does no shaping, so a large migration can slow a
  concurrent Longhorn rebuild or RWX I/O. Acceptable at 25 GbE; it would not be at
  1 GbE.
- **`rwx-network` changes bounce the CSI plugin.** Toggling it restarts every
  `longhorn-csi-plugin` pod, and Longhorn has to re-establish each RWX NFS mount
  afterwards. Treat it as a maintenance-window change even though VMs keep running.
- **A fourth node needs a third port per node.** A full mesh of _n_ nodes needs
  _n-1_ ports each, so 3 nodes is the ceiling for a dual-port card. Growing past
  that means a 25G switch — and then the bond mode changes to `802.3ad`.

## Graceful Shutdown & Restart

For rack maintenance or a planned power-down of the whole cluster. Harvester has
**no one-button cluster shutdown** — the sequence below is the manual reverse of
install order, adapted from the upstream KB (see References) to this cluster: all
three nodes are control-plane, there are no worker or witness nodes, and the
storage network lives on the switchless mesh.

Do **not** use Maintenance Mode for a full shutdown. It drains one node into the
other two and needs at least two active nodes; with all three going down it has
nowhere to migrate to and only adds churn. Maintenance Mode is for taking *one*
node out, e.g. a single-node firmware update.

### What actually causes data loss

Only three things, in order of likelihood:

| Cause | Prevented by |
|-------|--------------|
| Powering off with VMs still running — controllers retry onto the last nodes standing while Longhorn rebuilds replicas onto shrinking capacity | shutdown steps 1 and 4 |
| Powering off mid-rebuild, while a volume is `degraded` | the pre-flight health check |
| Cutting power before volumes detach | shutdown step 4 (the hard gate) |

Leader-last / leader-first (steps 5–7) is about etcd regaining quorum cleanly, not
about volume data — getting it wrong risks etcd surgery on the way back up, not
corrupt disks.

### Pre-flight

```bash
# 1. Longhorn must be quiet: every volume healthy, never degraded/rebuilding
kubectl -n longhorn-system get volumes.longhorn.io -A \
  -o custom-columns='NAME:.metadata.name,STATE:.status.state,ROBUSTNESS:.status.robustness'
kubectl -n longhorn-system get nodes.longhorn.io
```

- Wait out any rebuild before continuing.
- Generate a support bundle (Support → Generate Support Bundle). It is the
  before/after diff if the cluster returns in a strange state.
- Confirm whether node IPs are truly static or DHCP-reserved by MAC (see "IP
  Assignments"). If reserved, the Omada gateway **must** be up and serving DHCP
  before the nodes boot, or management and the VIP come back wrong.
- Keep a kubeconfig usable from outside the VIP (`/etc/rancher/rke2/rke2.yaml` on
  any node) and an SSH or IPMI session open on the last node — once two nodes are
  down, the VIP and the API are gone.

### Shutdown

**1. Stop every VM, guest-side first.** `sudo shutdown -h now` inside each guest,
then confirm `Off` in the UI and press Stop on any straggler. Gate:

```bash
kubectl get vmi -A      # must report "No resources found"
```

**2. Break the external Rancher link** — only if this cluster is imported into a
standalone Rancher; skip for embedded Rancher. Scaling `cattle-cluster-agent`
alone does not work, the embedded Rancher scales it back up:

```bash
kubectl edit deployment -n cattle-system rancher   # record, then blank: management.cattle.io/scale-available: ""
kubectl scale deployment -n cattle-system rancher --replicas=0
kubectl scale deployment -n cattle-system cattle-cluster-agent --replicas=0
```

**3. Disable addons holding PVs** — chiefly `rancher-monitoring`
(Prometheus/Grafana PVCs), plus `rancher-logging` and anything else enabled. Wait
for status `Disabled` on each:

```bash
kubectl edit addons.harvesterhci.io -n cattle-monitoring-system rancher-monitoring   # enabled: false
```

**4. Verify every volume is detached.** This is the anti-corruption gate — do not
proceed past a volume that is still attached:

```bash
kubectl get volumes.longhorn.io -A      # every STATE must be "detached"
```

**5. Identify the etcd leader.** Pod names are `etcd-<hostname>`:

```bash
kubectl exec -n kube-system etcd-illusion -- env ETCDCTL_API=3 etcdctl \
  endpoint status --cluster -w table \
  --cacert /var/lib/rancher/rke2/server/tls/etcd/server-ca.crt \
  --cert /var/lib/rancher/rke2/server/tls/etcd/server-client.crt \
  --key /var/lib/rancher/rke2/server/tls/etcd/server-client.key
```

**Write down which node reports `IS LEADER = true`** — step 7 and restart step 2
both depend on it.

**6. Shut down the two non-leader nodes**, one at a time, waiting for each to
reach full power-off before starting the next: `sudo shutdown -h now`.

**7. Shut down the leader last.** The cluster is down at this point; only now cut
rack power.

### Restart

**1. Network first.** Omada switch and gateway up, LACP converged on all three
LAGs, DHCP and DNS serving — *before* any node boots. The Mellanox mesh needs
nothing (direct cables, no switch), but a half-converged management LAG at boot
means nodes that cannot form etcd quorum.

**2. Power on the etcd leader node first** (from shutdown step 5) and give it ~3
minutes alone. etcd connection errors in its logs are expected while it is the
only member up.

**3. Power on the remaining two nodes**, then verify the control plane:

```bash
kubectl get nodes                             # all three Ready — can take ~15 min
kubectl get svc -n kube-system ingress-expose # EXTERNAL-IP must be 192.168.20.9
kubectl get pods -A | grep -Ev 'Running|Completed'
```

**Stop and fix any failing `longhorn-system` pod before continuing** — every
later step depends on Longhorn for persistent volumes.

**4. Verify the storage fabric came back.** A single dead mesh cable stays
invisible until those two specific nodes must talk, so run the full block under
"Verification" above: all three settings `configured=True`, `vlanstatus` Ready on
every node, `instance-manager` pods holding `172.16.100.x` on `lhnet1`,
`virt-handler` on `172.16.101.x`, and every `longhorn-csi-plugin` pod holding
`lhnet2` — without it, volume attach and live migration fail later rather than
now. If any cable was disturbed during the maintenance, re-run the `iperf3` sweep
across all three pairs; a single successful live migration only proves one pair.

**5. Re-enable the addons** disabled in shutdown step 3 (`enabled: true`, wait for
`DeploySuccessful`), and restore Rancher if step 2 applied:

```bash
kubectl edit deployment -n cattle-system rancher   # restore the recorded scale-available value
kubectl scale deployment -n cattle-system rancher --replicas=3
kubectl get deployment -n cattle-system cattle-cluster-agent   # auto-scales back
```

**6. Start VMs in batches**, not all at once — a simultaneous start storms
Longhorn with attach and rebuild work.

**7. Generate a second support bundle** and diff it against the pre-shutdown one.

### References

- [Shutdown and Restart a Harvester Cluster](https://harvesterhci.io/kb/shutdown_and_restart_a_harvester_cluster/)
  — upstream procedure. Last revised mid-2024, so it predates 1.8; the addon list
  and etcd pod naming are worth re-checking against the live cluster before a run.
- [Host Management](https://docs.harvesterhci.io/v1.8/host/) — Maintenance Mode
  and the `harvesterhci.io/maintain-mode-strategy` label, for single-node work.

## Firewall Considerations

Per network.md firewall policy:
- Trusted (VLAN 40) can initiate connections to Servers (VLAN 20) — admin access
- Harvester management UI reachable from Trusted clients at `https://192.168.20.9`
- Servers (VLAN 20) has **no IoT exception and no mDNS repeater**. HAOS lives on
  Automation (VLAN 30) precisely so the hypervisor management plane does not
  inherit the IoT-facing allows that Home Assistant needs.

## Troubleshooting

### Install fails at `Configure network failed: exit status 1`

Affects **1.9.0 and 1.8.2**, on every node, in every bond mode, on every retry.
The network config the installer writes is *correct* — the node answers ping on
its static IP a couple of seconds after the error appears. Only the installer's
readiness check is wrong, so nothing on the Omada side needs touching.

`UpdateManagementInterfaceConfig` (`pkg/config/cos.go`) runs:

```
nmcli networking off → nmcli connection reload → nmcli networking on → nm-online -x
```

`nmcli networking on` returns when its D-Bus `Enable(TRUE)` call returns, not when
devices start activating, so NetworkManager is still `ASLEEP`/`DISCONNECTED` when
`nm-online` is invoked. `-x` (`exit_no_nm`) makes it bail the instant the state is
neither `CONNECTING` nor `CONNECTED_*` instead of waiting — it never gives the
bond+bridge stack the ~5 s it needs and returns `EXIT_FAILURE_OFFLINE` (= 1). The
installer wraps that as a bare `exit status 1` and discards the real output.
Upstream hits this <10% of the time; this hardware loses the race every time.

Fix — shim `nm-online` to behave like the upstream patch. `Ctrl+Alt+F2`, log in
`rancher`/`rancher`:

```bash
cp /usr/bin/nm-online /tmp/nm-online.real
printf '#!/bin/sh\nexec /tmp/nm-online.real -s -t 100\n' > /tmp/nm-online
chmod +x /tmp/nm-online
mount --bind /tmp/nm-online /usr/bin/nm-online
nm-online -x; echo "rc=$?"     # must return 0 without exiting instantly
```

`Ctrl+Alt+F1` back and re-submit the network page. **Verified working on 1.9.0.**

Notes:
- `mount --bind` rather than editing in place because `/usr` is read-only. Binding
  the absolute path also covers the installer's `exec.Command("nm-online", …)`
  whatever its `PATH`, and takes effect immediately — no installer restart.
- `-s` waits for NM *startup completion* rather than connectivity, which is the
  signal that actually matters here. `-t 100` leaves a slow-rate LACP bond room for
  three 30 s LACPDU intervals.
- Reproduce on demand with the installer's own sequence — a bare `nm-online -x` at
  the prompt always reports `[online]` because NM has long since settled, so it is
  *not* a test of the failing condition:

  ```bash
  nmcli networking off; nmcli connection reload; nmcli networking on; nm-online -x; echo "rc=$?"
  ```

  → `30s [offline]`, rc 1. The printed number is the timeout **remaining**, so
  `30s` proves it never waited; `0s` would mean it genuinely timed out. After the
  shim the same sequence reports `[started]` rc 0 — `-s` changes the result string
  from `online`/`offline` to `started`/`startup-pending`.
- Needed once per node, per install, until the fix ships. Not in 1.9.0.
- Only the interactive network page is affected on an ISO install: `doInstall`
  applies the same config with `applyConfig=false`, which never calls `nm-online`,
  and the other `applyConfig=true` call site (`configureInstalledNode`) is gated on
  `alreadyInstalled` — the pre-installed-image path. A PXE/automatic install runs
  the same TUI code, so there the shim has to be baked into the boot environment
  rather than typed on tty2.
- The installer logs the real command output to `/var/log/console.log` before
  discarding it — first place to look for any *other* `exit status 1` at this step.
  The only other candidates are `hostnamectl hostname <name>` (which runs before
  any network config, despite the error naming the network) and the three `nmcli`
  calls. It lives on tmpfs, so capture it before rebooting.

References:
- [harvester#11662](https://github.com/harvester/harvester/issues/11662) — this bug on 1.9.0/1.8.2
- [harvester#10885](https://github.com/harvester/harvester/issues/10885) — root cause
- [harvester#11690](https://github.com/harvester/harvester/pull/11690) — the fix (`nm-online -s -t 100`, non-fatal); open against `master`, no 1.9 backport as of 2026-09-24
