#!/usr/bin/env bash
# Test script to validate keycloak provider configuration
# This is the RED phase test for subtask 1.2

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

echo "=== Testing Keycloak Provider Configuration ==="
echo ""

# Check versions.tf has correct keycloak provider source
check_content "versions.tf" 'source.*=.*"mrparkers/keycloak"' "versions.tf has mrparkers/keycloak source"
check_content "versions.tf" 'version.*=.*"4.4.0"' "versions.tf has keycloak version 4.4.0"

# Check providers.tf has correct keycloak configuration
check_content "providers.tf" 'provider "keycloak"' "providers.tf defines keycloak provider"
check_content "providers.tf" 'url.*=.*"https://keycloak.enigma.vgijssel.nl"' "providers.tf has correct Keycloak URL"
check_content "providers.tf" 'client_id.*=.*"admin-cli"' "providers.tf uses admin-cli client"
check_content "providers.tf" 'password.*=.*var.keycloak_admin_password' "providers.tf uses keycloak_admin_password variable"

# Check variables.tf has keycloak_admin_password with sensitive = true
check_content "variables.tf" 'variable "keycloak_admin_password"' "variables.tf defines keycloak_admin_password"
check_content "variables.tf" 'sensitive.*=.*true' "variables.tf marks password as sensitive"

# Check .env.tpl has keycloak password from 1Password
check_content ".env.tpl" 'TF_VAR_keycloak_admin_password.*op://sso-prod/keycloak-admin/password' ".env.tpl references keycloak-admin from sso-prod vault"

# Test tofu fmt -check (syntax/formatting check without provider initialization)
echo ""
echo "Running tofu fmt -check..."
if tofu fmt -check -recursive . >/dev/null 2>&1; then
    echo "PASS: tofu fmt -check succeeds (files properly formatted)"
    PASSED=$((PASSED + 1))
else
    echo "FAIL: tofu fmt -check failed (files need formatting)"
    FAILED=$((FAILED + 1))
fi

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
