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

## Future Improvements

When 25Gbps DAC (Direct Attach Copper) networking is configured between nodes:

1. Update `c-max-rate` to ~2,000,000 KiB/s (2 GB/s)
2. Scale `c-min-rate` and `resync-rate` proportionally
3. Increase `c-fill-target` to ~20480 KiB
4. Expected workspace creation time: **under 30 seconds**

The NVMe SSDs (Micron 7400 Pro) can sustain ~2,400 MB/s write speeds, so 25Gbps networking would be the new bottleneck at ~3.1 GB/s theoretical max.

## References

- [CozyStack DRBD Tuning Guide](https://cozystack.io/docs/storage/drbd-tuning/)
- [LINBIT DRBD User Guide - Rate Limiting](https://linbit.com/drbd-user-guide/drbd-guide-9_0-en/)
- Storage class configuration: `apps/enigma-cozy/storageclasses.yaml`
