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

# ── Build + import the terraform-controller images the upstream can't provide ──
# Two upstream images are unusable and are replaced with locally-built ones that
# are imported straight into the vind node's containerd (no registry needed):
#
#  1. terraform-controller itself — upstream's Dockerfile hardcodes GOARCH=amd64,
#     so its "multi-arch" arm64 image is really amd64: on arm64 it dies with
#     "exec format error" and can't be qemu-emulated (Go+qemu `lfstack.push`
#     fatal). Rebuilt from pinned source for the host arch. On amd64 the upstream
#     image (values default, pinned by digest) would also work, so this rebuild is
#     arm64-only.
#  2. the Terraform EXECUTOR — upstream's oamdev/docker-terraform:1.1.5 is amd64
#     only AND Terraform 1.1.5 (far too old for this repo's modules). Replaced on
#     every arch with a small OpenTofu executor (tofu symlinked as `terraform`),
#     matching the repo's pinned tofu 1.10.6.
#
# Idempotent (docker layer cache + ctr import upsert).
build_and_import() {
  local image="$1" dir="$2"
  echo "==> Building ${image} (host arch) and importing into ${NODE_CONTAINER}"
  docker build --build-arg "TARGETARCH=${GOARCH}" -t "${image}" -f "${dir}/Dockerfile" "${dir}"
  docker save "${image}" | docker exec -i "${NODE_CONTAINER}" ctr -n k8s.io images import -
}

NODE_CONTAINER="vcluster.cp.${CLUSTER_NAME}"
HOST_ARCH="$(uname -m)"
case "${HOST_ARCH}" in
  arm64 | aarch64) GOARCH="arm64" ;;
  x86_64 | amd64) GOARCH="amd64" ;;
  *) GOARCH="${HOST_ARCH}" ;;
esac

# Executor: always replace the upstream default (unusable on every arch).
TFCTRL_EXECUTOR_IMAGE="tofu-executor:1.10.6"
build_and_import "${TFCTRL_EXECUTOR_IMAGE}" "${SCRIPT_DIR}/../images/tofu-executor"
TFCTRL_HELM_ARGS=(--set "terraformImage=${TFCTRL_EXECUTOR_IMAGE}")

# Controller: rebuild only on arm64 (amd64 uses the upstream image pinned by digest).
if [[ "${GOARCH}" = "arm64" ]]; then
  TFCTRL_LOCAL_IMAGE="terraform-controller:v0.8.0-arm64"
  build_and_import "${TFCTRL_LOCAL_IMAGE}" "${SCRIPT_DIR}/../images/terraform-controller"
  TFCTRL_HELM_ARGS+=(
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
