# ArgoCD Apps Directory - AI Assistant Guide

## Architecture Overview

This directory uses ArgoCD ApplicationSets to automatically discover and deploy applications. Each subdirectory can contain either **umbrella Helm charts** or **plain Kubernetes manifests**, and both are treated identically by the ApplicationSet generators.

## Directory Structure Convention

### Top-level Groupings

Every top-level directory under `apps/` is a **logical grouping** (e.g., `secrets-proxy`, `docs-sync`, `argocd`). Each grouping contains one or more subdirectories representing individual applications or components.

### Application Types

Each subdirectory is one of two types:

#### 1. Umbrella Helm Chart
Contains a `Chart.yaml` declaring an external chart as a dependency, plus values overrides.

```
apps/<grouping>/<app-name>/
├── Chart.yaml      # Declares dependency on external chart
├── Chart.lock      # MUST be committed (ArgoCD requires it)
├── values.yaml     # Production values
└── values-pr.yaml  # PR environment overrides (optional)
```

**ArgoCD auto-detection**: Presence of `Chart.yaml` → Helm source

#### 2. Plain Kubernetes Manifests
Contains raw YAML files. No `Chart.yaml` present.

```
apps/<grouping>/manifests/
├── ingress.yaml
├── network-policy.yaml
└── config.json     # Routing metadata
```

**ArgoCD auto-detection**: No `Chart.yaml` → Directory source
**Convention**: These directories are named `manifests/` for clarity

## Application Discovery: config.json

Every application subdirectory (except `argocd*` groupings) **must** contain a `config.json` file for ApplicationSet discovery.

### config.json Format

```json
{
  "cluster": "https://kubernetes.default.svc",
  "namespace": "target-namespace"
}
```

For vCluster targets, use the registered cluster name:
```json
{
  "cluster": "vcluster-secrets-proxy",
  "namespace": "onepassword"
}
```

### Why config.json?

- **Decouples routing from application code**: Cluster and namespace are deployment concerns, not application concerns
- **Enables ApplicationSet discovery**: The Git generator scans for `apps/*/*/config.json`
- **Supports multi-environment deployment**: Same app code, different `config.json` values

## Separation of Concerns

### ArgoCD Layer (Control Plane)

Located in `apps/argocd-apps/manifests/`:
- `apps-appset.yaml` - Production ApplicationSet
- `pr-appset.yaml` - PR environment ApplicationSet

**Responsibilities**:
- Scan Git repository for `config.json` files
- Generate ArgoCD Application resources
- Manage sync policies, health checks, prune behavior
- Handle routing (cluster, namespace) from `config.json`

### Application Layer (Data Plane)

Located in `apps/<grouping>/<app-name>/`:
- Umbrella Helm charts or plain manifests
- Application-specific configuration (values.yaml)
- Environment-specific overrides (values-pr.yaml)

**Responsibilities**:
- Define what to deploy (container images, resources, replicas)
- Configure application behavior (env vars, feature flags)
- Specify resource requirements and limits
- No knowledge of target cluster or namespace

### Example Separation

```
apps/
├── argocd-apps/
│   └── manifests/
│       └── apps-appset.yaml          # Control: "Find all apps and deploy them"
│
└── secrets-proxy/
    ├── onepassword-operator/
    │   ├── Chart.yaml                # Data: "Deploy 1Password operator"
    │   ├── values.yaml               # Data: "Use these settings"
    │   └── config.json               # Routing: "Deploy to vcluster-secrets-proxy/onepassword"
    └── ingress/
        ├── Chart.yaml                # Data: "Deploy ingress resources"
        ├── templates/                # Data: "These are the resources"
        │   ├── ingress-api.yaml
        │   └── ingress-dashboard.yaml
        └── config.json               # Routing: "Deploy to vcluster-secrets-proxy/ingress"
```

## Bootstrap Chain

ArgoCD itself runs inside a vCluster and is bootstrapped in phases:

### Phase 1: Deploy ArgoCD Infrastructure (Parent Cluster)
```bash
helm upgrade --install argocd-vcluster ./apps/argocd-infra/vcluster \
  --namespace argocd-infra --create-namespace
kubectl apply -f apps/argocd-infra/manifests/
```

### Phase 2: Deploy ArgoCD (ArgoCD vCluster)
```bash
vcluster connect argocd -n argocd-infra
kubectl apply -f apps/argocd/manifests/
helm upgrade --install argocd ./apps/argocd/argocd \
  --namespace argocd --create-namespace
vcluster disconnect
```

### Phase 3: ApplicationSets Deploy Everything Else
Once ArgoCD is running, the ApplicationSets in `apps/argocd-apps/manifests/` automatically discover and deploy all other applications.

**Critical Constraint**: The `argocd*` groupings do **not** contain `config.json` files because they are managed by the bootstrap chain, not by ApplicationSets.

## ApplicationSet Generators

### Production ApplicationSet

Scans for `apps/*/*/config.json`, excluding ArgoCD groupings:

```yaml
generators:
  - git:
      files:
        - path: apps/*/*/config.json
      exclude:
        - path: apps/argocd/*/config.json
        - path: apps/argocd-infra/*/config.json
        - path: apps/argocd-apps/*/config.json
```

**Application naming**: `{{index .path.segments 1}}-{{index .path.segments 2}}`
- Example: `apps/secrets-proxy/onepassword-operator/` → `secrets-proxy-onepassword-operator`

### PR ApplicationSet

Uses a **matrix generator** to cross-product open PRs with app directories:

```yaml
generators:
  - matrix:
      generators:
        - pullRequest:            # Generator 1: Open PRs with "deploy-preview" label
            github:
              owner: my-org
              repo: gitops-repo
              labels:
                - deploy-preview
        - git:                    # Generator 2: Apps with PR support
            revision: '{{.head_sha}}'
            files:
              - path: apps/secrets-proxy-infra/*/config.json
              - path: apps/secrets-proxy/*/config.json
```

**Key features**:
- Deploys from PR branch: `targetRevision: '{{.head_sha}}'`
- Layers `values-pr.yaml` over `values.yaml`
- Injects `prNumber` as Helm parameter for unique hostnames
- Auto-cleanup: `preserveResourcesOnDeletion: false`

**Application naming**: `pr-{{.number}}-{{index .path.segments 1}}-{{index .path.segments 2}}`
- Example: PR #42 → `pr-42-secrets-proxy-onepassword-operator`

## Working with This Structure

### Adding a New Application

1. Choose the logical grouping (or create a new one)
2. Create a subdirectory with either:
   - `Chart.yaml` + `values.yaml` (umbrella Helm chart), OR
   - `*.yaml` manifest files (plain manifests)
3. Create `config.json` with target cluster and namespace
4. Commit and push - ApplicationSet automatically creates the Application

### Modifying an Application

- **Change application behavior**: Edit `values.yaml` or manifest files
- **Change deployment target**: Edit `config.json`
- **Add PR support**: Create `values-pr.yaml` with overrides

### PR Environment Support

To enable PR deployments for an app:
1. Create `values-pr.yaml` with lightweight overrides (fewer replicas, smaller storage)
2. Add the app's grouping to the PR ApplicationSet's `git.files` list
3. Open a PR with the `deploy-preview` label

**Helm parameter injection**: Use `{{ .Values.prNumber }}` in templates for unique resources:
```yaml
host: api-pr-{{ .Values.prNumber }}.secrets-proxy.example.com
```

## Important Constraints

| Constraint | Reason |
|------------|--------|
| No `config.json` in `argocd*` directories | Managed by bootstrap chain, not ApplicationSets |
| `Chart.lock` must be committed | ArgoCD requires it to resolve umbrella chart dependencies |
| Plain manifest directories named `manifests/` | Convention for clarity (not enforced) |
| Every PR-enabled app needs `values-pr.yaml` | ArgoCD errors on missing value files (use empty `{}` if no overrides) |

## File Placement Guidelines

- **New application**: `apps/<existing-or-new-grouping>/<app-name>/`
- **Shared manifests for a grouping**: `apps/<grouping>/manifests/`
- **ArgoCD ApplicationSets**: `apps/argocd-apps/manifests/`
- **ArgoCD infrastructure**: `apps/argocd-infra/` (vCluster, Tenant, NetworkPolicy)
- **ArgoCD itself**: `apps/argocd/` (Helm chart, Ingress)

## Common Patterns

### Umbrella Helm Chart Example
```
apps/secrets-proxy/onepassword-operator/
├── Chart.yaml
│   apiVersion: v2
│   name: onepassword-operator
│   version: 1.0.0
│   dependencies:
│     - name: connect
│       version: 2.0.0
│       repository: https://1password.github.io/connect-helm-charts
├── Chart.lock
├── values.yaml         # Production config
├── values-pr.yaml      # PR overrides
└── config.json
    {
      "cluster": "vcluster-secrets-proxy",
      "namespace": "onepassword"
    }
```

### Plain Manifests Example
```
apps/argocd/manifests/
├── ingress.yaml
│   apiVersion: networking.k8s.io/v1
│   kind: Ingress
│   metadata:
│     name: argocd-server
│   spec:
│     ...
└── config.json
    {
      "cluster": "https://kubernetes.default.svc",
      "namespace": "argocd"
    }
```

## Troubleshooting

### Application not appearing in ArgoCD
- Check that `config.json` exists
- Verify the grouping is not in the ApplicationSet's `exclude` list
- Ensure the ApplicationSet is running: `kubectl get applicationset -n argocd`

### Helm chart not syncing
- Verify `Chart.lock` is committed
- Check dependency versions: `helm dependency list ./apps/<grouping>/<app>/`
- Review ArgoCD Application logs: `kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller`

### PR environment not deploying
- Confirm PR has the `deploy-preview` label
- Check that app grouping is in PR ApplicationSet's `git.files` list
- Verify `values-pr.yaml` exists (can be empty `{}`)

---

**Summary**: This directory uses a simple, declarative pattern where ApplicationSets discover applications via `config.json` files and generate Application resources. The applications themselves (Helm charts or manifests) remain unaware of deployment details, enabling easy multi-environment and multi-cluster deployments.
