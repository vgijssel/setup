<objective>
Modify the Coder workspace template to use Kubernetes internal DNS for agent-to-server communication instead of the external URL (coder.enigma.vgijssel.nl).

This fixes agent disconnection issues caused by DNS mismatch and improves performance by keeping traffic within the cluster.
</objective>

<problem_analysis>
Investigation Date: 2026-01-16

## Observed Issue
Coder agents are disconnecting with error:
```
Agent state is "disconnected"
```

## Root Cause: DNS Mismatch

When pods inside `coder-cluster-prod` resolve `coder.enigma.vgijssel.nl`:

| DNS Query Path | Result |
|----------------|--------|
| Pod → CoreDNS (10.95.0.10) → Node's upstream DNS | **192.168.50.100** |
| Actual ingress-nginx LoadBalancer IP | **192.168.50.101** |

The DNS returns the wrong IP (`192.168.50.100`), but the ingress controller is at `192.168.50.101`.

## DNS Resolution Comparison

| Source | coder.enigma.vgijssel.nl |
|--------|-------------------------|
| External (public DNS) | 100.99.52.34 (Tailscale IP) |
| Inside coder-cluster-prod | 192.168.50.100 (wrong LAN IP) |
| Correct ingress LoadBalancer | 192.168.50.101 |

## Why Agents Disconnect

1. Agent configured with `CODER_AGENT_URL=https://coder.enigma.vgijssel.nl`
2. Inside cluster, DNS resolves to `192.168.50.100` (wrong)
3. Ingress controller is at `192.168.50.101`
4. Traffic to wrong IP causes connection failures

## Technical Details

- CoreDNS forwards external queries to node's `/etc/resolv.conf`
- Node's upstream DNS (local network) returns stale IP `192.168.50.100`
- Coder ClusterIP service: `10.95.209.202:80`
- Internal DNS: `coder.coder.svc.cluster.local:80`

## Solution

Use internal Kubernetes DNS (`coder.coder.svc.cluster.local:80`) instead of external URL.
This bypasses the DNS mismatch entirely and keeps traffic within the cluster.
</problem_analysis>

<context>
The Coder deployment runs in the `coder` namespace with the service available at:
- Internal DNS: `coder.coder.svc.cluster.local:80` (ClusterIP: 10.95.209.202)
- External URL: `https://coder.enigma.vgijssel.nl` (via nginx ingress at 192.168.50.101)

Currently, the workspace template at `./libs/coder-devcontainer-kubernetes/main.tf` passes `data.coder_workspace.me.access_url` to the agent, which resolves to the external URL.

There's an existing pattern using a ConfigMap (`coder-workspace-config` in `./apps/coder-prod/configmap-workspace-config.yaml`) to provide internal URLs to workspaces - currently used for registry_url.

Current branch: `mg/fix/coder-internal-dns-agent`
</context>

<requirements>
1. Add `coder_url` to the existing ConfigMap (`configmap-workspace-config.yaml`) with value `http://coder.coder.svc.cluster.local:80`
2. Update `main.tf` to read the Coder URL from the ConfigMap instead of using `data.coder_workspace.me.access_url`
3. Pass the internal URL to the agent via `CODER_AGENT_URL` environment variable in the `extra_env` block
4. Keep the template functional - ensure all existing functionality continues to work
</requirements>

<implementation>
Modify these files:

**`./apps/coder-prod/configmap-workspace-config.yaml`:**
- Add `coder_url: http://coder.coder.svc.cluster.local:80` to the data section

**`./libs/coder-devcontainer-kubernetes/main.tf`:**
- Add a local variable that reads `coder_url` from the ConfigMap data
- Update the `extra_env` block in `envbuilder_cached_image.workspace` to use the internal URL for `CODER_AGENT_URL`

Follow the existing pattern where `registry_url` is read from the ConfigMap.
</implementation>

<verification>
Test the changes through a full deployment cycle:

1. **Make changes to the ConfigMap** - Update `./apps/coder-prod/configmap-workspace-config.yaml` with the new `coder_url` value

2. **Update GitRepository to current branch** - Modify `./apps/coder-prod/gitrepository-setup.yaml` to point to branch `mg/fix/coder-internal-dns-agent`

3. **Commit and push** - Commit all changed files and push to remote

4. **Reconcile with Flux** - Use the Flux CLI to reconcile the GitRepository and Kustomization:
   ```bash
   flux reconcile source git setup -n flux-system
   flux reconcile kustomization coder-prod -n flux-system
   ```

5. **Validate ConfigMap** - Verify the ConfigMap has the new `coder_url` value:
   ```bash
   kubectl get configmap coder-workspace-config -n coder -o yaml
   ```

6. **Update Coder template** - Make the Terraform changes to `./libs/coder-devcontainer-kubernetes/main.tf`

7. **Push template with Coder CLI** - Push the updated template:
   ```bash
   coder templates push coder-devcontainer-kubernetes --directory ./libs/coder-devcontainer-kubernetes
   ```

8. **Run automated workspace test** - Run the workspace test target which creates a test workspace, validates health with goss, and cleans up automatically:
   ```bash
   moon run coder-devcontainer-kubernetes:workspace_test
   ```
   This test:
   - Creates a workspace with the current git branch
   - Runs goss health checks with retry logic (10 minute timeout)
   - Automatically deletes the workspace on completion or failure

9. **On error, iterate** - If any step fails, analyze the error, fix the issue, and repeat from step 1. Continue iterating until the workspace test passes.
</verification>

<success_criteria>
- ConfigMap contains `coder_url` with the internal Kubernetes DNS
- Terraform template reads the Coder URL from ConfigMap
- Agent receives the internal URL via CODER_AGENT_URL environment variable
- Template passes `terraform validate`
- Automated workspace test passes (`moon run coder-devcontainer-kubernetes:workspace_test`)
- No functionality is broken
</success_criteria>
