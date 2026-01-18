<objective>
Enable wildcard subdomain support for Coder applications to allow subdomain-based app access (e.g., `https://ccw--refactor-dietpi--maarten.coder.enigma.vgijssel.nl/`) and disable path-based apps for improved security.

This change is required because:
1. Coder subdomain apps provide better security isolation between workspaces
2. Path-based apps can leak cookies between workspaces (security concern)
3. The Coder server is already configured for subdomain-only mode but the ingress infrastructure doesn't support it yet
</objective>

<context>
The Coder deployment uses a two-layer Kubernetes architecture:
- **enigma-cluster**: The host cluster running vcluster (virtual Kubernetes)
- **cluster-coder-prod**: The virtual Kubernetes cluster where Coder runs

Current state (Coder server is ready, but ingress isn't):
- `apps/coder-prod/helmrelease-coder.yaml` already has:
  - `CODER_WILDCARD_ACCESS_URL: "*.coder.enigma.vgijssel.nl"`
  - `CODER_DISABLE_PATH_APPS: "true"`
  - `wildcardHost: "*.coder.enigma.vgijssel.nl"` in ingress config
- `apps/coder-cluster-prod/ingress-coder.yaml` only handles `coder.enigma.vgijssel.nl` (no wildcard)
- `libs/internal-networking/` handles mirroring ingresses to gateway and updating Cloudflare DNS

Reference: https://coder.com/docs/tutorials/best-practices/security-best-practices#disable-path-based-apps
</context>

<research>
Before making changes, understand the current setup:

1. Check what ingress exists in the virtual cluster (cluster-coder-prod):
   ```bash
   kubectl --context cluster-coder-prod -n coder get ingress -o yaml
   ```

2. Examine the internal-networking Kyverno policy for DNS/Cloudflare handling:
   - Read `libs/internal-networking/templates/clusterpolicy-gateway-ingress.yaml`
   - Understand how hostnames are extracted and processed

3. Check if wildcard certificates work with cert-manager and Let's Encrypt:
   - Wildcard certs require DNS-01 challenge (not HTTP-01)
   - Verify if cert-manager ClusterIssuer supports DNS-01

4. Examine the vcluster sync configuration to understand how ingresses flow from virtual to host cluster
</research>

<requirements>
## 1. Update Host Cluster Ingress (apps/coder-cluster-prod/ingress-coder.yaml)

Add wildcard hostname and TLS support:
- Add `*.coder.enigma.vgijssel.nl` as a second host rule
- Add wildcard hostname to TLS section with appropriate certificate handling
- Ensure both the base domain and wildcard are covered
- Use `cert-manager.io/cluster-issuer: letsencrypt-prod` annotation

Note: Wildcard certificates require DNS-01 challenge. Verify the ClusterIssuer supports this.

## 2. Validate Virtual Cluster Ingress (cluster-coder-prod context)

Check if the Coder Helm chart already creates the wildcard ingress inside the virtual cluster:
- Run `kubectl --context cluster-coder-prod -n coder get ingress -o yaml`
- The Helm chart should create ingress with both hosts based on the helmrelease values
- If the virtual cluster ingress is correct, the issue may be vcluster sync configuration

## 3. Update internal-networking for Wildcard Support (libs/internal-networking/)

The Kyverno policy mirrors ingresses for Cloudflare DNS. Ensure it handles wildcards:
- Wildcards in DNS require a separate CNAME/A record for `*.coder.enigma.vgijssel.nl`
- The policy should preserve wildcard hostnames when mirroring
- Verify external-dns can handle wildcard records

## 4. Validate End-to-End Certificate and Access

After changes are applied:
- Verify wildcard certificate is issued: check `kubectl get certificate -A`
- Test access to a subdomain app: `https://ccw--refactor-dietpi--maarten.coder.enigma.vgijssel.nl/`
- Confirm path-based apps are disabled (should return error)
</requirements>

<implementation>
Step-by-step approach:

1. **Research phase**: Run the kubectl commands to understand current state
2. **Modify ingress-coder.yaml**: Add wildcard host and TLS configuration
3. **Test certificate issuance**: Verify wildcard cert is created
4. **Validate internal-networking**: Ensure Kyverno policy handles wildcards correctly
5. **End-to-end test**: Access a subdomain app URL

Key files to modify:
- `apps/coder-cluster-prod/ingress-coder.yaml` - Add wildcard support
- Possibly `libs/internal-networking/templates/clusterpolicy-gateway-ingress.yaml` - If wildcard handling needs updates

Do NOT modify:
- `apps/coder-prod/helmrelease-coder.yaml` - Already correctly configured
- Coder server environment variables - Already set correctly
</implementation>

<output>
After completing changes:
1. Modified `apps/coder-cluster-prod/ingress-coder.yaml` with wildcard support
2. Documentation of any changes needed to `libs/internal-networking/`
3. Verification results showing:
   - Wildcard certificate is valid
   - Subdomain app access works (e.g., `https://ccw--refactor-dietpi--maarten.coder.enigma.vgijssel.nl/`)
   - DNS records are created for wildcard
</output>

<verification>
Before declaring complete, verify:

1. **Certificate check**:
   ```bash
   kubectl --context enigma-cluster get certificate -A | grep coder
   ```
   Should show a valid wildcard certificate.

2. **DNS check**:
   ```bash
   dig +short "*.coder.enigma.vgijssel.nl"
   ```
   Should resolve to the gateway IP.

3. **Access check**:
   Test `https://ccw--refactor-dietpi--maarten.coder.enigma.vgijssel.nl/` in browser or:
   ```bash
   curl -I "https://ccw--refactor-dietpi--maarten.coder.enigma.vgijssel.nl/"
   ```
   Should return valid HTTPS response (or redirect to auth).

4. **Path-based apps disabled**:
   Accessing `https://coder.enigma.vgijssel.nl/@user/workspace.app/apps/app-name` should fail or redirect.
</verification>

<success_criteria>
- Wildcard certificate `*.coder.enigma.vgijssel.nl` is issued and valid
- DNS resolves `*.coder.enigma.vgijssel.nl` to the correct IP
- Subdomain-based app access works (e.g., web terminal, VS Code, custom apps)
- Path-based app access is disabled (returns error or redirect)
- All changes committed to the repository
</success_criteria>
