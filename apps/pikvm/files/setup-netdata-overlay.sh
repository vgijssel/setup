#!/bin/bash
set -e

# Persist netdata's CLOUD IDENTITY (not its metrics) across reboots on the read-only
# rootfs. netdata's lib dir holds the machine GUID (registry/) and the Netdata Cloud
# claim (cloud.d/: claimed_id + this node's private key). netdata.conf points [db] to RAM
# and cache/log to the /run tmpfs, so METRICS never touch disk; only this small identity
# (a few KB) is snapshotted to /root/netdata-state so the Cloud node stays stable (no
# duplicate node on every boot). Mirrors the NetBird overlay slice (deploy.py Task 4).

# tmpfs over the lib dir so netdata's runtime writes to it stay in RAM (idempotent: skip
# if already mounted so a re-run / `systemctl restart` does not stack mounts).
mkdir -p /var/lib/netdata
mountpoint -q /var/lib/netdata || mount -t tmpfs tmpfs /var/lib/netdata

# Restore the persisted identity into the writable tmpfs before netdata starts, so it
# comes up already-claimed and reconnects as the same Cloud node.
if [ -d /root/netdata-state ]; then
    cp -a /root/netdata-state/. /var/lib/netdata/
fi

# netdata runs as netdata:netdata; it must own its lib dir + restored contents.
chown -R netdata:netdata /var/lib/netdata
