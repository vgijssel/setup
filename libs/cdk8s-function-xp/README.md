# cdk8s-function-xp

A Crossplane composition function that executes cdk8s Python code to generate Kubernetes resources.

## Overview

This function enables Crossplane compositions to leverage cdk8s for type-safe, programmatic Kubernetes resource generation. It accepts Python code as input, executes it in a sandboxed environment, and returns the generated Kubernetes manifests.

## Architecture

```
Crossplane Composition → Function Input (cdk8s code + props) → Python Execution → cdk8s Chart → Kubernetes Resources
```

## Features

- **Type-safe resource generation**: Full Python type checking with cdk8s
- **Props mapping**: Automatic camelCase to snake_case conversion
- **Error handling**: Comprehensive error reporting for syntax, runtime, and import errors
- **Secure execution**: Isolated execution environment with controlled imports

## Usage in Compositions

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  mode: Pipeline
  pipeline:
    - step: render-resources
      functionRef:
        name: function-cdk8s
      input:
        apiVersion: v1
        kind: ConfigMap
        data:
          code: |
            from cdk8s import Chart
            from imports import k8s

            class MyChart(Chart):
                def __init__(self, scope, id, props):
                    super().__init__(scope, id)
                    # Use props from composite resource
                    k8s.KubeDeployment(self, 'deployment', ...)
```

## Development

### Project Structure

```
libs/cdk8s-function-xp/
├── src/
│   ├── function.py         # Main entry point
│   ├── cdk8s_renderer.py   # cdk8s execution engine
│   └── requirements.txt    # Runtime dependencies
├── tests/
│   └── unit/              # Pytest unit tests
├── Dockerfile             # Function container image
├── crossplane.yaml        # Function package metadata
└── pyproject.toml        # Python project config
```

### Build

```bash
# Run tests
nx test cdk8s-function-xp

# Build Docker image
nx docker-build cdk8s-function-xp

# Lint code
nx lint cdk8s-function-xp

# Format code
nx format cdk8s-function-xp
```

## Testing

Tests use pytest with TDD approach:

```bash
# Run all unit tests
cd libs/cdk8s-function-xp && uv run pytest tests/

# Run specific test file
uv run pytest tests/unit/test_renderer_valid.py
```

## Dependencies

- **Python**: >= 3.11
- **cdk8s**: 2.68.84
- **cdk8s-plus-27**: 2.7.77
- **constructs**: 10.3.0
- **PyYAML**: 6.0.1

All dependencies are pinned to exact versions for reproducibility.

## Function API

### Input Format

```yaml
apiVersion: v1
kind: ConfigMap
data:
  code: "<cdk8s Python code>"
```

### Props Mapping

Composite resource spec fields (camelCase) are automatically converted to snake_case for Python:

- `storageSize` → `storage_size`
- `externalDnsVersion` → `external_dns_version`

### Error Handling

The function returns errors in standard Crossplane format:

```yaml
status:
  conditions:
    - type: Fatal
      status: "True"
      reason: RenderError
      message: "<error details>"
```

## References

- **Crossplane Functions**: https://docs.crossplane.io/latest/concepts/composition-functions/
- **cdk8s Documentation**: https://cdk8s.io/
- **Third-party cdk8s**: [third_party/python/cdk8s/README.md](../../third_party/python/cdk8s/README.md)
