<objective>
Modify the Coder workspace template to use Kubernetes internal DNS for agent-to-server communication instead of the external URL (coder.enigma.vgijssel.nl).

This improves performance by keeping traffic within the cluster and avoids external DNS resolution and ingress overhead for workspace agent communication.
</objective>

<context>
The Coder deployment runs in the `coder` namespace with the service available at:
- Internal DNS: `coder.coder.svc.cluster.local:80` (ClusterIP service)
- External URL: `https://coder.enigma.vgijssel.nl` (via nginx ingress)

Currently, the workspace template at `./libs/coder-devcontainer-kubernetes/main.tf` passes `data.coder_workspace.me.access_url` to the agent, which resolves to the external URL.

There's an existing pattern using a ConfigMap (`coder-workspace-config` in `./apps/coder-prod/configmap-workspace-config.yaml`) to provide internal URLs to workspaces - currently used for registry_url.

Current branch: `mg/fix/solve-caching-problem-envbuilder`
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

2. **Update GitRepository to current branch** - Modify `./apps/coder-prod/gitrepository-setup.yaml` to point to branch `mg/fix/solve-caching-problem-envbuilder`

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

8. **Create test workspace** - Create a new workspace to test the changes:
   ```bash
   coder create test-internal-dns --template coder-devcontainer-kubernetes
   ```

9. **Wait for workspace health** - Monitor until the workspace becomes healthy, including all apps:
   ```bash
   coder list
   coder apps test-internal-dns
   ```

10. **On error, iterate** - If any step fails, analyze the error, fix the issue, and repeat from step 1. Continue iterating until a workspace successfully boots and becomes healthy inside Coder.

After successful validation, clean up the test workspace:
```bash
coder delete test-internal-dns --yes
```
</verification>

<success_criteria>
- ConfigMap contains `coder_url` with the internal Kubernetes DNS
- Terraform template reads the Coder URL from ConfigMap
- Agent receives the internal URL via CODER_AGENT_URL environment variable
- Template passes `terraform validate`
- A test workspace successfully starts and becomes healthy
- All workspace apps are functional
- No functionality is broken
</success_criteria>
