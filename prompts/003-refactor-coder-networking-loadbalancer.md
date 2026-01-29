<objective>
Refactor Coder networking to eliminate double ingress controllers by using KubeVirt CCM's LoadBalancer forwarding capability from the tenant cluster (coder-cluster-prod) to the enigma management cluster.

Currently there are TWO nginx ingress controllers in the path:
1. Enigma cluster ingress (apps/coder-cluster-prod/ingress-coder.yaml) → forwards to kamaji virtual cluster's ingress controller
2. Coder-cluster-prod's nginx ingress (configured in apps/coder-prod/helmrelease-coder.yaml) → forwards to Coder server

This double-hop complicates WebSocket handling and is error-prone. The goal is to expose Coder's service directly as a LoadBalancer, letting KubeVirt CCM create a corresponding service in the enigma cluster.
</objective>

<context>
This is a Moon monorepo using FluxCD for GitOps deployments.

Key files:
- @apps/coder-prod/helmrelease-coder.yaml - Coder HelmRelease in the tenant cluster (coder-cluster-prod)
- @apps/coder-cluster-prod/ingress-coder.yaml - Ingress in enigma cluster pointing to tenant cluster

Current state in helmrelease-coder.yaml:
- `coder.service.type: ClusterIP` (line 146)
- `coder.ingress.enable: true` with nginx ingress class (lines 148-159)

Current state in ingress-coder.yaml:
- Points to service `adfc788849eea4e4981f8e354b3491a3` on port 80 (this is the tenant's ingress controller)
</context>

<requirements>
1. Modify apps/coder-prod/helmrelease-coder.yaml:
   - Disable the ingress by setting `coder.ingress.enable: false`
   - Change service type from ClusterIP to LoadBalancer: `coder.service.type: LoadBalancer`
   - Remove or comment out the ingress-related configuration (className, host, wildcardHost, annotations, tls)

2. Apply changes following FluxCD GitOps principles:
   - Commit the changes with a descriptive message
   - Push to remote
   - Reconcile using Flux CLI to apply changes immediately

3. Validate KubeVirt CCM created the forwarded service:
   - Check the enigma cluster for a new service created by KubeVirt CCM
   - The service should be in the tenant namespace and forward to the coder service
   - Note the service name for the next step

4. Update apps/coder-cluster-prod/ingress-coder.yaml:
   - Change the backend service name from the current ingress controller service to the new KubeVirt CCM-created service
   - Update the port if necessary (Coder uses port 80 for HTTP)
   - Commit, push, and reconcile this change as well
</requirements>

<implementation>
Step 1: Modify the HelmRelease
Edit apps/coder-prod/helmrelease-coder.yaml to:
- Set `coder.service.type: LoadBalancer`
- Set `coder.ingress.enable: false`
- Remove the ingress block (className, host, wildcardHost, annotations, tls)

Step 2: Commit and push
```bash
git add apps/coder-prod/helmrelease-coder.yaml
git commit -m "feat(coder): switch to LoadBalancer service for KubeVirt CCM forwarding

Eliminates double ingress controller setup by exposing Coder directly as
LoadBalancer. KubeVirt CCM will forward this to the enigma management cluster."
git push
```

Step 3: Reconcile FluxCD
```bash
# Reconcile the git repository source first
flux reconcile source git setup --context coder-cluster-prod

# Then reconcile the HelmRelease
flux reconcile helmrelease coder -n flux-system --context coder-cluster-prod
```

Step 4: Validate KubeVirt CCM service creation
```bash
# Check for services in the enigma cluster's tenant namespace
# KubeVirt CCM typically creates services with a specific naming pattern
kubectl get services -n tenant-root --context enigma

# Look for a service that wasn't there before, likely named after the tenant/service
# The service should have an external IP or be of type that forwards traffic
```

Step 5: Update the enigma cluster ingress
Once you identify the new service name, update apps/coder-cluster-prod/ingress-coder.yaml:
- Replace service name `adfc788849eea4e4981f8e354b3491a3` with the new KubeVirt CCM service name
- Verify the port (should be 80 for Coder HTTP traffic)

Step 6: Commit, push, and reconcile the ingress change
```bash
git add apps/coder-cluster-prod/ingress-coder.yaml
git commit -m "feat(coder): point ingress to KubeVirt CCM forwarded service

Completes the networking simplification by routing directly to Coder
through the CCM-forwarded LoadBalancer service."
git push

# Reconcile the enigma cluster
flux reconcile source git setup --context enigma
flux reconcile kustomization apps --context enigma
```
</implementation>

<verification>
After completing all steps, verify the setup works:

1. Check the Coder service is LoadBalancer type in the tenant cluster:
```bash
kubectl get svc -n coder --context coder-cluster-prod
```

2. Check the KubeVirt CCM created service exists in enigma:
```bash
kubectl get svc -n tenant-root --context enigma
```

3. Check the ingress is pointing to the correct service:
```bash
kubectl get ingress coder -n tenant-root --context enigma -o yaml
```

4. Test Coder access:
- Navigate to https://coder.enigma.vgijssel.nl
- Verify WebSocket connections work (check browser dev tools for WS connections)
- Test a workspace connection to verify the full path works
</verification>

<success_criteria>
- HelmRelease has ingress disabled and service type LoadBalancer
- KubeVirt CCM has created a corresponding service in the enigma cluster
- Enigma cluster ingress points to the CCM-created service (not the old ingress controller service)
- Coder is accessible at https://coder.enigma.vgijssel.nl
- WebSocket connections work without timeouts or errors
- All changes are committed and pushed to the repository
</success_criteria>

<rollback>
If something goes wrong, revert the changes:
```bash
git revert HEAD~2..HEAD  # Revert the last 2 commits
git push
flux reconcile source git setup --context coder-cluster-prod
flux reconcile source git setup --context enigma
```
</rollback>
