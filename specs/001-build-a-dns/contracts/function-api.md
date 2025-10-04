# Crossplane Function API Contract: cdk8s-function

## Overview

This document defines the API contract for the custom Crossplane function that renders cdk8s Python code into Kubernetes manifests.

## Function Metadata

**Package Name**: `cdk8s-function-xp`
**Function Name**: `function-cdk8s`
**Runtime**: Python 3.11+
**Dependencies**: cdk8s, cdk8s-plus-27, crossplane-function-sdk

## Input Contract

### Function Request

The function receives a standard Crossplane function request with the following structure:

```yaml
apiVersion: apiextensions.crossplane.io/v1beta1
kind: FunctionRequest
metadata:
  name: example
spec:
  observed:
    composite:
      resource:
        apiVersion: dns.internal/v1alpha1
        kind: XInternalDNS
        metadata:
          name: example-dns
        spec:
          domain: "internal.example.com"
          storageSize: "1Gi"
          externalDnsVersion: "v0.14.0"
          powerdnsVersion: "powerdns/pdns-auth-50"
          syncInterval: "30s"
  desired:
    composite:
      resource:
        # Same as observed initially
    resources: []
  context:
    apiextensions.crossplane.io/environment:
      # Optional environment data
```

### cdk8s Code Input

The function expects cdk8s Python code to be provided via annotation on the composite resource:

```yaml
metadata:
  annotations:
    cdk8s-function.crossplane.io/code: |
      from constructs import Construct
      from cdk8s import App, Chart
      from imports import k8s

      class DNSChart(Chart):
          def __init__(self, scope: Construct, id: str, props: dict):
              super().__init__(scope, id)

              domain = props.get('domain')
              storage_size = props.get('storageSize')
              # ... create Kubernetes resources
```

Or via ConfigMap reference:

```yaml
metadata:
  annotations:
    cdk8s-function.crossplane.io/code-ref: |
      name: dns-cdk8s-code
      namespace: crossplane-system
      key: dns_resources.py
```

## Output Contract

### Function Response

The function returns a standard Crossplane function response with rendered Kubernetes resources:

```yaml
apiVersion: apiextensions.crossplane.io/v1beta1
kind: FunctionResponse
metadata:
  name: example
spec:
  desired:
    composite:
      resource:
        apiVersion: dns.internal/v1alpha1
        kind: XInternalDNS
        metadata:
          name: example-dns
        spec:
          domain: "internal.example.com"
          # ... unchanged
        status:
          conditions:
          - type: Synced
            status: "True"
            reason: ReconcileSuccess
            message: "cdk8s resources rendered successfully"
    resources:
    - name: dns-deployment
      resource:
        apiVersion: apps/v1
        kind: Deployment
        # ... rendered from cdk8s
    - name: dns-service
      resource:
        apiVersion: v1
        kind: Service
        # ... rendered from cdk8s
    - name: dns-storage
      resource:
        apiVersion: v1
        kind: PersistentVolumeClaim
        # ... rendered from cdk8s
    - name: powerdns-config
      resource:
        apiVersion: v1
        kind: ConfigMap
        # ... rendered from cdk8s
    - name: powerdns-secret
      resource:
        apiVersion: v1
        kind: Secret
        # ... rendered from cdk8s
  results:
  - severity: NORMAL
    message: "Successfully rendered 5 resources from cdk8s code"
```

### Error Response

On error, the function returns a response with error results:

```yaml
apiVersion: apiextensions.crossplane.io/v1beta1
kind: FunctionResponse
metadata:
  name: example
spec:
  desired:
    composite:
      resource:
        status:
          conditions:
          - type: Synced
            status: "False"
            reason: ReconcileError
            message: "Failed to render cdk8s code: {error_details}"
  results:
  - severity: FATAL
    message: "cdk8s rendering failed: {error_details}"
```

## Function Behavior

### Processing Steps

1. **Parse Request**: Extract composite resource and its spec
2. **Load cdk8s Code**:
   - If `cdk8s-function.crossplane.io/code` annotation exists, use inline code
   - If `cdk8s-function.crossplane.io/code-ref` annotation exists, fetch from ConfigMap
   - Otherwise, return error
3. **Install Dependencies**: Use `uv pip install` to install cdk8s and dependencies
4. **Prepare Props**: Convert composite resource spec to Python dict for cdk8s
5. **Execute cdk8s**:
   - Create cdk8s App
   - Execute provided Python code with props
   - Synthesize to YAML
6. **Parse Output**: Parse YAML manifests into Crossplane desired resources
7. **Return Response**: Package resources in FunctionResponse

### Dependency Installation

The function uses `uv` for fast, deterministic dependency installation:

```bash
# Install cdk8s and common dependencies
uv pip install --system \
  cdk8s==2.68.84 \
  cdk8s-plus-27==2.7.77 \
  constructs==10.3.0
```

Versions are pinned to exact values for deterministic builds.

### Code Execution

cdk8s code is executed in an isolated Python environment:

```python
import sys
from io import StringIO
from cdk8s import App

# Capture stdout for synth output
stdout_capture = StringIO()
sys.stdout = stdout_capture

# Execute user code
exec(cdk8s_code, {'props': props, 'App': App, ...})

# Restore stdout
sys.stdout = sys.__stdout__

# Get synthesized YAML
yaml_output = stdout_capture.getvalue()
```

### Resource Naming

Resources rendered from cdk8s are named according to this pattern:

- Composite resource name: `example-dns`
- Resource name in response: `example-dns-{resource-type}`
- Examples:
  - `example-dns-deployment`
  - `example-dns-service`
  - `example-dns-pvc`
  - `example-dns-configmap`
  - `example-dns-secret`

### Props Mapping

Composite resource spec fields are mapped to cdk8s props:

```python
# Composite spec
spec:
  domain: "internal.example.com"
  storageSize: "1Gi"
  externalDnsVersion: "v0.14.0"

# cdk8s props
props = {
    'domain': 'internal.example.com',
    'storage_size': '1Gi',
    'external_dns_version': 'v0.14.0',
    # ... all spec fields in snake_case
}
```

## Validation Rules

### Input Validation

- Request must have `observed.composite.resource`
- Composite resource must have either `cdk8s-function.crossplane.io/code` or `cdk8s-function.crossplane.io/code-ref` annotation
- If using code-ref, referenced ConfigMap must exist and have specified key

### Code Validation

- Python code must be syntactically valid
- Code must define a Chart class or function that creates resources
- Code must not contain malicious operations (filesystem access, network calls)

### Output Validation

- All rendered resources must be valid Kubernetes manifests
- Resources must have apiVersion, kind, and metadata.name
- Resource names must be unique within the composition

## Error Handling

### Error Types

1. **MissingCodeError**: No cdk8s code provided
   ```yaml
   results:
   - severity: FATAL
     message: "No cdk8s code found. Add 'cdk8s-function.crossplane.io/code' annotation."
   ```

2. **InvalidCodeError**: Python syntax error
   ```yaml
   results:
   - severity: FATAL
     message: "Invalid Python code: {syntax_error_details}"
   ```

3. **ExecutionError**: Runtime error during cdk8s execution
   ```yaml
   results:
   - severity: FATAL
     message: "cdk8s execution failed: {runtime_error_details}"
   ```

4. **InstallError**: Dependency installation failure
   ```yaml
   results:
   - severity: FATAL
     message: "Failed to install dependencies: {install_error_details}"
   ```

5. **InvalidOutputError**: Rendered YAML is not valid Kubernetes
   ```yaml
   results:
   - severity: FATAL
     message: "Invalid Kubernetes manifest: {validation_error}"
   ```

## Testing Contract

### Unit Test Cases

1. **Valid cdk8s code returns resources**
   - Input: Valid Python code with props
   - Expected: Resources in desired state

2. **Invalid Python syntax returns error**
   - Input: Python with syntax error
   - Expected: FATAL result with error message

3. **Missing code annotation returns error**
   - Input: Composite without code annotation
   - Expected: FATAL result with MissingCodeError

4. **Props correctly mapped from spec**
   - Input: Composite with various spec fields
   - Expected: Props dict with snake_case keys

### Integration Test Cases

1. **Full composition with cdk8s function**
   - Create composite resource with inline code
   - Verify rendered Kubernetes resources created
   - Verify resources match expected schema

2. **cdk8s code from ConfigMap reference**
   - Create ConfigMap with cdk8s code
   - Create composite with code-ref annotation
   - Verify function fetches and executes code

## Performance Requirements

- **Cold Start**: < 5 seconds (including dependency installation)
- **Warm Execution**: < 1 second (dependencies cached)
- **Memory Usage**: < 256MB
- **Concurrent Requests**: Support 10 concurrent function invocations

## Security Considerations

1. **Code Execution Isolation**:
   - Execute in restricted Python environment
   - No filesystem access outside /tmp
   - No network access

2. **Resource Limits**:
   - CPU: 500m
   - Memory: 256Mi
   - Execution timeout: 30s

3. **Input Sanitization**:
   - Validate Python code before execution
   - Sanitize props to prevent injection

## Example Usage

### Minimal Example

```yaml
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: my-dns
  annotations:
    cdk8s-function.crossplane.io/code: |
      from cdk8s import Chart
      from imports import k8s

      class DNSChart(Chart):
          def __init__(self, scope, id, props):
              super().__init__(scope, id)

              k8s.KubeService(self, 'dns-svc',
                  spec=k8s.ServiceSpec(
                      type='ClusterIP',
                      ports=[k8s.ServicePort(port=53, protocol='UDP')]
                  )
              )
spec:
  domain: "internal.example.com"
```

### ConfigMap Reference Example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dns-cdk8s-code
  namespace: crossplane-system
data:
  dns_resources.py: |
    # cdk8s code here
---
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: my-dns
  annotations:
    cdk8s-function.crossplane.io/code-ref: |
      name: dns-cdk8s-code
      namespace: crossplane-system
      key: dns_resources.py
spec:
  domain: "internal.example.com"
```

## Versioning

**API Version**: v1alpha1
**Function Version**: 0.1.0
**Compatibility**: Crossplane >= 2.0.2

## Completion Checklist

- [x] Request format documented
- [x] Response format documented
- [x] Error responses defined
- [x] Processing steps outlined
- [x] Validation rules specified
- [x] Props mapping documented
- [x] Security considerations noted
- [x] Examples provided
- [x] Testing contract defined
