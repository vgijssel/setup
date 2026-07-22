#!/usr/bin/env bash
# control:up — apply the KubeVela child-provisioning Applications against the
# root, and join each child vcluster to the root once it is Ready.
#
# This is the thin orchestrator SPEC §6 sanctions (`up` = "vela up -f … or a thin
# wrapper"). The imperative bits beyond `vela up` are (1) the vcluster join
# (libs/vcluster-join), which KubeVela cannot yet express natively (SPEC §9 #7),
# and (2) the ESO CRD install (libs/eso-crds), which cannot go through KubeVela at
# all because two ESO CRDs exceed the 256 KiB annotation limit under KubeVela's
# apply path (see that script). Both reach the child over the same in-cluster
# cluster-gateway path; everything else the children RUN (platform, workloads,
# Terraform, bootstrap Workflows) is applied as KubeVela objects via
# `topology -> <child>`.
#
# Idempotent: `vela up` upserts, the join helper detaches+rejoins, SSA upserts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHILDREN_DIR="${SCRIPT_DIR}/../src/children"
JOIN="${REPO_ROOT}/libs/vcluster-join/join.sh"
ESO_CRDS="${REPO_ROOT}/libs/eso-crds/install.sh"
TS_CRDS="${REPO_ROOT}/libs/tailscale-crds/install.sh"
TF_CTRL_CHILD="${REPO_ROOT}/libs/tf-controller-child/install.sh"
OPENBAO_BRINGUP="${REPO_ROOT}/libs/openbao-bringup/run.sh"
NETWORK_BRINGUP="${REPO_ROOT}/libs/network-bringup/run.sh"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vela
require kubectl
require helm

# ── secret child ────────────────────────────────────────────────────────────
echo "==> Applying child-secret Application (creates the 'secret' vcluster)"
vela up -f "${CHILDREN_DIR}/application-secret.yaml"
"${JOIN}" secret secret

# ESO + tailscale CRDs must exist in the child before its platform Application
# dispatches the ClusterSecretStore / ExternalSecret / ProxyGroup / Ingress CRs
# (else those kinds are unregistered, or — for tailscale — dispatched without a
# status subresource, which wedges the operator; see each install.sh for why).
"${ESO_CRDS}" secret
"${TS_CRDS}" secret

echo "==> Dispatching the secret child's platform (cert-manager, ESO, tailscale, OpenBao)"
vela up -f "${CHILDREN_DIR}/application-secret-platform.yaml"

# openbao-config runs child-local (SPEC §3.2), so the secret child needs its own
# terraform-controller (+ tofu executor) to reconcile the topology-dispatched
# Configuration. Installed over the same cluster-gateway path; the OpenBao bring-up
# Workflow (secret:configure equivalent) dispatches the Configuration afterwards.
echo "==> Installing terraform-controller into the secret child"
"${TF_CTRL_CHILD}" secret

# One-off OpenBao bring-up (seal + init + keys->1Password + temp token -> apply
# openbao-config once -> delete token). Idempotent; leaves ESO green in the child.
echo "==> Bringing up OpenBao in the secret child"
"${OPENBAO_BRINGUP}" secret

# ── network child ─────────────────────────────────────────────────────────────
# network reads the SECRET child's OpenBao over the tailnet (no local store), so it
# is brought up AFTER secret's OpenBao is green.
echo "==> Applying child-network Application (creates the 'network' vcluster)"
vela up -f "${CHILDREN_DIR}/application-network.yaml"
"${JOIN}" network network

# Same out-of-band CRD installs as the secret child (ESO + tailscale, with the
# tailscale status subresource KubeVela would otherwise strip).
"${ESO_CRDS}" network
"${TS_CRDS}" network

echo "==> Dispatching the network child's base platform (cert-manager, ESO, tailscale)"
vela up -f "${CHILDREN_DIR}/application-network-platform.yaml"

# Break the Tailscale chicken-and-egg: seed operator-oauth out-of-band from the
# secret child's OpenBao (over the tailnet) so the network operator can register.
echo "==> Seeding network operator-oauth (breaks the tailscale chicken-and-egg)"
"${NETWORK_BRINGUP}" network

# Network workloads (MongoDB + Omada) — dispatched after the platform + ESO store
# so their ExternalSecrets can resolve against the secret child's OpenBao. MongoDB
# stays in CreateContainerConfigError and Omada waits until kv/mongodb is seeded
# (username/password/uri), mirroring how the platform ExternalSecrets wait on kv.
echo "==> Dispatching the network child's workloads (MongoDB + Omada)"
vela up -f "${CHILDREN_DIR}/application-network-workloads.yaml"

echo "==> control:up complete."
