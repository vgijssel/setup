# Harvester HA Cluster — Configuration Reference

3-node Harvester HCI cluster deployed on VLAN 20 (Servers, `192.168.20.0/24`).

Two physical fabrics: management and VM networks run over the Omada LAG on VLAN
20, while Longhorn replication and live migration run over a switchless Mellanox
25G mesh — see "Storage & Live Migration Fabric" below.

## Network Placement

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| VLAN | 20 (Servers) | Per network.md: servers live on VLAN 20 |
| Subnet | `192.168.20.0/24` | Standard `192.168.<vlan>.0/24` scheme |
| Gateway | `192.168.20.1` | Omada gateway SVI |
| DNS | `192.168.20.1` | Gateway forwards upstream |
| NTP | `pool.ntp.org` | Or gateway if it serves NTP |

## IP Assignments

Reserved below the DHCP pool (`.100`–`.199`), static or DHCP-reserved by MAC:

| Role | Hostname | IP | Switch LAG | Notes |
|------|----------|-----|------------|-------|
| Node 1 | `illusion` | `192.168.20.10` | LAG 1 | |
| Node 2 | `the-dome` | `192.168.20.11` | LAG 2 | |
| Node 3 | `the-toy-factory` | `192.168.20.12` | LAG 3 | |
| Cluster VIP | — | `192.168.20.9` | — | Management VIP — must NOT be assigned to any node |

## Cluster Configuration

| Parameter | Value |
|-----------|-------|
| Cluster token | *(generate a random ASCII string at deploy time)* |
| Management VIP | `192.168.20.9` |
| Nodes | `illusion`, `the-dome`, `the-toy-factory` |
| Node IPs | `192.168.20.10`, `192.168.20.11`, `192.168.20.12` |
| DNS servers | `192.168.20.1` |
| NTP servers | `pool.ntp.org` |
| Proxy | None (direct internet via gateway) |
| Management interface VLAN ID | **Not specified** — left empty in the installer; untagged, inherits LAG PVID 20 |
| SSH authorized keys | `https://github.com/mvgijssel.keys` |

## SSH Access

Public keys come from GitHub rather than being pasted per node:

```
https://github.com/mvgijssel.keys
```

In the installer's SSH keys prompt, enter that URL. In a config file, use the
`github:` shorthand — it resolves to exactly the same URL:

```yaml
os:
  ssh_authorized_keys:
    - "github:mvgijssel"
```

Notes:
- Keys are installed for the default `rancher` user.
- The list is fetched **at install time** and baked into the node. Adding or
  removing a key on GitHub later does not propagate to installed nodes — update
  `os.ssh_authorized_keys` on the running cluster for that.
- The fetch needs working DNS and outbound HTTPS at install time, i.e. the same
  VLAN 20 → gateway path that NTP uses. If NTP resolution fails, key fetch fails too.

## Switch Port Profile — Omada LAG (Active LACP)

Each node's NICs are bonded to the Omada switch as a **LAG group with Active
LACP** (802.3ad, dynamic). One LAG group per node:

| Node | LAG group | Harvester bond mode |
|------|-----------|---------------------|
| `illusion` | LAG 1 | `802.3ad` (LACP) |
| `the-dome` | LAG 2 | `802.3ad` (LACP) |
| `the-toy-factory` | LAG 3 | `802.3ad` (LACP) |

Omada configuration (Site → Devices → Switch → LAG):
- **Type**: LAG (LACP) — *Active*, not Static
- **Members**: the ports for that single node only (never mix nodes in one LAG)
- **Profile**: VLAN 20 untagged (PVID 20) on the LAG interface

Harvester side (installer network stage / `harvester-installer` config):
- Bond mode `802.3ad`, all management NICs as slaves
- **VLAN ID: not specified.** The installer's management-interface VLAN ID is
  optional and we deliberately leave it empty — the interface stays untagged and
  inherits VLAN 20 from the LAG's PVID.

Why we don't set the installer VLAN ID:
- **One source of truth.** The VLAN is defined once, in Omada (LAG PVID 20).
  Setting it in the installer as well means two places must agree; a mismatch
  costs management reachability and a console/IPMI trip to fix.
- **Install-time consistency.** ISO/PXE boot talks untagged before any installer
  config applies, so boot, DHCP, install and post-install management all behave
  identically on an untagged PVID.
- **Hard to change later.** The management interface (including its VLAN ID) is
  fixed at install; moving the management VLAN afterwards is a reinstall, not a
  live reconfiguration. Fewer variables baked in is better.
- **Costs nothing.** Tagged VM networks come from the Harvester
  ClusterNetwork/VLAN config, not the management interface — the same LAG can
  carry VLAN 20 untagged for management plus other VLANs tagged for VMs.

Set it only if the LAG becomes a pure tagged trunk with no native VLAN, or if
management must live on a VLAN other than the LAG's PVID. Neither applies today.
If that changes, both ends move together: `vlan_id: 20` in the installer **and**
VLAN 20 as a tagged member with no untagged/native VLAN on the Omada LAG —
changing only one side locks you out of management.

Notes:
- Both ends must agree: Active LACP on the switch requires `802.3ad` on the node.
  A mismatch (e.g. switch Active LACP vs node `active-backup`) leaves the LAG
  blocking/flapping.
- Management itself needs no trunking — inter-VLAN traffic routes through the
  Omada gateway per firewall policy. **VM networks do:** add VLANs 30
  (Automation/HAOS), 70 (Media) and 80 (Shared Services) as *tagged* members of
  the same LAG rather than adding separate access ports. Each becomes a Harvester
  ClusterNetwork/VLAN that guests attach to, while VLAN 20 stays untagged for
  node management.

## Storage & Live Migration Fabric — Mellanox 25G Mesh

Each node has a dual-port 25 GbE Mellanox card. The six ports are cabled **node
to node in a full mesh** — no switch is involved, so every pair of nodes has
exactly one dedicated cable:

| Cable | Between |
|-------|---------|
| 1 | `illusion` ↔ `the-dome` |
| 2 | `the-dome` ↔ `the-toy-factory` |
| 3 | `illusion` ↔ `the-toy-factory` |

This fabric carries **east-west traffic only**. It has no gateway, no DHCP and no
path off the three nodes, which is why only Longhorn replication and live
migration live here — see "What does not belong on the mesh" below.

### Harvester objects

| Object | Value |
|--------|-------|
| ClusterNetwork | `storage` |
| VlanConfig uplink NICs | both Mellanox ports on each node |
| Bond mode | **`broadcast`** (see below) |
| MTU | 9000 (jumbo) — must be identical across every VlanConfig of this cluster network |
| Host interfaces created | bridge `storage-br`, bond `storage-bo` |

Notes:
- Harvester models an uplink as *one NIC or one bond*, and the VlanConfigs of a
  cluster network must together cover **every** node — the storage-network webhook
  refuses to apply otherwise. A single cluster-wide VlanConfig named `storage`
  suffices here because the two Mellanox ports enumerate identically on all three
  nodes; if that ever stops being true, split it into one VlanConfig per node.
- The NAD Harvester generates for these settings has **no `mtu` key**, so the pod
  side inherits the bridge MTU. The VlanConfig declaring 9000 is therefore not
  proof of jumbo frames end to end — check the hosts (`ip link show storage-br`)
  and a `ping -M do -s 8972` between two pods on the network.

### Bond mode must be `broadcast`

A bond normally assumes all its member ports reach the same L2 domain. Here the
two ports reach *different peers*, so every other mode is broken:

| Mode | Why it fails on a switchless mesh |
|------|-----------------------------------|
| `active-backup` | only the active port carries traffic → one peer unreachable |
| `802.3ad` (LACP) | cannot negotiate a single LAG with two different partners |
| `balance-xor` / `balance-rr` / `balance-tlb` / `balance-alb` | hashes or round-robins frames onto whichever cable, so a share of them arrive at the wrong node and are dropped |
| `broadcast` | ✅ sends every frame out **both** ports; the peer it wasn't addressed to discards it |

`broadcast` is loop-free without STP because a bond does not forward between its
own members, and a Linux bridge never sends a frame back out its ingress port.
Costs: per-node egress caps at ~25 Gb/s because every frame is duplicated, and
each node also receives every frame meant for the third node and discards it — so
mesh-NIC rx counters read higher than the traffic actually addressed to that node,
and drop counters may tick. Expected, not a fault.

This is deliberately the opposite of the management NICs, which are `802.3ad` into
an Omada LAG (previous section). Two fabrics, two bond modes, for different
reasons.

### Networks on the fabric

Both settings reuse the **same** cluster network with different VLAN IDs and
non-overlapping CIDRs. Harvester's webhook only rejects overlapping IP *ranges*,
so sharing `storage` is supported; separate VLANs keep the broadcast domains and
per-traffic-type `tcpdump`/counter output readable.

| Setting | VLAN | Range | Carries | Pod interface |
|---------|-----:|-------|---------|---------------|
| `storage-network` | 100 | `172.16.99.0/24` | Longhorn engine ↔ replica replication | `lhnet1` on `instance-manager` pods |
| `vm-migration-network` | 101 | `172.16.101.0/24` | KubeVirt live-migration memory pages | `migration0` on `virt-handler` pods |

```yaml
apiVersion: harvesterhci.io/v1beta1
kind: Setting
metadata:
  name: storage-network
value: '{"vlan":100,"clusterNetwork":"storage","range":"172.16.99.0/24"}'
---
apiVersion: harvesterhci.io/v1beta1
kind: Setting
metadata:
  name: vm-migration-network
value: '{"vlan":101,"clusterNetwork":"storage","range":"172.16.101.0/24"}'
```

The storage range's third octet (`99`) does not match its VLAN ID (`100`). That
inconsistency stays: changing a configured storage range means stopping every VM
in the cluster, which is not a price worth paying for cosmetics. Any *new* network
on this fabric follows `172.16.<vlan>.0/24`.

VLANs 100/101 exist **only inside the `storage` cluster network**, on the direct
cables. They must never be configured on the Omada switch, and therefore cannot
collide with the home VLAN scheme (10–90) in network.md.

#### Addressing rules

- `172.16.0.0/12`, not `192.168.x`: the PiKVM advertises `192.168.0.0/16` into the
  NetBird mesh (network.md), so a `192.168.x` storage subnet would be shadowed by
  that route for every mesh client.
- Must not overlap Harvester's own CIDRs: `10.42.0.0/16`, `10.43.0.0/16`,
  `10.52.0.0/16`, `10.53.0.0/16`.
- Prefix must be `/16` or longer. Both use a `/24` so adding nodes or disks never
  runs into the sizing floor below.

#### Range sizing (webhook-enforced minimums)

| Setting | Minimum usable IPs |
|---------|--------------------|
| `storage-network` | per node `2 + (disks × 2)`, plus concurrent image uploads/downloads |
| `storage-network` when `rwx-network` shares it | add `1 per node + 32` |
| `vm-migration-network` | `1 per non-witness node` |

Undersizing surfaces later rather than at apply time: `instance-manager` /
`virt-handler` pods fail to start on a *newly added* node or disk once the range is
exhausted.

### Applying and changing

| Setting | Prerequisite | Impact |
|---------|-------------|--------|
| `storage-network` | **every VM stopped**, no attached Longhorn volume, no in-flight image upload/download | restarts Longhorn pods plus Prometheus/Grafana/Alertmanager and the VM-import controller; workloads stay down until VMs are started by hand |
| `vm-migration-network` | no migration in progress — VMs may keep running | KubeVirt restarts all `virt-handler` pods; running VMs unaffected |

Configure both from **Advanced → Settings** in the UI where possible; it fills in
the JSON and runs the same webhook. Revert by clearing `value`.

### Verification

```bash
# both settings report configured=True
kubectl get settings.harvesterhci.io storage-network vm-migration-network -o yaml

# every node's VlanStatus is Ready, and the uplink is the broadcast bond
kubectl get vlanstatus
kubectl get vlanconfig -o custom-columns='NAME:.metadata.name,CN:.spec.clusterNetwork,NICS:.spec.uplink.nics,BOND:.spec.uplink.bondOptions.mode,MTU:.spec.uplink.linkAttributes.mtu'

# replication really uses 172.16.99.x — this map is where each engine dials replicas
kubectl -n longhorn-system get engines.longhorn.io -o json \
| jq -r '.items[] | "\(.metadata.name) node=\(.spec.nodeID)\n  \(.status.currentReplicaAddressMap)"'

# migration pods hold a 172.16.101.x address
kubectl -n harvester-system get pods -l kubevirt.io=virt-handler -o json \
| jq -r '.items[] | "\(.spec.nodeName) \(.metadata.annotations["k8s.v1.cni.cncf.io/network-status"] | fromjson | map(select(.interface=="migration0")) | .[0].ips[0] // "NO-IP")"'
```

Because each node pair is its own cable, **validate all three pairs** after any
cabling or bond change — a dead link stays invisible until those two specific
nodes must talk. Attach a pod to the storage NAD on each node and run
`iperf3 -P 8` across every pair; expect 22–24 Gb/s at MTU 9000. A successful live
migration proves only the one pair it ran on.

### What does not belong on the mesh

| Traffic | Where it stays | Why |
|---------|---------------|-----|
| VM guest networks | Omada LAG, VLANs 30/70/80 | guests need the gateway; the mesh is a dead end |
| Node management, etcd, RKE2, API VIP | VLAN 20 untagged on the LAG | fixed at install and needs the gateway |
| Backup target (S3) | VLAN 20 | internet-bound; no Harvester setting moves it |
| Longhorn control plane, CSI | pod network | not movable, negligible volume |
| RWX volume traffic | not configured | no RWX volumes today; if added, share the storage network and re-check sizing |

### Failure modes

- **One dead cable isolates one node *pair*.** Nothing forwards through the third
  node, so replicas on that pair go degraded and migrations between them time out
  (the source VM keeps running). The other two pairs are unaffected.
- **No QoS between storage and migration.** They share one ~25 Gb/s egress budget
  per node and Harvester does no shaping, so a large migration can slow a
  concurrent Longhorn rebuild. Acceptable at 25 GbE; it would not be at 1 GbE.
- **A fourth node needs a third port per node.** A full mesh of _n_ nodes needs
  _n-1_ ports each, so 3 nodes is the ceiling for a dual-port card. Growing past
  that means a 25G switch — and then the bond mode changes to `802.3ad`.

## Firewall Considerations

Per network.md firewall policy:
- Trusted (VLAN 40) can initiate connections to Servers (VLAN 20) — admin access
- Harvester management UI reachable from Trusted clients at `https://192.168.20.9`
- Servers (VLAN 20) has **no IoT exception and no mDNS repeater**. HAOS lives on
  Automation (VLAN 30) precisely so the hypervisor management plane does not
  inherit the IoT-facing allows that Home Assistant needs.
