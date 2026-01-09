# Pi-hole Production Deployment

This directory documents the Pi-hole deployment for VLAN 50 (Kubernetes network).

## Overview

- **Host**: DietPi (Debian 13 Trixie) on Raspberry Pi
- **Host IP (VLAN 1)**: 192.168.1.141
- **Pi-hole IP (VLAN 50)**: 192.168.50.2
- **Gateway**: 192.168.50.1
- **Deployment**: Docker Compose with macvlan networking

## Architecture

```
Regular LAN (192.168.1.0/24)
├─ DietPi Host: 192.168.1.141
└─ Manages Pi-hole container

        │ VLAN Tagging (eth0.50)
        ▼

Kubernetes VLAN 50 (192.168.50.0/24)
├─ Pi-hole Container: 192.168.50.2
├─ Custom DNS: *.enigma.vgijssel.nl → 192.168.50.100
└─ Upstream DNS: 192.168.50.1
```

## Deployment Steps

### 1. Initial Setup

SSH into the DietPi host:
```bash
ssh root@192.168.1.141
# Password: <configured password>
```

### 2. Docker Installation

Docker and Docker Compose were installed manually:
```bash
# Add Docker repository
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Install Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 3. VLAN Interface Configuration

Created VLAN 50 interface for macvlan networking:
```bash
# Load VLAN kernel module
modprobe 8021q
echo "8021q" >> /etc/modules

# Create VLAN interface
ip link add link eth0 name eth0.50 type vlan id 50
ip link set eth0.50 up

# Make persistent
cat > /etc/network/interfaces.d/eth0.50 <<EOF
auto eth0.50
iface eth0.50 inet manual
    vlan-raw-device eth0
EOF
```

### 4. Docker Compose Configuration

Created `/opt/pihole-vlan50/docker-compose.yml`:
```yaml
version: '3.8'

services:
  pihole:
    container_name: pihole-vlan50
    image: pihole/pihole:latest
    hostname: pihole-vlan50
    networks:
      vlan50:
        ipv4_address: 192.168.50.2
    environment:
      TZ: 'America/New_York'
      WEBPASSWORD: '<password hidden>'
      PIHOLE_DNS_: '192.168.50.1'
      DNSMASQ_LISTENING: 'all'
      VIRTUAL_HOST: 'pihole-vlan50.local'
      FTLCONF_LOCAL_IPV4: '192.168.50.2'
    volumes:
      - './etc-pihole:/etc/pihole'
      - './etc-dnsmasq.d:/etc/dnsmasq.d'
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
    dns:
      - 127.0.0.1
      - 192.168.50.1

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
```

### 5. Custom DNS Configuration

Specific DNS records for `*.enigma.vgijssel.nl` domains pointing to MetalLB ingress (192.168.50.100):

**File**: `/opt/pihole-vlan50/etc-pihole/pihole.toml`

DNS records are stored in the `[dns]` section under the `hosts` array:

```toml
[dns]
  # ... other dns settings ...

  hosts = [
    "192.168.50.100 dashboard.enigma.vgijssel.nl",
    "192.168.50.100 keycloak.enigma.vgijssel.nl",
    "192.168.50.100 api.enigma.vgijssel.nl",
    "192.168.50.100 pikvm.enigma.vgijssel.nl",
    "192.168.50.100 bucket-terraform.enigma.vgijssel.nl",
    "192.168.50.100 coder.enigma.vgijssel.nl",
    "192.168.50.100 s3.enigma.vgijssel.nl",
    "192.168.50.100 kubernetes-coder-cluster-prod.enigma.vgijssel.nl"
  ] ### CHANGED, default = []
```

**Important Notes for Pi-hole v6:**
- Pi-hole v6 stores all configuration in `/etc/pihole/pihole.toml` (TOML format)
- Local DNS records are managed in the `[dns]` section's `hosts` array
- The Web UI at http://192.168.50.2/admin → Local DNS → DNS Records provides a GUI to manage these entries
- Changes made via the Web UI are automatically written to `pihole.toml`
- After editing `pihole.toml` manually, restart the container for changes to take effect
- **Do NOT use dnsmasq configuration files** in `/etc/dnsmasq.d/` for local DNS - they may conflict with Pi-hole v6's FTL configuration

### 6. SSH Key Configuration

Installed SSH public key for passwordless authentication:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Management

### Start/Stop Container

```bash
cd /opt/pihole-vlan50

# Start Pi-hole
docker compose up -d

# Stop Pi-hole
docker compose down

# Restart Pi-hole
docker compose restart

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### Update Pi-hole

```bash
cd /opt/pihole-vlan50

# Pull latest image
docker compose pull

# Restart with new image
docker compose up -d
```

### Add Custom DNS Records

**Option 1: Via Web UI (Recommended)**
1. Navigate to http://192.168.50.2/admin
2. Go to **Local DNS** → **DNS Records**
3. Add new entries:
   - Domain: `newservice.enigma.vgijssel.nl`
   - IP Address: `192.168.50.100`
4. Click "Add"
5. Changes are applied immediately

**Option 2: Edit pihole.toml Manually**
```bash
# Edit pihole.toml on the persistent volume
nano /opt/pihole-vlan50/etc-pihole/pihole.toml

# Find the [dns] section and update the hosts array:
# hosts = [
#   "192.168.50.100 dashboard.enigma.vgijssel.nl",
#   "192.168.50.100 newservice.enigma.vgijssel.nl"  # Add new entry
# ]

# Copy the updated file back to the container
cd /opt/pihole-vlan50
docker cp etc-pihole/pihole.toml pihole-vlan50:/etc/pihole/pihole.toml

# Restart container to apply changes
docker compose restart
```

**Important Notes for Pi-hole v6:**
- All local DNS records are stored in `/etc/pihole/pihole.toml` in the `hosts` array
- The Web UI automatically updates `pihole.toml` when you add/remove records
- Manual edits to `pihole.toml` require a container restart
- **Do NOT** create files in `/etc/dnsmasq.d/` for local DNS - use `pihole.toml` instead

**Testing DNS resolution from VLAN 50:**
```bash
# From a device on VLAN 50 (e.g., Kubernetes node)
nslookup dashboard.enigma.vgijssel.nl 192.168.50.2
# Should return: 192.168.50.100
```

## Access

- **Web Interface**: http://192.168.50.2/admin
- **Web Password**: Configured in docker-compose.yml (WEBPASSWORD env var)
- **DNS Server**: 192.168.50.2:53

## Network Requirements

### Omada Configuration

1. **VLAN 50 DHCP Settings**:
   - DNS Server: `192.168.50.2`
   - Gateway: `192.168.50.1`

2. **Switch Port Configuration** (port connecting to 192.168.1.141):
   - Native VLAN: 1
   - Tagged VLANs: 50

3. **Firewall Rules**:
   - Allow VLAN 50 → Pi-hole (192.168.50.2) on port 53 (DNS)
   - Allow VLAN 50 → Pi-hole (192.168.50.2) on port 80 (Web UI - optional)

### Talos/Kubernetes Configuration

Update Talos machine configs to use Pi-hole for DNS:

```yaml
machine:
  network:
    nameservers:
      - 192.168.50.2
```

Apply with:
```bash
talosctl patch machineconfig --patch @dns-patch.yaml
```

## DNS Resolution Behavior

### From VLAN 50 (Kubernetes Nodes)

The following domains resolve to the MetalLB ingress controller at 192.168.50.100:

```
dashboard.enigma.vgijssel.nl → 192.168.50.100
keycloak.enigma.vgijssel.nl → 192.168.50.100
api.enigma.vgijssel.nl → 192.168.50.100
pikvm.enigma.vgijssel.nl → 192.168.50.100
bucket-terraform.enigma.vgijssel.nl → 192.168.50.100
coder.enigma.vgijssel.nl → 192.168.50.100
s3.enigma.vgijssel.nl → 192.168.50.100
kubernetes-coder-cluster-prod.enigma.vgijssel.nl → 192.168.50.100
```

This provides direct internal access to Kubernetes services without going through Tailscale VPN.

### From Regular LAN (192.168.1.0/24)

The same domains resolve to their respective Tailscale IPs via public DNS. Accessing these services requires an active Tailscale VPN connection, maintaining network security.

## Troubleshooting

### Container won't start

```bash
# Check logs
cd /opt/pihole-vlan50
docker compose logs

# Verify VLAN interface exists
ip link show eth0.50

# Recreate VLAN if needed
ip link delete eth0.50
ip link add link eth0 name eth0.50 type vlan id 50
ip link set eth0.50 up
```

### DNS not resolving

**Important:** DNS records configured in `pihole.toml` will resolve correctly for external queries from VLAN 50 devices. Testing from inside the container may show different results due to container DNS settings.

```bash
# Test DNS from a VLAN 50 device (e.g., Kubernetes node at 192.168.50.10)
nslookup dashboard.enigma.vgijssel.nl 192.168.50.2
# Should return: 192.168.50.100

# Verify local DNS records in pihole.toml
docker exec pihole-vlan50 grep -A10 "hosts = \[" /etc/pihole/pihole.toml
# Should show all your custom DNS entries

# Check if configuration was loaded by FTL
docker exec pihole-vlan50 cat /etc/pihole/hosts/custom.list
# FTL automatically generates this from pihole.toml

# Reload DNS (only needed if you manually edited pihole.toml)
docker exec pihole-vlan50 pihole reloaddns

# Check Pi-hole status
docker exec pihole-vlan50 pihole status

# Check recent DNS queries in logs
docker compose logs --tail=50 | grep enigma

# If DNS still not working, restart the container
cd /opt/pihole-vlan50
docker compose restart
```

### Network connectivity issues

```bash
# Verify container IP
docker exec pihole-vlan50 ip addr show eth0

# Should show: 192.168.50.2/24

# Ping gateway from container
docker exec pihole-vlan50 ping -c 3 192.168.50.1

# Ping from VLAN 50 to Pi-hole (from a Kubernetes node)
ping 192.168.50.2
```

## Backup and Restore

### Backup

```bash
# Backup Pi-hole configuration
tar -czf pihole-backup-$(date +%Y%m%d).tar.gz /opt/pihole-vlan50/

# Or use Pi-hole's built-in teleporter (via web UI):
# Settings → Teleporter → Backup
```

### Restore

```bash
# Restore from tarball
tar -xzf pihole-backup-YYYYMMDD.tar.gz -C /

# Restart container
cd /opt/pihole-vlan50
docker compose restart

# Or use Pi-hole's teleporter (via web UI):
# Settings → Teleporter → Restore
```

## Security Notes

1. **Password Security**: The Pi-hole web password is stored in the docker-compose.yml file. Ensure this file has restricted permissions:
   ```bash
   chmod 600 /opt/pihole-vlan50/docker-compose.yml
   ```

2. **Network Isolation**: VLAN 50 is isolated from the regular LAN by design. Only DNS traffic is allowed between networks.

3. **SSH Access**: Use SSH key authentication instead of passwords. The root password has been changed to a secure random string.

## Configuration Files Summary

### Active Configuration Files

**Primary Configuration:**
- `/opt/pihole-vlan50/etc-pihole/pihole.toml` - **Main Pi-hole v6 configuration file**
  - All settings including local DNS records (`hosts` array in `[dns]` section)
  - Managed by Web UI and FTL
  - Persists across container restarts

**Docker Configuration:**
- `/opt/pihole-vlan50/docker-compose.yml` - Container orchestration

**Network Configuration:**
- `/etc/network/interfaces.d/eth0.50` - VLAN 50 interface (on DietPi host)

### Deprecated/Removed Configuration Methods

The following are **NOT USED** in Pi-hole v6 and have been removed:
- ~~`/opt/pihole-vlan50/etc-dnsmasq.d/*.conf`~~ - Old dnsmasq configs (use `pihole.toml` instead)
- ~~`/opt/pihole-vlan50/etc-pihole/custom.list`~~ - Legacy custom hosts file
- ~~`/opt/pihole-vlan50/etc-pihole/hosts/custom.list`~~ - Auto-generated by FTL (read-only)

**Important:** Pi-hole v6 FTL automatically generates `/etc/pihole/hosts/custom.list` from the `pihole.toml` configuration. This file should never be edited manually.

## Version Information

- **Docker**: 29.1.4
- **Docker Compose**: v5.0.1
- **Pi-hole Core**: v6.3
- **Pi-hole Web**: v6.4
- **Pi-hole FTL**: v6.4.1
- **Pi-hole Image**: pihole/pihole:latest
- **OS**: DietPi (Debian 13 Trixie)
- **Platform**: Raspberry Pi (ARM64)

## TODO - Security Hardening & Improvements

The following tasks should be completed to improve security and operational practices:

### Security Hardening

- [ ] **Disable password login via SSH**
  ```bash
  # Edit SSH configuration
  sudo nano /etc/ssh/sshd_config

  # Set the following:
  PasswordAuthentication no
  ChallengeResponseAuthentication no
  UsePAM no

  # Restart SSH
  sudo systemctl restart ssh
  ```

- [ ] **Disable root login via SSH**
  ```bash
  # Edit SSH configuration
  sudo nano /etc/ssh/sshd_config

  # Set:
  PermitRootLogin no

  # Restart SSH
  sudo systemctl restart ssh
  ```

- [ ] **Disable DietPi welcome menu on SSH login**
  ```bash
  # Run DietPi configuration
  sudo dietpi-autostart

  # Select option 0 (Console) to disable the welcome menu
  # Or edit the configuration file:
  sudo nano /boot/dietpi/.dietpi-autostart_index
  # Set to 0
  ```

### Operational Improvements

- [ ] **Add sudo password to dietpi user**
  ```bash
  # Set password for dietpi user
  sudo passwd dietpi
  # Enter a secure password

  # Verify sudo access
  su - dietpi
  sudo whoami  # Should prompt for password and return 'root'
  ```

- [ ] **Run Docker Compose as dietpi user (not root)**
  ```bash
  # Add dietpi user to docker group
  sudo usermod -aG docker dietpi

  # Change ownership of Pi-hole directory
  sudo chown -R dietpi:dietpi /opt/pihole-vlan50

  # Test as dietpi user
  su - dietpi
  cd /opt/pihole-vlan50
  docker compose ps  # Should work without sudo
  ```

### Implementation Order

It's recommended to implement these changes in the following order:

1. **First**: Add sudo password to dietpi user (ensure you have working non-root access)
2. **Second**: Run Docker Compose as dietpi user
3. **Third**: Disable DietPi welcome menu
4. **Fourth**: Disable root login via SSH
5. **Last**: Disable password authentication via SSH (ensure SSH key auth is working!)

**⚠️ Important**: Before disabling password authentication and root login, verify that:
- SSH key authentication is working correctly
- The dietpi user has sudo access with password
- You can run Docker commands as the dietpi user

## References

- [Pi-hole Documentation](https://docs.pi-hole.net/)
- [Pi-hole Docker Documentation](https://github.com/pi-hole/docker-pi-hole)
- [Docker Macvlan Networking](https://docs.docker.com/network/macvlan/)
- [DietPi Documentation](https://dietpi.com/docs/)
