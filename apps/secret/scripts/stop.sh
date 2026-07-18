#!/usr/bin/env bash
# Stop the secret cluster: delete the vind vcluster (and its kube context). All
# in-cluster state is destroyed; the seal key + root/recovery keys remain in
# 1Password, so a fresh secret:start + secret:bootstrap re-creates the cluster.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"${SCRIPT_DIR}/cluster.sh" down
