#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="$(dirname "${SCRIPT_DIR}")"
cd "${STACK_DIR}"

# Step 1: Extract version from dependencies
VERSION=$(jq -r '.nx.metadata.dependencies["cozystack/cozystack"].version' package.json)
echo "Upgrading CozyStack to version: ${VERSION}"

# Step 2: Show diff
echo ""
echo "=== Changes to be applied ==="
MANIFEST_URL="https://github.com/cozystack/cozystack/releases/download/${VERSION}/cozystack-installer.yaml"
curl -sL "${MANIFEST_URL}" | kubectl diff -f - || true
echo "=== End of changes ==="

# Step 3: Confirm with gum
echo ""
if ! gum confirm "Apply CozyStack upgrade to ${VERSION}?"; then
    echo "Upgrade cancelled."
    exit 0
fi

# Step 4: Apply upgrade
echo ""
echo "Applying upgrade..."
kubectl apply -f "${MANIFEST_URL}"

# Step 5: Validate cluster health with retries
echo ""
echo "Waiting for cluster to become healthy (retrying for up to 10 minutes)..."
goss validate -s 10s -r 10m

echo ""
echo "Upgrade completed successfully!"
