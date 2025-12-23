#!/usr/bin/env bash
# Test script to validate keycloak_openid_client resource configuration
# This is the RED phase test for subtask 1.3

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

echo "=== Testing keycloak_openid_client Resource ==="
echo ""

# Check main.tf has keycloak_openid_client resource
check_content "main.tf" 'resource "keycloak_openid_client" "coder"' "main.tf defines keycloak_openid_client.coder resource"

# Check client_id configuration
check_content "main.tf" 'client_id.*=.*"coder"' "main.tf has client_id = coder"

# Check realm_id configuration (should reference cozy realm)
check_content "main.tf" 'realm_id' "main.tf has realm_id configured"

# Check access_type is CONFIDENTIAL
check_content "main.tf" 'access_type.*=.*"CONFIDENTIAL"' "main.tf has access_type = CONFIDENTIAL"

# Check standard_flow_enabled
check_content "main.tf" 'standard_flow_enabled.*=.*true' "main.tf has standard_flow_enabled = true"

# Check valid_redirect_uris contains coder URL
check_content "main.tf" 'valid_redirect_uris' "main.tf has valid_redirect_uris configured"
check_content "main.tf" 'https://coder.enigma.vgijssel.nl' "main.tf includes coder.enigma.vgijssel.nl URL"

# Check web_origins
check_content "main.tf" 'web_origins' "main.tf has web_origins configured"

# Check enabled status
check_content "main.tf" 'enabled.*=.*true' "main.tf has enabled = true"

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
