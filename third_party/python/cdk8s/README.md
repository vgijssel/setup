# cdk8s - Cloud Development Kit for Kubernetes

**Version**: 2.68.84
**Type**: Python Library
**Purpose**: Type-safe Kubernetes resource generation

## Description

cdk8s is a software development framework for defining Kubernetes applications using familiar programming languages. It generates standard Kubernetes YAML manifests from Python code with full IDE support and type safety.

## Usage in internal-dns-xp

Used in the cdk8s-function-xp Crossplane function to:
- Define Kubernetes resources (Deployment, Service, PVC, ConfigMap, Secret) in Python
- Provide type checking and validation at development time
- Generate standard Kubernetes manifests from code
- Enable reusable, parameterized resource templates

## Dependencies

```toml
cdk8s==2.68.84
cdk8s-plus-27==2.7.77  # Kubernetes API v1.27
constructs==10.3.0
```

## Architecture

```
Crossplane Composite → Function → cdk8s Code → Python Execution → cdk8s Chart → YAML Output
```

## Example

```python
from cdk8s import Chart, App
from imports import k8s

class DNSChart(Chart):
    def __init__(self, scope, id, props):
        super().__init__(scope, id)

        k8s.KubeDeployment(self, 'deployment',
            metadata={'name': 'dns-server'},
            spec={'replicas': 1, ...}
        )

app = App()
DNSChart(app, 'dns-chart', props)
print(app.synth_yaml())
```

## References

- **PyPI**: https://pypi.org/project/cdk8s/
- **Documentation**: https://cdk8s.io/
- **Python Docs**: https://cdk8s.io/docs/latest/python/
- **GitHub**: https://github.com/cdk8s-team/cdk8s
