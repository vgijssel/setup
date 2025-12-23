#!/usr/bin/env bash
# Test script to validate sso-prod directory structure matches gateway-prod pattern
# This is the RED phase test for subtask 1.1

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

FAILED=0
PASSED=0

check_file() {
    local file="$1"
    local description="$2"
    if [[ -f "$file" ]]; then
        echo "PASS: $description ($file exists)"
        PASSED=$((PASSED + 1))
    else
        echo "FAIL: $description ($file missing)"
        FAILED=$((FAILED + 1))
    fi
}

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

echo "=== Testing apps/sso-prod/ directory structure ==="
echo ""

# Check required files
check_file ".env.tpl" "1Password secrets template"
check_file ".envrc" "direnv configuration"
check_file "backend.tf" "S3 backend configuration"
check_file "package.json" "NX project configuration"
check_file "providers.tf" "Provider configuration"
check_file "variables.tf" "Variable definitions"
check_file "versions.tf" "Provider version constraints"
check_file "main.tf" "Main OpenTofu configuration"
check_file "outputs.tf" "Output definitions"

# Check .env.tpl has required sso-prod vault references
check_content ".env.tpl" "op://sso-prod" ".env.tpl references sso-prod vault"
check_content ".env.tpl" "TF_VAR_keycloak_admin_password" ".env.tpl has Keycloak password variable"
check_content ".env.tpl" "AWS_ACCESS_KEY_ID" ".env.tpl has S3 credentials"

# Check .envrc sources parent and loads .env
check_content ".envrc" "source_env" ".envrc sources parent direnv"
check_content ".envrc" "dotenv_if_exists" ".envrc loads .env file"

# Check backend.tf has sso-prod key
check_content "backend.tf" 'key = "sso-prod"' "backend.tf uses sso-prod key"

# Check package.json has required nx targets
check_content "package.json" '"secrets"' "package.json has secrets target"
check_content "package.json" '"init"' "package.json has init target"
check_content "package.json" '"plan"' "package.json has plan target"
check_content "package.json" '"apply"' "package.json has apply target"
check_content "package.json" '"destroy"' "package.json has destroy target"
check_content "package.json" '"output"' "package.json has output target"
check_content "package.json" "sso-prod" "package.json references sso-prod"

# Check versions.tf has keycloak provider
check_content "versions.tf" "keycloak" "versions.tf includes keycloak provider"

# Check providers.tf configures keycloak
check_content "providers.tf" "keycloak" "providers.tf configures keycloak provider"

# Check variables.tf has keycloak_admin_password
check_content "variables.tf" "keycloak_admin_password" "variables.tf has keycloak_admin_password"

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
