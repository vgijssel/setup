<objective>
Update the @libs/internal-networking/ Helm chart to correctly handle updates to ClusterPolicy resources when template content changes.

Kyverno's admission webhook prevents in-place updates to certain immutable fields in ClusterPolicy generate rules. The solution must ensure that when a ClusterPolicy template changes, the existing resource is deleted before the new one is created.
</objective>

<context>
The internal-networking Helm chart contains two ClusterPolicy resources:
- `clusterpolicy-gateway-ingress.yaml` - mirrors ingresses to gateway IngressClass
- `clusterpolicy-tailscale-ingress.yaml` - generates Tailscale services for ingresses

When these templates change (especially preconditions or generate rules), Helm upgrade fails with:
```
admission webhook "validate-policy.kyverno.svc" denied the request:
changes of immutable fields of a rule spec in a generate rule is disallowed
```

This happens because Kyverno validates ClusterPolicy updates and rejects changes to immutable fields in generate rules.

@libs/internal-networking/templates/clusterpolicy-gateway-ingress.yaml
@libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml
@libs/internal-networking/Chart.yaml
</context>

<requirements>
1. Implement a mechanism to detect when ClusterPolicy templates have changed
2. Force deletion of existing ClusterPolicy before creating the new version when changes are detected
3. Solution must work with Flux HelmRelease deployments (no manual intervention)
4. Must not break normal Helm upgrade operations when templates haven't changed
5. Should be clean and maintainable - avoid complex workarounds if possible
</requirements>

<implementation>
Thoroughly analyze multiple approaches and select the best one:

**Approach 1: Helm hook with pre-upgrade delete**
- Use `helm.sh/hook: pre-upgrade` annotation to delete the policy before upgrade
- May need `helm.sh/hook-delete-policy` to clean up the hook job

**Approach 2: Hash-based resource naming or annotation**
- Include a hash of the template content in the resource name or annotation
- When template changes, hash changes, creating a new resource instead of updating

**Approach 3: Kyverno-specific annotations**
- Research if Kyverno supports any annotations to handle this scenario
- Check for `replace` or `recreate` policies

**Approach 4: Flux-specific handling**
- Use HelmRelease `install.crds` or similar mechanisms
- Check if Flux supports force-replace for specific resources

Consider:
- Which approach is most reliable across Helm upgrades?
- Which integrates best with GitOps/Flux workflows?
- Which is easiest to maintain long-term?
</implementation>

<research>
Before implementing, research:
1. Kyverno documentation for handling ClusterPolicy updates
2. Helm hooks documentation for pre-upgrade deletion patterns
3. Flux HelmRelease options for force-replacing resources
4. Common patterns used by other Helm charts for CRDs with immutable fields
</research>

<output>
Modify the following files as needed:
- `./libs/internal-networking/templates/clusterpolicy-gateway-ingress.yaml`
- `./libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml`
- `./libs/internal-networking/templates/` (any new helper templates if needed)
- `./libs/internal-networking/Chart.yaml` (if version bump needed)
</output>

<verification>
Before declaring complete, verify:
1. Run `helm template test ./libs/internal-networking` to ensure templates render correctly
2. Commit changes and push to remote
3. Reconcile with Flux using kubeconfig at `stacks/enigma-cozy/enigma.yaml`:
   - `KUBECONFIG=stacks/enigma-cozy/enigma.yaml flux reconcile source git setup -n flux-system`
   - `KUBECONFIG=stacks/enigma-cozy/enigma.yaml flux reconcile kustomization enigma-cluster -n flux-system`
4. Check HelmRelease status: `KUBECONFIG=stacks/enigma-cozy/enigma.yaml flux get helmrelease internal-networking -n flux-system`
5. Verify the ClusterPolicies are successfully created/updated without admission webhook errors
</verification>

<success_criteria>
- Helm upgrade succeeds when ClusterPolicy templates have changed
- No manual intervention required (works with automated GitOps)
- Existing resources are cleanly replaced, not orphaned
- Flux HelmRelease shows READY: True after reconciliation
- Solution is documented with comments explaining the approach
</success_criteria>
