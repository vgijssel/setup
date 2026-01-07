#!/bin/bash
# Validates that OVN RAFT cluster addresses use management IPs (192.168.50.x)
# and not br0 IPs (10.50.50.x). Returns formatted cluster status showing all members.

set -euo pipefail

# Check if kubectl is available and cluster is reachable
if ! kubectl cluster-info &>/dev/null; then
  echo "ERROR: Unable to connect to Kubernetes cluster" >&2
  exit 1
fi

errors=""
output=""

# We only need to check from one node since RAFT cluster state is shared
for node_num in 10 11 12; do
  node_ip="192.168.50.$node_num"
  
  # Determine node name
  case $node_num in
    10) node_name="illusion" ;;
    11) node_name="the-dome" ;;
    12) node_name="the-toy-factory" ;;
  esac
  
  # Check if ovn-central pod exists and is running on this node
  pod=$(kubectl get pods -n cozy-kubeovn -l app=ovn-central -o json 2>/dev/null | \
        jq -r --arg ip "$node_ip" '.items[] | select(.status.hostIP == $ip and .status.phase == "Running") | .metadata.name' | head -1)

  if [ -z "$pod" ]; then
    continue  # Try next node
  fi

  # Get Northbound RAFT cluster status
  nb_status=$(kubectl exec -n cozy-kubeovn "$pod" -c ovn-central -- \
              ovs-appctl -t /var/run/ovn/ovnnb_db.ctl cluster/status OVN_Northbound 2>/dev/null || echo "ERROR")

  if [ "$nb_status" = "ERROR" ]; then
    errors="${errors}Unable to get NB RAFT status from $node_name; "
    output="${output}OVN Northbound RAFT Cluster:\nERROR: Unable to retrieve cluster status\n\n"
  else
    # Parse cluster information
    cluster_id=$(echo "$nb_status" | grep "Cluster ID:" | awk '{print $3, $4}')
    leader_id=$(echo "$nb_status" | grep "Leader:" | awk '{print $2}')
    
    output="${output}OVN Northbound RAFT Cluster:\n"
    output="${output}Cluster ID: ${cluster_id}\n"
    output="${output}Leader: ${leader_id}\n"
    output="${output}Members:\n"
    
    # Extract server information and check IPs
    # Look for lines like: "    839a (839a at ssl:[192.168.50.12]:6643) last msg..."
    # Parse lines that contain " at ssl:[" (these are server entries)
    # Store in array for sorting
    members=()
    pattern_at_ssl="[[:space:]]at[[:space:]]ssl:\["
    while IFS= read -r line; do
      # Match lines with server info: they contain both "(" and " at ssl:["
      if [[ "$line" =~ \( && "$line" =~ $pattern_at_ssl ]]; then
        server_id=$(echo "$line" | awk '{print $1}')
        server_addr=$(echo "$line" | grep -oP 'at ssl:\[\K[^\]]+' | cut -d: -f1)

        # Store member info for sorting
        members+=("$server_addr|$server_id")
      fi
    done <<< "$nb_status"

    # Sort members by IP address for consistent output
    IFS=$'\n' sorted_members=($(sort <<<"${members[*]}"))
    unset IFS

    # Output sorted members
    for member in "${sorted_members[@]}"; do
      server_addr=$(echo "$member" | cut -d'|' -f1)
      server_id=$(echo "$member" | cut -d'|' -f2)

      # Check if using br0 IP (10.50.50.x)
      if echo "$server_addr" | grep -q "10\.50\.50\."; then
        errors="${errors}NB RAFT member $server_id uses br0 IP $server_addr; "
        output="${output}  - ${server_id}: ${server_addr} ❌ (br0 IP)\n"
      # Check if using management IP (192.168.50.x)
      elif echo "$server_addr" | grep -q "192\.168\.50\."; then
        output="${output}  - ${server_id}: ${server_addr} ✅\n"
      else
        errors="${errors}NB RAFT member $server_id uses unexpected IP $server_addr; "
        output="${output}  - ${server_id}: ${server_addr} ⚠️ (unexpected IP)\n"
      fi
    done
    
    output="${output}\n"
  fi

  # Get Southbound RAFT cluster status
  sb_status=$(kubectl exec -n cozy-kubeovn "$pod" -c ovn-central -- \
              ovs-appctl -t /var/run/ovn/ovnsb_db.ctl cluster/status OVN_Southbound 2>/dev/null || echo "ERROR")

  if [ "$sb_status" = "ERROR" ]; then
    errors="${errors}Unable to get SB RAFT status from $node_name; "
    output="${output}OVN Southbound RAFT Cluster:\nERROR: Unable to retrieve cluster status\n\n"
  else
    # Parse cluster information
    cluster_id=$(echo "$sb_status" | grep "Cluster ID:" | awk '{print $3, $4}')
    leader_id=$(echo "$sb_status" | grep "Leader:" | awk '{print $2}')
    
    output="${output}OVN Southbound RAFT Cluster:\n"
    output="${output}Cluster ID: ${cluster_id}\n"
    output="${output}Leader: ${leader_id}\n"
    output="${output}Members:\n"
    
    # Extract server information and check IPs
    # Look for lines like: "    75e3 (75e3 at ssl:[192.168.50.12]:6644) last msg..."
    # Parse lines that contain " at ssl:[" (these are server entries)
    # Store in array for sorting (reset array first)
    members=()
    pattern_at_ssl="[[:space:]]at[[:space:]]ssl:\["
    while IFS= read -r line; do
      # Match lines with server info: they contain both "(" and " at ssl:["
      if [[ "$line" =~ \( && "$line" =~ $pattern_at_ssl ]]; then
        server_id=$(echo "$line" | awk '{print $1}')
        server_addr=$(echo "$line" | grep -oP 'at ssl:\[\K[^\]]+' | cut -d: -f1)

        # Store member info for sorting
        members+=("$server_addr|$server_id")
      fi
    done <<< "$sb_status"

    # Sort members by IP address for consistent output
    IFS=$'\n' sorted_members=($(sort <<<"${members[*]}"))
    unset IFS

    # Output sorted members
    for member in "${sorted_members[@]}"; do
      server_addr=$(echo "$member" | cut -d'|' -f1)
      server_id=$(echo "$member" | cut -d'|' -f2)

      # Check if using br0 IP (10.50.50.x)
      if echo "$server_addr" | grep -q "10\.50\.50\."; then
        errors="${errors}SB RAFT member $server_id uses br0 IP $server_addr; "
        output="${output}  - ${server_id}: ${server_addr} ❌ (br0 IP)\n"
      # Check if using management IP (192.168.50.x)
      elif echo "$server_addr" | grep -q "192\.168\.50\."; then
        output="${output}  - ${server_id}: ${server_addr} ✅\n"
      else
        errors="${errors}SB RAFT member $server_id uses unexpected IP $server_addr; "
        output="${output}  - ${server_id}: ${server_addr} ⚠️ (unexpected IP)\n"
      fi
    done
    
    output="${output}\n"
  fi
  
  # We only need to check from one node
  break
done

# Check if we found any running pod
if [ -z "$pod" ]; then
  echo "ERROR: No running ovn-central pod found on any node" >&2
  exit 1
fi

# Output the formatted result
echo -e "$output"

# Exit with error if any issues found
if [ -n "$errors" ]; then
  echo "ERRORS: $errors" >&2
  exit 1
fi

exit 0
