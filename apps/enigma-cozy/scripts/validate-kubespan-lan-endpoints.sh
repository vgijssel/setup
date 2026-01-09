#!/usr/bin/env bash
# Validate that LAN Kubespan peers use direct LAN IPs (not overlay 100.64.x.x)
#
# LAN nodes (192.168.50.x) should communicate via direct LAN IPs, not via Kubespan
# overlay addresses (100.64.0.x). Using overlay for LAN traffic adds latency and
# creates fragility during discovery service issues. See research.md for details.

set -euo pipefail

all_ok=true

# Check from illusion: should see the-dome via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.10 -e 192.168.50.10 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "the-dome") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.11:"; then
  echo "illusion -> the-dome: ${endpoint} ✅"
else
  echo "illusion -> the-dome: ${endpoint} ❌ (expected 192.168.50.11:51820)"
  all_ok=false
fi

# Check from the-dome: should see illusion via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.11 -e 192.168.50.11 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "illusion") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.10:"; then
  echo "the-dome -> illusion: ${endpoint} ✅"
else
  echo "the-dome -> illusion: ${endpoint} ❌ (expected 192.168.50.10:51820)"
  all_ok=false
fi

# Check from illusion: should see the-toy-factory via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.10 -e 192.168.50.10 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "the-toy-factory") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.12:"; then
  echo "illusion -> the-toy-factory: ${endpoint} ✅"
else
  echo "illusion -> the-toy-factory: ${endpoint} ❌ (expected 192.168.50.12:51820)"
  all_ok=false
fi

# Check from the-dome: should see the-toy-factory via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.11 -e 192.168.50.11 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "the-toy-factory") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.12:"; then
  echo "the-dome -> the-toy-factory: ${endpoint} ✅"
else
  echo "the-dome -> the-toy-factory: ${endpoint} ❌ (expected 192.168.50.12:51820)"
  all_ok=false
fi

# Check from the-toy-factory: should see illusion via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.12 -e 192.168.50.12 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "illusion") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.10:"; then
  echo "the-toy-factory -> illusion: ${endpoint} ✅"
else
  echo "the-toy-factory -> illusion: ${endpoint} ❌ (expected 192.168.50.10:51820)"
  all_ok=false
fi

# Check from the-toy-factory: should see the-dome via LAN IP
endpoint=$(talosctl get kubespanpeerstatuses -n 192.168.50.12 -e 192.168.50.12 -o json 2>/dev/null | jq -rs '.[] | select(.spec.label == "the-dome") | .spec.endpoint')
if echo "${endpoint}" | grep -q "^192.168.50.11:"; then
  echo "the-toy-factory -> the-dome: ${endpoint} ✅"
else
  echo "the-toy-factory -> the-dome: ${endpoint} ❌ (expected 192.168.50.11:51820)"
  all_ok=false
fi

if ${all_ok}; then
  exit 0
else
  exit 1
fi
