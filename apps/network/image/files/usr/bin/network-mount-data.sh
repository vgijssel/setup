#!/usr/bin/env bash
# Mount the persistent DATA VOLUME at /var/lib/data and prepare each service's data dir on
# it. The data volume (a Hetzner Volume in prod, a 2nd virtual disk locally) is the single
# block device that survives an OS-disk rebuild; SPEC §10 requires all controller/service
# state to live on it so a server recreate restores everything.
#
# Two ways state reaches the Volume (both used here):
#   1. data-dir flag  — services that support one (tailscaled --statedir, Podman graphroot,
#      Netdata dirs, Caddy XDG_DATA_HOME) are pointed straight at /var/lib/data/<svc>. This
#      is preferred: it sidesteps this Kairos build's default PERSISTENT_STATE_PATHS, which
#      would otherwise bind some of these onto the OS disk (COS_PERSISTENT), not the Volume.
#   2. bind mount     — services with a FIXED data path (e.g. Omada's /opt/tplink/...) get
#      that path bind-mounted onto the Volume. Each such target must also exist in the
#      read-only image (`mkdir -p` in the Dockerfile — Kairos can't create root paths at
#      runtime), and /var is a tmpfs overlay reset every boot, so this runs on every boot.
#
#   network-mount-data.sh <data-device>    e.g. /dev/vdb (local QEMU) | /dev/sdb (Hetzner)
set -euo pipefail

DEV="${1:?usage: network-mount-data.sh <data-device>}"
LABEL="ncdata"

mkdir -p /var/lib/data
# Non-destructive: only format when the device has no filesystem (a fresh Volume/disk),
# so a server recreate that reattaches an existing Volume keeps its data.
blkid "${DEV}" >/dev/null 2>&1 || mkfs.ext4 -L "${LABEL}" "${DEV}"
mountpoint -q /var/lib/data || mount "${DEV}" /var/lib/data

# (1) data-dir services: pre-create their dirs on the Volume (grows per task, T2-T6).
mkdir -p \
	/var/lib/data/tailscale \
	/var/lib/data/netdata \
	/var/lib/data/netdata-cache
# ^ T2 Tailscale node state (--statedir); T3 Netdata lib+registry / cache (netdata.conf).
# Netdata drops privileges to the netdata user, so its dirs must be owned by it. (Only
# chown when the user exists — it's baked at image build.)
if id netdata >/dev/null 2>&1; then
	chown netdata:netdata /var/lib/data/netdata /var/lib/data/netdata-cache
fi

# (2) fixed-path services: bind their path onto the Volume (added in T5 — Omada
#     /opt/tplink/EAPController/{data,logs}). Format per entry: "<src-on-volume> <dst>".
BIND_MOUNTS=(
)
for entry in "${BIND_MOUNTS[@]}"; do
	# shellcheck disable=SC2086 # intentional word split: entry is "<src> <dst>"
	set -- ${entry}
	src="$1" dst="$2"
	mkdir -p "${src}" "${dst}"
	mountpoint -q "${dst}" || mount --bind "${src}" "${dst}"
done
