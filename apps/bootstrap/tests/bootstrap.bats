#!/usr/bin/env bats

# Behavioral tests for the apps/bootstrap k3d harness (T1).
# These are large tests: they create and destroy a real k3d cluster via Docker.

setup() {
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  PROJECT_DIR="$(dirname "${TEST_DIR}")"
  CLUSTER_NAME="bootstrap"
  CONTEXT="k3d-${CLUSTER_NAME}"
}

teardown() {
  # Best-effort cleanup so a failed test never leaks a cluster.
  k3d cluster delete "${CLUSTER_NAME}" >/dev/null 2>&1 || true
}

@test "up.sh brings up a cluster with a Ready node and is idempotent" {
  run "${PROJECT_DIR}/scripts/up.sh"
  [ "$status" -eq 0 ]

  # A node reaches Ready via the created kubectl context.
  run kubectl --context "${CONTEXT}" wait --for=condition=Ready node --all --timeout=120s
  [ "$status" -eq 0 ]

  # Re-running up must succeed without error.
  run "${PROJECT_DIR}/scripts/up.sh"
  [ "$status" -eq 0 ]

  # ...and must not create a second cluster.
  run bash -c "k3d cluster list -o json | jq '[.[] | select(.name == \"${CLUSTER_NAME}\")] | length'"
  [ "$status" -eq 0 ]
  [ "$output" -eq 1 ]
}

@test "down.sh removes the cluster and its kubectl context, idempotently" {
  "${PROJECT_DIR}/scripts/up.sh"

  run "${PROJECT_DIR}/scripts/down.sh"
  [ "$status" -eq 0 ]

  # The kubectl context is gone.
  run bash -c "kubectl config get-contexts -o name | grep -qx '${CONTEXT}'"
  [ "$status" -ne 0 ]

  # A second down is a clean no-op.
  run "${PROJECT_DIR}/scripts/down.sh"
  [ "$status" -eq 0 ]
}
