<objective>
Refactor stacks/enigma-cozy to replace Talm CLI with native talosctl for Talos configuration generation, following the existing pattern established in stacks/enigma.

This refactor eliminates the Helm chart templating approach used by Talm and instead uses talosctl's native `--config-patch` mechanism with YAML patch files for node-specific configurations.
</objective>

<context>
**Current State (stacks/enigma-cozy with Talm):**
- Uses `talm template` command with Helm chart templating
- Configuration defined in `values.yaml` with node-specific settings under `nodes:` key
- Helm templates in `charts/talm/` and `templates/` generate final YAML
- Node files generated to `nodes/illusion.yaml`, `nodes/the-dome.yaml`, `nodes/the-toy-factory.yaml`

**Target State (following stacks/enigma pattern with talosctl):**
- Uses `talosctl gen config` with `--config-patch @file.yaml` flags
- Configuration split into `all.patch.yaml` (shared settings) and per-node patch files
- Output files generated to `dist/` directory: `dist/illusion.yaml`, `dist/the-dome.yaml`, `dist/the-toy-factory.yaml`
- No Helm chart dependency, simpler file structure

**Key Files to Reference:**
- @stacks/enigma/Taskfile.yml - Target generate task pattern
- @stacks/enigma/all.patch.yaml - Example shared patch file
- @stacks/enigma/*.patch.yaml - Example node-specific patches
- @stacks/enigma-cozy/values.yaml - Source node configurations
- @stacks/enigma-cozy/templates/_helpers.tpl - Source template logic
- @stacks/enigma-cozy/Taskfile.yml - Current Talm-based generate tasks
</context>

<requirements>
1. **Generate baseline output files FIRST** before any changes:
   - Run the current Talm-based generation to produce baseline files
   - Save these to a `baseline/` directory within stacks/enigma-cozy for comparison
   - Files to capture: illusion.yaml, the-dome.yaml, the-toy-factory.yaml

2. **Create patch files** to replace Helm templates:
   - `all.patch.yaml` - Shared configuration for all nodes (kernel modules, sysctls, cluster settings, etc.)
   - `illusion.patch.yaml` - Node-specific: hostname, IP addresses, interfaces
   - `the-dome.patch.yaml` - Node-specific: hostname, IP addresses, interfaces
   - `the-toy-factory.patch.yaml` - Node-specific: hostname, IP addresses, interfaces

3. **Update Taskfile.yml** with new generate tasks:
   - Replace `talm template` commands with `talosctl gen config` commands
   - Use `--config-patch @all.patch.yaml --config-patch @<node>.patch.yaml` pattern
   - Update output paths from `nodes/` directory to `dist/` directory
   - Maintain both `generate:bootstrap` and `generate` tasks with appropriate endpoints

4. **Remove Talm dependencies:**
   - Delete `charts/talm/` directory
   - Delete `templates/` directory (or contents that are Talm-specific)
   - Remove any Talm-related entries from Chart.yaml if present

5. **Generate new output files** using talosctl and compare:
   - Generate new files to a `refactored/` directory
   - Compare with baseline files using diff
   - The generated YAML content must match semantically (fields may be reordered)

6. **Critical configuration to preserve** from values.yaml:
   - Cluster endpoint: https://192.168.50.50:6443
   - Cluster domain: cozy.local
   - Floating/VIP IP: 192.168.50.50
   - Pod subnets: 10.244.0.0/16
   - Service subnets: 10.96.0.0/16
   - Advertised subnets: 192.168.50.0/24
   - OIDC issuer URL: https://keycloak.enigma.vgijssel.nl/realms/cozy
   - Talos image: ghcr.io/cozystack/cozystack/talos:v1.10.5
   - All node-specific interface configurations (bridges, VLANs, VIPs)
   - Kernel modules: openvswitch, drbd, zfs, spl, vfio_pci, vfio_iommu_type1
</requirements>

<constraints>
- DO NOT apply any configuration changes to the actual cluster
- DO NOT run talosctl apply or talosctl bootstrap commands
- Only generate configuration files for comparison
- The secrets.yaml file must be preserved and used with --with-secrets flag
- Maintain the cluster name as "enigma-cozy"
- Node IPs:
  - illusion: 192.168.50.10 (VLAN), 10.50.50.10 (bridge)
  - the-dome: 192.168.50.11 (VLAN), 10.50.50.11 (bridge)
  - the-toy-factory: 192.168.50.12 (VLAN), 10.50.50.12 (bridge)
</constraints>

<implementation_steps>
1. **Navigate to stacks/enigma-cozy directory**

2. **Generate baseline files using current Talm setup:**
   ```bash
   mkdir -p baseline
   # Run the existing talm template commands (from Taskfile.yml generate task)
   # Copy the generated nodes/*.yaml files to baseline/
   ```

3. **Create all.patch.yaml** with shared configuration:
   - Machine type, kubelet config, sysctls, kernel modules
   - Install disk and image settings
   - Registry mirrors and containerd config
   - Cluster network settings (CNI, DNS domain, subnets)
   - API server OIDC configuration
   - Controller manager, scheduler, proxy settings
   - etcd advertised subnets

4. **Create node-specific patch files** (illusion.patch.yaml, etc.):
   - machine.network.hostname
   - machine.network.interfaces (with all bridge, VLAN, VIP config)
   - machine.network.nameservers

5. **Update Taskfile.yml generate task:**
   ```yaml
   generate:
     desc: Generate the Talos configuration files
     cmds:
       - mkdir -p dist
       - talosctl gen config --with-secrets secrets.yaml --config-patch @all.patch.yaml --config-patch @illusion.patch.yaml --output-types controlplane -o dist/illusion.yaml enigma-cozy https://192.168.50.50:6443 --force
       # Similar for the-dome and the-toy-factory
     sources:
       - all.patch.yaml
       - illusion.patch.yaml
       - the-dome.patch.yaml
       - the-toy-factory.patch.yaml
     generates:
       - dist/illusion.yaml
       - dist/the-dome.yaml
       - dist/the-toy-factory.yaml
   ```

6. **Generate new files and compare:**
   ```bash
   # Run new talosctl gen config commands, output to dist/
   # Compare: diff baseline/illusion.yaml dist/illusion.yaml
   ```

7. **Clean up** - Remove obsolete Talm files:
   - charts/talm/ directory
   - templates/ directory (Talm templates)
   - nodes/ directory (no longer needed)
   - Update Taskfile.yml apply tasks to use new file paths (dist/*.yaml)

8. **Add .gitignore for dist directory:**
   - Create or update `.gitignore` in stacks/enigma-cozy to ignore the `dist/` directory
   - The generated files contain secrets and should not be committed

9. **Final verification** - Ensure all three node configs match baseline
</implementation_steps>

<output>
Files to create:
- `./stacks/enigma-cozy/all.patch.yaml` - Shared node configuration
- `./stacks/enigma-cozy/illusion.patch.yaml` - Illusion node config
- `./stacks/enigma-cozy/the-dome.patch.yaml` - The-dome node config
- `./stacks/enigma-cozy/the-toy-factory.patch.yaml` - The-toy-factory node config
- `./stacks/enigma-cozy/.gitignore` - Ignore dist/ directory (generated files contain secrets)

Generated output files (in dist/ directory):
- `./stacks/enigma-cozy/dist/illusion.yaml` - Generated Talos config for illusion
- `./stacks/enigma-cozy/dist/the-dome.yaml` - Generated Talos config for the-dome
- `./stacks/enigma-cozy/dist/the-toy-factory.yaml` - Generated Talos config for the-toy-factory

Files to modify:
- `./stacks/enigma-cozy/Taskfile.yml` - Replace talm commands with talosctl

Files/directories to delete:
- `./stacks/enigma-cozy/charts/` directory
- `./stacks/enigma-cozy/templates/` directory
- `./stacks/enigma-cozy/nodes/` directory
- `./stacks/enigma-cozy/values.yaml` (after migration complete)
</output>

<verification>
Before declaring complete, verify:

1. **Baseline captured:**
   - baseline/illusion.yaml exists and matches current nodes/illusion.yaml
   - baseline/the-dome.yaml exists and matches current nodes/the-dome.yaml
   - baseline/the-toy-factory.yaml exists and matches current nodes/the-toy-factory.yaml

2. **New generation works:**
   - `task generate` in stacks/enigma-cozy completes without errors
   - Three node YAML files are generated in the `dist/` directory

3. **Output matches baseline:**
   - Run semantic YAML comparison (accounting for field reordering)
   - All critical fields match: machine type, network config, cluster settings, kernel modules
   - No missing or extra configuration sections

4. **Cleanup complete:**
   - charts/talm/ directory removed
   - templates/ directory removed
   - nodes/ directory removed
   - No references to `talm` remain in Taskfile.yml
</verification>

<success_criteria>
- The refactored stacks/enigma-cozy generates identical Talos configuration YAML as the original Talm-based setup
- All three node configuration files (illusion, the-dome, the-toy-factory) pass diff comparison
- The Taskfile.yml uses only talosctl commands, no talm references
- The file structure matches the stacks/enigma pattern
- No changes are applied to the actual cluster
</success_criteria>
