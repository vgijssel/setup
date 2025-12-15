<objective>
Deploy Coder v2.29.1 to a Kubernetes cluster using FluxCD GitOps workflow, accessible only via Tailscale (internal network), with 1Password for secrets management.

Coder is a remote development platform that provisions cloud development environments. This deployment will make Coder available via Tailscale ingress at hosts "*.coder" and "coder", backed by an existing PostgreSQL database. The service must NOT be exposed to the public internet - only accessible within the Tailnet. Database credentials are managed via 1Password Connect.
</objective>

<context>
This is an Nx monorepo with GitOps-managed Kubernetes deployments. The deployment pattern follows stacks/enigma-cluster as a reference:
- Helm charts are vendored via Vendir into third_party/vendir/charts/
- FluxCD HelmRelease resources reference charts from the GitRepository
- Each stack has: namespace, gitrepository, kustomization-root, and helmrelease files
- The cluster has Tailscale operator installed (see stacks/enigma-cluster/helmrelease-tailscale-operator.yaml)
- 1Password Connect pattern: operator deploys first, then secrets HelmRelease creates OnePasswordItem resources

Target cluster kubeconfig: `apps/coder-prod/kubeconfig.super-admin`
Current git branch: `mg/feat/deploy-coder`

PostgreSQL database credentials in 1Password:
- Item path: `op://setup-coder-prod/coder-cluster-db-prod/credential`
- The 1Password item contains: hostname, database name, username, and password
- FluxCD itemPath format: `vaults/setup-coder-prod/items/coder-cluster-db-prod`

1Password namespace prerequisites (already deployed in cluster):
- Secret `1password-credentials` - Contains 1password-credentials.json
- Secret `1password-operator-token` - Contains operator token

Reference implementation files to examine:
- `stacks/enigma-cluster/helmrelease-1password-operator.yaml` - 1Password Connect + Operator deployment
- `stacks/enigma-cluster/helmrelease-1password-secrets.yaml` - OnePasswordItem resources pattern
- `libs/1password-secrets/templates/onepassworditem.yaml` - OnePasswordItem template
- `stacks/enigma-cluster/gitrepository-setup.yaml` - GitRepository pointing to current branch
- `stacks/enigma-cluster/kustomization-root.yaml` - FluxCD Kustomization for the stack
- `stacks/enigma-cluster/helmrelease-tailscale-operator.yaml` - HelmRelease pattern with dependsOn
- `third_party/vendir/vendir.yml` - Vendir configuration for helm charts
</context>

<requirements>
1. Add Coder Helm chart v2.29.1 to Vendir configuration:
   - Chart name: coder
   - Repository: https://helm.coder.com/v2
   - Target path: charts/coder

2. Run `vendir sync` in third_party/vendir/ to download the chart

3. Create FluxCD resources in apps/coder-prod/:
   - `namespace-flux-system.yaml` - Flux system namespace
   - `namespace-1password.yaml` - 1Password namespace (secrets already exist here)
   - `namespace-coder.yaml` - Namespace for Coder deployment
   - `gitrepository-setup.yaml` - GitRepository pointing to branch `mg/feat/deploy-coder`
   - `kustomization-root.yaml` - FluxCD Kustomization pointing to apps/coder-prod path
   - `kustomization.yaml` - Kustomize resources list
   - `helmrelease-1password-operator.yaml` - 1Password Connect server + operator
   - `helmrelease-1password-secrets.yaml` - OnePasswordItem for database credentials
   - `helmrelease-coder.yaml` - HelmRelease for Coder

4. Configure 1Password Operator HelmRelease:
   - Chart source: third_party/vendir/charts/1password-connect (from GitRepository)
   - Target namespace: 1password
   - Use existing secrets: `1password-credentials` and `1password-operator-token`
   - Enable both connect server and operator
   - watchNamespace: [] (watch all namespaces)

5. Configure 1Password Secrets HelmRelease:
   - Chart source: ./libs/1password-secrets (from GitRepository)
   - dependsOn: 1password-operator
   - Create OnePasswordItem for coder database credentials:
     - name: coder-db-credentials
     - namespace: coder
     - itemPath: vaults/setup-coder-prod/items/coder-cluster-db-prod

6. Configure Coder HelmRelease with:
   - Chart source: third_party/vendir/charts/coder (from GitRepository)
   - Target namespace: coder
   - dependsOn: 1password-secrets (wait for database secret to be available)
   - PostgreSQL connection using secret created by OnePasswordItem
   - Service exposed via Tailscale Ingress (NOT public ingress)
   - Hosts: "*.coder" and "coder" accessible only within Tailnet
   - Appropriate install/upgrade remediation settings

7. Create Tailscale Ingress for Coder:
   - Use Tailscale operator's Ingress class to expose the service
   - This ensures the service is ONLY accessible via Tailnet, not public internet
   - Configure for hosts "*.coder" and "coder"

8. Git workflow - commit and push all changes:
   ```bash
   git add apps/coder-prod/ third_party/vendir/
   git commit -m "feat(coder): Deploy Coder v2.29.1 with 1Password integration (Tailnet only)"
   git push origin mg/feat/deploy-coder
   ```

9. Apply FluxCD bootstrap resources and reconcile using Flux CLI:
   - Apply namespace, gitrepository, and kustomization-root to cluster
   - Use flux CLI to trigger reconciliation
   - Verify deployment status
</requirements>

<constraints>
- CRITICAL: Coder must NOT be exposed to the public internet. Use Tailscale ingress only.
- Use exact version 2.29.1 for Coder (pinned dependencies per project conventions)
- GitRepository must reference branch `mg/feat/deploy-coder` (current working branch)
- Follow naming convention: `<kind>-<name>.yaml` for Kubernetes manifests
- Do NOT hardcode database credentials - use 1Password OnePasswordItem to sync the secret
- Use KUBECONFIG environment variable pointing to apps/coder-prod/kubeconfig.super-admin for all kubectl/flux commands
- Service must be accessible only within the Tailnet for security
- HelmRelease dependencies: 1password-operator → 1password-secrets → coder
</constraints>

<implementation>
Step 1: Add Coder to Vendir
- Edit third_party/vendir/vendir.yml to add the Coder helm chart entry
- Run: cd third_party/vendir && vendir sync

Step 2: Create FluxCD manifests in apps/coder-prod/
Follow the pattern from stacks/enigma-cluster exactly:

Namespaces:
- namespace-flux-system.yaml (flux-system namespace)
- namespace-1password.yaml (1password namespace - secrets already deployed here)
- namespace-coder.yaml (coder namespace)

GitOps resources:
- gitrepository-setup.yaml (source pointing to mg/feat/deploy-coder branch)
- kustomization-root.yaml (FluxCD Kustomization)
- kustomization.yaml (Kustomize resources list)

HelmReleases (in dependency order):
- helmrelease-1password-operator.yaml
- helmrelease-1password-secrets.yaml (dependsOn: 1password-operator)
- helmrelease-coder.yaml (dependsOn: 1password-secrets)

Step 3: Configure 1Password Operator HelmRelease
Reference stacks/enigma-cluster/helmrelease-1password-operator.yaml:
```yaml
values:
  operator:
    create: true
    watchNamespace: []
    token:
      name: 1password-operator-token
      key: token
  connect:
    create: true
    credentialsName: 1password-credentials
    credentialsKey: 1password-credentials.json
```

Step 4: Configure 1Password Secrets HelmRelease
Reference stacks/enigma-cluster/helmrelease-1password-secrets.yaml:
```yaml
dependsOn:
  - name: 1password-operator
values:
  secrets:
    - name: coder-db-credentials
      namespace: coder
      itemPath: vaults/setup-coder-prod/items/coder-cluster-db-prod
```

Step 5: Configure Coder HelmRelease
- dependsOn: 1password-secrets
- Reference the coder-db-credentials secret for PostgreSQL connection
- The secret will contain fields from 1Password (credential, username, hostname, database)
- Configure CODER_PG_CONNECTION_URL using secretKeyRef or build connection string from secret fields
- Disable default ingress (we use Tailscale Ingress)

Step 6: Create Tailscale Ingress
Create an Ingress resource that uses Tailscale's ingress class:
- ingressClassName: tailscale
- This ensures traffic only comes through Tailscale, not public internet
- Configure hosts "*.coder" and "coder"
- Route to coder service

Step 7: Git operations
```bash
git add apps/coder-prod/ third_party/vendir/
git commit -m "feat(coder): Deploy Coder v2.29.1 with 1Password integration (Tailnet only)"
git push origin mg/feat/deploy-coder
```

Step 8: Bootstrap FluxCD and deploy
```bash
export KUBECONFIG=/workspaces/setup/apps/coder-prod/kubeconfig.super-admin

# Apply FluxCD bootstrap resources
kubectl apply -f apps/coder-prod/namespace-flux-system.yaml
kubectl apply -f apps/coder-prod/namespace-1password.yaml
kubectl apply -f apps/coder-prod/gitrepository-setup.yaml
kubectl apply -f apps/coder-prod/kustomization-root.yaml

# Reconcile using Flux CLI
flux reconcile source git setup --namespace=flux-system
flux reconcile kustomization coder-prod --namespace=flux-system

# Verify deployment chain
flux get helmrelease -n flux-system
kubectl get pods -n 1password
kubectl get onepassworditems -n coder
kubectl get secrets -n coder
kubectl get pods -n coder
```
</implementation>

<verification>
Before declaring complete, verify:
1. Vendir successfully downloaded the Coder chart to third_party/vendir/charts/coder/
2. All YAML files pass validation (kubectl apply --dry-run=client)
3. Git commit and push succeeded
4. FluxCD GitRepository shows Ready status
5. FluxCD Kustomization shows Ready status
6. 1password-operator HelmRelease shows Ready/deployed status
7. 1password-secrets HelmRelease shows Ready/deployed status
8. OnePasswordItem coder-db-credentials synced successfully
9. Kubernetes Secret coder-db-credentials exists in coder namespace
10. Coder HelmRelease shows Ready/deployed status
11. Coder pods are running in the coder namespace
12. Tailscale Ingress is created (NOT public ingress)
13. Verify NO public LoadBalancer or public Ingress exists for Coder

Run these verification commands:
```bash
export KUBECONFIG=/workspaces/setup/apps/coder-prod/kubeconfig.super-admin

# FluxCD status
flux get sources git -n flux-system
flux get kustomizations -n flux-system
flux get helmreleases -n flux-system

# 1Password status
kubectl get pods -n 1password
kubectl get onepassworditems -A
kubectl get secret coder-db-credentials -n coder -o yaml

# Coder status
kubectl get pods -n coder
kubectl get ingress -n coder
kubectl get svc -n coder  # Verify no LoadBalancer type with external IP
```

Security verification:
- Confirm ingress uses Tailscale class (ingressClassName: tailscale)
- Confirm no public IP is assigned to any Coder service
- Service should only be reachable via Tailnet
- Database credentials are NOT in git (managed via 1Password)
</verification>

<success_criteria>
- Coder helm chart v2.29.1 vendored in third_party/vendir/charts/coder/
- All FluxCD resources created in apps/coder-prod/
- Changes committed and pushed to mg/feat/deploy-coder branch
- 1Password Connect server and operator running in 1password namespace
- OnePasswordItem syncing database credentials to coder namespace
- FluxCD successfully reconciles and deploys Coder (after 1password-secrets is ready)
- Coder pods running and healthy
- Tailscale Ingress configured for hosts "*.coder" and "coder"
- NO public internet exposure (Tailnet only access)
- PostgreSQL connection working via 1Password-managed secret
</success_criteria>
