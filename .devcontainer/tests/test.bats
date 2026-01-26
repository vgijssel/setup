#!/usr/bin/env bats

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  DEVCONTAINER_DIR="$(dirname "${TEST_DIR}")"
}

@test "devcontainer .docker-version file exists" {
  [ -f "${DEVCONTAINER_DIR}/.docker-version" ]
}

@test "devcontainer .docker-version file is not empty" {
  [ -f "${DEVCONTAINER_DIR}/.docker-version" ]
  IMAGE=$(cat "${DEVCONTAINER_DIR}/.docker-version")
  [ -n "${IMAGE}" ]
}

@test "devcontainer image passes goss validation" {
  IMAGE=$(cat "${DEVCONTAINER_DIR}/.docker-version")
  run docker run --privileged --rm \
    -v "${SETUP_DIR}:/workspaces/setup" \
    "${IMAGE}" \
    bin/exec goss --gossfile ./.devcontainer/tests/goss.yaml validate

  echo "Output: ${output}"
  [ "$status" -eq 0 ]
}

@test "code-server CLI is available" {
  run code-server --version
  [ "$status" -eq 0 ]
}
