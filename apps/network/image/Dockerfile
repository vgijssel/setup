# syntax=docker/dockerfile:1
# network — Kairos immutable OS image, built from a pinned Ubuntu 24.04 base.
#
# T0 scaffold: MINIMAL "walking skeleton" — kairos-ify the base with kairos-init and
# nothing else. App services (Omada .deb, UniFi/Podman, Caddy, Tailscale, Netdata) and
# their persistent bind-mount target dirs are added one vertical slice at a time in
# later tasks (see tasks/plan.md).
#
# Built for a selectable TARGETARCH — arm64 for the local fast loop, amd64 for the
# promotion gate. kairos-init reads the target arch from the buildx --platform, so no
# explicit arch flag is needed here.
#
# All versions pinned per repo CLAUDE.md (no :latest, no floating tags).

# kairos-init: transforms a stock distro image into a Kairos-flavored one. Bind-mounted
# into the build (not copied) per the official Kairos Factory guidance.
FROM quay.io/kairos/kairos-init:v0.15.0 AS kairos-init

# --- T4: Caddy build (xcaddy + Cloudflare DNS module) ------------------------------
# Build Caddy from source with the caddy-dns/cloudflare provider baked in (needed for
# ACME DNS-01). Uses the official multi-arch caddy builder image; buildx propagates the
# target platform, so Go produces a native binary for TARGETARCH. All pinned per CLAUDE.md.
FROM caddy:2.11.4-builder AS caddy-builder
ARG CADDY_VERSION=2.11.4
ARG CADDY_CLOUDFLARE_VERSION=v0.2.4
RUN xcaddy build "v${CADDY_VERSION}" \
    --with "github.com/caddy-dns/cloudflare@${CADDY_CLOUDFLARE_VERSION}" \
    --output /out/caddy

# Pinned Ubuntu 24.04 base (by digest).
FROM ubuntu:24.04@sha256:786a8b558f7be160c6c8c4a54f9a57274f3b4fb1491cf65146521ae77ff1dc54

# Version metadata stamped into the Kairos artifact (overridable via --build-arg).
ARG VERSION=0.1.0

# --- Kairos-ify -------------------------------------------------------------------
# Defaults applied: model=generic (core image, no Kubernetes), stage=all (install +
# init), trusted-boot=false, fips=false. This installs the kernel, init system, and
# Kairos framework, producing a bootable immutable OS layer.
RUN --mount=type=bind,from=kairos-init,src=/kairos-init,dst=/kairos-init \
    /kairos-init --version "${VERSION}"

# --- T2: Tailscale (native apt, pinned) -------------------------------------------
# Official Tailscale apt repo for Ubuntu 24.04 (noble). Pinned to the exact version the
# old app ran (v1.80.3) per repo CLAUDE.md — no floating tags. tailscaled is enabled so
# it comes up on boot; the actual tailnet join is a separate oneshot (tailscale-up.service)
# that consumes the authkey delivered via cloud-config.
ARG TAILSCALE_VERSION=1.80.3
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg; \
    curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/noble.noarmor.gpg \
      -o /usr/share/keyrings/tailscale-archive-keyring.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/tailscale-archive-keyring.gpg] https://pkgs.tailscale.com/stable/ubuntu noble main" \
      > /etc/apt/sources.list.d/tailscale.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends "tailscale=${TAILSCALE_VERSION}"; \
    systemctl enable tailscaled.service; \
    rm -rf /var/lib/apt/lists/*

# --- T3: Netdata (native apt, pinned) ---------------------------------------------
# Official Netdata stable apt repo (flat: ".../ubuntu/ noble/"), keyed via signed-by.
# Pinned to 2.10.3 per repo CLAUDE.md. netdata is enabled to come up on boot; the Netdata
# Cloud claim (secret) is delivered later via cloud-config, so a local boot runs unclaimed.
# --no-install-recommends keeps the optional plugin recommends out; the mandatory plugin
# Depends still come in.
ARG NETDATA_VERSION=2.10.3
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    set -eux; \
    apt-get update; \
    curl -fsSL https://repo.netdata.cloud/netdatabot.gpg.key \
      | gpg --dearmor -o /usr/share/keyrings/netdata-archive-keyring.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/netdata-archive-keyring.gpg] https://repo.netdata.cloud/repos/stable/ubuntu/ noble/" \
      > /etc/apt/sources.list.d/netdata.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends "netdata=${NETDATA_VERSION}"; \
    systemctl enable netdata.service; \
    rm -rf /var/lib/apt/lists/*

# --- T5: Omada Controller (official TP-Link .deb, native) -------------------------
# The .deb is Architecture: all (pure Java) — no force-arch needed on arm64; only its
# native deps are arch-specific: OpenJDK 17, jsvc, and MongoDB. Omada launches its OWN
# mongod with dbpath under /opt/tplink/EAPController/data/db, so persisting `data`
# captures the DB (no system /var/lib/mongodb). All pinned per CLAUDE.md; the .deb is
# fetched from TP-Link's date-stamped URL and sha256-verified.
#
# The postinst normally runs `tpeap start`, which BLOCKS in a poll loop (up to ~40 min)
# waiting for the controller — fatal in a build. Preseeding omadac/init-cluster-mode=true
# (vendor semantics: "do not start after install") makes the postinst skip that start; the
# controller still boots normally at runtime via the tpeap sysv unit. update-rc.d in the
# postinst enables tpeap, which systemd's sysv-generator turns into tpeap.service.
ARG MONGODB_VERSION=8.0.26
ARG OMADA_VERSION=6.2.10.17
ARG OMADA_DEB_URL=https://static.tp-link.com/upload/software/2026/202604/20260429/Omada_Network_Application_v6.2.10.17_linux_x64_20260428102045.deb
ARG OMADA_DEB_SHA256=4a8d3542ef28eaca22e62cc857a7b08a8ef4269d890d6a013dc948d03cdc4f33
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/cache/omada-dl,sharing=locked \
    set -eux; \
    apt-get update; \
    # MongoDB 8.0 official apt repo (server only — Omada runs its own mongod).
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
      | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" \
      > /etc/apt/sources.list.d/mongodb-org-8.0.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      openjdk-17-jre-headless jsvc curl adduser "mongodb-org-server=${MONGODB_VERSION}"; \
    # Fetch + verify the official Omada .deb (cached across builds).
    curl -fsSL "${OMADA_DEB_URL}" -o /var/cache/omada-dl/omada.deb; \
    echo "${OMADA_DEB_SHA256}  /var/cache/omada-dl/omada.deb" | sha256sum -c -; \
    echo 'omadac omadac/init-cluster-mode boolean true' | debconf-set-selections; \
    DEBIAN_FRONTEND=noninteractive dpkg -i /var/cache/omada-dl/omada.deb; \
    rm -rf /var/lib/apt/lists/*

# --- T6: UniFi OS Server (official Podman installer, first-boot) -------------------
# UOS ships no .deb / no public image: the ~830 MB installer binary bundles the UOS OCI
# image and runs it as a ROOTLESS Podman container under the `uosserver` user (nested
# systemd). Ubiquiti requires Podman >= 4.3.1 + slirp4netns >= 1.2 (Ubuntu 24.04's 4.9.3
# qualifies). Build-time baking is impractical (needs live logind/systemd, and Ubiquiti
# says don't clone installed instances), so we bake the PREREQS + stage the installer and
# run it on FIRST BOOT (network-uos-install.sh). The uosserver user + subuid/subgid are
# baked here so they survive Kairos' ephemeral /etc. NB: no /etc/containers/storage.conf is
# baked — a partial one breaks podman ("runroot must be set"); rootless podman auto-selects
# the overlay driver with fuse-overlayfs on the ext4 Volume, and the graphroot follows the
# uosserver HOME (/var/lib/uosserver, bind-mounted onto the Volume).
ARG UOS_VERSION=5.1.19
ARG UOS_INSTALLER_URL=https://fw-download.ubnt.com/data/unifi-os-server/e027-linux-arm64-5.1.19-ebdd998e-306a-4880-af41-2bdc50e91e70.19-arm64
ARG UOS_INSTALLER_SHA256=4e18c1f143cea3b364619406c35cf9d2123732bcdc500e41196e41196faefacf
RUN --security=insecure \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/cache/uos-dl,sharing=locked \
    set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      podman slirp4netns passt uidmap fuse-overlayfs iptables curl wget ca-certificates; \
    # Bake the uosserver user + rootless subuid/subgid ranges (must survive ephemeral /etc).
    # A real shell is required: the installer + service run rootless Podman as this user via
    # `su`, which rejects a nologin shell ("This account is currently not available").
    useradd --system --create-home --home-dir /var/lib/uosserver --shell /bin/bash uosserver; \
    usermod --add-subuids 100000-165535 --add-subgids 100000-165535 uosserver; \
    # Fetch + verify the official installer (pinned URL + sha256). It stays in the build
    # cache mount — it is NOT installed into the image, so the 834 MB binary never ships.
    curl -fsSL "${UOS_INSTALLER_URL}" -o /var/cache/uos-dl/uos-installer; \
    echo "${UOS_INSTALLER_SHA256}  /var/cache/uos-dl/uos-installer" | sha256sum -c -; \
    chmod 0755 /var/cache/uos-dl/uos-installer; \
    # Build-time install (rootless Podman works via --security=insecure). Shim systemctl/
    # loginctl so the installer's service start + enable-linger no-op (no init in a build
    # layer); it still creates the /usr/bin symlink (writable at build), bakes uosserver.service
    # into /etc (survives ephemeral /etc), and loads the UOS OCI image into uosserver's storage.
    mkdir -p /build-shim; \
    for c in systemctl loginctl; do printf '#!/bin/sh\nexit 0\n' >"/build-shim/${c}"; chmod 0755 "/build-shim/${c}"; done; \
    install -d -o uosserver -g uosserver /run/user/999; \
    PATH="/build-shim:${PATH}" XDG_RUNTIME_DIR=/run/user/999 \
      /var/cache/uos-dl/uos-installer --non-interactive \
      || echo "!! build-time UOS installer exited non-zero (start/linger steps are shimmed; expected)"; \
    # Bake the loaded UOS image as a plain OCI-archive tar: AuroraBoot can't pack the rootless
    # graphroot (subuid-owned overlay dirs → permission denied on image→disk dump). First boot
    # loads this tar onto the Volume. Then delete the graphroot so the image packs cleanly and
    # doesn't bloat the read-only OS layers.
    uos_img="$(su uosserver -c 'XDG_RUNTIME_DIR=/run/user/999 podman images --format "{{.Repository}}:{{.Tag}}"' | grep uosserver | head -1)"; \
    test -n "${uos_img}"; \
    # Bake the tar under /usr/share (on the read-only COS_ACTIVE rootfs, always visible at
    # runtime) — NOT /usr/local, which the empty COS_PERSISTENT overlay shadows on first boot.
    install -d -o uosserver -g uosserver /usr/share/uosserver; \
    su uosserver -c "XDG_RUNTIME_DIR=/run/user/999 podman save --format oci-archive -o /usr/share/uosserver/image.tar '${uos_img}'"; \
    echo "${uos_img}" > /usr/share/uosserver/image.ref; \
    rm -rf /var/lib/uosserver/.local /var/lib/uosserver/.config /var/lib/uosserver/.cache; \
    rm -rf /build-shim /var/lib/apt/lists/*

# --- T4: Caddy binary (built above with the Cloudflare DNS module) ----------------
COPY --from=caddy-builder /out/caddy /usr/bin/caddy

# --- Persistent bind-mount target dirs --------------------------------------------
# Fixed-path services whose data dir is bind-mounted onto the Volume by
# network-mount-data.sh MUST have that path exist in this read-only image (Kairos cannot
# create new root paths at runtime). Tailscale/Netdata/Caddy use data-dir flags (no bind).
# The Omada data/logs dirs already exist here — the .deb's postinst created them under
# /opt/tplink/EAPController — so network-mount-data.sh binds them onto the Volume at boot.

# --- Baked files: systemd units, drop-ins, helper scripts -------------------------
# files/ mirrors the root filesystem, so this lands each file at its final path
# (/usr/bin/*, /etc/systemd/system/*). Executable bits are set explicitly (build context
# modes are not portable across hosts).
COPY files/ /
RUN chmod 0755 /usr/bin/network-mount-data.sh /usr/bin/network-tailscale-up.sh \
      /usr/bin/network-caddy-run.sh /usr/bin/network-uos-load.sh; \
    systemctl enable tailscale-up.service caddy.service \
      uosserver-load.service uosserver.service; \
    # Pin the UOS version: disable the auto-updater. Its unit was created in /etc by the
    # build-time install, so remove it first (mask can't symlink over an existing file), then
    # mask so uosserver.service's soft Wants= never pulls it in.
    rm -f /etc/systemd/system/uosserver-updater.service; \
    systemctl mask uosserver-updater.service
