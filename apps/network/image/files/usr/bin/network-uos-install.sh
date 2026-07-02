#!/usr/bin/env bash
# First-boot install of UniFi OS Server via Ubiquiti's official Podman installer.
#
# UOS has no .deb and no public registry image — the installer is a self-contained binary
# that bundles the UOS OCI image and runs it as a ROOTLESS Podman container under the
# `uosserver` user (nested systemd inside). Ubiquiti's guidance + the immutable-OS model
# mean we run it on first boot (not at image-build time), with the uosserver user + podman
# baked into the image so they survive the ephemeral /etc. All UOS state lands under
# /var/lib/uosserver, which network-mount-data.sh bind-mounts onto the data Volume.
#
# Best-effort + idempotent: guarded by a marker on the Volume so it runs once; a failure
# (e.g. the installer's disk-space pre-flight — see T6 notes in tasks/todo.md) is logged and
# does NOT fail the boot, and leaves no marker so a later boot retries.
set -uo pipefail

INSTALLER=/usr/lib/uos-installer
MARKER=/var/lib/uosserver/.uos-installed

[[ -x "${INSTALLER}" ]] || {
	echo "UOS installer not staged at ${INSTALLER}; nothing to do" >&2
	exit 0
}
[[ -e "${MARKER}" ]] && {
	echo "UOS already installed (marker present); skipping"
	exit 0
}

# Rootless containers must keep running after the login session ends / across reboots.
loginctl enable-linger uosserver || true

# Non-interactive install (the flag this installer build exposes). network-mount-data.sh
# has already bind-mounted /var/tmp onto the Volume so the installer's temp-space check passes.
if "${INSTALLER}" --non-interactive; then
	touch "${MARKER}"
	echo "UOS install complete."
else
	echo "!! UOS install did not complete (see 'uos-installer' output above; likely the /home" >&2
	echo "!! disk pre-flight vs Kairos partition sizing — see T6 notes). Leaving no marker." >&2
fi
