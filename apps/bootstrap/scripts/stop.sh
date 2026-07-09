#!/usr/bin/env bash
# Stop the local bootstrap app: stop the background Tilt watcher, tear down all
# Tilt-managed workloads, then delete the k3d cluster.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_DIR="${TMPDIR:-/tmp}"
PID_FILE="${STATE_DIR}/homelab-bootstrap-tilt.pid"

# 1) Stop the background Tilt watcher so it stops re-applying while we tear down.
if [[ -f "${PID_FILE}" ]]; then
  pid="$(cat "${PID_FILE}")"
  if kill -0 "${pid}" 2>/dev/null; then
    echo "==> Stopping background Tilt (pid ${pid})"
    kill "${pid}" 2>/dev/null || true
  fi
  rm -f "${PID_FILE}"
fi

# 2) tilt down — delete Tilt-managed workloads (only while the cluster exists).
if k3d cluster list -o json | jq -e 'any(.[]; .name == "bootstrap")' >/dev/null; then
  echo "==> tilt down"
  tilt down -f "${PROJECT_DIR}/Tiltfile" || true
fi

# 3) Delete the k3d cluster.
echo "==> Deleting k3d cluster"
"${SCRIPT_DIR}/down.sh"
