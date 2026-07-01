#!/usr/bin/env bash
# Join the Tailscale tailnet using the reusable TAGGED authkey delivered via cloud-config.
# Invoked by tailscale-up.service (oneshot). The authkey is a REUSABLE key advertising
# `tag:network-controllers`, so a server recreate re-joins under the same stable hostname
# and the tailnet ACL grants access by tag. Env comes from /etc/tailscale/authkey.env
# (written by cloud-config from 1Password); with no authkey the service is skipped, so a
# local no-secret VM boot never attempts an external join.
set -euo pipefail

: "${TS_AUTHKEY:?TS_AUTHKEY not set}"

args=(--authkey="${TS_AUTHKEY}" --accept-dns=false)
[[ -n "${TS_HOSTNAME:-}" ]] && args+=(--hostname="${TS_HOSTNAME}")
[[ -n "${TS_TAG:-}" ]] && args+=(--advertise-tags="${TS_TAG}")

exec tailscale up "${args[@]}"
