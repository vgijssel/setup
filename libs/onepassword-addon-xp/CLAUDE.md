@AGENTS.md

# Development Guidelines for AI Assistants - 1Password Crossplane AddOn

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
up xpkg build -f . -o ../../dist/libs/onepassword-addon-xp/onepassword-addon-xp.xpkg

# Publish via nx release (handles versioning + upload)
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
- Always use native storage driver for docker-in-docker:
  ```yaml
  nodes:
  - role: control-plane
    extraMounts:
    - containerPath: /var/lib/containerd
      hostPath: /var/lib/containerd
      type: DirectoryOrCreate
  ```

## Common Tasks

### Updating 1Password Helm Chart Version
1. Pull new chart version:
   ```bash
   helm pull 1password/connect --version <new-version> --untar
   ```
2. Extract CRDs:
   ```bash
   rm -rf crds/* && cp connect/crds/* crds/
   ```
3. Repackage:
   ```bash
   tar -czf helm/connect-<new-version>.tgz -C connect .
   ```
4. Update package.json version (MAJOR if CRD breaking change)
5. Run tests and validate

### Adding New Contract Test
1. Create file in `contracts/` directory: `NN-test-name.yaml`
2. Include setup, test, and assert sections
3. Use unique namespace per test for isolation
4. Add test to `contracts/README.md` mapping table
5. Verify test runs: `kuttl test --test contracts/NN-test-name.yaml`

### Updating AddOn Metadata
Edit `crossplane.yaml`:
- **name**: DNS-1123 compliant identifier
- **annotations**: Description, maintainer, friendly name
- **spec.helm.releaseName**: Helm release name in cluster
- **spec.helm.releaseNamespace**: Target namespace

### Local Testing Workflow
```bash
# 1. Create kind cluster
kind create cluster --name onepassword-test

# 2. Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system --create-namespace

# 3. Build and load package
up xpkg build -f . -o /tmp/onepassword-addon-xp.xpkg
# (Push to local registry or use file:// protocol)

# 4. Install AddOn
kubectl apply -f test-addon.yaml

# 5. Run kuttl tests
kuttl test --config tests/kuttl-test.yaml

# 6. Cleanup
kind delete cluster --name onepassword-test
```

## Debugging Tips

### Package Build Failures
```bash
# Dry-run build to see validation errors
up xpkg build -f . --dry-run

# Common issues:
# - Missing crossplane.yaml
# - Invalid YAML syntax
# - Helm chart tarball not found
# - CRD schema errors
```

### AddOn Installation Failures
```bash
# Check Crossplane version
kubectl get crossplane

# View package manager logs
kubectl logs -n crossplane-system deployment/crossplane -c package-manager

# Describe AddOn CR
kubectl describe addon onepassword-operator
```

### Operator Not Starting
```bash
# Check operator pods
kubectl get pods -n onepassword-system

# View operator logs
kubectl logs -n onepassword-system deployment/onepassword-connect

# Check Helm release status
helm list -n onepassword-system
```

### kuttl Test Failures
```bash
# Run tests with verbose output
kuttl test --config tests/kuttl-test.yaml -v 2

# Inspect test artifacts (left behind if skipDelete: true)
kubectl get all -n <test-namespace>

# View specific test logs
kubectl logs -n <test-namespace> <pod-name>

# Debug specific test case
kuttl test --test contracts/00-addon-installation.yaml -v 2
```

## Security Considerations

### 1Password Credentials
- Never commit real credentials to Git
- Use Sealed Secrets or SOPS for production
- Test credentials are mock/stub (invalid for real 1Password)
- Each namespace has isolated credentials

### RBAC
- Operator needs read access to 1Password Connect
- OnePasswordItem controller needs Secret write access
- Namespace-scoped RBAC prevents cross-namespace access

### Secret Exposure
- Secrets mounted as files use `readOnly: true`
- Environment variables only in memory
- No secret logging in operator (redacted)

## Best Practices

### Version Pinning
- Pin Helm chart to exact version (e.g., `2.0.5`)
- Pin Crossplane to minimum version (e.g., `>= 2.0.2`)
- Pin Reloader to exact version (e.g., `1.0.119`)
- Renovatebot creates PRs for updates

### Testing Strategy
- **Contract tests** (kuttl): Kubernetes integration
- **Integration tests** (manual): Real 1Password connectivity
- **Performance tests** (manual): Sync latency, scale limits

### Documentation
- Update AGENTS.md for architecture changes
- Update contracts/README.md for new tests
- Update quickstart.md for usage changes
- Maintain CHANGELOG.md via nx release

## File Operations

### Read-Only Files (Do Not Edit)
- `helm/*.tgz`: Generated from Helm chart pull
- `.xpkg.lock`: Build metadata (gitignored)
- `dist/`: Build artifacts (gitignored)

### Version-Controlled Files
- `crossplane.yaml`: AddOn metadata
- `crds/`: Extracted from Helm chart
- `package.json`: Nx config and version
- `tests/`: kuttl test specifications
- `AGENTS.md`, `CLAUDE.md`: Documentation

### Generated Files (Gitignored)
- `.xpkg.lock`
- `dist/libs/onepassword-addon-xp/`
- `node_modules/` (if any npm deps added)

## Common Pitfalls

### ❌ Incorrect Helm Chart Packaging
**Problem**: Helm chart not found during AddOn install
**Solution**: Ensure tarball in `helm/` directory with correct filename

### ❌ Missing CRDs
**Problem**: OnePasswordItem CRD not found
**Solution**: Extract ALL CRDs from Helm chart: `helm template <chart> | yq 'select(.kind == "CustomResourceDefinition")' > crds/`

### ❌ Reloader Not Triggering Restart
**Problem**: Secret changes don't restart workload
**Solution**: Verify `reloader.stakater.com/auto: "true"` annotation on Deployment

### ❌ Namespace Isolation Broken
**Problem**: Secrets accessible across namespaces
**Solution**: Verify Connect credentials Secret is namespace-scoped, not cluster-scoped

## Performance Considerations

### Sync Latency
- Operator polls 1Password every 30-60 seconds
- Initial sync: < 5 seconds (FR-002 requirement)
- Workload restart: 30-60 seconds (Reloader + rolling update)

### Resource Limits
- Operator CPU: 100m-500m (varies with # of OnePasswordItems)
- Operator Memory: 128Mi-512Mi
- CRD etcd storage: Minimal overhead

### Scale Testing
- Test with 100+ OnePasswordItems per namespace
- Test with 10+ namespaces
- Monitor etcd size with large secrets

## Integration Points

### Flux GitOps Deployment
stacks/enigma-cluster/flux/onepassword/:
- `addon.yaml`: Crossplane AddOn CR
- `namespace.yaml`: onepassword-system namespace
- `kustomization.yaml`: Flux Kustomization

### Nx Release Pipeline
```bash
# Version bump (interactive)
nx release version --projects=onepassword-addon-xp

# Build + Publish
nx release publish --projects=onepassword-addon-xp

# Full release (version + changelog + publish)
nx release --projects=onepassword-addon-xp
```

### GitHub Actions
- `.github/workflows/release.yml`: Automated release on tag push
- `.github/workflows/test.yml`: Run kuttl tests on PR
- Secrets: `GHCR_TOKEN` for OCI push

## Maintenance Checklist

### Monthly Tasks
- [ ] Check for Helm chart updates (Renovatebot PR)
- [ ] Review 1Password operator changelog
- [ ] Run full test suite against latest Crossplane

### Quarterly Tasks
- [ ] Audit RBAC permissions (least privilege)
- [ ] Review operator resource limits
- [ ] Validate secret rotation workflow in production

### On-Demand Tasks
- [ ] Update CRDs when Helm chart updates
- [ ] Bump package version following semver
- [ ] Regenerate contracts/ if requirements change

## References

- **Specification**: `/workspaces/setup/specs/001-enable-1password-within/spec.md`
- **Plan**: `/workspaces/setup/specs/001-enable-1password-within/plan.md`
- **Data Model**: `/workspaces/setup/specs/001-enable-1password-within/data-model.md`
- **Contracts**: `/workspaces/setup/specs/001-enable-1password-within/contracts/`
- **Quickstart**: `/workspaces/setup/specs/001-enable-1password-within/quickstart.md`
