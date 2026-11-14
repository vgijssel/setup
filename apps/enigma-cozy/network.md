# Enigma cluster network architecture

## Overview

The Enigma cluster is a hybrid Kubernetes cluster running TalosOS with CozyStack on top. It consists of control plane nodes in a local area network (LAN) and a worker node in Hetzner’s cloud service, connected via Kubespan for secure cross-network communication.

## Node configuration

### Control plane nodes (local network)

All control plane nodes are located in the local network at `192.168.50.0/24`:

| Node | IP Address | Role | Location |
|------|------------|------|----------|
| ilusion | 192.168.50.10 | Control Plane | LAN |
| the-dome | 192.168.50.11 | Control Plane | LAN |
| the-toy-factory | 192.168.50.12 | Control Plane | LAN |

### Worker nodes (cloud)

| Node | IP Address | Role | Location |
|------|------------|------|----------|
| here-i-am | 46.224.93.115 | Worker + Gateway | Hetzner’s cloud service |

## Network connectivity

### Kubespan

The cluster uses **Kubespan** to establish secure connectivity between nodes across different networks:

- Control plane nodes (LAN) ↔ Worker node (Hetzner’s cloud service)
- Encrypted WireGuard-based mesh network
- Enables seamless pod-to-pod communication across network boundaries

### Public traffic gateway

**here-i-am** (46.224.93.115) serves as the gateway for all public traffic from the internet:

- Public IP: `46.224.93.115`
- Routes external traffic into the cluster
- Provides ingress capability for services exposed to the internet

## Technology stack

- **Operating System**: TalosOS
- **Kubernetes Distribution**: CozyStack
- **Network Overlay**: Kubespan (WireGuard-based)
- **Hosting provider**: Hetzner’s cloud service (for worker node)

## Network diagram

```
Internet
   │
   ├─────────────────────────────────┐
   │                                 │
   ▼                                 ▼
here-i-am                      LAN (192.168.50.0/24)
46.224.93.115                        │
(Hetzner Cloud)                      ├─ ilusion (192.168.50.10)
Worker + Gateway                     ├─ the-dome (192.168.50.11)
   │                                 └─ the-toy-factory (192.168.50.12)
   │                                    Control Plane Nodes
   │                                           │
   └───────────── Kubespan ───────────────────┘
          (Encrypted WireGuard Mesh)
```

## Ingress traffic routing

### Tailscale Integration

Every ingress inside the enigma-cozy cluster gets a dedicated Tailscale service. For example, an ingress route like `dashboard.enigma.vijgssel.nl` has its own Tailscale service named `dashboard`. This architecture enables individual ACL control for each ingress through Tailscale's access control system.

### Internal traffic (local network)

The enigma nodes reside in VLAN `192.168.50.0/24`. A Pihole instance within this VLAN contains DNS entries for all cluster ingresses, mapping them to their internal MetalLB IPs.

When a service inside the enigma-cozy cluster accesses `dashboard.enigma.vijgssel.nl`, the traffic is routed directly to the local MetalLB IP (for example, `192.168.50.100`) via Pihole DNS resolution—**not** through Tailscale.

### External traffic (outside the virtual local network)

Traffic from outside the `192.168.50.0/24` VLAN is routed through the individual Tailscale services, providing:

- Secure encrypted access to cluster ingresses
- Per-ingress ACL enforcement via Tailscale
- No direct exposure of MetalLB IPs to external networks

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ingress Traffic Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  External Client                    Internal Client (LAN)       │
│        │                                   │                    │
│        ▼                                   ▼                    │
│  Tailscale Service              Pihole DNS Resolution           │
│  (e.g., "dashboard")           (dashboard.enigma.vijgssel.nl)   │
│        │                                   │                    │
│        │                                   ▼                    │
│        │                          MetalLB IP (192.168.50.x)     │
│        │                                   │                    │
│        └───────────────┬───────────────────┘                    │
│                        ▼                                        │
│                   Ingress Pod                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration files

- **Kubespan Configuration**: Managed through Talos machine config
- **Network Patches**: `*.patch.yaml` files in this directory
- **MetalLB**: `metallb-ip-address-pool.yml`, `metallb-l2-advertisement.yml`

## Resources

- [Talos - Kubespan Networking](https://docs.siderolabs.com/talos/v1.11/networking/kubespan)
- [Talos - Learn More About Kubespan](https://docs.siderolabs.com/talos/v1.11/learn-more/kubespan)
- [CozyStack - Platform Stack Guide](https://cozystack.io/docs/guides/platform-stack/)
