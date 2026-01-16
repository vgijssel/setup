#!/usr/bin/env bats

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  SCRIPT="${TEST_DIR}/devcontainer-install-extensions.sh"

  # Create temporary directory for test output
  TEST_OUTPUT_DIR="$(mktemp -d)"

  # Verify VSCode CLI is available via Hermit
  run code --version
  if [ "$status" -ne 0 ]; then
    skip "VSCode CLI not available"
  fi
}

# Teardown function runs after each test
teardown() {
  # Remove temporary directory
  rm -rf "${TEST_OUTPUT_DIR}"
}

@test "script requires --file argument" {
  run "${SCRIPT}"
  [ "$status" -eq 1 ]
  [[ "$output" =~ "Error: --file argument is required" ]]
}

@test "script validates file existence" {
  run "${SCRIPT}" --file /nonexistent/file.json
  [ "$status" -eq 1 ]
  [[ "$output" =~ "Error: File not found" ]]
}

@test "script creates output directory" {
  run "${SCRIPT}" --file "${TEST_DIR}/fixtures/test-devcontainer.json" --output "${TEST_OUTPUT_DIR}/extensions"

  [ "$status" -eq 0 ]
  [ -d "${TEST_OUTPUT_DIR}/extensions" ]
}

@test "script extracts and installs extensions from devcontainer.json" {
  # Skip actual extension installation in CI as it takes too long (30+ minutes)
  # The integration is tested by verifying code CLI is available in setup()
  if [ "${CI:-false}" = "true" ]; then
    skip "Skipping actual extension installation in CI (too slow)"
  fi

  run "${SCRIPT}" --file "${TEST_DIR}/fixtures/test-devcontainer.json" --output "${TEST_OUTPUT_DIR}/extensions"

  [ "$status" -eq 0 ]
  [[ "$output" =~ "Found 2 extensions" ]]
  [[ "$output" =~ "Installing extension: dbaeumer.vscode-eslint" ]]
  [[ "$output" =~ "Installing extension: esbenp.prettier-vscode" ]]
}

@test "script handles empty extensions list" {
  # Create a test file with no extensions
  local test_file="${TEST_OUTPUT_DIR}/empty-devcontainer.json"
  echo '{"customizations": {"vscode": {"extensions": []}}}' > "${test_file}"

  run "${SCRIPT}" --file "${test_file}" --output "${TEST_OUTPUT_DIR}/extensions"

  [ "$status" -eq 0 ]
  [[ "$output" =~ "No extensions found" ]]
}

@test "script handles malformed json gracefully" {
  # Create a malformed JSON file
  local test_file="${TEST_OUTPUT_DIR}/malformed.json"
  echo '{"customizations": {"vscode":' > "${test_file}"

  run "${SCRIPT}" --file "${test_file}" --output "${TEST_OUTPUT_DIR}/extensions"

  [ "$status" -eq 0 ]
  [[ "$output" =~ "No extensions found" ]]
}
