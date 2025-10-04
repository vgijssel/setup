# AGENTS.md - 1Password Crossplane AddOn

This library provides a Crossplane AddOn package for deploying the 1Password Connect Operator to Kubernetes clusters.

## Overview

The `onepassword-addon-xp` library packages the official 1Password Connect Helm chart as an Upbound Crossplane AddOn, enabling:
- GitOps deployment of 1Password operator across multiple clusters
- Namespace-based secret access control
- Automatic synchronization of secrets from 1Password vaults to Kubernetes
- Automatic workload restart on secret rotation
- Offline resilience via secret caching

## Architecture

### Core Components
- **Crossplane AddOn Package**: OCI image containing Helm chart + CRDs
- **1Password Connect Operator**: Syncs secrets from 1Password to Kubernetes
- **OnePasswordItem CRD**: Declarative secret reference specification
- **Reloader**: Triggers workload restart on secret changes

### Key Features
- Zero custom operator code (uses official 1Password operator)
- Namespace-isolated credentials (each namespace has own 1Password auth)
- Support for all secret types (plain text, binary, structured data)
- Automatic secret rotation detection and workload restart
- Graceful degradation when 1Password unavailable (cached secrets)

## Package Structure

```
libs/onepassword-addon-xp/
├── crossplane.yaml          # AddOn metadata
├── crds/                    # Extracted CRDs from Helm chart
│   └── onepassworditems.onepassword.com.yaml
├── helm/                    # Embedded Helm chart
│   └── connect-2.0.5.tgz
├── tests/                   # kuttl e2e tests
│   ├── kuttl-test.yaml
│   └── e2e/
├── package.json             # Nx configuration and versioning
├── AGENTS.md                # This file
└── CLAUDE.md                # AI assistant guidelines
```

## Development Workflow

### Prerequisites
- kind (Kubernetes in Docker)
- kubectl
- helm
- kuttl (Kubernetes testing tool)
- up CLI (Upbound Crossplane CLI)

All tools are available via direnv/Hermit - just run `direnv allow`.

### Building the Package

1. **Pull 1Password Helm Chart**:
   ```bash
   helm repo add 1password https://1password.github.io/connect-helm-charts
   helm pull 1password/connect --version 2.0.5 --untar
   ```

2. **Extract CRDs**:
   ```bash
   cp connect/crds/* crds/
   ```

3. **Repackage Helm Chart**:
   ```bash
   tar -czf helm/connect-2.0.5.tgz -C connect .
   ```

4. **Build AddOn Package**:
   ```bash
   up xpkg build -f . -o ../../dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg
   ```

### Testing

#### Run Contract Tests (kuttl)
```bash
# Create kind cluster
kind create cluster --name onepassword-test

# Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system --create-namespace

# Run tests
kuttl test --config tests/kuttl-test.yaml
```

#### Run via Nx
```bash
nx test onepassword-addon-xp
```

### Publishing

Packages are published to GitHub Container Registry (ghcr.io) via `nx release`:

```bash
# Release with version bump
nx release --projects=onepassword-addon-xp

# Package will be pushed to:
# ghcr.io/vgijssel/setup/onepassword-addon-xp:<version>
```

## Configuration

### crossplane.yaml
The AddOn metadata file defines how Crossplane deploys the package:

```yaml
apiVersion: meta.pkg.upbound.io/v1beta1
kind: AddOn
metadata:
  name: onepassword-operator
  annotations:
    friendly-name.meta.crossplane.io: "1Password Connect Operator"
spec:
  packagingType: Helm
  helm:
    releaseName: onepassword-connect
    releaseNamespace: onepassword-system
```

### Usage in Clusters

Deploy to a cluster via Crossplane:

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: AddOn
metadata:
  name: onepassword-operator
spec:
  package: ghcr.io/vgijssel/setup/onepassword-addon-xp:v0.1.0
```

Then create secrets per namespace:

```yaml
# 1. Create Connect credentials
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect
  namespace: my-app
data:
  1password-credentials.json: <base64-encoded-credentials>
  token: <base64-encoded-token>

---
# 2. Reference 1Password item
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: database-credentials
  namespace: my-app
spec:
  itemPath: "vaults/production/items/db-password"

---
# 3. Consume secret in workload
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: my-app
  annotations:
    reloader.stakater.com/auto: "true"  # Auto-restart on rotation
spec:
  template:
    spec:
      containers:
      - name: app
        envFrom:
        - secretRef:
            name: database-credentials
```

## Dependencies

### Crossplane Requirements
- Crossplane >= 2.0.2 (formerly v1.20.0)
- AddOn package support enabled

### External Dependencies
- 1Password Connect server (or 1Password.com with Connect)
- Valid 1Password credentials per namespace
- Reloader (optional, for automatic workload restart)

## Best Practices

### Secret Management
- **Namespace Isolation**: Each namespace has own Connect credentials
- **Least Privilege**: Limit 1Password token access to specific vaults
- **Credential Rotation**: Rotate Connect tokens periodically
- **GitOps Secrets**: Use Sealed Secrets or SOPS for Connect credentials

### Testing
- **Contract Tests**: Validate Kubernetes integration (kuttl)
- **Integration Tests**: Test with real 1Password (manual/staging)
- **Performance Tests**: Validate sync latency under load

### Versioning
- Pin exact Helm chart version (e.g., `2.0.5`)
- Pin exact Crossplane version (e.g., `2.0.2`)
- Use semantic versioning for AddOn package releases
- Renovatebot will create PRs for dependency updates

## Troubleshooting

### AddOn Not Installing
```bash
# Check Crossplane version
kubectl get crossplane

# Check package manager logs
kubectl logs -n crossplane-system deployment/crossplane -c package-manager

# Verify package is accessible
up xpkg info ghcr.io/vgijssel/setup/onepassword-addon-xp:v0.1.0
```

### OnePasswordItem Not Syncing
```bash
# Check operator logs
kubectl logs -n onepassword-system deployment/onepassword-connect

# Describe OnePasswordItem
kubectl describe onepassworditem -n <namespace> <name>

# Verify Connect credentials exist
kubectl get secret -n <namespace> onepassword-connect
```

### Workload Not Restarting on Rotation
```bash
# Verify Reloader is installed
kubectl get deployment -n reloader-system reloader

# Check reloader annotation
kubectl get deployment <name> -n <namespace> -o jsonpath='{.metadata.annotations}'

# Check Reloader logs
kubectl logs -n reloader-system deployment/reloader
```

## File Structure

### Key Files
- **crossplane.yaml**: AddOn metadata (packagingType: Helm)
- **crds/**: Custom Resource Definitions extracted from Helm chart
- **helm/**: Tarball of 1Password Connect Helm chart
- **package.json**: Nx project configuration and semver version
- **tests/**: kuttl test cases for e2e validation

### Generated Files
- **dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg**: Built package
- **.xpkg.lock**: Package build metadata (gitignored)

## Integration Points

### Flux GitOps
The AddOn is deployed to stacks/enigma-cluster via Flux:

```
stacks/enigma-cluster/flux/onepassword/
├── namespace.yaml       # onepassword-system namespace
├── addon.yaml           # Crossplane AddOn CR
└── kustomization.yaml   # Flux Kustomization
```

### Nx Monorepo
Build and release targets are defined in package.json:

```json
{
  "nx": {
    "targets": {
      "build": {
        "command": "up xpkg build -f . -o ../../dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg"
      },
      "test": {
        "command": "kuttl test --config tests/kuttl-test.yaml"
      }
    }
  }
}
```

## Future Enhancements

### Planned (Out of Scope for v1)
- **Webhook-based sync**: Replace polling with 1Password webhooks
- **External Secrets Operator integration**: Alternative backend
- **Multi-vault support**: Single OnePasswordItem referencing multiple vaults
- **Field-level encryption**: Encrypt Secret data at rest in etcd

### Known Limitations
- **Polling delay**: 30-60s between rotation and detection
- **No cross-namespace secrets**: Secret must be in same namespace as OnePasswordItem
- **No templating**: Secret values used as-is (no string interpolation)

## References

- [Upbound Crossplane AddOns](https://docs.upbound.io/manuals/uxp/concepts/packages/add-ons/)
- [1Password Connect Helm Charts](https://github.com/1Password/connect-helm-charts)
- [kuttl Testing](https://kuttl.dev/)
- [Reloader](https://github.com/stakater/Reloader)
