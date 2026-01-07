#!/bin/bash
# Validates etcd RAFT consensus latency is within acceptable thresholds.
# Checks recent log entries for "agreement among raft nodes" duration.

set -euo pipefail

errors=""
output="etcd Sync Performance:\n"

# Define acceptable latency thresholds (in milliseconds)
GOOD_THRESHOLD=500
WARNING_THRESHOLD=1000
CRITICAL_THRESHOLD=5000

# Define control plane nodes
nodes=("192.168.50.10" "192.168.50.11" "192.168.50.12")
node_names=("illusion" "the-dome" "the-toy-factory")

# Function to convert duration string to milliseconds
duration_to_ms() {
  local duration=$1

  # Handle seconds (e.g., "13.972s")
  if [[ $duration =~ ([0-9.]+)s$ ]]; then
    echo "$(echo "${BASH_REMATCH[1]} * 1000" | bc | cut -d. -f1)"
    return
  fi

  # Handle milliseconds (e.g., "147.767ms")
  if [[ $duration =~ ([0-9.]+)ms$ ]]; then
    echo "$(echo "${BASH_REMATCH[1]}" | cut -d. -f1)"
    return
  fi

  # Handle microseconds (e.g., "2.564µs")
  if [[ $duration =~ ([0-9.]+)µs$ ]]; then
    echo "0"  # Round down to 0ms
    return
  fi

  # Unknown format
  echo "-1"
}

# Check each node
for i in "${!nodes[@]}"; do
  node_ip="${nodes[$i]}"
  node_name="${node_names[$i]}"

  output="${output}\n${node_name} (${node_ip}):\n"

  # Get recent etcd logs and extract RAFT consensus durations
  consensus_logs=$(talosctl -n "$node_ip" -e "$node_ip" logs etcd 2>/dev/null | \
    grep "agreement among raft nodes before linearized reading" | \
    tail -10 || echo "ERROR")

  if echo "$consensus_logs" | grep -q "^ERROR"; then
    errors="${errors}Unable to read etcd logs from ${node_name}; "
    output="${output}  - ERROR: Unable to read logs\n"
    continue
  fi

  if [ -z "$consensus_logs" ]; then
    # No consensus operations in recent logs - this is actually good, means cluster is stable
    output="${output}  - Status: No recent consensus operations (stable) ✅\n"
    continue
  fi

  # Parse durations and calculate statistics
  latencies=()
  max_latency=0
  total_latency=0
  count=0

  while IFS= read -r line; do
    # Extract duration value
    duration=$(echo "$line" | grep -oP 'duration: \K[^)]+' || echo "")

    if [ -n "$duration" ]; then
      latency_ms=$(duration_to_ms "$duration")

      if [ "$latency_ms" -ge 0 ]; then
        latencies+=("$latency_ms")
        total_latency=$((total_latency + latency_ms))
        count=$((count + 1))

        if [ "$latency_ms" -gt "$max_latency" ]; then
          max_latency=$latency_ms
        fi
      fi
    fi
  done <<< "$consensus_logs"

  if [ "$count" -eq 0 ]; then
    output="${output}  - Status: No measurable latency data\n"
    continue
  fi

  # Calculate average
  avg_latency=$((total_latency / count))

  # Sort latencies and get P99 (for small sample, use max as approximation)
  p99_latency=$max_latency

  # Determine status based on thresholds
  status="✅"
  if [ "$p99_latency" -ge "$CRITICAL_THRESHOLD" ]; then
    status="❌ CRITICAL"
    errors="${errors}${node_name} P99 latency ${p99_latency}ms exceeds critical threshold ${CRITICAL_THRESHOLD}ms; "
  elif [ "$p99_latency" -ge "$WARNING_THRESHOLD" ]; then
    status="⚠️  WARNING"
    errors="${errors}${node_name} P99 latency ${p99_latency}ms exceeds warning threshold ${WARNING_THRESHOLD}ms; "
  elif [ "$avg_latency" -ge "$GOOD_THRESHOLD" ]; then
    status="⚠️"
  fi

  output="${output}  - Average latency: ${avg_latency}ms ${status}\n"
  output="${output}  - P99 latency: ${p99_latency}ms\n"
  output="${output}  - Sample size: ${count} operations\n"
done

# Output the formatted result
echo -e "$output"

# Exit with error if any critical issues found
if [ -n "$errors" ]; then
  echo "ERRORS: $errors" >&2
  exit 1
fi

exit 0
