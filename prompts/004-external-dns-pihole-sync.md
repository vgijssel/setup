<objective>
Add a second external-dns instance to sync all ingress DNS records to a Pi-hole instance at 192.168.50.2.

This enables automatic DNS resolution for internal services on the home network - when ingresses are created/updated in the enigma cluster, their DNS records will be automatically synced to Pi-hole, eliminating the need for manual DNS record management in `apps/pihole-prod/group_vars/pihole.yml`.
</objective>

<context>
The enigma cluster has:
- Multiple ingress records across different namespaces
- An existing external-dns instance syncing to Cloudflare (for public DNS)
- MetalLB IP pool: 192.168.50.100-192.168.50.150
- Pi-hole version >= 6.0 running at 192.168.50.2 on VLAN 50

Current external-dns setup (Cloudflare):
- `apps/enigma-cluster/helmrelease-external-dns.yaml` - uses Cloudflare provider

Pi-hole v6+ uses a new API - see https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pihole.md

Note: Pi-hole does NOT support TXT records, so external-dns ownership tracking via TXT records is not available. Use `registry: noop` to disable ownership tracking.

@libs/internal-networking/Chart.yaml
@libs/internal-networking/values.yaml
@apps/enigma-cluster/helmrelease-external-dns.yaml
@apps/enigma-cluster/gitrepository-setup.yaml
@apps/enigma-cluster/kustomization.yaml
</context>

<research>
Before implementing, research:

1. External-dns Pi-hole provider configuration for Pi-hole v6+:
   - Check the tutorial: https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pihole.md
   - Pi-hole v6 uses different API endpoints than v5
   - Determine required environment variables for v6 API authentication

2. IP resolution:
   - Confirm external-dns reads IP from ingress status (`.status.loadBalancer.ingress[0].ip`)
   - This should resolve to 192.168.50.100 automatically for tenant-root ingresses
</research>

<requirements>
1. Create a new HelmRelease for external-dns with Pi-hole provider in `apps/enigma-cluster/`:
   - Name: `external-dns-pihole`
   - Namespace: `external-dns` (same as Cloudflare instance)
   - Use the same chart: `third_party/vendir/charts/external-dns`

2. Configure the Pi-hole provider for v6+:
   - Provider: `pihole`
   - Server URL: `http://192.168.50.2`
   - Configure for Pi-hole v6 API (not legacy v5 API)

3. Configure to sync ALL ingress records:
   - Do NOT apply any label filter or ingress class filter
   - Source: ingress (all ingresses in the cluster)

4. Disable ownership tracking (Pi-hole doesn't support TXT records):
   - Set `registry: noop` to disable TXT-based ownership tracking

5. Pi-hole API credentials:
   - 1Password item path: `vaults/setup-enigma-cluster/items/pihole-api-credential`
   - Use the 1password-secrets helm chart pattern (OnePasswordItem CRD)
   - Reference the secret in the HelmRelease env configuration

6. Update `apps/enigma-cluster/kustomization.yaml` to include the new resources
</requirements>

<implementation>
Follow the existing patterns in this codebase:

1. Use HelmRelease (Flux CD) pattern from `helmrelease-external-dns.yaml`
2. Use 1Password for secret management via OnePasswordItem CRD
3. Follow the dependency structure (depends on 1password-secrets)

Example credential configuration:
```yaml
env:
  - name: EXTERNAL_DNS_PIHOLE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: external-dns-pihole-credential
        key: credential
```

Create a OnePasswordItem resource:
```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: external-dns-pihole-credential
  namespace: external-dns
spec:
  itemPath: "vaults/setup-enigma-cluster/items/pihole-api-credential"
```
</implementation>

<development_workflow>
Use the FluxCD development workflow:

1. Update `apps/enigma-cluster/gitrepository-setup.yaml` to point to the current branch (`mg/fix/coder-subdomain-apps`)

2. Make changes to the configuration files

3. Commit the changes with a descriptive message

4. Push the changes to the remote branch

5. Use flux CLI to reconcile:
   ```bash
   flux reconcile source git setup -n flux-system
   flux reconcile helmrelease external-dns-pihole -n flux-system
   ```

6. Validate with kubectl:
   ```bash
   kubectl get helmrelease -n flux-system external-dns-pihole
   kubectl get pods -n external-dns
   kubectl logs -n external-dns -l app.kubernetes.io/instance=external-dns-pihole
   ```

7. On error, investigate logs and return to step 2
</development_workflow>

<constraints>
- Do NOT modify the existing Cloudflare external-dns instance
- Use `registry: noop` since Pi-hole doesn't support TXT records for ownership tracking
- Use pinned versions for any new dependencies (per CLAUDE.md guidelines)
- Pi-hole is version >= 6.0 - use the v6 API configuration
- The Pi-hole instance is on VLAN 50 (192.168.50.0/24)
</constraints>

<output>
Create/modify these files:
- `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` - new HelmRelease for Pi-hole external-dns
- `apps/enigma-cluster/onepassworditem-external-dns-pihole.yaml` - 1Password secret sync
- `apps/enigma-cluster/kustomization.yaml` - add new resources
- `apps/enigma-cluster/gitrepository-setup.yaml` - update branch reference for development
</output>

<verification>
After implementation:
1. Check HelmRelease status: `kubectl get helmrelease -n flux-system external-dns-pihole`
2. Check deployment: `kubectl get pods -n external-dns -l app.kubernetes.io/instance=external-dns-pihole`
3. Check logs: `kubectl logs -n external-dns -l app.kubernetes.io/instance=external-dns-pihole`
4. Verify DNS records appear in Pi-hole admin UI at http://192.168.50.2/admin
5. Test DNS resolution: `dig @192.168.50.2 dashboard.enigma.vgijssel.nl`
6. Confirm existing Cloudflare sync is unaffected
</verification>

<success_criteria>
- New external-dns-pihole deployment running in external-dns namespace
- All ingress hostnames automatically synced to Pi-hole
- DNS queries to Pi-hole resolve to correct MetalLB IPs
- Manual DNS records in `apps/pihole-prod/group_vars/pihole.yml` can be removed
- No impact to existing Cloudflare external-dns instance
</success_criteria>
