<objective>
Deploy Coder v2.29.1 to a Kubernetes cluster using FluxCD GitOps workflow, accessible only via Tailscale (internal network).

Coder is a remote development platform that provisions cloud development environments. This deployment will make Coder available via Tailscale ingress at hosts "*.coder" and "coder", backed by an existing PostgreSQL database. The service must NOT be exposed to the public internet - only accessible within the Tailnet.
</objective>

<context>
This is an Nx monorepo with GitOps-managed Kubernetes deployments. The deployment pattern follows stacks/enigma-cluster as a reference:
- Helm charts are vendored via Vendir into third_party/vendir/charts/
- FluxCD HelmRelease resources reference charts from the GitRepository
- Each stack has: namespace, gitrepository, kustomization-root, and helmrelease files
- The cluster has Tailscale operator installed (see stacks/enigma-cluster/helmrelease-tailscale-operator.yaml)

Target cluster kubeconfig: `apps/coder-prod/kubeconfig.super-admin`
Current git branch: `mg/feat/deploy-coder`

PostgreSQL database already exists:
- Host: postgres-coder-cluster-db-prod-rw.tenant-root
- Database: app
- Username: app
- Credentials in: apps/coder-prod/.env

Reference implementation files to examine:
- `stacks/enigma-cluster/gitrepository-setup.yaml` - GitRepository pointing to current branch
- `stacks/enigma-cluster/kustomization-root.yaml` - FluxCD Kustomization for the stack
- `stacks/enigma-cluster/kustomization.yaml` - Kustomize resources list
- `stacks/enigma-cluster/helmrelease-tailscale-operator.yaml` - HelmRelease pattern
- `third_party/vendir/vendir.yml` - Vendir configuration for helm charts
</context>

<requirements>
1. Add Coder Helm chart v2.29.1 to Vendir configuration:
   - Chart name: coder
   - Repository: https://helm.coder.com/v2
   - Target path: charts/coder

2. Run `vendir sync` in third_party/vendir/ to download the chart

3. Create FluxCD resources in apps/coder-prod/:
   - `namespace-coder.yaml` - Namespace for Coder deployment
   - `namespace-flux-system.yaml` - Flux system namespace
   - `gitrepository-setup.yaml` - GitRepository pointing to branch `mg/feat/deploy-coder`
   - `kustomization-root.yaml` - FluxCD Kustomization pointing to apps/coder-prod path
   - `kustomization.yaml` - Kustomize resources list
   - `helmrelease-coder.yaml` - HelmRelease for Coder

4. Configure Coder HelmRelease with:
   - Chart source: third_party/vendir/charts/coder (from GitRepository)
   - Target namespace: coder
   - PostgreSQL connection using credentials from .env (create a Secret)
   - Service exposed via Tailscale Ingress (NOT public ingress)
   - Hosts: "*.coder" and "coder" accessible only within Tailnet
   - Appropriate install/upgrade remediation settings

5. Create Tailscale Ingress for Coder:
   - Use Tailscale operator's Ingress class to expose the service
   - This ensures the service is ONLY accessible via Tailnet, not public internet
   - Configure for hosts "*.coder" and "coder"

6. Create a Kubernetes Secret for database credentials:
   - `secret-coder-db.yaml` - Contains PostgreSQL connection details
   - Reference the secret in HelmRelease values

7. Commit all changes to current branch and push to remote

8. Apply FluxCD bootstrap resources and reconcile:
   - Apply namespace, gitrepository, and kustomization-root to cluster
   - Use flux CLI to trigger reconciliation
   - Verify deployment status
</requirements>

<constraints>
- CRITICAL: Coder must NOT be exposed to the public internet. Use Tailscale ingress only.
- Use exact version 2.29.1 for Coder (pinned dependencies per project conventions)
- GitRepository must reference branch `mg/feat/deploy-coder` (current working branch)
- Follow naming convention: `<kind>-<name>.yaml` for Kubernetes manifests
- Do NOT include the database password directly in committed files - use a Secret that will be applied separately or managed securely
- Use KUBECONFIG environment variable pointing to apps/coder-prod/kubeconfig.super-admin for all kubectl/flux commands
- Service must be accessible only within the Tailnet for security
</constraints>

<implementation>
Step 1: Add Coder to Vendir
- Edit third_party/vendir/vendir.yml to add the Coder helm chart entry
- Run: cd third_party/vendir && vendir sync

Step 2: Create FluxCD manifests in apps/coder-prod/
Follow the pattern from stacks/enigma-cluster exactly:
- namespace-flux-system.yaml (flux-system namespace)
- namespace-coder.yaml (coder namespace)
- gitrepository-setup.yaml (source pointing to mg/feat/deploy-coder branch)
- kustomization-root.yaml (FluxCD Kustomization)
- kustomization.yaml (Kustomize resources list)
- helmrelease-coder.yaml (HelmRelease with chart and values)

Step 3: Configure HelmRelease values for Coder
Reference Coder helm chart documentation for required values:
- coder.env for PostgreSQL connection (CODER_PG_CONNECTION_URL)
- Disable default ingress in Coder helm chart (we'll use Tailscale Ingress separately)
- Use secret reference for database credentials

Step 4: Create Tailscale Ingress
Create an Ingress resource that uses Tailscale's ingress class:
- ingressClassName: tailscale
- This ensures traffic only comes through Tailscale, not public internet
- Configure hosts "*.coder" and "coder"
- Route to coder service

Step 5: Git operations
```bash
git add apps/coder-prod/ third_party/vendir/
git commit -m "feat(coder): Deploy Coder v2.29.1 to coder-prod cluster (Tailnet only)"
git push origin mg/feat/deploy-coder
```

Step 6: Bootstrap FluxCD and deploy
```bash
export KUBECONFIG=/workspaces/setup/apps/coder-prod/kubeconfig.super-admin

# Create the database secret first (from .env values)
kubectl create namespace coder --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic coder-db-credentials \
  --namespace=coder \
  --from-literal=url="postgres://app:PASSWORD@postgres-coder-cluster-db-prod-rw.tenant-root:5432/app?sslmode=disable" \
  --dry-run=client -o yaml | kubectl apply -f -

# Apply FluxCD bootstrap resources
kubectl apply -f apps/coder-prod/namespace-flux-system.yaml
kubectl apply -f apps/coder-prod/gitrepository-setup.yaml
kubectl apply -f apps/coder-prod/kustomization-root.yaml

# Reconcile
flux reconcile source git setup --namespace=flux-system
flux reconcile kustomization coder-prod --namespace=flux-system

# Verify
flux get helmrelease -n flux-system
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
6. HelmRelease shows Ready/deployed status
7. Coder pods are running in the coder namespace
8. Tailscale Ingress is created (NOT public ingress)
9. Verify NO public LoadBalancer or public Ingress exists for Coder

Run these verification commands:
```bash
export KUBECONFIG=/workspaces/setup/apps/coder-prod/kubeconfig.super-admin
flux get sources git -n flux-system
flux get kustomizations -n flux-system
flux get helmreleases -n flux-system
kubectl get pods -n coder
kubectl get ingress -n coder
kubectl get svc -n coder  # Verify no LoadBalancer type with external IP
```

Security verification:
- Confirm ingress uses Tailscale class (ingressClassName: tailscale)
- Confirm no public IP is assigned to any Coder service
- Service should only be reachable via Tailnet
</verification>

<success_criteria>
- Coder helm chart v2.29.1 vendored in third_party/vendir/charts/coder/
- All FluxCD resources created in apps/coder-prod/
- Changes committed and pushed to mg/feat/deploy-coder branch
- FluxCD successfully reconciles and deploys Coder
- Coder pods running and healthy
- Tailscale Ingress configured for hosts "*.coder" and "coder"
- NO public internet exposure (Tailnet only access)
- PostgreSQL connection working (Coder can connect to database)
</success_criteria>
