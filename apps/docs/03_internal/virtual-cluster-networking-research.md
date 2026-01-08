# Virtual Cluster Networking Research

## Problem Statement

Virtual clusters created using CozyStack Kubernetes CRD (Kamaji) exhibited intermittent worker join failures (12.5% → 67% success rate after initial tuning).

**STATUS: ✅ RESOLVED** - Root cause identified as MTU incompatibility with KubeSpan (WireGuard). Setting pod MTU to 1222 (per CozyStack documentation) achieved **100% worker join success rate**.

## Root Causes Identified

1. ✅ **KubeSpan MTU Incompatibility** - **DEFINITIVE ROOT CAUSE** (RESOLVED)
2. ✅ **MTU Fragmentation (Pod/Tunnel)** - Contributing cause (RESOLVED)
3. ✅ **GENEVE Packet Buffers Too Small** - Contributing cause (RESOLVED)
4. ✅ **Complex Network Topology (br0 bridge)** - Architectural complexity (RESOLVED)
5. ✅ **Switch MTU Limitation** - Infrastructure bottleneck (RESOLVED)
6. ❌ **OVN Port Binding Confusion** - False lead (NOT A PROBLEM)
7. ❌ **DNS Domain Conflicts** - False lead (NOT A PROBLEM)

---

## DEFINITIVE FIX: KubeSpan MTU Compatibility (MTU 1222)

### Problem Description

When using KubeSpan (Talos's WireGuard-based mesh networking), the default kube-ovn pod MTU of 1400 bytes is **too large**. KubeSpan adds WireGuard encapsulation overhead (~80 bytes) on top of GENEVE encapsulation (~100 bytes), causing packets to exceed the physical MTU and be dropped.

### Technical Background: Double Encapsulation

With KubeSpan enabled, packets traverse **two** encapsulation layers:

```
┌─────────────────────────────────────────────────────────────┐
│ Pod Payload (up to 1222 bytes)                              │
├─────────────────────────────────────────────────────────────┤
│ GENEVE Encapsulation (~100 bytes)                           │
│  - Outer IP header: 20-40 bytes                             │
│  - UDP header: 8 bytes                                      │
│  - GENEVE header: 8 bytes                                   │
│  - GENEVE options (OVN metadata): ~44 bytes                 │
├─────────────────────────────────────────────────────────────┤
│ WireGuard/KubeSpan Encapsulation (~80 bytes)                │
│  - Outer IP header: 20-40 bytes                             │
│  - UDP header: 8 bytes                                      │
│  - WireGuard header + auth tag: 32 bytes                    │
├─────────────────────────────────────────────────────────────┤
│ Physical Ethernet (MTU 1500)                                │
└─────────────────────────────────────────────────────────────┘
```

**MTU Calculation:**
```
Physical MTU:           1500 bytes
- WireGuard overhead:   ~80 bytes  (IPv4) or ~100 bytes (IPv6)
- GENEVE overhead:      ~100 bytes
- Safety margin:        ~100 bytes (for variable options, IPv6)
─────────────────────────────────────
= Pod MTU:              1222 bytes (CozyStack KubeSpan recommendation)
```

### Symptoms (Before Fix)

- **the-dome node**: 0% VM join success rate (100% failure)
- **TX errors on genev_sys_6081**: 0.519% on the-dome vs 0.036% on illusion (14x higher)
- **ENOBUFS errors**: UDP send buffer exhaustion only on the-dome
- **API server timeouts**: Pods on the-dome couldn't reach ClusterIP services
- **Fluent-bit CrashLoopBackOff**: 347 restarts due to API connectivity failures
- **Multus CNI failures**: Informer cache sync failures on the-dome

### The Fix

**Configuration Change in `apps/enigma-cozy/cozystack.yaml`:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cozystack
  namespace: cozy-system
data:
  values-kubeovn: |
    kube-ovn:
      # MTU 1222 for KubeSpan compatibility
      # KubeSpan uses WireGuard encapsulation (~80 bytes) + GENEVE overlay (~100 bytes)
      # 1500 - 80 (WireGuard) - 100 (GENEVE) - ~100 (safety margin) = 1222
      # See: https://cozystack.io/docs/install/how-to/kubespan/
      mtu: 1222
      kube-ovn-controller:
        limits:
          memory: 2Gi
```

**Apply the fix:**
```bash
# Apply ConfigMap
kubectl apply -f apps/enigma-cozy/cozystack.yaml

# Restart kube-ovn-cni to pick up new MTU
kubectl rollout restart daemonset/kube-ovn-cni -n cozy-kubeovn
kubectl rollout status daemonset/kube-ovn-cni -n cozy-kubeovn

# Reboot nodes for clean state (recommended)
talosctl reboot -n 192.168.50.10 -e 192.168.50.10
talosctl reboot -n 192.168.50.11 -e 192.168.50.11
talosctl reboot -n 192.168.50.12 -e 192.168.50.12
```

### Verification

**1. Verify MTU is applied:**
```bash
# Check ovn0 interface MTU on each node
kubectl exec -n cozy-kubeovn <kube-ovn-cni-pod> -- \
  cat /sys/class/net/ovn0/mtu
# Expected: 1222
```

**2. Check TX errors are eliminated:**
```bash
kubectl exec -n cozy-kubeovn <kube-ovn-cni-pod> -- \
  ip -s link show genev_sys_6081
# TX errors should be 0 or near-zero
```

**3. Validate VM join success:**
```bash
# Scale down to baseline
kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=1

# Scale up to test
kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=8

# Check serial logs for join success
kubectl exec -n tenant-root <virt-launcher-pod> -c compute -- \
  cat /var/run/kubevirt-private/<vmi-uid>/virt-serial0-log | \
  grep "This node has joined"
```

### Results After Fix

**Network Statistics:**

| Node | TX Errors Before | TX Errors After |
|------|-----------------|-----------------|
| the-dome | **0.519%** | **0** |
| illusion | 0.036% | 0 |
| the-toy-factory | 0.018% | 0 |

**VM Join Success Rate:**

| Metric | Before (MTU 1400) | After (MTU 1222) |
|--------|-------------------|------------------|
| the-dome VMs joined | **0%** | **100%** (6/6) |
| Overall cluster | ~28% | **100%** |

**MTU Configuration (Final):**

| Layer | Interface | MTU | Status |
|-------|-----------|-----|--------|
| Physical Infrastructure | SG2210XMP-M2 Switch | 9216 | ✅ Jumbo frames |
| Physical Interfaces | enp6s0 | 1500 | ✅ Standard |
| GENEVE Tunnel | genev_sys_6081 | 65000 | ✅ OVS automatic |
| **Pod Network** | **ovn0** | **1222** | ✅ **KubeSpan-compatible** |

### Reference

- [CozyStack KubeSpan Documentation](https://cozystack.io/docs/install/how-to/kubespan/)

### Final Status

✅ **DEFINITIVELY RESOLVED** - MTU 1222 is the correct setting for CozyStack with KubeSpan enabled.

**Key Insight:** The previous MTU of 1400 only accounted for GENEVE overhead (100 bytes), but KubeSpan adds an additional WireGuard layer (~80 bytes). The double encapsulation pushed packets over the physical MTU limit, causing TX errors and packet drops that manifested as API timeouts and VM join failures.

---

## Hypothesis 1: MTU Fragmentation (Pod/Tunnel) - SUPERSEDED

> **Note:** This section documents the initial MTU investigation. The definitive fix (MTU 1222 for KubeSpan) is documented above.

### Problem Description

**Initial Assessment (INCORRECT):** GENEVE tunnel interface configured with MTU 65000, causing packet fragmentation when hitting physical interface MTU limit (1500 bytes).

**Corrected Understanding:** The genev_sys_6081 MTU of 65000/65470 is **CORRECT BY DESIGN** and set automatically by the OVS kernel module, not by KubeOVN. The actual problem was **pod interface MTU misconfiguration** - pod interfaces were not being set to the correct value (1400 bytes for 1500-byte underlay).

### Technical Background: Why genev_sys_6081 Has MTU 65000

**Origin of High Tunnel MTU:**
- The OVS kernel datapath automatically sets tunnel interface MTU using formula: `max_mtu = 0xFFF8 - hard_header_len - tunnel_header_len`
- `0xFFF8 = 65528` (IP_MAX_MTU, largest 8-byte-aligned value under 65535)
- IP fragmentation requires 8-byte alignment (fragment offset field is 13 bits × 8 bytes)
- After subtracting Ethernet (14 bytes) and tunnel headers (~44 bytes), result is ~65470
- KubeOVN does NOT configure this value - it's an OVS kernel module behavior

**Why This Design?**
- Linux kernel 4.3+ started enforcing MTU limits on tunnel devices
- Setting tunnel MTU to near-maximum restores pre-4.3 behavior
- Allows OVS to handle any packet size the underlay network supports
- Supports jumbo frame environments (9000+ MTU) without reconfiguration
- The high tunnel MTU is **internal to OVS** and independent of pod MTU

**Proper MTU Hierarchy:**
```
Physical Interface (enp6s0):     1500 bytes (standard Ethernet)
Tunnel Interface (genev_sys_6081): 65470 bytes (OVS internal, CORRECT)
Pod Interfaces (ovn0, veth*):    1400 bytes (1500 - 100 Geneve overhead)
```

**References:**
- [OVS Patchwork: Set Large MTU on Tunnel Devices](https://patchwork.ozlabs.org/patch/580963/)
- [OVS Documentation: Common Configuration Issues](https://docs.openvswitch.org/en/latest/faq/issues/)
- [KubeOVN MTU Calculation (Commit 77988f2)](https://github.com/kubeovn/kube-ovn/commit/77988f21f3f5a7155908ed8f2d3a384baad7e808)

**Conclusion:** The MTU 65000 on genev_sys_6081 was never the problem. The issue was that pod interfaces weren't properly configured to 1400 bytes.

### Symptoms

- Worker join success rate: 12.5% → 28.6% after partial fix
- CoreDNS "Failed to watch" errors (17+ errors per minute)
- TLS handshake timeouts: `net/http: TLS handshake timeout`
- kubeadm preflight checks hang indefinitely
- Packet fragmentation statistics: 6M+ packets fragmented, 205 failed

### Actions Taken

**Action 1: Set Pod Interface MTU (Persistent)**
```bash
kubectl patch daemonset kube-ovn-cni -n cozy-kubeovn --type='json' -p='[
  {
    "op": "add",
    "path": "/spec/template/spec/containers/0/args/-",
    "value": "--mtu=1400"
  }
]'
```

**Result:** ✅ Applied successfully
- Pod interface MTU set to 1400 across all nodes
- Configuration persistent (stored in DaemonSet)
- Minor improvement: 12.5% → 28.6% worker join success rate

**Action 2: Set GENEVE Tunnel MTU (UNNECESSARY - Based on Misunderstanding)**
```bash
# Applied to all CNI pods (NOT RECOMMENDED)
for pod in $(kubectl get pods -n cozy-kubeovn -l app=kube-ovn-cni -o name); do
  kubectl exec -n cozy-kubeovn $pod -- ip link set genev_sys_6081 mtu 1450
done
```

**Result:** ⚠️ Action was unnecessary and potentially harmful
- GENEVE tunnel MTU changed from 65000 → 1450
- **This was based on incorrect understanding** - genev_sys_6081 MTU 65000 is correct by design
- The tunnel MTU should remain at 65470/65000 (OVS internal optimization)
- This action likely had no real effect since OVS manages packet sizing internally
- NOT persistent (reverts on CNI pod restart, which is actually correct behavior)

**Action 3: Annotate Nodes with Tunnel Interface**
```bash
kubectl annotate node illusion ovn.kubernetes.io/tunnel_interface=enp6s0
kubectl annotate node the-dome ovn.kubernetes.io/tunnel_interface=enp6s0
kubectl annotate node the-toy-factory ovn.kubernetes.io/tunnel_interface=enp6s0
kubectl annotate node here-i-am ovn.kubernetes.io/tunnel_interface=enp1s0
```

**Result:** ✅ Applied successfully
- Logs confirmed: `I0106 07:41:10 use enp6s0 as tunnel interface`
- Made persistent in Talos machine config via `nodeAnnotations`
- Ensured OVN uses correct physical interface

### Final Status

✅ **RESOLVED** - MTU configuration corrected based on proper understanding:
- **Pod network: MTU 1400** (persistent via DaemonSet) ✅ **THIS WAS THE ACTUAL FIX**
- **GENEVE tunnel: MTU 65000/65470** (OVS automatic, correct by design) ✅ **SHOULD NOT BE CHANGED**
- Node annotations: Correct tunnel interface specified ✅

**Key Insight:** The problem was never the tunnel MTU. The tunnel interface's high MTU (65000) is an OVS kernel optimization that allows it to handle any underlay MTU. The actual issue was pod interfaces not being configured to the correct MTU (1400 = 1500 physical - 100 Geneve overhead).

---

## Prerequisites: Talosctl Configuration

To interact with Talos nodes for diagnostics, talosctl must be configured with the correct endpoints:

```bash
# Set endpoints for all control plane nodes
talosctl config endpoint 192.168.50.10 192.168.50.11 192.168.50.12

# Verify configuration
talosctl config info
# Should show: Endpoints: 192.168.50.10, 192.168.50.11, 192.168.50.12
```

**Node Mapping:**
- 192.168.50.10 → illusion
- 192.168.50.11 → the-dome
- 192.168.50.12 → the-toy-factory

---

## Hypothesis 2: GENEVE Packet Buffers Too Small

### Problem Description

Kernel network buffer settings (208 KB) inadequate for high pod density (90-120 pods/node), causing packet drops under burst traffic conditions.

### Symptoms

| Node | Pods | TX Errors | TX Drops | Drop Rate | Status |
|------|------|-----------|----------|-----------|--------|
| the-dome | 39 | 7,578 | 17 | 0.0015% | ✅ Healthy |
| the-toy-factory | 90 | 9,715 | 240,932 | **1.09%** | ❌ Problem |
| illusion | 120 | 9,094 | 272,407 | **1.23%** | ❌ Problem |

**Acceptable threshold:** < 0.001%
**Observed rates:** 1,000-1,230x higher than acceptable

### Actions Taken

**Action: Increase Kernel Network Buffers**

Added to `apps/enigma-cozy/all.patch.yaml`:
```yaml
machine:
  sysctls:
    net.core.rmem_max: "134217728"       # 128 MB (640x increase from 208 KB)
    net.core.wmem_max: "134217728"       # 128 MB (640x increase from 208 KB)
    net.core.netdev_max_backlog: "5000"  # 5x increase from 1000
```

Applied configuration:
```bash
cd /workspaces/setup/apps/enigma-cozy
task apply
```

**Result:** ✅ **SUCCESS** - Immediate elimination of packet drops

**Before:**
- rmem_max/wmem_max: 212,992 (208 KB)
- netdev_max_backlog: 1,000
- the-toy-factory: ~240,932 cumulative drops
- illusion: ~272,407 cumulative drops

**After (verified 10s post-apply):**
- rmem_max/wmem_max: 134,217,728 (128 MB) ✅
- netdev_max_backlog: 5,000 ✅
- the-toy-factory: +2 drops in 10s (effectively zero)
- illusion: +1 drop in 10s (effectively zero)

### Final Status

✅ **RESOLVED** - 1.09-1.23% packet drop rate eliminated. OVN overlay network handles high pod density without buffer exhaustion.

**Why pod count correlated with drops:**
- GENEVE encapsulation adds 50-100 bytes overhead per packet
- High pod density (90-120 pods) = more concurrent inter-node connections
- Small buffers (208 KB) unable to handle burst traffic from dozens of pods
- When buffers fill → kernel drops packets instead of queuing

---

## Hypothesis 3: Complex Network Topology (br0 Bridge)

### Problem Description

Custom br0 bridge (10.50.50.0/24) created complex dual-network architecture causing OVN port binding ambiguity and operational complexity.

### Network Topology (Before Fix)

```
br0 (10.50.50.0/24):     Internal networking, OVN RAFT cluster
enp6s0 (192.168.50.0/24): Management, external traffic, etcd, pod-to-pod
eno1:                     Unused
```

### Symptoms

- OVN database ports binding to br0 IPs (10.50.50.x) instead of management IPs (192.168.50.x)
- `/etc/hosts` hostname resolution pointing to br0 IPs (first match wins)
- Chicken-and-egg dependency: Kyverno webhooks blocked br0 removal attempts
- Operational complexity in troubleshooting and configuration

### Actions Taken

**Action 1: Attempt to Override /etc/hosts (FAILED)**
```yaml
# Added to Talos machine config
machine:
  network:
    extraHostEntries:
      - ip: 192.168.50.10
        aliases:
          - illusion
```

**Result:** ❌ FAILED
- `extraHostEntries` appends to /etc/hosts, doesn't override
- Talos automatic hostname entry (br0 IP) still takes precedence
- Both IPs present, but br0 IP resolved first

**Action 2: Reorder Network Interfaces (FAILED)**
```yaml
# Defined management interface before br0
interfaces:
  - interface: enp6s0  # Management first
  - interface: br0     # br0 second
```

**Result:** ❌ FAILED
- Interface order doesn't affect Talos hostname IP selection
- Hostname still resolved to br0 IP

**Action 3: Remove br0 Bridge (SUCCESS)**

Modified `apps/enigma-cozy/{illusion,the-dome,the-toy-factory}.patch.yaml`:
```yaml
# Commented out br0 interface
# - interface: br0
#   addresses:
#     - 10.50.50.x/24
#   bridge:
#     interfaces:
#       - enp4s0f0np0
#       - enp4s0f1np1

# Restored physical interfaces as ignored
- interface: enp4s0f0np0
  dhcp: false
  ignore: true
- interface: enp4s0f1np1
  dhcp: false
  ignore: true
```

Applied and rebooted:
```bash
cd /workspaces/setup/apps/enigma-cozy
task apply
talosctl reboot -n 192.168.50.{10,11,12}
```

**Result:** ✅ Applied successfully, but required OVN database cleanup

**Action 4: Clean OVN Database State (SUCCESS)**

Created `ovn-cleanup-daemonset.yaml`:
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ovn-cleanup
  namespace: cozy-kubeovn
spec:
  selector:
    matchLabels:
      app: ovn-cleanup
  template:
    metadata:
      labels:
        app: ovn-cleanup
    spec:
      containers:
      - name: cleanup
        image: busybox
        command: ["/bin/sh", "-xc", "rm -rf /host-config-ovn/*; rm -rf /host-config-ovn/.*; exec sleep infinity"]
        volumeMounts:
        - name: host-config-ovn
          mountPath: /host-config-ovn
      volumes:
      - name: host-config-ovn
        hostPath:
          path: /var/lib/ovn
      nodeSelector:
        kubernetes.io/os: linux
        node-role.kubernetes.io/control-plane: ""
      tolerations:
      - operator: "Exists"
      hostNetwork: true
```

Executed cleanup:
```bash
kubectl apply -f ovn-cleanup-daemonset.yaml
# Waited for cleanup completion
kubectl -n cozy-kubeovn delete daemonset ovn-cleanup
```

**Result:** ✅ SUCCESS - Broke chicken-and-egg deadlock with Kyverno

**Action 5: Restart OVN Components**
```bash
kubectl -n cozy-kubeovn delete pod -l app=ovn-central
kubectl -n cozy-kubeovn delete pod -l app=kube-ovn-controller
kubectl -n cozy-kubeovn delete pod -l app=kube-ovn-cni
```

**Result:** ✅ SUCCESS - OVN rebuilt with clean state

### Verification Results

**OVN Port Bindings:**

Before (with br0):
```
illusion:       10.50.50.10:6641-6644 ❌
the-dome:       10.50.50.11:6641-6644 ❌
the-toy-factory: 10.50.50.12:6641-6644 ❌
```

After (without br0):
```
illusion:       192.168.50.10:6641-6644 ✅
the-dome:       192.168.50.11:6641-6644 ✅
the-toy-factory: 192.168.50.12:6641-6644 ✅
```

**RAFT Cluster Health:**

OVN Northbound:
- Cluster ID: d192 (d1927c07-fe18-43e8-ae6f-b18a5c6af257)
- Leader: the-dome (ssl:[192.168.50.11]:6643)
- All 3 members connected, 0 disconnections ✅

OVN Southbound:
- Cluster ID: b37c (b37c8382-9a93-4719-a750-e3d63ab408cb)
- Leader: the-dome (ssl:[192.168.50.11]:6644)
- All 3 members connected, 0 disconnections ✅

### Final Status

✅ **RESOLVED** - Simplified to single-network architecture using CozyStack defaults

**Impact:**
- Eliminated OVN connection refused errors
- Simplified operational complexity
- Removed Kyverno/OVN dependency deadlock
- Single source of truth for hostname resolution

**Note:** Linstor storage confirmed to use management network (192.168.50.x) for ALL communication including DRBD replication, NOT br0. Verified via network connection analysis on all satellite pods.

---

## Hypothesis 4: Switch MTU Limitation (Infrastructure)

### Problem Description

Network switch (TP-Link Omada SG2210XMP-M2) configured with standard Ethernet frames (likely 1518 bytes), potentially fragmenting or dropping GENEVE-encapsulated packets that exceed the switch MTU limit.

### Symptoms

- Persistent packet fragmentation despite pod and tunnel MTU tuning
- Fragmentation rate: ~462 packets/second on illusion node
- Worker join failures continued even after pod MTU set to 1400
- Pattern suggested infrastructure-level bottleneck

### Technical Background

**GENEVE Encapsulation Overhead:**
- Original packet: up to 1500 bytes (standard Ethernet MTU)
- GENEVE header: ~50-100 bytes additional overhead
- Total: 1550-1600 bytes traversing physical network
- **Problem:** Exceeds standard switch frame size (1518 bytes)

**Industry Standards for Overlay Networks:**
- **RFC 8926 (GENEVE):** Recommends physical MTU ≥ overlay MTU + tunnel headers
- **RFC 7348 (VXLAN):** VTEPs must not fragment packets; fragments may be silently discarded
- **OpenShift Documentation:** OVN-Kubernetes requires cluster MTU to be 100 bytes less than hardware MTU
- **Best Practice:** Enable jumbo frames (9000+ MTU) on all network devices in overlay paths

**Known Hardware Issues:**

Research revealed TP-Link TL-SG2428P (related model) had firmware bug where "MTU size of packets sent from the device itself could not be automatically modified by ICMP fragmentation needed" (fixed January 2024). This suggested potential MTU handling issues in TP-Link Omada switch family.

### Actions Taken

**Action: Enable Jumbo Frames on Network Switch**

**Device:** TP-Link Omada SG2210XMP-M2
- 8× 2.5GBASE-T PoE+ ports
- 2× 10GE SFP+ ports
- Connects: illusion, the-dome, the-toy-factory (all control plane nodes)

**Configuration Method:**
```
Omada Controller UI → Devices → office-fast-switch → Config → Jumbo Frame
Previous MTU: 1518 bytes (default)
New MTU: 9216 bytes
```

**Result:** ✅ **SUCCESS** - Infrastructure bottleneck eliminated

**Benefits:**
- Physical network path now supports 9216-byte frames
- Provides 6-7x headroom over GENEVE-encapsulated packets (1550-1600 bytes)
- Eliminates fragmentation at switch layer
- Aligns with RFC recommendations and industry best practices

### Final Status

✅ **RESOLVED** - Switch configured to support jumbo frames

**Network Path MTU Configuration (Complete Stack):**

| Layer | Component | MTU | Status |
|-------|-----------|-----|--------|
| Physical Infrastructure | SG2210XMP-M2 Switch | **9216** | ✅ Configured |
| Physical Interfaces | enp6s0, enp6s0.50 | 1500 | ✅ Standard |
| GENEVE Tunnel | genev_sys_6081 | **65470** | ✅ **OVS automatic (correct by design)** |
| Pod Network | ovn0, veth* | 1400 | ✅ Persistent (the actual fix) |
| Container Interfaces | eth0 (in pods) | 1400 | ✅ Auto-configured |

**Expected Improvements:**
1. Eliminate packet fragmentation at infrastructure layer
2. Reduce TLS handshake timeouts (large packets traverse without fragmentation)
3. Improve CoreDNS watch connection stability (large data transfers no longer fragment)
4. Increase worker join success rate (target: >95%)

**Why This Was Critical:**

Even with pod MTU (1400) and tunnel MTU (1450) configured, GENEVE encapsulation could push total packet size to 1500-1600 bytes. A switch MTU of 1518 would fragment or drop these packets, causing intermittent failures. Jumbo frame support (9216) eliminates this bottleneck entirely.

---

## Hypothesis 5: OVN North/South/Central Port Binding Confusion

### Problem Description

**Initial Suspicion:** OVN northd binding to br0 IP (10.50.50.11:6643) instead of management IP appeared to block overlay initialization.

### Investigation Results

**Discovery:** Port 6643/6644 binding to br0 was **CORRECT BY DESIGN**, not a bug.

**OVN Port Architecture:**
```
Port 6641: OVN Northbound database  - CLIENT connections  → 192.168.50.x ✅
Port 6642: OVN Southbound database  - CLIENT connections  → 192.168.50.x ✅
Port 6643: OVN NB RAFT replication  - INTERNAL cluster   → 10.50.50.x ✅
Port 6644: OVN SB RAFT replication  - INTERNAL cluster   → 10.50.50.x ✅
```

**Evidence:**

RAFT cluster status confirmed working correctly:
```bash
$ ovs-appctl -t ovnnb_db.ctl cluster/status OVN_Northbound
Address: ssl:[10.50.50.11]:6643
Status: cluster member
Role: leader
Connections: ->3acf ->bb30 <-3acf <-bb30  ← ACTIVE REPLICATION
```

Connection tests proved client ports work:
```bash
# From CNI pod
curl 192.168.50.11:6641  # Connected ✅ (NB database)
curl 192.168.50.11:6642  # Connected ✅ (SB database)
curl 192.168.50.11:6643  # Connection refused ❌ (RAFT internal - not for clients)
```

### Final Status

❌ **FALSE HYPOTHESIS** - This was working as designed

**Actual Architecture:**
- Client connections (pods, controllers) use ports 6641/6642 on management network ✅
- RAFT replication uses ports 6643/6644 on internal network (br0 when present) ✅
- Network segmentation is intentional for performance

**Conclusion:** Real problems were MTU fragmentation, buffer exhaustion, and switch MTU limitation, not OVN port binding.

---

## Hypothesis 6: DNS Problems (cozy.local vs cluster.local)

### Problem Description

**Initial Suspicion:** Both management cluster and Kamaji tenant clusters using `cozy.local` domain might cause DNS resolution ambiguity.

### Investigation Results

**DNS Configuration Found:**
- Management cluster CoreDNS: `cozy.local` domain ✓
- Tenant clusters: `cluster.local` domain ✓
- **No domain overlap or conflict**

### Actions Taken

**Action 1: Check CoreDNS Health**
```bash
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100
```

**Result:** ✅ CoreDNS healthy
- 2/2 pods running
- Only 2 SERVFAIL errors in 3 hours (harmless IPv6 AAAA lookups from etcd)
- No resolution failures for critical services

**Action 2: DNS Resolution Tests**
```bash
# Short name resolution
nslookup etcd-2.etcd-headless
# Result: 10.244.0.126 ✅

# Full FQDN resolution
nslookup etcd-2.etcd-headless.tenant-root.svc.cozy.local
# Result: 10.244.0.126 ✅

# Service endpoint verification
kubectl get svc etcd-headless -n tenant-root
# Endpoints: 10.244.0.125:2380,10.244.0.126:2380,10.244.0.127:2380 ✅
```

**Result:** ✅ All DNS resolution working correctly

**Action 3: Analyze CoreDNS Errors in Tenant Cluster**
```bash
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100 -c coredns
```

**Result:** Errors found, but caused by MTU, not DNS configuration
```
[ERROR] plugin/kubernetes: Failed to watch (×17 in 20 log lines)
[INFO] plugin/kubernetes: Warning: watch ended with error
```

**Root Cause:** Watch connections transfer large data volumes, hitting MTU fragmentation issues. CoreDNS errors were **symptoms of MTU fragmentation**, not DNS misconfiguration.

### Final Status

❌ **FALSE HYPOTHESIS** - DNS configuration is correct, no domain conflicts

**Evidence:**
- Management cluster: `cozy.local` (correct)
- Tenant clusters: `cluster.local` (correct, no overlap)
- All service discovery working properly
- CoreDNS "watch errors" caused by MTU fragmentation, not DNS problems

---

## Validation Test: Worker Node Join Success Rate

### Test Cluster: test3 (Kamaji Virtual Cluster)

To validate the network fixes and measure worker node join success rate, follow this procedure:

**Test Environment:**
- Virtual cluster: `test3` (Kamaji-based)
- Host cluster: `enigma-cozy`
- Network: CozyStack with KubeOVN overlay

**Test Procedure:**

1. **Scale Down to Baseline**
   ```bash
   # Scale test3 cluster to 1 worker node
   kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=1
   ```

2. **Wait for Stabilization**
   - Monitor worker node count until it reaches 1 node
   - Ensure all pods are running and healthy
   - Verify control plane is accessible

3. **Scale Up to Test Load**
   ```bash
   # Scale test3 cluster to 8 worker nodes
   kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=8
   ```

4. **Monitor and Validate**

   Search the logs of the created virtual machines using the serial console of KubeVirt. Search for the string `"This node has joined the cluster"` to validate nodes have successfully joined the control plane.

   ```bash
   # Collect logs from all test3 worker VMs
   /workspaces/setup/collect-logs.sh

   # Search for successful joins
   grep "This node has joined the cluster" /tmp/collected.logs

   # Count successful joins
   JOINED=$(grep -c "This node has joined the cluster" /tmp/collected.logs)
   TOTAL=$(kubectl get machines -n tenant-root -l cluster.x-k8s.io/cluster-name=kubernetes-test3 --no-headers | wc -l)
   SUCCESS_RATE=$(echo "scale=1; ($JOINED * 100) / $TOTAL" | bc)
   echo "Success Rate: $SUCCESS_RATE% ($JOINED/$TOTAL)"
   ```

   Expected success rate: **>95%** (post-fix target)

   Additional monitoring for symptoms:
   - TLS handshake timeouts: `grep -i "TLS handshake timeout" /tmp/collected.logs`
   - Pre-flight check hangs: Check for VMs stuck at `[preflight] Running pre-flight checks` without progressing
   - CoreDNS errors: Check tenant cluster CoreDNS logs for "Failed to watch" errors
   - Packet fragmentation/drops: Check GENEVE interface statistics on host nodes

**Success Criteria:**
- ✅ Worker join success rate ≥ 95%
- ✅ No TLS handshake timeouts
- ✅ kubeadm preflight checks complete in <60s
- ✅ CoreDNS logs show no watch errors
- ✅ Packet drop rate < 0.001%

**Historical Context:**
- Pre-fix success rate: 12.5% → 28.6% (MTU partial fix)
- Target post-fix rate: >95% (all fixes applied)

---

## Validation Test 2: Packet Capture Analysis

### Purpose

Capture and analyze network packets on the GENEVE tunnel to verify if ARP responses are being generated but failing to transmit (proving the TX error hypothesis).

### Test Environment

- Target node: `the-dome` (192.168.50.11) - where all VM join failures occur
- CNI pod: `kube-ovn-cni-f6gpj`
- Interface: `genev_sys_6081` (GENEVE tunnel)

### Test Procedure

**1. Start Packet Capture (Background Process)**

```bash
# Start tcpdump on the-dome's GENEVE tunnel interface
# Captures ARP and ICMP traffic for 5 minutes (300 seconds)
kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
  timeout 300 tcpdump -i genev_sys_6081 -nn -w /tmp/arp-test.pcap 'arp or icmp' &
```

**2. Trigger VM Join Attempt**

```bash
# Delete an existing failed VM to trigger rejoin attempt
kubectl delete vmi -n tenant-root kubernetes-test3-md0-tmxm8-6zgsb

# OR scale up to create new VMs
kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=8
```

**3. Wait for Capture Window**

Wait 5 minutes for:
- VM to boot
- Cloud-init to configure networking
- kubeadm to attempt join (hang at preflight)
- Packet capture to complete

**4. Analyze Captured Packets**

```bash
# View captured ARP traffic
kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
  tcpdump -r /tmp/arp-test.pcap -nn -v arp | grep "who-has\|is-at"

# Count ARP requests vs replies
kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
  tcpdump -r /tmp/arp-test.pcap -nn arp | grep -c "who-has"  # ARP requests

kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
  tcpdump -r /tmp/arp-test.pcap -nn arp | grep -c "is-at"    # ARP replies
```

### Expected Results

**If TX Error Hypothesis is Correct:**

1. **ARP Requests Visible:**
   ```
   ARP, Request who-has 10.244.0.1 tell 10.244.3.59, length 28
   ```
   - VM sends ARP request asking for gateway (10.244.0.1)
   - Request successfully traverses to GENEVE tunnel

2. **ARP Replies Generated:**
   ```
   ARP, Reply 10.244.0.1 is-at 1e:df:25:43:bf:26, length 28
   ```
   - OVN generates ARP reply with gateway MAC address
   - Reply appears in packet capture

3. **But OVS Flow Shows Zero Packets:**
   ```bash
   # Check OVS ARP flow for this VM
   kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
     ovs-ofctl dump-flows br-int | grep "10.244.3.59" | grep "table=29"

   # Should show: n_packets=0 (ARP replies never transmitted despite being generated)
   ```

4. **TX Errors Increase:**
   ```bash
   # Before capture
   BEFORE=$(kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
     ip -s link show genev_sys_6081 | grep "TX:" | awk '{print $6}')

   # After capture
   AFTER=$(kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- \
     ip -s link show genev_sys_6081 | grep "TX:" | awk '{print $6}')

   echo "TX errors increased by: $((AFTER - BEFORE))"
   # Should show increase of 5-20 errors per failed VM join
   ```

### Alternative: Successful Node Comparison

**Run same test on illusion (successful node):**

```bash
# Capture on illusion
kubectl exec -n cozy-kubeovn kube-ovn-cni-qkpm2 -- \
  timeout 300 tcpdump -i genev_sys_6081 -nn -w /tmp/arp-illusion.pcap 'arp' &

# Scale up VMs (should land on illusion or the-toy-factory)
kubectl scale machinedeployment kubernetes-test3-md0 -n tenant-root --replicas=8

# Analyze
kubectl exec -n cozy-kubeovn kube-ovn-cni-qkpm2 -- \
  tcpdump -r /tmp/arp-illusion.pcap -nn -v arp | grep "who-has\|is-at"
```

**Expected on Successful Node:**
- Both ARP requests AND replies visible
- OVS flow counter increments (n_packets > 0)
- TX errors do not increase significantly

### Validation Criteria

**✅ Hypothesis CONFIRMED if:**

| Observation | the-dome (Failed) | illusion (Success) |
|-------------|-------------------|-------------------|
| ARP requests captured | Yes | Yes |
| ARP replies captured | Yes | Yes |
| OVS flow n_packets | 0 | >0 |
| TX errors increase | Yes (+5-20) | No (0-2) |
| VMs join cluster | No | Yes |

**❌ Hypothesis REJECTED if:**
- ARP replies not captured on the-dome (problem earlier in pipeline)
- TX errors don't correlate with join attempts
- Both nodes show same packet patterns but different results

### Success Rate Correlation

After packet capture validation, correlate with join success:

```bash
# Count joined VMs
JOINED=$(grep -c "This node has joined the cluster" /tmp/collected.logs)

# Count VMs on the-dome
DOME_VMS=$(kubectl get vmi -n tenant-root -l cluster.x-k8s.io/cluster-name=kubernetes-test3 \
  -o jsonpath='{.items[?(@.status.nodeName=="the-dome")].metadata.name}' | wc -w)

# Expected: 0% join rate for VMs on the-dome
echo "VMs on the-dome: $DOME_VMS, Successful joins: 0 (0%)"
```

### Cleanup

```bash
# Remove capture files
kubectl exec -n cozy-kubeovn kube-ovn-cni-f6gpj -- rm /tmp/arp-test.pcap
kubectl exec -n cozy-kubeovn kube-ovn-cni-qkpm2 -- rm /tmp/arp-illusion.pcap
```

---

## Additional Networking Issues (RESOLVED by MTU 1222 Fix)

> **Note:** These issues were symptoms of the KubeSpan MTU incompatibility and were resolved when pod MTU was changed from 1400 to 1222.

### Fluent-bit CrashLoopBackOff on the-dome Node

**Discovery Date:** 2026-01-07
**Resolution Date:** 2026-01-07 (MTU 1222 fix)

**Problem:**
- Pod: `monitoring-agents-fluent-bit-lg5d5` (namespace: `cozy-monitoring`)
- Node: `the-dome` (192.168.50.11)
- Status: CrashLoopBackOff (347 restarts over 18h)
- Other nodes: Working correctly (fluent-bit pods on `illusion` and `the-toy-factory` are Running)

**Root Cause:**
Pod cannot reach Kubernetes API service (`kubernetes.default.svc:443` / `10.96.0.1:443`)

**Evidence:**

Logs show clean exit after API connection timeout:
```
[error] [input:kubernetes_events:kubernetes_events.1] upstream connection initialization error
[error] [net] connection #298 timeout after 10 seconds to: kubernetes.default.svc:443
[error] [filter:kubernetes:kubernetes.0] kube api upstream connection error
[engine] caught signal (SIGTERM)
[warn] [engine] service will shutdown in max 5 seconds
```

Connectivity test from pod on the-dome:
```bash
kubectl run test-connectivity --rm --restart=Never --image=curlimages/curl:latest \
  --overrides='{"spec":{"nodeName":"the-dome"}}' \
  -- curl -k -m 5 https://10.96.0.1:443

# Result: Connection timed out after 5002 milliseconds (exit code 28)
```

**Observations:**
- Fluent-bit requires Kubernetes API access for:
  - `kubernetes_events` input plugin (watch Kubernetes events)
  - `kubernetes` filter plugin (enrich logs with pod metadata)
- Pod starts successfully, processes logs, but exits after 10s API timeout
- Liveness/readiness probes fail (port 2020 never becomes available before shutdown)
- Exit code 0 (clean shutdown after receiving SIGTERM)

**Comparison with Working Nodes:**
| Node | Fluent-bit Status | Restarts | API Connectivity |
|------|-------------------|----------|------------------|
| illusion | Running | 4 (18h ago) | ✅ Working |
| the-toy-factory | Running | 4 (18h ago) | ✅ Working |
| the-dome | CrashLoopBackOff | 347 | ❌ **Timeout** |

**Network Context:**
- `the-dome` is a control plane node (runs kube-apiserver on 192.168.50.11)
- Kubernetes service exists: `10.96.0.1:443` (default namespace)
- CoreDNS pods: Running on `illusion` and `the-toy-factory` (not on `the-dome`)
- Issue is pod-to-service connectivity, not API server availability

**Hypothesis:**
This appears related to OVN/CNI networking issues specific to `the-dome` node. Pods on this node cannot reach ClusterIP services, suggesting:
- OVN flow programming issue
- Service proxy (kube-proxy/ovn-controller) malfunction
- OVS bridge configuration problem

**Status:** ✅ **RESOLVED** - Fixed by MTU 1222 change for KubeSpan compatibility

**Root Cause Analysis:**
The pod MTU of 1400 was too large when KubeSpan (WireGuard) is enabled. With double encapsulation (WireGuard ~80 bytes + GENEVE ~100 bytes), packets exceeded the physical MTU, causing TX errors and API connectivity timeouts on the-dome node. Changing pod MTU to 1222 eliminated the packet drops and restored API connectivity.

### Multus CNI API Server Connectivity Failure on the-dome Node

**Discovery Date:** 2026-01-07

**Problem:**
- Pod: `cozy-multus-xq9fc` (namespace: `cozy-multus`)
- Node: `the-dome` (192.168.50.11)
- Status: Running but experiencing API server timeout errors (recently restarted, 29 minutes old)
- Other nodes: Working correctly (multus pods on `illusion` and `the-toy-factory` show no API timeout errors)

**Root Cause:**
Multus CNI pod cannot reach Kubernetes API service (`kubernetes.default.svc:443` / `10.96.0.1:443`), preventing it from listing NetworkAttachmentDefinition resources and maintaining informer cache.

**Evidence:**

Critical errors unique to the-dome:
```
W0107 10:23:02.780141 ... failed to list *v1.NetworkAttachmentDefinition:
Get "https://10.96.0.1:443/apis/k8s.cni.cncf.io/v1/networkattachmentdefinitions?resourceVersion=0":
dial tcp 10.96.0.1:443: i/o timeout

[error] failed to sync pod informer cache
E0107 10:23:02.780282 ... "Unhandled Error" err="...Failed to watch *v1.NetworkAttachmentDefinition..."
```

**Observations:**
- Multus requires Kubernetes API access for:
  - Listing NetworkAttachmentDefinition resources (multi-network configurations)
  - Watching network configuration changes via informer cache
  - Coordinating with kube-ovn and cilium CNI plugins
- Informer cache sync failures prevent multus from maintaining current network state
- Pod continues running but cannot properly coordinate multi-network CNI operations
- This is the **same API timeout issue** affecting fluent-bit on the-dome (`dial tcp 10.96.0.1:443: i/o timeout`)

**Comparison with Working Nodes:**

| Node | Multus Pod | Age | API Timeout Errors | Informer Sync Status |
|------|-----------|-----|-------------------|---------------------|
| illusion | cozy-multus-wzclv | 19h | ✅ None | ✅ Working |
| the-toy-factory | cozy-multus-ghv24 | 19h | ✅ None | ✅ Working |
| the-dome | cozy-multus-xq9fc | 29m | ❌ **i/o timeout** | ❌ **Failed** |

**Common Non-Critical Errors (All Nodes):**
- `server_socket is required in cni.conf` - kube-ovn CNI deletion cleanup error (appears on all nodes)
- `failed to get the cached delegates file` - Expected when pods are forcefully deleted (appears on all nodes)

**Network Context:**
- `the-dome` is a control plane node (runs kube-apiserver on 192.168.50.11)
- Kubernetes service exists: `10.96.0.1:443` (default namespace)
- Issue is pod-to-service connectivity, not API server availability
- Multus pod was recently restarted (29m ago), potentially due to these errors

**Impact on VM Worker Nodes:**
- Virtual machine pods (test3 worker nodes) use multus for multi-network attachment
- If multus cannot access network configuration data, VM pod networking initialization may fail
- 100% VM join failure rate on the-dome correlates with multus API connectivity issues
- VMs cannot properly initialize networking if multus lacks current NetworkAttachmentDefinition data

**Hypothesis:**
The-dome node has a network path issue preventing pods from reaching ClusterIP services (10.96.0.0/12 range). This affects:
1. **fluent-bit** - Cannot reach API server for kubernetes_events and metadata enrichment
2. **multus CNI** - Cannot list network configurations or maintain informer cache
3. **VM worker pods** - Cannot complete network initialization via multus coordination

Root cause likely related to:
- TX errors on GENEVE tunnel (14-27x higher on the-dome)
- UDP send buffer exhaustion (ENOBUFS) only on the-dome
- Packets dropped/corrupted to ClusterIP services routed through OVN overlay

**Status:** ✅ **RESOLVED** - Fixed by MTU 1222 change for KubeSpan compatibility

**Root Cause Analysis:**
Same as fluent-bit issue above. The MTU 1400 setting didn't account for KubeSpan's WireGuard encapsulation layer. After changing to MTU 1222, API connectivity was restored and multus informer cache syncs successfully.

**Related Issues (All Resolved):**
- ✅ Fluent-bit CrashLoopBackOff - Fixed by MTU 1222
- ✅ VM join failures (100% → 0% failure rate on the-dome) - Fixed by MTU 1222
- ✅ TX errors on genev_sys_6081 (0.519% → 0%) - Fixed by MTU 1222
- ✅ UDP send buffer error (ENOBUFS) - Fixed by MTU 1222

**Detailed Analysis:** `/workspaces/setup/MULTUS-CNI-ANALYSIS.md`

---

## Summary

### Root Causes (Priority Order)

1. **KubeSpan MTU Incompatibility** - **DEFINITIVE ROOT CAUSE** - Pod MTU 1400 too large for WireGuard+GENEVE double encapsulation
2. **Switch MTU Limitation** - Infrastructure bottleneck preventing GENEVE-encapsulated packets from traversing
3. **GENEVE Buffer Exhaustion** - Contributing cause, 1.09-1.23% packet drops on high-density nodes
4. **Complex Network Topology** - Architectural complexity, caused operational difficulties

### False Leads

1. **OVN Port Binding** - Working as designed (RAFT on internal network, clients on management)
2. **DNS Conflicts** - No domain overlap, CoreDNS healthy

### Resolution Status

✅ **ALL ISSUES RESOLVED**

**MTU Configuration (Multi-Layer) - FINAL:**
- **Pod MTU: 1222** (via CozyStack ConfigMap) ← **DEFINITIVE FIX FOR KUBESPAN**
- **GENEVE tunnel: 65000** (OVS automatic, correct by design - do not modify)
- Physical interfaces: 1500 (standard)
- **Switch MTU: 9216 bytes** (jumbo frames enabled) ← **INFRASTRUCTURE FIX**
- Node annotations: Correct tunnel interface specified

**Buffer Configuration:**
- rmem_max/wmem_max: 128 MB (from 208 KB)
- netdev_max_backlog: 5000 (from 1000)
- Drop rate: Reduced from 1.09-1.23% to near-zero

**Network Topology:**
- br0 bridge removed
- Single-network architecture (192.168.50.0/24)
- OVN database cleaned and rebuilt
- All ports bound to management IPs

### Files Modified

1. `apps/enigma-cozy/cozystack.yaml` - **Added MTU 1222 for KubeSpan compatibility** ← **DEFINITIVE FIX**
2. `apps/enigma-cozy/all.patch.yaml` - Added sysctl buffer tuning
3. `apps/enigma-cozy/illusion.patch.yaml` - Removed br0, added tunnel interface annotation
4. `apps/enigma-cozy/the-dome.patch.yaml` - Removed br0, added tunnel interface annotation
5. `apps/enigma-cozy/the-toy-factory.patch.yaml` - Removed br0, added tunnel interface annotation

### Infrastructure Changes

1. **TP-Link Omada SG2210XMP-M2 Switch** - Jumbo frame configuration (1518 → 9216 bytes MTU)

### Lessons Learned

1. **KubeSpan adds WireGuard encapsulation** - When using Talos KubeSpan, you have DOUBLE encapsulation (WireGuard + GENEVE), requiring smaller pod MTU (1222 vs 1400)
2. **Read the vendor documentation** - CozyStack explicitly documents MTU 1222 for KubeSpan at https://cozystack.io/docs/install/how-to/kubespan/
3. **Tunnel MTU ≠ Pod MTU** - High tunnel interface MTU (65000) is an OVS kernel optimization and is correct by design. The actual configuration needed is pod MTU = physical MTU - ALL encapsulation overhead
4. **Understand the technology before changing it** - Initial attempts to "fix" genev_sys_6081 MTU were based on misunderstanding OVS architecture
5. **Overlay networking requires comprehensive MTU configuration** across ALL layers (pod, tunnel, switch, physical), but each layer has different requirements
6. **Infrastructure matters** - Application-layer tuning ineffective if physical network drops/fragments packets
7. **Buffer sizing matters at scale** - Default 208 KB inadequate for 90+ pods/node with GENEVE
8. **Simple architectures are easier to debug** - Single-network topology eliminates ambiguity
9. **Persistent database state survives config changes** - OVN RAFT required explicit cleanup
10. **Network errors in application logs often indicate infrastructure issues** - CoreDNS "watch failed" was MTU symptom, not DNS problem
11. **Node-specific failures often indicate MTU issues** - When one node (the-dome) has 100% failure rate while others work, suspect packet size/MTU problems

### References

**GENEVE and Overlay Networking:**
- [RFC 8926: GENEVE Specification](https://datatracker.ietf.org/doc/html/rfc8926)
- [RFC 7348: VXLAN Specification](https://tools.ietf.org/html/rfc7348)
- [Kube-OVN Tunnel Protocol Selection](https://kubeovn.github.io/docs/v1.12.x/en/reference/tunnel-protocol/)
- [Kube-OVN Architecture](https://kubeovn.github.io/docs/v1.12.x/en/reference/architecture/)

**OVS/OVN MTU Configuration:**
- [OVS Patchwork: Set Large MTU on Tunnel Devices](https://patchwork.ozlabs.org/patch/580963/)
- [OVS Documentation: Common Configuration Issues](https://docs.openvswitch.org/en/latest/faq/issues/)
- [OVS Documentation: Jumbo Frames](https://docs.openvswitch.org/en/latest/topics/dpdk/jumbo-frames/)
- [KubeOVN MTU Calculation (Commit 77988f2)](https://github.com/kubeovn/kube-ovn/commit/77988f21f3f5a7155908ed8f2d3a384baad7e808)
- [Red Hat: Instance MTU for Geneve](https://access.redhat.com/solutions/7059376)
- [oVirt: Managed MTU for VM Networks](https://www.ovirt.org/develop/release-management/features/network/managed_mtu_for_vm_networks.html)
- [MicroOVN: Create Custom Underlay Network](https://canonical-microovn.readthedocs-hosted.com/en/latest/how-to/ovn-underlay/)

**IP Fragmentation and MTU Theory:**
- [IP Fragmentation in Detail - Packet Pushers](https://packetpushers.net/blog/ip-fragmentation-in-detail/)
- [Physics Forums: IP Fragmentation 8-byte Alignment](https://www.physicsforums.com/threads/why-is-fragmentation-offset-multiple-of-8-understanding-ipv4-fragmentation.1044504/)

**Performance Tuning:**
- [Red Hat: OVN-Kubernetes Performance Tuning](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Linux Kernel Network Tuning](https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt)
- [CozyStack Kube-OVN Troubleshooting](https://cozystack.io/docs/operations/troubleshooting/kube-ovn/)

**Infrastructure:**
- [TP-Link Jumbo Frame Configuration Guide](https://www.tp-link.com/uk/support/faq/4250/)
- [TL-SG2428P MTU Bug Fix (Similar Model)](https://support.omadanetworks.com/uk/document/8972/)
