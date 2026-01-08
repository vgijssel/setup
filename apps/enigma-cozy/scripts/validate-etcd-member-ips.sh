#!/bin/bash
# Validates that all etcd members use management network IPs (192.168.50.x)
# for both peer URLs and client URLs. Returns formatted member configuration.

set -euo pipefail

errors=""
output="etcd Member Configuration:\n"

# Define nodes with expected IPs
declare -A nodes=(
  ["illusion"]="192.168.50.10"
  ["the-dome"]="192.168.50.11"
  ["the-toy-factory"]="192.168.50.12"
)

# Query etcd members from any node (using illusion)
members_output=$(talosctl -n 192.168.50.10 -e 192.168.50.10 etcd members 2>/dev/null || echo "ERROR")

if echo "${members_output}" | grep -q "^ERROR"; then
  echo "ERROR: Unable to query etcd members" >&2
  exit 1
fi

# Process each node
for node in illusion the-dome the-toy-factory; do
  expected_ip="${nodes[${node}]}"

  output="${output}${node}:\n"

  # Extract the line for this node from the table output
  member_line=$(echo "${members_output}" | grep -w "${node}" || echo "")

  if [[ -z "${member_line}" ]]; then
    errors="${errors}Unable to find etcd member for ${node}; "
    output="${output}  - ERROR: Member not found\n"
  else
    # Extract peer URL and client URL from the table columns
    peer_url=$(echo "${member_line}" | awk '{print $4}')
    client_url=$(echo "${member_line}" | awk '{print $5}')

    # Validate peer URL uses management IP
    if echo "${peer_url}" | grep -q "${expected_ip}"; then
      output="${output}  - Peer URL: ${peer_url} ✅\n"
    else
      errors="${errors}${node} peer URL uses wrong IP: ${peer_url} (expected ${expected_ip}); "
      output="${output}  - Peer URL: ${peer_url} ❌\n"
    fi

    # Validate client URL uses management IP
    if echo "${client_url}" | grep -q "${expected_ip}"; then
      output="${output}  - Client URL: ${client_url} ✅\n"
    else
      errors="${errors}${node} client URL uses wrong IP: ${client_url} (expected ${expected_ip}); "
      output="${output}  - Client URL: ${client_url} ❌\n"
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
