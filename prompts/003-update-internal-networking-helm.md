<objective>
Update the libs/internal-networking Helm chart to:
1. Remove configurability around tailscaleIngress (it's always enabled)
2. Remove the dummy clusterpolicy.yaml and its associated values
3. Add a `publicIngress` array that determines which hosts get CloudFlare tunnel ingress instead of Tailscale ingress
</objective>

<context>
The internal-networking Helm chart contains Kyverno policies for managing ingress mirroring. Currently:
- `tailscaleIngress.enabled` is a configurable option (should be always-on)
- `clusterpolicy.yaml` is a dummy "require-labels" policy that's no longer needed
- There's no support for CloudFlare tunnel ingress

The CloudFlare Tunnel Ingress Controller (https://github.com/STRRL/cloudflare-tunnel-ingress-controller) uses `ingressClassName: cloudflare-tunnel` to create public ingresses via CloudFlare tunnels.

Files to modify:
- @libs/internal-networking/values.yaml
- @libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml
- Delete: @libs/internal-networking/templates/clusterpolicy.yaml
</context>

<requirements>
1. **Remove tailscaleIngress.enabled toggle**:
   - Remove the `{{- if .Values.tailscaleIngress.enabled }}` conditional wrapper in clusterpolicy-tailscale-ingress.yaml
   - Remove `enabled: true` from values.yaml under tailscaleIngress
   - The Tailscale ingress policy should always be active

2. **Delete clusterpolicy.yaml**:
   - Delete the file `libs/internal-networking/templates/clusterpolicy.yaml`
   - Remove all `policy.*` values from values.yaml (validationFailureAction, background, labelName, labelRequired)

3. **Add publicIngress support**:
   - Add to values.yaml: `publicIngress: ["keycloak.enigma.vgijssel.nl"]` as an array of hostnames
   - Modify the Tailscale ingress policy to exclude hosts listed in publicIngress (don't create Tailscale ingress for them)
   - Create a NEW Kyverno ClusterPolicy in a new file `clusterpolicy-cloudflare-ingress.yaml` that:
     - Only matches nginx ingresses where the host is IN the publicIngress list
     - Generates a CloudFlare tunnel ingress (ingressClassName: cloudflare-tunnel) for those hosts
     - The generated ingress should mirror the structure of the Tailscale one but use cloudflare-tunnel class

4. **Update exclusion logic**:
   - Replace the `excludeNames` approach with host-based matching using the `publicIngress` array
   - Remove `excludeNames` and `excludeNamespaces` from values since publicIngress handles public exclusions
   - Keep the annotation-based skip (`tailscale-mirror/skip`) for edge cases

5. **CloudFlare ingress structure**:
   - ingressClassName: cloudflare-tunnel
   - Keep same backend service reference as source ingress
   - Include appropriate labels for kyverno management
   - Name pattern: `{{ request.object.metadata.name }}-cloudflare`
</requirements>

<implementation>
Use Kyverno's JMESPath expressions to check if a host is in the publicIngress list.

For the Tailscale policy precondition, add:
```yaml
# Skip hosts that should be public (CloudFlare tunnel)
- key: "{{ request.object.spec.rules[0].host }}"
  operator: NotIn
  value: {{ toJson .Values.publicIngress }}
```

For the CloudFlare policy precondition:
```yaml
# Only match hosts that should be public
- key: "{{ request.object.spec.rules[0].host }}"
  operator: In
  value: {{ toJson .Values.publicIngress }}
```
</implementation>

<output>
Modify:
- `./libs/internal-networking/values.yaml` - simplified with publicIngress array
- `./libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - remove conditional, add publicIngress exclusion

Create:
- `./libs/internal-networking/templates/clusterpolicy-cloudflare-ingress.yaml` - new policy for public hosts

Delete:
- `./libs/internal-networking/templates/clusterpolicy.yaml`
</output>

<verification>
After making changes:
1. Run `helm template libs/internal-networking` to verify the templates render correctly
2. Verify that clusterpolicy.yaml is deleted
3. Verify values.yaml no longer has `policy.*` keys or `tailscaleIngress.enabled`
4. Verify both cluster policies reference the same `publicIngress` array for consistent behavior
</verification>

<development_workflow>
Follow this iterative development workflow:

1. **Suspend Flux HelmRelease** (prevent Flux from overwriting manual changes):
   ```bash
   flux suspend helmrelease internal-networking -n flux-system
   ```

2. **Apply directly to cluster for testing**:
   ```bash
   helm upgrade --install internal-networking ./libs/internal-networking -n kyverno --create-namespace
   ```

3. **Validate the policies work**:
   - Check the ClusterPolicies are created: `kubectl get clusterpolicy`
   - Verify policy reports: `kubectl get policyreport -A`
   - Test by examining an existing nginx ingress to see if Tailscale/CloudFlare ingresses are generated

4. **Iterate until working**:
   - Make changes to templates/values
   - Re-run helm upgrade to apply changes
   - Verify behavior

5. **Clean up helm release** (once validated):
   ```bash
   helm uninstall internal-networking -n kyverno
   ```
   The Flux GitOps flow will manage the actual deployment.

6. **Commit and push**:
   ```bash
   git add libs/internal-networking/
   git commit -m "Update internal-networking: always-on Tailscale, add CloudFlare public ingress support"
   git push
   ```

7. **Resume Flux HelmRelease and reconcile**:
   ```bash
   flux resume helmrelease internal-networking -n flux-system
   flux reconcile source git flux-system
   flux reconcile helmrelease internal-networking -n flux-system
   ```
   Wait for Flux to apply the changes and verify the policies are active.
</development_workflow>

<success_criteria>
- No `if .Values.tailscaleIngress.enabled` conditionals remain
- clusterpolicy.yaml is deleted and policy values removed
- publicIngress array exists with keycloak.enigma.vgijssel.nl as initial value
- Tailscale policy excludes hosts in publicIngress array
- CloudFlare policy only processes hosts in publicIngress array
- `helm template` renders without errors
- Helm release cleaned up after validation
- Changes committed, pushed, and reconciled via Flux
</success_criteria>
