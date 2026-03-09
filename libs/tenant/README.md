# CozyStack Tenant Helm Chart

A Helm chart for generating CozyStack Tenant custom resources.

## Installation

```bash
helm install my-tenant libs/tenant
```

## Configuration

The following table lists the configurable parameters and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `name` | Name of the tenant | `argocd` |
| `namespace` | Namespace where the tenant will be created | `tenant-prod` |
| `spec.etcd` | Enable etcd for the tenant | `false` |
| `spec.host` | Host configuration for the tenant | `""` |
| `spec.ingress` | Enable ingress for the tenant | `false` |
| `spec.monitoring` | Enable monitoring for the tenant | `false` |
| `spec.seaweedfs` | Enable seaweedfs for the tenant | `false` |

## Example Usage

### Using default values

```bash
helm template my-tenant libs/tenant
```

### With custom values

```bash
helm template my-tenant libs/tenant \
  --set name=myapp \
  --set namespace=tenant-dev \
  --set spec.etcd=true \
  --set spec.host=myapp.example.com \
  --set spec.ingress=true \
  --set spec.monitoring=true \
  --set spec.seaweedfs=true
```

### Using a values file

Create a `custom-values.yaml`:

```yaml
name: myapp
namespace: tenant-dev
spec:
  etcd: true
  host: myapp.example.com
  ingress: true
  monitoring: true
  seaweedfs: true
```

Then apply:

```bash
helm template my-tenant libs/tenant -f custom-values.yaml
```

## Generated Resource

The chart generates a CozyStack Tenant custom resource:

```yaml
apiVersion: apps.cozystack.io/v1alpha1
kind: Tenant
metadata:
  name: {{ .Values.name }}
  namespace: {{ .Values.namespace }}
spec:
  etcd: {{ .Values.spec.etcd }}
  host: {{ .Values.spec.host }}
  ingress: {{ .Values.spec.ingress }}
  monitoring: {{ .Values.spec.monitoring }}
  seaweedfs: {{ .Values.spec.seaweedfs }}
```
