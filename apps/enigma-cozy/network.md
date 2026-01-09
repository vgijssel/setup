# Enigma Cluster Network Architecture

## Overview

The Enigma cluster is a hybrid Kubernetes cluster running TalosOS with CozyStack on top. It consists of control plane nodes in a local area network (LAN) and a worker node in Hetzner Cloud, connected via Kubespan for secure cross-network communication.

## Node Configuration

### Control Plane Nodes (LAN)

All control plane nodes are located in the local network at `192.168.50.0/24`:

| Node | IP Address | Role | Location |
|------|------------|------|----------|
| ilusion | 192.168.50.10 | Control Plane | LAN |
| the-dome | 192.168.50.11 | Control Plane | LAN |
| the-toy-factory | 192.168.50.12 | Control Plane | LAN |

### Worker Nodes (Cloud)

| Node | IP Address | Role | Location |
|------|------------|------|----------|
| here-i-am | 46.224.93.115 | Worker + Gateway | Hetzner Cloud |

## Network Connectivity

### Kubespan

The cluster uses **Kubespan** to establish secure connectivity between nodes across different networks:

- Control plane nodes (LAN) ↔ Worker node (Hetzner Cloud)
- Encrypted WireGuard-based mesh network
- Enables seamless pod-to-pod communication across network boundaries

### Public Traffic Gateway

**here-i-am** (46.224.93.115) serves as the gateway for all public traffic from the internet:

- Public IP: `46.224.93.115`
- Routes external traffic into the cluster
- Provides ingress capability for services exposed to the internet

## Technology Stack

- **Operating System**: TalosOS
- **Kubernetes Distribution**: CozyStack
- **Network Overlay**: Kubespan (WireGuard-based)
- **Cloud Provider**: Hetzner Cloud (for worker node)

## Network Diagram

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

## Configuration Files

- **Kubespan Configuration**: Managed through Talos machine config
- **Network Patches**: `*.patch.yaml` files in this directory
- **MetalLB**: `metallb-ip-address-pool.yml`, `metallb-l2-advertisement.yml`

## Resources

- [Talos - Kubespan Networking](https://docs.siderolabs.com/talos/v1.11/networking/kubespan)
- [Talos - Learn More About Kubespan](https://docs.siderolabs.com/talos/v1.11/learn-more/kubespan)
- [CozyStack - Platform Stack Guide](https://cozystack.io/docs/guides/platform-stack/)
