<objective>
Restructure stacks/enigma-cluster as a FluxCD kustomization root with proper dependency management between Helm releases and dependent resources.

This sets up the foundational GitOps infrastructure for the enigma cluster, including operators for secrets management (1Password), network tunneling (Tailscale, Cloudflare), policy enforcement (Kyverno), and DNS management (external-dns).
</objective>

<context>
This is an Nx monorepo with existing vendir configuration at `third_party/vendir/vendir.yml` for managing external Helm charts.

@third_party/vendir/vendir.yml - existing vendir config showing the pattern for adding helm charts
@stacks/enigma-cluster/ - current cluster configuration to be restructured
@CLAUDE.md - project conventions including Kubernetes naming standards

The cluster already has:
- A HelmRelease for 1password-operator pointing to `third_party/vendir/charts/1password-connect`
- A onepasswordsecret-cloudflare-api-token.yaml file (for cert-manager, keep as-is)
- Namespace definition for flux-system

Note: namespace-1password.yaml should be REMOVED - the 1password operator creates its target namespace automatically, and we wait for the operator to be ready before applying secrets.
</context>

<research>
Before implementing, look up the LATEST STABLE versions of these Helm charts (this is critical - do not use outdated versions):

1. **1password-connect** - https://1password.github.io/connect-helm-charts (already have v2.0.3, verify if current)
2. **kyverno** - https://kyverno.github.io/kyverno/ (get latest stable version)
3. **tailscale-operator** - https://pkgs.tailscale.com/helmcharts (get latest stable version)
4. **cloudflare-tunnel-ingress-controller** - https://github.com/STRRL/cloudflare-tunnel-ingress-controller (check their helm chart releases)
5. **external-dns** - https://kubernetes-sigs.github.io/external-dns/ (get latest stable version)

Use WebSearch or WebFetch to find the current versions. Pin to exact versions in vendir.yml.
</research>

<requirements>
## 1. Update Vendir Configuration
Add the following Helm charts to `third_party/vendir/vendir.yml`:
- kyverno (from kyverno helm repo)
- tailscale-operator (from tailscale helm repo)
- cloudflare-tunnel-ingress-controller (from STRRL's repo - check if OCI or traditional helm repo)
- external-dns (from kubernetes-sigs helm repo)

After updating vendir.yml, run `vendir sync` in the third_party/vendir directory to download the charts.

## 2. Create FluxCD Directory Structure
Restructure `stacks/enigma-cluster/` with this layout:

```
stacks/enigma-cluster/
├── kustomization.yaml              # Root kustomization that includes helmreleases/ and configs/
├── namespace-flux-system.yaml      # Keep existing
├── gitrepository-setup.yaml        # Keep existing
├── helmreleases/
│   ├── kustomization.yaml          # Aggregates all HelmRelease resources
│   ├── helmrelease-1password-operator.yaml
│   ├── helmrelease-kyverno.yaml
│   ├── helmrelease-tailscale-operator.yaml
│   ├── helmrelease-cloudflare-tunnel.yaml
│   └── helmrelease-external-dns.yaml
└── configs/
    ├── kustomization.yaml          # Aggregates secrets and policies, depends on helmreleases
    ├── onepasswordsecret-cloudflare-api-token.yaml      # Existing (for cert-manager)
    ├── onepasswordsecret-external-dns.yaml              # NEW
    ├── onepasswordsecret-cloudflare-tunnel.yaml         # NEW
    ├── onepasswordsecret-tailscale-operator.yaml        # NEW
    └── kyverno-policies.yaml
```

## 3. HelmRelease Resources
Each HelmRelease should:
- Be in namespace `flux-system`
- Reference the local chart via GitRepository `setup` (pattern: `third_party/vendir/charts/<chart-name>`)
- Use `interval: 30m` for reconciliation
- Include install/upgrade remediation with `retries: 3`
- Set appropriate `targetNamespace` for each operator
- Reference the appropriate secrets for configuration where needed

### HelmRelease Value Configurations

**external-dns** (targetNamespace: external-dns):
- Configure for Cloudflare provider
- Reference secret from `onepasswordsecret-external-dns` for API token
- The secret will have key `credential` containing the API token

**cloudflare-tunnel-ingress-controller** (targetNamespace: cloudflare-tunnel):
- Reference secret from `onepasswordsecret-cloudflare-tunnel` for API token
- The secret will have key `credential` containing the API token

**tailscale-operator** (targetNamespace: tailscale):
- Reference secret from `onepasswordsecret-tailscale-operator` for OAuth credentials
- The secret will have keys `username` (OAuth client ID) and `password` (OAuth secret)
- Configure oauth.clientId and oauth.clientSecret to reference these keys

## 4. OnePasswordItem Secrets
Create the following OnePasswordItem resources in `configs/`:

**onepasswordsecret-external-dns.yaml**:
```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: external-dns-cloudflare-api-token
  namespace: external-dns
spec:
  itemPath: vaults/setup-enigma-cluster/items/cloudflare-external-dns
```

**onepasswordsecret-cloudflare-tunnel.yaml**:
```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: cloudflare-tunnel-api-token
  namespace: cloudflare-tunnel
spec:
  itemPath: vaults/setup-enigma-cluster/items/cloudflare-tunnel-ingress-controller
```

**onepasswordsecret-tailscale-operator.yaml**:
```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: tailscale-operator-oauth
  namespace: tailscale
spec:
  itemPath: vaults/setup-enigma-cluster/items/tailscale-operator
```
Note: The tailscale-operator 1Password item has OAuth client ID stored in "username" field and OAuth secret in "password" field.

## 5. FluxCD Kustomization Dependencies
Use FluxCD's native Kustomization resources (not raw kustomize) to manage dependencies:

Create two FluxCD Kustomization resources in the root:
1. `kustomization-helmreleases.yaml` - Deploys all HelmRelease resources
2. `kustomization-configs.yaml` - Deploys configs/, depends on helmreleases being healthy

The configs kustomization MUST have:
```yaml
dependsOn:
  - name: helmreleases
```

And health checks to wait for CRDs to be available:
```yaml
healthChecks:
  - apiVersion: helm.toolkit.fluxcd.io/v2
    kind: HelmRelease
    name: 1password-operator
    namespace: flux-system
  - apiVersion: helm.toolkit.fluxcd.io/v2
    kind: HelmRelease
    name: kyverno
    namespace: flux-system
```

## 6. Kyverno Policies Placeholder
Create `configs/kyverno-policies.yaml` with a basic placeholder policy:
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Audit
  background: true
  rules:
    - name: check-for-labels
      match:
        any:
        - resources:
            kinds:
              - Pod
      validate:
        message: "The label 'app.kubernetes.io/name' is required."
        pattern:
          metadata:
            labels:
              app.kubernetes.io/name: "?*"
```
</requirements>

<constraints>
- Pin ALL Helm chart versions to exact versions (no semver ranges)
- Follow existing naming pattern: `helmrelease-<name>.yaml`, `onepasswordsecret-<name>.yaml`
- All HelmRelease resources must be in `flux-system` namespace
- Use FluxCD v2 API versions (`helm.toolkit.fluxcd.io/v2`, `kustomize.toolkit.fluxcd.io/v1`)
- Do not modify the existing onepasswordsecret-cloudflare-api-token.yaml content, only move it
- DELETE namespace-1password.yaml (operators create their own namespaces, and we wait for them)
- Ensure all YAML files pass yamllint
- Assume all 1Password items exist (they will be created asynchronously by the user)
</constraints>

<implementation>
1. First, research and find the latest stable versions of all required Helm charts
2. Update `third_party/vendir/vendir.yml` with new chart entries
3. Run `vendir sync` to download the charts
4. Create the new directory structure under stacks/enigma-cluster/
5. Move existing files to appropriate locations
6. DELETE namespace-1password.yaml (no longer needed)
7. Create new HelmRelease resources for each chart with appropriate value configurations
8. Create OnePasswordItem secrets for external-dns, cloudflare-tunnel, and tailscale-operator
9. Create FluxCD Kustomization resources with proper dependencies
10. Create the kyverno-policies.yaml placeholder
11. Validate all YAML with yamllint

For cloudflare-tunnel-ingress-controller, check if it uses OCI registry or traditional Helm repo format.
</implementation>

<output>
Modified files:
- `third_party/vendir/vendir.yml` - add new helm chart entries

New files in `stacks/enigma-cluster/`:
- `kustomization.yaml` - root kustomization
- `kustomization-helmreleases.yaml` - FluxCD Kustomization for helm releases
- `kustomization-configs.yaml` - FluxCD Kustomization for configs with dependency
- `helmreleases/kustomization.yaml`
- `helmreleases/helmrelease-1password-operator.yaml` (moved)
- `helmreleases/helmrelease-kyverno.yaml`
- `helmreleases/helmrelease-tailscale-operator.yaml`
- `helmreleases/helmrelease-cloudflare-tunnel.yaml`
- `helmreleases/helmrelease-external-dns.yaml`
- `configs/kustomization.yaml`
- `configs/onepasswordsecret-cloudflare-api-token.yaml` (moved, existing for cert-manager)
- `configs/onepasswordsecret-external-dns.yaml` (NEW)
- `configs/onepasswordsecret-cloudflare-tunnel.yaml` (NEW)
- `configs/onepasswordsecret-tailscale-operator.yaml` (NEW)
- `configs/kyverno-policies.yaml`

Deleted files:
- `stacks/enigma-cluster/namespace-1password.yaml` (DELETE - not needed)

Removed files (after moving):
- `stacks/enigma-cluster/helmrelease-1password-operator.yaml`
- `stacks/enigma-cluster/onepasswordsecret-cloudflare-api-token.yaml`
</output>

<verification>
After implementation, verify:
1. Run `vendir sync` in third_party/vendir/ succeeds and charts are downloaded
2. Run `trunk check` on all modified YAML files
3. Verify kustomization.yaml files are valid with `kustomize build stacks/enigma-cluster/helmreleases/`
4. Verify FluxCD Kustomization resources have correct dependsOn references
5. Confirm all HelmRelease chart paths point to existing vendir directories
6. Verify namespace-1password.yaml has been deleted
7. Verify all OnePasswordItem resources reference correct itemPaths
</verification>

<success_criteria>
- All 5 Helm charts are defined in vendir.yml with exact version pins
- vendir sync downloads all charts successfully
- Directory structure matches the specified layout
- FluxCD Kustomization for configs depends on helmreleases
- All YAML files pass trunk check validation
- kyverno-policies.yaml contains a valid basic ClusterPolicy
- Three new OnePasswordItem secrets created (external-dns, cloudflare-tunnel, tailscale-operator)
- namespace-1password.yaml is deleted
- HelmRelease values correctly reference their respective secrets
</success_criteria>
