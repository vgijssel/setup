#!/usr/bin/env bash
# Test script to validate client_secret output configuration
# This is the RED phase test for subtask 1.5

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

FAILED=0
PASSED=0

check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    if [[ -f "$file" ]] && grep -q "$pattern" "$file"; then
        echo "PASS: $description"
        PASSED=$((PASSED + 1))
    else
        echo "FAIL: $description"
        FAILED=$((FAILED + 1))
    fi
}

echo "=== Testing client_secret Output Configuration ==="
echo ""

# Check outputs.tf has client_secret output
check_content "outputs.tf" 'output "client_secret"' "outputs.tf defines client_secret output"

# Check it references the keycloak_openid_client resource
check_content "outputs.tf" 'keycloak_openid_client.coder.client_secret' "outputs.tf references coder client_secret"

# Check it's marked as sensitive
check_content "outputs.tf" 'sensitive.*=.*true' "outputs.tf marks output as sensitive"

# Check for optional client_id output for completeness
check_content "outputs.tf" 'output "client_id"' "outputs.tf defines client_id output"

echo ""
echo "=== Test Results ==="
echo "PASSED: $PASSED"
echo "FAILED: $FAILED"
echo "TOTAL: $((PASSED + FAILED))"
echo ""

if [[ $FAILED -gt 0 ]]; then
    echo "STATUS: TESTS FAILED"
    exit 1
else
    echo "STATUS: ALL TESTS PASSED"
    exit 0
fi
