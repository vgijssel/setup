# Point-to-point routing beats bridging for your Talos mesh network

**The bridge-with-STP approach should be avoided.** Your 3-node triangle topology with Mellanox 25Gbps NICs is best served by a **routed point-to-point configuration** where each direct link gets its own subnet and DRBD/LINSTOR is configured with per-peer addresses. This approach provides full **50Gbps aggregate bandwidth** per node (both ports active simultaneously), sub-millisecond latency, and native DRBD mesh support—all configurable in Talos v1.11.6's machine config.

The fundamental problem with bridging is that STP must block one link to break the triangle loop, wasting 33% of your physical bandwidth. Worse, Linux's standard bridge only supports classic STP with **30-50 second convergence times**—catastrophic for storage replication. Meanwhile, DRBD 9 was designed specifically for mesh topologies with per-connection addressing, making point-to-point the natural fit.

---

## Why bridge-with-STP fails this use case

In your triangle topology, STP will elect a root bridge and block whichever link creates a loop—one of your three 25G connections sits idle during normal operation. Traffic between two nodes may traverse through the third node, doubling latency and halving effective bandwidth for those flows.

**Convergence time is the critical flaw.** Standard Linux bridge implements only 802.1D STP, not Rapid STP (802.1w). When a link fails or recovers, STP must wait through MaxAge (20s), Listening (15s), and Learning (15s) states—totaling **30-50 seconds** of disruption. DRBD replication will stall, timeouts will fire, and LINSTOR will mark nodes offline. Proxmox documentation explicitly warns that "this is long enough for Ceph to start complaining." Storage clusters cannot tolerate this.

Talos Linux does support `bridge.stp.enabled: true` in machine config, but GitHub Issue #10585 documents temporary network unreachability when STP reconfigures routes. You'd be adding complexity while losing bandwidth and gaining nothing.

**RSTP (sub-6-second convergence) requires Open vSwitch**, not the standard Linux bridge—adding significant complexity to Talos deployments where OVS isn't included by default.

---

## Point-to-point subnets provide full bandwidth and simplicity

The recommended architecture assigns each direct link its own /31 subnet:

| Link | Subnet | illusion | the-dome | the-toy-factory |
|------|--------|----------|----------|-----------------|
| illusion ↔ the-dome | 10.50.1.0/31 | .0 (eth0) | .1 (eth0) | — |
| illusion ↔ the-toy-factory | 10.50.2.0/31 | .1 (eth1) | — | .0 (eth0) |
| the-dome ↔ the-toy-factory | 10.50.3.0/31 | — | .0 (eth1) | .1 (eth1) |

Each node uses both Mellanox ports simultaneously—**50Gbps aggregate**. Traffic to each peer takes the direct path with single-hop latency. No STP, no blocked ports, no convergence delays.

**Talos machine config for "illusion" node:**
```yaml
machine:
  network:
    interfaces:
      - interface: eth0  # or use deviceSelector with hardwareAddr
        addresses:
          - 10.50.1.0/31
        mtu: 9000
      - interface: eth1
        addresses:
          - 10.50.2.1/31
        mtu: 9000
```

Linux kernel routing automatically handles this—packets destined for 10.50.1.1 (the-dome) exit eth0, packets for 10.50.2.0 (the-toy-factory) exit eth1. No static routes needed beyond the implicit connected routes.

---

## DRBD and LINSTOR handle per-peer addressing natively

DRBD 9's mesh topology support is designed exactly for this configuration. Each `connection {}` block can specify different addresses, meaning your three nodes communicate over their respective direct links:

```
resource storage {
    on illusion { node-id 0; }
    on the-dome { node-id 1; }
    on the-toy-factory { node-id 2; }

    connection {
        host illusion address 10.50.1.0:7789;
        host the-dome address 10.50.1.1:7789;
    }
    connection {
        host illusion address 10.50.2.1:7789;
        host the-toy-factory address 10.50.2.0:7789;
    }
    connection {
        host the-dome address 10.50.3.0:7789;
        host the-toy-factory address 10.50.3.1:7789;
    }
}
```

For LINSTOR, configure multiple interfaces per satellite and create explicit node-connection paths:
```bash
# Add interfaces
linstor node interface create illusion storage-dome 10.50.1.0
linstor node interface create illusion storage-toyfactory 10.50.2.1
linstor node interface create the-dome storage-illusion 10.50.1.1
linstor node interface create the-dome storage-toyfactory 10.50.3.0
linstor node interface create the-toy-factory storage-illusion 10.50.2.0
linstor node interface create the-toy-factory storage-dome 10.50.3.1

# Create node connections
linstor node-connection path create illusion the-dome direct storage-dome storage-illusion
linstor node-connection path create illusion the-toy-factory direct storage-toyfactory storage-illusion
linstor node-connection path create the-dome the-toy-factory direct storage-toyfactory storage-dome
```

**Cozystack's dedicated network feature** expects a single interface name across nodes. For your topology, you'd configure the primary replication interface (pick one port per node) through their standard approach, then manually add the second interface via LINSTOR CLI as shown above.

---

## Bonding and ECMP don't apply to this topology

**Bonding is fundamentally incompatible** with your design. Bonding modes assume all member ports connect to the same destination (switch or peer)—yours connect to different peers. Red Hat documentation explicitly states: "The use of direct cable connections without network switches is not supported for bonding."

The only bonding mode that could technically function is **broadcast mode**, which duplicates every packet to both interfaces. Both peers receive all traffic—wasteful and nonsensical when you want dedicated bandwidth per peer.

**ECMP (Equal-Cost Multi-Path)** also doesn't help. ECMP load-balances across multiple paths to the *same* destination. In your triangle, each peer is reachable via exactly one direct path—there's nothing to balance. ECMP would only apply if you had two cables between the same node pair.

---

## Mellanox ConnectX configuration for direct-connect storage

Your ConnectX 25GbE NICs work seamlessly in direct-attach mode without special configuration. Key optimizations for storage replication:

**Jumbo frames are essential.** Set MTU to 9000 on all interfaces—both ends must match. This reduces packet overhead and CPU interrupts substantially at 25Gbps rates:
```yaml
machine:
  network:
    interfaces:
      - interface: eth0
        mtu: 9000
```

**Consider DRBD's RDMA transport** for lowest latency. ConnectX supports RoCE v2 (RDMA over Converged Ethernet), and DRBD has supported RDMA transport since version 9.0 (open-source since 9.2.0). Direct-connect RoCE requires no switch or subnet manager:
```
net {
    transport rdma;
}
```
RDMA eliminates TCP/IP stack overhead, enables zero-copy transfers, and reduces CPU load—valuable when Talos nodes run both applications and storage.

**Performance tuning checklist:**
- Ring buffers: `ethtool -G eth0 rx 8192 tx 8192`
- Interrupt coalescing for low latency: `ethtool -C eth0 adaptive-rx off rx-usecs 0`
- IRQ affinity: Pin NIC interrupts to NUMA-local CPUs
- Verify FEC negotiation: `ethtool --show-fec eth0`

---

## Optional failover routing with FRR

The point-to-point approach has one trade-off: if the illusion↔dome link fails, those nodes cannot communicate directly. For many deployments this is acceptable—DRBD marks the peer offline and operates degraded.

For automatic failover, install **FRR with OpenFabric** (an IS-IS derivative) on each node. When a direct link fails, traffic reroutes through the third node with sub-second convergence:

```
# FRR configuration snippet
router openfabric 1
 net 49.0001.0000.0001.00
 lsp-gen-interval 1

interface eth0
 ip router openfabric 1
 openfabric hello-interval 1

interface eth1
 ip router openfabric 1
 openfabric hello-interval 1
```

This is the configuration pattern recommended by Proxmox for production Ceph clusters using direct-connect mesh topologies.

---

## Conclusion

**Use point-to-point /31 subnets—one per direct link.** Configure DRBD with per-connection addresses matching each link's subnet. This delivers full bandwidth utilization, lowest latency, and clean integration with LINSTOR's node-connection model. Talos v1.11.6 fully supports this configuration through standard interface stanzas.

Avoid the bridge-with-STP approach entirely. The 30-50 second convergence times and blocked-link bandwidth loss make it unsuitable for storage replication. Your instinct to question this design was correct—the better solution is simpler, faster, and uses all your hardware.

For Cozystack integration, use their dedicated network feature for one interface per node, then extend with LINSTOR CLI commands to add the second interface and create explicit node-connection paths for each peer pair. The result is a fully-meshed, high-bandwidth DRBD replication network with deterministic routing and no single points of failure.