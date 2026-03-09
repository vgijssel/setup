# Apps Directory Structure

## Convention

Every top-level directory under `apps/` is a logical grouping. Each grouping
contains one or more subdirectories, where each subdirectory is one of two
types:

**Umbrella Helm chart** — contains a `Chart.yaml` declaring an external chart
as a dependency, a `Chart.lock`, and a `values.yaml` with overrides. ArgoCD
auto-detects this as Helm.

```
apps/<grouping>/<name>/
    ├── Chart.yaml
    ├── Chart.lock
    └── values.yaml
```

**Plain Kubernetes manifests** — contains raw YAML files. No `Chart.yaml`
present. ArgoCD auto-detects this as a directory of manifests. By convention,
these directories are named `manifests/`.

```
apps/<grouping>/manifests/
    ├── ingress.yaml
    └── network-policy.yaml
```

Both types are treated identically by the ApplicationSet generators. Each
subdirectory becomes its own ArgoCD Application.

---

## Structure

```
apps/
├── argocd/
│   ├── argocd/                             # Umbrella Helm chart
│   │   ├── Chart.yaml                      # dependency: argo-cd (community chart)
│   │   ├── Chart.lock
│   │   └── values.yaml
│   └── manifests/                          # Plain manifests
│       └── ingress.yaml                    # ArgoCD web UI ingress
│
├── argocd-infra/
│   ├── vcluster/                           # Umbrella Helm chart
│   │   ├── Chart.yaml                      # dependency: vcluster
│   │   ├── Chart.lock
│   │   └── values.yaml                     # vCluster for running ArgoCD
│   └── manifests/                          # Plain manifests
│       ├── tenant-argocd.yaml              # CozyStack Tenant "argocd"
│       └── cilium-network-policy.yaml      # CiliumNetworkPolicy for ArgoCD
│
├── argocd-apps/
│   └── manifests/                          # Plain manifests
│       ├── apps-appset.yaml                # Production ApplicationSet
│       └── pr-appset.yaml                  # Pull Request ApplicationSet
│
├── secrets-proxy-infra/
│   └── vcluster/
│       ├── Chart.yaml
│       ├── Chart.lock
│       ├── values.yaml
│       └── values-pr.yaml
│
├── secrets-proxy/
│   ├── onepassword-operator/
│   │   ├── Chart.yaml
│   │   ├── Chart.lock
│   │   ├── values.yaml
│   │   └── values-pr.yaml
│   ├── secretless-broker/
│   │   ├── Chart.yaml
│   │   ├── Chart.lock
│   │   ├── values.yaml
│   │   └── values-pr.yaml
│   ├── aws-sigv4-proxy/
│   │   ├── Chart.yaml
│   │   ├── Chart.lock
│   │   ├── values.yaml
│   │   └── values-pr.yaml
│   ├── tailscale-operator/
│   │   ├── Chart.yaml
│   │   ├── Chart.lock
│   │   ├── values.yaml
│   │   └── values-pr.yaml
│   └── ingress/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── ingress-api.yaml
│           └── ingress-dashboard.yaml
│
├── docs-sync-infra/
│   └── vcluster/
│       ├── Chart.yaml
│       ├── Chart.lock
│       └── values.yaml
│
└── docs-sync/
    ├── tailscale-operator/
    │   ├── Chart.yaml
    │   ├── Chart.lock
    │   └── values.yaml
    ├── relay-personal/
    │   ├── Chart.yaml
    │   ├── Chart.lock
    │   └── values.yaml
    └── relay-work/
        ├── Chart.yaml
        ├── Chart.lock
        └── values.yaml
```

---

## Bootstrap

ArgoCD runs inside a vCluster. The operator bootstraps by deploying the
infrastructure first (the vCluster and its supporting resources), then
deploying ArgoCD and its manifests into the vCluster.

### Step 1: Deploy ArgoCD infrastructure to parent cluster

Deploy the vCluster and supporting manifests to the parent cluster:

```bash
# Deploy the vCluster umbrella Helm chart
helm upgrade --install argocd-vcluster ./apps/argocd-infra/vcluster \
  --namespace argocd-infra \
  --create-namespace

# Apply plain manifests (Tenant, NetworkPolicy, etc.)
kubectl apply -f apps/argocd-infra/manifests/
```

Wait for the vCluster to be ready:

```bash
kubectl wait --for=condition=ready pod -l app=vcluster \
  -n argocd-infra \
  --timeout=300s
```

### Step 2: Deploy ArgoCD to the vCluster

Once the vCluster is running, deploy ArgoCD into it:

```bash
# Get vCluster kubeconfig
vcluster connect argocd -n argocd-infra

# Apply plain manifests (Ingress, etc.)
kubectl apply -f apps/argocd/manifests/

# Deploy the ArgoCD umbrella Helm chart
helm upgrade --install argocd ./apps/argocd/argocd \
  --namespace argocd \
  --create-namespace

# Disconnect from vCluster
vcluster disconnect
```

### Chain summary

| Phase | What happens | Target cluster |
|---|---|---|
| 1 | Deploy vCluster infrastructure | Parent cluster |
| 2 | Deploy ArgoCD and manifests | ArgoCD vCluster |
| 3 | ApplicationSets discover and deploy apps | Managed by ArgoCD |

---

## ApplicationSets

The two ApplicationSets in `apps/argocd-apps/manifests/` manage all
directories outside the `argocd*` groupings. Each app subdirectory must
contain a `config.json` with routing metadata. The `argocd*` directories do
not use `config.json` — they are managed by the bootstrap chain.

### config.json format

```json
{
  "cluster": "https://kubernetes.default.svc",
  "namespace": "target-namespace"
}
```

Use a registered cluster name for vCluster targets:

```json
{
  "cluster": "vcluster-secrets-proxy",
  "namespace": "onepassword"
}
```

### Production ApplicationSet

Scans every `config.json` under `apps/*/*/`, excluding the three ArgoCD
groupings. Generates one Application per subdirectory.

```yaml
# apps/argocd-apps/manifests/apps-appset.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: apps
  namespace: argocd
spec:
  goTemplate: true
  generators:
    - git:
        repoURL: https://github.com/my-org/gitops-repo.git
        revision: HEAD
        files:
          - path: apps/*/*/config.json
        # Exclude argocd groupings — managed by bootstrap chain
        exclude:
          - path: apps/argocd/*/config.json
          - path: apps/argocd-infra/*/config.json
          - path: apps/argocd-apps/*/config.json
  template:
    metadata:
      name: '{{index .path.segments 1}}-{{index .path.segments 2}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/my-org/gitops-repo.git
        targetRevision: HEAD
        path: '{{.path.path}}'
        helm:
          valueFiles:
            - values.yaml
      destination:
        name: '{{.cluster}}'
        namespace: '{{.namespace}}'
      syncPolicy:
        automated:
          selfHeal: true
        syncOptions:
          - CreateNamespace=true
```

> **Note on exclusion:** The cleanest way to exclude the ArgoCD groupings is
> to simply not place `config.json` files in them. Since the bootstrap chain
> manages those directories through dedicated Application CRDs, no
> `config.json` is needed and the generator naturally skips them.

### Pull Request ApplicationSet

Uses a Matrix generator to cross-product open PRs with app directories that
have PR-specific configuration. The PR number is injected as a Helm parameter
so ingress hosts, vCluster names, and namespaces are unique per PR.

```yaml
# apps/argocd-apps/manifests/pr-appset.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: pr-secrets-proxy
  namespace: argocd
spec:
  goTemplate: true
  generators:
    - matrix:
        generators:
          - pullRequest:
              github:
                owner: my-org
                repo: gitops-repo
                labels:
                  - deploy-preview        # Only PRs with this label
              requeueAfterSeconds: 60

          - git:
              repoURL: https://github.com/my-org/gitops-repo.git
              revision: '{{.head_sha}}'
              files:
                - path: apps/secrets-proxy-infra/*/config.json
                - path: apps/secrets-proxy/*/config.json

  template:
    metadata:
      name: 'pr-{{.number}}-{{index .path.segments 1}}-{{index .path.segments 2}}'
      labels:
        app.kubernetes.io/part-of: 'pr-{{.number}}'
    spec:
      project: pr-environments
      source:
        repoURL: https://github.com/my-org/gitops-repo.git
        targetRevision: '{{.head_sha}}'
        path: '{{.path.path}}'
        helm:
          valueFiles:
            - values.yaml
            - values-pr.yaml
          parameters:
            - name: prNumber
              value: '{{.number}}'
      destination:
        name: >-
          {{- if contains (index .path.segments 1) "infra" -}}
            in-cluster
          {{- else -}}
            vcluster-secrets-proxy-pr-{{.number}}
          {{- end -}}
        namespace: '{{.namespace}}-pr-{{.number}}'
      syncPolicy:
        automated:
          selfHeal: true
          prune: true
        syncOptions:
          - CreateNamespace=true

  preserveResourcesOnDeletion: false
```

The PR ApplicationSet:

- **Deploys from the PR branch** via `targetRevision: '{{.head_sha}}'`, so
  chart and values changes are tested before merge.
- **Layers `values-pr.yaml` on top of `values.yaml`** for lightweight
  overrides (fewer replicas, smaller storage, shorter TTLs).
- **Injects `prNumber` as a Helm parameter** at highest precedence, so
  ingress templates can generate unique hostnames like
  `api-pr-42.secrets-proxy.example.com`.
- **Cleans up automatically** when the PR is closed or merged —
  `preserveResourcesOnDeletion: false` ensures all resources are deleted.
- **Only triggers on labeled PRs** (`deploy-preview`) to avoid spinning up
  environments for documentation or trivial changes.

---

## Ownership map

Every resource is managed by exactly one controller. There is no
double-management.

```
kubectl apply (one-time)
  └── argocd Application (self-managing)
        ├── ArgoCD Helm release
        ├── argocd-manifests Application
        │     └── apps/argocd/manifests/*.yaml
        ├── argocd-infra Application
        │     ├── apps/argocd-infra/vcluster/  (Helm)
        │     └── apps/argocd-infra/manifests/*.yaml
        └── argocd-apps Application
              └── apps/argocd-apps/manifests/*.yaml
                    ├── apps-appset (Production ApplicationSet)
                    │     ├── secrets-proxy-infra-vcluster
                    │     ├── secrets-proxy-onepassword-operator
                    │     ├── secrets-proxy-secretless-broker
                    │     ├── secrets-proxy-aws-sigv4-proxy
                    │     ├── secrets-proxy-tailscale-operator
                    │     ├── secrets-proxy-ingress
                    │     ├── docs-sync-infra-vcluster
                    │     ├── docs-sync-tailscale-operator
                    │     ├── docs-sync-relay-personal
                    │     └── docs-sync-relay-work
                    └── pr-appset (PR ApplicationSet)
                          ├── pr-42-secrets-proxy-infra-vcluster
                          ├── pr-42-secrets-proxy-onepassword-operator
                          └── ...
```

---

## Constraints

| Rule | Reason |
|---|---|
| No `resources-finalizer` on the self-managing Application | Controller deletes itself while processing the finalizer — permanent deadlock |
| `ServerSideApply=true` on the self-managing Application | Client-side apply annotation can exceed 262KB limit |
| No `config.json` in `argocd*` directories | Managed by bootstrap chain, not ApplicationSets |
| `Chart.lock` must be committed | ArgoCD requires it to resolve umbrella chart dependencies |
| Every Helm directory participating in PR environments needs `values-pr.yaml` | ArgoCD errors on missing value files — use an empty `{}` if no overrides needed |
| Plain manifest directories are named `manifests/` | Convention only — keeps intent clear when scanning the repo |
