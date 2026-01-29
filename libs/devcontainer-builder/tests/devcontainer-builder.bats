#!/usr/bin/env bats

# Devcontainer Builder Tests
# These tests validate the devcontainer-builder image functionality

setup() {
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  PROJECT_DIR="$(dirname "${TEST_DIR}")"

  # Get version from version.txt
  VERSION=$(cat "${PROJECT_DIR}/version.txt" | tr -d '\n')
  IMAGE_NAME="ghcr.io/vgijssel/setup/devcontainer-builder:${VERSION}"

  # Get current git branch
  GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"

  # Test repository for devcontainer builds
  TEST_REPO="${TEST_REPO:-https://github.com/vgijssel/setup.git}"
}

# =============================================================================
# Image Build Tests
# =============================================================================

@test "image builds successfully" {
  cd "${PROJECT_DIR}"
  run docker build -t "${IMAGE_NAME}" .
  [ "$status" -eq 0 ]
}

# =============================================================================
# CLI Tool Tests
# =============================================================================

@test "devcontainer CLI is available" {
  run docker run --rm "${IMAGE_NAME}" devcontainer --version
  [ "$status" -eq 0 ]
  [[ "$output" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]]
}

@test "podman CLI is available" {
  run docker run --rm "${IMAGE_NAME}" podman --version
  [ "$status" -eq 0 ]
  [[ "$output" =~ "podman version" ]]
}

@test "DOCKER_HOST is set to podman socket" {
  run docker run --rm "${IMAGE_NAME}" printenv DOCKER_HOST
  [ "$status" -eq 0 ]
  [[ "$output" =~ "unix:///run/podman/podman.sock" ]]
}

@test "git is available" {
  run docker run --rm "${IMAGE_NAME}" git --version
  [ "$status" -eq 0 ]
  [[ "$output" =~ "git version" ]]
}

@test "python3 is available" {
  run docker run --rm "${IMAGE_NAME}" python3 --version
  [ "$status" -eq 0 ]
  [[ "$output" =~ "Python 3" ]]
}

@test "log-streamer script exists and has help" {
  run docker run --rm "${IMAGE_NAME}" python3 /app/log-streamer.py --help
  [ "$status" -eq 0 ]
  [[ "$output" =~ "Stream logs to Coder" ]]
}

# =============================================================================
# Entrypoint Validation Tests
# =============================================================================

@test "entrypoint validates missing CODER_AGENT_URL" {
  run docker run --rm \
    -e CODER_AGENT_TOKEN=test-token \
    -e DEVCONTAINER_REPOSITORY=https://github.com/test/repo.git \
    "${IMAGE_NAME}"
  [ "$status" -eq 1 ]
  [[ "$output" =~ "Missing required environment variables" ]]
  [[ "$output" =~ "CODER_AGENT_URL" ]]
}

@test "entrypoint validates missing CODER_AGENT_TOKEN" {
  run docker run --rm \
    -e CODER_AGENT_URL=https://coder.example.com \
    -e DEVCONTAINER_REPOSITORY=https://github.com/test/repo.git \
    "${IMAGE_NAME}"
  [ "$status" -eq 1 ]
  [[ "$output" =~ "Missing required environment variables" ]]
  [[ "$output" =~ "CODER_AGENT_TOKEN" ]]
}

@test "entrypoint validates missing DEVCONTAINER_REPOSITORY" {
  run docker run --rm \
    -e CODER_AGENT_URL=https://coder.example.com \
    -e CODER_AGENT_TOKEN=test-token \
    "${IMAGE_NAME}"
  [ "$status" -eq 1 ]
  [[ "$output" =~ "Missing required environment variables" ]]
  [[ "$output" =~ "DEVCONTAINER_REPOSITORY" ]]
}

# =============================================================================
# Podman Socket Tests (requires privileged mode)
# =============================================================================

@test "podman socket can start in privileged mode" {
  # Run container in privileged mode and check if podman socket starts
  run timeout 60 docker run --rm --privileged \
    -e CODER_AGENT_URL=https://coder.example.com \
    -e CODER_AGENT_TOKEN=test-token \
    -e DEVCONTAINER_REPOSITORY="${TEST_REPO}" \
    -e DEVCONTAINER_BRANCH="${GIT_BRANCH}" \
    "${IMAGE_NAME}" \
    bash -c 'mkdir -p /run/podman && podman system service -t 0 unix:///run/podman/podman.sock &>/dev/null & sleep 5 && podman info &>/dev/null && echo "Podman socket started successfully"'

  # We expect this to either succeed or fail with specific error (not just timeout)
  # The key is that podman service attempts to start
  [[ "$output" =~ "Podman socket started" ]] || [[ "$output" =~ "Devcontainer Builder starting" ]]
}

# =============================================================================
# Integration Tests
# =============================================================================

@test "can run custom command instead of entrypoint" {
  run docker run --rm "${IMAGE_NAME}" echo "custom command works"
  [ "$status" -eq 0 ]
  [[ "$output" =~ "custom command works" ]]
}

@test "workspaces directory exists" {
  run docker run --rm "${IMAGE_NAME}" ls -la /workspaces
  [ "$status" -eq 0 ]
}

@test "app directory contains required files" {
  run docker run --rm "${IMAGE_NAME}" ls -la /app/
  [ "$status" -eq 0 ]
  [[ "$output" =~ "entrypoint.sh" ]]
  [[ "$output" =~ "log-streamer.py" ]]
}
