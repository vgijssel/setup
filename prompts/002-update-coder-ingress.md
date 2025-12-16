<objective>
Update the coder-prod application to use a standard ingress instead of the Tailscale ingress class.
</objective>

<context>
The coder-prod application currently uses a Tailscale-class ingress for internal access only. The requirement is to switch to a regular ingress controller to enable standard external access.

Current ingress configuration: @apps/coder-prod/ingress-coder.yaml
Kubeconfig for cluster access: ./apps/coder-prod/kubeconfig.super-admin
</context>

<requirements>
1. Modify the ingress to remove the Tailscale ingress class
2. Configure a standard ingress with appropriate host-based routing
3. Ensure TLS configuration is properly set for the new ingress
4. Apply the changes to the Kubernetes cluster
</requirements>

<implementation>
1. Read the current ingress configuration at @apps/coder-prod/ingress-coder.yaml
2. Determine the appropriate regular ingress class available in the cluster:
   ```bash
   kubectl --kubeconfig=./apps/coder-prod/kubeconfig.super-admin get ingressclass
   ```
3. Check existing ingress patterns in the cluster for the correct hostname/domain format:
   ```bash
   kubectl --kubeconfig=./apps/coder-prod/kubeconfig.super-admin get ingress -A -o wide
   ```
4. Update the ingress configuration:
   - Change `ingressClassName` from `tailscale` to the appropriate standard class
   - Update the TLS hosts and add proper rules with host-based routing
   - Ensure the service backend configuration remains correct
5. Apply the updated configuration:
   ```bash
   kubectl --kubeconfig=./apps/coder-prod/kubeconfig.super-admin apply -f ./apps/coder-prod/ingress-coder.yaml
   ```
</implementation>

<output>
Modify: `./apps/coder-prod/ingress-coder.yaml` - Updated ingress with standard ingress class and proper host configuration
</output>

<verification>
Before declaring complete, verify:
1. The ingress is applied successfully:
   ```bash
   kubectl --kubeconfig=./apps/coder-prod/kubeconfig.super-admin get ingress -n coder
   ```
2. The ingress has an address assigned:
   ```bash
   kubectl --kubeconfig=./apps/coder-prod/kubeconfig.super-admin describe ingress coder -n coder
   ```
</verification>

<success_criteria>
- Ingress no longer uses `tailscale` ingressClassName
- Ingress uses a standard ingress controller class
- Ingress is successfully applied to the cluster
- Ingress shows an assigned address in the cluster
</success_criteria>
