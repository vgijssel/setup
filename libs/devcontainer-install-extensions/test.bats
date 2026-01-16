#!/usr/bin/env bats

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  SCRIPT="${TEST_DIR}/devcontainer-install-extensions.sh"

  # Create temporary directory for test output
  TEST_OUTPUT_DIR="$(mktemp -d)"

  # Create a mock 'code' command that simulates successful installation
  # This allows tests to run without requiring actual VSCode CLI
  MOCK_CODE_DIR="${TEST_OUTPUT_DIR}/.bin"
  mkdir -p "${MOCK_CODE_DIR}"
  cat > "${MOCK_CODE_DIR}/code" <<'EOF'
#!/usr/bin/env bash
# Mock VSCode CLI for testing
# Parse arguments to extract extension name and output directory
EXTENSIONS_DIR=""
EXTENSION_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --extensions-dir)
      EXTENSIONS_DIR="$2"
      shift 2
      ;;
    --install-extension)
      EXTENSION_NAME="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Create a mock extension directory to simulate successful installation
if [[ -n "${EXTENSIONS_DIR}" && -n "${EXTENSION_NAME}" ]]; then
  mkdir -p "${EXTENSIONS_DIR}/${EXTENSION_NAME}"
  echo "Mock extension installed" > "${EXTENSIONS_DIR}/${EXTENSION_NAME}/package.json"
  echo "Extension '${EXTENSION_NAME}' installed successfully."
  exit 0
fi

exit 1
EOF
  chmod +x "${MOCK_CODE_DIR}/code"

  # Prepend mock code to PATH for tests
  export PATH="${MOCK_CODE_DIR}:${PATH}"
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
  run "${SCRIPT}" --file "${TEST_DIR}/fixtures/test-devcontainer.json" --output "${TEST_OUTPUT_DIR}/extensions"

  [ "$status" -eq 0 ]
  [[ "$output" =~ "Found 2 extensions" ]]
  [[ "$output" =~ "Installing extension: dbaeumer.vscode-eslint" ]]
  [[ "$output" =~ "Installing extension: esbenp.prettier-vscode" ]]

  # Verify extension files were created in output directory
  [ -d "${TEST_OUTPUT_DIR}/extensions/dbaeumer.vscode-eslint" ]
  [ -d "${TEST_OUTPUT_DIR}/extensions/esbenp.prettier-vscode" ]
  [ -f "${TEST_OUTPUT_DIR}/extensions/dbaeumer.vscode-eslint/package.json" ]
  [ -f "${TEST_OUTPUT_DIR}/extensions/esbenp.prettier-vscode/package.json" ]
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
