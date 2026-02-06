#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

HOST="maarten@192.168.1.30"

echo "Copying files to ${HOST}..."

# Files that go to user home directory (no sudo needed)
scp "${REPO_ROOT}/apps/haos/cloud/haos_vm.yml" "${HOST}:/home/maarten/haos_vm.yml"
scp "${REPO_ROOT}/apps/haos/cloud/kubevirt_cr.yml" "${HOST}:/home/maarten/kubevirt_cr.yml"

# Files that need root access - copy to temp location first, then sudo move
TEMP_DIR="/tmp/nixos-sync-$$"
# shellcheck disable=SC2029 # Intentional client-side expansion of TEMP_DIR
ssh "${HOST}" "mkdir -p ${TEMP_DIR}"

scp "${REPO_ROOT}/apps/hypervisor/configuration.nix" "${HOST}:${TEMP_DIR}/configuration.nix"
scp "${REPO_ROOT}/apps/hypervisor/hardware-configuration.nix" "${HOST}:${TEMP_DIR}/hardware-configuration.nix"

echo "Moving NixOS config files to /etc/nixos/ (sudo required)..."
# shellcheck disable=SC2029 # Intentional client-side expansion of TEMP_DIR
ssh -t "${HOST}" "sudo mv ${TEMP_DIR}/configuration.nix /etc/nixos/configuration.nix && \
    sudo mv ${TEMP_DIR}/hardware-configuration.nix /etc/nixos/hardware-configuration.nix && \
    sudo chown root:root /etc/nixos/configuration.nix /etc/nixos/hardware-configuration.nix && \
    rmdir ${TEMP_DIR}"

echo "Done."
