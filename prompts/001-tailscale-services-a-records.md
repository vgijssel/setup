<objective>
Refactor the internal-networking Helm chart to generate Tailscale Services (instead of Ingresses) with A records pointing to Tailscale device IPs, and fix the ClusterPolicy immutable field update issue.

The goal is to make `dashboard.enigma.vgijssel.nl` resolve correctly ONLY when connected to the Tailnet by:
1. Creating Services instead of Ingresses (Tailscale assigns IPs to Services, not Ingresses)
2. Using A records (pointing to Tailscale device IPs) instead of CNAME records
3. Configuring external-dns to sync Services with a specific label instead of Ingresses
</objective>

<context>
This is a Kubernetes infrastructure change in an Nx monorepo.

Key files:
- `@libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml` - Kyverno policy that generates Tailscale resources
- `@libs/internal-networking/values.yaml` - Helm chart values
- `@libs/internal-networking/Chart.yaml` - Chart metadata
- `@stacks/enigma-cluster/helmrelease-external-dns.yaml` - External-DNS HelmRelease configuration

Current behavior:
- Kyverno generates Tailscale Ingresses with CNAME annotations for external-dns
- External-dns syncs Ingresses with `--ingress-class=tailscale`
- CNAME records point to `*.tail2c33e2.ts.net` domain

Problem:
- Tailscale assigns IPs to Services, not to Ingresses directly
- CNAME records don't resolve properly outside Tailnet context
- A records pointing to Tailscale device IPs will only resolve when connected to Tailnet

ClusterPolicy update issue:
- Error: "changes of immutable fields of a rule spec in a generate rule is disallowed"
- Kyverno does not allow modifying certain fields of generate rules in-place
- Solution: Delete and recreate the ClusterPolicy when template changes
</context>

<requirements>
1. **Modify ClusterPolicy to generate Services instead of Ingresses**:
   - Change `generate.kind` from `Ingress` to `Service`
   - Change `generate.apiVersion` to `v1`
   - Configure the Service spec with appropriate `type: ClusterIP` or `LoadBalancer`
   - Add label `tailscale-dns: "true"` to generated Services for external-dns filtering
   - Keep the `external-dns.alpha.kubernetes.io/hostname` annotation
   - Remove the `external-dns.alpha.kubernetes.io/target` annotation (A records don't need a target - external-dns will use the Service's external IP)
   - Ensure the Service references the same backend as the original Ingress

2. **Configure Service for Tailscale**:
   - Use `tailscale.com/expose: "true"` annotation to expose via Tailscale
   - Use `tailscale.com/hostname: "<subdomain>"` annotation for the Tailscale device name
   - The hostname should be extracted from the source Ingress host (e.g., `grafana` from `grafana.enigma.vgijssel.nl`)

3. **Update external-dns HelmRelease**:
   - Change from syncing Ingresses to syncing Services
   - Filter by label `tailscale-dns=true` instead of ingress class
   - Remove `--ingress-class=tailscale` extraArg
   - Add `--source=service` and `--label-filter=tailscale-dns=true`

4. **Fix ClusterPolicy immutable fields error**:
   - Add Helm pre-upgrade hook to delete the existing ClusterPolicy before upgrade
   - Or use `helm.sh/hook: pre-upgrade,pre-install` with `helm.sh/hook-delete-policy: before-hook-creation`
   - This ensures Kyverno sees a fresh resource instead of an update

5. **Rename the template file**:
   - Rename `clusterpolicy-tailscale-ingress.yaml` to `clusterpolicy-tailscale-service.yaml` (or similar) to reflect the change

6. **Bump Chart version**:
   - Increment the version in `Chart.yaml`
</requirements>

<implementation>
Step 1: Suspend Flux reconciliation for both HelmReleases
```bash
flux suspend helmrelease internal-networking -n flux-system
flux suspend helmrelease external-dns -n flux-system
```

Step 2: Modify the ClusterPolicy template
- Read and update `@libs/internal-networking/templates/clusterpolicy-tailscale-ingress.yaml`
- Change to generate Service resources with:
  ```yaml
  generate:
    synchronize: true
    apiVersion: v1
    kind: Service
    name: "{{"{{ request.object.metadata.name }}"}}-tailscale"
    namespace: "{{"{{ request.object.metadata.namespace }}"}}"
    data:
      metadata:
        labels:
          app.kubernetes.io/managed-by: kyverno
          kyverno.io/generated-by: generate-tailscale-service
          tailscale-dns: "true"
        annotations:
          external-dns.alpha.kubernetes.io/hostname: "{{"{{ request.object.spec.rules[0].host }}"}}"
          tailscale.com/expose: "true"
          tailscale.com/hostname: "..."  # extracted subdomain
      spec:
        type: ClusterIP
        selector: ...  # match the backend service's selector
        ports: ...
  ```

Step 3: Create a pre-upgrade hook to delete the ClusterPolicy
- Create a new template file (e.g., `clusterpolicy-cleanup-hook.yaml`) with a Job that deletes the ClusterPolicy
- Or add annotation `helm.sh/resource-policy: delete` combined with reinstall strategy

Step 4: Update external-dns HelmRelease
- Modify `@stacks/enigma-cluster/helmrelease-external-dns.yaml`
- Replace `--ingress-class=tailscale` with:
  - `--source=service`
  - `--label-filter=tailscale-dns=true`

Step 5: Delete existing ClusterPolicy manually (for this update)
```bash
kubectl delete clusterpolicy generate-tailscale-ingress
```

Step 6: Apply changes directly for validation
```bash
helm template libs/internal-networking | kubectl apply -f -
kubectl apply -f stacks/enigma-cluster/helmrelease-external-dns.yaml
```

Step 7: Verify the changes work
- Check that Services are created with `tailscale-dns: "true"` label
- Check that external-dns picks up the Services
- Verify DNS records are A records pointing to Tailscale IPs
- Test resolution of `dashboard.enigma.vgijssel.nl` while connected to Tailnet

Step 8: Commit, push, and resume Flux
```bash
git add -A
git commit -m "Refactor internal-networking to use Services with A records"
git push
flux resume helmrelease internal-networking -n flux-system
flux resume helmrelease external-dns -n flux-system
```
</implementation>

<constraints>
- Do NOT modify any files outside of `libs/internal-networking/` and `stacks/enigma-cluster/helmrelease-external-dns.yaml`
- Preserve the synchronize: true behavior so Services stay in sync with source Ingresses
- Ensure generated Services have the correct port mapping from the source Ingress backend
- The ClusterPolicy hook solution must work with Flux HelmReleases, not just raw Helm
- Use `trunk fmt` and `trunk check` before committing
</constraints>

<output>
Modified files:
- `./libs/internal-networking/templates/clusterpolicy-tailscale-service.yaml` - Renamed and refactored ClusterPolicy
- `./libs/internal-networking/templates/clusterpolicy-cleanup.yaml` - Pre-upgrade hook (if needed)
- `./libs/internal-networking/Chart.yaml` - Version bump
- `./libs/internal-networking/values.yaml` - Any needed value changes
- `./stacks/enigma-cluster/helmrelease-external-dns.yaml` - Updated extraArgs
</output>

<verification>
Before declaring complete, verify:
1. `flux suspend` commands succeeded
2. ClusterPolicy was deleted and recreated without "immutable fields" error
3. Generated Services have label `tailscale-dns: "true"`
4. Generated Services have annotation `tailscale.com/expose: "true"`
5. External-dns logs show it's watching Services with the label filter
6. DNS records are A records (not CNAME) - check with `dig dashboard.enigma.vgijssel.nl`
7. `trunk fmt` and `trunk check` pass
8. Git commit and push succeeded
9. `flux resume` commands succeeded and reconciliation is healthy
</verification>

<success_criteria>
- ClusterPolicy generates Services instead of Ingresses
- Services have `tailscale-dns: "true"` label
- Services have `tailscale.com/expose: "true"` and `tailscale.com/hostname` annotations
- External-dns syncs only Services with the tailscale-dns label
- DNS records are A records pointing to Tailscale device IPs
- `dashboard.enigma.vgijssel.nl` resolves only when connected to Tailnet
- ClusterPolicy can be updated without "immutable fields" error
- All changes committed, pushed, and Flux reconciliation resumed
</success_criteria>
