<objective>
Create a new NX application called "gateway-prod" in the `apps/` directory that provisions a Hetzner Cloud CX23 VM in Germany using Terraform/OpenTofu. The VM should initially boot Ubuntu, then be converted to Talos Linux using the boot-to-talos tool with the Cozystack Talos image. **Actually deploy the infrastructure** - run tofu plan and apply, iterate until we have a working VM running Cozystack Talos v1.10.5.
</objective>

<context>
This project is part of an Nx monorepo for infrastructure management. The gateway VM will serve as infrastructure in Germany on Hetzner Cloud.

Key requirements:
- Use Hetzner Cloud provider for Terraform
- VM type: CX23 (2 vCPU, 4GB RAM)
- Location: Germany (nbg1 or fsn1)
- Initial OS: Ubuntu (for boot-to-talos compatibility)
- Final OS: Talos Linux v1.10.5 using Cozystack image

Reference existing Terraform patterns in:
- `libs/cloudflare-tunnel/` for Terraform structure and version pinning conventions

Environment note: `HCLOUD_TOKEN` is already set in the current environment. The Hetzner provider will automatically use this environment variable, so no explicit token variable is needed.
</context>

<research>
Before implementing, examine:
1. Read `libs/cloudflare-tunnel/versions.tf` for Terraform version constraints pattern
2. Read `libs/cloudflare-tunnel/main.tf` for provider configuration patterns
3. Read `stacks/enigma-cluster/package.json` for NX package.json project structure
4. Check the Hetzner Cloud Terraform provider documentation for current version
5. Review boot-to-talos repository: https://github.com/cozystack/boot-to-talos for usage instructions
6. Verify Cozystack Talos image availability at: ghcr.io/cozystack/cozystack/talos:v1.10.5
</research>

<requirements>
1. **NX Project Structure** (`apps/gateway-prod/`):
   - `package.json` - NX project configuration using package.json format (not project.json)
   - `main.tf` - Main Terraform configuration
   - `variables.tf` - Input variables
   - `outputs.tf` - Output values (IP address, server ID)
   - `versions.tf` - Provider version constraints
   - `providers.tf` - Provider configuration

2. **Terraform Configuration**:
   - Use OpenTofu-compatible syntax
   - Pin Hetzner provider to exact version (check latest stable)
   - Create a CX23 server in Germany (prefer nbg1 datacenter)
   - Initial image: Ubuntu 24.04
   - Configure SSH key with the provided public key (hardcoded in terraform)
   - The provider will automatically use `HCLOUD_TOKEN` from the environment

3. **SSH Public Key** (hardcode this in the Terraform):
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp
   ```

4. **Hetzner Firewall Configuration**:
   Create a Hetzner Cloud firewall with the following inbound rules:
   - Port 80/tcp - HTTP public ingress
   - Port 443/tcp - HTTPS public ingress
   - Port 50000/tcp - Talos API (NOTE: This should only be open for initial setup, consider restricting or removing after cluster bootstrap)
   - Port 51820/udp - WireGuard for Kubespan

5. **Boot-to-Talos Integration**:
   - Create a null_resource or local-exec provisioner that:
     a. Waits for VM to be ready
     b. SSHs into the Ubuntu VM
     c. Downloads and runs boot-to-talos with the Cozystack image
   - CRITICAL: Use exactly this image: `ghcr.io/cozystack/cozystack/talos:v1.10.5`
   - The boot-to-talos command should be: `curl -sL https://github.com/cozystack/boot-to-talos/releases/latest/download/boot-to-talos | sudo bash -s -- ghcr.io/cozystack/cozystack/talos:v1.10.5`

6. **NX Targets** in package.json (use nx.targets format):
   - `init`: Run `tofu init`
   - `plan`: Run `tofu plan`
   - `apply`: Run `tofu apply -auto-approve`
   - `destroy`: Run `tofu destroy -auto-approve`
   - `output`: Run `tofu output`
</requirements>

<implementation>
Follow these patterns from the existing codebase:

1. **Package.json NX format** (from stacks/enigma-cluster/package.json):
   ```json
   {
     "name": "gateway-prod",
     "version": "1.0.0",
     "type": "commonjs",
     "nx": {
       "projectType": "application",
       "sourceRoot": "apps/gateway-prod",
       "targets": {
         "init": {
           "executor": "nx:run-commands",
           "options": {
             "command": "tofu init",
             "cwd": "apps/gateway-prod"
           }
         }
       },
       "tags": ["app", "terraform", "hetzner"]
     },
     "private": true
   }
   ```

2. **Version pinning** (from CLAUDE.md):
   - Pin all provider versions exactly (e.g., `version = "1.49.0"` not `version = "~> 1.49"`)
   - Pin Terraform/OpenTofu required version

3. **Provider configuration pattern** (from libs/cloudflare-tunnel):
   ```hcl
   terraform {
     required_version = ">= 1.8.0"
     required_providers {
       hcloud = {
         source  = "hetznercloud/hcloud"
         version = "X.X.X"  # Pin to exact latest stable
       }
     }
   }
   ```

4. **Firewall resource example**:
   ```hcl
   resource "hcloud_firewall" "gateway" {
     name = "gateway-prod"

     rule {
       direction = "in"
       protocol  = "tcp"
       port      = "80"
       source_ips = ["0.0.0.0/0", "::/0"]
     }

     # Port 50000 - Talos API
     # TODO: Restrict to specific IPs or remove after initial cluster setup
     rule {
       direction = "in"
       protocol  = "tcp"
       port      = "50000"
       source_ips = ["0.0.0.0/0", "::/0"]
     }
   }
   ```

5. **SSH provisioning considerations**:
   - The boot-to-talos script will reboot the machine into Talos
   - After running boot-to-talos, the SSH connection will be lost (expected)
   - The provisioner should handle this gracefully (use `|| true` or ignore exit codes)

6. **Datacenter selection**:
   - Use `nbg1` (Nuremberg) as primary choice
   - Alternative: `fsn1` (Falkenstein) if needed
</implementation>

<output>
Create the following files:

- `apps/gateway-prod/package.json` - NX project configuration (package.json format)
- `apps/gateway-prod/versions.tf` - Terraform version constraints
- `apps/gateway-prod/providers.tf` - Provider configuration
- `apps/gateway-prod/variables.tf` - Input variables (minimal, since HCLOUD_TOKEN comes from env)
- `apps/gateway-prod/main.tf` - Main infrastructure code (server, SSH key, firewall)
- `apps/gateway-prod/outputs.tf` - Output definitions
</output>

<execution>
IMPORTANT: After creating the Terraform files, you MUST actually deploy the infrastructure:

1. **Initialize Terraform**:
   ```bash
   cd apps/gateway-prod && tofu init
   ```

2. **Plan the deployment**:
   ```bash
   cd apps/gateway-prod && tofu plan
   ```
   - Review the plan output for any errors
   - If there are errors, fix the Terraform files and re-plan

3. **Apply the configuration**:
   ```bash
   cd apps/gateway-prod && tofu apply -auto-approve
   ```
   - This will create the VM in Hetzner Cloud
   - The null_resource provisioner will SSH in and run boot-to-talos
   - The connection will be lost when the VM reboots into Talos (this is expected)

4. **Iterate if needed**:
   - If apply fails, analyze the error, fix the configuration, and retry
   - Keep iterating until the deployment succeeds

5. **Verify the VM is running Talos**:
   - Get the VM's IP address from the Terraform output
   - Wait 2-3 minutes for the VM to reboot into Talos
   - Verify Talos is running by checking if the Talos API responds:
     ```bash
     talosctl --talosconfig=/dev/null --endpoints=<IP> version --insecure 2>&1 | head -5
     ```
   - Or simply check that the server is responding on port 50000

The task is NOT complete until:
- The VM is successfully created in Hetzner Cloud
- boot-to-talos has been executed
- The VM has rebooted and is running Cozystack Talos v1.10.5
</execution>

<verification>
Before completing, verify:
1. Run `tofu init` in apps/gateway-prod/ to validate provider configuration
2. Run `tofu validate` to check syntax
3. Run `trunk check apps/gateway-prod/` for linting
4. Verify the project appears in `nx show projects`
5. Confirm boot-to-talos command uses exactly: `ghcr.io/cozystack/cozystack/talos:v1.10.5`
6. Verify firewall rules include all required ports (80, 443, 50000, 51820)
7. Verify port 50000 has a comment indicating it's for initial setup only
8. **CRITICAL**: Verify the VM is actually running in Hetzner Cloud (check `hcloud server list`)
9. **CRITICAL**: Verify the VM has rebooted into Talos (check Talos API on port 50000)
</verification>

<success_criteria>
- All Terraform files pass validation (`tofu validate`)
- NX project is properly configured using package.json format and shows in project list
- Provider versions are pinned to exact versions
- SSH key is hardcoded with the provided ed25519 public key
- Firewall is configured with all required ports (80/tcp, 443/tcp, 50000/tcp, 51820/udp)
- Boot-to-talos provisioner uses the correct Cozystack Talos v1.10.5 image
- SSH provisioning handles the expected connection loss after boot-to-talos gracefully
- Code passes trunk linting checks
- **VM is successfully deployed to Hetzner Cloud**
- **VM is running Cozystack Talos v1.10.5** (verified via Talos API or other means)
</success_criteria>
