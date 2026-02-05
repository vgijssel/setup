#!/usr/bin/env bash
# Rollback point-to-point storage network to previous state
# Usage: ./scripts/rollback-storage-network.sh
#
# This script performs a safe rollback of the storage network configuration:
# 1. Removes LINSTOR node-connection paths
# 2. Removes LINSTOR storage interfaces
# 3. Provides instructions for reverting Talos patch files
#
# WARNING: This will affect DRBD replication until configuration is restored
# or nodes are reconfigured with the default network.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

echo "=== Storage Network Rollback ==="
echo ""
echo "This script will:"
echo "  1. Remove LINSTOR node-connection paths (direct peer routes)"
echo "  2. Remove LINSTOR storage interfaces (10.50.x.x addresses)"
echo "  3. Provide instructions for reverting Talos configurations"
echo ""
echo "WARNING: This will disrupt DRBD replication during the rollback process."
echo "Ensure you understand the implications before proceeding."
echo ""
read -p "Continue with rollback? (y/N) " -n 1 -r
echo
[[ ! $REPLY =~ ^[Yy]$ ]] && { echo "Aborted."; exit 1; }

echo ""
echo "=== Step 1: Removing Node-Connection Paths ==="
echo ""

# Remove node-connection paths (ignore errors if they don't exist)
echo "Removing illusion <-> the-dome path..."
"${REPO_ROOT}/bin/linstor" node-connection path delete illusion the-dome direct 2>/dev/null || echo "  Path not found or already removed"

echo "Removing illusion <-> the-toy-factory path..."
"${REPO_ROOT}/bin/linstor" node-connection path delete illusion the-toy-factory direct 2>/dev/null || echo "  Path not found or already removed"

echo "Removing the-dome <-> the-toy-factory path..."
"${REPO_ROOT}/bin/linstor" node-connection path delete the-dome the-toy-factory direct 2>/dev/null || echo "  Path not found or already removed"

echo ""
echo "=== Step 2: Removing Storage Interfaces ==="
echo ""

# Remove storage interfaces from all nodes
for node in illusion the-dome the-toy-factory; do
  echo "Cleaning interfaces from ${node}..."
  "${REPO_ROOT}/bin/linstor" node interface delete "${node}" storage-dome 2>/dev/null || true
  "${REPO_ROOT}/bin/linstor" node interface delete "${node}" storage-illusion 2>/dev/null || true
  "${REPO_ROOT}/bin/linstor" node interface delete "${node}" storage-toyfactory 2>/dev/null || true
done

echo ""
echo "=== Step 3: Verify LINSTOR Cleanup ==="
echo ""

echo "Current interfaces:"
for node in illusion the-dome the-toy-factory; do
  echo "--- ${node} ---"
  "${REPO_ROOT}/bin/linstor" node interface list "${node}" || true
done

echo ""
echo "=== LINSTOR Cleanup Complete ==="
echo ""
echo "To complete the rollback, manually perform these steps:"
echo ""
echo "1. Revert the Talos patch files:"
echo "   cd ${REPO_ROOT}"
echo "   git checkout apps/enigma-cozy/illusion.patch.yaml"
echo "   git checkout apps/enigma-cozy/the-dome.patch.yaml"
echo "   git checkout apps/enigma-cozy/the-toy-factory.patch.yaml"
echo ""
echo "2. Regenerate and apply Talos configurations:"
echo "   moon run enigma-cozy:generate"
echo "   moon run enigma-cozy:apply"
echo ""
echo "3. (Optional) Delete the Kubernetes Job if deployed:"
echo "   kubectl delete job linstor-configure-interfaces -n cozy-linstor"
echo "   kubectl delete configmap linstor-interfaces-config -n cozy-linstor"
echo ""
echo "Note: Nodes may require a reboot to fully apply network changes."
