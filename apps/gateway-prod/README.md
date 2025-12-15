# Gateway Production Server

NX application for provisioning a Hetzner Cloud VM that runs Cozystack Talos Linux v1.10.5.

## Infrastructure

- **Provider**: Hetzner Cloud
- **Server Type**: CX23 (2 vCPU, 4GB RAM, 40GB disk)
- **Location**: Nuremberg, Germany (nbg1-dc3)
- **Initial OS**: Ubuntu 24.04
- **Target OS**: Talos Linux v1.10.5 (Cozystack image)

## Components

### Terraform Resources

1. **SSH Key** (`hcloud_ssh_key.gateway`)
   - Hardcoded ed25519 public key for server access

2. **Firewall** (`hcloud_firewall.gateway`)
   - Port 80/tcp: HTTP public ingress
   - Port 443/tcp: HTTPS public ingress
   - Port 50000/tcp: Talos API (for initial setup)
   - Port 51820/udp: WireGuard for Kubespan

3. **Server** (`hcloud_server.gateway`)
   - Boots Ubuntu 24.04 initially
   - Cloud-init script automatically runs boot-to-talos
   - Converts to Talos Linux on first boot

## Usage

```bash
# Initialize Terraform
nx run gateway-prod:init

# Plan infrastructure changes
nx run gateway-prod:plan

# Apply infrastructure
nx run gateway-prod:apply

# Show outputs (IP address, etc.)
nx run gateway-prod:output

# Destroy infrastructure
nx run gateway-prod:destroy
```

## Boot-to-Talos Process

The server uses cloud-init to automatically download and run [boot-to-talos](https://github.com/cozystack/boot-to-talos) with the Cozystack Talos image:

```bash
ghcr.io/cozystack/cozystack/talos:v1.10.5
```

This process:
1. Downloads the boot-to-talos tool
2. Installs Talos to `/dev/sda`
3. Reboots the system into Talos Linux

The conversion happens automatically via cloud-init after the Ubuntu server first boots.

## Current Status

### Completed
- ✅ NX project structure created
- ✅ Terraform configuration written and validated
- ✅ VM successfully created in Hetzner Cloud
- ✅ Firewall rules configured
- ✅ SSH key registered
- ✅ Cloud-init script for boot-to-talos deployment

### Known Issues

⚠️ **Talos API Not Responding**

The Talos API on port 50000 is refusing connections. This requires investigation:

1. **Possible Causes**:
   - Boot-to-talos process may not have completed successfully
   - Talos requires initial configuration before API is fully functional
   - Cloud-init execution timing issues
   - Cozystack Talos image may have specific requirements not met

2. **Next Steps to Debug**:
   - Enable Hetzner rescue mode with password auth
   - Mount and inspect the disk to verify Talos installation
   - Check cloud-init logs in `/var/log/boot-to-talos.log`
   - Verify boot-to-talos completed successfully
   - Review Cozystack documentation for initial Talos configuration requirements

3. **Alternative Approaches**:
   - Use standard Talos Linux image instead of Cozystack variant
   - Apply Talos configuration during provisioning
   - Use Talm (Talos configuration management) to bootstrap the system
   - Consider using Hetzner's custom image upload feature

## Verification Commands

Check if server is running:
```bash
hcloud server list | grep gateway-prod
```

Test Talos API connectivity:
```bash
talosctl --talosconfig=/dev/null --endpoints=<IP> version --insecure
```

Check port 50000:
```bash
curl -v https://<IP>:50000
```

## Next Steps

To complete the Talos setup:

1. Debug why Talos API is not responding
2. Apply initial Talos configuration (machine config)
3. Bootstrap Kubernetes using Talm
4. Install Cozystack
5. Configure Cozystack dashboard and RBAC

## References

- [Cozystack Documentation](https://cozystack.io/docs/)
- [Cozystack Getting Started](https://cozystack.io/docs/getting-started/)
- [boot-to-talos Tool](https://github.com/cozystack/boot-to-talos)
- [Talos Linux Documentation](https://www.talos.dev/)
- [Hetzner Cloud Docs](https://docs.hetzner.com/cloud/)
