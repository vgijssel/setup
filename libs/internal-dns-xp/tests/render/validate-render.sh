#!/usr/bin/env bash
set -euo pipefail

# Crossplane render test validation script
# This script validates that the composition and XRD are well-formed

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
XRD="${SCRIPT_DIR}/../../definition.yaml"
COMPOSITION="${SCRIPT_DIR}/../../compositions/internal-dns.yaml"
TEST_INPUT="${SCRIPT_DIR}/test-input.yaml"

echo "=== Crossplane Manifest Validation Test ==="
echo ""

# Check prerequisites
if ! command -v kubectl &> /dev/null; then
    echo "ERROR: kubectl CLI not found"
    exit 1
fi

# Validate XRD
echo "Validating XRD..."
if [ ! -f "${XRD}" ]; then
    echo "ERROR: XRD file not found: ${XRD}"
    exit 1
fi

kubectl --dry-run=client -f "${XRD}" create > /dev/null 2>&1 || {
    echo "ERROR: XRD validation failed"
    kubectl --dry-run=client -f "${XRD}" create
    exit 1
}
echo "✓ XRD is valid"

# Validate Composition
echo "Validating Composition..."
if [ ! -f "${COMPOSITION}" ]; then
    echo "ERROR: Composition file not found: ${COMPOSITION}"
    exit 1
fi

kubectl --dry-run=client -f "${COMPOSITION}" create > /dev/null 2>&1 || {
    echo "ERROR: Composition validation failed"
    kubectl --dry-run=client -f "${COMPOSITION}" create
    exit 1
}
echo "✓ Composition is valid"

# Validate test input structure
echo "Validating test input..."
if [ ! -f "${TEST_INPUT}" ]; then
    echo "ERROR: Test input file not found: ${TEST_INPUT}"
    exit 1
fi

# Check basic YAML structure
if ! grep -q "apiVersion:" "${TEST_INPUT}"; then
    echo "ERROR: Test input missing apiVersion"
    exit 1
fi

if ! grep -q "kind: InternalDNS" "${TEST_INPUT}"; then
    echo "ERROR: Test input must be kind: InternalDNS"
    exit 1
fi

if ! grep -q "domain:" "${TEST_INPUT}"; then
    echo "ERROR: Test input must have spec.domain"
    exit 1
fi

if ! grep -q "storageSize:" "${TEST_INPUT}"; then
    echo "ERROR: Test input must have spec.storageSize"
    exit 1
fi

echo "✓ Test input is valid"

# Check composition uses pipeline mode
echo "Validating composition uses pipeline mode..."
if ! grep -q "mode: Pipeline" "${COMPOSITION}"; then
    echo "ERROR: Composition must use Pipeline mode"
    exit 1
fi
echo "✓ Composition uses Pipeline mode"

# Check composition references cdk8s function
echo "Validating composition references cdk8s function..."
if ! grep -q "function-cdk8s" "${COMPOSITION}"; then
    echo "ERROR: Composition must reference function-cdk8s"
    exit 1
fi
echo "✓ Composition references cdk8s function"

# Check composition has inline cdk8s code
echo "Validating composition has inline cdk8s code..."
if ! grep -q "from cdk8s import Chart" "${COMPOSITION}"; then
    echo "ERROR: Composition must have inline cdk8s code"
    exit 1
fi
echo "✓ Composition has inline cdk8s code"

echo ""
echo "=== All validations passed ==="
echo ""
echo "Note: Full render testing requires Crossplane CLI >= 1.14 with 'crossplane beta render' command"
echo "      Current version: $(crossplane version | grep 'Client Version' | awk '{print $3}')"
