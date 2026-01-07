#!/bin/bash
# Validates that network interface error and drop rates are within acceptable thresholds.
# Checks GENEVE tunnel (genev_sys_6081) and pod network (ovn0) interfaces on all nodes.
#
# Thresholds (based on research.md findings):
# - TX Error Rate: < 0.01% for local nodes, < 0.5% for WAN nodes (KubeSpan over internet)
# - TX Drop Rate: < 0.01% for local nodes, < 0.5% for WAN nodes
# - RX Error Rate: < 0.01%
#
# The MTU 1222 fix for KubeSpan compatibility should result in 0% TX errors on local nodes.
# WAN-connected nodes (like here-i-am) have higher tolerance due to internet variability.

set -euo pipefail

# Thresholds (in percentage, multiplied by 10000 for integer math)
# 0.01% = 100 (in 10000ths)
# 0.5% = 5000 (in 10000ths)
LOCAL_ERROR_THRESHOLD=100      # 0.01%
LOCAL_DROP_THRESHOLD=100       # 0.01%
WAN_ERROR_THRESHOLD=5000       # 0.5%
WAN_DROP_THRESHOLD=5000        # 0.5%

errors=""
output="Network Interface Error Rates:\n"

# Get all kube-ovn-cni pods
cni_pods=$(kubectl get pods -n cozy-kubeovn -l app=kube-ovn-cni -o json 2>/dev/null)

if [ -z "$cni_pods" ] || [ "$(echo "$cni_pods" | jq '.items | length')" -eq 0 ]; then
  echo "ERROR: No kube-ovn-cni pods found" >&2
  exit 1
fi

# Process each node
echo "$cni_pods" | jq -r '.items[] | "\(.metadata.name) \(.spec.nodeName) \(.status.hostIP)"' | while read -r pod_name node_name node_ip; do
  output_node="${node_name} (${node_ip}):\n"

  # Determine if this is a WAN node (not in 192.168.50.x range)
  if [[ "$node_ip" =~ ^192\.168\.50\. ]]; then
    is_wan="false"
    error_threshold=$LOCAL_ERROR_THRESHOLD
    drop_threshold=$LOCAL_DROP_THRESHOLD
    node_type="local"
  else
    is_wan="true"
    error_threshold=$WAN_ERROR_THRESHOLD
    drop_threshold=$WAN_DROP_THRESHOLD
    node_type="WAN"
  fi

  # Get GENEVE tunnel stats
  geneve_stats=$(kubectl exec -n cozy-kubeovn "$pod_name" -- ip -s link show genev_sys_6081 2>/dev/null || echo "ERROR")

  if echo "$geneve_stats" | grep -q "ERROR"; then
    errors="${errors}Unable to query genev_sys_6081 on $node_name; "
    output_node="${output_node}  genev_sys_6081: ERROR - Unable to query interface\n"
  else
    # Parse TX stats: bytes packets errors dropped carrier collsns
    tx_line=$(echo "$geneve_stats" | grep -A1 "TX:" | tail -1 | tr -s ' ')
    tx_packets=$(echo "$tx_line" | awk '{print $2}')
    tx_errors=$(echo "$tx_line" | awk '{print $3}')
    tx_dropped=$(echo "$tx_line" | awk '{print $4}')

    # Parse RX stats
    rx_line=$(echo "$geneve_stats" | grep -A1 "RX:" | tail -1 | tr -s ' ')
    rx_packets=$(echo "$rx_line" | awk '{print $2}')
    rx_errors=$(echo "$rx_line" | awk '{print $3}')
    rx_dropped=$(echo "$rx_line" | awk '{print $4}')

    # Calculate rates (multiply by 1000000 for precision, divide by packets, result in 10000ths of percent)
    if [ "$tx_packets" -gt 0 ]; then
      tx_error_rate=$((tx_errors * 1000000 / tx_packets))
      tx_drop_rate=$((tx_dropped * 1000000 / tx_packets))
    else
      tx_error_rate=0
      tx_drop_rate=0
    fi

    if [ "$rx_packets" -gt 0 ]; then
      rx_error_rate=$((rx_errors * 1000000 / rx_packets))
      rx_drop_rate=$((rx_dropped * 1000000 / rx_packets))
    else
      rx_error_rate=0
      rx_drop_rate=0
    fi

    # Format percentages for display (convert from 10000ths to readable)
    tx_error_pct=$(awk "BEGIN {printf \"%.4f\", $tx_error_rate / 10000}")
    tx_drop_pct=$(awk "BEGIN {printf \"%.4f\", $tx_drop_rate / 10000}")
    rx_error_pct=$(awk "BEGIN {printf \"%.4f\", $rx_error_rate / 10000}")
    rx_drop_pct=$(awk "BEGIN {printf \"%.4f\", $rx_drop_rate / 10000}")

    # Validate TX error rate
    if [ "$tx_error_rate" -le "$error_threshold" ]; then
      output_node="${output_node}  genev_sys_6081 TX errors: ${tx_errors}/${tx_packets} (${tx_error_pct}%) ✅\n"
    else
      threshold_pct=$(awk "BEGIN {printf \"%.2f\", $error_threshold / 10000}")
      errors="${errors}$node_name genev_sys_6081 TX error rate ${tx_error_pct}% exceeds ${threshold_pct}% threshold; "
      output_node="${output_node}  genev_sys_6081 TX errors: ${tx_errors}/${tx_packets} (${tx_error_pct}%) ❌ exceeds ${threshold_pct}%\n"
    fi

    # Validate TX drop rate
    if [ "$tx_drop_rate" -le "$drop_threshold" ]; then
      output_node="${output_node}  genev_sys_6081 TX drops: ${tx_dropped}/${tx_packets} (${tx_drop_pct}%) ✅\n"
    else
      threshold_pct=$(awk "BEGIN {printf \"%.2f\", $drop_threshold / 10000}")
      errors="${errors}$node_name genev_sys_6081 TX drop rate ${tx_drop_pct}% exceeds ${threshold_pct}% threshold; "
      output_node="${output_node}  genev_sys_6081 TX drops: ${tx_dropped}/${tx_packets} (${tx_drop_pct}%) ❌ exceeds ${threshold_pct}%\n"
    fi

    # Validate RX error rate
    if [ "$rx_error_rate" -le "$error_threshold" ]; then
      output_node="${output_node}  genev_sys_6081 RX errors: ${rx_errors}/${rx_packets} (${rx_error_pct}%) ✅\n"
    else
      threshold_pct=$(awk "BEGIN {printf \"%.2f\", $error_threshold / 10000}")
      errors="${errors}$node_name genev_sys_6081 RX error rate ${rx_error_pct}% exceeds ${threshold_pct}% threshold; "
      output_node="${output_node}  genev_sys_6081 RX errors: ${rx_errors}/${rx_packets} (${rx_error_pct}%) ❌ exceeds ${threshold_pct}%\n"
    fi
  fi

  # Get ovn0 MTU to verify KubeSpan-compatible setting
  ovn0_mtu=$(kubectl exec -n cozy-kubeovn "$pod_name" -- cat /sys/class/net/ovn0/mtu 2>/dev/null || echo "ERROR")

  if [ "$ovn0_mtu" = "ERROR" ]; then
    errors="${errors}Unable to query ovn0 MTU on $node_name; "
    output_node="${output_node}  ovn0 MTU: ERROR - Unable to query\n"
  elif [ "$ovn0_mtu" = "1222" ]; then
    output_node="${output_node}  ovn0 MTU: ${ovn0_mtu} ✅ (KubeSpan-compatible)\n"
  else
    errors="${errors}$node_name ovn0 MTU is $ovn0_mtu (expected 1222 for KubeSpan); "
    output_node="${output_node}  ovn0 MTU: ${ovn0_mtu} ❌ (expected 1222 for KubeSpan)\n"
  fi

  output_node="${output_node}  Node type: ${node_type}\n\n"

  # Accumulate output (use temp file since we're in a subshell)
  echo -e "$output_node"
done > /tmp/network-error-output.$$

# Read accumulated output
output="${output}$(cat /tmp/network-error-output.$$)"
rm -f /tmp/network-error-output.$$

# Output the formatted result
echo -e "$output"

# Exit with error if any issues found
if [ -n "$errors" ]; then
  echo "ERRORS: $errors" >&2
  exit 1
fi

exit 0
