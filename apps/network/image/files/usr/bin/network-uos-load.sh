#!/usr/bin/env bash
# First-boot load of the UniFi OS Server image onto the data Volume.
#
# UOS is INSTALLED at image-build time (uosserver.service, CLI, and /usr/bin symlinks are
# baked), but its container image + writable data must live on the Volume, not in the
# read-only OS image. The image is baked as a plain oci-archive tar (on /usr/share, the
# read-only rootfs) and loaded here into uosserver's rootless graphroot — which
# network-mount-data.sh has bind-mounted onto the Volume — the first time this Volume is
# seen (marker-guarded). Lingering is (re)enabled every boot so the rootless container keeps
# running across sessions/reboots.
#
# Notes learned the hard way:
#   - `podman load -i` does NOT auto-detect this oci-archive ("payload does not match any of
#     the supported image formats"); the explicit `oci-archive:` transport via `podman pull`
#     does, and preserves the repo:tag.
#   - Podman stages the copy under TMPDIR; Kairos' /var/tmp is a tiny tmpfs, so point TMPDIR
#     at the Volume or the pull fails "no space left on device".
set -euo pipefail

uid_uos="$(id -u uosserver)"
runtime="/run/user/${uid_uos}"
home_uos="$(getent passwd uosserver | cut -d: -f6)"
tar=/usr/share/uosserver/image.tar
tmp=/var/lib/data/uos-tmp
marker="${home_uos}/.local/.image-loaded"

loginctl enable-linger uosserver || true
mkdir -p "${runtime}" "${tmp}"
chown uosserver:uosserver "${runtime}" "${tmp}"

[[ -e "${marker}" ]] && {
	echo "UOS image already loaded on this volume; skipping"
	exit 0
}
[[ -f "${tar}" ]] || {
	echo "UOS image tar missing at ${tar}" >&2
	exit 1
}

echo "Loading UOS image from ${tar} into the uosserver graphroot (on the volume)..."
su uosserver -c "HOME=${home_uos} XDG_RUNTIME_DIR=${runtime} TMPDIR=${tmp} podman pull oci-archive:${tar}"
touch "${marker}"
echo "UOS image loaded."
