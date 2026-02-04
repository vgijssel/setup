<context>
# Overview

Deploy Home Assistant Operating System (HAOS) as a KubeVirt virtual machine in the enigma cluster's `tenant-root` namespace. HAOS is a purpose-built operating system optimized for running Home Assistant with built-in supervisor and add-on support. Running HAOS in the cluster provides high availability, easier backup management, and integration with existing infrastructure.

The deployment uses CozyStack's VMDisk and VMInstance CRDs to provision the VM through the FluxCD GitOps pipeline. A key requirement is attaching the VM to the physical LAN (192.168.50.0/25) for direct access to IoT devices on the network.

# Core Features

## FluxCD GitOps Deployment
- **What it does**: Manages HAOS VM infrastructure declaratively through Git
- **Why it's important**: Enables version control, rollback, and consistent deployments
- **How it works**: GitRepository tracks current branch, Kustomization applies manifests from `apps/haos-enigma/` path

## CozyStack VM Provisioning
- **What it does**: Provisions VM with HAOS qcow2 image via VMDisk and VMInstance CRDs
- **Why it's important**: Integrates with CozyStack's KubeVirt management layer
- **How it works**: VMDisk downloads HAOS image, VMInstance boots VM with UEFI firmware

## WholeIP External Access
- **What it does**: Exposes VM directly on a dedicated IP (192.168.50.101)
- **Why it's important**: Makes Home Assistant accessible without ingress configuration
- **How it works**: CozyStack's `externalMethod: WholeIP` assigns a dedicated IP from the cluster's external pool

## Underlay Network Attachment
- **What it does**: Connects VM directly to physical LAN via eno1 interface
- **Why it's important**: Enables HAOS to discover and communicate with IoT devices (Zigbee coordinators, ESPHome devices, etc.) on the LAN without NAT
- **How it works**: KubeOVN underlay network bridges VM to physical eno1 interface on cluster nodes

# User Experience

## User Personas
- **Home Automation Admin**: Manages Home Assistant instance, needs reliable access and easy updates
- **Infrastructure Engineer**: Maintains cluster, needs GitOps workflow for VM management

## Key User Flows
1. Initial deployment: Push to branch → Flux reconciles → VM boots → Access Home Assistant UI
2. Updates: Modify manifest → Push → Flux reconciles → VM restarts with changes
3. Network access: HAOS receives LAN IP → Discovers IoT devices → Integrations work natively

## UI/UX Considerations
- Home Assistant accessible at VM's WholeIP address on port 8123
- No complex ingress or TLS configuration needed for initial setup
- Direct LAN access enables discovery protocols (mDNS, SSDP) to work correctly
</context>

<PRD>
# Technical Architecture

## System Components

### Directory Structure
```
apps/haos-enigma/
├── kustomization.yaml              # v1beta1 - Lists all resources
├── kustomization-root.yaml         # v1 - FluxCD Kustomization resource
├── gitrepository-setup.yaml        # v1 - GitRepository tracking current branch
├── namespace-tenant-root.yaml      # Ensure namespace exists (may be pre-existing)
├── vmdisk-haos.yaml               # CozyStack VMDisk for HAOS image
├── vminstance-haos.yaml           # CozyStack VMInstance
├── vmclusterpreference-haos.yaml  # KubeVirt VirtualMachineClusterPreference
├── moon.yml                       # Moon monorepo configuration
├── version.txt                    # Version tracking
└── CHANGELOG.md                   # Release notes
```

### Phase 2 Additional Components (Underlay Networking)
```
apps/haos-enigma/
├── ... (existing files)
├── subnet-haos-underlay.yaml      # KubeOVN underlay subnet
├── provider-network-eno1.yaml     # KubeOVN provider network for eno1
├── kyverno-policy-haos-nic.yaml   # Kyverno policy to inject additional NIC
└── scripts/
    └── validate-haos-network.sh   # Validation script for network connectivity
```

## Data Models

### VMDisk Resource
```yaml
apiVersion: apps.cozystack.io/v1alpha1
kind: VMDisk
metadata:
  name: haos
  namespace: tenant-root
spec:
  optical: false
  source:
    http:
      url: https://github.com/home-assistant/operating-system/releases/download/17.0/haos_ova-17.0.qcow2.xz
  storage: 32Gi
  storageClass: replicated
```

### VMInstance Resource
```yaml
apiVersion: apps.cozystack.io/v1alpha1
kind: VMInstance
metadata:
  name: haos
  namespace: tenant-root
spec:
  externalPorts:
    - 22
  instanceType: u1.medium
  running: true
  disks:
    - name: haos
  external: true
  instanceProfile: haos
  externalMethod: WholeIP
```

### VirtualMachineClusterPreference Resource
```yaml
apiVersion: instancetype.kubevirt.io/v1beta1
kind: VirtualMachineClusterPreference
metadata:
  name: haos
spec:
  firmware:
    preferredUseEfi: true
    preferredUseSecureBoot: false
  features:
    preferredAcpi: {}
  devices:
    preferredDiskBus: virtio
    preferredRng: {}
```

### FluxCD GitRepository Resource
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: setup
  namespace: flux-system
spec:
  interval: 5m
  url: https://github.com/vgijssel/setup
  ref:
    branch: mg/feat/deploy-haos  # Current working branch for testing
```

### FluxCD Kustomization Resource
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: haos-enigma
  namespace: flux-system
spec:
  interval: 30m
  sourceRef:
    kind: GitRepository
    name: setup
  path: ./apps/haos-enigma
  prune: true
  wait: true
  timeout: 15m
```

## APIs and Integrations

### CozyStack Integration
- VMDisk CRD: Manages disk images and storage provisioning
- VMInstance CRD: Controls VM lifecycle and external networking
- Instance types: Uses predefined `u1.medium` instance type
- Instance profiles: Custom `haos` profile for VM preferences

### KubeOVN Integration (Phase 2)
- Provider Network: Configure eno1 as underlay interface on each node
- Subnet: Create subnet for VM attachment to physical LAN
- Network attachment: Additional NIC for VM with direct LAN access

### KubeVirt Integration
- VirtualMachineClusterPreference: UEFI boot configuration
- Live migration: Must remain supported with underlay network attachment
- Network interfaces: Primary (pod network) + Secondary (underlay)

## Infrastructure Requirements

### Storage
- StorageClass: `replicated` (CozyStack managed, replicated across nodes)
- Disk size: 32Gi minimum for HAOS

### Networking
- WholeIP assignment from cluster external IP pool
- Expected IP: 192.168.50.101 (verify with cluster configuration)
- Ports: 8123 (Home Assistant UI), 22 (SSH if enabled)

### Compute
- Instance type: `u1.medium` (2 vCPU, 4Gi memory typical)
- UEFI firmware required for HAOS boot

# Development Roadmap

## Phase 1: Basic VM Deployment (MVP)

### 1.1 Create FluxCD Application Structure
- Create `apps/haos-enigma/` directory
- Create `kustomization.yaml` listing all resources
- Create `gitrepository-setup.yaml` pointing to current branch
- Create `kustomization-root.yaml` FluxCD Kustomization resource
- Create `moon.yml` for monorepo integration

### 1.2 Create VM Resources
- Create `vmclusterpreference-haos.yaml` with UEFI boot configuration
- Create `vmdisk-haos.yaml` for HAOS image download
- Create `vminstance-haos.yaml` for VM provisioning
- Verify namespace `tenant-root` exists or create it

### 1.3 Deploy and Validate
- Apply kustomization to cluster (`kubectl apply -k apps/haos-enigma/`)
- Monitor VMDisk image download progress
- Watch VMInstance start and obtain IP
- Verify HAOS boots correctly (check VM console)
- Access Home Assistant UI at WholeIP:8123

### 1.4 FluxCD Integration
- Push changes to branch
- Trigger Flux reconciliation
- Verify continuous reconciliation works
- Test rollback by reverting commit

## Phase 2: Underlay Network Attachment

### 2.1 Research KubeOVN Underlay Configuration
- Study KubeOVN provider network documentation
- Understand how to configure eno1 as underlay interface
- Research VLAN requirements for underlay (no VLAN vs VLAN trunk)
- Document network topology changes

### 2.2 Configure KubeOVN Provider Network
- Create provider network resource for eno1 on each node
- Talos patches may be needed to unignore eno1 interface
- Create underlay subnet in 192.168.50.0/25 range
- Ensure DHCP or static IP assignment for VM secondary NIC

### 2.3 Modify VM for Additional NIC
- Research CozyStack VMInstance limitations for multi-NIC
- If not supported: Use Kyverno mutating policy to inject NIC
- Alternative: FluxCD post-build transformations
- Configure secondary interface with underlay network attachment

### 2.4 Validate Live Migration Compatibility
- Research KubeVirt interface types for live migration (bridge vs masquerade vs SR-IOV)
- Test live migration with underlay NIC attached
- Document performance characteristics
- Implement fallback if live migration fails

### 2.5 Network Validation
- Create validation script for network connectivity
- Test HAOS can discover IoT devices on LAN
- Verify mDNS/SSDP protocols work
- Add Goss tests for network validation

## Phase 3: Production Hardening

### 3.1 Monitoring and Alerting
- Add monitoring for VM health
- Configure alerts for disk space, memory, boot failures
- Integrate with existing cluster monitoring

### 3.2 Backup and Recovery
- Document backup strategy for HAOS configuration
- Test VM snapshot and restore
- Create runbook for disaster recovery

### 3.3 Security Hardening
- Review network exposure
- Document firewall rules if needed
- Ensure no unnecessary ports exposed

# Logical Dependency Chain

## Foundation (Must complete first)
1. FluxCD application structure (`kustomization.yaml`, `gitrepository-setup.yaml`, `kustomization-root.yaml`)
2. VirtualMachineClusterPreference for UEFI boot support

## VM Provisioning (Depends on Foundation)
3. VMDisk resource (downloads HAOS image)
4. VMInstance resource (depends on VMDisk and VirtualMachineClusterPreference)

## Validation (Depends on VM Running)
5. Manual validation of VM boot and Home Assistant accessibility
6. FluxCD reconciliation testing

## Underlay Networking (Can start research in parallel with Phase 1)
7. KubeOVN provider network configuration (requires Talos patches for eno1)
8. Underlay subnet creation
9. VM NIC injection (Kyverno policy or alternative)
10. Live migration validation

## Production Ready (Final phase)
11. Monitoring integration
12. Backup procedures
13. Security review

# Risks and Mitigations

## Technical Challenges

### Risk: HAOS Image Download Fails
- **Likelihood**: Low
- **Impact**: High - VM cannot start
- **Mitigation**: Pre-download image to local registry if needed; verify URL before deployment

### Risk: UEFI Boot Not Working
- **Likelihood**: Medium
- **Impact**: High - VM fails to boot
- **Mitigation**: Create VirtualMachineClusterPreference with correct settings; test with console access

### Risk: WholeIP Not Assigned
- **Likelihood**: Low
- **Impact**: Medium - VM not externally accessible
- **Mitigation**: Verify cluster has available IPs in external pool; check CozyStack external networking configuration

### Risk: KubeOVN Underlay Configuration Complexity
- **Likelihood**: High
- **Impact**: Medium - Phase 2 delayed
- **Mitigation**: Research thoroughly before implementation; consider alternative approaches if underlay proves too complex

### Risk: Live Migration Breaks with Underlay NIC
- **Likelihood**: Medium
- **Impact**: Medium - Reduced VM mobility
- **Mitigation**: Research KubeVirt interface types; consider using bridge mode; accept live migration limitation if necessary for LAN access

### Risk: Talos eno1 Interface Changes Break Cluster
- **Likelihood**: Low
- **Impact**: High - Cluster networking affected
- **Mitigation**: Test in non-production environment first; have rollback plan for Talos patches

## MVP Definition
- Minimum viable: VM boots with HAOS, accessible via WholeIP on port 8123
- Home Assistant UI loads and initial setup can be completed
- FluxCD reconciliation works for the application

## Resource Constraints
- Single VM deployment (not HA)
- Depends on existing cluster infrastructure
- Requires understanding of KubeOVN and KubeVirt internals for Phase 2

# Appendix

## Reference Documentation
- [HAOS Releases](https://github.com/home-assistant/operating-system/releases)
- [CozyStack Documentation](https://cozystack.io/docs/)
- [KubeVirt Instance Types](https://kubevirt.io/user-guide/virtual_machines/instancetypes/)
- [KubeOVN Underlay Networks](https://kubeovn.github.io/docs/v1.12.x/en/guide/underlay/)
- [KubeVirt Live Migration](https://kubevirt.io/user-guide/operations/live_migration/)

## Existing Cluster Configuration References
- FluxCD pattern: `apps/coder-prod/` structure
- CozyStack config: `apps/enigma-cozy/cozystack.yaml`
- Network topology: `apps/enigma-cozy/network.md`
- Talos patches: `apps/enigma-cozy/*.patch.yaml`

## Network Topology

### Current Cluster Network
```
Control Plane Nodes (LAN via enp6s0.50):
- illusion:        192.168.50.10
- the-dome:        192.168.50.11
- the-toy-factory: 192.168.50.12
- Kubevip VIP:     192.168.50.50
- Gateway:         192.168.50.1

Worker Node (Hetzner Cloud):
- here-i-am:       46.224.93.115 (public)

Physical Interfaces (currently ignored):
- eno1: Available on all control plane nodes, configured with ignore: true
```

### Target HAOS Network
```
Primary NIC (WholeIP):
- IP: 192.168.50.101 (from cluster external pool)
- Access: Home Assistant UI, SSH

Secondary NIC (Underlay - Phase 2):
- Network: 192.168.50.0/25 (LAN)
- Purpose: IoT device discovery, direct LAN access
- Interface: Attached to eno1 via KubeOVN underlay
```

## Technical Specifications

### HAOS Image
- Version: 17.0
- Format: qcow2.xz (compressed)
- URL: https://github.com/home-assistant/operating-system/releases/download/17.0/haos_ova-17.0.qcow2.xz
- Requires: UEFI boot, virtio drivers

### Instance Type
- Type: u1.medium
- Expected resources: 2 vCPU, 4Gi memory (verify with CozyStack)

### Storage
- Class: replicated
- Size: 32Gi
- Type: Block storage via CozyStack/KubeVirt
</PRD>
