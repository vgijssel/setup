#!/bin/bash
# Validates etcd disk fsync performance on all control plane nodes.
# Tests actual fsync latency by measuring disk flush statistics.
# Based on findings from etcd-disk-io-contention-resolved.md:
# - Good: < 5ms average fsync
# - Warning: 5-10ms (indicates potential disk contention)
# - Critical: > 10ms (severe contention, will cause etcd instability)

set -euo pipefail

errors=""
output="etcd Disk fsync Performance:\n"

# Define acceptable fsync latency thresholds (in milliseconds)
GOOD_THRESHOLD=5
WARNING_THRESHOLD=10
CRITICAL_THRESHOLD=20

# Define control plane nodes
declare -A nodes=(
  ["illusion"]="192.168.50.10"
  ["the-dome"]="192.168.50.11"
  ["the-toy-factory"]="192.168.50.12"
)

# Function to calculate recent average fsync latency from disk stats
# Uses /sys/block/nvme0n1/stat to measure actual disk flush time
test_fsync_latency() {
  local node_ip=$1

  # Read disk stats twice with 5 second interval
  local stat1
  local stat2

  stat1=$(talosctl -n "${node_ip}" -e "${node_ip}" read /sys/block/nvme0n1/stat 2>/dev/null || echo "ERROR")
  if [[ "${stat1}" == "ERROR" ]]; then
    echo "ERROR"
    return
  fi

  sleep 5

  stat2=$(talosctl -n "${node_ip}" -e "${node_ip}" read /sys/block/nvme0n1/stat 2>/dev/null || echo "ERROR")
  if [[ "${stat2}" == "ERROR" ]]; then
    echo "ERROR"
    return
  fi

  # Extract flush count (field 16) and flush time (field 17)
  local flush1_count
  flush1_count=$(echo "${stat1}" | awk '{print $16}')
  local flush1_time
  flush1_time=$(echo "${stat1}" | awk '{print $17}')
  local flush2_count
  flush2_count=$(echo "${stat2}" | awk '{print $16}')
  local flush2_time
  flush2_time=$(echo "${stat2}" | awk '{print $17}')

  # Calculate deltas
  local flush_delta_count=$((flush2_count - flush1_count))
  local flush_delta_time=$((flush2_time - flush1_time))

  # Avoid division by zero
  if [[ "${flush_delta_count}" -eq 0 ]]; then
    # No flushes in 5 seconds - system is idle, return 0
    echo "0"
    return
  fi

  # Calculate average fsync time
  local avg_fsync=$((flush_delta_time / flush_delta_count))
  echo "${avg_fsync}"
}

# Check each node
for node in illusion the-dome the-toy-factory; do
  node_ip="${nodes[${node}]}"

  output="${output}\n${node} (${node_ip}):\n"

  # Test fsync performance
  avg_fsync_ms=$(test_fsync_latency "${node_ip}")

  if [[ "${avg_fsync_ms}" == "ERROR" ]]; then
    errors="${errors}Unable to test fsync on ${node}; "
    output="${output}  - ERROR: Unable to read disk statistics\n"
    continue
  fi

  # Special case: 0ms means no flushes (idle system)
  if [[ "${avg_fsync_ms}" -eq 0 ]]; then
    output="${output}  - Average fsync latency: <1ms ✅ (no flushes detected, system idle)\n"
    continue
  fi

  # Determine status based on thresholds
  status="✅"
  threshold_msg=""

  if [[ "${avg_fsync_ms}" -ge "${CRITICAL_THRESHOLD}" ]]; then
    status="❌ CRITICAL"
    threshold_msg=" (exceeds ${CRITICAL_THRESHOLD}ms critical threshold)"
    errors="${errors}${node} fsync latency ${avg_fsync_ms}ms is CRITICAL; "
  elif [[ "${avg_fsync_ms}" -ge "${WARNING_THRESHOLD}" ]]; then
    status="⚠️  WARNING"
    threshold_msg=" (exceeds ${WARNING_THRESHOLD}ms warning threshold)"
    errors="${errors}${node} fsync latency ${avg_fsync_ms}ms exceeds warning threshold; "
  elif [[ "${avg_fsync_ms}" -ge "${GOOD_THRESHOLD}" ]]; then
    status="⚠️"
    threshold_msg=" (approaching threshold, monitor for increases)"
  fi

  output="${output}  - Average fsync latency: ${avg_fsync_ms}ms ${status}${threshold_msg}\n"

  # Add context based on latency
  if [[ "${avg_fsync_ms}" -ge "${CRITICAL_THRESHOLD}" ]]; then
    output="${output}  - Impact: Severe disk contention, etcd will be unstable\n"
    output="${output}  - Action: Immediately move heavy I/O workloads off this node\n"
  elif [[ "${avg_fsync_ms}" -ge "${WARNING_THRESHOLD}" ]]; then
    output="${output}  - Impact: Disk contention detected, may cause etcd delays\n"
    output="${output}  - Action: Review workload placement on this node\n"
  fi
done

# Output the formatted result
echo -e "${output}"

# Add summary guidance
if [[ -z "${errors}" ]]; then
  echo -e "\nAll nodes have acceptable fsync performance for etcd workloads."
else
  echo -e "\n⚠️  Disk performance issues detected. See apps/docs/03_internal/etcd-disk-io-contention-resolved.md"
fi

# Exit with error if any critical issues found
if [[ -n "${errors}" ]]; then
  echo "ERRORS: ${errors}" >&2
  exit 1
fi

exit 0
