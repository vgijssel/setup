# Overview

This PRD defines the implementation of a Kyverno-based solution for dynamically resolving Ingress backend service names using label selectors. The primary use case is supporting Cluster API (CAPI) tenant services and KubeVirt virtual machines that create services with dynamic, hash-based names that cannot be known in advance when defining Ingress resources.

**Problem Statement:**
When deploying Cluster API workload clusters or KubeVirt VMs, service names often include generated hashes or timestamps (e.g., `relay-family-vmi-abc123` or `kubernetes-cluster-docs-infra-prod-xyz123`). Traditional Ingress definitions require hardcoding the service name, making it impossible to reference these dynamic services consistently. Services are labeled with Cluster API metadata (e.g., `cluster.x-k8s.io/cluster-name`, `cluster.x-k8s.io/tenant-service-name`) but Ingress resources cannot natively use these labels to discover the service name.

**Solution:**
A Kyverno ClusterPolicy that intercepts Ingress CREATE/UPDATE operations, reads a custom annotation specifying label selectors, queries the Kubernetes API to find matching services, and automatically mutates the Ingress to reference the correct service name.

**Value Proposition:**
- **Zero-Touch Operations:** Automatically updates Ingress when services are recreated with new names
- **Eliminates Manual Intervention:** No human operator required during service rollouts or cluster upgrades
- **Declarative Ingress Definitions:** Use label selectors instead of hardcoded service names
- **Kubernetes-Native:** Leverages standard label selector patterns for service discovery
- **GitOps Compatible:** Works seamlessly with ArgoCD, Flux, and other GitOps tools
- **No Application Changes:** Transparent to applications, pure infrastructure solution

# Core Features

## 1. Annotation-Based Label Selector Configuration

**What it does:**
Allows users to specify label selectors directly in Ingress annotations rather than hardcoding service names.

**Why it's important:**
Provides a declarative, Kubernetes-native way to express the relationship between Ingress and dynamic services without requiring external controllers or operators.

**How it works:**
Users add an annotation like `myorg.io/backend-match-labels: "cluster.x-k8s.io/cluster-name=kubernetes-cluster-docs-infra-prod,cluster.x-k8s.io/tenant-service-name=relay-family"` to their Ingress resource. The Kyverno policy reads this annotation and uses it as a labelSelector query parameter.

## 2. Automatic Service Name Resolution

**What it does:**
Queries the Kubernetes API to find services matching the provided label selector and extracts the service name.

**Why it's important:**
Automates the previously manual process of looking up dynamic service names and updating Ingress resources, reducing operational toil and potential for errors.

**How it works:**
The Kyverno policy uses the `apiCall` context variable to execute a GET request to `/api/v1/namespaces/{namespace}/services?labelSelector={selector}`, extracts the first matching service's name, and uses it in the mutation.

## 3. JSON Patch-Based Ingress Mutation

**What it does:**
Modifies the Ingress resource's backend service name before it's persisted to etcd.

**Why it's important:**
Ensures the Ingress is stored with the correct service reference immediately, maintaining consistency without requiring reconciliation loops.

**How it works:**
Uses JSON Patch (RFC 6902) operations to replace the service name at the specified path in the Ingress spec. Supports multiple paths if needed (multiple rules/backends).

## 4. Namespace-Scoped Service Discovery

**What it does:**
Restricts service discovery to the same namespace as the Ingress resource.

**Why it's important:**
Maintains Kubernetes namespace isolation and security boundaries. Prevents cross-namespace service references which could be a security concern.

**How it works:**
The API call path explicitly uses `{{ request.namespace }}` to ensure only services in the Ingress's namespace are queried.

## 5. Automatic Reconciliation on Service Changes

**What it does:**
Automatically updates Ingress resources when the target service is deleted and recreated with a different name (but same labels).

**Why it's important:**
Eliminates manual intervention during service rollouts, cluster upgrades, or pod restarts. Ensures Ingress resources always point to the current service without human operators having to track service name changes.

**How it works:**
A reconciliation mechanism (GitOps controller, custom Kubernetes controller, or scheduled job) detects when services change and triggers Ingress UPDATE operations. When the Ingress is updated, Kyverno's mutating webhook re-evaluates the label selector and resolves the new service name automatically.

**Implementation Approaches:**
- **GitOps (ArgoCD/Flux):** Detect drift between Git state and cluster state, re-apply Ingress manifests
- **Custom Controller:** Watch Service CREATE/DELETE events, trigger Ingress updates when labels match
- **Kyverno Background Policy:** Use Kyverno's background mode for continuous reconciliation
- **Scheduled Reconciliation:** Periodic CronJob that forces Ingress re-evaluation

# User Experience

## User Personas

### Platform Engineer
- Manages Kubernetes infrastructure and policies
- Deploys and maintains Kyverno policies
- Responsible for cluster-wide automation
- Needs reliable, auditable policy behavior

### Application Developer
- Deploys applications with dynamic service names (Cluster API tenant services, KubeVirt VMs, canary deployments)
- Wants simple, declarative Ingress definitions
- May not have deep Kubernetes API knowledge or Cluster API label conventions
- Needs quick feedback if something goes wrong

## Key User Flows

### Flow 1: Deploying an Ingress for a Cluster API Tenant Service

1. Cluster API creates a workload cluster that provisions a tenant service
2. The service is created with name `relay-family-svc-xyz123` and Cluster API labels:
   - `cluster.x-k8s.io/cluster-name=kubernetes-cluster-docs-infra-prod`
   - `cluster.x-k8s.io/tenant-service-name=relay-family`
   - `cluster.x-k8s.io/tenant-service-namespace=relay`
3. User creates an Ingress with annotation:
   ```yaml
   metadata:
     annotations:
       myorg.io/backend-match-labels: "cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay"
   spec:
     rules:
     - http:
         paths:
         - path: /
           backend:
             service:
               name: placeholder  # Will be replaced by Kyverno
               port:
                 number: 80
   ```
4. Kyverno intercepts the Ingress creation
5. Kyverno queries services with the specified Cluster API label selector
6. Kyverno finds `relay-family-svc-xyz123` and mutates the Ingress
7. Ingress is stored with the correct service name
8. User verifies with `kubectl get ingress -o yaml` that service name was updated

### Flow 2: Service Recreation (Cluster Upgrade/Rollout) - Automatic Reconciliation

1. Cluster API performs a rolling update, old service `relay-family-svc-abc123` deleted
2. New service created with different hash: `relay-family-svc-def456` but same Cluster API labels
3. Reconciliation controller detects service change and triggers Ingress update
4. Kyverno mutation webhook re-evaluates on UPDATE operation
5. Kyverno resolves new service name automatically using the same Cluster API labels
6. Ingress backend updated to `relay-family-svc-def456`
7. **Zero manual intervention required** - fully automatic reconciliation

**Implementation Options for Automatic Reconciliation:**
- **GitOps (Recommended):** ArgoCD/Flux detect drift and re-sync Ingress from Git source
- **Custom Controller:** Watch Service changes, trigger Ingress annotation update to force re-evaluation
- **Kyverno Generate Policy:** Use background mode to continuously reconcile Ingress resources
- **Scheduled Reconciliation:** CronJob that patches Ingress with timestamp annotation to trigger webhook

### Flow 3: Troubleshooting Failed Resolution

1. User creates Ingress with annotation
2. No services match the label selector
3. Kyverno's `default: ""` for apiCall means empty string is used
4. Ingress is created with empty service name (invalid)
5. User checks Ingress status, sees error from Ingress controller
6. User checks Kyverno policy reports or audit logs
7. User fixes label selector or creates missing service
8. User updates Ingress to trigger re-evaluation

## UI/UX Considerations

- **Error Visibility:** When no services match, the mutation should either fail the admission request (preferred) or leave a clear indication in the Ingress
- **Documentation:** Clear examples needed for common label selector patterns
- **Validation:** Consider a separate validation policy to check that the annotation format is valid before attempting mutation
- **Multi-Path Support:** If an Ingress has multiple paths/backends, the policy must handle all of them or clearly document limitations

# Technical Architecture

## System Components

### Kyverno ClusterPolicy Resource
- Type: `kyverno.io/v1/ClusterPolicy`
- Scope: Cluster-wide (applies to all namespaces)
- Trigger: Ingress CREATE and UPDATE operations
- Mode: `background: false` (only intercept admission requests)

### API Call Context Variable
- Queries: `/api/v1/namespaces/{namespace}/services?labelSelector={selector}`
- JMESPath: `items[0].metadata.name` (takes first matching service)
- Fallback: Empty string if no matches

### Mutation Engine
- Mechanism: JSON Patch (RFC 6902)
- Operation: `replace` on `/spec/rules/{idx}/http/paths/{idx}/backend/service/name`
- Applied: During admission, before resource is persisted

### Reconciliation Controller (for automatic service change handling)
- Type: Custom Kubernetes controller or GitOps operator
- Watches: Service CREATE/DELETE events with Cluster API labels
- Triggers: Ingress UPDATE operations to invoke Kyverno mutation webhook
- Scope: Namespace-scoped or cluster-wide based on deployment
- Alternative: Leverage existing GitOps tools (ArgoCD/Flux) for drift detection

## Data Models

### Ingress Annotation Schema
```yaml
metadata:
  annotations:
    myorg.io/backend-match-labels: "<label-selector-string>"
    # Optional: path-specific selectors for multi-backend Ingress
    myorg.io/backend-match-labels-path-0: "<selector-for-first-path>"
    myorg.io/backend-match-labels-path-1: "<selector-for-second-path>"
```

### Service Label Schema
```yaml
metadata:
  labels:
    cluster.x-k8s.io/cluster-name: <cluster-name>
    cluster.x-k8s.io/tenant-service-name: <service-name>
    cluster.x-k8s.io/tenant-service-namespace: <namespace>
    # Standard Cluster API labels for tenant services
```

**Example for relay-family service:**
```yaml
metadata:
  labels:
    cluster.x-k8s.io/cluster-name: kubernetes-cluster-docs-infra-prod
    cluster.x-k8s.io/tenant-service-name: relay-family
    cluster.x-k8s.io/tenant-service-namespace: relay
```

### Policy Decision Flow

**Initial Ingress Creation:**
```
Ingress CREATE Request
  → Kyverno Webhook Intercepts
  → Check for annotation presence (precondition)
  → Extract label selector from annotation
  → Query Services API with selector
  → Extract first service name (or fail if none found)
  → Generate JSON Patch
  → Apply mutation
  → Return mutated Ingress (persisted with resolved service name)
```

**Service Recreation Reconciliation:**
```
Service Deleted (old hash)
  → New Service Created (new hash, same labels)
  → Reconciliation Controller Detects Change
  → Controller Triggers Ingress UPDATE (e.g., add timestamp annotation)
  → Kyverno Webhook Intercepts UPDATE Request
  → Re-query Services API with same label selector
  → Extract new service name
  → Generate JSON Patch with new name
  → Apply mutation
  → Ingress updated with new service name automatically
```

**GitOps-Based Reconciliation:**
```
Service Changes
  → GitOps Controller (ArgoCD/Flux) Detects Drift
  → Controller Re-applies Ingress from Git Source
  → Triggers Ingress UPDATE/CREATE
  → Kyverno Resolves Current Service Name
  → Ingress Synchronized
```

## APIs and Integrations

### Kubernetes API Integration
- **Endpoint:** `/api/v1/namespaces/{namespace}/services`
- **Query Parameters:** `labelSelector={comma-separated-key-value-pairs}`
- **Response Format:** JSON list of Service objects
- **Authentication:** Uses Kyverno's ServiceAccount RBAC

### Kyverno Webhook Integration
- **Type:** Mutating Admission Webhook
- **Failure Policy:** Consider `Fail` to prevent invalid Ingress creation
- **Side Effects:** None (idempotent mutation)

### Reconciliation Controller Integration (Phase 2)
- **Type:** Kubernetes Controller (controller-runtime based)
- **Watches:**
  - Service resources with Cluster API labels (`cluster.x-k8s.io/*`)
  - Ingress resources with reconciliation annotation (`myorg.io/backend-match-labels`)
- **Reconciliation Trigger:** Service CREATE/DELETE events
- **Action:** Update Ingress annotation to force Kyverno re-evaluation
- **Reconciliation Annotation:** `myorg.io/reconcile-timestamp` (RFC3339 timestamp)
- **Concurrency:** Configurable worker threads (default: 5)
- **Retry Logic:** Exponential backoff for failed updates
- **Metrics Exposed:**
  - `reconciliation_duration_seconds` - Time to complete reconciliation
  - `reconciliation_total` - Total reconciliations performed
  - `reconciliation_errors_total` - Failed reconciliation attempts

## Infrastructure Requirements

### RBAC for Kyverno
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kyverno-ingress-service-resolver
rules:
- apiGroups: [""]
  resources: ["services"]
  verbs: ["get", "list"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get", "list", "update", "patch"]
```

### RBAC for Reconciliation Controller (Phase 2)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ingress-service-reconciler
rules:
- apiGroups: [""]
  resources: ["services"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get", "list", "update", "patch"]
- apiGroups: [""]
  resources: ["events"]
  verbs: ["create", "patch"]
```

### Kyverno Installation
- Minimum version: 1.10.0 (for `apiCall` support)
- Recommended: 1.12.0+ (improved context variables)
- Resource requests: Default Kyverno controller resources sufficient

### Monitoring and Observability
- Kyverno policy reports for audit trail
- Metrics: Policy execution time, success/failure rates
- Logs: Service discovery results, mutation operations
- **Phase 2 Reconciliation Metrics:**
  - Service change detection latency
  - Ingress update success/failure rates
  - Reconciliation loop duration
  - Stale Ingress alerts (pointing to non-existent services)
- **Recommended Alerts:**
  - Ingress with backend service not found
  - Reconciliation failures exceeding threshold
  - Reconciliation latency > 30 seconds

# Development Roadmap

## Phase 1: MVP - Single Path, Single Backend
**Scope:**
- Implement basic Kyverno policy for single-path Ingress resources
- Support one annotation: `myorg.io/backend-match-labels`
- Mutate only `/spec/rules/0/http/paths/0/backend/service/name`
- Use hardcoded JSON Patch path
- Include basic error handling (default to empty string)

**Deliverables:**
- ClusterPolicy YAML manifest
- Example Ingress YAML with annotation
- Basic documentation

## Phase 2: Automatic Reconciliation Controller
**Scope:**
- Implement reconciliation mechanism for automatic service change detection
- Watch Service CREATE/DELETE events with matching Cluster API labels
- Trigger Ingress UPDATE operations to invoke Kyverno re-evaluation
- Support multiple reconciliation strategies (controller vs GitOps)
- Handle service not found scenarios gracefully

**Deliverables:**
- Reconciliation controller implementation (Kubernetes operator)
- GitOps integration guide (ArgoCD/Flux configuration)
- Scheduled reconciliation alternative (CronJob with kubectl patch)
- E2E testing with service recreation scenarios
- Documentation on reconciliation approaches

## Phase 3: Multi-Path Support
**Scope:**
- Extend policy to support multiple paths in a single Ingress
- Add path-specific annotations: `myorg.io/backend-match-labels-path-{idx}`
- Generate dynamic JSON Patches for each path
- Validate that path indices match

**Deliverables:**
- Updated ClusterPolicy with loop/iteration logic (if supported) or multiple rules
- Examples with multi-path Ingress
- Updated documentation

## Phase 4: Enhanced Error Handling
**Scope:**
- Replace default empty string with admission rejection
- Add validation policy to check annotation format before mutation
- Provide clear error messages when no services match
- Add preconditions to check service exists before mutation
- Handle reconciliation failures (service never appears)

**Deliverables:**
- Separate ValidatingPolicy for pre-mutation checks
- Updated MutatingPolicy with stricter failure modes
- Reconciliation controller error handling and retries
- Error message documentation
- Monitoring alerts for reconciliation failures

## Phase 5: Advanced Features
**Scope:**
- Support for multiple matching services (round-robin, weighted)
- Annotation-based service selection strategy (first, newest, oldest)
- Support for cross-namespace services (with explicit opt-in annotation)
- Integration with external service discovery (Consul, etc.)

**Deliverables:**
- Extended policy with strategy annotations
- RBAC updates for cross-namespace support
- Integration examples

# Logical Dependency Chain

## Foundation Layer (Build First)
1. **Kyverno Installation and RBAC Setup**
   - Must be completed before any policies can be deployed
   - Ensures service account has necessary permissions
   - Testing: Verify Kyverno webhook is responding

2. **Basic Policy Structure**
   - Match rules for Ingress CREATE/UPDATE
   - Precondition for annotation presence
   - Testing: Deploy policy, verify it only triggers on annotated Ingress

## Core Functionality Layer (Build Upon Foundation)
3. **Service Discovery via API Call**
   - Context variable with apiCall to Services API
   - JMESPath extraction of service name
   - Testing: Manual API calls with label selectors, verify results match expected

4. **Single-Path Mutation**
   - JSON Patch generation for first path
   - Integration of apiCall result into patch
   - Testing: Create Ingress with annotation, verify service name is updated

## Enhancement Layer (Iterative Improvements)
5. **Automatic Reconciliation Controller**
   - Depends on single-path mutation working correctly
   - Watches Service changes and triggers Ingress updates
   - Testing: Delete service, create new one with same labels, verify Ingress auto-updates

6. **Multi-Path Support**
   - Depends on single-path and reconciliation working correctly
   - Adds complexity with multiple annotations
   - Testing: Ingress with 2+ paths, verify all are mutated correctly during reconciliation

7. **Error Handling and Validation**
   - Depends on core mutation and reconciliation working
   - Adds pre-mutation validation and reconciliation error handling
   - Testing: Negative tests (no matching services, invalid annotations, reconciliation failures)

8. **Advanced Features**
   - Depends on stable core functionality
   - Each feature can be developed independently
   - Testing: Feature-specific test cases

## Pacing and Scoping
- **Phase 1 (MVP):** Atomic, production-ready for single-path use case with manual Ingress updates
- **Phase 2 (Critical):** Enables automatic reconciliation - required for zero-touch service updates
- **Phase 3:** Adds multi-path support, builds on reconciliation
- **Phase 4:** Enhances reliability with better error handling
- **Phase 5:** Optional features, can be prioritized based on user feedback

# Risks and Mitigations

## Technical Challenges

### Risk: Service Not Found During Mutation
**Impact:** Ingress created with invalid/empty service name, traffic routing fails
**Mitigation:**
- Use Kyverno's validation policies to check service exists before mutation
- Consider setting `failurePolicy: Fail` to reject Ingress if service not found
- Document that services must exist before Ingress creation
- Provide clear error messages in policy reports

### Risk: Multiple Services Match Label Selector
**Impact:** Non-deterministic behavior, wrong service might be selected
**Mitigation:**
- Document that `items[0]` selects first service (alphabetical by name)
- In Phase 2+, add annotation to specify selection strategy (newest, oldest, explicit name)
- Consider using `items | [0]` with additional sorting in JMESPath
- Validation policy to warn if multiple matches exist

### Risk: Performance Impact on Ingress Creation
**Impact:** API calls during admission slow down deployments
**Mitigation:**
- Monitor Kyverno policy execution time metrics
- Set appropriate timeout for apiCall (default 5s may be insufficient)
- Consider caching service list if API calls become bottleneck
- Use `background: false` to avoid unnecessary executions

### Risk: RBAC Permissions Too Broad
**Impact:** Security concern if Kyverno can access services across all namespaces
**Mitigation:**
- Scope RBAC to specific namespaces if possible
- Use separate ServiceAccount for this policy vs other Kyverno policies
- Audit RBAC regularly
- Document minimum required permissions

### Risk: Kyverno Version Compatibility
**Impact:** `apiCall` feature not available in older Kyverno versions
**Mitigation:**
- Document minimum Kyverno version (1.10.0+)
- Test policy on specified version before production deployment
- Include version check in deployment automation
- Provide migration guide if upgrading Kyverno is required

### Risk: Service Changes Not Triggering Ingress Updates
**Impact:** When a service is deleted and recreated with a new name, the Ingress continues pointing to the old (non-existent) service, breaking traffic routing
**Mitigation:**
- **Phase 2 Requirement:** Implement reconciliation controller to watch Service events
- Provide multiple reconciliation options:
  - Custom Kubernetes controller (most responsive)
  - GitOps integration (ArgoCD/Flux) for drift detection
  - Scheduled CronJob for periodic reconciliation (fallback)
- Add monitoring alerts for Ingress with non-existent service backends
- Document reconciliation strategies and trade-offs (latency, complexity)
- Consider adding finalizers to prevent service deletion before Ingress update

## MVP Scope Definition

**In Scope for MVP (Phase 1):**
- Single-path Ingress mutation on CREATE/UPDATE operations
- Namespace-scoped service discovery
- Validation to reject Ingress if no matching service found
- ClusterPolicy deployment
- Manual Ingress update trigger (kubectl annotate or GitOps sync)

**Critical for Production Use (Phase 2):**
- Automatic reconciliation when services change
- Service watch controller or GitOps integration
- Zero-touch service updates during rollouts

**Out of Scope for MVP:**
- Automatic reconciliation (Phase 2)
- Multi-path support (Phase 3)
- Advanced error handling (Phase 4)
- Cross-namespace service references (Phase 5)
- Advanced selection strategies (Phase 5)
- Helm chart packaging (can be added later)

**Success Criteria for MVP:**
- Annotated Ingress resources are mutated correctly on creation
- Service name is resolved before persistence
- Admission rejected if no matching service found
- No regression for non-annotated Ingress resources
- Policy can be deployed via `kubectl apply -f`
- Manual re-apply of Ingress triggers correct service resolution

**Success Criteria for Phase 2 (Automatic Reconciliation):**
- Service deletion and recreation automatically updates Ingress
- No manual intervention required during service rollouts
- Reconciliation completes within acceptable time window (< 30 seconds)
- Monitoring alerts for reconciliation failures

## Resource Constraints

### Development Resources
- Primary constraint: Kyverno policy development expertise
- Testing requires Kubernetes cluster with Cluster API or simulated tenant services with appropriate labels
- Documentation needs examples for multiple use cases (Cluster API, KubeVirt, generic dynamic services)

### Runtime Resources
- Kyverno controller memory/CPU impact minimal for this policy
- No additional infrastructure components required
- API calls use standard Kubernetes API server capacity

# Appendix

## Research Findings

### Kyverno API Call Capabilities
- Supported since Kyverno 1.10.0
- Can make GET requests to any Kubernetes API endpoint
- Supports JMESPath for response processing
- Timeout configurable (default 5s)
- Automatically uses Kyverno's ServiceAccount credentials

### Label Selector Query Format
- Format: `key1=value1,key2=value2`
- Equality-based: `app=myapp`
- Set-based also supported: `environment in (prod,staging)`
- URL encoding handled automatically by Kubernetes API
- Case-sensitive matching

### Cluster API Label Conventions
Services created by Cluster API workload clusters follow a standard labeling convention:

**Standard Labels:**
- `cluster.x-k8s.io/cluster-name`: The name of the Cluster API cluster (e.g., `kubernetes-cluster-docs-infra-prod`)
- `cluster.x-k8s.io/tenant-service-name`: The logical service name (e.g., `relay-family`)
- `cluster.x-k8s.io/tenant-service-namespace`: The namespace where the tenant service logically belongs (e.g., `relay`)

**Usage in Ingress Annotations:**
```yaml
annotations:
  myorg.io/backend-match-labels: "cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay"
```

**Benefits:**
- Stable labels even when service names include hashes
- Consistent discovery across cluster upgrades and rollouts
- Aligns with Cluster API multi-tenancy patterns

### JSON Patch Limitations
- Can only replace values at known paths
- Cannot iterate over arrays in patch operations (workaround: multiple patch operations)
- Path must exist in original resource (cannot add new paths conditionally)
- Operations are applied sequentially

## Technical Specifications

### Complete Policy Example (MVP)
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: resolve-ingress-backend-by-label
  annotations:
    policies.kyverno.io/title: Resolve Ingress Backend by Label Selector
    policies.kyverno.io/category: Ingress
    policies.kyverno.io/severity: medium
    policies.kyverno.io/subject: Ingress
    policies.kyverno.io/description: >-
      Automatically resolves Ingress backend service names by querying
      services matching label selectors specified in the
      myorg.io/backend-match-labels annotation. This enables Ingress
      resources to reference dynamically-named services such as those
      created by Cluster API workload clusters or KubeVirt VirtualMachineInstances.
spec:
  background: false
  failurePolicy: Fail  # Reject Ingress if mutation fails
  rules:
  - name: resolve-service-from-labels
    match:
      any:
      - resources:
          kinds:
          - Ingress
          operations:
          - CREATE
          - UPDATE
    preconditions:
      all:
      # Only process Ingress with the annotation
      - key: "{{ request.object.metadata.annotations.\"myorg.io/backend-match-labels\" || '' }}"
        operator: NotEquals
        value: ""
      # Ensure there's at least one rule to mutate
      - key: "{{ request.object.spec.rules | length(@) }}"
        operator: GreaterThan
        value: 0
    context:
    # Extract the label selector from annotation
    - name: labelSelector
      variable:
        jmesPath: "request.object.metadata.annotations.\"myorg.io/backend-match-labels\""
    # Query services matching the labels
    - name: matchingServices
      apiCall:
        urlPath: "/api/v1/namespaces/{{ request.namespace }}/services?labelSelector={{ labelSelector }}"
        jmesPath: "items[0].metadata.name || ''"
    # Validate at least one service was found
    - name: serviceCount
      variable:
        jmesPath: "request.object.metadata.annotations.\"myorg.io/backend-match-labels\""
      apiCall:
        urlPath: "/api/v1/namespaces/{{ request.namespace }}/services?labelSelector={{ labelSelector }}"
        jmesPath: "items | length(@)"
    validate:
      message: "No services found matching label selector: {{ labelSelector }}"
      deny:
        conditions:
          any:
          - key: "{{ serviceCount }}"
            operator: Equals
            value: 0
    mutate:
      patchesJson6902: |-
        - op: replace
          path: /spec/rules/0/http/paths/0/backend/service/name
          value: "{{ matchingServices }}"
```

### Example Ingress Resource
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: relay-family-ingress
  namespace: relay
  annotations:
    myorg.io/backend-match-labels: "cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay"
spec:
  ingressClassName: nginx
  rules:
  - host: relay-family.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: placeholder  # Will be replaced by Kyverno
            port:
              number: 80
```

### Example Service (Cluster API-generated)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: relay-family-svc-abc123
  namespace: relay
  labels:
    cluster.x-k8s.io/cluster-name: kubernetes-cluster-docs-infra-prod
    cluster.x-k8s.io/tenant-service-name: relay-family
    cluster.x-k8s.io/tenant-service-namespace: relay
spec:
  selector:
    app: relay-family
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### Testing Approach

**Unit Testing (Policy Validation):**
- Use `kyverno test` command with test resources
- Test cases:
  - Ingress with annotation + matching service → mutation succeeds
  - Ingress with annotation + no matching service → admission rejected
  - Ingress without annotation → no mutation
  - Ingress with multiple rules → only first path mutated (MVP limitation)

**Integration Testing:**
- Deploy to test cluster
- Create service with specific labels
- Create Ingress with matching label selector annotation
- Verify Ingress has correct service name: `kubectl get ingress -o jsonpath='{.spec.rules[0].http.paths[0].backend.service.name}'`
- Delete service, recreate with different name, update Ingress → verify new name resolved

**Performance Testing:**
- Measure Ingress creation latency with and without policy
- Test with large number of services in namespace
- Verify apiCall timeout handling

### Deployment Checklist

**Phase 1 (MVP):**
- [ ] Kyverno installed (v1.10.0+)
- [ ] RBAC ClusterRole created and bound to Kyverno SA
- [ ] Policy deployed: `kubectl apply -f policy.yaml`
- [ ] Policy status verified: `kubectl get clusterpolicy`
- [ ] Test Ingress created and mutation verified
- [ ] Kyverno policy reports checked for errors
- [ ] Monitoring alerts configured for policy failures

**Phase 2 (Reconciliation):**
- [ ] Reconciliation controller deployed (or GitOps configured)
- [ ] RBAC for reconciliation controller configured
- [ ] Service watch permissions verified
- [ ] Test service deletion and recreation
- [ ] Verify Ingress automatically updates within SLA
- [ ] Reconciliation metrics exposed and scraped
- [ ] Alerts configured for reconciliation failures
- [ ] E2E test: Delete service, create new one, verify automatic Ingress update

## Real-World Example: Cluster API Tenant Service

### Scenario
A Cluster API workload cluster `kubernetes-cluster-docs-infra-prod` provisions a tenant service called `relay-family` in the `relay` namespace. The service name includes a hash for uniqueness: `relay-family-svc-a1b2c3d4`.

### Step 1: Service Created by Cluster API
```yaml
apiVersion: v1
kind: Service
metadata:
  name: relay-family-svc-a1b2c3d4
  namespace: relay
  labels:
    cluster.x-k8s.io/cluster-name: kubernetes-cluster-docs-infra-prod
    cluster.x-k8s.io/tenant-service-name: relay-family
    cluster.x-k8s.io/tenant-service-namespace: relay
    app: relay
spec:
  selector:
    app: relay
  ports:
  - name: http
    port: 80
    targetPort: 8080
  type: ClusterIP
```

### Step 2: User Creates Ingress with Label Annotation
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: relay-family-ingress
  namespace: relay
  annotations:
    myorg.io/backend-match-labels: "cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay"
spec:
  ingressClassName: nginx
  rules:
  - host: relay.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: placeholder
            port:
              number: 80
```

### Step 3: Kyverno Mutates Ingress
Kyverno intercepts the Ingress admission request:
1. Reads annotation: `cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay`
2. Queries API: `GET /api/v1/namespaces/relay/services?labelSelector=cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay`
3. Extracts service name: `relay-family-svc-a1b2c3d4`
4. Applies JSON Patch to replace `placeholder` with `relay-family-svc-a1b2c3d4`

### Step 4: Final Ingress (Mutated)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: relay-family-ingress
  namespace: relay
  annotations:
    myorg.io/backend-match-labels: "cluster.x-k8s.io/tenant-service-name=relay-family,cluster.x-k8s.io/tenant-service-namespace=relay"
spec:
  ingressClassName: nginx
  rules:
  - host: relay.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: relay-family-svc-a1b2c3d4  # Automatically resolved!
            port:
              number: 80
```

### Step 5: Verification
```bash
# Verify the service name was correctly resolved
kubectl get ingress relay-family-ingress -n relay -o jsonpath='{.spec.rules[0].http.paths[0].backend.service.name}'
# Output: relay-family-svc-a1b2c3d4

# Check if Ingress is routing traffic correctly
kubectl describe ingress relay-family-ingress -n relay
```

### Step 6: Automatic Service Rollout (Hash Changes) - Phase 2
When the cluster performs a rolling update:
1. Old service `relay-family-svc-a1b2c3d4` is deleted
2. New service `relay-family-svc-e5f6g7h8` is created with same Cluster API labels
3. **Reconciliation Controller detects Service CREATE event** with matching labels
4. Controller finds Ingress with annotation matching the service labels
5. Controller triggers Ingress UPDATE (adds annotation: `myorg.io/reconcile-timestamp: "2026-02-26T10:30:00Z"`)
6. Kyverno mutation webhook intercepts UPDATE operation
7. Kyverno re-queries services with label selector
8. Kyverno resolves new service name `relay-family-svc-e5f6g7h8`
9. JSON Patch applied, Ingress backend updated
10. **Zero manual intervention required!**

### Step 7: Verification After Automatic Reconciliation
```bash
# Verify the service name was automatically updated
kubectl get ingress relay-family-ingress -n relay -o jsonpath='{.spec.rules[0].http.paths[0].backend.service.name}'
# Output: relay-family-svc-e5f6g7h8 (new service!)

# Check reconciliation timestamp annotation
kubectl get ingress relay-family-ingress -n relay -o jsonpath='{.metadata.annotations.myorg\.io/reconcile-timestamp}'
# Output: 2026-02-26T10:30:00Z

# View reconciliation events
kubectl get events -n relay --field-selector involvedObject.name=relay-family-ingress
```

## Alternative Reconciliation Approaches

### Approach 1: Custom Kubernetes Controller (Recommended for Phase 2)
**Pros:**
- Immediate reconciliation (< 5 seconds typical)
- Event-driven, efficient
- Full control over reconciliation logic
- Can implement sophisticated strategies

**Cons:**
- Requires custom controller development
- Additional component to maintain
- More complex deployment

**Implementation:**
```go
// Pseudo-code for controller
func (r *Reconciler) handleServiceEvent(service *corev1.Service) {
    // Extract Cluster API labels
    clusterName := service.Labels["cluster.x-k8s.io/cluster-name"]
    tenantService := service.Labels["cluster.x-k8s.io/tenant-service-name"]
    tenantNamespace := service.Labels["cluster.x-k8s.io/tenant-service-namespace"]

    // Find Ingresses with matching annotation
    labelSelector := fmt.Sprintf("cluster.x-k8s.io/tenant-service-name=%s,cluster.x-k8s.io/tenant-service-namespace=%s", tenantService, tenantNamespace)
    ingresses := findIngressesWithAnnotation("myorg.io/backend-match-labels", labelSelector)

    // Trigger Ingress update to invoke Kyverno mutation
    for _, ingress := range ingresses {
        ingress.Annotations["myorg.io/reconcile-timestamp"] = time.Now().Format(time.RFC3339)
        client.Update(ctx, ingress)
    }
}
```

### Approach 2: GitOps-Based Reconciliation (ArgoCD/Flux)
**Pros:**
- No custom code required
- Leverages existing GitOps tooling
- Declarative, auditable
- Git as source of truth

**Cons:**
- Slower reconciliation (30-180 seconds typical)
- Requires GitOps setup
- Less flexible than custom controller

**Implementation:**
```yaml
# ArgoCD Application with auto-sync
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: relay-ingresses
spec:
  project: default
  source:
    repoURL: https://github.com/org/manifests
    targetRevision: HEAD
    path: ingresses/
  destination:
    server: https://kubernetes.default.svc
    namespace: relay
  syncPolicy:
    automated:
      prune: true
      selfHeal: true  # Auto-reconcile on drift
    syncOptions:
    - CreateNamespace=true
  # When service changes, Ingress becomes "out of sync"
  # ArgoCD re-applies from Git, triggering Kyverno mutation
```

### Approach 3: Scheduled Reconciliation (CronJob)
**Pros:**
- Simplest implementation
- No controller development needed
- Works with any Kubernetes cluster

**Cons:**
- Slowest reconciliation (minutes, depends on schedule)
- Inefficient (runs even when nothing changed)
- Higher API load

**Implementation:**
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: ingress-reconciler
  namespace: relay
spec:
  schedule: "*/5 * * * *"  # Every 5 minutes
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: ingress-reconciler
          containers:
          - name: reconcile
            image: bitnami/kubectl:latest
            command:
            - /bin/sh
            - -c
            - |
              # Find all Ingresses with reconciliation annotation
              kubectl get ingress -A -o json | jq -r '.items[] | select(.metadata.annotations."myorg.io/backend-match-labels" != null) | "\(.metadata.namespace)/\(.metadata.name)"' | while read ingress; do
                namespace=$(echo $ingress | cut -d/ -f1)
                name=$(echo $ingress | cut -d/ -f2)
                # Force re-evaluation by updating timestamp annotation
                kubectl annotate ingress $name -n $namespace "myorg.io/reconcile-timestamp=$(date -Iseconds)" --overwrite
              done
          restartPolicy: OnFailure
```

## Reconciliation Strategy Decision Matrix

| Requirement | Custom Controller | GitOps | CronJob |
|------------|------------------|--------|---------|
| Reconciliation Speed | ⭐⭐⭐ Immediate | ⭐⭐ 30-180s | ⭐ Minutes |
| Implementation Complexity | ⭐ High | ⭐⭐ Medium | ⭐⭐⭐ Low |
| Resource Efficiency | ⭐⭐⭐ Event-driven | ⭐⭐ Sync-driven | ⭐ Periodic |
| Existing Infrastructure | ⭐ New component | ⭐⭐⭐ Uses GitOps | ⭐⭐⭐ Built-in K8s |
| Production Readiness | ⭐⭐⭐ Robust | ⭐⭐⭐ Battle-tested | ⭐⭐ Basic |

**Recommendation:** Start with CronJob for MVP testing, use GitOps if already deployed, implement custom controller for production at scale.
