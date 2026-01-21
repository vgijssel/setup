# Docker macvlan Networking Architecture for Multi-VLAN Pi-hole

This document describes the networking architecture for running Pi-hole containers on separate VLAN 50 and admin LAN networks using Docker macvlan.

## Architecture Overview

```
+------------------+
|  Network Switch  |
+--------+---------+
         |
         | Trunk port (VLAN 1, VLAN 50)
         |
+--------+---------+
|    eth0 (Host)   |
+--------+---------+
         |
    +----+----+
    |         |
+---+---+ +---+----+
| eth0  | | eth0.50|  (VLAN 50 subinterface created via Netplan)
+---+---+ +--------+
    |          |
+---+---+  +---+-------+
|  br0  |  |  macvlan  |
+---+---+  | vlan50    |
    |      +-----+-----+
+---+--------+   |
|   macvlan  |   |
|   admin    |   |
+-----+------+   |
      |          |
+-----+------+  ++------------+
| pihole-    |  | pihole-     |
| admin      |  | vlan50      |
| 192.168.1. |  | 192.168.50. |
| 16         |  | 2           |
+------------+  +-------------+
```

## Key Findings

### Netplan Interface Requirements

**Single physical interface is sufficient** when VLAN subinterfaces are configured via Netplan. Two separate physical interfaces are NOT required.

The configuration uses:
- `eth0` - Physical interface connected to trunk port
- `eth0.50` - VLAN 50 subinterface (created by Netplan)
- `br0` - Bridge interface on the admin LAN (192.168.1.0/24)

### macvlan Network Attachment

Docker macvlan networks attach directly to:
1. `eth0.50` (VLAN 50 subinterface) for the VLAN 50 Pi-hole container
2. `br0` (bridge interface) for the admin LAN Pi-hole container

macvlan creates virtual interfaces with unique MAC addresses for each container, allowing them to appear as separate physical devices on the network.

## Current Implementation

### Network Configuration (docker-compose.yml)

```yaml
networks:
  vlan50:
    driver: macvlan
    driver_opts:
      parent: eth0.50
    ipam:
      config:
        - subnet: 192.168.50.0/24
          gateway: 192.168.50.1
          ip_range: 192.168.50.2/32

  admin:
    driver: macvlan
    driver_opts:
      parent: br0
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
          ip_range: 192.168.1.16/32
```

### Container Configuration

- **pihole-vlan50**: IP 192.168.50.2, attached to `vlan50` macvlan network
- **pihole-admin**: IP 192.168.1.16, attached to `admin` macvlan network

## Prerequisites

1. **VLAN-tagged trunk port**: The host must be connected to a switch port that allows VLAN 50 tagged traffic and untagged traffic for the admin LAN.

2. **8021q kernel module**: Required for VLAN tagging support.
   ```bash
   modprobe 8021q
   echo 8021q >> /etc/modules
   ```

3. **Docker with macvlan support**: Standard Docker installation supports macvlan networks.

## Netplan Configuration

See `netplan-vlan-example.yml` for the complete Netplan configuration.

The Netplan configuration creates:
1. A bridge `br0` for the admin LAN with a static IP
2. A VLAN subinterface `eth0.50` for VLAN 50 traffic

Both interfaces serve as parent interfaces for Docker macvlan networks.

## Troubleshooting

### Host Cannot Reach macvlan Containers

This is expected behavior - Linux macvlan does not allow communication between the host and its macvlan interfaces. Workarounds:

1. **Access containers from other hosts** on the same network
2. **Create a macvlan interface on the host** to communicate with containers:
   ```bash
   # Create host-side macvlan interface
   ip link add macvlan-host link br0 type macvlan mode bridge
   ip addr add 192.168.1.17/32 dev macvlan-host
   ip link set macvlan-host up
   ip route add 192.168.1.16/32 dev macvlan-host
   ```

### IP Address Conflicts

- Ensure macvlan IP ranges do not overlap with DHCP pools
- Use `ip_range` in docker-compose to restrict container IPs to specific addresses
- The current configuration uses `/32` ranges to assign exact IPs

### Container Cannot Reach External Networks

1. Verify the parent interface is up and configured correctly
2. Check that VLAN tagging is working: `ip -d link show eth0.50`
3. Verify bridge configuration: `bridge link show`
4. Ensure routing is correct: `ip route`

### macvlan Network Creation Fails

Common causes:
- Parent interface does not exist
- Missing kernel module (8021q for VLANs)
- Docker daemon needs restart after interface changes

## Best Practices

1. **IP Range Reservation**: Always use narrow `ip_range` specifications to prevent IP conflicts with DHCP.

2. **Static IPs**: Assign static IPs to Pi-hole containers since they serve as DNS servers.

3. **Health Checks**: Configure Docker health checks to ensure containers are responding to DNS queries.

4. **Separate Instances**: Running separate Pi-hole instances per VLAN provides better isolation and allows VLAN-specific DNS configurations.

5. **Monitoring**: Monitor container health with Docker health checks and external monitoring tools.

## Related Files

- `apps/pihole-prod/docker-compose.yml` - Docker Compose configuration
- `libs/ansible/roles/common/tasks/networking.yml` - Netplan deployment task
- `libs/ansible/roles/common/templates/90-common-network.yaml.j2` - Netplan template
