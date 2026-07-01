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

# --- Service install steps (added in later tasks) ---------------------------------
# Later slices append, in this order:
#   T2 Tailscale (native apt)   T3 Netdata (native apt)   T4 Caddy (xcaddy+cloudflare)
#   T5 Omada (.deb + JDK/JSVC/mongod)   T6 UniFi OS Server (official Podman installer)
# plus a single grouped `mkdir -p` of every persistent bind-mount target dir, and a
# COPY of files/ (systemd units + configs) and the baked /system/oem cloud-config.
