#!/usr/bin/env bash
set -euo pipefail

SNAPSHOT_DIR="/secrets/enigma-cozy/etcd-snapshots"
SNAPSHOT_FILE="${SNAPSHOT_DIR}/etcd-snapshot-$(date +%Y%m%d-%H%M%S).db"
NODE_IP="192.168.50.10"

mkdir -p "${SNAPSHOT_DIR}"
talosctl etcd snapshot "${SNAPSHOT_FILE}" --nodes "${NODE_IP}" --endpoints "${NODE_IP}"

echo "Snapshot saved to ${SNAPSHOT_FILE}"
