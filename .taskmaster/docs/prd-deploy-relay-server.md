<context>
# Overview
Deploy the No-Instructions Relay server (https://github.com/No-Instructions/Relay) into the existing virtual Kubernetes cluster "cluster-docs-infra-prod" running on the enigma-cluster (tenant-root cozystack). The Relay server enables real-time collaborative document editing for Obsidian users by providing a self-hosted relay backend with S3-compatible attachment storage.

The setup mirrors the pattern used by apps/coder-prod: FluxCD manages resources inside the virtual cluster, while the enigma-cluster hosts the ingress that routes external traffic into the virtual cluster via a mirrored LoadBalancer service (KubeVirt CCM).

# Core Features

## FluxCD-Managed Deployment in Virtual Cluster
- What: Deploy all Relay server resources into "cluster-docs-infra-prod" using FluxCD GitRepository + Kustomization pattern
- Why: Consistent GitOps approach matching the rest of the infrastructure; enables declarative, auditable deployments
- How: Create apps/docs-prod (deploys into virtual cluster) and apps/docs-infra-prod (deploys into enigma-cluster) mirroring the coder-prod / coder-cluster-prod split

## Relay Helm Chart via Vendir
- What: Add the Relay Helm chart (https://github.com/No-Instructions/Relay) to third_party/vendir with a pinned version
- Why: All external dependencies must be pinned to specific versions per project policy
- How: Add a helmChart entry to third_party/vendir/vendir.yml pointing to the Relay chart repository with an exact version; run vendir sync

## 1Password Operator for Secret Management
- What: Deploy the 1Password operator inside cluster-docs-infra-prod to manage secrets (S3 credentials, relay auth keys)
- Why: Consistent secret management approach matching coder-prod
- How: HelmRelease using the existing third_party/vendir/charts/1password-connect chart; 1Password items to be created for S3 credentials

## Relay Server Deployment
- What: Deploy the Relay server as a Kubernetes Deployment with a LoadBalancer Service inside cluster-docs-infra-prod
- Why: LoadBalancer type in a kamaji virtual cluster triggers KubeVirt CCM to mirror a Service in the enigma-cluster, enabling enigma-cluster ingress to route traffic to virtual cluster pods
- How: HelmRelease for the Relay chart with values configured for S3 storage (bucket: s3-docs-infra-prod) and LoadBalancer service type

## S3 Storage Integration
- What: Configure Relay to use the existing s3-docs-infra-prod S3 bucket on the enigma-cluster/cozystack
- Why: Persistent attachment storage for Relay documents
- How: Configure relay.toml values via Helm: store.type = "s3", bucket = "s3-docs-infra-prod"; S3 credentials injected from 1Password secrets

## Enigma-Cluster Ingress
- What: Create an Ingress resource in the enigma-cluster (tenant-root namespace) routing relay.enigma.vgijssel.nl to the mirrored LoadBalancer service
- Why: KubeVirt CCM mirrors the virtual cluster LoadBalancer as a Service in enigma-cluster; an Ingress on enigma-cluster routes external HTTPS traffic to it
- How: Similar to apps/coder-cluster-prod/ingress-coder.yaml — find the auto-generated service name from the mirrored LoadBalancer and create an Ingress with cert-manager TLS

# User Experience

## Operator Persona
The operator is the infrastructure engineer who bootstraps and manages the deployment. They:
1. Run the bootstrap task to apply the FluxCD kustomization into enigma-cluster
2. Create the 1Password secret with S3 credentials and relay auth keys
3. Verify the ingress and LoadBalancer mirroring are working
4. Confirm relay.enigma.vgijssel.nl is accessible and relay server is healthy

## End-User Persona
Obsidian users configure their Relay plugin to point to relay.enigma.vgijssel.nl. They experience seamless real-time collaborative editing without manual infrastructure interaction.

## Key Operator Flows
1. Bootstrap: `moon run docs-prod:bootstrap` applies kustomization into enigma-cluster pointing to cluster-docs-infra-prod
2. Secret creation: `moon run docs-prod:create-1password-secret` provisions 1Password credentials into the virtual cluster
3. Verification: Check FluxCD Kustomization reconciliation, LoadBalancer service in enigma-cluster, and ingress TLS

# Technical Architecture

## System Components

### enigma-cluster (cozystack tenant-root)
- **GitRepository** (flux-system): Points to github.com/vgijssel/setup, branch mg/feat/deploy-relay-server (development) / main (production)
- **Kustomization** (flux-system): Reconciles apps/docs-prod into cluster-docs-infra-prod via the virtual cluster kubeconfig
- **Mirrored LoadBalancer Service**: Auto-created by KubeVirt CCM when virtual cluster Service type=LoadBalancer is created; named with a hash similar to the coder example (e.g., a18c2be1...)
- **Ingress** (tenant-root namespace): Routes relay.enigma.vgijssel.nl → mirrored LoadBalancer service, with cert-manager TLS (letsencrypt-prod)
- **S3 Bucket**: s3-docs-infra-prod (pre-existing cozystack managed bucket)

### cluster-docs-infra-prod (virtual kubernetes cluster / kamaji)
- **Namespace**: relay (application namespace), flux-system (FluxCD), 1password (operator)
- **FluxCD**: Manages HelmReleases within virtual cluster
- **1Password Operator**: Manages secrets synced from 1Password vault
- **Relay HelmRelease**: Deploys relay server pods with S3 configuration
- **Service type: LoadBalancer**: Triggers KubeVirt CCM mirroring into enigma-cluster

## Directory Structure
```
apps/
  relay-prod/               # Deploys into cluster-docs-infra-prod via FluxCD
    moon.yml                # bootstrap + create-1password-secret tasks
    kustomization.yaml      # Resource ordering for kubectl apply
    kustomization-root.yaml # FluxCD Kustomization pointing to apps/docs-prod
    gitrepository-setup.yaml # FluxCD GitRepository
    namespace-relay.yaml
    namespace-flux-system.yaml
    namespace-1password.yaml
    helmrelease-1password-operator.yaml
    helmrelease-1password-secrets.yaml
    helmrelease-relay.yaml
    kubeconfig.yaml.op.tpl  # 1Password template for virtual cluster kubeconfig

  relay-cluster-prod/       # Deploys into enigma-cluster (tenant-root)
    kustomization.yaml
    kustomization-root.yaml
    gitrepository-setup.yaml
    ingress-relay.yaml      # Ingress: relay.enigma.vgijssel.nl → mirrored LB

third_party/vendir/
  vendir.yml                # Add relay helm chart entry
```

## Data Models / Configuration

### relay.toml (via Helm values)
```toml
[server]
url = "https://relay.enigma.vgijssel.nl"
host = "0.0.0.0"
port = 8080

[store]
type = "s3"
bucket = "s3-docs-infra-prod"
region = "<cozystack-s3-region>"
endpoint = "<cozystack-s3-endpoint>"
# credentials from environment / secret

[auth]
# relay public keys for authentication
```

### 1Password Items Required
- `relay-s3-credentials`: S3 access key, secret key, endpoint for s3-docs-infra-prod bucket
- `1password-operator-token`: 1Password Connect token (existing pattern)
- `1password-credentials`: 1Password Connect credentials JSON (existing pattern)

## Infrastructure Requirements
- enigma-cluster with KubeVirt CCM (pre-existing)
- Virtual cluster "cluster-docs-infra-prod" with kubeconfig stored as a secret in enigma-cluster
- S3 bucket "s3-docs-infra-prod" (pre-existing cozystack resource)
- cert-manager with letsencrypt-prod ClusterIssuer in enigma-cluster
- 1Password Connect server accessible from cluster-docs-infra-prod

## Kubeconfig Access Pattern
The virtual cluster kubeconfig is stored as a secret in enigma-cluster. The bootstrap task extracts this kubeconfig (using 1Password template kubeconfig.yaml.op.tpl) and uses it to apply the FluxCD kustomization-root.yaml into the virtual cluster's flux-system, exactly as in apps/coder-prod.

# Development Roadmap

## Phase 1: Foundation — Vendir & Chart Management
- Add Relay helm chart to third_party/vendir/vendir.yml with pinned version
- Determine the correct chart name, repository URL, and version from https://github.com/No-Instructions/Relay
- Run `vendir sync` and verify chart is downloaded
- Update vendir.lock.yml

## Phase 2: Virtual Cluster App (apps/docs-prod)
- Create apps/docs-prod directory with all FluxCD manifests
- moon.yml with bootstrap and create-1password-secret tasks (mirror coder-prod pattern)
- kustomization.yaml with correct resource ordering
- gitrepository-setup.yaml pointing to setup repo (branch: main for production)
- kustomization-root.yaml reconciling apps/docs-prod path in virtual cluster
- Namespaces: relay, flux-system (with prune disabled label), 1password
- helmrelease-1password-operator.yaml (copy from coder-prod, adjust namespace refs)
- helmrelease-1password-secrets.yaml for relay S3 credentials and auth keys
- helmrelease-relay.yaml with S3 config, LoadBalancer service type, correct values
- kubeconfig.yaml.op.tpl for virtual cluster kubeconfig from 1Password

## Phase 3: Enigma-Cluster Ingress (apps/docs-infra-prod)
- Create apps/docs-infra-prod directory
- gitrepository-setup.yaml, kustomization-root.yaml, kustomization.yaml
- ingress-relay.yaml in tenant-root namespace:
  - host: relay.enigma.vgijssel.nl
  - TLS with cert-manager letsencrypt-prod
  - backend: mirrored LoadBalancer service (hash-named service auto-created by KubeVirt CCM)
  - ingressClassName: tenant-root
  - annotations matching coder ingress pattern

## Phase 4: Bootstrap & Verification
- Run bootstrap task to apply kustomization-root.yaml into virtual cluster
- Create 1Password items for S3 credentials and relay config
- Run create-1password-secret task
- Verify FluxCD reconciles all HelmReleases successfully
- Verify LoadBalancer service appears in enigma-cluster
- Update ingress-relay.yaml with actual mirrored service name
- Verify relay.enigma.vgijssel.nl is accessible with valid TLS

# Logical Dependency Chain

1. **Vendir chart entry** (Phase 1): Must exist before any HelmRelease can reference the chart path
2. **apps/docs-prod core files** (Phase 2 start): GitRepository, Kustomization, Namespaces must be applied first
3. **1Password operator** (Phase 2): Must deploy before 1password-secrets HelmRelease
4. **1Password secrets** (Phase 2): Must exist before relay HelmRelease (provides S3 credentials)
5. **Relay HelmRelease** (Phase 2): Depends on 1password-secrets; creates LoadBalancer service
6. **KubeVirt CCM mirroring** (automatic): Triggers when LoadBalancer service created in virtual cluster
7. **ingress-relay.yaml** (Phase 3): Can only specify correct backend service name after KubeVirt CCM creates the mirrored service; may need a placeholder then update
8. **apps/docs-infra-prod bootstrap**: Applied to enigma-cluster to manage ingress via FluxCD

# Risks and Mitigations

## Risk: Relay Helm Chart Availability
- Challenge: The Relay chart may not have a standard Helm repository URL; the GitHub repo structure needs investigation
- Mitigation: Check https://github.com/No-Instructions/Relay for a releases page, GitHub Pages helm repo, or OCI chart. If no helm chart exists, create a simple Kubernetes Deployment manifest directly without vendir.

## Risk: KubeVirt CCM Service Name
- Challenge: The mirrored LoadBalancer service in enigma-cluster is auto-named with a hash (e.g., a18c2be1873b84bcd8630e79298a07cf); the exact name is only known after bootstrap
- Mitigation: Bootstrap the virtual cluster first, observe the created service in enigma-cluster's tenant-root namespace, then populate ingress-relay.yaml with the correct service name.

## Risk: S3 Endpoint Configuration
- Challenge: The cozystack S3 endpoint and region for the s3-docs-infra-prod bucket need to be determined
- Mitigation: Query the cozystack API or existing S3 configuration in enigma-cluster to find the endpoint URL and credentials format

## Risk: 1Password Vault Structure
- Challenge: A new 1Password vault may need to be created for relay secrets
- Mitigation: Follow the coder-prod pattern (vault: setup-relay-prod or similar); create 1Password items for S3 credentials before running the bootstrap

## Risk: Virtual Cluster Kubeconfig Secret Name
- Challenge: The secret containing the cluster-docs-infra-prod kubeconfig must be identified in enigma-cluster
- Mitigation: Query enigma-cluster for secrets in tenant-root namespace matching the cluster name pattern used by cozystack

# Appendix

## Reference Files
- apps/coder-prod/ — primary reference for virtual cluster FluxCD deployment pattern
- apps/coder-cluster-prod/ingress-coder.yaml — reference for enigma-cluster ingress pattern
- third_party/vendir/vendir.yml — reference for adding new helm charts

## Key URLs
- Relay GitHub: https://github.com/No-Instructions/Relay
- Relay Server Template: https://github.com/No-Instructions/relay-server-template
- Relay Configuration: relay.toml with [server], [store] (s3), [auth] sections

## relay.toml S3 Configuration Structure
```toml
[store]
type = "s3"
bucket = "s3-docs-infra-prod"
region = "us-east-1"  # or cozystack-specific region
endpoint = "https://s3.enigma.vgijssel.nl"  # cozystack S3 endpoint
access_key_id = "<from-secret>"
secret_access_key = "<from-secret>"
```

## Coder Ingress Reference (apps/coder-cluster-prod/ingress-coder.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: coder
  namespace: tenant-root
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-http-version: "1.1"
    nginx.ingress.kubernetes.io/proxy-buffering: "off"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
spec:
  ingressClassName: tenant-root
  tls:
    - hosts:
        - coder.enigma.vgijssel.nl
      secretName: coder-tls
  rules:
    - host: coder.enigma.vgijssel.nl
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: a18c2be1873b84bcd8630e79298a07cf  # hash of mirrored LB service
                port:
                  number: 80
```
</context>
