# Single Node Failure and Recovery Architecture

This document describes the failover behavior of the 3-node Enigma cluster running Talos Linux, Cozystack, and LINSTOR/DRBD storage replication.

## Architecture Overview

### Cluster Topology

```
                    illusion (192.168.50.10)
                   /        \
      10.50.1.0/31          10.50.2.0/31
      (25Gbps DAC)          (25Gbps DAC)
                 /            \
    the-dome ─────────────── the-toy-factory
  (192.168.50.11)  10.50.3.0/31   (192.168.50.12)
                   (25Gbps DAC)
```

**Network Configuration:**
- Management network: 192.168.50.0/24 (VLAN 50)
- Storage network: Point-to-point /31 subnets (10.50.x.x)
- Each node has 50Gbps aggregate storage bandwidth (2x 25Gbps links)
- MTU 9000 (jumbo frames) on storage interfaces

**Storage Configuration:**
- DRBD 9 with 3-way replication (autoPlace: 3)
- LINSTOR controller in `cozy-linstor` namespace
- StorageClasses: `local-ssd` (no replication), `replicated` (3-way DRBD)

## DRBD Quorum Behavior in 3-Node Cluster

### Quorum Calculation

DRBD uses a quorum model where n/2 + 1 nodes must be available for I/O to continue. In a 3-node cluster:
- **Quorum requirement:** 2 of 3 nodes (majority)
- **Single node failure:** Quorum maintained (2 remaining nodes)
- **Two node failure:** Quorum lost (only 1 node)

### Configured Quorum Settings

From the `replicated` StorageClass:

```yaml
property.linstor.csi.linbit.com/DrbdOptions/auto-quorum: suspend-io
property.linstor.csi.linbit.com/DrbdOptions/Resource/on-no-data-accessible: suspend-io
property.linstor.csi.linbit.com/DrbdOptions/Resource/on-suspended-primary-outdated: force-secondary
property.linstor.csi.linbit.com/DrbdOptions/Net/rr-conflict: retry-connect
```

**Parameter Explanations:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `auto-quorum` | `suspend-io` | When quorum is lost, suspend I/O instead of allowing potentially inconsistent writes |
| `on-no-data-accessible` | `suspend-io` | Suspend I/O when no replica is accessible (prevents data corruption) |
| `on-suspended-primary-outdated` | `force-secondary` | When primary becomes outdated during suspend, demote to secondary for safe failover |
| `rr-conflict` | `retry-connect` | On read-read conflicts during reconnection, retry connection instead of failing |

### Quorum Loss Scenario

When 1 of 3 nodes fails:

1. **DRBD detects peer disconnect** (~10 seconds default timeout)
2. **Quorum maintained:** 2 nodes remain, I/O continues uninterrupted
3. **Degraded mode:** Resources show 2/3 replicas available
4. **Resync on recovery:** When failed node rejoins, DRBD resyncs data

When 2 of 3 nodes fail:
1. **Quorum lost:** Remaining node has only 1/3 replicas
2. **I/O suspended:** All writes blocked (`suspend-io` policy)
3. **Pods experience timeouts:** Applications see hung I/O
4. **Manual intervention required:** Must restore at least one additional node

## LINSTOR HA Controller and Fencing

### Piraeus HA Controller

The LINSTOR CSI deployment includes the Piraeus HA controller (`linstor-csi-node`) which:
- Monitors node health via Kubernetes node conditions
- Detects when nodes become NotReady or unreachable
- Triggers volume failover for affected PVCs

### Fencing Mechanism

Fencing prevents dual-primary scenarios (split-brain) where two nodes believe they are primary:

1. **Node becomes NotReady** (Kubernetes marks node status)
2. **HA controller detects failure** (watches node conditions)
3. **Fencing initiated:** Original primary is fenced out
4. **Volume attachment released** (CSI detaches volume from failed node)
5. **New primary elected:** DRBD promotes secondary on surviving node
6. **Pod rescheduled:** Kubernetes reschedules pod to healthy node

### Timeouts and Timing

| Component | Timeout | Description |
|-----------|---------|-------------|
| Kubernetes node not-ready | 40s (default) | Time before node marked NotReady |
| Pod eviction | 5m (tolerationSeconds) | Time before pods evicted from NotReady node |
| DRBD ping timeout | 10s | Time before DRBD considers peer disconnected |
| LINSTOR satellite timeout | 10s | Time before LINSTOR marks satellite offline |

## Point-to-Point Network Failover Considerations

### Direct Link Failure Scenarios

The point-to-point topology has a trade-off: if a direct link fails, those two nodes cannot communicate directly over the storage network.

**Scenario: illusion-dome link fails**
- illusion and the-dome lose direct storage connectivity
- Both nodes can still reach the-toy-factory
- DRBD replication between illusion-dome pauses
- I/O continues via the-toy-factory path (if FRR routing is configured)
- Without FRR: DRBD marks peer as temporarily disconnected

**Scenario: Complete node failure (vs link failure)**
- Remaining direct links continue operating normally
- Two-way replication between surviving nodes maintained
- Quorum preserved (2/3 nodes)

### Network Failover Options

**Option 1: Accept Degraded Mode (Current Configuration)**
- No FRR/routing protocol configured
- Link failure = temporary peer disconnection
- DRBD handles gracefully with reconnection on link recovery
- Simplest configuration, acceptable for most workloads

**Option 2: FRR with OpenFabric (Future Enhancement)**
- Install FRR with OpenFabric protocol
- Configure indirect routing through third node
- Sub-second convergence on link failure
- Additional complexity but full redundancy

## Kubernetes-Level Failover Chain

### Complete Timeline: Node Failure to Recovery

```
T+0s    Node becomes unreachable (hardware/network failure)
        |
T+10s   DRBD ping timeout - peer marked disconnected
        |
T+10s   LINSTOR satellite timeout - node marked OFFLINE
        |
T+40s   Kubernetes marks node NotReady
        |
T+45s   LINSTOR HA controller detects node failure
        |
T+5m    Pod eviction timeout expires (tolerationSeconds)
        |
T+5m05s Pods terminated, PVCs released
        |
T+5m10s DRBD promotes new primary on surviving node
        |
T+5m15s CSI attaches volume to new node
        |
T+5m20s Pod rescheduled and starts on healthy node
        |
T+5m30s Service restored (total downtime: ~5.5 minutes)
```

### Optimizing Failover Time

To reduce failover time, consider adjusting these parameters:

1. **Reduce pod toleration time** (from 5m to 30s):
```yaml
spec:
  tolerations:
  - key: "node.kubernetes.io/unreachable"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 30
```

2. **Configure shorter DRBD timeouts** (trade-off: more sensitive to network jitter):
```yaml
property.linstor.csi.linbit.com/DrbdOptions/Net/ping-timeout: 5
property.linstor.csi.linbit.com/DrbdOptions/Net/connect-int: 3
```

## Single Node Failure Scenarios

### Scenario 1: Control Plane Node Failure

All three nodes are control plane nodes (Talos with `allowSchedulingOnControlPlanes: true`).

**Impact:**
- etcd quorum: 2/3 nodes remain, quorum maintained
- Kubernetes API: Continues operating on remaining nodes
- Workloads: Rescheduled to surviving nodes
- VIP (192.168.50.50): Migrates to remaining control plane node

**Recovery:**
1. Kubernetes API remains available via VIP
2. Control plane pods on failed node are rescheduled
3. etcd member rejoins when node recovers

### Scenario 2: LINSTOR Satellite Node Failure

**Impact:**
- Storage pool capacity: Reduced by 1/3
- Existing PVCs: 2/3 replicas available, I/O continues
- New PVC provisioning: Continues with 2-node placement
- Resync: Will begin automatically when node recovers

**Verification Commands:**
```bash
# Check node status
linstor node list

# Check resource state
linstor resource list

# Check for faulty resources
linstor resource list --faulty
```

### Scenario 3: Network Partition (Split-Brain Prevention)

If network partition isolates one node from the other two:

**Isolated Node:**
- Loses DRBD quorum (only 1/3)
- I/O suspended (`suspend-io` policy)
- Demoted to secondary (`force-secondary`)
- Pods experience I/O timeouts

**Majority Partition (2 nodes):**
- Maintains DRBD quorum (2/3)
- I/O continues normally
- Pods run without interruption

**This design prevents split-brain:** The isolated node cannot accept writes, ensuring data consistency.

## Recovery Procedures

### Automatic Recovery (Node Rejoins)

When a failed node becomes healthy again:

1. **Kubernetes marks node Ready**
2. **LINSTOR satellite reconnects** to controller
3. **DRBD peers reconnect** and negotiate state
4. **Resync begins** from healthy replicas to recovered node
5. **Pods may reschedule** back to recovered node (if affinity allows)

### DRBD Resync Duration Expectations

With 25Gbps storage network:

| Data Size | Expected Resync Time |
|-----------|---------------------|
| 10 GB | ~5 seconds |
| 100 GB | ~50 seconds |
| 1 TB | ~8 minutes |

Resync rate governed by `c-max-rate: 2048000` (2 GB/s max).

### Manual Intervention Scenarios

**Scenario: Prolonged outage (>1 hour)**
- Consider draining node before maintenance
- Use `kubectl drain` to gracefully migrate pods
- Monitor DRBD sync status before returning to service

**Scenario: Permanent node loss**
- Remove node from LINSTOR: `linstor node delete <node>`
- Update DRBD resource definitions: `linstor resource-definition modify`
- Consider adding replacement node before removal

**Scenario: Data corruption suspected**
- Check DRBD consistency: `drbdadm verify <resource>`
- Review LINSTOR error reports: `linstor error-reports list`
- Restore from backup if verification fails

## Configuration Recommendations

### Required Timeouts

The following timeouts are configured for optimal balance between fast failover and stability:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| DRBD ping-timeout | 10s (default) | Allows for brief network hiccups |
| DRBD connect-int | 10s (default) | Reconnection attempt interval |
| K8s node-monitor-grace-period | 40s | Standard Kubernetes default |
| Pod terminationGracePeriodSeconds | 30s | Allow graceful shutdown |

### Pod/StatefulSet Recommendations

For critical workloads using DRBD volumes:

```yaml
spec:
  # Allow faster failover
  terminationGracePeriodSeconds: 30
  tolerations:
  - key: "node.kubernetes.io/unreachable"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 60  # Reduce from default 5m
  # Ensure pod runs where data is
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          topologyKey: kubernetes.io/hostname
```

### Monitoring Alerts

Implement alerts for:
- LINSTOR node offline: `linstor node list | grep -v ONLINE`
- DRBD degraded resources: `linstor resource list --faulty`
- Kubernetes node NotReady: `kubectl get nodes | grep NotReady`
- etcd member unhealthy: `etcdctl endpoint health`

## Testing and Validation

### Safe Failover Testing Methods

**Method 1: Graceful node drain (recommended)**
```bash
# Drain node (moves pods gracefully)
kubectl drain illusion --ignore-daemonsets --delete-emptydir-data

# Verify resources migrated
linstor resource list | grep -i illusion

# Return node to service
kubectl uncordon illusion
```

**Method 2: Stop kubelet (simulates node failure)**
```bash
# Stop kubelet on target node (via Talos)
talosctl -n 192.168.50.10 service kubelet stop

# Monitor failover
watch -n1 'kubectl get pods -A -o wide | grep -v Running'

# Restore kubelet
talosctl -n 192.168.50.10 service kubelet start
```

### What NOT to Do

- **Never** forcefully power off a node during active I/O without draining first
- **Never** remove DRBD disks without proper LINSTOR resource deletion
- **Never** manually modify DRBD metadata outside of LINSTOR
- **Never** test failover during business hours on production workloads

### Verification Commands

After any failure/recovery event:

```bash
# Kubernetes node status
kubectl get nodes

# LINSTOR node status
linstor node list

# DRBD resource health
linstor resource list --faulty

# etcd cluster health
kubectl exec -n kube-system etcd-illusion -- etcdctl endpoint health

# Storage pool availability
linstor storage-pool list
```

## References

- [DRBD 9 User Guide - Quorum](https://linbit.com/drbd-user-guide/drbd-guide-9_0-en/#s-configure-quorum)
- [LINSTOR User Guide - HA Controller](https://linbit.com/linstor-user-guide/)
- [CozyStack DRBD Tuning](https://cozystack.io/docs/storage/drbd-tuning/)
- [Kubernetes Node Status](https://kubernetes.io/docs/concepts/architecture/nodes/#node-status)
- PRD: `.taskmaster/docs/prd-linstor-network.md`
