<objective>
Fix the libs/internal-networking Helm chart's ClusterPolicy to generate working Tailscale Services.

The current implementation generates Tailscale LoadBalancer Services that don't route traffic because:
1. They use an invalid/non-existent `tailscale.com/tailnet-target-ip` annotation
2. They have no `selector` field, resulting in no endpoints
3. Traffic cannot reach the backend service

The fix requires the ClusterPolicy to look up the backend Service (referenced in the Ingress) and copy its selector to the generated Tailscale Service.
</objective>

<context>
This is a Kyverno ClusterPolicy in a Helm chart that watches Ingress resources with `ingressClassName: tenant-root` and generates corresponding Tailscale LoadBalancer Services.

Key files:
- `libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml` - The ClusterPolicy to fix
- `libs/internal-networking/values.yaml` - Helm values for configuration

Current broken flow:
```
Ingress (tenant-root) -> references backend Service -> backend has selector -> pods

Generated Tailscale Service:
- Has loadBalancerClass: tailscale (correct)
- Has tailscale.com/tailnet-target-ip annotation (INVALID - not recognized)
- Has NO selector (BROKEN - no endpoints created)
- Result: Tailscale proxy starts but has nowhere to route traffic
```

Required working flow:
```
Ingress (tenant-root) -> references backend Service (e.g., incloud-web-gatekeeper:8000)
                                    |
                                    v
Generated Tailscale Service:
- Has loadBalancerClass: tailscale
- Has SAME selector as backend Service (e.g., app.kubernetes.io/instance: incloud-web)
- Has targetPort matching backend port (e.g., 8000)
- Result: Tailscale proxy routes to pods via endpoints
```

Tested and confirmed working manually:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: test-tailscale-with-selector
  namespace: cozy-dashboard
  annotations:
    tailscale.com/hostname: test-dashboard
spec:
  type: LoadBalancer
  loadBalancerClass: tailscale
  selector:
    app.kubernetes.io/instance: incloud-web
    app.kubernetes.io/name: gatekeeper
  ports:
    - name: http
      port: 443
      targetPort: 8000
      protocol: TCP
```
</context>

<requirements>
1. Modify the ClusterPolicy to use Kyverno's context/API lookup to fetch the backend Service
2. Extract the backend Service's `spec.selector` field
3. Apply that selector to the generated Tailscale Service
4. Set the `targetPort` to match the backend Service port from the Ingress
5. Remove the invalid `tailscale.com/tailnet-target-ip` annotation
6. Keep all other existing functionality:
   - `tailscale.com/hostname` annotation (subdomain extraction)
   - `external-dns.alpha.kubernetes.io/hostname` annotation
   - `tailscale-dns: "true"` label for external-dns filtering
   - `loadBalancerClass: tailscale`
   - Preconditions for skipping public ingresses and skip annotations
</requirements>

<implementation>
Use Kyverno's context feature to look up the backend Service. The pattern should be:

```yaml
context:
  - name: backendService
    apiCall:
      urlPath: "/api/v1/namespaces/{{request.object.metadata.namespace}}/services/{{request.object.spec.rules[0].http.paths[0].backend.service.name}}"
      jmesPath: "spec.selector"
```

Then reference `{{backendService}}` in the generated Service's selector field.

Important considerations:
- Helm uses `{{ }}` for templating, Kyverno uses `{{ }}` for variables
- The current file uses `{{"{{"}}` and `{{"}}"}}` escaping for Kyverno expressions within Helm
- Ensure proper escaping so Helm doesn't interpret Kyverno expressions
- The API call must handle the case where the backend Service might not exist yet (use preconditions if needed)
</implementation>

<output>
Modify the file:
- `./libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml`

Do NOT modify:
- `values.yaml` (unless absolutely necessary)
- Any other files
</output>

<verification>
After making changes:

1. Render the Helm template to verify syntax:
```bash
helm template internal-networking ./libs/internal-networking
```

2. Check the rendered ClusterPolicy has:
   - A context section with apiCall to fetch the backend service
   - The generated Service spec includes a selector field
   - The targetPort is set from the Ingress backend port
   - No tailnet-target-ip annotation

3. Apply and test in the cluster:
```bash
# Reconcile the HelmRelease
flux reconcile helmrelease internal-networking -n flux-system

# Check the generated service has endpoints
kubectl get endpoints dashboard-web-ingress-tailscale -n cozy-dashboard

# Test connectivity
curl http://dashboard.tail2c33e2.ts.net:443
```
</verification>

<success_criteria>
- ClusterPolicy renders without Helm template errors
- Generated Tailscale Services have a `selector` field matching the backend Service
- Generated Tailscale Services have `targetPort` matching the backend port
- No `tailscale.com/tailnet-target-ip` annotation in generated Services
- Generated Services have endpoints (visible via `kubectl get endpoints`)
- Traffic flows through the Tailscale Service to the backend pods
</success_criteria>
