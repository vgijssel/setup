#!/bin/bash
set -euo pipefail

# Generate actual output
actual=$(helm template registry . -f tests/snapshot_test.yaml --namespace coder)
expected=$(cat tests/snapshot_expected.yaml)

if ! diff -u <(echo "${expected}") <(echo "${actual}"); then
  echo "ERROR: Helm template output differs from snapshot"
  echo "To update snapshot, run:"
  echo "  helm template registry . -f tests/snapshot_test.yaml --namespace coder > tests/snapshot_expected.yaml"
  exit 1
fi
echo "Snapshot test passed"
