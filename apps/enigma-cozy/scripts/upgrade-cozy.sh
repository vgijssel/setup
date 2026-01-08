#!/usr/bin/env bash
set -euo pipefail

# Parse arguments
AUTO_CONFIRM=false
DRY_RUN=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--yes)
            AUTO_CONFIRM=true
            shift
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [-y|--yes] [-n|--dry-run]"
            exit 1
            ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="$(dirname "${SCRIPT_DIR}")"
cd "${STACK_DIR}"

# Step 1: Extract version from dependencies
VERSION=$(yq -r '.project.metadata.dependencies["cozystack/cozystack"].version' moon.yml)
echo "Upgrading CozyStack to version: ${VERSION}"

# Step 2: Show diff
echo ""
echo "=== Changes to be applied ==="
MANIFEST_URL="https://github.com/cozystack/cozystack/releases/download/${VERSION}/cozystack-installer.yaml"
curl -sL "${MANIFEST_URL}" | kubectl diff -f - || true
echo "=== End of changes ==="

# Exit early if dry-run
if [[ "${DRY_RUN}" == "true" ]]; then
    echo ""
    echo "Dry run complete. No changes applied."
    exit 0
fi

# Step 3: Confirm with gum (skip if --yes flag provided)
echo ""
if [[ "${AUTO_CONFIRM}" != "true" ]]; then
    if ! gum confirm "Apply CozyStack upgrade to ${VERSION}?"; then
        echo "Upgrade cancelled."
        exit 0
    fi
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
