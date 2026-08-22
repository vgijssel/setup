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

| Role | IP | Notes |
|------|-----|-------|
| Node 1 | `192.168.20.10` | |
| Node 2 | `192.168.20.11` | |
| Node 3 | `192.168.20.12` | |
| Cluster VIP | `192.168.20.9` | Management VIP — must NOT be assigned to any node |

## Cluster Configuration

| Parameter | Value |
|-----------|-------|
| Cluster token | *(generate a random ASCII string at deploy time)* |
| Management VIP | `192.168.20.9` |
| Node IPs | `192.168.20.10`, `192.168.20.11`, `192.168.20.12` |
| DNS servers | `192.168.20.1` |
| NTP servers | `pool.ntp.org` |
| Proxy | None (direct internet via gateway) |

## Switch Port Profile

Nodes connect to access ports on VLAN 20 (untagged). No trunking required unless
Harvester needs to reach other VLANs directly (it shouldn't — inter-VLAN traffic
routes through the Omada gateway per firewall policy).

## Firewall Considerations

Per network.md firewall policy:
- Trusted (VLAN 30) can initiate connections to Servers (VLAN 20) — admin access
- HAOS (VLAN 20) ↔ IoT (VLAN 40) allowed for Home Assistant integration
- Harvester management UI reachable from Trusted clients at `https://192.168.20.9`
