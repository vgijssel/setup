# Harvester HA Cluster — Configuration Reference

3-node Harvester HCI cluster deployed on VLAN 20 (Servers, `192.168.20.0/24`).

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

## Firewall Considerations

Per network.md firewall policy:
- Trusted (VLAN 40) can initiate connections to Servers (VLAN 20) — admin access
- Harvester management UI reachable from Trusted clients at `https://192.168.20.9`
- Servers (VLAN 20) has **no IoT exception and no mDNS repeater**. HAOS lives on
  Automation (VLAN 30) precisely so the hypervisor management plane does not
  inherit the IoT-facing allows that Home Assistant needs.
