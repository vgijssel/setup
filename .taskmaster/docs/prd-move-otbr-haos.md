<context>
# Overview

This PRD covers the migration of the Open Thread Border Router (OTBR) from the embedded Home Assistant OS (HAOS) add-on running on the legacy hypervisor to a standalone Docker container on the pihole-prod machine.

**Problem Statement:**
- HAOS is being migrated from the legacy hypervisor to the enigma Kubernetes cluster
- The OTBR add-on cannot be migrated cleanly because:
  1. CozyStack (the Kubernetes platform) does not support USB passthrough
  2. The USB-attached Thread radio prevents live migration of the HAOS VM to other nodes
- This blocks the complete migration of HAOS to the enigma cluster

**Solution:**
Deploy OTBR as a Docker container on pihole-prod (192.168.1.15), which already hosts Pi-hole containers and has direct USB access. OTBR will have its own separate Docker Compose file (`/opt/otbr/docker-compose.yml`) with its own macvlan network definition to maintain isolation from the existing Pi-hole deployment. OTBR will receive static IP 192.168.1.17 on the ADMIN network (192.168.1.0/24).

**Why pihole-prod:**
- Already running Docker with macvlan networking for static IPs
- Physical machine with direct USB access (no virtualization layer)
- On the ADMIN network with established network configuration
- Ansible-managed with existing deployment patterns

# Core Features

## 1. OTBR Docker Container Deployment
- Deploy the official `openthread/otbr` container image
- Configure with USB passthrough for the Thread radio dongle
- Assign static IP 192.168.1.17 on the ADMIN macvlan network
- Enable mDNS for Thread device discovery
- Expose required ports: 8080 (web UI), 8081 (REST API)

## 2. USB Device Passthrough
- Pass the Thread radio USB device to the Docker container
- Use udev rules to ensure consistent device naming
- Handle device permissions for container access

## 3. Network Configuration
- Create separate macvlan network definition in OTBR's own docker-compose.yml
- Configure dedicated ip_range for 192.168.1.17 (isolated from Pi-hole network)
- Do NOT modify existing Pi-hole docker-compose.yml or network definitions
- Ensure proper routing for Thread network traffic

## 4. IPv6 and Kernel Configuration for Thread/Matter
Thread and Matter protocols require specific network and kernel configurations:

### IPv6 Requirements
- **IPv6 is mandatory**: Thread uses IPv6 exclusively for all communication
- Enable IPv6 on the host and within Docker networks
- Configure IPv6 forwarding for border router functionality
- Enable IPv6 multicast for Thread device discovery

### Kernel Settings
- Enable IPv6 forwarding (`net.ipv6.conf.all.forwarding=1`)
- Configure proper multicast settings for mDNS/DNS-SD
- Set appropriate neighbor discovery parameters
- Enable packet forwarding between interfaces

### Docker IPv6 Configuration
- Enable IPv6 in Docker daemon configuration
- Configure IPv6 subnet for macvlan network
- Ensure containers can communicate via IPv6

## 5. Goss Validation Tests
Automated validation tests to ensure Thread/Matter networking and OTBR are correctly configured:

### Host Configuration Tests
- Validate IPv6 forwarding kernel settings are active
- Validate IPv4 forwarding is enabled
- Validate multicast forwarding settings
- Validate neighbor discovery table configuration
- Validate sysctl configuration file exists

### Docker Configuration Tests
- Validate Docker daemon has IPv6 enabled
- Validate Docker is running and healthy

### Network Connectivity Tests
- Validate OTBR container has correct IPv4 address (192.168.1.17)
- Validate OTBR container has IPv6 connectivity
- Validate OTBR web UI is accessible (port 8080)
- Validate OTBR REST API is accessible (port 8081)
- Validate mDNS port is available (5353/udp)

### OTBR Container Tests
- Validate OTBR container is running
- Validate Thread radio USB device is accessible
- Validate OTBR agent is operational
- Validate Thread network is formed

## 6. Home Assistant Integration
- Configure HAOS to use the external OTBR instance
- Update Thread integration to point to 192.168.1.17
- Remove the embedded OTBR add-on from HAOS

# User Experience

## User Personas
- **Home Automation Admin**: Manages Thread/Matter devices through Home Assistant
- **System Administrator**: Maintains infrastructure and performs migrations

## Key User Flows
1. Thread devices continue to function seamlessly after migration
2. OTBR web UI accessible at 192.168.1.17:8080
3. Home Assistant Thread integration works with new OTBR endpoint

## UI/UX Considerations
- OTBR web interface remains accessible for debugging
- No user-facing changes to Thread device operation
- Minimal downtime during migration (planned maintenance window)
</context>

<PRD>
# Technical Architecture

## System Components

### Current State (Legacy)
```
┌─────────────────────────────────────────┐
│         Legacy Hypervisor               │
│  ┌───────────────────────────────────┐  │
│  │            HAOS VM                │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   OTBR Add-on (embedded)    │  │  │
│  │  │   USB: Thread Radio         │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│           ↑ USB Passthrough             │
│       [Thread Radio Dongle]             │
└─────────────────────────────────────────┘
```

### Target State
```
┌─────────────────────────────────────────┐
│       Enigma Kubernetes Cluster         │
│  ┌───────────────────────────────────┐  │
│  │         HAOS VM (CozyStack)       │  │
│  │   Thread Integration → External   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              │
              │ Network (192.168.1.0/24)
              ↓
┌─────────────────────────────────────────┐
│         pihole-prod (192.168.1.15)      │
│  ┌───────────────────────────────────┐  │
│  │   Docker Containers               │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ pihole-admin (192.168.1.16) │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ otbr (192.168.1.17)         │  │  │
│  │  │ USB: Thread Radio           │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│           ↑ USB Direct Access           │
│       [Thread Radio Dongle]             │
└─────────────────────────────────────────┘
```

## Docker Compose Configuration

OTBR will have its own separate Docker Compose file at `/opt/otbr/docker-compose.yml`. This keeps it isolated from the existing Pi-hole deployment and allows independent lifecycle management.

**Important:** Do NOT modify the existing `/opt/pihole/docker-compose.yml` - OTBR runs as a completely separate Docker Compose project.

Create `/opt/otbr/docker-compose.yml`:

```yaml
# OTBR (Open Thread Border Router) Docker Compose Configuration
# Deployed to /opt/otbr/docker-compose.yml
# Separate from Pi-hole to maintain isolation

services:
  otbr:
    container_name: otbr
    image: openthread/otbr:latest  # Pin to specific version
    hostname: otbr
    networks:
      otbr-admin:
        ipv4_address: 192.168.1.17
    environment:
      TZ: Europe/Amsterdam
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0  # Thread radio device
    volumes:
      - /opt/otbr/data:/data
    cap_add:
      - NET_ADMIN
      - NET_RAW
    privileged: true  # Required for Thread networking
    restart: unless-stopped

networks:
  otbr-admin:
    driver: macvlan
    driver_opts:
      parent: eth0
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
          ip_range: 192.168.1.17/32  # Single IP for OTBR only
```

## Network Isolation Strategy

OTBR uses its own macvlan network definition (`otbr-admin`) separate from Pi-hole's network (`admin`):

| Component | Network Name | IP Range | Docker Compose File |
|-----------|--------------|----------|---------------------|
| Pi-hole Admin | admin | 192.168.1.16/32 | /opt/pihole/docker-compose.yml |
| Pi-hole VLAN50 | vlan50 | 192.168.50.2/32 | /opt/pihole/docker-compose.yml |
| OTBR | otbr-admin | 192.168.1.17/32 | /opt/otbr/docker-compose.yml |

**Benefits of separation:**
- Independent deployment and updates
- No risk of breaking Pi-hole when modifying OTBR
- Cleaner rollback - just stop OTBR compose project
- Separate logging and monitoring
- Each project can be managed with `docker compose -f <file>` independently

## IPv6 and Kernel Configuration (Thread/Matter Best Practices)

Thread is an IPv6-only protocol. Proper IPv6 configuration is **mandatory** for OTBR operation.

### Host Kernel Settings (sysctl)

Create `/etc/sysctl.d/99-thread-matter.conf`:

```ini
# =============================================================================
# Thread/Matter Network Configuration
# Required for Open Thread Border Router operation
# =============================================================================

# --- IPv6 Forwarding (REQUIRED) ---
# OTBR acts as a router between Thread mesh and local network
net.ipv6.conf.all.forwarding=1
net.ipv6.conf.default.forwarding=1

# --- IPv4 Forwarding ---
# Required for Docker networking and NAT64 if used
net.ipv4.ip_forward=1

# --- Multicast Configuration ---
# Thread uses multicast for device discovery and group communication
net.ipv6.conf.all.mc_forwarding=1
net.ipv6.conf.default.mc_forwarding=1

# --- Neighbor Discovery ---
# Increase neighbor table size for Thread networks with many devices
net.ipv6.neigh.default.gc_thresh1=1024
net.ipv6.neigh.default.gc_thresh2=2048
net.ipv6.neigh.default.gc_thresh3=4096

# --- Accept Router Advertisements ---
# Allow receiving RAs even when forwarding is enabled (for dual-stack)
# 2 = Accept RAs even if forwarding is enabled
net.ipv6.conf.all.accept_ra=2
net.ipv6.conf.default.accept_ra=2
net.ipv6.conf.eth0.accept_ra=2

# --- Disable IPv6 Privacy Extensions for OTBR interface ---
# OTBR needs stable addresses for Thread commissioning
net.ipv6.conf.all.use_tempaddr=0
net.ipv6.conf.default.use_tempaddr=0

# --- Proxy NDP (Neighbor Discovery Protocol) ---
# Required for Thread devices to be reachable from LAN
net.ipv6.conf.all.proxy_ndp=1
net.ipv6.conf.default.proxy_ndp=1
```

Apply settings:
```bash
sudo sysctl --system
```

### Netplan IPv6 Configuration

Update `/etc/netplan/01-netcfg.yaml` to include IPv6:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 192.168.1.15/24
        # Add IPv6 link-local is automatic, but ensure global if available
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 192.168.1.1
      # Enable IPv6 - accept router advertisements
      accept-ra: true
      ipv6-privacy: false
  vlans:
    eth0.50:
      id: 50
      link: eth0
      dhcp4: false
      dhcp6: false
      accept-ra: true
```

### Docker Daemon IPv6 Configuration

Update `/etc/docker/daemon.json`:

```json
{
  "ipv6": true,
  "fixed-cidr-v6": "fd00:dead:beef::/48",
  "experimental": true,
  "ip6tables": true
}
```

Restart Docker after changes:
```bash
sudo systemctl restart docker
```

### OTBR Docker Compose with IPv6

Complete `/opt/otbr/docker-compose.yml` with IPv6 support:

```yaml
# OTBR (Open Thread Border Router) Docker Compose Configuration
# Deployed to /opt/otbr/docker-compose.yml
# Separate from Pi-hole to maintain isolation

services:
  otbr:
    container_name: otbr
    image: openthread/otbr:latest  # Pin to specific version
    hostname: otbr
    networks:
      otbr-admin:
        ipv4_address: 192.168.1.17
        ipv6_address: fd00:otbr::17
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv6.conf.all.forwarding=1
      - net.ipv4.ip_forward=1
    environment:
      TZ: Europe/Amsterdam
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0  # Thread radio device
    volumes:
      - /opt/otbr/data:/data
    cap_add:
      - NET_ADMIN
      - NET_RAW
    privileged: true  # Required for Thread networking
    restart: unless-stopped

networks:
  otbr-admin:
    driver: macvlan
    enable_ipv6: true
    driver_opts:
      parent: eth0
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
          ip_range: 192.168.1.17/32  # Single IP for OTBR only
        - subnet: fd00:otbr::/64  # ULA prefix for Thread/Matter (separate from any Pi-hole IPv6)
```

**Note:** The IPv6 subnet `fd00:otbr::/64` is a ULA (Unique Local Address) prefix specifically for OTBR, ensuring no conflict with other Docker networks on the host.

### Firewall Configuration (if applicable)

If UFW or iptables is active, allow Thread/Matter traffic:

```bash
# mDNS for device discovery
sudo ufw allow 5353/udp comment 'mDNS'

# Matter commissioning port
sudo ufw allow 5540/udp comment 'Matter'

# OTBR Web UI and API (optional, restrict to admin network)
sudo ufw allow from 192.168.1.0/24 to any port 8080 proto tcp comment 'OTBR Web UI'
sudo ufw allow from 192.168.1.0/24 to any port 8081 proto tcp comment 'OTBR REST API'

# Allow IPv6 forwarding in UFW
# Edit /etc/ufw/sysctl.conf:
# net/ipv6/conf/default/forwarding=1
# net/ipv6/conf/all/forwarding=1
```

## USB Device Configuration

### Identify Thread Radio Device
```bash
# Common Thread radio devices:
# - Silicon Labs EZSP (e.g., SkyConnect, ZBDongle-E)
# - Nordic nRF52840 dongles
lsusb  # Identify vendor:product ID
```

### Udev Rule for Consistent Naming
```
# /etc/udev/rules.d/99-thread-radio.rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="XXXX", ATTRS{idProduct}=="YYYY", SYMLINK+="thread-radio"
```

## Required Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 8080 | TCP | OTBR Web UI |
| 8081 | TCP | OTBR REST API |
| 5353 | UDP | mDNS (Thread discovery) |

## Data Persistence

- `/opt/otbr/data` - OTBR persistent data and configuration
- Thread network credentials and state

# Development Roadmap

## Phase 1: Preparation (Pre-Migration)

1. **Identify USB Device**
   - SSH to legacy hypervisor
   - Identify the Thread radio device (vendor:product ID)
   - Document current OTBR configuration from HAOS

2. **Backup Thread Network**
   - Export Thread network credentials from HAOS OTBR
   - Document connected Thread devices and their addresses

3. **Prepare pihole-prod**
   - Verify USB port availability
   - Plan physical relocation of USB dongle

## Phase 2: Infrastructure Setup

1. **Configure Kernel Settings for Thread/Matter**
   - Create `/etc/sysctl.d/99-thread-matter.conf` with IPv6 forwarding and multicast settings
   - Apply sysctl settings with `sysctl --system`
   - Verify settings are active

2. **Update Netplan for IPv6**
   - Enable IPv6 and router advertisement acceptance on eth0
   - Disable IPv6 privacy extensions for stable addressing
   - Apply netplan configuration

3. **Configure Docker for IPv6**
   - Update `/etc/docker/daemon.json` with IPv6 settings
   - Restart Docker daemon
   - Verify Docker IPv6 networking works

4. **Create OTBR Directory Structure**
   - Create /opt/otbr directory
   - Create /opt/otbr/data with proper permissions
   - Prepare for Docker Compose deployment

5. **Create Udev Rules**
   - Add udev rule for consistent USB device naming
   - Reload udev rules

6. **Configure Firewall (if applicable)**
   - Allow mDNS (5353/udp) for device discovery
   - Allow Matter port (5540/udp)
   - Allow OTBR web UI/API from admin network
   - Enable IPv6 forwarding in UFW if used

## Phase 3: OTBR Deployment

1. **Create OTBR Docker Compose File**
   - Create `/opt/otbr/docker-compose.yml` with OTBR service definition
   - Define separate `otbr-admin` macvlan network (do NOT modify Pi-hole's network)
   - Configure IPv6 with dedicated ULA prefix (fd00:otbr::/64)
   - Pin container image to specific version
   - Configure USB passthrough and networking

2. **Deploy OTBR Container**
   - Relocate USB dongle to pihole-prod
   - Run `docker compose -f /opt/otbr/docker-compose.yml up -d`
   - Verify container starts and USB device is recognized
   - Verify network connectivity (192.168.1.17)

3. **Restore Thread Network**
   - Import Thread network credentials
   - Verify Thread network comes online
   - Check connected devices rejoin

## Phase 4: Home Assistant Integration

1. **Update HAOS Thread Configuration**
   - Point Thread integration to 192.168.1.17
   - Test connectivity to external OTBR

2. **Remove Embedded OTBR Add-on**
   - Disable OTBR add-on in HAOS
   - Remove USB passthrough from HAOS VM

3. **Validation**
   - Verify all Thread devices are operational
   - Test device control and automation

## Phase 5: Validation and Testing

1. **Create Goss Test Suite**
   - Create `apps/pihole-prod/goss.yaml` with Thread/Matter validation tests
   - Add kernel settings validation tests
   - Add Docker IPv6 configuration tests
   - Add OTBR container and network connectivity tests
   - Add regression tests for existing Pi-hole containers

2. **Run Validation Suite**
   - Execute Goss tests to validate complete configuration
   - Verify all Thread/Matter networking requirements pass
   - Confirm OTBR is operational and Thread network is formed
   - Ensure Pi-hole containers are unaffected (regression)

3. **Add Moon Task Integration**
   - Add `validate` task to `apps/pihole-prod/moon.yml`
   - Document test execution in README

## Phase 6: Cleanup

1. **Documentation**
   - Update network documentation with new OTBR location
   - Document recovery procedures

2. **Monitoring**
   - Add OTBR container to monitoring
   - Set up alerts for container health

# Logical Dependency Chain

```
1. Identify USB Device & Document Config
   └── 2. Backup Thread Network Credentials
       │
       ├── 3. Configure Kernel Settings (sysctl) ──┐
       ├── 4. Update Netplan for IPv6 ─────────────┼── Can be done in parallel
       ├── 5. Configure Docker for IPv6 ───────────┤
       ├── 6. Configure Firewall ──────────────────┤
       └── 7. Create Goss Test Suite ──────────────┘
               │
               └── 8. Create OTBR Directory Structure (/opt/otbr)
                   └── 9. Create Udev Rules
                       └── 10. Create OTBR Docker Compose File (separate from Pi-hole)
                           └── 11. Relocate USB Dongle (Physical)
                               └── 12. Deploy OTBR Container
                                   └── 13. Run Goss Validation Tests
                                       └── 14. Restore Thread Network
                                           └── 15. Update HAOS Thread Integration
                                               └── 16. Remove HAOS OTBR Add-on
                                                   └── 17. Final Validation & Cleanup
```

**Critical Path:**
- USB dongle relocation is a physical dependency that gates deployment
- Thread network must be backed up before stopping HAOS OTBR
- IPv6 and kernel settings MUST be configured before OTBR deployment
- OTBR has its own docker-compose.yml - do NOT modify Pi-hole's configuration
- Goss tests MUST pass before proceeding with Thread network restoration
- HAOS integration update must happen after OTBR is verified working

**Quick Wins (can be done before physical migration):**
- Kernel sysctl settings for IPv6/Thread
- Netplan IPv6 configuration
- Docker IPv6 configuration
- Firewall rules
- Goss test suite creation
- OTBR directory structure and docker-compose.yml
- Udev rules

# Risks and Mitigations

## Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Thread network credentials lost | High | Low | Export credentials before migration; document backup procedure |
| USB device not recognized | High | Medium | Test device compatibility before migration; have backup dongle |
| Thread devices fail to rejoin | Medium | Medium | Keep old infrastructure available for rollback window |
| Network connectivity issues | Medium | Low | Test macvlan config with test container first |
| IPv6 misconfiguration breaks Thread | High | Medium | Test IPv6 connectivity before OTBR deployment; verify sysctl settings |
| Docker IPv6 networking issues | Medium | Medium | Test with simple IPv6 container before OTBR; verify daemon.json |
| Firewall blocks Thread/mDNS traffic | Medium | Low | Document all required ports; test mDNS discovery before migration |
| Goss tests fail post-deployment | Medium | Low | Run Goss tests incrementally during setup; fix issues before proceeding |

## MVP Definition

The minimum viable migration includes:
1. Host configured with IPv6 forwarding and Thread/Matter kernel settings
2. Docker configured for IPv6 networking
3. OTBR container running with USB passthrough and IPv6 connectivity
4. Thread network operational with existing devices
5. Home Assistant can communicate with OTBR
6. Goss test suite passing for all critical validations
7. Basic monitoring of container health

**Not required for MVP:**
- Automated backup/restore procedures
- High availability setup
- Comprehensive monitoring dashboard
- Full IPv6 internet connectivity (link-local/ULA sufficient for Thread)
- Complete Goss test coverage (focus on critical path tests)

## Rollback Plan

If migration fails:
1. Stop OTBR container on pihole-prod
2. Relocate USB dongle back to legacy hypervisor
3. Re-enable OTBR add-on in HAOS
4. Revert HAOS Thread integration to embedded OTBR

Rollback window: 24 hours after migration

# Goss Test Specification

Create `apps/pihole-prod/goss.yaml` to validate Thread/Matter networking and OTBR operation.

```yaml
# Goss tests for pihole-prod Thread/Matter networking and OTBR validation
# Run with: goss validate or moon run pihole-prod:validate

# =============================================================================
# Phase 1: Host Kernel Settings (Thread/Matter Prerequisites)
# =============================================================================
command:
  ipv6_forwarding_enabled:
    title: Validate IPv6 forwarding is enabled (required for OTBR)
    exec: cat /proc/sys/net/ipv6/conf/all/forwarding
    exit-status: 0
    stdout:
      - "1"
    timeout: 5000

  ipv4_forwarding_enabled:
    title: Validate IPv4 forwarding is enabled (required for Docker/NAT64)
    exec: cat /proc/sys/net/ipv4/ip_forward
    exit-status: 0
    stdout:
      - "1"
    timeout: 5000

  ipv6_mc_forwarding_enabled:
    title: Validate IPv6 multicast forwarding is enabled (Thread device discovery)
    exec: cat /proc/sys/net/ipv6/conf/all/mc_forwarding
    exit-status: 0
    stdout:
      - "1"
    timeout: 5000

  ipv6_proxy_ndp_enabled:
    title: Validate IPv6 proxy NDP is enabled (Thread device reachability)
    exec: cat /proc/sys/net/ipv6/conf/all/proxy_ndp
    exit-status: 0
    stdout:
      - "1"
    timeout: 5000

  ipv6_accept_ra_forwarding:
    title: Validate IPv6 accepts RAs even with forwarding enabled
    exec: cat /proc/sys/net/ipv6/conf/all/accept_ra
    exit-status: 0
    stdout:
      - "2"
    timeout: 5000

  ipv6_privacy_extensions_disabled:
    title: Validate IPv6 privacy extensions disabled (stable addressing for OTBR)
    exec: cat /proc/sys/net/ipv6/conf/all/use_tempaddr
    exit-status: 0
    stdout:
      - "0"
    timeout: 5000

  neigh_gc_thresh3_increased:
    title: Validate neighbor table size increased for Thread networks
    exec: cat /proc/sys/net/ipv6/neigh/default/gc_thresh3
    exit-status: 0
    stdout:
      - /[4-9][0-9]{3}/  # At least 4000+
    timeout: 5000

# =============================================================================
# Phase 2: Configuration Files
# =============================================================================
file:
  /etc/sysctl.d/99-thread-matter.conf:
    title: Validate Thread/Matter sysctl configuration file exists
    exists: true
    filetype: file
    contains:
      - net.ipv6.conf.all.forwarding=1
      - net.ipv6.conf.all.mc_forwarding=1
      - net.ipv6.conf.all.proxy_ndp=1

  /etc/docker/daemon.json:
    title: Validate Docker daemon configuration exists
    exists: true
    filetype: file
    contains:
      - '"ipv6"'
      - "true"

  /opt/otbr/data:
    title: Validate OTBR data directory exists
    exists: true
    filetype: directory
    mode: "0755"

  /opt/otbr/docker-compose.yml:
    title: Validate OTBR docker-compose.yml exists (separate from Pi-hole)
    exists: true
    filetype: file
    contains:
      - "otbr-admin"
      - "192.168.1.17"

# =============================================================================
# Phase 3: Docker and Container Status
# =============================================================================
service:
  docker:
    title: Validate Docker service is running
    enabled: true
    running: true

command:
  docker_ipv6_enabled:
    title: Validate Docker has IPv6 enabled
    exec: docker info 2>/dev/null | grep -i "ipv6" | head -1
    exit-status: 0
    stdout:
      - /IPv6/i
    timeout: 10000

  otbr_container_running:
    title: Validate OTBR container is running
    exec: docker ps --filter "name=otbr" --format "{{.Status}}" | head -1
    exit-status: 0
    stdout:
      - /Up/
    timeout: 10000

  otbr_container_ipv4:
    title: Validate OTBR container has correct IPv4 address
    exec: docker inspect otbr --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
    exit-status: 0
    stdout:
      - "192.168.1.17"
    timeout: 10000

  otbr_container_healthy:
    title: Validate OTBR container health status
    exec: docker inspect otbr --format '{{.State.Status}}'
    exit-status: 0
    stdout:
      - running
    timeout: 10000

  otbr_usb_device_accessible:
    title: Validate Thread radio USB device is accessible in container
    exec: docker exec otbr ls -la /dev/ttyUSB0 2>/dev/null || docker exec otbr ls -la /dev/ttyACM0 2>/dev/null || echo "no device"
    exit-status: 0
    stdout:
      - /tty/
    timeout: 10000

# =============================================================================
# Phase 4: OTBR Application Status
# =============================================================================
command:
  otbr_agent_running:
    title: Validate OTBR agent process is running in container
    exec: docker exec otbr pgrep -f otbr-agent || echo "not running"
    exit-status: 0
    stdout:
      - /[0-9]+/
    timeout: 10000

  otbr_thread_state:
    title: Validate Thread network state (leader, router, or child)
    exec: docker exec otbr ot-ctl state 2>/dev/null || echo "unavailable"
    exit-status: 0
    stdout:
      - /(leader|router|child|disabled|detached)/
    timeout: 15000

  otbr_rest_api_responsive:
    title: Validate OTBR REST API responds
    exec: curl -s -o /dev/null -w "%{http_code}" http://192.168.1.17:8081/node --connect-timeout 5 || echo "000"
    exit-status: 0
    stdout:
      - /200|404/  # 200 = OK, 404 = API up but endpoint may vary
    timeout: 10000

# =============================================================================
# Phase 5: Network Connectivity
# =============================================================================
addr:
  tcp://192.168.1.17:8080:
    title: Validate OTBR Web UI port is reachable
    reachable: true
    timeout: 5000

  tcp://192.168.1.17:8081:
    title: Validate OTBR REST API port is reachable
    reachable: true
    timeout: 5000

http:
  http://192.168.1.17:8080:
    title: Validate OTBR Web UI is accessible
    status: 200
    timeout: 10000
    allow-insecure: true

command:
  otbr_ipv6_connectivity:
    title: Validate OTBR container has IPv6 link-local address
    exec: docker exec otbr ip -6 addr show | grep -c "inet6 fe80" || echo "0"
    exit-status: 0
    stdout:
      - /[1-9]/  # At least one link-local address
    timeout: 10000

  mdns_port_listening:
    title: Validate mDNS port 5353 is available for Thread discovery
    exec: ss -ulnp | grep -c ":5353" || echo "0"
    exit-status: 0
    stdout:
      - /[0-9]+/
    timeout: 5000

# =============================================================================
# Phase 6: Pi-hole Containers (Regression Tests)
# =============================================================================
command:
  pihole_admin_running:
    title: Validate pihole-admin container is still running (regression)
    exec: docker ps --filter "name=pihole-admin" --format "{{.Status}}" | head -1
    exit-status: 0
    stdout:
      - /Up/
    timeout: 10000

  pihole_vlan50_running:
    title: Validate pihole-vlan50 container is still running (regression)
    exec: docker ps --filter "name=pihole-vlan50" --format "{{.Status}}" | head -1
    exit-status: 0
    stdout:
      - /Up/
    timeout: 10000

addr:
  tcp://192.168.1.16:443:
    title: Validate pihole-admin HTTPS is reachable (regression)
    reachable: true
    timeout: 5000

  tcp://192.168.50.2:443:
    title: Validate pihole-vlan50 HTTPS is reachable (regression)
    reachable: true
    timeout: 5000
```

## Goss Test Execution

### Local Validation
```bash
# Run all tests
goss -g apps/pihole-prod/goss.yaml validate

# Run with verbose output
goss -g apps/pihole-prod/goss.yaml validate -f documentation

# Run specific test
goss -g apps/pihole-prod/goss.yaml validate --grep "ipv6_forwarding"
```

### Moon Integration
Add to `apps/pihole-prod/moon.yml`:
```yaml
tasks:
  validate:
    command: goss -g goss.yaml validate
    options:
      runInCI: false  # Requires access to pihole-prod host
```

### CI/CD Integration
Tests can be run via Ansible after deployment:
```yaml
- name: Run Goss validation tests
  command: goss -g /path/to/goss.yaml validate
  register: goss_result
  failed_when: goss_result.rc != 0
```

# Appendix

## Reference Documentation

- [OpenThread Border Router Docker](https://openthread.io/guides/border-router/docker)
- [Home Assistant Thread Integration](https://www.home-assistant.io/integrations/thread/)
- [Silicon Labs Thread Radio Setup](https://github.com/home-assistant/addons/tree/master/silabs-multiprotocol)
- [OpenThread Network Configuration](https://openthread.io/guides/border-router/docker/network)
- [Thread IPv6 Addressing](https://openthread.io/guides/thread-primer/ipv6-addressing)
- [Matter Protocol Networking Requirements](https://csa-iot.org/developer-resource/specifications-download-request/)
- [Docker IPv6 Networking](https://docs.docker.com/config/daemon/ipv6/)
- [Goss - Quick and Easy Server Testing](https://github.com/goss-org/goss)

## Current Infrastructure Details

- **pihole-prod IP**: 192.168.1.15
- **pihole-admin IP**: 192.168.1.16
- **OTBR Target IP**: 192.168.1.17
- **ADMIN Network**: 192.168.1.0/24
- **Gateway**: 192.168.1.1

## File Paths

| Component | Path |
|-----------|------|
| Pi-hole Docker Compose | /opt/pihole/docker-compose.yml |
| Pi-hole Data (admin) | /opt/pihole/admin/ |
| Pi-hole Data (vlan50) | /opt/pihole/vlan50/ |
| OTBR Docker Compose | /opt/otbr/docker-compose.yml |
| OTBR Data | /opt/otbr/data/ |
| Thread sysctl config | /etc/sysctl.d/99-thread-matter.conf |
| Udev rules | /etc/udev/rules.d/99-thread-radio.rules |

## Thread Radio Compatibility

Common compatible devices:
- Home Assistant SkyConnect (Silicon Labs EFR32MG21)
- SONOFF ZBDongle-E (Silicon Labs EFR32MG21)
- Nordic nRF52840 Dongle

## Commands Reference

```bash
# Check USB devices
lsusb
ls -la /dev/tty*

# OTBR Docker Compose commands (separate from Pi-hole)
docker compose -f /opt/otbr/docker-compose.yml up -d      # Start OTBR
docker compose -f /opt/otbr/docker-compose.yml down       # Stop OTBR
docker compose -f /opt/otbr/docker-compose.yml logs -f    # View logs
docker compose -f /opt/otbr/docker-compose.yml pull       # Update image

# Test OTBR container
docker logs otbr

# Check Thread network status
curl http://192.168.1.17:8081/node

# Verify macvlan connectivity
docker exec otbr ping -c 3 192.168.1.1

# Pi-hole commands remain unchanged (separate project)
docker compose -f /opt/pihole/docker-compose.yml ps       # Check Pi-hole status
```

## IPv6 Verification Commands

```bash
# Verify IPv6 forwarding is enabled
sysctl net.ipv6.conf.all.forwarding
# Expected: net.ipv6.conf.all.forwarding = 1

# Check all Thread/Matter sysctl settings
sysctl -a | grep -E "(ipv6.conf.all.forwarding|ipv6.conf.all.mc_forwarding|ipv6.conf.all.proxy_ndp)"

# Verify IPv6 addresses on interfaces
ip -6 addr show

# Test IPv6 connectivity
ping6 -c 3 ff02::1%eth0  # Link-local multicast

# Verify Docker IPv6 configuration
docker network inspect admin | grep -A 20 "IPAM"

# Test IPv6 from container
docker exec otbr ping6 -c 3 fd00:1::1

# Check mDNS is working
avahi-browse -at  # List all mDNS services

# Verify neighbor discovery
ip -6 neigh show

# Check Thread border router status
docker exec otbr ot-ctl state
docker exec otbr ot-ctl netdata show

# Verify Thread dataset
docker exec otbr ot-ctl dataset active
```

## Troubleshooting IPv6

```bash
# If IPv6 forwarding not working, check for conflicting settings
cat /proc/sys/net/ipv6/conf/all/forwarding

# Check if Docker is blocking IPv6
sudo iptables -L DOCKER-USER -v -n
sudo ip6tables -L DOCKER-USER -v -n

# Verify no IPv6 disabled in GRUB
grep ipv6 /etc/default/grub

# Check systemd-networkd status (if using netplan)
networkctl status eth0

# Verify Docker daemon IPv6 config
cat /etc/docker/daemon.json
docker info | grep -i ipv6
```
</PRD>
