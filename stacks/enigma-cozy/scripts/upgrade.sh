#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="$(dirname "$SCRIPT_DIR")"
cd "$STACK_DIR"

# Step 1: Extract version from dependencies
VERSION=$(jq -r '.nx.metadata.dependencies["cozystack/cozystack"].version' package.json)
echo "Upgrading CozyStack to version: $VERSION"

# Step 2: Show diff
echo ""
echo "=== Changes to be applied ==="
MANIFEST_URL="https://github.com/cozystack/cozystack/releases/download/$VERSION/cozystack-installer.yaml"
curl -sL "$MANIFEST_URL" | kubectl diff -f - || true
echo "=== End of changes ==="

# Step 3: Confirm with gum
echo ""
if ! gum confirm "Apply CozyStack upgrade to $VERSION?"; then
    echo "Upgrade cancelled."
    exit 0
fi

# Step 4: Apply upgrade
echo ""
echo "Applying upgrade..."
kubectl apply -f "$MANIFEST_URL"

# Step 5: Validation loop
echo ""
echo "Waiting for cluster to become healthy..."
TIMEOUT=600
INTERVAL=30
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    echo "Running health checks... (${ELAPSED}s / ${TIMEOUT}s)"
    if nx run --tui=false enigma-cozy:validate --output-style=stream; then
        echo ""
        echo "Upgrade completed successfully!"
        exit 0
    fi
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""
echo "ERROR: Timeout waiting for cluster to become healthy"
exit 1
