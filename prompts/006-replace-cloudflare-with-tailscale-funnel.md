<objective>
Replace CloudFlare tunnel ingress with Tailscale Funnel for public ingress in the internal-networking library.

The current setup uses CloudFlare Tunnel for hosts listed in `publicIngress`, but CloudFlare's Universal SSL doesn't support multi-level subdomains like `keycloak.enigma.vgijssel.nl`. Instead, use Tailscale Funnel which provides the same public accessibility without SSL certificate limitations.
</objective>

<context>
This is a Kubernetes infrastructure change in an Nx monorepo. The internal-networking Helm chart uses Kyverno ClusterPolicies to automatically generate networking resources for ingresses.

Current architecture:
- `clusterpolicy-tailscale-ingress.yaml`: Creates Tailscale LoadBalancer Services for internal access (non-public hosts)
- `clusterpolicy-cloudflare-ingress.yaml`: Creates CloudFlare Tunnel Ingress for public hosts (listed in `publicIngress`)
- `clusterpolicy-tailscale-service.yaml`: Additional Tailscale service configuration

Target architecture:
- Merge public and internal into a single Tailscale approach
- Public hosts get `tailscale.com/funnel: "true"` annotation on their LoadBalancer Service
- Remove CloudFlare tunnel entirely

@libs/internal-networking/templates/clusterpolicy-cloudflare-ingress.yaml
@libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml
@libs/internal-networking/values.yaml
@stacks/enigma-cluster/helmrelease-cloudflare-tunnel.yaml
@stacks/enigma-cluster/helmrelease-internal-networking.yaml
@stacks/enigma-cluster/kustomization.yaml
</context>

<requirements>
1. **Remove CloudFlare components**:
   - Delete `libs/internal-networking/templates/clusterpolicy-cloudflare-ingress.yaml`
   - Delete `stacks/enigma-cluster/helmrelease-cloudflare-tunnel.yaml`
   - Update `stacks/enigma-cluster/kustomization.yaml` to remove the cloudflare-tunnel reference

2. **Modify Tailscale ingress policy** (`clusterpolicy-tailscale-ingress.yaml`):
   - Remove the precondition that skips hosts in `publicIngress` (line ~37-39: `operator: NotIn`)
   - Add conditional `tailscale.com/funnel: "true"` annotation when the host IS in `publicIngress`
   - Use Kyverno's conditional logic to add the funnel annotation only for public hosts

3. **Update values.yaml**:
   - Rename `publicIngress` to `funnelHosts` for clarity
   - Update any comments to reflect Tailscale Funnel instead of CloudFlare

4. **Ensure the generated Service for funnel hosts has**:
   - `tailscale.com/funnel: "true"` annotation
   - Same LoadBalancer Service pattern as internal hosts
   - Same external-dns and tailscale.com/hostname annotations
</requirements>

<implementation>
For the conditional funnel annotation in Kyverno, use this pattern in the generate data:

```yaml
metadata:
  annotations:
    # Always include these
    external-dns.alpha.kubernetes.io/hostname: "{{ host }}"
    tailscale.com/hostname: "{{ stripped_host }}"
    # Conditionally add funnel annotation - use Kyverno's conditional syntax
```

Kyverno supports conditional annotations using JMESPath. Research the exact syntax if needed, but the pattern is typically:
- Use a context variable to check if host is in funnelHosts
- Use `{{ variable || '' }}` patterns for conditional values

Alternative approach if conditional annotations are complex:
- Create TWO separate rules in the same ClusterPolicy:
  1. Rule for non-funnel hosts (host NOT in funnelHosts) - current behavior
  2. Rule for funnel hosts (host IN funnelHosts) - adds funnel annotation
</implementation>

<verification>
After making changes:

1. Run helm template to verify the ClusterPolicy renders correctly:
   ```bash
   helm template libs/internal-networking
   ```

2. Check that the kustomization.yaml is valid:
   ```bash
   kustomize build stacks/enigma-cluster --load-restrictor=LoadRestrictionsNone | head -100
   ```

3. Verify no references to cloudflare remain:
   ```bash
   grep -r "cloudflare" libs/internal-networking/ stacks/enigma-cluster/
   ```

4. Commit and push the changes:
   ```bash
   git add libs/internal-networking/ stacks/enigma-cluster/
   git commit -m "Replace CloudFlare tunnel with Tailscale Funnel for public ingress"
   git push
   ```

5. Reconcile with Flux to apply changes to the cluster:
   ```bash
   flux reconcile source git setup
   flux reconcile kustomization enigma-cluster --with-source
   ```

6. Verify the changes are applied in the cluster:
   ```bash
   # Check that cloudflare-tunnel namespace/resources are being removed
   kubectl get helmrelease -n flux-system | grep -E "cloudflare|internal-networking"

   # Check the ClusterPolicy is updated
   kubectl get clusterpolicy generate-tailscale-ingress -o yaml | grep -A5 funnel

   # Verify the generated service for keycloak has funnel annotation
   kubectl get svc -n cozy-keycloak -l kyverno.io/generated-by=generate-tailscale-ingress -o yaml | grep funnel
   ```

7. Validate that keycloak.enigma.vgijssel.nl works with a valid SSL certificate:
   ```bash
   # Wait for Tailscale Funnel to provision (may take a minute)
   sleep 30

   # Test SSL certificate is valid (should show certificate details, not an error)
   echo | openssl s_client -servername keycloak.enigma.vgijssel.nl -connect keycloak.enigma.vgijssel.nl:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates

   # Test HTTPS connection returns 200 OK
   curl -sI https://keycloak.enigma.vgijssel.nl | head -5
   ```

   **This is the critical validation** - the whole purpose of this change is to fix the SSL error.
   If the certificate test fails, investigate:
   - Is the Tailscale Funnel service created? `kubectl get svc -n cozy-keycloak | grep tailscale`
   - Is the funnel annotation present? `kubectl get svc <name> -o yaml | grep funnel`
   - Check Tailscale operator logs: `kubectl logs -n tailscale -l app.kubernetes.io/name=operator`
</verification>

<success_criteria>
- CloudFlare tunnel helmrelease removed from enigma-cluster
- CloudFlare ingress ClusterPolicy removed from internal-networking
- Tailscale ingress ClusterPolicy handles ALL hosts (both internal and funnel)
- Hosts in `funnelHosts` get the `tailscale.com/funnel: "true"` annotation
- Hosts NOT in `funnelHosts` do NOT get the funnel annotation
- Helm template renders without errors
- No remaining references to cloudflare in the affected directories
- Changes committed and pushed to remote
- Flux successfully reconciles the changes
- Cluster shows updated ClusterPolicy and generated Services with funnel annotation
- **keycloak.enigma.vgijssel.nl serves a valid SSL certificate (no ERR_SSL_VERSION_OR_CIPHER_MISMATCH)**
- **curl to https://keycloak.enigma.vgijssel.nl returns HTTP 200**
</success_criteria>
