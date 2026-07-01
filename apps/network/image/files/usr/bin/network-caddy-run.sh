#!/usr/bin/env bash
# Launch Caddy bound to the Tailscale interface only. The admin UIs are Tailscale-only, so
# we wait for tailscale0 to get its 100.x IP, export it as TS_IP (referenced by the
# Caddyfile's `bind {env.TS_IP}`), then exec caddy so systemd's sd_notify still tracks it.
# With no tailnet join (e.g. a local no-secret VM boot) tailscale0 never appears and this
# exits non-zero — expected; the real bind + LE issuance is verified in the live phase.
set -euo pipefail

for _ in $(seq 1 30); do
	ip -4 -o addr show tailscale0 >/dev/null 2>&1 && break
	sleep 2
done

TS_IP="$(ip -4 -o addr show tailscale0 2>/dev/null | awk '{print $4}' | cut -d/ -f1)"
if [[ -z "${TS_IP}" ]]; then
	echo "tailscale0 has no IPv4 yet — is the tailnet join complete?" >&2
	exit 1
fi
export TS_IP

exec /usr/bin/caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
