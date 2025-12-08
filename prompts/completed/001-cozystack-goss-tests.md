<objective>
Create a comprehensive goss test suite for the enigma-cozy stack that validates the CozyStack cluster is healthy and operational.

This test suite will be used to:
1. Verify the cluster is healthy before upgrades
2. Validate successful completion of upgrades
3. Provide ongoing health monitoring capabilities
</objective>

<context>
Project: enigma-cozy stack located at `stacks/enigma-cozy/`
Cluster: CozyStack on Talos Linux with 3 control plane nodes
Namespace: cozy-system (where CozyStack components run)

Node Information (from node YAML files):
- illusion: 192.168.50.10
- the-dome: 192.168.50.11
- the-toy-factory: 192.168.50.12

Talos API Port: 50000 (standard Talos API port)

Reference existing goss test: `stacks/enigma/goss.yaml` for patterns used in this project

Environment: Commands run in an environment already authenticated against the enigma-cozy cluster. No need to specify kubeconfig explicitly - just use `kubectl` directly.
</context>

<requirements>
Create `stacks/enigma-cozy/goss.yaml` with the following test categories:

1. **Helm Release Health**
   - Query all HelmRelease resources across all namespaces
   - Verify all releases have Ready condition set to "True"
   - Use kubectl with the kubeconfig from the stack directory
   - Command pattern: `kubectl --kubeconfig=./kubeconfig get hr -A -o json | jq ...`

2. **Pod Health in cozy-system namespace**
   - Verify all pods in cozy-system are Running or Completed
   - Check that no pods are in CrashLoopBackOff, Error, or Pending states
   - Use kubectl with the stack's kubeconfig

3. **Node Reachability via ICMP**
   - Test ping connectivity to all three nodes:
     - 192.168.50.10 (illusion)
     - 192.168.50.11 (the-dome)
     - 192.168.50.12 (the-toy-factory)
   - Use goss `addr` test type with reachable: true and timeout

4. **Talos API Port Reachability**
   - Test TCP connectivity to port 50000 on all three nodes
   - Use goss `addr` test type with tcp protocol
   - Addresses to test:
     - tcp://192.168.50.10:50000
     - tcp://192.168.50.11:50000
     - tcp://192.168.50.12:50000
</requirements>

<implementation>
Use goss YAML format with:
- `command` type for kubectl-based tests with proper exit-status checks
- `addr` type for network reachability tests
- Include descriptive `title` fields for each test
- Set appropriate timeout values (10000ms for kubectl, 5000ms for network)
- Use `kubectl` directly without kubeconfig flags (environment is pre-authenticated)

For helm release verification, use jq to filter and check conditions:
```bash
kubectl get hr -A -o json | jq -e '[.items[].status.conditions[] | select(.type=="Ready" and .status!="True")] | length == 0'
```

For pod health, use:
```bash
kubectl get pods -n cozy-system -o json | jq -e '[.items[] | select(.status.phase != "Running" and .status.phase != "Succeeded")] | length == 0'
```
</implementation>

<output>
Create file: `./stacks/enigma-cozy/goss.yaml`
</output>

<verification>
After creating the goss.yaml:
1. Change to the enigma-cozy directory: `cd stacks/enigma-cozy`
2. Run: `goss validate` to verify all tests pass
3. If tests fail, investigate and fix the test definitions (not the cluster)
</verification>

<success_criteria>
- goss.yaml file exists at stacks/enigma-cozy/goss.yaml
- All 4 test categories are implemented
- `goss validate` runs without syntax errors
- Tests accurately reflect the current healthy state of the cluster
</success_criteria>
