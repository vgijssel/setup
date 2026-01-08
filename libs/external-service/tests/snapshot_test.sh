#!/bin/bash
set -euo pipefail

# Generate actual output
actual=$(helm template external-service . -f tests/snapshot_test.yaml --namespace external-services)
expected=$(cat tests/snapshot_expected.yaml)

if ! diff -u <(echo "${expected}") <(echo "${actual}"); then
  echo "ERROR: Helm template output differs from snapshot"
  echo "To update snapshot, run:"
  echo "  helm template external-service . -f tests/snapshot_test.yaml --namespace external-services > tests/snapshot_expected.yaml"
  exit 1
fi
echo "Snapshot test passed"
