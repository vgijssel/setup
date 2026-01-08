#!/bin/bash
# Validates that /etc/hosts maps hostnames to management IPs (192.168.50.x)
# and not to br0 IPs (10.50.50.x). Returns formatted /etc/hosts content for each node.

set -euo pipefail

errors=""
output=""

for node in illusion the-dome the-toy-factory; do
  # Determine expected IP for this node
  case ${node} in
    illusion) expected_ip="192.168.50.10" ;;
    the-dome) expected_ip="192.168.50.11" ;;
    the-toy-factory) expected_ip="192.168.50.12" ;;
    *) echo "Unknown node: ${node}" >&2; exit 1 ;;
  esac
  
  # Add node header to output
  output="${output}${node}:\n"
  
  # Read /etc/hosts from the node
  hosts_content=$(talosctl read /etc/hosts -n "${expected_ip}" -e "${expected_ip}" 2>/dev/null || echo "ERROR: Unable to read /etc/hosts")
  
  if echo "${hosts_content}" | grep -q "ERROR:"; then
    errors="${errors}Unable to read /etc/hosts from ${node}; "
    output="${output}ERROR: Unable to read /etc/hosts from ${node}\n"
  else
    # Add each line from /etc/hosts to output
    while IFS= read -r line; do
      # Skip empty lines and comments for cleaner output, but include all IP mappings
      if [[ -n "${line}" && ! "${line}" =~ ^[[:space:]]*# ]]; then
        output="${output}${line}\n"
      fi
    done <<< "${hosts_content}"
    
    # Validate that the node hostname maps to the correct IP
    actual_ip=$(echo "${hosts_content}" | grep "^[0-9]" | grep -w "${node}" | awk '{print $1}' | head -1)
    
    if [[ -z "${actual_ip}" ]]; then
      errors="${errors}${node} not found in /etc/hosts; "
    elif [[ "${actual_ip}" != "${expected_ip}" ]]; then
      errors="${errors}${node} maps to ${actual_ip} (expected ${expected_ip}); "
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
