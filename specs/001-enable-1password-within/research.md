# Research: 1Password Kubernetes Integration

**Date**: 2025-10-04
**Status**: Complete

## Overview
Research findings for implementing 1Password integration in Kubernetes using Crossplane AddOn packaging.

## Technology Decisions

### Decision 1: Crossplane AddOn Package Format
**What**: Use Upbound Crossplane AddOn packaging to deploy 1Password Connect Operator
**Why**:
- Native Crossplane integration for multi-cluster management
- Helm chart packaging preserves official 1Password operator
- OCI registry distribution aligns with existing workflow (libs/coder-devcontainer pattern)
- AddOn lifecycle management via Crossplane

**Alternatives Considered**:
- **Direct Helm chart deployment**: Rejected - doesn't provide Crossplane-native management
- **Custom operator**: Rejected - violates Principle I (use official operator instead)
- **Flux HelmRelease only**: Rejected - doesn't enable Crossplane cluster orchestration

**References**:
- https://docs.upbound.io/manuals/uxp/concepts/packages/add-ons/
- Crossplane >= 2.0.2 required for AddOn support

### Decision 2: 1Password Connect Operator (Helm Chart)
**What**: Use official 1Password Connect Helm chart version 2.0.5
**Why**:
- Official, maintained by 1Password
- Supports OnePasswordItem CRD for secret synchronization
- Handles automatic secret rotation and sync
- Includes built-in caching for offline resilience

**Alternatives Considered**:
- **External Secrets Operator with 1Password backend**: Rejected - adds unnecessary abstraction layer
- **Custom secret controller**: Rejected - unmaintained, violates Principle I

**References**:
- https://github.com/1Password/connect-helm-charts
- Chart repository: https://1password.github.io/connect-helm-charts
- Latest stable: connect-2.0.5 (released 2025-09-12)

### Decision 3: Testing with kuttl + kind
**What**: Use kuttl for Kubernetes end-to-end testing with kind cluster
**Why**:
- kuttl designed for Kubernetes operator testing
- kind provides local K8s cluster for CI/CD
- Native storage driver required for docker-in-docker environment
- Tests validate real Kubernetes behavior (not mocks)

**Configuration**:
```bash
kind create cluster --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry]
    config_path = "/etc/containerd/certs.d"
nodes:
- role: control-plane
  extraMounts:
  - containerPath: /var/lib/containerd
    hostPath: /var/lib/containerd
    type: DirectoryOrCreate
EOF
```

**Alternatives Considered**:
- **k3d**: Rejected - kind more widely adopted in Crossplane ecosystem
- **minikube**: Rejected - heavier weight, slower startup
- **Unit tests with mocked client**: Rejected - doesn't validate real Kubernetes interactions

**References**:
- kuttl: https://kuttl.dev/
- kind with native storage: https://kind.sigs.k8s.io/docs/user/configuration/#containerd-config-patches

### Decision 4: OCI Registry Publishing (GitHub Container Registry)
**What**: Publish AddOn package to ghcr.io using nx release
**Why**:
- Consistent with existing libs/coder-devcontainer pattern
- GitHub Container Registry free for public repositories
- nx release automates versioning + changelog + artifact upload
- Renovatebot can track OCI image versions

**Build Process**:
```bash
# Pull Helm chart
helm pull 1password/connect --version 2.0.5 --untar
# Extract CRDs
cp connect/crds/* libs/onepassword-addon-xp/crds/
# Repackage Helm chart
tar -czf libs/onepassword-addon-xp/helm/connect-2.0.5.tgz -C connect .
# Build AddOn package
up xpkg build -f libs/onepassword-addon-xp -o dist/onepassword-addon-xp.xpkg
# Publish via nx release
nx release --projects=onepassword-addon-xp
```

**Alternatives Considered**:
- **Docker Hub**: Rejected - GitHub integration better for this monorepo
- **Manual versioning**: Rejected - nx release automates semver + changelog

**References**:
- nx release: https://nx.dev/concepts/releases
- GitHub Container Registry: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

### Decision 5: Namespace-Based Authorization Model
**What**: Configure 1Password operator with namespace-scoped permissions
**Why**:
- Meets FR-003 requirement (namespace-based authorization)
- Aligns with Kubernetes RBAC model
- Simpler than per-service-account configuration
- OnePasswordItem resources created per namespace

**Implementation**:
- Each namespace has own 1Password credentials (via Secret)
- OnePasswordItem CRD references vault/item/field
- Operator watches OnePasswordItem in all namespaces
- Synced Kubernetes Secret created in same namespace

**Alternatives Considered**:
- **Service account based**: Rejected - adds complexity, not required by spec
- **Cluster-wide shared credentials**: Rejected - violates FR-003 isolation requirement

**References**:
- OnePasswordItem CRD: https://github.com/1Password/connect-helm-charts/tree/main/charts/connect#onepassworditem-custom-resource

### Decision 6: Secret Rotation with Automatic Workload Restart
**What**: Use Reloader (stakater/reloader) for workload restart on secret change
**Why**:
- Meets FR-002 and FR-010 requirements (automatic restart on rotation)
- 1Password operator updates Kubernetes Secret automatically
- Reloader watches Secrets and triggers Deployment/StatefulSet restart
- Lightweight, focused tool (Principle I)

**Configuration**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    reloader.stakater.com/auto: "true"  # Auto-restart on secret change
spec:
  template:
    spec:
      containers:
      - name: app
        envFrom:
        - secretRef:
            name: my-1password-secret
```

**Alternatives Considered**:
- **Custom admission webhook**: Rejected - over-engineering
- **Manual restart**: Rejected - violates FR-002 automation requirement

**References**:
- Reloader: https://github.com/stakater/Reloader
- Will be added as dependency in AddOn package

### Decision 7: Secret Caching Strategy
**What**: Rely on 1Password Connect's built-in caching + Kubernetes Secret persistence
**Why**:
- 1Password Connect operator has native cache
- Kubernetes Secrets persist even if 1Password unreachable
- Meets FR-005 requirement (cached values on failure)
- No custom caching logic needed

**Behavior**:
- Initial sync: Operator fetches from 1Password, creates K8s Secret
- 1Password unavailable: Kubernetes Secret remains, workloads use existing values
- Recovery: Operator resumes sync when 1Password available

**Alternatives Considered**:
- **Custom cache service**: Rejected - operator already provides this
- **TTL-based cache invalidation**: Rejected - unnecessary complexity

**References**:
- 1Password Connect architecture: https://developer.1password.com/docs/connect/

## Technical Constraints

### Constraint 1: Docker-in-Docker Environment
**Issue**: CI/CD runs in docker container, kind needs special configuration
**Solution**: Use kind with native storage driver (containerd DirectoryOrCreate mount)
**Impact**: Requires specific kind cluster config in test setup

### Constraint 2: Crossplane Version Requirement
**Issue**: AddOn packaging requires Crossplane >= 2.0.2 (formerly v1.20.0 before renaming)
**Solution**: Verify stacks/enigma-cluster runs compatible version
**Impact**: May need Crossplane upgrade in enigma-cluster

### Constraint 3: Upbound CLI (`up`) Availability
**Issue**: `up xpkg build` required for packaging, may not be in Hermit
**Solution**: Add `up` to Hermit manifest or provide wrapper script
**Impact**: Need to verify tool availability in Phase 1

## Integration Points

### Integration 1: Flux Deployment to enigma-cluster
**What**: Flux monitors stacks/enigma-cluster/flux/onepassword/
**How**:
- GitOps flow: commit → Flux detects → applies AddOn CR → Crossplane installs
- Kustomization for environment-specific config

**Files**:
```
stacks/enigma-cluster/flux/onepassword/
├── namespace.yaml           # onepassword-system namespace
├── addon.yaml               # Crossplane AddOn CR pointing to ghcr.io image
├── connect-credentials.yaml # 1Password Connect credentials (sealed secret)
└── kustomization.yaml       # Flux Kustomization resource
```

### Integration 2: Nx Build and Release Pipeline
**What**: nx targets for build, test, and release
**How**:
```json
{
  "targets": {
    "build": {
      "command": "up xpkg build -f . -o ../../dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg",
      "outputs": ["{workspaceRoot}/dist/libs/onepassword-addon-xp"]
    },
    "test": {
      "command": "kuttl test --config tests/kuttl-test.yaml"
    },
    "release": {
      "executor": "@nx/js:release-publish",
      "options": {
        "packageRoot": "dist/libs/onepassword-addon-xp",
        "registry": "ghcr.io"
      }
    }
  }
}
```

## Best Practices

### 1. Helm Chart Version Pinning
- Pin exact version: `connect-2.0.5` (not `^2.0.0` or `latest`)
- Renovatebot will create PRs for updates
- Test new versions in kind before merging

### 2. CRD Management
- Extract CRDs from Helm chart: `helm template <chart> | yq 'select(.kind == "CustomResourceDefinition")'`
- Place in `crds/` directory for AddOn packaging
- Version CRDs with Helm chart version

### 3. Test Isolation
- Each kuttl test case in separate namespace
- Cleanup via kuttl assert/delete steps
- Kind cluster recreated for each CI run

### 4. Secret Handling
- Never commit 1Password credentials to Git
- Use Sealed Secrets or SOPS for GitOps
- Test credentials stored in GitHub Actions secrets

## Open Questions (Resolved)
All technical unknowns resolved. No blocking issues for Phase 1.

## Next Steps
Proceed to Phase 1:
1. Create data-model.md (CRD schemas)
2. Generate contracts/ (kuttl test specifications)
3. Create quickstart.md (manual testing guide)
4. Update CLAUDE.md and AGENTS.md
