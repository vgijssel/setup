#!/bin/bash
set -e

# Mount a tmpfs for writable NetBird state
mkdir -p /tmp/netbird-state
mount -t tmpfs tmpfs /tmp/netbird-state

# Copy persistent state into the writable tmpfs
if [ -d /root/netbird-state ]; then
    cp -a /root/netbird-state/. /tmp/netbird-state/
fi

# Create sock directory
mkdir /var/run/netbird

# Bind mount over /var/lib/netbird so NetBird sees the writable copy
mkdir -p /var/lib/netbird
mountpoint -q /var/lib/netbird && umount /var/lib/netbird || true
mount --bind /tmp/netbird-state /var/lib/netbird
