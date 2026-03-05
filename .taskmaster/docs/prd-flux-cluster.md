# FluxCluster CRD - Simplified Virtual Cluster Creation

## Overview

Currently, creating a k3k virtual cluster with Flux CD integration requires multiple Kubernetes manifests spread across different files. For example, `apps/docs-sync-infra` and `apps/secrets-infra` each require a k3k Cluster, GitRepository, Kustomization, and potentially SecretStore/PushSecret resources. This is cumbersome and error-prone when creating new virtual clusters.

This PRD describes a new custom resource called `FluxCluster` that uses [kro](https://kro.run/) (Kubernetes Resource Orchestrator) to compose all required resources from a single declarative specification.

## Core Features

### 1. Unified FluxCluster CRD

A single `FluxCluster` custom resource that wraps:
- k3k Cluster resource with sensible defaults
- Flux GitRepository pointing to the setup repository
- Flux Kustomization for the cluster's application path
- Optional CoreDNS custom configuration for cross-cluster DNS resolution
- Optional SecretStore and PushSecret resources for host-to-tenant secret synchronization

### 2. Flux Integration

Mandatory flux configuration for every FluxCluster:
- `flux.branch`: The git branch to track (e.g., `main`)
- `flux.path`: The path in the repository to deploy (e.g., `./apps/docs-sync`)

This automatically creates:
- A GitRepository pointing to `https://github.com/vgijssel/setup` with the specified branch
- A Kustomization pointing to the specified path

### 3. DNS Forwarding Configuration

Optional DNS configuration for cross-cluster service resolution:
- `dns.hostIp`: The host cluster's kube-dns IP (default: `10.96.0.10`)
- `dns.services`: List of host cluster services to make resolvable from the virtual cluster

When `dns.services` is configured, a `coredns-custom` ConfigMap is generated and injected into the k3k cluster as an addon. This enables virtual cluster pods to resolve host cluster services.

### 4. Host Secret Synchronization

Optional secret synchronization from host to tenant cluster:
- `hostSync.secrets.enabled`: Enable/disable secret syncing
- `hostSync.secrets.selectors`: List of secret names to sync

When enabled, creates:
- A SecretStore using the k3k cluster's kubeconfig
- A PushSecret for each secret in the selectors list

## Technical Architecture

### System Components

1. **kro ResourceGroup** (`libs/flux-cluster/`)
   - Defines the FluxCluster CRD schema
   - Contains CEL expressions for conditional resource generation
   - Manages resource lifecycle and dependencies

2. **Generated Resources**
   - `k3k.io/v1beta1/Cluster` - The virtual cluster
   - `source.toolkit.fluxcd.io/v1/GitRepository` - Flux source
   - `kustomize.toolkit.fluxcd.io/v1/Kustomization` - Flux deployment
   - `v1/ConfigMap` (coredns-custom) - Optional DNS forwarding
   - `external-secrets.io/v1/SecretStore` - Optional secret store
   - `external-secrets.io/v1alpha1/PushSecret` - Optional secret sync (one per selector)

### FluxCluster CRD Schema

```yaml
apiVersion: kro.run/v1alpha1
kind: FluxCluster
metadata:
  name: example
  namespace: tenant-prod
spec:
  # Inherits k3k ClusterSpec fields
  # See: https://rancher.github.io/k3k-product-docs/k3k/1.0.2/en/references/crds.html#k8s-api-github-com-rancher-k3k-pkg-apis-k3k-io-v1beta1-clusterspec
  servers: 1
  agents: 0
  version: v1.34.4-k3s1
  mode: shared
  serviceCIDR: 10.96.0.0/16
  clusterDNS: 10.96.0.10
  tlsSANs:
    - 172.18.0.2
  expose:
    nodePort: {}
  persistence:
    type: dynamic
    storageRequestSize: 2G
  sync:
    secrets:
      enabled: false
    configMaps:
      enabled: true
    services:
      enabled: true
    persistentVolumeClaims:
      enabled: false
    ingresses:
      enabled: true
    priorityClasses:
      enabled: false

  # New FluxCluster-specific fields
  flux:
    branch: main                    # Required: Git branch to track
    path: ./apps/docs-sync          # Required: Path in repo to deploy

  dns:
    hostIp: 10.96.0.10              # Optional: Host kube-dns IP (default: 10.96.0.10)
    services: []                    # Optional: Host services to forward
      # - aws-sigv4-proxy-secrets.tenant-prod.svc.cluster.local

  hostSync:
    secrets:
      enabled: false                # Optional: Enable host->tenant secret sync
      selectors: []                 # Optional: Secret names to sync
        # - 1password-operator-token
        # - 1password-credentials
```

### Resource Generation Logic

**GitRepository** (always created):
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: setup
  namespace: flux-system
spec:
  interval: 5m
  url: https://github.com/vgijssel/setup
  ref:
    branch: {{ .spec.flux.branch }}
```

**Kustomization** (always created):
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: {{ .metadata.name }}
  namespace: flux-system
spec:
  interval: 30m
  sourceRef:
    kind: GitRepository
    name: setup
  path: {{ .spec.flux.path }}
  prune: true
  wait: true
  timeout: 10m
```

**CoreDNS Custom ConfigMap** (created when `dns.services` is non-empty):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom
  namespace: kube-system
data:
  # One server block per service
  {{ range .spec.dns.services }}
  {{ . | replace "." "-" }}.server: |
    {{ . }}:53 {
      errors
      cache 30
      forward . {{ $.spec.dns.hostIp }}
    }
  {{ end }}
```

This ConfigMap is provided to k3k via the `addons` feature.

**SecretStore** (created when `hostSync.secrets.enabled` is true):
```yaml
apiVersion: external-secrets.io/v1
kind: SecretStore
metadata:
  name: {{ .metadata.namespace }}-store
  namespace: {{ .metadata.namespace }}
spec:
  provider:
    kubernetes:
      remoteNamespace: default
      authRef:
        name: k3k-{{ .metadata.name }}-kubeconfig
        key: kubeconfig.yaml
```

**PushSecret** (created for each item in `hostSync.secrets.selectors`):
```yaml
apiVersion: external-secrets.io/v1alpha1
kind: PushSecret
metadata:
  name: push-{{ secretName }}
  namespace: {{ .metadata.namespace }}
spec:
  refreshInterval: 10s
  secretStoreRefs:
    - name: {{ .metadata.namespace }}-store
      kind: SecretStore
  selector:
    secret:
      name: {{ secretName }}
  data:
    - match:
        secretKey: ""
        remoteRef:
          remoteKey: {{ secretName }}
```

### K3k Addon Integration

When DNS services are configured, the generated `coredns-custom` ConfigMap needs to be injected into the k3k cluster. This is done via k3k's addon feature by creating a Secret containing the ConfigMap and referencing it in the Cluster spec:

```yaml
spec:
  addons:
    - secretRef:
        name: {{ .metadata.name }}-coredns-addon
```

The addon Secret wraps the ConfigMap YAML so k3k applies it inside the virtual cluster.

**Important**: When the ConfigMap content changes (e.g., new DNS services added), the k3k cluster must restart to pick up the changes. This should be handled by updating the addon Secret's content hash or similar mechanism.

## Development Roadmap

### Phase 1: MVP - Core FluxCluster CRD

1. Set up `libs/flux-cluster/` project structure
2. Create kro ResourceGroup with FluxCluster schema
3. Implement k3k Cluster resource generation
4. Implement GitRepository resource generation
5. Implement Kustomization resource generation
6. Create basic chainsaw tests for resource creation

### Phase 2: DNS Forwarding

1. Implement conditional CoreDNS ConfigMap generation
2. Implement k3k addon Secret for ConfigMap injection
3. Handle ConfigMap updates triggering cluster restarts
4. Add chainsaw tests for DNS forwarding functionality

### Phase 3: Secret Synchronization

1. Implement conditional SecretStore generation
2. Implement PushSecret generation for each selector
3. Handle kubeconfig reference for k3k cluster
4. Add chainsaw tests for secret synchronization

### Phase 4: Migration & Validation

1. Migrate `apps/docs-sync-infra` to use FluxCluster
2. Migrate `apps/secrets-infra` to use FluxCluster
3. Validate all functionality works end-to-end
4. Document the FluxCluster CRD usage

## Logical Dependency Chain

1. **Foundation**: kro installation and ResourceGroup basics
   - kro must be installable in the cluster
   - Basic ResourceGroup structure understood

2. **Core CRD**: k3k Cluster + Flux resources
   - These are always required and form the base
   - Can be tested independently

3. **DNS Layer**: CoreDNS configuration
   - Depends on core CRD working
   - Requires understanding k3k addon mechanism

4. **Secret Layer**: Host secret synchronization
   - Depends on core CRD working
   - Requires external-secrets operator installed
   - Requires kubeconfig access pattern

5. **Migration**: Replace existing implementations
   - Only after all features are tested
   - Incremental migration (one cluster at a time)

## Risks and Mitigations

### Technical Challenges

1. **kro CEL Expression Complexity**
   - Risk: Complex conditional logic may be hard to express in CEL
   - Mitigation: Start with simple expressions, iterate based on kro documentation

2. **K3k Addon Restart Behavior**
   - Risk: ConfigMap changes may not trigger cluster restart
   - Mitigation: Research k3k addon behavior, potentially use annotation-based triggers

3. **Resource Ordering Dependencies**
   - Risk: Resources may be created in wrong order (e.g., PushSecret before SecretStore)
   - Mitigation: Leverage kro's dependency management and CEL conditions

### MVP Scope

The MVP should focus on:
- Basic k3k Cluster creation with flux integration
- No DNS or secret features initially
- Validate kro patterns before adding complexity

### Resource Constraints

1. **Testing Environment**
   - Need k3k and kro installed for development
   - Use existing dev-cluster patterns for chainsaw tests

2. **Documentation**
   - kro is relatively new, documentation may be limited
   - Reference official kro docs at https://kro.run/

## Appendix

### Reference Implementations

**Current docs-sync-infra resources**:
- `apps/docs-sync-infra/cluster-docs-sync.yaml` - k3k Cluster
- `apps/docs-sync-infra/gitrepository-setup.yaml` - GitRepository
- `apps/docs-sync-infra/kustomization-docs-sync.yaml` - Kustomization

**Current secrets-infra resources**:
- `apps/secrets-infra/cluster-secrets.yaml` - k3k Cluster
- `apps/secrets-infra/gitrepository-setup.yaml` - GitRepository
- `apps/secrets-infra/kustomization-secrets.yaml` - Kustomization
- `apps/secrets-infra/secretstore-k3k.yaml` - SecretStore
- `apps/secrets-infra/pushsecret-1password.yaml` - PushSecrets
- `apps/secrets-infra/service-aws-sigv4-proxy-alias.yaml` - Service alias

### kro Documentation

- Main site: https://kro.run/
- GitHub: https://github.com/kubernetes-sigs/kro
- ResourceGroup API: https://kro.run/docs/concepts/resourcegroup/

### k3k Documentation

- Cluster CRD: https://rancher.github.io/k3k-product-docs/k3k/1.0.2/en/references/crds.html#k8s-api-github-com-rancher-k3k-pkg-apis-k3k-io-v1beta1-clusterspec
- Addons: https://rancher.github.io/k3k-product-docs/k3k/1.0.2/en/references/crds.html#k8s-api-github-com-rancher-k3k-pkg-apis-k3k-io-v1beta1-addon

### Chainsaw Testing

Testing will follow the pattern established in `libs/dev-cluster/tests_e2e/.chainsaw-test/`:
- Assert resource creation
- Validate resource status
- Test end-to-end functionality
