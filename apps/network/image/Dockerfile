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

# --- Persistent bind-mount target dirs --------------------------------------------
# Fixed-path services whose data dir is bind-mounted onto the Volume by
# network-mount-data.sh MUST have that path exist in this read-only image (Kairos cannot
# create new root paths at runtime). Nothing here for T2 — Tailscale uses --statedir on
# the Volume (see the tailscaled drop-in), not a bind. T5 appends the Omada dirs:
#   RUN mkdir -p /opt/tplink/EAPController/data /opt/tplink/EAPController/logs

# --- Baked files: systemd units, drop-ins, helper scripts -------------------------
# files/ mirrors the root filesystem, so this lands each file at its final path
# (/usr/bin/*, /etc/systemd/system/*). Executable bits are set explicitly (build context
# modes are not portable across hosts).
COPY files/ /
RUN chmod 0755 /usr/bin/network-mount-data.sh /usr/bin/network-tailscale-up.sh; \
    systemctl enable tailscale-up.service

# --- Service install steps (added in later tasks) ---------------------------------
# Later slices append, in this order:
#   T3 Netdata (native apt)   T4 Caddy (xcaddy+cloudflare)
#   T5 Omada (.deb + JDK/JSVC/mongod)   T6 UniFi OS Server (official Podman installer)
