#!/bin/bash
set -e

# Mount a dedicated 2 GiB tmpfs "RAM disk" for netdata's dbengine metrics database.
#
# WHY: netdata's ML anomaly detection only runs on the dbengine backend (with `[db] mode =
# ram` the agent auto-disables ML), and dbengine needs a writable store with enough
# retention to train its per-dimension models. PiKVM's rootfs is read-only, so dbengine
# cannot live on disk -- this tmpfs gives it ~24h of history entirely in RAM. The store is
# recreated empty on every boot (metrics history is deliberately non-durable; only netdata's
# Cloud IDENTITY persists, via netdata-overlay.service).
#
# This is a SEPARATE mount from /var/lib/netdata (the identity tmpfs that
# netdata-overlay.service snapshots to /root/netdata-state): keeping the multi-hundred-MB
# metrics DB on its own tmpfs guarantees it is NEVER snapshotted onto the rootfs. netdata.conf
# points [directories] cache here, and dbengine stores its tier files under it.

DB_DIR=/var/lib/netdatadb
SIZE=2G

mkdir -p "$DB_DIR"
# Idempotent: skip if already mounted so a re-run / `systemctl restart` does not stack mounts.
mountpoint -q "$DB_DIR" || mount -t tmpfs -o "size=${SIZE},mode=0750" tmpfs "$DB_DIR"

# netdata runs as netdata:netdata (uid/gid 946); it must own the dbengine storage dir so it
# can create the tier files under it.
chown netdata:netdata "$DB_DIR"
