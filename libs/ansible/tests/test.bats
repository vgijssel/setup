#!/usr/bin/env bats

# Ansible roles test suite
# Tests role structure, syntax, and linting

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  ANSIBLE_DIR="$(dirname "${TEST_DIR}")"
  ROLES_DIR="${ANSIBLE_DIR}/roles"

  # List of expected roles
  EXPECTED_ROLES=(
    "common"
    "incus"
    "k3s"
    "pihole"
    "pikvm"
    "proxmox"
    "tailscale"
  )
}

@test "roles directory exists" {
  [ -d "${ROLES_DIR}" ]
}

@test "all expected roles exist" {
  for role in "${EXPECTED_ROLES[@]}"; do
    [ -d "${ROLES_DIR}/${role}" ] || {
      echo "Missing role: ${role}"
      return 1
    }
  done
}

@test "each role has tasks/main.yml" {
  for role in "${EXPECTED_ROLES[@]}"; do
    [ -f "${ROLES_DIR}/${role}/tasks/main.yml" ] || {
      echo "Missing tasks/main.yml in role: ${role}"
      return 1
    }
  done
}

@test "requirements.yml exists and is valid YAML" {
  [ -f "${ANSIBLE_DIR}/requirements.yml" ]

  # Validate YAML syntax using Python
  run python3 -c "import yaml; yaml.safe_load(open('${ANSIBLE_DIR}/requirements.yml'))"
  [ "$status" -eq 0 ]
}

@test "requirements.yml contains required collections" {
  # Check for essential collections
  run grep -q "community.general" "${ANSIBLE_DIR}/requirements.yml"
  [ "$status" -eq 0 ]

  run grep -q "ansible.posix" "${ANSIBLE_DIR}/requirements.yml"
  [ "$status" -eq 0 ]
}

@test "all role YAML files have valid syntax" {
  # Find all YAML files in roles and validate syntax
  local failed_files=()

  while IFS= read -r -d '' yaml_file; do
    if ! python3 -c "import yaml; yaml.safe_load(open('${yaml_file}'))" 2>/dev/null; then
      failed_files+=("${yaml_file}")
    fi
  done < <(find "${ROLES_DIR}" -name "*.yml" -o -name "*.yaml" -print0)

  if [ ${#failed_files[@]} -gt 0 ]; then
    echo "Invalid YAML files:"
    printf '%s\n' "${failed_files[@]}"
    return 1
  fi
}

@test "roles pass ansible-lint via trunk check" {
  # Skip in CI - trunk check runs as a separate CI job
  if [ "${CI:-false}" = "true" ]; then
    skip "Trunk check runs as separate CI job"
  fi

  # Skip if trunk is not available
  if ! command -v trunk &>/dev/null; then
    skip "Trunk CLI not available"
  fi

  # Run trunk check on ansible files
  cd "${ANSIBLE_DIR}"
  run trunk check --no-fix --filter=ansible-lint roles/
  echo "trunk check output: $output"
  [ "$status" -eq 0 ]
}

@test "common role has required task files" {
  local required_tasks=(
    "main.yml"
    "hostname.yml"
    "ssh.yml"
    "users.yml"
  )

  for task in "${required_tasks[@]}"; do
    [ -f "${ROLES_DIR}/common/tasks/${task}" ] || {
      echo "Missing task file in common role: ${task}"
      return 1
    }
  done
}

@test "k3s role has config template" {
  [ -f "${ROLES_DIR}/k3s/templates/k3s-config.yaml.j2" ]
}

@test "pihole role has docker tasks" {
  [ -f "${ROLES_DIR}/pihole/tasks/docker.yml" ]
  [ -f "${ROLES_DIR}/pihole/tasks/containers.yml" ]
}

@test "no secrets or sensitive data in role files" {
  # Check for common patterns that might indicate secrets
  local sensitive_patterns=(
    "password:"
    "secret:"
    "api_key:"
    "token:"
  )

  for pattern in "${sensitive_patterns[@]}"; do
    # Search for patterns but exclude files that are expected to have these as variables
    local matches
    matches=$(grep -r "${pattern}" "${ROLES_DIR}" --include="*.yml" --include="*.yaml" \
      | grep -v "{{ " \
      | grep -v "{%" \
      | grep -v "# " \
      | grep -v "vars:" \
      | grep -v "defaults:" \
      | grep -v "_password:" \
      | grep -v "_secret:" \
      | grep -v "_token:" \
      || true)

    if [ -n "${matches}" ]; then
      # Filter out false positives (variable references and comments)
      local real_secrets
      real_secrets=$(echo "${matches}" | grep -v "lookup(" | grep -v "vault_" || true)
      if [ -n "${real_secrets}" ]; then
        echo "Potential secrets found:"
        echo "${real_secrets}"
        return 1
      fi
    fi
  done
}

@test "vars_plugins directory contains op.py plugin" {
  [ -f "${ANSIBLE_DIR}/vars_plugins/op.py" ]
}

@test "op.py vars plugin has required functions" {
  # Check that the 1Password vars plugin has expected structure
  run grep -q "class VarsModule" "${ANSIBLE_DIR}/vars_plugins/op.py"
  [ "$status" -eq 0 ]
}
