#!/bin/bash
set -e

# Mount a tmpfs for writable NetBird state (idempotent: skip if already mounted so a
# re-run or a `systemctl restart` does not stack mounts).
mkdir -p /tmp/netbird-state
mountpoint -q /tmp/netbird-state || mount -t tmpfs tmpfs /tmp/netbird-state

# Copy persistent state into the writable tmpfs
if [ -d /root/netbird-state ]; then
    cp -a /root/netbird-state/. /tmp/netbird-state/
fi

# Create sock directory (idempotent; /run is tmpfs so this survives nothing but a boot)
mkdir -p /var/run/netbird

# Bind mount over /var/lib/netbird so NetBird sees the writable copy. The mount target
# is created persistently on the (rw) rootfs by the deploy -- the netbird-bin package
# does not ship it -- so this mkdir is a no-op at boot when the rootfs is read-only.
mkdir -p /var/lib/netbird
mountpoint -q /var/lib/netbird || mount --bind /tmp/netbird-state /var/lib/netbird
