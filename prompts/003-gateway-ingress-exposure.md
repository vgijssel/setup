<objective>
Update @libs/internal-networking to enable public internet exposure of ingresses via gateway nodes.

This change allows services to be exposed to the public internet through a VPS gateway node (here-i-am) instead of only being accessible via Tailscale. When an ingress has the label `internal-networking/expose: true`, it should be routed through a gateway-specific nginx ingress controller that runs exclusively on gateway nodes.
</objective>

<context>
The internal-networking Helm chart currently:
- Creates Tailscale-backed Services for every `tenant-root` Ingress via Kyverno ClusterPolicy
- Has a `funnelHosts` feature for Tailscale Funnel (being removed)
- Uses external-dns to manage DNS for services with `internal-networking=true` label

Cozystack dynamically creates `tenant-*` ingress classes (e.g., `tenant-root`, `tenant-other`). We need to create corresponding gateway versions of these ingress classes that schedule pods only on gateway nodes.

Key files:
- `libs/internal-networking/values.yaml` - Helm values
- `libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - Current Kyverno policy
- `libs/internal-networking/templates/rbac-service-generation.yaml` - RBAC for Kyverno
- `stacks/enigma-cluster/helmrelease-external-dns.yaml` - External-DNS configuration

Gateway node identification: Nodes with label `node.kubernetes.io/role: gateway`
</context>

<requirements>
1. **Create Gateway IngressClass Generator (Kyverno ClusterPolicy)**
   - Watch for IngressClass resources matching pattern `tenant-*`
   - For each `tenant-X` IngressClass, generate a corresponding `tenant-X-gateway` IngressClass
   - The gateway IngressClass must have node affinity restricting pods to nodes with label `node.kubernetes.io/role: gateway`
   - Use Kyverno's `generate` with `synchronize: true` so changes propagate

2. **Mirror Ingresses to Gateway IngressClass (Kyverno ClusterPolicy)**
   - Watch for Ingress resources with label `internal-networking/expose: true`
   - Create a copy of the ingress with:
     - Name: `{original-name}-gateway`
     - IngressClassName: `{original-ingressClassName}-gateway` (e.g., `tenant-root` → `tenant-root-gateway`)
     - Label `internal-networking: "true"` for external-dns tracking
     - Preserve all other specs (rules, TLS, annotations except conflicting ones)
   - The mirrored ingress should be in the same namespace as the original

3. **Update Tailscale Service Generation Policy**
   - Modify existing rules to SKIP ingresses that have label `internal-networking/expose: true`
   - These ingresses should NOT create Tailscale services (they use gateway instead)
   - Add precondition: `internal-networking/expose` label must NOT equal `true`

4. **Remove funnelHosts Feature**
   - Remove `funnelHosts` from values.yaml
   - Remove the `mirror-ingress-to-tailscale-service-funnel` rule from clusterpolicy
   - Remove any funnel-related annotations and logic
   - Consolidate to single Tailscale service generation rule

5. **Update External-DNS Configuration**
   - Modify `stacks/enigma-cluster/helmrelease-external-dns.yaml`
   - Add `ingress` to the `sources` list (currently only `service`)
   - Keep the label filter `--label-filter=internal-networking=true`
   - This ensures both Tailscale services AND gateway ingresses are tracked

6. **Update RBAC**
   - Ensure Kyverno has permissions to create/manage IngressClass resources
   - Add to `libs/internal-networking/templates/rbac-service-generation.yaml`
</requirements>

<implementation>
Use these Kyverno patterns:

For IngressClass generation, watch IngressClass and generate new ones:
```yaml
match:
  any:
    - resources:
        kinds:
          - IngressClass
preconditions:
  all:
    - key: "{{ request.object.metadata.name }}"
      operator: Matches
      value: "tenant-*"
    - key: "{{ request.object.metadata.name }}"
      operator: NotEquals
      value: "*-gateway"  # Don't process gateway classes
```

For the generated IngressClass, include node affinity in the controller spec or use annotations that nginx-ingress respects. Research the correct approach for nginx-ingress node affinity via IngressClass.

For ingress mirroring:
```yaml
match:
  any:
    - resources:
        kinds:
          - Ingress
preconditions:
  all:
    - key: '{{ request.object.metadata.labels."internal-networking/expose" || '''' }}'
      operator: Equals
      value: "true"
```

Naming conventions:
- Gateway IngressClass: `tenant-X-gateway` (e.g., `tenant-root-gateway`)
- Mirrored Ingress: `{name}-gateway`
- Labels: `internal-networking: "true"` for external-dns tracking
</implementation>

<output>
Modify these files:
- `libs/internal-networking/values.yaml` - Remove funnelHosts, add gateway node selector config
- `libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - Update with new logic
- `libs/internal-networking/templates/rbac-service-generation.yaml` - Add IngressClass permissions
- `stacks/enigma-cluster/helmrelease-external-dns.yaml` - Add ingress source

Create if needed:
- `libs/internal-networking/templates/clusterpolicy-gateway-ingressclass.yaml` - For IngressClass generation (or add to existing policy)
</output>

<verification>
Before completing, verify:
1. Run `helm template libs/internal-networking` to ensure templates render without errors
2. Check that the Kyverno policy YAML is valid
3. Verify RBAC includes all necessary permissions (services, ingresses, ingressclasses)
4. Confirm external-dns helmrelease includes both `service` and `ingress` in sources
5. Ensure no references to funnelHosts remain in the chart
</verification>

<deployment>
After implementation, deploy and validate the changes in the live cluster:

1. **Commit and Push**
   - Stage all changed files
   - Create a descriptive commit message summarizing the changes
   - Push to the remote repository

2. **Reconcile with Flux**
   - Run `flux reconcile source git setup -n flux-system` to pull latest changes
   - Run `flux reconcile helmrelease internal-networking -n flux-system` to apply the Helm chart
   - Run `flux reconcile helmrelease external-dns -n flux-system` to apply external-dns changes
   - Wait for reconciliation to complete and verify no errors

3. **Verify Kyverno Policies**
   - Check policies are applied: `kubectl get clusterpolicies`
   - Verify policy status is ready and not in error state
   - Check for any Kyverno policy reports: `kubectl get policyreports -A`

4. **Create Test Ingress**
   - Create a test ingress with the `internal-networking/expose: true` label in a test namespace
   - Example test ingress:
     ```yaml
     apiVersion: networking.k8s.io/v1
     kind: Ingress
     metadata:
       name: test-gateway-exposure
       namespace: tenant-root
       labels:
         internal-networking/expose: "true"
     spec:
       ingressClassName: tenant-root
       rules:
         - host: test-gateway.enigma.vgijssel.nl
           http:
             paths:
               - path: /
                 pathType: Prefix
                 backend:
                   service:
                     name: test-service
                     port:
                       number: 80
     ```
   - Apply the test ingress: `kubectl apply -f <test-ingress.yaml>`

5. **Validate Kyverno Generated Resources**
   - Check that the `-gateway` IngressClass was created: `kubectl get ingressclass | grep gateway`
   - Check that the mirrored ingress was created: `kubectl get ingress -n tenant-root | grep gateway`
   - Verify NO Tailscale service was created for this ingress: `kubectl get svc -n tenant-root | grep test-gateway`
   - Verify the mirrored ingress has `internal-networking: "true"` label

6. **Cleanup Test Resources**
   - Delete the test ingress after validation
   - Verify Kyverno cleans up the generated resources (synchronize: true)
</deployment>

<success_criteria>
- Gateway IngressClass generator policy creates `tenant-X-gateway` for each `tenant-X` IngressClass
- Ingresses with `internal-networking/expose: true` are mirrored to gateway ingress class
- Ingresses with `internal-networking/expose: true` do NOT create Tailscale services
- External-DNS watches both services and ingresses with `internal-networking=true` label
- funnelHosts feature is completely removed
- All templates render successfully with `helm template`
- Changes are committed, pushed, and reconciled via Flux without errors
- Test ingress creates the expected gateway ingress and IngressClass
- No Tailscale service is created for ingresses with the expose label
</success_criteria>
