#!/usr/bin/env bash
# Start the control (base) cluster: create (or reconnect to) the standalone
# "control" cluster on vind (vcluster docker driver) and helm-install KubeVela
# (vela-core + terraform-controller) into its root.
#
# This is the ONE imperative bootstrap step of the whole platform (SPEC §3.4/§4):
# after this, everything — the secret/network child vclusters, their platform,
# workloads, Terraform, and one-off bootstrap ordering — is KubeVela objects
# (Applications/Components/Workflows) applied by `control:up`.
#
# The root KubeVela manages the `local` cluster and, once children exist, reaches
# them DIRECTLY over the in-cluster control path (cluster-gateway) — the tailnet is
# never part of the control path.
#
# Charts are vendored + pinned under third_party/vendir/charts (see vendir.yml):
#   - vela-core (git chart source @ v1.11.0)          -> vela-core + cluster-gateway
#   - terraform-controller (git chart source @ v0.8.0)
# Image tags are pinned via the values overrides in src/kubevela (the upstream
# charts default to :latest, which CLAUDE.md forbids).
#
# Idempotent: creates the cluster or reconnects; helm upgrade --install for charts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHARTS_DIR="${REPO_ROOT}/third_party/vendir/charts"
KUBEVELA_DIR="${SCRIPT_DIR}/../src/kubevela"

CLUSTER_NAME="${CONTROL_CLUSTER_NAME:-control}"
VELA_NS="${VELA_NAMESPACE:-vela-system}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vcluster
require kubectl
require jq
require helm

# ── Create (or reconnect to) the base vind cluster ──────────────────────────
# vind uses the docker driver: a standalone vcluster in its own Docker container
# rather than nested inside a host cluster. Selecting the driver is a global,
# idempotent CLI setting and scopes the subsequent listing to vind.
echo "==> Selecting the docker driver (vind)"
vcluster use driver docker >/dev/null 2>&1 || true

# `vcluster list --output json` reports docker-driver clusters with capitalised
# keys (.Name / .Status), so match on .Name.
if vcluster list --output json 2>/dev/null |
  jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .Name == $n)' >/dev/null 2>&1; then
  echo "==> vcluster '${CLUSTER_NAME}' already exists; connecting"
  vcluster connect "${CLUSTER_NAME}"
else
  echo "==> Creating vind cluster '${CLUSTER_NAME}' (docker driver)"
  vcluster create "${CLUSTER_NAME}" --driver docker --connect
fi

# The node object registers a few seconds after connect, so poll for it before
# `kubectl wait` (which errors with "no matching resources" against an empty set).
echo "==> Waiting for the node to register"
for _ in $(seq 1 60); do
  if kubectl get nodes -o name 2>/dev/null | grep -q .; then break; fi
  sleep 2
done

echo "==> Waiting for the node to become Ready"
kubectl wait --for=condition=Ready nodes --all --timeout=180s

# ARCH: vela-core, cluster-gateway and kube-webhook-certgen are genuine multi-arch
# images. terraform-controller is NOT — upstream's Dockerfile hardcodes
# GOARCH=amd64, so every arch in its "multi-arch" manifest is an amd64 binary. On
# an arm64 host that image dies with "exec format error", and it cannot be
# qemu-emulated either (Go+qemu `lfstack.push` fatal error). So on arm64 we build
# a genuine arm64 image from the pinned source (apps/control/images/…) and import
# it into the vind node's containerd; the helm install below then points at it.
# On amd64 (incl. real prod) the upstream image (values default, pinned by digest)
# is used directly and this block is skipped. Idempotent.
TFCTRL_HELM_ARGS=()
HOST_ARCH="$(uname -m)"
if [[ "${HOST_ARCH}" = "arm64" ]] || [[ "${HOST_ARCH}" = "aarch64" ]]; then
  TFCTRL_LOCAL_IMAGE="terraform-controller:v0.8.0-arm64"
  NODE_CONTAINER="vcluster.cp.${CLUSTER_NAME}"
  echo "==> arm64 host: building native terraform-controller image (${TFCTRL_LOCAL_IMAGE})"
  docker build --platform linux/arm64 --build-arg TARGETARCH=arm64 \
    -t "${TFCTRL_LOCAL_IMAGE}" \
    -f "${SCRIPT_DIR}/../images/terraform-controller/Dockerfile" \
    "${SCRIPT_DIR}/../images/terraform-controller"
  echo "==> Importing ${TFCTRL_LOCAL_IMAGE} into the vind node (${NODE_CONTAINER}) containerd"
  docker save "${TFCTRL_LOCAL_IMAGE}" |
    docker exec -i "${NODE_CONTAINER}" ctr -n k8s.io images import -
  # Point the chart at the imported local image; IfNotPresent so the node never
  # tries to pull this local-only tag from a registry.
  TFCTRL_HELM_ARGS=(
    --set image.repository=terraform-controller
    --set image.tag=v0.8.0-arm64
    --set image.pullPolicy=IfNotPresent
  )
fi

# ── Install KubeVela into the root ──────────────────────────────────────────
# --force-conflicts: vela-core's kube-webhook-certgen runs as a post-upgrade hook
# that server-side-patches the webhook configurations' caBundle + failurePolicy.
# On a re-run helm's own SSA then conflicts with that field manager, so force the
# apply; the post-upgrade certgen hook re-injects the caBundle afterwards. This is
# what makes control:start idempotent (P5 teardown/rebuild).
echo "==> Installing vela-core (+ cluster-gateway) into ${VELA_NS}"
helm upgrade --install kubevela "${CHARTS_DIR}/vela-core" \
  --namespace "${VELA_NS}" --create-namespace \
  --values "${KUBEVELA_DIR}/values-vela-core.yaml" \
  --force-conflicts --wait --timeout 300s

echo "==> Installing terraform-controller into ${VELA_NS}"
helm upgrade --install terraform-controller "${CHARTS_DIR}/terraform-controller" \
  --namespace "${VELA_NS}" \
  --values "${KUBEVELA_DIR}/values-terraform-controller.yaml" \
  "${TFCTRL_HELM_ARGS[@]}" \
  --force-conflicts --wait --timeout 300s

echo "==> Waiting for the KubeVela controllers to be Available"
kubectl -n "${VELA_NS}" rollout status deploy/kubevela-vela-core --timeout=180s
kubectl -n "${VELA_NS}" rollout status deploy/terraform-controller --timeout=180s

echo "==> KubeVela is up. Clusters known to the root:"
vela cluster list 2>/dev/null || kubectl -n "${VELA_NS}" get pods

echo "==> Next: moon run control:up (apply the child-provisioning Applications)"
