#!/bin/bash
set -euo pipefail

# Generate actual output
actual=$(helm template relay-server . -f tests/snapshot_test.yaml --namespace relay-server)
expected=$(cat tests/snapshot_expected.yaml)

if ! diff -u <(echo "${expected}") <(echo "${actual}"); then
  echo "ERROR: Helm template output differs from snapshot"
  echo "To update snapshot, run:"
  echo "  helm template relay-server . -f tests/snapshot_test.yaml --namespace relay-server > tests/snapshot_expected.yaml"
  exit 1
fi
echo "Snapshot test passed"
