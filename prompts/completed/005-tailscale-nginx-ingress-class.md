<objective>
Update the internal-networking Helm chart to create per-Ingress Tailscale Services that point to the existing nginx-ingress controller pods.

This enables:
- Tailscale access with per-service ACLs (each Ingress gets its own Tailscale device)
- TLS termination via cert-manager certificates (already configured in nginx)
- All nginx features (auth, rate limiting, rewrites)
- No additional nginx deployment required
</objective>

<context>
The cluster has an existing nginx-ingress controller managed by cozystack:
- Namespace: tenant-root
- Service: root-ingress-controller (LoadBalancer via MetalLB at 192.168.50.100)
- Pod selector: `app.kubernetes.io/name=ingress-nginx, app.kubernetes.io/instance=ingress-nginx-system`

Current architecture:
```
Client → MetalLB (192.168.50.100) → nginx pods → backend
```

Target architecture (add Tailscale entry points):
```
Client → Tailscale Service (per-hostname) → nginx pods → backend
         100.x.x.x (unique per service)     ↑
                                    Already has cert-manager certs loaded!
```

Key insight: nginx-ingress pods can be reached via multiple Services. The original ingresses already configured cert-manager certificates. We just add Tailscale Services as additional entry points to the same nginx pods.

Reference files:
@libs/internal-networking/values.yaml
@libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml
@libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml
</context>

<requirements>
1. **Update Kyverno ClusterPolicy** to generate Tailscale Services pointing to nginx:
   - Watch Ingresses with class matching `{{ .Values.tailscaleIngress.sourceIngressClass }}`
   - Generate a Tailscale LoadBalancer Service that points to **nginx pods** (not backend pods)
   - Use the nginx pod selector: `app.kubernetes.io/name: ingress-nginx, app.kubernetes.io/instance: ingress-nginx-system`
   - Each Service gets unique `tailscale.com/hostname` annotation (for per-service ACLs)
   - Add `external-dns.alpha.kubernetes.io/hostname` annotation for DNS
   - Add `internal-networking: "true"` label for external-dns filtering
   - Skip Ingresses in `publicIngress` list (those use CloudFlare tunnel)
   - Skip Ingresses with `internal-networking: "true"` label (prevents loops)

2. **Create the Tailscale Services in the nginx namespace** (tenant-root):
   - Services must be in the same namespace as nginx pods for the selector to work
   - OR use ExternalName/endpoints if cross-namespace is required

3. **Configure values.yaml** with nginx pod selector:
   ```yaml
   tailscaleIngress:
     sourceIngressClass: tenant-root
     nginxSelector:
       app.kubernetes.io/name: ingress-nginx
       app.kubernetes.io/instance: ingress-nginx-system
     nginxNamespace: tenant-root
   ```

4. **Remove or update existing policies** that create Tailscale Services pointing to backend pods:
   - The existing `generate-tailscale-ingress` and `generate-tailscale-service` policies point to backend pods
   - These should be updated to point to nginx pods instead
   - Or create a new policy and disable the old ones
</requirements>

<implementation>
Thoroughly analyze the existing Kyverno policies before modifying.

The key change is the Service selector. Instead of:
```yaml
# OLD: Points to backend pods (copied from original service)
selector: "{{ backendService }}"
```

Use:
```yaml
# NEW: Points to nginx pods (fixed selector)
selector:
  app.kubernetes.io/name: ingress-nginx
  app.kubernetes.io/instance: ingress-nginx-system
```

Example generated Service:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: dashboard-tailscale
  namespace: tenant-root  # Same namespace as nginx!
  labels:
    internal-networking: "true"
    app.kubernetes.io/managed-by: kyverno
  annotations:
    tailscale.com/hostname: dashboard
    external-dns.alpha.kubernetes.io/hostname: dashboard.enigma.vgijssel.nl
spec:
  type: LoadBalancer
  loadBalancerClass: tailscale
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx-system
  ports:
    - name: https
      port: 443
      targetPort: 443
      protocol: TCP
```

Traffic flow:
```
Client (on Tailscale)
    → DNS: dashboard.enigma.vgijssel.nl → 100.x.x.x
    → Tailscale Service (dashboard-tailscale)
    → nginx pod (already has cert loaded from original Ingress!)
    → routes based on Host header
    → backend pod
```

Important considerations:
1. Services must be in `tenant-root` namespace to select nginx pods
2. The Kyverno policy must generate Services in a different namespace than the source Ingress
3. Use Helm templating for the nginx selector to make it configurable
4. Kyverno expression escaping: `{{"{{ }}"}}` for Kyverno expressions in Helm templates
</implementation>

<output>
Modify these files:

1. `./libs/internal-networking/values.yaml` - Add nginx selector configuration
2. `./libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - Update to point to nginx pods and generate in nginx namespace

Files to potentially remove or disable:
- `./libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml` - May be redundant after this change
</output>

<verification>
Before declaring complete:

1. Run `helm template` to verify rendering:
   ```bash
   helm template test ./libs/internal-networking/
   ```

2. Verify the generated Service:
   - Uses `loadBalancerClass: tailscale`
   - Has selector pointing to nginx pods (not backend pods)
   - Is created in the nginx namespace (tenant-root)
   - Has correct Tailscale and external-dns annotations

3. Verify Kyverno policy preconditions prevent infinite loops

4. Trace the expected traffic flow:
   - Tailscale Service → nginx pods → TLS termination → backend

5. **Git commit and push changes**:
   ```bash
   git add libs/internal-networking/
   git commit -m "Update internal-networking to route Tailscale through nginx

   - Tailscale Services now point to nginx pods instead of backend pods
   - Enables TLS termination with cert-manager certificates
   - Maintains per-service Tailscale ACLs via unique hostnames
   - No additional nginx deployment required

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   git push
   ```

6. **Reconcile with Flux CLI**:
   ```bash
   flux reconcile source git setup -n flux-system
   flux reconcile helmrelease internal-networking -n flux-system
   ```

7. **Verify deployment**:
   ```bash
   # Check the ClusterPolicy is updated
   kubectl get clusterpolicy -o wide

   # Check if Tailscale Services are created pointing to nginx
   kubectl get svc -n tenant-root -l internal-networking=true

   # Verify the service selector points to nginx pods
   kubectl get svc <service-name> -n tenant-root -o yaml | grep -A5 selector
   ```

8. **Validate DNS resolves to Tailscale IP**:
   ```bash
   # Query DNS - should return a Tailscale IP (100.x.x.x range)
   dig +short dashboard.enigma.vgijssel.nl

   # Verify it's a Tailscale IP (starts with 100.)
   dig +short dashboard.enigma.vgijssel.nl | grep -E '^100\.'
   ```

9. **Validate TLS certificate is valid**:
   ```bash
   # Check certificate details - should show valid cert for dashboard.enigma.vgijssel.nl
   # Note: Must be run from a machine on the Tailscale network
   echo | openssl s_client -connect dashboard.enigma.vgijssel.nl:443 -servername dashboard.enigma.vgijssel.nl 2>/dev/null | openssl x509 -noout -subject -issuer -dates

   # Verify certificate matches hostname (no SSL errors)
   curl -v --head https://dashboard.enigma.vgijssel.nl 2>&1 | grep -E 'SSL|subject|issuer|expire'
   ```

   Expected output:
   - Subject should include `dashboard.enigma.vgijssel.nl`
   - Issuer should be Let's Encrypt (or your cert-manager issuer)
   - Certificate should not be expired
   - No SSL verification errors

10. **Validate external-dns configuration and filtering**:
    ```bash
    # Check external-dns is configured to only sync services with internal-networking=true
    kubectl get helmrelease external-dns -n flux-system -o yaml | grep -A10 extraArgs

    # Verify the label filter is set
    # Should show: --label-filter=internal-networking=true
    ```

11. **Validate external-dns creates records ONLY for Kyverno-generated services**:
    ```bash
    # List all services with internal-networking=true label (these should get DNS records)
    kubectl get svc -A -l internal-networking=true -o custom-columns=NAMESPACE:.metadata.namespace,NAME:.metadata.name,HOSTNAME:.metadata.annotations.'external-dns\.alpha\.kubernetes\.io/hostname'

    # List services WITHOUT internal-networking=true (these should NOT get DNS records)
    # Verify original services don't have the label
    kubectl get svc -A --selector='!internal-networking' | head -20

    # Check external-dns logs to see which records it's managing
    kubectl logs -n external-dns deployment/external-dns --tail=50 | grep -E 'CREATE|UPDATE|DELETE|dashboard'
    ```

12. **Validate DNS record types (A vs CNAME)**:
    ```bash
    # Query DNS record type for dashboard.enigma.vgijssel.nl
    dig dashboard.enigma.vgijssel.nl ANY +short

    # Check if it's an A record (should be A record pointing to Tailscale IP)
    dig dashboard.enigma.vgijssel.nl A +short
    # Expected: 100.x.x.x (Tailscale IP)

    # Verify no CNAME exists (should be A record, not CNAME)
    dig dashboard.enigma.vgijssel.nl CNAME +short
    # Expected: empty (no CNAME)

    # Cross-check with CloudFlare API or DNS provider
    # The record should be type A pointing to the Tailscale LoadBalancer IP
    ```

    Expected DNS behavior:
    - Kyverno-generated services with `internal-networking=true` → external-dns creates A records
    - Original services without the label → NO external-dns records created
    - Record type should be A (not CNAME) pointing to Tailscale IP (100.x.x.x)
</verification>

<success_criteria>
- Kyverno policy generates Tailscale Services pointing to nginx pods
- Services are created in the nginx namespace (tenant-root)
- Each Ingress hostname gets its own Tailscale device (for ACLs)
- Traffic flows through nginx (TLS termination with cert-manager certs)
- No new nginx deployment required
- No mirrored Ingresses required
</success_criteria>
