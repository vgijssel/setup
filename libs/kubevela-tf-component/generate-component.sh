#!/usr/bin/env bash
# Generate a KubeVela Terraform ComponentDefinition (with the module's HCL embedded
# INLINE) from a `<thing>-config/terraform/` directory. This is the `generate` half
# of the generate / generator_test pair (SPEC §6): the committed output under
# `component/` is a pure function of the HCL in `terraform/`, so `generator_test`
# (`git diff --exit-code component/`) fails CI whenever `component/` is stale.
#
# Usage:
#   generate-component.sh <terraform_dir> <output_file> <component_name> <provider_name> [description]
#
# Determinism: `vela def init` output is byte-stable across runs; we additionally
# strip the two noise fields it emits (`metadata.creationTimestamp: null`,
# `status: {}`). `vela` + `yq` are pinned via hermit, so output is reproducible
# across machines/CI.
#
# Provider note (SPEC §9 #2): `vela def init --provider` only accepts CLOUD
# providers (aws/azure/…); it prepends that name to the definition and sets
# providerRef to it. Our providers are non-cloud (`vault`, `tailscale`), so we pass
# a fixed placeholder (`aws`) purely to get the correct Terraform component skeleton,
# then rewrite `metadata.name` and `providerRef.name` to the real values.
set -euo pipefail

TF_DIR="${1:?terraform dir required}"
OUT_FILE="${2:?output file required}"
COMPONENT_NAME="${3:?component name required}"
PROVIDER_NAME="${4:?provider name required}"
DESC="${5:-Terraform component ${COMPONENT_NAME}}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vela
require yq

tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT

# Terraform merges every *.tf in a directory; concatenating them (sorted glob →
# stable byte order) yields an equivalent single file for `vela def init --local`,
# which only accepts a single file.
cat "${TF_DIR}"/*.tf >"${tmp}/combined.tf"

vela def init "${COMPONENT_NAME}" \
  --type component --provider aws \
  --local "${tmp}/combined.tf" \
  --desc "${DESC}" >"${tmp}/gen.yaml"

mkdir -p "$(dirname "${OUT_FILE}")"
yq -P "
  .metadata.name = \"${COMPONENT_NAME}\" |
  .spec.schematic.terraform.providerRef.name = \"${PROVIDER_NAME}\" |
  del(.metadata.creationTimestamp) |
  del(.status)
" "${tmp}/gen.yaml" >"${OUT_FILE}"

echo "==> Generated ${OUT_FILE} (component=${COMPONENT_NAME}, provider=${PROVIDER_NAME})"
