#!/usr/bin/env bash
# Test script to validate 1Password credentials storage automation
# This is the RED phase test for subtask 1.4

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

echo "=== Testing 1Password Credentials Storage Automation ==="
echo ""

# Check for 1Password provider in versions.tf
check_content "versions.tf" 'onepassword' "versions.tf includes 1password provider"

# Check for 1Password provider configuration
check_content "providers.tf" 'provider "onepassword"' "providers.tf configures 1password provider"

# Check for 1Password item resource to store credentials
check_content "main.tf" 'onepassword_item' "main.tf has onepassword_item resource"
check_content "main.tf" 'coder-oidc-credentials' "main.tf creates coder-oidc-credentials item"
check_content "main.tf" 'setup-coder-prod' "main.tf references setup-coder-prod vault"

# Check that client_secret is stored
check_content "main.tf" 'client_secret' "main.tf stores client_secret in 1Password"

# Check .env.tpl has OP_SERVICE_ACCOUNT_TOKEN for 1Password provider
check_content ".env.tpl" 'OP_SERVICE_ACCOUNT_TOKEN' ".env.tpl has OP_SERVICE_ACCOUNT_TOKEN"

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
