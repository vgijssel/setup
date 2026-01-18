<context>
# Overview

This PRD defines the conversion of the existing Pi-hole production deployment on Ubuntu (Raspberry Pi) into infrastructure as code using Ansible. The goal is to create a reproducible, maintainable deployment that follows the monorepo's established patterns.

**Current State:**
- Ubuntu Server on Raspberry Pi at 192.168.1.15 (admin LAN)
- Pi-hole running in Docker with macvlan networking on VLAN 50 at 192.168.50.2
- Manual deployment documented in `apps/pihole-prod/README.md`
- Manual security hardening tasks listed as TODOs in README
- No Pi-hole instance serving the admin LAN directly

**Target State:**
- Fully automated Ansible playbook for provisioning and maintenance
- Two targets: `bootstrap` (first run with DHCP IP) and `apply` (subsequent runs with static IP)
- Two Pi-hole instances: VLAN 50 (192.168.50.2) and Admin LAN (192.168.1.16)
- 1Password integration for secrets management
- Moon build system integration for consistent monorepo workflows

# Core Features

## 1. Two-Stage Deployment Model

**Bootstrap Stage:**
- Used for first-time provisioning when the host has a DHCP-assigned IP
- Takes IP address as argument: `moon run pihole-prod:bootstrap -- <dhcp-ip>`
- Configures static IP (192.168.1.15) via netplan bridge networking
- After bootstrap, host will be accessible at the static IP

**Apply Stage:**
- Uses SSH key authentication with the `maarten` user (SSH key pre-configured)
- Connects to static IP (192.168.1.15)
- Handles all subsequent deployments and configuration updates
- Idempotent - can be run repeatedly without side effects

## 2. Docker and Pi-hole Deployment

**What it does:** Automates the complete Docker and Pi-hole stack deployment with two Pi-hole instances
**Why it's important:** Ensures consistent, reproducible Pi-hole deployments serving both VLANs
**How it works:**
- Installs Docker and Docker Compose via official repositories
- Creates VLAN 50 interface (eth0.50) with macvlan networking
- Deploys two Pi-hole containers:
  1. **VLAN 50 Pi-hole** (192.168.50.2): Serves Kubernetes VLAN via macvlan on eth0.50
  2. **Admin LAN Pi-hole** (192.168.1.16): Serves admin network via macvlan on br0
- Configures custom DNS records for *.enigma.vgijssel.nl domains

## 3. Security Hardening

**What it does:** Implements all security TODOs from the README
**Why it's important:** Secures the Pi-hole server against unauthorized access
**Components:**
- Disable SSH password authentication
- Disable SSH root login
- Configure maarten user with sudo (password required)
- Set strong passwords from 1Password vault
- Maintain SSH key-only authentication (already configured)

## 4. 1Password Secrets Integration

**What it does:** Retrieves secrets from 1Password vault
**Why it's important:** Keeps secrets out of version control
**Secrets required:**
- `op://setup-pihole-prod/root-pihole/password` - Root user password
- `op://setup-pihole-prod/maarten-pihole/password` - Maarten user password (for sudo)
- SSH private key: `/secrets/pihole-prod/ssh_private_key` (used by Ansible to connect)
- Public SSH key (pre-configured on host): `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKbI3UZOhsVGi1lbnH7Sd0KWtP5m6zUJgrxbHMTxhRcW`

# User Experience

## User Personas

**Infrastructure Administrator:**
- Runs `moon run pihole-prod:bootstrap -- <ip>` for first-time provisioning
- Runs `moon run pihole-prod:apply` for updates
- Manages DNS records via Ansible or Pi-hole web UI

## Key User Flows

**Initial Deployment (Bootstrap):**
1. Install Ubuntu Server with `maarten` user and SSH key configured
2. Find the DHCP-assigned IP address (e.g., check router DHCP leases)
3. Run `moon run pihole-prod:bootstrap -- <dhcp-ip>` (e.g., `moon run pihole-prod:bootstrap -- 192.168.1.100`)
4. The playbook configures static IP (192.168.1.15) - host will reboot/reconnect at new IP
5. Verify Pi-hole is accessible at http://192.168.50.2/admin

**Subsequent Updates:**
1. Modify Ansible playbook/roles as needed
2. Run `moon run pihole-prod:apply`
3. Changes are applied idempotently
</context>
<PRD>
# Technical Architecture

## Directory Structure

**Application directory** (`apps/pihole-prod/`):
```
apps/pihole-prod/
├── moon.yml                    # Moon task definitions
├── ansible.cfg                 # Ansible configuration (roles_path + vars_plugins)
├── pihole.yml                  # Main playbook (uses common + pihole roles)
├── bootstrap                   # Bootstrap inventory (for first run with DHCP IP)
├── inventory                   # Production inventory (static IP 192.168.1.15)
├── group_vars/
│   ├── all.yml                 # Common variables (non-secrets)
│   ├── pihole.yml              # Common role config + Pi-hole variables (non-secrets)
│   └── pihole.op.yml           # 1Password secrets
└── README.md                   # Documentation (update with Ansible instructions)
```

**New role** (`libs/ansible/roles/pihole/`):
```
libs/ansible/roles/pihole/
├── tasks/
│   ├── main.yml                # Task orchestration
│   ├── docker.yml              # Docker installation
│   ├── vlan.yml                # VLAN 50 interface setup
│   ├── macvlan_networks.yml    # Docker macvlan network creation
│   ├── containers.yml          # Pi-hole containers deployment (both instances)
│   └── dns_records.yml         # Custom DNS configuration
├── templates/
│   ├── docker-compose.yml.j2   # Compose file with both Pi-hole containers
│   ├── netplan-vlan.yaml.j2    # VLAN 50 interface config
│   └── pihole.toml.j2          # Pi-hole v6 configuration
├── handlers/
│   └── main.yml
└── defaults/
    └── main.yml
```

**Important:** All roles live in `libs/ansible/roles/` and are referenced via `roles_path` in `ansible.cfg`. This enables role reuse across multiple playbooks (e.g., the `pihole` role could be reused for a secondary Pi-hole deployment).

## Roles

**Existing `common` role** (`libs/ansible/roles/common/`):
The common role handles all base system configuration and will be used with the following features:

| Feature | Task File | What it does |
|---------|-----------|--------------|
| Package management | `package_management_ubuntu.yml` | apt update/upgrade, unattended-upgrades |
| Localisation | `localisation.yml` | Sets locale (en_GB.UTF-8) and timezone (Europe/Amsterdam) |
| Hostname | `hostname.yml` | Sets system hostname via `common_hostname` variable |
| SSH hardening | `ssh.yml` | Disables password auth and root login |
| Users | `users.yml` | Creates `maarten` user with SSH key, sets root password, removes `ubuntu` user |
| Networking | `networking.yml` | Bridge networking with static IP via netplan |

**Common role variables for pihole-prod:**
```yaml
# Hostname
common_hostname: peace-at-last

# Networking (bridge with static IP)
network_interface: eth0
ip_address: 192.168.1.15
gateway: 192.168.1.1
nameservers:
  - 192.168.1.1

# Required secrets (from 1Password)
root_user_password_encrypted: "{{ from 1Password }}"
maarten_user_password_encrypted: "{{ from 1Password }}"
maarten_user_public_key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKbI3UZOhsVGi1lbnH7Sd0KWtP5m6zUJgrxbHMTxhRcW"
```

**New `pihole` role** (`libs/ansible/roles/pihole/`):
Pi-hole specific deployment role that handles:
- Docker installation
- VLAN interface configuration (eth0.50 via netplan)
- Docker macvlan networks (for both VLAN 50 and admin LAN)
- Two Pi-hole container deployments:
  - VLAN 50 Pi-hole (192.168.50.2) on `pihole-vlan50-net`
  - Admin LAN Pi-hole (192.168.1.16) on `pihole-admin-net`
- Custom DNS records configuration

## Main Playbook

The `pihole.yml` playbook uses both the `common` and `pihole` roles. Variables from `group_vars/` are automatically loaded by Ansible and propagated to the roles:

```yaml
# pihole.yml
---
- name: Configure Pi-hole server
  hosts: pihole
  become: true

  roles:
    - role: common
    - role: pihole
```

**Variable propagation:** Ansible automatically loads variables from `group_vars/pihole.yml` and `group_vars/pihole.op.yml` (via the 1Password vars plugin) for hosts in the `[pihole]` inventory group. These variables are then available to all roles in the play. The common role receives:
- `common_hostname` - for hostname configuration
- `network_interface`, `ip_address`, `gateway`, `nameservers` - for bridge networking
- `root_user_password_encrypted` - for root password
- `maarten_user_password_encrypted` - for maarten password
- `maarten_user_public_key` - for SSH authorized_keys

## Ansible Configuration

The `ansible.cfg` must include both the shared roles path and the custom 1Password vars plugin:

```ini
[defaults]
pipelining = true
roles_path = ../../libs/ansible/roles
vars_plugins = ../../libs/ansible/vars_plugins
```

The custom vars plugin (`libs/ansible/vars_plugins/op.py`) automatically:
1. Looks for `*.op.yml` files in `group_vars/` matching the inventory group name
2. Uses `op inject` to replace `op://vault/item/field` references with actual values
3. Caches results for efficiency across the playbook run

## Inventory Files

**bootstrap inventory** (`bootstrap`):

Used for first-time provisioning when the host has a DHCP-assigned IP. The IP is passed via command line:

```ini
[pihole]
peace-at-last

[pihole:vars]
ansible_user=maarten
ansible_ssh_private_key_file=/secrets/pihole-prod/ssh_private_key
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```

**production inventory** (`inventory`):

Used for subsequent runs after static IP is configured:

```ini
[pihole]
peace-at-last ansible_host=192.168.1.15

[pihole:vars]
ansible_user=maarten
ansible_ssh_private_key_file=/secrets/pihole-prod/ssh_private_key
```

Non-secret variables are in `group_vars/pihole.yml`:
```yaml
# group_vars/pihole.yml
# Common role configuration
common_hostname: peace-at-last

# Networking (bridge with static IP)
network_interface: eth0
ip_address: 192.168.1.15
gateway: 192.168.1.1
nameservers:
  - 192.168.1.1

# SSH public key for maarten user (already configured on the host)
maarten_user_public_key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKbI3UZOhsVGi1lbnH7Sd0KWtP5m6zUJgrxbHMTxhRcW"
```

Secrets are in `group_vars/pihole.op.yml`:
```yaml
# group_vars/pihole.op.yml
# The maarten user's password is used for sudo (become) operations
ansible_become_pass: op://setup-pihole-prod/maarten-pihole/password
# Encrypted passwords for the Ansible user module (used by common role)
maarten_user_password_encrypted: op://setup-pihole-prod/maarten-pihole/password_encrypted
root_user_password_encrypted: op://setup-pihole-prod/root-pihole/password_encrypted
```

This follows the same pattern as `apps/provisioner/group_vars/production.op.yml` where the non-root user's password is used for `ansible_become_pass`.

## Moon Tasks

```yaml
id: pihole-prod
language: javascript
layer: application
dependsOn:
  - ansible
tags:
  - scope.app
  - type.infrastructure
  - ansible
  - pihole
tasks:
  bootstrap:
    command: ansible-playbook -i bootstrap pihole.yml --diff -e "ansible_host=$@"
    local: true
    args:
      - name: ip
        description: "DHCP-assigned IP address of the host"
        required: true
  apply:
    command: ansible-playbook -i inventory pihole.yml --diff
    local: true
```

**Usage:**
- `moon run pihole-prod:bootstrap -- <dhcp-ip>` - First-time provisioning (e.g., `moon run pihole-prod:bootstrap -- 192.168.1.100`)
- `moon run pihole-prod:apply` - Subsequent deployments and updates (uses static IP 192.168.1.15)

The `dependsOn: [ansible]` ensures that:
1. Moon recognizes the relationship between pihole-prod and the shared ansible library
2. The project structure is properly validated
3. Future tasks that depend on ansible roles/plugins are correctly ordered

## System Components

1. **Bridge Interface (br0):** Host networking with static IP, also macvlan parent for admin LAN Pi-hole
2. **VLAN 50 Interface (eth0.50):** macvlan parent interface for VLAN 50 Pi-hole container
3. **Docker Engine:** Container runtime from official Docker repository
4. **Pi-hole Containers:**
   - VLAN 50 Pi-hole (192.168.50.2): DNS server for Kubernetes VLAN
   - Admin LAN Pi-hole (192.168.1.16): DNS server for admin network
5. **macvlan Networks:**
   - `pihole-vlan50-net`: Attached to eth0.50 for VLAN 50
   - `pihole-admin-net`: Attached to br0 for admin LAN

## Data Models

**Host Configuration Variables:**
- `common_hostname`: peace-at-last
- `ip_address`: 192.168.1.15 (static IP configured via netplan)
- `gateway`: 192.168.1.1
- `network_interface`: eth0
- `nameservers`: [192.168.1.1]

**Pi-hole VLAN 50 Configuration:**
- `pihole_vlan50_ip`: 192.168.50.2
- `pihole_vlan50_gateway`: 192.168.50.1
- `pihole_vlan50_parent_interface`: eth0.50
- `pihole_vlan50_subnet`: 192.168.50.0/24

**Pi-hole Admin LAN Configuration:**
- `pihole_admin_ip`: 192.168.1.16
- `pihole_admin_gateway`: 192.168.1.1
- `pihole_admin_parent_interface`: br0
- `pihole_admin_subnet`: 192.168.1.0/24

**Shared Pi-hole Configuration:**
- `pihole_upstream_dns`: 192.168.1.1
- `pihole_web_password`: From 1Password
- `pihole_timezone`: Europe/Amsterdam

**DNS Records:**
```yaml
pihole_dns_records:
  - { ip: "192.168.50.100", domain: "dashboard.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "keycloak.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "api.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "pikvm.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "bucket-terraform.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "coder.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "s3.enigma.vgijssel.nl" }
  - { ip: "192.168.50.100", domain: "kubernetes-coder-cluster-prod.enigma.vgijssel.nl" }
```

## Infrastructure Requirements

- **Target Host:** Raspberry Pi running Ubuntu Server 25.10 (64-bit)
- **Network:** Access to 192.168.1.15 (after bootstrap), VLAN 50 tagging support on switch
- **1Password CLI:** `op` command available and authenticated (the custom vars plugin uses `op inject`)
- **Ansible Requirements:**
  - `community.general` collection (for sudoers module)
  - `ansible.posix` collection (for authorized_key module)

# Development Roadmap

## Phase 1: Foundation (MVP)

### 1.1 Project Structure Setup
- Create `apps/pihole-prod/moon.yml` with bootstrap and apply tasks
- Create `ansible.cfg` referencing shared roles path
- Create bootstrap inventory (for DHCP IP) and production inventory (for static IP 192.168.1.15)
- Create group_vars with 1Password references

### 1.2 Pi-hole Role Structure
- Create `libs/ansible/roles/pihole/` directory structure
- Create `libs/ansible/roles/pihole/defaults/main.yml` with default variables
- Create `libs/ansible/roles/pihole/handlers/main.yml` for service restarts
- Create `libs/ansible/roles/pihole/tasks/main.yml` to orchestrate task imports

### 1.3 Configure Common Role Variables
- Set `common_hostname: peace-at-last` in group_vars
- Set networking variables: `network_interface: eth0`, `ip_address: 192.168.1.15`, `gateway: 192.168.1.1`, `nameservers: [192.168.1.1]`
- Configure 1Password references for `maarten_user_password_encrypted` and `root_user_password_encrypted`
- Set `maarten_user_public_key` with the SSH public key

The `common` role handles:
- Package updates and unattended-upgrades
- Hostname configuration
- Locale and timezone settings
- SSH hardening (disables password auth and root login)
- User management (maarten user with SSH key, root password)
- Bridge networking with static IP via netplan

## Phase 2: Docker and Pi-hole Deployment

### 2.1 Docker Installation
- Create `libs/ansible/roles/pihole/tasks/docker.yml`
- Install Docker from official repository (matching README instructions)
- Install Docker Compose plugin
- Verify installation

### 2.2 VLAN Interface Configuration
- Create `libs/ansible/roles/pihole/tasks/vlan.yml`
- Create `libs/ansible/roles/pihole/templates/netplan-vlan.yaml.j2` (Ubuntu uses netplan for network configuration)
- Load 8021q kernel module persistently
- Create eth0.50 VLAN interface via netplan
- Make interface persistent across reboots

### 2.3 Docker macvlan Networks
- Create `libs/ansible/roles/pihole/tasks/macvlan_networks.yml`
- Create `pihole-vlan50-net` macvlan network on eth0.50 (subnet 192.168.50.0/24)
- Create `pihole-admin-net` macvlan network on br0 (subnet 192.168.1.0/24)

### 2.4 Pi-hole Containers Deployment
- Create `libs/ansible/roles/pihole/tasks/containers.yml`
- Create `libs/ansible/roles/pihole/templates/docker-compose.yml.j2` with both containers
- Create required volume directories:
  - `/opt/pihole-vlan50/` for VLAN 50 Pi-hole
  - `/opt/pihole-admin/` for Admin LAN Pi-hole
- Deploy and start both Pi-hole containers
- Configure container restart policies

## Phase 3: DNS Configuration

### 3.1 Custom DNS Records
- Create `libs/ansible/roles/pihole/tasks/dns_records.yml`
- Create `libs/ansible/roles/pihole/templates/pihole.toml.j2` with custom DNS hosts array
- Handle Pi-hole v6 configuration format
- Restart container when DNS records change

### 3.2 Validation
- Add health checks for Pi-hole DNS resolution
- Verify custom domains resolve correctly
- Add Goss tests for infrastructure validation (optional)

## Phase 4: Documentation and Polish

### 4.1 Update README
- Document Ansible-based deployment process
- Remove manual deployment steps (keep as reference/fallback)
- Add troubleshooting section for Ansible deployments

### 4.2 Testing and Validation
- Test bootstrap flow with DHCP IP
- Test apply flow for idempotent updates
- Verify security hardening is complete

# Logical Dependency Chain

## Foundation First
1. **Project structure and moon.yml** - Required for all subsequent work
2. **Inventory file** - Required before any playbook can run
3. **group_vars with common role config and 1Password secrets** - Required for role configuration
4. **Pi-hole role structure** (`libs/ansible/roles/pihole/`) - Role scaffolding

## System Configuration (via `common` role)
5. **Common role execution** - Package updates, hostname, locale, SSH hardening, user management, bridge networking

## Infrastructure (via `pihole` role)
6. **Docker installation** (pihole role `docker.yml`) - Required before container deployment
7. **VLAN interface setup** (pihole role `vlan.yml`) - Required for VLAN 50 macvlan networking
8. **macvlan networks** (pihole role `macvlan_networks.yml`) - Docker networks for both Pi-hole instances

## Application Deployment
9. **Pi-hole containers deployment** (pihole role `containers.yml`) - Both Pi-hole instances
10. **DNS record configuration** (pihole role `dns_records.yml`) - Custom domain resolution
11. **Validation and testing** - Verify correct operation

## Documentation Last
12. **README updates** - Document the completed solution

# Risks and Mitigations

## Technical Challenges

**Risk:** VLAN interface may not persist across Ubuntu upgrades
**Mitigation:** Use Ubuntu's native netplan configuration for VLAN interfaces. Document manual recovery steps.

**Risk:** Pi-hole v6 configuration format may change
**Mitigation:** Pin Pi-hole Docker image version in docker-compose.yml template.

## MVP Definition

The MVP includes:
1. Working bootstrap flow for first-time provisioning (DHCP to static IP)
2. Working apply flow for subsequent deployments and updates
3. Docker and both Pi-hole instances deployed:
   - VLAN 50 Pi-hole at 192.168.50.2
   - Admin LAN Pi-hole at 192.168.1.16
4. Custom DNS records configured on both instances
5. Security hardening (no password auth, no root login)

Out of scope for MVP:
- Automated backup/restore
- Monitoring integration

## Resource Constraints

**Limited physical access:** Raspberry Pi requires network access for testing
**Mitigation:** Ensure tested playbooks before running on production hardware. Consider having KVM/IPMI access available.

# Appendix

## Existing README Reference

The current `apps/pihole-prod/README.md` contains:
- Complete Docker Compose configuration
- VLAN interface setup commands
- Pi-hole v6 DNS configuration format
- Security hardening TODO list (to be automated)
- Network requirements (Omada, Talos configuration)
- Troubleshooting guides

## 1Password Vault Structure

Vault: `setup-pihole-prod`

**Required items:**
- `root-pihole`
  - `password` - Plain text password for root user
  - `password_encrypted` - SHA-512 hashed password for Ansible user module
- `maarten-pihole`
  - `password` - Plain text password for maarten user (used for sudo/become)
  - `password_encrypted` - SHA-512 hashed password for Ansible user module

**Generating encrypted passwords:**
```bash
# Generate SHA-512 hash for Ansible user module
mkpasswd --method=sha-512 'your-password-here'
```

**Note:** The vault naming follows the pattern `setup-{project-name}` used elsewhere in the monorepo.

## SSH Keys

The `maarten` user on the Ubuntu Pi4 is pre-configured with the SSH public key:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKbI3UZOhsVGi1lbnH7Sd0KWtP5m6zUJgrxbHMTxhRcW
```

The corresponding private key used by Ansible is located at:
```
/secrets/pihole-prod/ssh_private_key
```

This key is configured in the inventory files via `ansible_ssh_private_key_file`.

## Network Topology

```
Admin LAN (192.168.1.0/24)
├─ peace-at-last: 192.168.1.15 (SSH access via maarten user, static IP after bootstrap)
├─ Admin LAN Pi-hole: 192.168.1.16 (DNS server for admin network, macvlan on br0)
├─ Gateway/Nameserver: 192.168.1.1
│
└─ VLAN Trunk (eth0.50)
    │
    └─ Kubernetes VLAN 50 (192.168.50.0/24)
        ├─ Pi-hole Container: 192.168.50.2 (DNS server)
        ├─ MetalLB Ingress: 192.168.50.100 (*.enigma.vgijssel.nl)
        └─ Gateway: 192.168.50.1
```

## Ansible Collection Requirements

```yaml
# requirements.yml
collections:
  - name: community.general   # For sudoers module
  - name: ansible.posix       # For authorized_key module
```

## Custom 1Password Vars Plugin

The monorepo includes a custom Ansible vars plugin at `libs/ansible/vars_plugins/op.py` that provides lazy 1Password secret injection:

**How it works:**
1. For each inventory group (e.g., `pihole`), the plugin looks for `group_vars/{group}.op.yml`
2. Uses `op inject --in-file={path}` to replace `op://` references with actual values
3. Caches results to avoid repeated 1Password API calls

**Benefits over lookup plugins:**
- Secrets are only fetched once per playbook run (cached)
- Cleaner syntax: just `op://vault/item/field` in YAML
- No need to import or configure lookup plugins
- Lazy evaluation - only fetches secrets when group is actually used

**Requirements:**
- 1Password CLI (`op`) must be installed and in PATH
- Must be authenticated (`op signin` or service account)
</PRD>
