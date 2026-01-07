#!/bin/bash
# Validates that OVN database ports (6641-6644) are bound to management IPs (192.168.50.x)
# and not to br0 IPs (10.50.50.x). Returns formatted output showing all port bindings.

set -euo pipefail

# Check if kubectl is available and cluster is reachable
if ! kubectl cluster-info &>/dev/null; then
  echo "ERROR: Unable to connect to Kubernetes cluster" >&2
  exit 1
fi

errors=""
output=""

for node_num in 10 11 12; do
  node_ip="192.168.50.$node_num"
  
  # Determine node name
  case $node_num in
    10) node_name="illusion" ;;
    11) node_name="the-dome" ;;
    12) node_name="the-toy-factory" ;;
  esac
  
  # Add node header to output
  output="${output}${node_name} (${node_ip}):\n"
  
  # Check if ovn-central pod exists and is running on this node
  pod=$(kubectl get pods -n cozy-kubeovn -l app=ovn-central -o json 2>/dev/null | \
        jq -r --arg ip "$node_ip" '.items[] | select(.status.hostIP == $ip and .status.phase == "Running") | .metadata.name' | head -1)

  if [ -z "$pod" ]; then
    errors="${errors}No ovn-central pod running on $node_name; "
    output="${output}  - ERROR: No ovn-central pod running\n"
    continue
  fi

  # Check each port
  for port in 6641 6642 6643 6644; do
    # Check port binding using ss inside the pod
    binding=$(kubectl exec -n cozy-kubeovn "$pod" -c ovn-central -- ss -tlnp 2>/dev/null | grep ":$port" | awk '{print $4}' || true)

    if [ -z "$binding" ]; then
      errors="${errors}Port $port not listening on $node_name; "
      output="${output}  - Port $port: ❌ NOT LISTENING\n"
      continue
    fi

    # Verify it's bound to the correct management IP
    if echo "$binding" | grep -q "$node_ip:$port"; then
      output="${output}  - Port $port: ${node_ip} ✅\n"
    else
      actual_ip=$(echo "$binding" | cut -d: -f1)
      errors="${errors}Port $port on $node_name bound to wrong IP $actual_ip; "
      output="${output}  - Port $port: ${actual_ip} ❌ (expected ${node_ip})\n"
    fi
  done
  
  output="${output}\n"
done

# Output the formatted result
echo -e "$output"

# Exit with error if any issues found
if [ -n "$errors" ]; then
  echo "ERRORS: $errors" >&2
  exit 1
fi

exit 0
