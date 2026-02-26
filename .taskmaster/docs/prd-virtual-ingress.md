# Virtual Ingress with Label-Based Service Selection

## Problem Statement

Kubevirt CCM service mirroring creates LoadBalancer services in the enigma cluster with random, unpredictable names (e.g., "a18c2be1873b84bcd8630e79298a07cf"). Standard Kubernetes Ingress resources can only target services by name, making it impossible to pre-define ingress configurations for these dynamically-named services.

## Goal

Create a Helm chart in `libs/virtual-ingress` that enables users to define ingress resources targeting services by labels instead of names. Use Kyverno policies to automatically discover matching services and generate standard Ingress resources with the correct service names.

## Solution Overview

1. Define a custom Ingress format that accepts `matchLabels` instead of service `name`
2. Implement Kyverno policies to:
   - Watch for ingress resources with label-based service selection
   - Query services matching the specified labels
   - Generate standard Ingress resources with resolved service names
3. Package as a reusable Helm chart with configurable options

## Requirements

### Functional Requirements

1. **Custom Ingress Format**
   - Support standard Ingress spec fields (tls, rules, annotations)
   - Accept `matchLabels` in place of service `name` under `backend.service`
   - Maintain compatibility with existing Ingress annotations (cert-manager, nginx)

2. **Service Discovery**
   - Query services in the same namespace using provided labels
   - Handle cases where no service matches the labels (error/warning)
   - Handle cases where multiple services match (pick first/error)
   - Support cross-namespace service lookup if needed

3. **Ingress Generation**
   - Generate standard Ingress resources with resolved service names
   - Preserve all original metadata (annotations, labels)
   - Maintain ownership/cleanup relationships

4. **Kyverno Policy**
   - Trigger on ingress creation/update with matchLabels
   - Generate ClusterPolicy or Policy resources
   - Handle service name updates if service is recreated

### Non-Functional Requirements

1. **Reliability**
   - Handle service not found scenarios gracefully
   - Retry logic for service discovery
   - Clear status messages on generated ingress

2. **Performance**
   - Minimal latency between service creation and ingress update
   - Efficient label queries

3. **Observability**
   - Log service discovery events
   - Status conditions on generated ingress
   - Metrics for policy execution

## Technical Design

### Helm Chart Structure

```
libs/virtual-ingress/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── kyverno-policy.yaml
│   ├── rbac.yaml
│   └── _helpers.tpl
└── README.md
```

### Kyverno Policy Logic

1. **Trigger**: Match on Ingress resources with `backend.service.matchLabels`
2. **Service Lookup**: Use API server to query services by labels
3. **Validation**: Ensure exactly one service matches
4. **Generation**: Create standard Ingress with resolved service name
5. **Ownership**: Set owner references for cleanup

### Example Usage

Input (custom format):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: coder
  namespace: tenant-root
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-http-version: "1.1"
    nginx.ingress.kubernetes.io/proxy-buffering: "off"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
spec:
  ingressClassName: tenant-root
  tls:
    - hosts:
        - coder.enigma.vgijssel.nl
      secretName: coder-tls
    - hosts:
        - "*.coder.enigma.vgijssel.nl"
      secretName: coder-wildcard-tls
  rules:
    - host: coder.enigma.vgijssel.nl
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                matchLabels:
                  cluster.x-k8s.io/cluster-name: kubernetes-cluster-docs-infra-prod
                  cluster.x-k8s.io/tenant-service-name: relay-family
                  cluster.x-k8s.io/tenant-service-namespace: relay
                port:
                  number: 80
```

Output (generated):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: coder-generated
  namespace: tenant-root
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-http-version: "1.1"
    nginx.ingress.kubernetes.io/proxy-buffering: "off"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  ownerReferences:
    - apiVersion: networking.k8s.io/v1
      kind: Ingress
      name: coder
spec:
  ingressClassName: tenant-root
  tls:
    - hosts:
        - coder.enigma.vgijssel.nl
      secretName: coder-tls
    - hosts:
        - "*.coder.enigma.vgijssel.nl"
      secretName: coder-wildcard-tls
  rules:
    - host: coder.enigma.vgijssel.nl
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: a18c2be1873b84bcd8630e79298a07cf  # Resolved from labels
                port:
                  number: 80
```

## Tasks

### Task 1: Project Setup
- Create `libs/virtual-ingress` directory structure
- Initialize Helm chart with Chart.yaml and values.yaml
- Set up Moon project configuration (moon.yml)
- Add project to monorepo

### Task 2: Kyverno Policy Implementation
- Design Kyverno ClusterPolicy for service discovery
- Implement label-based service query logic
- Handle multiple/no service matches with appropriate errors
- Add validation rules for matchLabels format
- Test policy with mock ingress resources

### Task 3: Ingress Generation Logic
- Implement generate rule in Kyverno policy
- Map custom ingress format to standard ingress
- Preserve all annotations and metadata
- Set up owner references for cleanup
- Handle service name updates

### Task 4: RBAC Configuration
- Create ServiceAccount for Kyverno policy execution
- Define ClusterRole with necessary permissions:
  - Read services (list, get)
  - Read/write ingresses
- Create RoleBinding

### Task 5: Helm Chart Configuration
- Define values.yaml schema with configuration options:
  - Namespace restrictions
  - Service discovery scope
  - Error handling behavior
- Implement templating in kyverno-policy.yaml
- Add helper functions in _helpers.tpl
- Configure chart dependencies

### Task 6: Testing
- Create test fixtures with sample services and ingresses
- Test single service match scenario
- Test no service match scenario (should fail gracefully)
- Test multiple service match scenario (should error/pick first)
- Test service recreation (name change)
- Validate WebSocket annotations are preserved
- Test cert-manager integration

### Task 7: Documentation
- Write comprehensive README.md:
  - Installation instructions
  - Usage examples
  - Configuration options
  - Troubleshooting guide
- Document Kyverno policy behavior
- Add inline comments to templates
- Create migration guide from standard ingress

### Task 8: Integration
- Deploy to test cluster
- Create sample ingress with Kubevirt CCM service
- Verify ingress generation and service routing
- Test with actual WebSocket connections
- Validate TLS certificate generation
- Performance testing

### Task 9: CI/CD
- Add moon tasks for linting (helm lint)
- Add validation tests for Kyverno policies
- Set up integration tests in CI pipeline
- Add deployment automation

## Success Criteria

1. Users can define ingress resources using service labels instead of names
2. Kyverno automatically discovers services and generates working ingress resources
3. All existing ingress features work (TLS, annotations, WebSocket support)
4. Service name changes are handled gracefully
5. Clear error messages when service lookup fails
6. Helm chart is installable via standard `helm install` command
7. Documentation enables users to adopt without additional support

## Dependencies

- Kyverno installed in cluster
- Kubevirt CCM for service mirroring
- cert-manager for TLS (optional but recommended)
- nginx-ingress controller

## Risks and Mitigations

1. **Risk**: Service not available when ingress is created
   - **Mitigation**: Kyverno can retry; add clear status messages

2. **Risk**: Multiple services match labels
   - **Mitigation**: Implement strict validation; document label best practices

3. **Risk**: Performance impact of service queries
   - **Mitigation**: Use Kyverno's caching; limit query scope

4. **Risk**: Kyverno policy complexity
   - **Mitigation**: Thorough testing; comprehensive documentation

## Future Enhancements

- Support for multiple backend services (service mesh)
- Cross-namespace service discovery
- Service priority/weight selection
- Automatic service health checking before ingress creation
- Integration with external DNS
