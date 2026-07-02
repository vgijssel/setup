#!/usr/bin/env bash
# First-boot load of the UniFi OS Server image onto the data Volume + arm the vendor launcher
# to CREATE its container.
#
# UOS is INSTALLED at image-build time (uosserver.service, CLI, and /usr/bin symlinks are
# baked), but its container image + writable data must live on the Volume, not in the
# read-only OS image. The image is baked as a plain oci-archive tar (on /usr/share, the
# read-only rootfs) and loaded here into uosserver's rootless graphroot — which
# network-mount-data.sh has bind-mounted onto the Volume — the first time this Volume is
# seen (marker-guarded).
#
# Two things the vendor setup assumes but which are NOT true after our build-time bake:
#   1. A per-user systemd session bus. The container runs `--systemd=always` with a
#      healthcheck, so rootless podman needs `user@999`'s session bus (dbus-user-session,
#      started by lingering) to use the systemd cgroup manager + register the healthcheck
#      transient timer. We enable lingering and WAIT for that bus before letting the launcher
#      run, else the first container is created under cgroupfs and exits 255.
#   2. A pre-created container named `uosserver`. The launcher only `podman start`s an
#      existing container; its create path (`podman run`) triggers only on an arg-hash
#      mismatch vs the baked server.conf. We ship only the IMAGE (the build-time container was
#      wiped so AuroraBoot could pack the rootfs), so when the container is absent we blank
#      the baked CONTAINER_ARG_HASH → the launcher runs a fresh `podman run` to create it.
#      (The launcher rewrites the real hash afterwards, so later boots take the fast start
#      path against the now-persistent container on the Volume.)
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
server_conf=/var/lib/uosserver/server.conf
tar=/usr/share/uosserver/image.tar
tmp=/var/lib/data/uos-tmp
marker="${home_uos}/.local/.image-loaded"

# Run a rootless podman query/command as the uosserver user with its runtime dir.
uos_podman() { su uosserver -c "HOME=${home_uos} XDG_RUNTIME_DIR=${runtime} TMPDIR=${tmp} podman $*"; }

# (1) Lingering + session bus. enable-linger starts (and re-arms on every boot) the user@999
# systemd instance, which socket-activates dbus.socket (dbus-user-session) → /run/user/999/bus.
loginctl enable-linger uosserver || true
mkdir -p "${runtime}" "${tmp}"
chown uosserver:uosserver "${runtime}" "${tmp}"
echo "Waiting for the uosserver session bus (${runtime}/bus) ..."
for _ in $(seq 1 60); do
	[[ -S "${runtime}/bus" ]] && break
	sleep 1
done
[[ -S "${runtime}/bus" ]] || echo "!! ${runtime}/bus not up after 60s — container may fall back to cgroupfs" >&2

# (2) Load the UOS image onto the Volume (once per Volume).
if [[ -e "${marker}" ]]; then
	echo "UOS image already loaded on this volume; skipping load"
else
	[[ -f "${tar}" ]] || {
		echo "UOS image tar missing at ${tar}" >&2
		exit 1
	}
	echo "Loading UOS image from ${tar} into the uosserver graphroot (on the volume)..."
	uos_podman "pull oci-archive:${tar}"
	touch "${marker}"
	echo "UOS image loaded."
fi

# (3) Arm the launcher to create the container when it's absent (fresh Volume, or a recreate
# that lost it): blank the baked arg-hash so the launcher's `podman run` path fires.
# shellcheck disable=SC2310 # intentional: branch on container existence (boolean probe)
if uos_podman "container exists uosserver"; then
	echo "uosserver container already present; leaving server.conf arg-hash intact"
else
	echo "uosserver container absent → blanking CONTAINER_ARG_HASH so the launcher creates it"
	sed -i 's/^CONTAINER_ARG_HASH=.*/CONTAINER_ARG_HASH=/' "${server_conf}"
fi
