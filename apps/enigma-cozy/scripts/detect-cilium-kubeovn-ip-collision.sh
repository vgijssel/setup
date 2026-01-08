#!/bin/bash
# detect-cilium-kubeovn-ip-collision.sh
#
# Detects IP collisions between Cilium router IPs and kube-ovn assigned pod IPs
# that cause cross-node routing failures.
#
# Problem: Cilium and kube-ovn can independently assign overlapping IPs:
#   - Cilium assigns router IPs to cilium_host interfaces (one per node, from pod CIDR)
#   - Kube-ovn assigns IPs to pods from the same CIDR range
#
# When a pod's IP (assigned by kube-ovn) collides with a Cilium router IP on a
# DIFFERENT node, traffic gets misrouted - the node with the Cilium router IP
# intercepts traffic locally instead of forwarding it via OVN to the actual pod.
#
# This script detects these collisions by comparing:
#   - IPs on cilium_host interfaces (Cilium router IPs)
#   - Pod IPs and their actual node locations
#
# A collision is flagged when: pod IP == cilium_host IP on a DIFFERENT node.
# Router IPs with no matching pod are legitimate Cilium internal IPs (not flagged).
#
# Usage: ./detect-cilium-kubeovn-ip-collision.sh
#
# Environment:
#   CILIUM_NAMESPACE - Cilium namespace (default: cozy-cilium)
#
# Exit codes:
#   0 - No collisions found
#   1 - Collisions detected (outputs details to stdout)
#   2 - Error during detection

set -euo pipefail

# Get Cilium namespace (may vary by installation)
CILIUM_NS="${CILIUM_NAMESPACE:-cozy-cilium}"

# Get all Cilium agent pods and their nodes
cilium_pods=$(kubectl get pods -n "${CILIUM_NS}" -l k8s-app=cilium \
  -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.nodeName}{"\n"}{end}' 2>/dev/null) || {
  echo "ERROR: Failed to list Cilium pods" >&2
  exit 2
}

if [[ -z "${cilium_pods}" ]]; then
  echo "ERROR: No Cilium pods found in namespace ${CILIUM_NS}" >&2
  exit 2
fi

# Build a map of pod IPs to their nodes
# Format: IP<tab>NODE<tab>NAMESPACE/NAME
pod_ip_map=$(kubectl get pods -A -o jsonpath='{range .items[*]}{.status.podIP}{"\t"}{.spec.nodeName}{"\t"}{.metadata.namespace}/{.metadata.name}{"\n"}{end}' 2>/dev/null) || {
  echo "ERROR: Failed to list pods" >&2
  exit 2
}

collision_found=0

while IFS=$'\t' read -r cilium_pod node; do
  [[ -z "${cilium_pod}" ]] && continue

  # Get the IPv4 address on cilium_host
  cilium_host_ip=$(kubectl exec -n "${CILIUM_NS}" "${cilium_pod}" -- \
    ip addr show dev cilium_host 2>/dev/null | \
    grep "inet " | awk '{print $2}' | cut -d/ -f1) || continue

  [[ -z "${cilium_host_ip}" ]] && continue

  # Look up which pod has this IP and where it runs
  pod_info=$(echo "${pod_ip_map}" | awk -F'\t' -v ip="${cilium_host_ip}" '$1 == ip {print $2"\t"$3; exit}')

  if [[ -n "${pod_info}" ]]; then
    actual_node=$(echo "${pod_info}" | cut -f1)
    pod_name=$(echo "${pod_info}" | cut -f2)

    if [[ "${actual_node}" != "${node}" ]]; then
      # Pod exists on a different node - this will break connectivity to that pod
      echo "COLLISION: Cilium router IP ${cilium_host_ip} on ${node} conflicts with pod ${pod_name} on ${actual_node}"
      collision_found=1
    fi
  fi
  # Note: If no pod has this IP, it's a legitimate Cilium router IP - no conflict
done <<< "${cilium_pods}"

exit "${collision_found}"
