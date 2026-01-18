#!/usr/bin/env bats

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  DEVCONTAINER_DIR="$(dirname "${TEST_DIR}")"

  # Verify .docker-version file exists
  if [[ ! -f "${DEVCONTAINER_DIR}/.docker-version" ]]; then
    skip ".docker-version not found. Please run 'moon run devcontainer:build' first."
  fi

  # Read the image reference from .docker-version
  IMAGE=$(cat "${DEVCONTAINER_DIR}/.docker-version")

  if [[ -z "${IMAGE}" ]]; then
    skip ".docker-version is empty"
  fi
}

@test "devcontainer image reference exists in .docker-version" {
  [ -f "${DEVCONTAINER_DIR}/.docker-version" ]
  [ -n "${IMAGE}" ]
}

@test "devcontainer image passes goss validation" {
  run docker run --privileged --rm \
    -v "${SETUP_DIR}:/workspaces/setup" \
    "${IMAGE}" \
    bin/exec goss --gossfile ./.devcontainer/tests/goss.yaml validate

  echo "Output: ${output}"
  [ "$status" -eq 0 ]
}
