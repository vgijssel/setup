# KubeOVN KubeVirt Live Migration Best Practices for Underlay Networks

This document captures research findings and best practices for implementing live migration of KubeVirt virtual machines connected to KubeOVN underlay/provider networks.

## Overview

KubeVirt does not natively support live migration with bridge network bindings. However, KubeOVN provides a solution through its live migration optimization feature, which enables network-transparent live migrations with IP/MAC preservation and minimal downtime (< 0.5 seconds).

## Network Adapter Comparison

| Adapter Model | Performance | Guest Driver Required | Live Migration Compatible | Recommendation |
|--------------|-------------|----------------------|--------------------------|----------------|
| **virtio**   | Highest (10-20 Gbit/s) | Yes (modern Linux/Windows) | Yes | Recommended for Linux guests with driver support |
| **e1000/e1000e** | Medium (300 Mbit/s typical) | No (built-in) | Yes | Use if guest lacks virtio drivers |
| **rtl8139**  | Lowest | No (built-in) | Yes | Legacy fallback only |
| **vhost-user** | Very High | Yes | Limited | Not recommended for standard underlay use |

### Recommendation

Use **virtio** as the default adapter model for:
- Modern Linux distributions (kernel 2.6.25+)
- Home Assistant OS (includes virtio drivers)
- Windows with VirtIO drivers installed

Use **e1000** only when:
- Guest OS lacks virtio driver support
- Legacy guest compatibility is required

## Required Configuration

### 1. VM Annotation

Add the live migration annotation to the VM template:

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: example-vm
spec:
  template:
    metadata:
      annotations:
        kubevirt.io/allow-pod-bridge-network-live-migration: "true"
```

### 2. Eviction Strategy

Configure automatic live migration on node drain:

```yaml
spec:
  template:
    spec:
      evictionStrategy: LiveMigrate
```

### 3. Bridge Network Binding

Use bridge binding for both overlay and underlay interfaces:

```yaml
spec:
  template:
    spec:
      domain:
        devices:
          interfaces:
          - name: default
            bridge: {}
          - name: lan
            bridge: {}
            # model: virtio is implicit/default
      networks:
      - name: default
        pod: {}
      - name: lan
        multus:
          networkName: <namespace>/<nad-name>
```

### 4. Storage Requirements

Ensure PersistentVolumeClaims use ReadWriteMany (RWX) access mode:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vm-disk
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: replicated  # or other RWX-capable storage
```

## KubeOVN Subnet Configuration

For underlay networks, configure the subnet with:

```yaml
apiVersion: kubeovn.io/v1
kind: Subnet
metadata:
  name: underlay-subnet
spec:
  protocol: IPv4
  provider: <subnet-name>.<namespace>.ovn
  vlan: <vlan-name>
  cidrBlock: 192.168.1.0/24
  gateway: 192.168.1.1

  # Important for underlay behavior
  natOutgoing: false          # Preserve source IP
  disableGatewayCheck: true   # Allow external gateway
  enableDHCP: true            # Optional: enable DHCP

  # Distributed gateway for multi-node support
  gatewayType: distributed
```

### Key Subnet Settings for Live Migration

| Setting | Value | Purpose |
|---------|-------|---------|
| `natOutgoing` | `false` | Preserves VM's original source IP |
| `disableGatewayCheck` | `true` | Allows traffic through external gateway |
| `gatewayType` | `distributed` | Enables migration across nodes |

## Live Migration Process

KubeOVN implements a 7-step migration process:

1. **VM Initiation**: KubeVirt creates target pod on destination node
2. **Port Reuse**: KubeOVN replicates network port information from source to target
3. **Traffic Replication**: Network traffic copied to both pods (target port disabled)
4. **Memory Sync**: KubeVirt synchronizes virtual machine memory
5. **Source Deactivation**: Source pod stops after memory sync completes
6. **Target Activation**: libvirt sends RARP to enable target networking
7. **Cleanup**: Source pod deleted, replication stops

### RARP Handling

The network interruption window is primarily determined by RARP transmission timing:
- Expected downtime: < 0.5 seconds
- TCP connections remain uninterrupted due to retry mechanisms

## Kyverno Policy Implementation

Use Kyverno to automatically inject live migration configuration:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: vm-live-migration-policy
spec:
  rules:
    - name: inject-lan-interface
      match:
        any:
          - resources:
              kinds:
                - kubevirt.io/v1/VirtualMachine
              names:
                - vm-instance-*
              namespaces:
                - tenant-root
      preconditions:
        all:
          - key: lan
            operator: AnyNotIn
            value: "{{ request.object.spec.template.spec.networks[].name || `[]` }}"
      mutate:
        patchesJson6902: |-
          - op: add
            path: /spec/template/spec/domain/devices/interfaces/-
            value:
              name: lan
              bridge: {}
          - op: add
            path: /spec/template/spec/networks/-
            value:
              name: lan
              multus:
                networkName: <namespace>/<nad-name>

    - name: enable-live-migration
      match:
        any:
          - resources:
              kinds:
                - kubevirt.io/v1/VirtualMachine
      mutate:
        patchStrategicMerge:
          spec:
            template:
              metadata:
                annotations:
                  kubevirt.io/allow-pod-bridge-network-live-migration: "true"
              spec:
                evictionStrategy: LiveMigrate
```

## Validation Commands

### Check Live Migration Eligibility

```bash
# Verify VM is live migratable
kubectl get vmi <vm-name> -n <namespace> -o jsonpath='{.status.conditions[?(@.type=="LiveMigratable")]}'

# Expected: {"status": "True", "type": "LiveMigratable"}
```

### Initiate Migration

```bash
virtctl migrate <vm-name> -n <namespace>
```

### Monitor Migration Progress

```bash
kubectl get vmim -n <namespace> -w
```

### Verify IP Preservation

```bash
# Pre-migration
kubectl get vmi <vm-name> -n <namespace> -o jsonpath='{.status.interfaces[?(@.name=="lan")].ipAddress}'

# Post-migration (should be identical)
kubectl get vmi <vm-name> -n <namespace> -o jsonpath='{.status.interfaces[?(@.name=="lan")].ipAddress}'
```

## HAOS Implementation

The HAOS VM uses the following configuration:

### VM Interface Configuration (via Kyverno)

```yaml
interfaces:
- name: default
  bridge: {}
- name: lan
  bridge: {}
  # virtio model is default
networks:
- name: default
  pod: {}
- name: lan
  multus:
    networkName: tenant-root/vm-lan
```

### Validated Test Results

| Metric | Value |
|--------|-------|
| Migration Duration | ~9 seconds |
| Migration Mode | PreCopy |
| IP Preserved | Yes (192.168.1.150) |
| MAC Preserved | Yes |
| TCP Connections | Maintained |
| LiveMigratable Status | True (post-migration) |

## Troubleshooting

### VM Not LiveMigratable

Check the VMI conditions:

```bash
kubectl get vmi <vm-name> -n <namespace> -o jsonpath='{.status.conditions}'
```

Common causes:
- Missing `kubevirt.io/allow-pod-bridge-network-live-migration: "true"` annotation
- Storage not RWX-capable
- evictionStrategy not set

### Migration Fails at PreparingTarget

Verify:
- Target node has required resources (CPU, memory)
- Network attachment definitions exist on target node
- KubeOVN pods are healthy on target node

### IP Changes After Migration

Ensure:
- `natOutgoing: false` in subnet configuration
- KubeOVN live migration optimization is enabled
- Using bridge binding (not masquerade)

## References

- [KubeVirt Live Migration Documentation](https://kubevirt.io/user-guide/compute/live_migration/)
- [KubeOVN Live Migration Documentation](https://kubeovn.github.io/docs/v1.13.x/en/kubevirt/live-migration/)
- [KubeVirt Network Interfaces Documentation](https://kubevirt.io/user-guide/network/interfaces_and_networks/)
- [CNCF Blog: KubeVirt Live Migration Mastery with KubeOVN](https://www.cncf.io/blog/2025/03/20/kubevirt-live-migration-mastery-network-transparency-with-kube-ovn/)
