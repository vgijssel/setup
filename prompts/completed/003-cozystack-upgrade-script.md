<objective>
Create a production-ready upgrade script for CozyStack that safely applies upgrades with diff preview, confirmation prompts, and automated health validation.

This script will be used by operators to safely upgrade the CozyStack cluster with:
1. Clear visibility into what will change
2. Interactive confirmation before applying changes
3. Automated validation that the upgrade succeeded
</objective>

<context>
Stack location: `stacks/enigma-cozy/`
Version source: `stacks/enigma-cozy/package.json` at path `nx.metadata.dependencies["cozystack/cozystack"].version`
Goss tests: `stacks/enigma-cozy/goss.yaml`

CozyStack upgrade process (from official docs):
1. Set version variable
2. Apply manifest: `kubectl apply -f https://github.com/cozystack/cozystack/releases/download/$version/cozystack-installer.yaml`
3. Monitor logs: `kubectl logs -n cozy-system deploy/cozystack -f`
4. Verify: Check pods and helm releases

Interactive CLI tool: Use `gum` for nice prompts (install via Hermit)

Environment: Commands run in an environment already authenticated against the enigma-cozy cluster. No need to specify kubeconfig explicitly - just use `kubectl` directly.
</context>

<requirements>
**Create upgrade script at `stacks/enigma-cozy/scripts/upgrade.sh`**

Script must implement these steps in order:

1. **Extract version from package.json**
   - Read version from `nx.metadata.dependencies["cozystack/cozystack"].version` using jq
   - Store in VERSION variable
   - Print the version being upgraded to

2. **Render diff of changes**
   - Fetch the installer manifest: `curl -sL https://github.com/cozystack/cozystack/releases/download/$VERSION/cozystack-installer.yaml`
   - Compare against currently applied resources using `kubectl diff`
   - Display the diff to the user

3. **Ask for confirmation using gum**
   - Use `gum confirm "Apply CozyStack upgrade to $VERSION?"`
   - Exit if user declines
   - Proceed if confirmed

4. **Apply the upgrade**
   - Run: `kubectl apply -f https://github.com/cozystack/cozystack/releases/download/$VERSION/cozystack-installer.yaml`
   - Show output to user

5. **Run goss validation loop**
   - Run `goss validate` in a loop
   - Timeout after 10 minutes (600 seconds)
   - Sleep 30 seconds between attempts
   - Exit successfully when goss passes
   - Exit with error if timeout reached

**Install gum via Hermit**
- Add gum to Hermit manifest at `bin/`
- Create hermit manifest file if needed

**Add upgrade target to package.json**
- Add an `upgrade` target to nx.targets in `stacks/enigma-cozy/package.json`
- The target should run the upgrade script: `./scripts/upgrade.sh`
- This allows running the upgrade via `nx run enigma-cozy:upgrade`
</requirements>

<implementation>
Script structure:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="$(dirname "$SCRIPT_DIR")"
cd "$STACK_DIR"

# Step 1: Extract version from dependencies
VERSION=$(jq -r '.nx.metadata.dependencies["cozystack/cozystack"].version' package.json)
echo "Upgrading CozyStack to version: $VERSION"

# Step 2: Show diff
echo ""
echo "=== Changes to be applied ==="
MANIFEST_URL="https://github.com/cozystack/cozystack/releases/download/$VERSION/cozystack-installer.yaml"
curl -sL "$MANIFEST_URL" | kubectl diff -f - || true
echo "=== End of changes ==="

# Step 3: Confirm with gum
echo ""
if ! gum confirm "Apply CozyStack upgrade to $VERSION?"; then
    echo "Upgrade cancelled."
    exit 0
fi

# Step 4: Apply upgrade
echo ""
echo "Applying upgrade..."
kubectl apply -f "$MANIFEST_URL"

# Step 5: Validation loop
echo ""
echo "Waiting for cluster to become healthy..."
TIMEOUT=600
INTERVAL=30
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    echo "Running health checks... (${ELAPSED}s / ${TIMEOUT}s)"
    if goss validate; then
        echo ""
        echo "Upgrade completed successfully!"
        exit 0
    fi
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""
echo "ERROR: Timeout waiting for cluster to become healthy"
exit 1
```

For Hermit gum installation:
- Check if `bin/gum` hermit stub exists
- If not, run `hermit install gum` from bin directory
</implementation>

<output>
Create/modify files:
- `./stacks/enigma-cozy/scripts/upgrade.sh` - The upgrade script (make executable)
- `./stacks/enigma-cozy/package.json` - Add upgrade target to nx.targets

Install via Hermit:
- Run `cd bin && hermit install gum` to add gum to project

Example package.json targets section:
```json
{
  "nx": {
    "targets": {
      "upgrade": {
        "command": "./scripts/upgrade.sh"
      }
    }
  }
}
```
</output>

<verification>
1. Verify script is executable: `ls -la stacks/enigma-cozy/scripts/upgrade.sh`
2. Verify gum is available: `bin/gum --version`
3. Test script syntax: `bash -n stacks/enigma-cozy/scripts/upgrade.sh`
4. Verify upgrade target exists: `nx show project enigma-cozy --json | jq '.targets.upgrade'`
5. Dry-run test (just version extraction): The script should print the version when run
</verification>

<success_criteria>
- upgrade.sh exists and is executable
- Script extracts version from package.json correctly
- gum is installed via Hermit
- Script includes all 5 required steps
- bash -n reports no syntax errors
- package.json contains upgrade target in nx.targets
- `nx run enigma-cozy:upgrade` can invoke the script
</success_criteria>
