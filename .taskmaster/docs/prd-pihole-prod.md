<context>
# Overview

This PRD defines the conversion of the existing Pi-hole production deployment on DietPi (Raspberry Pi) into infrastructure as code using Ansible. The goal is to create a reproducible, maintainable deployment that follows the monorepo's established patterns.

**Current State:**
- DietPi (Debian 13 Trixie) on Raspberry Pi at 192.168.1.137 (VLAN 1)
- Pi-hole running in Docker with macvlan networking on VLAN 50 at 192.168.50.2
- Manual deployment documented in `apps/pihole-prod/README.md`
- Manual security hardening tasks listed as TODOs in README

**Target State:**
- Fully automated Ansible playbook for provisioning and maintenance
- Two-stage deployment: `bootstrap` (initial setup) and `apply` (regular deployment)
- 1Password integration for secrets management
- Moon build system integration for consistent monorepo workflows

# Core Features

## 1. Two-Stage Deployment Model

**Bootstrap Stage:**
- Uses default DietPi credentials (root/dietpi) for initial SSH access
- Performs one-time system hardening (password changes, SSH key setup, user creation)
- Configures the `dietpi` user for subsequent non-root access
- After bootstrap, password authentication and root SSH login are disabled

**Apply Stage:**
- Uses SSH key authentication with the `dietpi` user
- Handles all regular deployments and configuration updates
- Idempotent - can be run repeatedly without side effects

## 2. Docker and Pi-hole Deployment

**What it does:** Automates the complete Docker and Pi-hole stack deployment
**Why it's important:** Ensures consistent, reproducible Pi-hole deployments
**How it works:**
- Installs Docker and Docker Compose via official repositories
- Creates VLAN 50 interface (eth0.50) with macvlan networking
- Deploys Pi-hole container with proper network configuration
- Configures custom DNS records for *.enigma.vgijssel.nl domains

## 3. Security Hardening

**What it does:** Implements all security TODOs from the README
**Why it's important:** Secures the Pi-hole server against unauthorized access
**Components:**
- Disable SSH password authentication
- Disable SSH root login
- Configure dietpi user with sudo (password required)
- Set strong passwords from 1Password vault
- Configure SSH key-only authentication

## 4. 1Password Secrets Integration

**What it does:** Retrieves secrets from 1Password vault
**Why it's important:** Keeps secrets out of version control
**Secrets required:**
- `op://setup-pihole-prod/root-pihole/password` - Root user password
- `op://setup-pihole-prod/dietpi-pihole/password` - DietPi user password
- Public SSH key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp`

# User Experience

## User Personas

**Infrastructure Administrator:**
- Runs `moon run pihole-prod:bootstrap` for initial deployment
- Runs `moon run pihole-prod:apply` for updates
- Manages DNS records via Ansible or Pi-hole web UI

## Key User Flows

**Initial Deployment:**
1. Ensure DietPi is freshly installed with default credentials
2. Find the DHCP-assigned IP address (e.g., check router DHCP leases)
3. Run `moon run pihole-prod:bootstrap -- <ip-address>` (e.g., `moon run pihole-prod:bootstrap -- 192.168.1.137`)
4. The playbook will configure a static IP (192.168.1.137) during bootstrap
5. Verify Pi-hole is accessible at http://192.168.50.2/admin

**Regular Updates:**
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
├── pihole.yml                  # Main playbook
├── bootstrap                   # Bootstrap inventory (password auth)
├── production                  # Production inventory (SSH key auth)
├── group_vars/
│   ├── all.yml                 # Common variables (non-secrets)
│   ├── pihole.yml              # Pi-hole specific variables (non-secrets)
│   ├── bootstrap.op.yml        # 1Password secrets for bootstrap (root password)
│   └── production.op.yml       # 1Password secrets for production
└── README.md                   # Documentation (update with Ansible instructions)
```

**New role** (`libs/ansible/roles/pihole/`):
```
libs/ansible/roles/pihole/
├── tasks/
│   ├── main.yml                # Task orchestration
│   ├── system.yml              # DietPi system setup (users, SSH, packages)
│   ├── docker.yml              # Docker installation
│   ├── vlan.yml                # VLAN 50 interface setup
│   ├── container.yml           # Pi-hole container deployment
│   └── dns_records.yml         # Custom DNS configuration
├── templates/
│   ├── docker-compose.yml.j2
│   ├── interfaces.eth0.50.j2
│   └── sshd_config.conf.j2
├── handlers/
│   └── main.yml
└── defaults/
    └── main.yml
```

**Important:** All roles live in `libs/ansible/roles/` and are referenced via `roles_path` in `ansible.cfg`. This enables role reuse across multiple playbooks (e.g., the `pihole` role could be reused for a secondary Pi-hole deployment).

## Roles

**New role to create:**
- `libs/ansible/roles/pihole/` - Self-contained Pi-hole deployment role
  - DietPi system configuration (users, SSH, packages)
  - Docker installation from official repository
  - VLAN interface configuration
  - Pi-hole container deployment and DNS configuration

**Note:** The `common` role is designed for Ubuntu/Debian/Arch and DietPi has a significantly different setup. All functionality will be implemented directly in the `pihole` role first. Common patterns can be extracted to shared roles later if needed.

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

**bootstrap inventory:**

The bootstrap inventory uses a placeholder that is replaced at runtime with the actual IP address passed as an argument:

```ini
[pihole]
# IP address is passed via -e ansible_host=<ip> on command line

[pihole:vars]
ansible_user=root
ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[bootstrap:children]
pihole
```

The `ansible_password` is injected via `group_vars/bootstrap.op.yml`:
```yaml
# group_vars/bootstrap.op.yml
ansible_password: op://setup-pihole-prod/root-pihole/password
```

**production inventory:**

After bootstrap, the static IP (192.168.1.137) is configured and used for all subsequent runs:

```ini
[pihole]
192.168.1.137

[pihole:vars]
ansible_user=dietpi

[production:children]
pihole
```

Secrets for production are in `group_vars/production.op.yml`:
```yaml
# group_vars/production.op.yml
# The dietpi user's password is used for sudo (become) operations
ansible_become_pass: op://setup-pihole-prod/dietpi-pihole/password
# Encrypted passwords for the Ansible user module
dietpi_user_password_encrypted: op://setup-pihole-prod/dietpi-pihole/password_encrypted
root_user_password_encrypted: op://setup-pihole-prod/root-pihole/password_encrypted
# SSH public key for authorized_keys
ssh_public_key: op://setup-pihole-prod/SSH - Setup/public key
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
        description: "IP address of the DietPi host (from DHCP)"
        required: true
  apply:
    command: ansible-playbook -i production pihole.yml --diff
    local: true
```

**Usage:**
- Bootstrap (first run): `moon run pihole-prod:bootstrap -- 192.168.1.100` (use DHCP-assigned IP)
- Apply (subsequent runs): `moon run pihole-prod:apply` (uses static IP 192.168.1.137)

The `dependsOn: [ansible]` ensures that:
1. Moon recognizes the relationship between pihole-prod and the shared ansible library
2. The project structure is properly validated
3. Future tasks that depend on ansible roles/plugins are correctly ordered

## System Components

1. **VLAN 50 Interface (eth0.50):** macvlan parent interface for Pi-hole container
2. **Docker Engine:** Container runtime from official Docker repository
3. **Pi-hole Container:** DNS server with custom configuration
4. **macvlan Network:** Docker network attached to eth0.50

## Data Models

**Host Configuration Variables:**
- `host_static_ip`: 192.168.1.137 (static IP configured during bootstrap)
- `host_gateway`: 192.168.1.1
- `host_interface`: eth0

**Pi-hole Configuration Variables:**
- `pihole_ip`: 192.168.50.2
- `pihole_gateway`: 192.168.50.1
- `pihole_upstream_dns`: 192.168.50.1
- `pihole_web_password`: From 1Password
- `pihole_timezone`: America/New_York

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

- **Target Host:** Raspberry Pi running DietPi (Debian 13 Trixie)
- **Network:** Access to 192.168.1.141, VLAN 50 tagging support on switch
- **1Password CLI:** `op` command available and authenticated (the custom vars plugin uses `op inject`)
- **Ansible Requirements:**
  - `community.general` collection (for sudoers module)
  - `ansible.posix` collection (for authorized_key module)

# Development Roadmap

## Phase 1: Foundation (MVP)

### 1.1 Project Structure Setup
- Create `apps/pihole-prod/moon.yml` with bootstrap and apply tasks
- Create `ansible.cfg` referencing shared roles path
- Create inventory files (bootstrap and production)
- Create group_vars with 1Password references

### 1.2 Pi-hole Role Structure
- Create `libs/ansible/roles/pihole/` directory structure
- Create `libs/ansible/roles/pihole/defaults/main.yml` with default variables
- Create `libs/ansible/roles/pihole/handlers/main.yml` for service restarts
- Create `libs/ansible/roles/pihole/tasks/main.yml` to orchestrate task imports

### 1.3 System Configuration (Bootstrap)
- Create `libs/ansible/roles/pihole/tasks/system.yml`
- Configure static IP address (192.168.1.137) to replace DHCP
- Configure dietpi user with SSH key and sudo access
- Set passwords for root and dietpi users from 1Password
- Disable SSH password authentication and root login
- Create `libs/ansible/roles/pihole/templates/sshd_config.conf.j2`

### 1.4 Bootstrap Capability
- Implement playbook that works with default DietPi credentials
- Test connection and basic provisioning
- Verify transition from password to key-based authentication

## Phase 2: Docker and Pi-hole Deployment

### 2.1 Docker Installation
- Create `libs/ansible/roles/pihole/tasks/docker.yml`
- Install Docker from official repository (matching README instructions)
- Install Docker Compose plugin
- Verify installation

### 2.2 VLAN Interface Configuration
- Create `libs/ansible/roles/pihole/tasks/vlan.yml`
- Create `libs/ansible/roles/pihole/templates/interfaces.eth0.50.j2`
- Load 8021q kernel module persistently
- Create eth0.50 VLAN interface
- Make interface persistent across reboots

### 2.3 Pi-hole Container Deployment
- Create `libs/ansible/roles/pihole/tasks/container.yml`
- Create `libs/ansible/roles/pihole/templates/docker-compose.yml.j2`
- Create required volume directories (`/opt/pihole-vlan50/`)
- Deploy and start Pi-hole container
- Configure container restart policy

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
- Test full bootstrap flow from fresh DietPi
- Test apply flow for idempotent updates
- Verify security hardening is complete

# Logical Dependency Chain

## Foundation First
1. **Project structure and moon.yml** - Required for all subsequent work
2. **Inventory files** - Required before any playbook can run
3. **group_vars with 1Password** - Required for secret injection
4. **Pi-hole role structure** (`libs/ansible/roles/pihole/`) - Role scaffolding

## Bootstrap (System Configuration)
5. **System configuration** (pihole role `system.yml`) - Users, SSH, packages
6. **Bootstrap playbook capability** - Initial access with default credentials
7. **SSH key and user setup** - Enables transition to production workflow

## Infrastructure
8. **Docker installation** (pihole role `docker.yml`) - Required before container deployment
9. **VLAN interface setup** (pihole role `vlan.yml`) - Required for macvlan networking

## Application Deployment
10. **Pi-hole container deployment** (pihole role `container.yml`) - Core application
11. **DNS record configuration** (pihole role `dns_records.yml`) - Custom domain resolution
12. **Validation and testing** - Verify correct operation

## Documentation Last
13. **README updates** - Document the completed solution

# Risks and Mitigations

## Technical Challenges

**Risk:** DietPi has different base packages than Ubuntu/Debian
**Mitigation:** Implement all system configuration directly in the `pihole` role's `system.yml` task file. Do not attempt to reuse the `common` role. Extract common patterns later if needed.

**Risk:** Bootstrap could lock out access if SSH keys not set correctly
**Mitigation:** Test bootstrap in isolated environment first. Ensure SSH key is set before disabling password auth. Add verification step.

**Risk:** VLAN interface may not persist across DietPi upgrades
**Mitigation:** Use DietPi's native network configuration methods where possible. Document manual recovery steps.

**Risk:** Pi-hole v6 configuration format may change
**Mitigation:** Pin Pi-hole Docker image version in docker-compose.yml template.

## MVP Definition

The MVP includes:
1. Working bootstrap flow from fresh DietPi
2. Working apply flow for subsequent runs
3. Docker and Pi-hole deployed with basic configuration
4. Custom DNS records configured
5. Security hardening (SSH keys, no password auth, no root login)

Out of scope for MVP:
- Automated backup/restore
- Monitoring integration
- DietPi welcome menu customization (can be done later)

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
  - `password` - Plain text password for root user (used for bootstrap SSH)
  - `password_encrypted` - SHA-512 hashed password for Ansible user module
- `dietpi-pihole`
  - `password` - Plain text password for dietpi user (used for sudo/become)
  - `password_encrypted` - SHA-512 hashed password for Ansible user module
- `SSH - Setup`
  - `public key` - SSH public key for authorized_keys

**Generating encrypted passwords:**
```bash
# Generate SHA-512 hash for Ansible user module
mkpasswd --method=sha-512 'your-password-here'
```

**Note:** The vault naming follows the pattern `setup-{project-name}` used elsewhere in the monorepo.

## SSH Public Key

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp
```

## Network Topology

```
Regular LAN (192.168.1.0/24)
├─ DietPi Host: 192.168.1.137 (SSH access, static IP after bootstrap)
│   └─ Initial boot: DHCP-assigned IP (varies)
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
1. For each inventory group (e.g., `bootstrap`, `production`), the plugin looks for `group_vars/{group}.op.yml`
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
