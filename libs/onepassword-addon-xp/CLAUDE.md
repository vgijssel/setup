# Development Guidelines for AI Assistants - 1Password Crossplane AddOn

## Overview

The `onepassword-addon-xp` library packages the official 1Password Connect Helm chart as an Upbound Crossplane AddOn, enabling GitOps deployment of 1Password operator across multiple clusters with namespace-based secret access control and automatic synchronization from 1Password vaults to Kubernetes.

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

## Critical Workflow Requirements

### Before Making ANY Changes
1. **ALWAYS** verify Crossplane package structure:
   ```bash
   ls -la crossplane.yaml crds/ helm/
   ```

### After Making Changes
1. **Validate** package structure:
   ```bash
   up xpkg build -f . --dry-run
   ```

2. **Run** contract tests:
   ```bash
   kuttl test --config tests/kuttl-test.yaml
   ```

3. **Format** YAML files:
   ```bash
   trunk fmt
   ```

### Building and Publishing
Only after tests pass:
```bash
# Build package
nx build onepassword-addon-xp

# Publish via nx release (handles versioning + upload)
nx release --projects=onepassword-addon-xp
```

## Important Conventions

### Crossplane AddOn Structure
- **crossplane.yaml**: Must specify `packagingType: Helm`
- **crds/**: Extract ALL CRDs from Helm chart
- **helm/**: Tarball must be named `<chart>-<version>.tgz` (cached by Nx, gitignored)
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

## Common Tasks

### Updating 1Password Helm Chart Version
1. Pull and extract new chart:
   ```bash
   helm pull 1password/connect --version <new-version> --untar
   rm -rf crds/* && cp connect/crds/* crds/
   tar -czf helm/connect-<new-version>.tgz -C connect .
   ```
2. Update package.json version (MAJOR if CRD breaking change)
3. Run tests and validate

### Local Testing Workflow
```bash
# 1. Create kind cluster with native snapshotter (required for docker-in-docker)
kind create cluster --name onepassword-test --config tests/kind-config.yaml

# 2. Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system --create-namespace

# 3. Run kuttl tests
kuttl test --config tests/kuttl-test.yaml

# 4. Cleanup
kind delete cluster --name onepassword-test
```

## Troubleshooting

### Package Build Failures
```bash
up xpkg build -f . --dry-run  # Common: missing crossplane.yaml, invalid YAML, helm tarball not found
```

### AddOn Not Installing
```bash
kubectl logs -n crossplane-system deployment/crossplane -c package-manager
kubectl describe addon onepassword-operator
```

### OnePasswordItem Not Syncing
```bash
kubectl logs -n onepassword-system deployment/onepassword-connect
kubectl describe onepassworditem -n <namespace> <name>
kubectl get secret -n <namespace> onepassword-connect
```

### Workload Not Restarting on Rotation
```bash
kubectl get deployment <name> -n <namespace> -o jsonpath='{.metadata.annotations}'  # Check reloader.stakater.com/auto
kubectl logs -n reloader-system deployment/reloader
```

## Security Considerations

### 1Password Credentials
- Never commit real credentials to Git
- Use Sealed Secrets or SOPS for production
- Test credentials are mock/stub (invalid for real 1Password)
- Each namespace has isolated credentials

### RBAC & Secret Exposure
- Namespace-scoped RBAC prevents cross-namespace access
- Secrets mounted as files use `readOnly: true`
- No secret logging in operator (redacted)

## Best Practices

- Pin Helm chart to exact version (e.g., `2.0.5`)
- Pin Crossplane to minimum version (e.g., `>= 2.0.2`)
- Renovatebot creates PRs for dependency updates
- Never commit real credentials to Git
- Use Sealed Secrets or SOPS for production credentials

## Common Pitfalls

- **Helm chart not found**: Ensure tarball in `helm/` directory with correct filename
- **Missing CRDs**: Extract ALL CRDs from Helm chart using `helm template`
- **Reloader not triggering**: Verify `reloader.stakater.com/auto: "true"` annotation on Deployment
- **Namespace isolation broken**: Verify Connect credentials Secret is namespace-scoped

## References

- **Specification**: `/workspaces/setup/specs/001-enable-1password-within/spec.md`
- **Plan**: `/workspaces/setup/specs/001-enable-1password-within/plan.md`
- **Upbound Crossplane AddOns**: https://docs.upbound.io/manuals/uxp/concepts/packages/add-ons/
- **1Password Connect Helm Charts**: https://github.com/1Password/connect-helm-charts
- **kuttl Testing**: https://kuttl.dev/
