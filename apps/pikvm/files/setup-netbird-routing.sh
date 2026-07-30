#!/bin/bash
set -e

# NetBird site-to-VPN routing peer: enable IPv4 forwarding and SNAT (masquerade) LAN
# traffic onto the NetBird interface so LAN devices that do NOT run NetBird can reach peers
# inside the mesh (e.g. the Omada controller) through this box. Re-asserted at every boot by
# netbird-routing.service (the read-only rootfs would not otherwise persist the sysctl or the
# iptables rule) and on demand by the deploy. Idempotent: safe to run repeatedly.
#
# The NetBird dashboard "Masquerade" route flag only covers the mesh->LAN direction, so the
# LAN->mesh SNAT rule is installed here explicitly (per the NetBird site-to-VPN docs). Values
# are injected by netbird-routing.service (Environment=), baked from the deploy; the defaults
# match this box's LAN (see deploy.py Task 8/9).

LAN_CIDR="${NB_ROUTING_LAN_CIDR:-192.168.0.0/16}"
IFACE="${NB_ROUTING_IFACE:-wt0}"

# Forward IPv4 between the LAN and the NetBird interface.
sysctl -w net.ipv4.ip_forward=1

# Masquerade LAN traffic egressing the NetBird interface so the destination mesh peer sees
# this peer's NetBird IP as the source (its access-control policy recognises it). -C tests
# for the rule first so a boot re-assert or a re-run never stacks duplicate rules.
if ! iptables -t nat -C POSTROUTING -s "${LAN_CIDR}" -o "${IFACE}" -j MASQUERADE 2>/dev/null; then
    iptables -t nat -A POSTROUTING -s "${LAN_CIDR}" -o "${IFACE}" -j MASQUERADE
fi
