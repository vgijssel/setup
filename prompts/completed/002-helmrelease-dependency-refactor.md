<objective>
Refactor enigma-cluster to use HelmRelease-based dependencies instead of FluxCD Kustomizations.

Create two local Helm charts and restructure the FluxCD resources so all dependencies flow through HelmRelease `dependsOn` fields rather than Kustomization dependencies. This eliminates the complex Kustomization hierarchy and makes the dependency graph explicit and easy to understand.
</objective>

<context>
This is an Nx monorepo managing Kubernetes infrastructure via FluxCD. The enigma-cluster stack currently uses multiple FluxCD Kustomizations (infrastructure-helmreleases, infrastructure-configs, apps-configs, apps-helmreleases) to manage dependencies, which is confusing because:

1. Kustomizations and HelmReleases are mixed, making it hard to trace dependencies
2. The split between helmreleases/ and configs/ subdirectories adds complexity
3. CRD installation timing (1password-operator, kyverno) forces the multi-Kustomization pattern

The solution is to consolidate everything into HelmReleases by creating two local Helm charts that absorb the "configs" resources.

Read these files to understand current state:
- `stacks/enigma-cluster/` - all files in this directory
- `libs/internal-dns/` - example of existing local Helm chart pattern
- `third_party/vendir/vendir.yml` - vendored chart configuration
</context>

<target_dependency_graph>
The final HelmRelease dependency graph should be:

```
1password-operator: []                    # No dependencies
1password-secrets: [1password-operator]   # NEW - waits for CRD
kyverno: []                               # No dependencies
internal-networking: [kyverno]            # NEW - waits for CRD
cloudflare-tunnel: [1password-secrets]    # Uses secrets
external-dns: [1password-secrets]         # Uses secrets
tailscale-operator: [1password-secrets]   # Uses secrets
```

All dependencies are expressed via HelmRelease `spec.dependsOn` fields.
</target_dependency_graph>

<requirements>
## 1. Create libs/1password-secrets Helm Chart

A local Helm chart that installs OnePasswordItem resources. These are converted to Kubernetes Secrets by the 1password-operator.

**Chart Structure:**
```
libs/1password-secrets/
├── Chart.yaml
├── values.yaml
└── templates/
    └── onepassworditem.yaml
```

**values.yaml format:**
```yaml
secrets:
  - name: external-dns-cloudflare-api-token
    namespace: external-dns
    itemPath: vaults/enigma-cluster/items/cloudflare-external-dns
  - name: cloudflare-tunnel-api-token
    namespace: cloudflare-tunnel
    itemPath: vaults/enigma-cluster/items/cloudflare-tunnel-ingress-controller
  - name: tailscale-operator-oauth
    namespace: tailscale
    itemPath: vaults/enigma-cluster/items/tailscale-operator
  - name: cloudflare-api-token-secret
    namespace: cozy-cert-manager
    itemPath: vaults/enigma-cluster/items/cloudflare-cert-manager
```

**Template logic:**
- Loop over `secrets` list
- Create Namespace for each unique namespace (unless it's flux-system or kube-system)
- Create OnePasswordItem resource for each secret

## 2. Create libs/internal-networking Helm Chart

A local Helm chart that installs Kyverno policies for internal networking.

**Chart Structure:**
```
libs/internal-networking/
├── Chart.yaml
├── values.yaml
└── templates/
    └── clusterpolicy.yaml
```

**Content:**
- Move content from `stacks/enigma-cluster/infrastructure/configs/kyverno-policies.yaml` into the template
- Make policy configuration values-driven where sensible

## 3. Create HelmReleases for New Charts

Create HelmRelease resources for both new charts:

**helmrelease-1password-secrets.yaml:**
- Source: GitRepository (setup)
- Chart path: `./libs/1password-secrets`
- dependsOn: 1password-operator

**helmrelease-internal-networking.yaml:**
- Source: GitRepository (setup)
- Chart path: `./libs/internal-networking`
- dependsOn: kyverno

## 4. Update Existing HelmReleases

Add `dependsOn` to existing HelmReleases:
- cloudflare-tunnel: dependsOn 1password-secrets
- external-dns: dependsOn 1password-secrets
- tailscale-operator: dependsOn 1password-secrets

## 5. Restructure enigma-cluster Directory

**Final structure:**
```
stacks/enigma-cluster/
├── kustomization.yaml           # Standard Kustomize file (lists all resources)
├── kustomization-root.yaml      # FluxCD Kustomization (tracks this directory)
├── gitrepository-setup.yaml     # GitRepository resource
├── namespace-flux-system.yaml   # flux-system namespace
├── helmrelease-1password-operator.yaml
├── helmrelease-1password-secrets.yaml    # NEW
├── helmrelease-kyverno.yaml
├── helmrelease-internal-networking.yaml  # NEW
├── helmrelease-cloudflare-tunnel.yaml
├── helmrelease-external-dns.yaml
└── helmrelease-tailscale-operator.yaml
```

**Delete these files/directories:**
- FluxCD Kustomization resources EXCEPT kustomization-root.yaml (delete kustomization-infrastructure-*.yaml, kustomization-apps-*.yaml)
- infrastructure/ directory (all contents)
- apps/ directory (all contents)

**Keep kustomization-root.yaml** - This FluxCD Kustomization resource ensures Flux watches and reconciles the stacks/enigma-cluster directory. Without it, Flux wouldn't track changes to the HelmReleases.
</requirements>

<implementation>
## Step-by-Step Implementation

1. **Read current state** - Examine all files in stacks/enigma-cluster/ and libs/internal-dns/

2. **Create libs/1password-secrets chart**
   - Create Chart.yaml with proper metadata
   - Create values.yaml with all current secrets
   - Create templates/onepassworditem.yaml with loop and namespace creation

3. **Create libs/internal-networking chart**
   - Create Chart.yaml with proper metadata
   - Create templates/clusterpolicy.yaml (move from current kyverno-policies.yaml)
   - Create values.yaml for any configurable values

4. **Add Nx project configuration for new charts**
   - Add project.json to each chart (follow libs/internal-dns pattern)

5. **Create new HelmRelease files**
   - helmrelease-1password-secrets.yaml with dependsOn: 1password-operator
   - helmrelease-internal-networking.yaml with dependsOn: kyverno

6. **Update existing HelmReleases**
   - Move to root of enigma-cluster/ directory
   - Add dependsOn: 1password-secrets to cloudflare-tunnel, external-dns, tailscale-operator

7. **Update root kustomization.yaml**
   - Reference all HelmReleases and other resources at root level
   - Remove references to subdirectories

8. **Delete obsolete files**
   - Remove all kustomization-*.yaml FluxCD Kustomization resources
   - Remove infrastructure/ and apps/ directories

## HelmRelease Pattern

Use this pattern for local chart HelmReleases:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: <name>
  namespace: flux-system
spec:
  interval: 30m
  chart:
    spec:
      chart: ./libs/<chart-name>
      sourceRef:
        kind: GitRepository
        name: setup
      interval: 12h
  dependsOn:
    - name: <dependency-name>
  install:
    createNamespace: true
    remediation:
      retries: 3
  upgrade:
    remediation:
      retries: 3
```

## Important Notes

- All HelmReleases live in flux-system namespace
- Local charts reference GitRepository 'setup' as source
- The dependsOn field takes a list of HelmRelease names in the same namespace
- Keep existing values/configuration from current HelmReleases when moving them
</implementation>

<constraints>
- Do NOT modify third_party/vendir/ - external charts remain vendored
- Do NOT change the 1password-operator or kyverno HelmRelease configurations (only add dependsOn if needed)
- Keep all existing secret configurations (itemPath values must match current ones exactly)
- Ensure the kustomization.yaml (standard Kustomize, not FluxCD Kustomization) includes all resources
- Use exact version pinning for Chart.yaml (follow libs/internal-dns pattern)
</constraints>

<verification>
After completing the refactoring:

1. **Validate Helm charts:**
   ```bash
   helm template libs/1password-secrets
   helm template libs/internal-networking
   ```

2. **Validate Kustomize build:**
   ```bash
   kustomize build stacks/enigma-cluster
   ```

3. **Verify dependency graph:**
   - Confirm each HelmRelease has correct dependsOn
   - Verify no circular dependencies exist
   - Check that 1password-secrets depends on 1password-operator
   - Check that internal-networking depends on kyverno
   - Check that cloudflare-tunnel, external-dns, tailscale-operator depend on 1password-secrets

4. **Verify file cleanup:**
   - Only kustomization-root.yaml remains as FluxCD Kustomization (no kustomization-infrastructure-*.yaml or kustomization-apps-*.yaml)
   - No infrastructure/ or apps/ subdirectories
   - Only root-level resources in stacks/enigma-cluster/
</verification>

<success_criteria>
- Two new Helm charts exist: libs/1password-secrets and libs/internal-networking
- All HelmReleases are at root level of stacks/enigma-cluster/
- Only kustomization.yaml (standard Kustomize) and kustomization-root.yaml (FluxCD Kustomization) remain
- Dependency graph matches the target specification
- `helm template` succeeds for both new charts
- `kustomize build stacks/enigma-cluster` succeeds
- All existing secrets and policies are preserved in the new charts
</success_criteria>
</content>
</invoke>