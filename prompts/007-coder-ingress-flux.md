<objective>
Create a Flux directory structure at `apps/coder-cluster-prod` with an ingress resource that exposes Coder at `coder.enigma.vgijssel.nl`. The ingress must route traffic through a load balancer service to the coder-cluster-prod Kamaji tenant cluster, with TLS certificates managed by cert-manager.
</objective>

<context>
This task creates infrastructure to expose the Coder application running in the `coder-cluster-prod` Kamaji tenant cluster through the enigma cluster's ingress-nginx gateway. The load balancer service `adfc788849eea4e4981f8e354b3491a3` acts as the bridge between clusters.

Reference existing Flux patterns in:
- `apps/coder-prod/` - Example Flux directory structure with GitRepository, Kustomization, and kustomization.yaml
- `stacks/enigma-cluster/` - Target cluster configuration showing gitrepository and kustomization patterns

Current git branch: `mg/feat/deploy-coder`
</context>

<requirements>
1. Create directory `apps/coder-cluster-prod/` with full Flux GitOps structure:
   - `kustomization.yaml` - Local kustomize file listing all resources
   - `gitrepository-setup.yaml` - GitRepository pointing to this repo on branch `mg/feat/deploy-coder`
   - `kustomization-root.yaml` - Flux Kustomization pointing to the `apps/coder-cluster-prod` path
   - `ingress-coder.yaml` - The ingress resource

2. Ingress resource specifications:
   - Host: `coder.enigma.vgijssel.nl`
   - IngressClass: `tenant-root`
   - Backend service: `adfc788849eea4e4981f8e354b3491a3` (the load balancer service)
   - Backend port: 80 (standard HTTP port for load balancer services)
   - TLS enabled with cert-manager annotations for automatic certificate provisioning
   - Support both HTTP and HTTPS (cert-manager will handle the redirect/certificate)

3. Cert-manager annotations required:
   - `cert-manager.io/cluster-issuer: letsencrypt-prod` (or discover the correct issuer name from the codebase)
   - TLS secretName for storing the certificate

4. Apply the ingress directly to the enigma cluster for immediate testing
</requirements>

<implementation>
Follow the exact patterns from existing Flux directories:

For `gitrepository-setup.yaml`:
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: setup
  namespace: flux-system
spec:
  interval: 5m
  url: https://github.com/vgijssel/setup
  ref:
    branch: mg/feat/deploy-coder
```

For `kustomization-root.yaml` (Flux Kustomization):
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: coder-cluster-prod
  namespace: flux-system
spec:
  interval: 30m
  sourceRef:
    kind: GitRepository
    name: setup
  path: ./apps/coder-cluster-prod
  prune: true
  wait: true
  timeout: 10m
```

For `kustomization.yaml` (local kustomize):
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - gitrepository-setup.yaml
  - kustomization-root.yaml
  - ingress-coder.yaml
```

For the ingress, use `tenant-root` ingressClassName and appropriate cert-manager annotations.
</implementation>

<verification>
1. After creating files, apply the ingress directly to test:
   ```bash
   kubectl apply -f apps/coder-cluster-prod/ingress-coder.yaml
   ```

2. Verify the ingress was created:
   ```bash
   kubectl get ingress -A | grep coder
   ```

3. Wait for the Kyverno policy to create the Tailscale service. The `generate-tailscale-ingress` ClusterPolicy in `libs/internal-networking` automatically generates a Tailscale-backed Service for every `tenant-*` Ingress. Check for the generated service:
   ```bash
   kubectl get svc -n tenant-root | grep coder
   # Should see a service named like "{ingress-name}-tailscale"
   ```

4. Once the Tailscale service is created, external-dns will detect the `external-dns.alpha.kubernetes.io/hostname` annotation and create the `coder.enigma.vgijssel.nl` DNS record in Cloudflare pointing to the Tailscale service IP. Verify DNS propagation:
   ```bash
   # Check external-dns logs for the record creation
   kubectl logs -n external-dns -l app.kubernetes.io/name=external-dns --tail=50 | grep coder

   # Verify DNS resolution (may take a few minutes)
   dig coder.enigma.vgijssel.nl
   ```

5. Check certificate status:
   ```bash
   kubectl get certificate -A | grep coder
   ```

6. Test connectivity (after DNS propagation and cert issuance):
   ```bash
   curl -v http://coder.enigma.vgijssel.nl
   curl -v https://coder.enigma.vgijssel.nl
   ```
</verification>

<success_criteria>
- Directory `apps/coder-cluster-prod/` exists with all four required files
- All YAML files pass validation (valid Kubernetes manifests)
- Ingress is successfully applied to the cluster
- Kyverno generates the Tailscale service in `tenant-root` namespace (e.g., `coder-tailscale`)
- external-dns creates the `coder.enigma.vgijssel.nl` DNS record in Cloudflare
- Certificate is issued or in progress by cert-manager
- `https://coder.enigma.vgijssel.nl` serves content with valid TLS certificate
</success_criteria>

<notes>
- The load balancer service name `adfc788849eea4e4981f8e354b3491a3` is a Kamaji-generated name for cross-cluster service exposure
- The `tenant-root` ingressClassName triggers the Kyverno policy `generate-tailscale-ingress` which:
  1. Creates a Tailscale-backed Service named `{ingress-name}-tailscale` in the `tenant-root` namespace
  2. Adds `external-dns.alpha.kubernetes.io/hostname` annotation to the service
  3. external-dns detects this annotation and creates the DNS record in Cloudflare
- Cert-manager should automatically provision certificates when the ingress is created with the correct annotations
- If the cluster issuer name is unknown, search the codebase for `ClusterIssuer` or `Issuer` resources to find the correct name
</notes>
