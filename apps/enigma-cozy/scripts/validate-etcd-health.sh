#!/bin/bash
# Validates that etcd service is running and healthy on all control plane nodes.
# Returns formatted health status for each node.

set -euo pipefail

errors=""
output="etcd Service Health:\n"

# Define control plane nodes with their IPs
declare -A nodes=(
  ["illusion"]="192.168.50.10"
  ["the-dome"]="192.168.50.11"
  ["the-toy-factory"]="192.168.50.12"
)

# Check each node
for node in illusion the-dome the-toy-factory; do
  node_ip="${nodes[${node}]}"

  output="${output}${node} (${node_ip}):\n"

  # Query etcd service status
  service_output=$(talosctl -n "${node_ip}" -e "${node_ip}" service etcd 2>/dev/null || echo "ERROR")

  if echo "${service_output}" | grep -q "ERROR"; then
    errors="${errors}Unable to query etcd service on ${node}; "
    output="${output}  - ERROR: Unable to query service\n"
  else
    # Extract STATE and HEALTH from service output
    state=$(echo "${service_output}" | grep "^STATE" | awk '{print $2}')
    health=$(echo "${service_output}" | grep "^HEALTH" | awk '{print $2}')

    # Validate STATE
    if [[ "${state}" = "Running" ]]; then
      output="${output}  - STATE: ${state} ✅\n"
    else
      errors="${errors}${node} etcd STATE is ${state} (expected Running); "
      output="${output}  - STATE: ${state} ❌\n"
    fi

    # Validate HEALTH
    if [[ "${health}" = "OK" ]]; then
      output="${output}  - HEALTH: ${health} ✅\n"
    else
      errors="${errors}${node} etcd HEALTH is ${health} (expected OK); "
      output="${output}  - HEALTH: ${health} ❌\n"
    fi
  fi

  output="${output}\n"
done

# Output the formatted result
echo -e "${output}"

# Exit with error if any issues found
if [[ -n "${errors}" ]]; then
  echo "ERRORS: ${errors}" >&2
  exit 1
fi

exit 0
