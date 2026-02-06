# Coder Workspace Creation Performance Tuning

## Summary

Investigation into Coder workspace creation performance in the `coder-prod` Kubernetes cluster revealed DRBD synchronization throttling as the primary bottleneck. After tuning storage class parameters for the 2.5Gbps network, workspace creation time was reduced from ~3 minutes to ~1 minute 40 seconds.

## Investigation Findings

### Timeline Analysis

Before optimization, workspace creation took approximately 3 minutes with the following breakdown:

| Phase | Duration | Description |
|-------|----------|-------------|
| PVC Provisioning | ~29 seconds | CDI creating DataVolume and cloning image |
| VM Hotplug | ~19 seconds | Attaching volume to VM |
| **Volume Mount/Format** | **~120 seconds** | mkfs and DRBD sync - **MAIN BOTTLENECK** |
| Container Start | ~2 seconds | Starting workspace container |

### Root Cause

The DRBD resync controller was throttling disk synchronization:

- **Observed sync rate**: ~70 MB/s
- **DRBD default c-max-rate**: 100 MB/s (100,000 KiB/s)
- **NVMe SSD capability**: ~2,400 MB/s write (Micron 7400 Pro)

The default DRBD `c-max-rate` of 100 MB/s was designed for slower networks/disks and severely limited the NVMe SSDs.

### DRBD Quorum Behavior

During investigation, "DRBD quorum lost" messages were observed. This is **normal behavior** during new volume provisioning - quorum is established once replicas sync across nodes. Not an indication of I/O issues.

## Solution

Tuned the `replicated` storage class in `apps/enigma-cozy/storageclasses.yaml` with DRBD parameters optimized for 2.5Gbps networking:

```yaml
# DRBD resync tuning for 2.5Gbps network with NVMe SSDs
# Reference: https://cozystack.io/docs/storage/drbd-tuning/
# c-max-rate: 250 MB/s (~80% of 2.5Gbps, leaves headroom for app traffic)
property.linstor.csi.linbit.com/DrbdOptions/PeerDevice/c-max-rate: "256000"
# c-min-rate: 80 MB/s (1/3 of c-max-rate per LINBIT recommendation)
property.linstor.csi.linbit.com/DrbdOptions/PeerDevice/c-min-rate: "81920"
# resync-rate: starting point for dynamic controller (1/3 of c-max-rate)
property.linstor.csi.linbit.com/DrbdOptions/PeerDevice/resync-rate: "81920"
# c-plan-ahead: lookahead window in 1/10 seconds (10 = 1 second)
property.linstor.csi.linbit.com/DrbdOptions/PeerDevice/c-plan-ahead: "10"
# c-fill-target: buffer fill target in KiB (scaled from 2048 for 10G)
property.linstor.csi.linbit.com/DrbdOptions/PeerDevice/c-fill-target: "1024"
# Network buffer tuning for improved throughput
property.linstor.csi.linbit.com/DrbdOptions/Net/max-buffers: "36864"
property.linstor.csi.linbit.com/DrbdOptions/Net/sndbuf-size: "10485760"
property.linstor.csi.linbit.com/DrbdOptions/Net/rcvbuf-size: "10485760"
```

### Parameter Explanation

| Parameter | Value | Purpose |
|-----------|-------|---------|
| c-max-rate | 256000 KiB/s (250 MB/s) | Maximum sync rate - ~80% of 2.5Gbps bandwidth |
| c-min-rate | 81920 KiB/s (80 MB/s) | Minimum guaranteed sync rate |
| resync-rate | 81920 KiB/s (80 MB/s) | Starting point for dynamic rate controller |
| c-plan-ahead | 10 (1 second) | Lookahead window for rate adjustment |
| c-fill-target | 1024 KiB | Network buffer fill target |
| max-buffers | 36864 | Maximum number of network buffers |
| sndbuf-size | 10 MiB | TCP send buffer size |
| rcvbuf-size | 10 MiB | TCP receive buffer size |

## Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total creation time | ~3 minutes | ~1 minute 40 seconds | **44% faster** |
| Volume attach/format | ~120 seconds | ~60 seconds | **50% faster** |

## 25Gbps Storage Network Implementation (Completed)

The 25Gbps DAC (Direct Attach Copper) storage network has been implemented using a point-to-point mesh topology. This section documents the architecture and configuration.

### Network Topology

The cluster uses three /31 subnets for direct point-to-point links between nodes, providing 50Gbps aggregate bandwidth per node (both ports active simultaneously):

```
                illusion
               /        \
    10.50.1.0/31      10.50.2.0/31
             /            \
      the-dome -------- the-toy-factory
              10.50.3.0/31
```

| Link | Subnet | Node A | Node B |
|------|--------|--------|--------|
| illusion - the-dome | 10.50.1.0/31 | 10.50.1.0 (enp4s0f0np0) | 10.50.1.1 (enp4s0f0np0) |
| illusion - the-toy-factory | 10.50.2.0/31 | 10.50.2.1 (enp4s0f1np1) | 10.50.2.0 (enp4s0f0np0) |
| the-dome - the-toy-factory | 10.50.3.0/31 | 10.50.3.0 (enp4s0f1np1) | 10.50.3.1 (enp4s0f1np1) |

All interfaces use MTU 9000 (jumbo frames) for optimal throughput.

### LINSTOR Configuration

LINSTOR is configured with per-node interfaces and node-connection paths to route DRBD replication over the dedicated storage network:

**Node Interfaces:**
- Each node has two storage interfaces named `storage-<peer>` pointing to its direct links
- Example: `illusion` has `storage-dome` (10.50.1.0) and `storage-toyfactory` (10.50.2.1)

**Node Connections:**
- Explicit paths ensure DRBD traffic uses the correct interface for each peer
- Path name `direct` indicates point-to-point connection

This configuration is managed by the `internal-storage` Helm chart at `libs/internal-storage/`.

### DRBD Parameters for 25Gbps

The following parameters are configured in the `replicated` StorageClass, scaled from the CozyStack 10Gbps reference:

| Parameter | 2.5Gbps Value | 25Gbps Value | Purpose |
|-----------|---------------|--------------|---------|
| c-max-rate | 256,000 KiB/s (250 MB/s) | 2,048,000 KiB/s (~2 GB/s) | Maximum sync rate |
| c-min-rate | 81,920 KiB/s (80 MB/s) | 682,666 KiB/s (~680 MB/s) | Minimum guaranteed sync |
| resync-rate | 81,920 KiB/s | 682,666 KiB/s | Starting point for dynamic controller |
| c-plan-ahead | 10 (1 second) | 10 (1 second) | Lookahead window |
| c-fill-target | 1,024 KiB | 5,120 KiB | Network buffer fill target |
| max-buffers | 36,864 | 92,160 | Maximum network buffers |
| sndbuf-size | 10 MiB | 10 MiB | TCP send buffer (LINSTOR max) |
| rcvbuf-size | 10 MiB | 10 MiB | TCP receive buffer (LINSTOR max) |

### Why Point-to-Point vs Bridge

The bridge-with-STP approach was rejected because:
- STP blocks one link to break the triangle loop, wasting 33% bandwidth
- Linux bridge only supports classic STP with 30-50 second convergence times
- Point-to-point provides deterministic routing and full bandwidth utilization

For details, see `.taskmaster/docs/prd-linstor-network.md`.

### Operational Notes

**Link Failure Behavior:**
If a direct link fails (e.g., illusion-dome), those nodes cannot communicate directly. DRBD marks the peer as offline and operates in degraded mode. The remaining two links continue functioning normally.

**Configuration Files:**
- Node patch files: `apps/enigma-cozy/*.patch.yaml`
- Helm chart: `libs/internal-storage/`
- HelmRelease: `apps/enigma-cluster/helmrelease-internal-storage.yaml`

## References

- [CozyStack DRBD Tuning Guide](https://cozystack.io/docs/storage/drbd-tuning/)
- [LINBIT DRBD User Guide - Rate Limiting](https://linbit.com/drbd-user-guide/drbd-guide-9_0-en/)
- Storage class configuration: `apps/enigma-cozy/storageclasses.yaml`
