<context>
# Overview

Deploy the secrets-proxy infrastructure (1Password operator, secrets, and docs-sync-b2-proxy) into a dedicated vCluster within the CozyStack Enigma cluster. This follows the established pattern used by ArgoCD, where infrastructure runs in an isolated vCluster managed by a CozyStack tenant.

Currently, the secrets infrastructure in `apps/secrets` uses FluxCD HelmReleases with kubeconfig placeholders. This PRD defines migrating to ArgoCD Applications with local Helm charts, deployed into a dedicated `secrets-proxy` vCluster for better isolation and consistency with the ArgoCD deployment pattern.

**Development Branch**: During development, all ArgoCD Applications will use `targetRevision: mg/feat/deploy-secrets-proxy` to enable immediate testing. This will be changed to `HEAD` or a release tag for production.

## Cluster Architecture

This deployment involves **three distinct Kubernetes clusters**:

| Cluster | Description | Namespace on Host | ArgoCD Destination |
|---------|-------------|-------------------|-------------------|
| **Enigma** | Host management cluster running Talos/CozyStack | N/A (root) | `enigma` |
| **ArgoCD vCluster** | vCluster running ArgoCD instance | `tenant-prod-argocd` | N/A (ArgoCD runs here) |
| **secrets-proxy vCluster** | vCluster running secrets-proxy workloads | `tenant-prod-secretsproxy` | `secrets-proxy` |

- ArgoCD runs inside the **ArgoCD vCluster** and manages applications across all three clusters
- The **Enigma** cluster is the host for both vClusters
- The **secrets-proxy vCluster** is where 1Password operator, secrets, and docs-sync-b2-proxy run

# Core Features

## 1. CozyStack Tenant for Secrets Proxy
- **What it does**: Creates a `secrets-proxy` tenant in CozyStack as a sibling of `tenant-prod`, similar to the `argocd` tenant
- **Why it's important**: Provides namespace isolation and resource management for the secrets-proxy infrastructure
- **How it works**: Tenant resource deployed to `tenant-prod` namespace in the Enigma cluster, creating `tenant-prod-secretsproxy` namespace

## 2. vCluster Deployment
- **What it does**: Deploys a vCluster instance for running the secrets-proxy workloads
- **Why it's important**: Provides Kubernetes-level isolation, allowing the secrets infrastructure to run independently
- **How it works**: ArgoCD Application using the vcluster chart from `third_party/vendir/charts/vcluster`

## 3. 1Password Credential Synchronization
- **What it does**: Copies 1Password credentials and operator token from the host Enigma cluster to the vCluster
- **Why it's important**: The 1Password operator inside the vCluster needs credentials to connect to 1Password Connect
- **How it works**: Secrets stored in `tenant-prod-secretsproxy` namespace on host cluster are synced to the vCluster

## 4. Secrets Proxy Applications
- **What it does**: Deploys 1Password operator, 1Password secrets, and docs-sync-b2-proxy into the vCluster
- **Why it's important**: Provides centralized secret management for applications needing 1Password and S3 access
- **How it works**: ArgoCD Applications using local Helm charts from `libs/` directory

# User Experience

## User Personas
- **Platform Engineers**: Configure and maintain the secrets-proxy infrastructure
- **Application Developers**: Consume secrets provided by the secrets-proxy infrastructure

## Key User Flows
1. **Initial Deployment**: ArgoCD syncs `apps/secrets-proxy-infra` to create tenant and vCluster, then syncs `apps/secrets-proxy` to deploy secret management applications
2. **Secret Consumption**: Applications reference secrets managed by the 1Password operator running in the vCluster
3. **Validation**: Platform engineers use ArgoCD CLI to verify sync status and application health

## UI/UX Considerations
- ArgoCD UI provides visibility into deployment status
- All resources follow consistent naming conventions (`secrets-proxy` prefix)
</context>

<PRD>
# Technical Architecture

## System Components

### apps/secrets-proxy-infra (deployed to Enigma management cluster)
Directory structure:
```
apps/secrets-proxy-infra/
├── kustomization.yaml                                    # Resource orchestration
├── tenant-secrets-proxy.yaml                             # CozyStack tenant definition
├── application-secrets-proxy-infra.yaml                  # Self-managing ArgoCD Application (targets Enigma)
├── application-secrets-proxy.yaml                        # Application for secrets-proxy (targets secrets-proxy vCluster)
├── application-vcluster.yaml                             # ArgoCD Application for vCluster deployment
├── clusterpolicy-argocd-cluster-registration.yaml        # Kyverno policy for automatic ArgoCD cluster registration
├── ciliumnetworkpolicy-allow-to-root-ingress.yaml        # Network policy workaround
└── moon.yml                                              # Moon project metadata
```

### apps/secrets-proxy (deployed to secrets-proxy vCluster)
Directory structure:
```
apps/secrets-proxy/
├── kustomization.yaml                      # Root Kustomization resource
├── namespace-secrets.yaml                  # Creates secrets namespace
├── application-1password-operator.yaml     # ArgoCD Application for 1Password operator
├── application-1password-secrets.yaml      # ArgoCD Application for 1Password secrets
├── application-docs-sync-b2-proxy.yaml     # ArgoCD Application for docs-sync-b2-proxy
└── moon.yml                                # Moon project metadata
```

**Note**: The `apps/secrets-proxy-infra` app is self-managing and also manages the `apps/secrets-proxy` app. This follows the pattern where infrastructure apps manage their dependent workload apps.

### Host Cluster Secrets (tenant-prod-secretsproxy namespace)
Required secrets to be created manually or via bootstrap:
- `1password-credentials` - 1Password Connect credentials JSON
- `1password-operator-token` - 1Password operator authentication token

### vCluster Secret Synchronization
The vCluster will be configured to sync secrets from the host cluster:
- Source namespace: `tenant-prod-secretsproxy`
- Target namespace in vCluster: `default` (where 1Password operator runs)
- Secrets to sync: `1password-credentials`, `1password-operator-token`

## Data Models

### Tenant Resource (tenant-secrets-proxy.yaml)
```yaml
apiVersion: cozystack.io/v1alpha1
kind: Tenant
metadata:
  name: secrets-proxy
  namespace: tenant-prod
spec:
  features:
    etcd: false
    ingress: false
    monitoring: false
    seaweedfs: false
```

### vCluster Configuration
- Chart: `third_party/vendir/charts/vcluster` (v0.32.1)
- Namespace: `tenant-prod-secretsproxy`
- HA Configuration: 3 control plane replicas, 3 etcd replicas
- Sync configuration:
  - Services, endpoints, configmaps, secrets, pods: enabled
  - Ingresses: enabled (sync to host)
  - **docs-sync-b2-proxy service**: synced to host cluster for external access
- Secret sync from host: enabled for 1Password credentials

### Service Sync to Host (docs-sync-b2-proxy)
The `docs-sync-b2-proxy` service running inside the vCluster must be accessible from the host cluster. vCluster's service sync will expose the service in the `tenant-prod-secretsproxy` namespace on the host, allowing other workloads to access the Backblaze S3 proxy.

### Automatic ArgoCD Cluster Registration (Kyverno Policy)
The secrets-proxy vCluster must be registered as a destination in ArgoCD (which runs in the ArgoCD vCluster). This is automated using a Kyverno ClusterPolicy that:

1. **Watches**: vCluster kubeconfig secrets in `tenant-prod-secretsproxy` namespace (secret name: `vc-secrets-proxy`)
2. **Generates**: ArgoCD cluster secret in `tenant-prod-argocd` namespace (where ArgoCD vCluster syncs secrets from)
3. **Transforms**: vCluster kubeconfig format to ArgoCD cluster secret format

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: register-secrets-proxy-vcluster-to-argocd
spec:
  generateExisting: true
  rules:
    - name: generate-argocd-cluster-secret
      match:
        any:
          - resources:
              kinds: [Secret]
              names: ["vc-secrets-proxy"]
              namespaces: ["tenant-prod-secretsproxy"]
      generate:
        synchronize: true
        apiVersion: v1
        kind: Secret
        name: cluster-secrets-proxy
        namespace: tenant-prod-argocd
        data:
          metadata:
            labels:
              argocd.argoproj.io/secret-type: cluster
          stringData:
            name: secrets-proxy
            server: "https://vc-secrets-proxy.tenant-prod-secretsproxy.svc.cluster.local:443"
            config: |
              {
                "tlsClientConfig": {
                  "insecure": false,
                  "caData": "{{ base64_encode(request.object.data.\"certificate-authority\") }}",
                  "certData": "{{ base64_encode(request.object.data.\"client-certificate\") }}",
                  "keyData": "{{ base64_encode(request.object.data.\"client-key\") }}"
                }
              }
```

The ArgoCD vCluster's `fromHost` sync configuration will then sync this secret into the ArgoCD namespace inside the vCluster, making the `secrets-proxy` destination available.

### ArgoCD Application Patterns

**Pattern 1: Applications deployed to Enigma management cluster**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: secrets-proxy-infra
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/vgijssel/setup
    targetRevision: mg/feat/deploy-secrets-proxy  # Development branch
    path: apps/secrets-proxy-infra
  destination:
    name: enigma  # Enigma management cluster
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

**Pattern 2: Applications deployed to secrets-proxy vCluster**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: <app-name>
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/vgijssel/setup
    targetRevision: mg/feat/deploy-secrets-proxy  # Development branch
    path: libs/<chart-name>
    helm:
      values: |
        # Chart-specific values
  destination:
    name: secrets-proxy  # secrets-proxy vCluster (auto-registered via Kyverno)
    namespace: <target-namespace>
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

**Note**: All ArgoCD Applications use local Helm charts from the repository via the `path` parameter pointing to `libs/<chart-name>`. No external Helm repositories or FluxCD resources are used. The `secrets-proxy` destination is automatically registered via Kyverno policy when the vCluster is created.

## APIs and Integrations

### ArgoCD Integration
- `apps/secrets-proxy-infra` is self-managing and targets the **Enigma management cluster** (`destination.name: enigma`)
- `apps/secrets-proxy-infra` also manages `apps/secrets-proxy` targeting the **secrets-proxy vCluster** (`destination.name: secrets-proxy`)
- ArgoCD runs inside the **ArgoCD vCluster** (`tenant-prod-argocd`)
- ArgoCD destination `secrets-proxy` is automatically registered via Kyverno policy when vCluster is created

### Kyverno Integration
- ClusterPolicy watches vCluster kubeconfig secret creation in `tenant-prod-secretsproxy`
- Generates ArgoCD cluster secret in `tenant-prod-argocd` namespace
- ArgoCD vCluster syncs this secret via `fromHost` configuration, making destination available

### 1Password Integration
- Uses existing `libs/1password-secrets` Helm chart
- OnePasswordItem CRDs created for required secrets
- Secrets distributed to designated namespaces

### Local Helm Charts (ArgoCD Only)
- All deployments use ArgoCD Applications with local Helm charts
- Charts referenced via repository path (e.g., `libs/aws-sigv4-proxy`, `third_party/vendir/charts/vcluster`)
- No FluxCD GitRepository or HelmRelease resources are used
- ArgoCD handles chart fetching directly from the Git repository

## Infrastructure Requirements

### Enigma Cluster
- CozyStack installed and operational
- `tenant-prod` namespace exists
- ArgoCD destination `enigma` configured

### 1Password
- 1Password Connect server accessible
- Credentials and token available for bootstrap

### Git Repository
- GitHub repository `vgijssel/setup` accessible
- Branch containing the secrets-proxy apps

# Development Roadmap

## Phase 1: Infrastructure Foundation (apps/secrets-proxy-infra)

### 1.1 Create apps/secrets-proxy-infra directory structure
- Create `apps/secrets-proxy-infra/` directory
- Add `moon.yml` with project metadata (type: application, language: yaml)
- Add `kustomization.yaml` orchestrating resources

### 1.2 Create CozyStack tenant
- Create `tenant-secrets-proxy.yaml` defining the secrets-proxy tenant
- Tenant created in `tenant-prod` namespace
- All features disabled (etcd, ingress, monitoring, seaweedfs)

### 1.3 Create vCluster ArgoCD Application
- Create `application-vcluster.yaml` using ArgoCD Application with local Helm chart
- Source: `third_party/vendir/charts/vcluster` path in setup repository
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `enigma` (Enigma management cluster)
- Configure HA mode (3 control plane, 3 etcd replicas)
- Configure secret sync from host namespace for 1Password credentials
- Enable resource sync (services, endpoints, configmaps, secrets, pods)
- Configure service sync to host for `docs-sync-b2-proxy` service
- Add labels for Cozystack API server access policy
- vCluster release name: `secrets-proxy` (creates kubeconfig secret `vc-secrets-proxy`)

### 1.4 Create Kyverno policy for automatic ArgoCD cluster registration
- Create `clusterpolicy-argocd-cluster-registration.yaml`
- Watch for `vc-secrets-proxy` secret in `tenant-prod-secretsproxy` namespace
- Generate ArgoCD cluster secret `cluster-secrets-proxy` in `tenant-prod-argocd` namespace
- Transform vCluster kubeconfig to ArgoCD cluster secret format
- ArgoCD vCluster will sync this secret via `fromHost` configuration

### 1.5 Create network policy
- Create `ciliumnetworkpolicy-allow-to-root-ingress.yaml`
- Allow egress to tenant-root ingress services (workaround for Cozystack nested tenant issue)

### 1.6 Create self-managing ArgoCD Application
- Create `application-secrets-proxy-infra.yaml`
- Source: `apps/secrets-proxy-infra` path in setup repository
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `enigma` (Enigma management cluster)
- Automated sync with prune and selfHeal

### 1.7 Create ArgoCD Application for secrets-proxy
- Create `application-secrets-proxy.yaml`
- Source: `apps/secrets-proxy` path in setup repository
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `secrets-proxy` (secrets-proxy vCluster, auto-registered via Kyverno)
- Automated sync with prune and selfHeal

## Phase 2: Secrets Proxy Applications (apps/secrets-proxy)

### 2.1 Create apps/secrets-proxy directory structure
- Create `apps/secrets-proxy/` directory
- Add `moon.yml` with project metadata
- Add `kustomization.yaml` orchestrating resources

### 2.2 Create namespace resource
- Create `namespace-secrets.yaml` for the secrets namespace
- This namespace will hold the docs-sync-b2-proxy and generated secrets

### 2.3 Create ArgoCD Application for 1Password operator
- Create `application-1password-operator.yaml`
- Source: `third_party/vendir/charts/1password-connect` (local Helm chart path)
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `secrets-proxy` vCluster, default namespace
- Configure operator to watch all namespaces
- Reference 1Password credentials secrets

### 2.4 Create ArgoCD Application for 1Password secrets
- Create `application-1password-secrets.yaml`
- Source: `libs/1password-secrets` chart (local Helm chart path)
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `secrets-proxy` vCluster, default namespace
- Depends on 1Password operator application (using ArgoCD sync waves)
- Configure secrets to generate (e.g., backblaze-s3-docs-infra-prod)

### 2.5 Create ArgoCD Application for docs-sync-b2-proxy
- Create `application-docs-sync-b2-proxy.yaml`
- Source: `libs/aws-sigv4-proxy` chart (local Helm chart path)
- Target revision: `mg/feat/deploy-secrets-proxy` (development branch)
- Destination: `secrets-proxy` vCluster, secrets namespace
- Depends on 1Password secrets application (using ArgoCD sync waves)
- Configure for Backblaze S3 endpoint
- Service will be synced to host Enigma cluster via vCluster service sync

## Phase 3: Bootstrap and Validation

### 3.1 Create bootstrap script for 1Password credentials
- Create script to populate 1Password secrets in `tenant-prod-secretsproxy` namespace on Enigma cluster
- Use `libs/1password-operator-bootstrap/bootstrap.sh` as reference
- Document manual bootstrap steps

### 3.2 Create initial commit and push
- Commit all changes to feature branch (`mg/feat/deploy-secrets-proxy`)
- Push to remote repository

### 3.3 Validate ArgoCD sync for infrastructure
- Use `argocd app sync secrets-proxy-infra` to deploy infrastructure
- Verify tenant creation in `tenant-prod` namespace
- Verify vCluster deployment in `tenant-prod-secretsproxy` namespace
- Verify Kyverno policy created ArgoCD cluster secret in `tenant-prod-argocd` namespace
- Verify `secrets-proxy` destination appears in ArgoCD (`argocd cluster list`)

### 3.4 Validate ArgoCD sync for secrets-proxy applications
- Use `argocd app sync secrets-proxy` to deploy applications to secrets-proxy vCluster
- Verify 1Password operator deployment
- Verify 1Password secrets generation
- Verify docs-sync-b2-proxy deployment

### 3.5 Verify end-to-end functionality
- Confirm OnePasswordItem resources are created in secrets-proxy vCluster
- Verify secrets are synced to target namespaces
- Verify docs-sync-b2-proxy service is synced to `tenant-prod-secretsproxy` namespace on Enigma cluster
- Test docs-sync-b2-proxy connectivity from Enigma cluster

## Phase 4: Helm Chart Adaptations (if needed)

### 4.1 Evaluate existing Helm charts for ArgoCD compatibility
- Review `libs/1password-secrets` chart for ArgoCD Application usage
- Review `libs/aws-sigv4-proxy` chart for ArgoCD Application usage
- Review `third_party/vendir/charts/1password-connect` for direct use
- Identify any required changes (remove FluxCD-specific placeholders like `${FLUX_NAMESPACE}`)

### 4.2 Update production targetRevision
- Once validated on development branch, update all ArgoCD Applications
- Change `targetRevision` from `mg/feat/deploy-secrets-proxy` to `HEAD` or release tag
- Test sync and validate all applications still work correctly

# Logical Dependency Chain

## Foundation Layer (deployed to Enigma management cluster)
1. **apps/secrets-proxy-infra directory structure** - Base directory and project files
2. **CozyStack tenant** - Creates the `tenant-prod-secretsproxy` namespace on Enigma
3. **Kyverno ClusterPolicy** - Enables automatic ArgoCD cluster registration

## Infrastructure Layer (deployed to Enigma management cluster)
4. **vCluster ArgoCD Application** - Deploys vCluster into `tenant-prod-secretsproxy` namespace
5. **Kyverno generates ArgoCD cluster secret** - Automatic, triggered by vCluster kubeconfig secret creation
6. **ArgoCD vCluster syncs cluster secret** - Automatic via `fromHost` configuration, `secrets-proxy` destination becomes available
7. **Network policy** - Allows vCluster to reach ingress services
8. **Bootstrap 1Password secrets** - Manual step to populate credentials in `tenant-prod-secretsproxy` namespace

## Application Layer (deployed to secrets-proxy vCluster)
9. **apps/secrets-proxy directory structure** - Base directory for vCluster applications
10. **Namespace resource** - Creates secrets namespace inside secrets-proxy vCluster
11. **secrets-proxy-infra manages secrets-proxy** - ArgoCD Application in infra deploys secrets-proxy app

## Service Layer (deployed to secrets-proxy vCluster)
12. **1Password operator Application** - Deploys operator (depends on credentials sync from host)
13. **1Password secrets Application** - Creates OnePasswordItem CRDs (depends on operator)
14. **docs-sync-b2-proxy Application** - Deploys proxy (depends on secrets), service synced to Enigma host

## Validation
15. **ArgoCD sync validation** - Verify all applications are synced and healthy in ArgoCD UI
16. **Secret generation validation** - Verify secrets are created correctly in secrets-proxy vCluster
17. **Service sync validation** - Verify docs-sync-b2-proxy service appears in `tenant-prod-secretsproxy` namespace on Enigma

# Risks and Mitigations

## Technical Challenges

### vCluster Secret Synchronization
- **Risk**: Secret sync from host cluster may not work as expected
- **Mitigation**: vCluster has built-in secret sync capabilities; test with minimal secrets first
- **Alternative**: Use init container or external-secrets operator if native sync fails

### ArgoCD Application with Local Helm Charts
- **Risk**: Existing charts may have FluxCD-specific placeholders (e.g., `${FLUX_NAMESPACE}`)
- **Mitigation**: ArgoCD supports Helm chart sources with values override; remove or replace placeholders
- **Alternative**: Create ArgoCD-specific value files or use Helm post-renderer

### 1Password Credentials Bootstrap
- **Risk**: Manual bootstrap step could be forgotten or misconfigured
- **Mitigation**: Clear documentation and validation steps; consider automation script

### Nested Tenant Network Policy
- **Risk**: Cozystack bug #1970 may affect secrets-proxy tenant
- **Mitigation**: Apply same network policy workaround used for argocd tenant

### Service Sync to Host
- **Risk**: docs-sync-b2-proxy service may not sync correctly to Enigma host cluster
- **Mitigation**: vCluster service sync is well-documented; verify service appears in `tenant-prod-secretsproxy` namespace
- **Alternative**: Use vCluster expose feature or create manual service in host namespace

### Kyverno Automatic ArgoCD Registration
- **Risk**: Kyverno policy may not correctly transform vCluster kubeconfig to ArgoCD cluster secret format
- **Mitigation**: Test policy with existing argocd-infra vCluster first; verify secret format matches ArgoCD requirements
- **Alternative**: Fall back to manual cluster registration using `argocd cluster add` command

### Cross-vCluster Secret Sync
- **Risk**: ArgoCD vCluster may not sync the generated cluster secret via `fromHost` configuration
- **Mitigation**: Verify ArgoCD vCluster's `fromHost.secrets` configuration includes the correct namespace/secret patterns
- **Alternative**: Manually create ArgoCD cluster secret inside ArgoCD vCluster

## MVP Definition
The MVP includes:
- Functional vCluster with secrets-proxy tenant
- 1Password operator running and healthy
- At least one secret successfully generated
- docs-sync-b2-proxy deployed and serving requests
- docs-sync-b2-proxy service accessible from host cluster (via vCluster service sync)

Non-MVP items (can be added later):
- Additional secrets beyond the MVP set
- Monitoring and alerting integration
- Backup and disaster recovery

## Resource Constraints
- vCluster requires compute resources (3 control plane + 3 etcd pods)
- 1Password operator requires memory for watching namespaces
- docs-sync-b2-proxy is lightweight (minimal resources)

# Appendix

## Reference Files
- `apps/argocd/` - Reference implementation for ArgoCD Applications pattern
- `apps/argocd-infra/` - Reference implementation for tenant and vCluster setup
- `apps/argocd-infra/helmrelease-vcluster.yaml` - vCluster configuration reference
- `apps/secrets/` - Current secrets infrastructure (source for migration)
- `apps/enigma-cluster/clusterpolicy-multus-memory.yaml` - Kyverno ClusterPolicy example
- `libs/internal-networking/templates/clusterpolicy-gateway-ingress.yaml` - Kyverno generate policy example
- `libs/1password-secrets/` - Helm chart for OnePasswordItem generation
- `libs/aws-sigv4-proxy/` - Helm chart for docs-sync-b2-proxy
- `libs/1password-operator-bootstrap/bootstrap.sh` - Bootstrap script reference

## ArgoCD CLI Commands for Validation
```bash
# Sync secrets-proxy-infra (deploys to Enigma management cluster)
argocd app sync secrets-proxy-infra

# Check sync status
argocd app get secrets-proxy-infra
argocd app get secrets-proxy

# List all applications
argocd app list

# Verify secrets-proxy vCluster is registered (should be automatic via Kyverno)
argocd cluster list

# If manual registration is needed (fallback)
# argocd cluster add secrets-proxy --kubeconfig <path-to-vcluster-kubeconfig>
```

## Kyverno ClusterPolicy for ArgoCD Registration
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: register-secrets-proxy-vcluster-to-argocd
  annotations:
    policies.kyverno.io/description: >-
      Automatically registers the secrets-proxy vCluster as an ArgoCD destination
      by transforming the vCluster kubeconfig secret into an ArgoCD cluster secret.
spec:
  generateExisting: true
  rules:
    - name: generate-argocd-cluster-secret
      match:
        any:
          - resources:
              kinds:
                - Secret
              names:
                - "vc-secrets-proxy"
              namespaces:
                - "tenant-prod-secretsproxy"
      generate:
        synchronize: true
        apiVersion: v1
        kind: Secret
        name: cluster-secrets-proxy
        namespace: tenant-prod-argocd  # ArgoCD vCluster syncs from this namespace
        data:
          metadata:
            labels:
              argocd.argoproj.io/secret-type: cluster
          stringData:
            name: secrets-proxy
            server: "https://vc-secrets-proxy.tenant-prod-secretsproxy.svc.cluster.local:443"
            config: |
              {
                "tlsClientConfig": {
                  "insecure": false,
                  "caData": "{{ request.object.data.\"certificate-authority\" }}",
                  "certData": "{{ request.object.data.\"client-certificate\" }}",
                  "keyData": "{{ request.object.data.\"client-key\" }}"
                }
              }
```

**How it works:**
1. vCluster creates kubeconfig secret `vc-secrets-proxy` in `tenant-prod-secretsproxy` namespace
2. Kyverno policy watches for this secret and generates ArgoCD cluster secret in `tenant-prod-argocd` namespace
3. ArgoCD vCluster's `fromHost.secrets` configuration syncs this secret into the vCluster
4. ArgoCD discovers the new cluster destination `secrets-proxy`

## vCluster Sync Configuration
```yaml
sync:
  toHost:
    secrets:
      enabled: true
    services:
      enabled: true
      # docs-sync-b2-proxy service will be synced to host cluster
      # allowing external workloads to access the Backblaze S3 proxy
  fromHost:
    secrets:
      mappings:
        - from:
            namespace: tenant-prod-secretsproxy
            name: 1password-credentials
          to:
            namespace: default
            name: 1password-credentials
        - from:
            namespace: tenant-prod-secretsproxy
            name: 1password-operator-token
          to:
            namespace: default
            name: 1password-operator-token
```

**Note**: The `docs-sync-b2-proxy` service in the `secrets` namespace inside the secrets-proxy vCluster will be synced to the Enigma host cluster's `tenant-prod-secretsproxy` namespace, making it accessible to other workloads.

## ArgoCD vCluster Configuration Update
The ArgoCD vCluster (`apps/argocd-infra/helmrelease-vcluster.yaml`) needs `fromHost.secrets` configuration to sync the auto-generated cluster secret:

```yaml
sync:
  fromHost:
    secrets:
      mappings:
        - from:
            namespace: tenant-prod-argocd
            name: cluster-secrets-proxy
          to:
            namespace: argocd
            name: cluster-secrets-proxy
```

**Note**: This configuration may already exist or need to be added to enable automatic cluster registration.

## 1Password Bootstrap Commands
```bash
# Navigate to bootstrap script
cd libs/1password-operator-bootstrap

# Run bootstrap for secrets-proxy namespace
./bootstrap.sh tenant-prod-secretsproxy
```
</PRD>
