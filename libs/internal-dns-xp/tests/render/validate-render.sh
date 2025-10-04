#!/usr/bin/env bash
set -euo pipefail

# Crossplane render test validation script
# This script validates that the composition renders correctly

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_INPUT="${SCRIPT_DIR}/test-input.yaml"
COMPOSITION="${SCRIPT_DIR}/../../compositions/internal-dns.yaml"
FUNCTION_IMAGE="cdk8s-function:latest"
SNAPSHOT_DIR="${SCRIPT_DIR}/snapshots"

echo "=== Crossplane Render Test ==="
echo ""

# Check prerequisites
if ! command -v crossplane &> /dev/null; then
    echo "ERROR: crossplane CLI not found"
    exit 1
fi

if [ ! -f "${TEST_INPUT}" ]; then
    echo "ERROR: Test input file not found: ${TEST_INPUT}"
    exit 1
fi

if [ ! -f "${COMPOSITION}" ]; then
    echo "ERROR: Composition file not found: ${COMPOSITION}"
    exit 1
fi

# Create snapshot directory
mkdir -p "${SNAPSHOT_DIR}"

# Render the composition
echo "Rendering composition..."
OUTPUT=$(crossplane beta render "${TEST_INPUT}" "${COMPOSITION}" \
    --include-function-results \
    2>&1) || {
    echo "ERROR: Crossplane render failed"
    echo "${OUTPUT}"
    exit 1
}

echo "Render successful!"
echo ""

# Save output to snapshot
SNAPSHOT_FILE="${SNAPSHOT_DIR}/render-output.yaml"
echo "${OUTPUT}" > "${SNAPSHOT_FILE}"
echo "Snapshot saved to: ${SNAPSHOT_FILE}"
echo ""

# Validate output contains expected resources
echo "Validating rendered resources..."
EXPECTED_RESOURCES=(
    "kind: Deployment"
    "kind: Service"
    "kind: PersistentVolumeClaim"
    "kind: ConfigMap"
    "kind: Secret"
)

for resource in "${EXPECTED_RESOURCES[@]}"; do
    if echo "${OUTPUT}" | grep -q "${resource}"; then
        echo "✓ Found ${resource}"
    else
        echo "✗ Missing ${resource}"
        exit 1
    fi
done

echo ""
echo "=== All validations passed ==="
