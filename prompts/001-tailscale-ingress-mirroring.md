<objective>
Create a Kyverno ClusterPolicy in libs/internal-networking that mirrors Ingress resources to Tailscale-backed Ingress and Service pairs.

For every Ingress with ingressClassName "tenant-root" (without label `internal-networking: "true"`), the policy should:
1. Create a new Ingress with "-tailscale" suffix, same namespace, same cert-manager annotations, label `internal-networking: "true"`
2. Create a new Service with "-tailscale" suffix that copies the selector from the original backend service but uses `loadBalancerClass: tailscale`, label `internal-networking: "true"`

The `internal-networking: "true"` label serves two purposes:
1. Prevents Kyverno from re-processing generated ingresses (loop prevention)
2. Allows external-dns to filter and only sync services with this label

This enables zero-trust access where each application gets its own Tailscale device with a custom domain name (via external-dns), inspired by https://medium.com/@mattiaforc/zero-trust-kubernetes-ingress-with-tailscale-operator-cert-manager-and-external-dns-8f42272f8647
</objective>

<context>
Examine the existing Kyverno policies in the libs/internal-networking Helm chart:
- `libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml` - Creates Tailscale Services for ingresses
- `libs/internal-networking/templates/clusterpolicy-cloudflare-ingress.yaml` - Creates CloudFlare tunnel ingresses
- `libs/internal-networking/values.yaml` - Contains configuration values
- `libs/internal-networking/templates/rbac-service-generation.yaml` - RBAC for service generation

Also examine the external-dns configuration:
- Search for external-dns HelmRelease in `stacks/enigma-cluster/infrastructure/`
- Understand how to configure label filtering for service sources

Follow the existing patterns in these files for:
- Helm template escaping (double curly braces)
- Kyverno preconditions and context lookups
- Label conventions (app.kubernetes.io/managed-by, kyverno.io/generated-by)
- Annotation patterns for external-dns and tailscale
</context>

<requirements>
1. Create a new ClusterPolicy template file: `clusterpolicy-tailscale-ingress.yaml`

2. The policy MUST have these preconditions to prevent infinite loops:
   - Match only Ingress with `ingressClassName: tenant-root`
   - EXCLUDE Ingress that has label `internal-networking: "true"` (critical for loop prevention)
   - Skip hosts in the publicIngress list (those go through CloudFlare)
   - Honor a skip annotation `tailscale-ingress-mirror/skip: "true"`

3. Generate TWO resources from each matching Ingress:

   **Resource A: Tailscale Service**
   - Name: `{{ original-ingress-name }}-tailscale`
   - Namespace: same as source ingress
   - Labels: `internal-networking: "true"`, `app.kubernetes.io/managed-by: kyverno`, `kyverno.io/generated-by: generate-tailscale-ingress`
   - Use context/apiCall to fetch the original service's selector (same pattern as existing clusterpolicy-tailscale-service.yaml)
   - Spec:
     - type: LoadBalancer
     - loadBalancerClass: tailscale
     - externalTrafficPolicy: Cluster
     - selector: copied from original backend service
     - ports: HTTPS on 443, targetPort from original ingress backend

   **Resource B: Tailscale Ingress**
   - Name: `{{ original-ingress-name }}-tailscale`
   - Namespace: same as source ingress
   - Labels: `internal-networking: "true"` (CRITICAL - prevents re-processing by this policy), `app.kubernetes.io/managed-by: kyverno`, `kyverno.io/generated-by: generate-tailscale-ingress`
   - Copy cert-manager annotations from source ingress (cluster-issuer, common-name, etc.)
   - Spec:
     - ingressClassName: tenant-root (same class, but label prevents re-matching)
     - tls: copy from source ingress
     - rules: same host, same path, but backend points to the new `-tailscale` Service

4. Update external-dns HelmRelease to filter services:
   - Find the external-dns HelmRelease configuration in the stacks
   - Add label filter so external-dns only syncs Service resources that have label `internal-networking: "true"`
   - This prevents external-dns from creating DNS records for services not managed by this policy

5. Add any necessary values to values.yaml if needed

6. Update RBAC if needed for the new policy to generate resources
</requirements>

<implementation>
Follow Kyverno generate policy patterns:
- Use `generateExisting: true` to process existing ingresses
- Use `synchronize: true` to keep generated resources in sync
- Use proper Helm escaping: `{{"{{ kyverno-expression }}"}}`
- For nested templates like replace_all, use: `{{` + "`{{`" + `}} expression {{` + "`}}`" + `}}`

The key difference from the existing tailscale-service policy is:
- This creates BOTH an Ingress AND a Service
- The generated Ingress has label `internal-networking: "true"` which prevents re-processing
- The generated Ingress points to the generated Service (not the original)

For the Tailscale annotations on the Service:
- `external-dns.alpha.kubernetes.io/hostname`: The original host from the ingress
- `tailscale.com/hostname`: The host with domain suffix stripped (use replace_all)

For external-dns label filtering:
- Find the external-dns HelmRelease in `stacks/enigma-cluster/infrastructure/`
- Add `--label-filter=internal-networking=true` to the args or use the values equivalent
- This ensures external-dns only creates DNS records for services explicitly managed by this policy
</implementation>

<output>
Create/modify these files:
- `./libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - New policy file
- `./libs/internal-networking/values.yaml` - Add any needed values (if required)
- `./libs/internal-networking/templates/rbac-service-generation.yaml` - Update RBAC if needed
- `./stacks/enigma-cluster/infrastructure/helmrelease-external-dns.yaml` (or similar) - Add label filter for `internal-networking: "true"`
</output>

<verification>
After creating the policy:
1. Run `helm template ./libs/internal-networking` to verify the template renders without errors
2. Check that the preconditions properly exclude ingresses with label `internal-networking: "true"`
3. Verify both Service and Ingress are generated with correct names and labels
4. Confirm the generated Ingress backend points to the generated Service (with -tailscale suffix)
5. Verify external-dns HelmRelease has the label filter configured
</verification>

<success_criteria>
- Policy creates both Ingress and Service with "-tailscale" suffix
- Generated Ingress and Service have label `internal-networking: "true"`
- Label `internal-networking: "true"` prevents infinite loops (Kyverno excludes ingresses with this label)
- Generated Service uses loadBalancerClass: tailscale
- Generated Ingress points to generated Service
- external-dns is configured to only sync services with `internal-networking: "true"` label
- Helm template renders without errors
- Follows existing code patterns in the chart
</success_criteria>
