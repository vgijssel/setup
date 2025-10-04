# Development Guidelines - 1Password Crossplane AddOn

## Overview

Crossplane AddOn package for deploying 1Password Connect Operator to Kubernetes clusters. Enables GitOps deployment, namespace-based secret access control, and automatic synchronization of secrets from 1Password vaults to Kubernetes.

## Package Structure

```
libs/onepassword-addon-xp/
├── crossplane.yaml          # AddOn metadata (packagingType: Helm)
├── crds/                    # CRDs extracted from Helm chart
├── helm/                    # Embedded Helm chart tarball
├── tests/                   # kuttl e2e tests
└── package.json             # Nx configuration and versioning
```

## Build & Test Workflow

```bash
# Validate package structure
up xpkg build -f . --dry-run

# Run contract tests
kuttl test --config tests/kuttl-test.yaml

# Build package
up xpkg build -f . -o ../../dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg

# Publish via nx release
nx release --projects=onepassword-addon-xp
```

## Important Conventions

### Crossplane AddOn Structure
- **crossplane.yaml**: Must specify `packagingType: Helm`
- **crds/**: Extract ALL CRDs from Helm chart
- **helm/**: Tarball must be named `<chart>-<version>.tgz`
- No `values.yaml` overrides (use Helm defaults)

### Version Management
- Package version in `package.json` (semver)
- Helm chart version pinned in tarball filename
- CRD versions match Helm chart version
- Renovatebot updates Helm chart version

### Testing with kuttl
- Each test case in separate YAML file
- Use `TestAssert` with timeout for async validation
- Clean up resources with `TestStep` delete actions
- Mock 1Password credentials for contract tests

### kind Configuration
See root CLAUDE.md for kind docker-in-docker configuration (use native snapshotter).

## Usage Example

```yaml
# Deploy via Crossplane
apiVersion: pkg.crossplane.io/v1beta1
kind: AddOn
metadata:
  name: onepassword-operator
spec:
  package: ghcr.io/vgijssel/setup/onepassword-addon-xp:v0.1.0

---
# Create Connect credentials per namespace
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect
  namespace: my-app
data:
  1password-credentials.json: <base64>
  token: <base64>

---
# Reference 1Password item
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: database-credentials
  namespace: my-app
spec:
  itemPath: "vaults/production/items/db-password"

---
# Consume in workload
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: my-app
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  template:
    spec:
      containers:
      - name: app
        envFrom:
        - secretRef:
            name: database-credentials
```

## Troubleshooting

```bash
# Package build validation
up xpkg build -f . --dry-run

# AddOn installation issues
kubectl logs -n crossplane-system deployment/crossplane -c package-manager
kubectl describe addon onepassword-operator

# Operator issues
kubectl logs -n onepassword-system deployment/onepassword-connect
kubectl describe onepassworditem -n <namespace> <name>

# Test debugging
kuttl test --config tests/kuttl-test.yaml -v 2
```

## Best Practices

- Pin Helm chart to exact version (e.g., `2.0.5`)
- Never commit real credentials (use Sealed Secrets/SOPS)
- Each namespace has isolated Connect credentials
- Use `reloader.stakater.com/auto: "true"` annotation for workload restart
- Renovatebot handles dependency updates

## References

- **Specification**: `/workspaces/setup/specs/001-enable-1password-within/spec.md`
- **Plan**: `/workspaces/setup/specs/001-enable-1password-within/plan.md`
- **Data Model**: `/workspaces/setup/specs/001-enable-1password-within/data-model.md`
- **Contracts**: `/workspaces/setup/specs/001-enable-1password-within/contracts/`
- **Quickstart**: `/workspaces/setup/specs/001-enable-1password-within/quickstart.md`
