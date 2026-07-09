#!/usr/bin/env bash
# Start the local bootstrap app: create the k3d cluster (idempotent) and run
# `tilt up` in the background so it keeps reconciling after this returns.
#
# OpenBao boots sealed/uninitialised, so parts of the stack stay NotReady until
# you initialise + unseal OpenBao and seed its secrets (see scripts/init-openbao.sh).
# Extra args are passed through to `tilt up`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_DIR="${TMPDIR:-/tmp}"
PID_FILE="${STATE_DIR}/homelab-bootstrap-tilt.pid"
LOG_FILE="${STATE_DIR}/homelab-bootstrap-tilt.log"

echo "==> Ensuring k3d cluster"
"${SCRIPT_DIR}/up.sh"

if [[ -f "${PID_FILE}" ]]; then
  running_pid="$(cat "${PID_FILE}")"
  if kill -0 "${running_pid}" 2>/dev/null; then
    echo "==> Tilt already running (pid ${running_pid}); logs: ${LOG_FILE}"
    exit 0
  fi
fi

echo "==> Starting Tilt in the background"
nohup tilt up --stream "$@" -f "${PROJECT_DIR}/Tiltfile" >"${LOG_FILE}" 2>&1 &
tilt_pid=$!
echo "${tilt_pid}" >"${PID_FILE}"
disown "${tilt_pid}" 2>/dev/null || true

# Give it a moment and confirm it did not immediately die (e.g. port in use).
sleep 3
if ! kill -0 "${tilt_pid}" 2>/dev/null; then
  echo "ERROR: Tilt exited immediately. Last log lines:" >&2
  tail -n 15 "${LOG_FILE}" >&2 || true
  rm -f "${PID_FILE}"
  exit 1
fi

echo "==> Tilt running (pid ${tilt_pid})"
echo "    UI:   http://localhost:10350"
echo "    Logs: ${LOG_FILE}"
echo "    Stop: moon run bootstrap:stop"
