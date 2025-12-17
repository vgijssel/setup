<objective>
Create a script to upgrade TalosOS images on the enigma-cozy cluster nodes. The cluster runs CozyStack which requires specific Talos image versions. The upgrade path is: Talos v1.10.5 → v1.11.3 (CozyStack version).
</objective>

<context>
The enigma-cozy cluster is a Talos-based Kubernetes cluster running CozyStack. CozyStack publishes custom Talos images that include required kernel modules (openvswitch, drbd, zfs, etc.).

Current state:
- Talos version: v1.10.5 (CozyStack image: `ghcr.io/cozystack/cozystack/talos:v1.10.5`)
- CozyStack version: v0.38.3
- Target: Talos v1.11.3 for CozyStack v0.38.4

Cluster nodes (from @stacks/enigma-cozy/Taskfile.yml):
- illusion: 192.168.50.10 (control plane)
- the-dome: 192.168.50.11 (control plane)
- the-toy-factory: 192.168.50.12 (control plane)
- here-i-am: 46.224.93.115 (worker, remote node)

The existing @stacks/enigma-cozy/scripts/upgrade.sh handles CozyStack software upgrades but NOT Talos OS upgrades. Talos OS upgrades require using `talosctl upgrade` which performs a rolling upgrade of the OS image.
</context>

<research>
Before implementing, research the following:

1. **CozyStack Talos Images**:
   - Fetch https://cozystack.io/docs/talos/installation/ or similar docs to understand CozyStack's Talos image naming and availability
   - Check GitHub releases at https://github.com/cozystack/cozystack for image tags
   - Verify the exact image URL format for v1.11.3

2. **Talos Upgrade Process**:
   - Fetch https://www.talos.dev/v1.11/talos-guides/upgrading-talos/ to understand:
     - The `talosctl upgrade` command and its options
     - Rolling upgrade best practices (one node at a time)
     - How to preserve the upgrade across reboots (`--preserve` flag)
     - Pre-upgrade checks and post-upgrade validation

3. **Upgrade Considerations**:
   - Control plane nodes should be upgraded one at a time
   - Worker nodes can potentially be upgraded in parallel
   - Need to wait for node to be Ready after each upgrade
   - May need to cordon/drain nodes before upgrade

4. **Version Compatibility**:
   - Verify CozyStack v0.38.4 requires Talos v1.11.3
   - Check for any breaking changes in Talos 1.10 → 1.11
</research>

<requirements>
Create a new script `stacks/enigma-cozy/scripts/upgrade-talos.sh` that:

1. **Reads target Talos version from package.json metadata**:
   - Extract version from `nx.metadata.dependencies["cozystack/talos"].version` in package.json
   - Construct the CozyStack image URL: `ghcr.io/cozystack/cozystack/talos:<version>`
   - This follows the same pattern as the existing CozyStack version tracking

2. **Pre-flight checks**:
   - Verify talosctl is available and configured
   - Show current Talos version on each node
   - Show target version and image URL
   - Confirm cluster health before proceeding

3. **Interactive confirmation using gum** (consistent with existing upgrade.sh):
   - Show the upgrade plan (which nodes, in what order)
   - Require explicit confirmation before proceeding

4. **Rolling upgrade execution**:
   - Upgrade control plane nodes one at a time (illusion → the-dome → the-toy-factory)
   - Wait for each node to complete upgrade and become Ready
   - Then upgrade worker nodes (here-i-am)
   - Use `talosctl upgrade` with appropriate flags

5. **Post-upgrade validation**:
   - Verify all nodes are running the new version
   - Run goss validation to confirm cluster health
   - Report success/failure status

6. **Error handling**:
   - Fail fast on errors
   - Provide clear error messages
   - Allow resumption from failed point if possible
</requirements>

<implementation>
Follow these patterns from existing code:

1. **Script structure** (from @stacks/enigma-cozy/scripts/upgrade.sh):
   - Use `#!/usr/bin/env bash` and `set -euo pipefail`
   - Set SCRIPT_DIR and STACK_DIR variables
   - Use gum for interactive confirmations
   - Use goss for validation

2. **Version extraction** (same pattern as existing upgrade.sh):
   - Use jq to extract version: `jq -r '.nx.metadata.dependencies["cozystack/talos"].version' package.json`
   - Construct image URL from version

3. **Node information** (from @stacks/enigma-cozy/Taskfile.yml):
   - Use the established IP addresses and node names
   - Reference talosconfig in the stack directory

4. **Update all.patch.yaml**:
   - After successful upgrade, update the `machine.install.image` field to match the new version
   - This ensures future node rebuilds use the correct image

5. **Add Taskfile target**:
   - Add an `upgrade:talos` task to @stacks/enigma-cozy/Taskfile.yml that calls the new script
</implementation>

<output>
Create/modify files:
- `./stacks/enigma-cozy/scripts/upgrade-talos.sh` - Main upgrade script (make executable)
- `./stacks/enigma-cozy/Taskfile.yml` - Add upgrade:talos task
- `./stacks/enigma-cozy/package.json` - Add Talos version to metadata and upgrade:talos target

The package.json metadata section should be updated to include the Talos dependency:
```json
"metadata": {
  "dependencies": {
    "cozystack/cozystack": {
      "version": "v0.38.3",
      "datasource": "github-releases"
    },
    "cozystack/talos": {
      "version": "v1.11.3",
      "datasource": "docker"
    }
  }
}
```

Note: Use `"datasource": "docker"` since the Talos images are published as container images to `ghcr.io/cozystack/cozystack/talos`. This allows Renovatebot to detect new image tags automatically.
</output>

<verification>
Before declaring complete:
1. Verify the script is executable (`chmod +x`)
2. Run `./stacks/enigma-cozy/scripts/upgrade-talos.sh --help` to confirm it shows usage
3. Verify the Taskfile task works: `task upgrade:talos --dry-run` (if task supports dry-run)
4. Confirm script handles the case where nodes are already at target version
5. Review the talosctl upgrade command syntax matches official documentation
</verification>

<success_criteria>
- Script safely upgrades Talos OS images on all cluster nodes
- Rolling upgrade preserves cluster availability (one control plane node at a time)
- Interactive confirmation prevents accidental upgrades
- Post-upgrade validation confirms success
- Script is idempotent (safe to run if already at target version)
- all.patch.yaml is updated to reflect the new image version
- Talos version is tracked in package.json metadata for Renovatebot compatibility
- Script reads version from package.json (not command-line argument)
</success_criteria>
