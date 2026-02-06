#!/usr/bin/env bash
# Validate LINSTOR storage interfaces are configured correctly
# Outputs a formatted ASCII table of storage network interfaces
#
# Storage interfaces enable point-to-point DRBD replication over the 25Gbps
# dedicated storage network. See prd-linstor-network.md for architecture details.

set -euo pipefail

# Expected storage interfaces (node:interface -> IP)
declare -A EXPECTED_INTERFACES=(
  ["illusion:storage-dome"]="10.50.1.0"
  ["illusion:storage-toyfactory"]="10.50.2.1"
  ["the-dome:storage-illusion"]="10.50.1.1"
  ["the-dome:storage-toyfactory"]="10.50.3.0"
  ["the-toy-factory:storage-illusion"]="10.50.2.0"
  ["the-toy-factory:storage-dome"]="10.50.3.1"
)

errors=0

# Run linstor command via kubectl exec into controller pod
linstor_exec() {
  kubectl exec -n cozy-linstor deploy/linstor-controller -- linstor "$@" 2>/dev/null
}

# Get all interfaces for a node (returns: interface_name:ip)
get_interfaces() {
  local node="$1"
  linstor_exec node interface list "$node" | grep -E "^\| storage-" | awk -F'|' '{gsub(/ /,"",$2); gsub(/ /,"",$4); print $2":"$4}'
}

# Track found interfaces
declare -A found_interfaces

# Print table header
echo "LINSTOR Storage Interfaces:"
echo ""

# Iterate through each node
for node in illusion the-dome the-toy-factory; do
  echo "${node}:"
  interfaces_output=$(get_interfaces "$node" || true)

  if [[ -z "$interfaces_output" ]]; then
    echo "  (no storage interfaces found)"
    continue
  fi

  while IFS= read -r line; do
    if [[ -n "$line" ]]; then
      iface_name=$(echo "$line" | cut -d: -f1)
      iface_ip=$(echo "$line" | cut -d: -f2)

      # Only show storage interfaces (storage-dome, storage-illusion, storage-toyfactory)
      if [[ "$iface_name" =~ ^storage- ]]; then
        key="${node}:${iface_name}"
        found_interfaces["$key"]="$iface_ip"

        # Check if IP matches expected
        expected_ip="${EXPECTED_INTERFACES[$key]:-}"
        if [[ "$iface_ip" == "$expected_ip" ]]; then
          echo "  - ${iface_name}: ${iface_ip} ✅"
        else
          echo "  - ${iface_name}: ${iface_ip} ❌ (expected ${expected_ip})"
          errors=$((errors + 1))
        fi
      fi
    fi
  done <<< "$interfaces_output"
  echo ""
done

# Check for missing interfaces
missing_count=0
for key in "${!EXPECTED_INTERFACES[@]}"; do
  if [[ -z "${found_interfaces[$key]:-}" ]]; then
    node=$(echo "$key" | cut -d: -f1)
    iface=$(echo "$key" | cut -d: -f2)
    echo "MISSING: ${node} ${iface} (expected IP: ${EXPECTED_INTERFACES[$key]})"
    missing_count=$((missing_count + 1))
    errors=$((errors + 1))
  fi
done

if [[ $missing_count -gt 0 ]]; then
  echo ""
fi

# Summary
if [[ $errors -eq 0 ]]; then
  echo "All 6 storage interfaces configured correctly"
  exit 0
else
  echo "Found $errors error(s) in storage interface configuration"
  exit 1
fi
