# Ingress Library Chart

Reusable Helm library chart for creating Kubernetes Ingress resources with full configurability and type-safe defaults.

## Overview

This library chart implements the DRY principle for Ingress resource management across all applications in the monorepo. It provides a generic, type-safe template that can be used as a dependency in any application chart.

## Features

- **Type-safe**: Required fields enforced via Helm `required` function
- **Flexible**: Supports all standard Ingress configurations
- **TLS-ready**: Built-in TLS configuration support
- **Annotation support**: Full control over ingress annotations
- **IngressClass support**: Configurable IngressClassName

## Usage

### As a Chart Dependency

Add to your chart's `Chart.yaml`:

```yaml
apiVersion: v2
name: my-app
version: 1.0.0
dependencies:
  - name: ingress
    version: "1.0.0"
    repository: "file://../../libs/ingress"
```

Update dependencies:

```bash
helm dependency update
```

### Configuration

In your chart's `values.yaml`:

```yaml
ingress:
  name: my-app-ingress              # Required
  namespace: default                 # Optional (defaults to release namespace)
  ingressClassName: nginx           # Optional
  host: app.example.com             # Required
  path: /                           # Optional (default: /)
  pathType: Prefix                  # Optional (default: Prefix)

  backend:
    service:
      name: my-app                  # Required
      port:
        number: 80                  # Required

  tls:
    enabled: true                   # Optional (default: false)
    secretName: my-app-tls          # Required if tls.enabled is true
    hosts: []                       # Optional additional hosts

  annotations:                      # Optional
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/backend-protocol: HTTP
```

## Examples

### Basic HTTP Ingress

```yaml
ingress:
  name: web-app
  host: web.example.com
  backend:
    service:
      name: web-app
      port:
        number: 8080
```

### HTTPS Ingress with TLS

```yaml
ingress:
  name: api
  host: api.example.com
  path: /api
  pathType: Prefix
  backend:
    service:
      name: api-server
      port:
        number: 3000
  tls:
    enabled: true
    secretName: api-tls
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
```

### gRPC Ingress

```yaml
ingress:
  name: grpc-service
  ingressClassName: nginx
  host: grpc.example.com
  backend:
    service:
      name: grpc-server
      port:
        number: 9090
  tls:
    enabled: true
    secretName: grpc-tls
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/backend-protocol: GRPC
```

### Webhook Ingress with Specific Path

```yaml
ingress:
  name: webhook
  host: webhooks.example.com
  path: /api/webhook
  pathType: Prefix
  backend:
    service:
      name: webhook-handler
      port:
        number: 8000
  tls:
    enabled: true
    secretName: webhook-tls
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    internal-networking/expose: "true"
```

## Value Reference

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Yes | - | Ingress resource name |
| `namespace` | string | No | Release namespace | Target namespace |
| `ingressClassName` | string | No | - | IngressClass name |
| `host` | string | Yes | - | Hostname for the ingress rule |
| `path` | string | No | `/` | URL path |
| `pathType` | string | No | `Prefix` | Path matching type (Prefix, Exact, ImplementationSpecific) |
| `backend.service.name` | string | Yes | - | Backend service name |
| `backend.service.port.number` | integer | Yes | - | Backend service port |
| `tls.enabled` | boolean | No | `false` | Enable TLS |
| `tls.secretName` | string | Yes (if tls.enabled) | - | TLS certificate secret name |
| `tls.hosts` | array | No | `[]` | Additional TLS hosts |
| `annotations` | object | No | `{}` | Ingress annotations |

## Design Principles

### Single Responsibility

This library creates exactly one Ingress resource. For multiple ingresses, use multiple chart instances (e.g., via umbrella chart).

### Type Safety

All required fields use Helm's `required` function to fail fast on misconfiguration:

```yaml
name: {{ .Values.name | required "name is required" }}
host: {{ .Values.host | required "host is required" }}
```

### No Defaults for Critical Values

Values like `host`, `name`, and `backend.service.name` have no defaults to prevent accidental misconfigurations.

### Flexibility Over Convention

While we provide sensible defaults for optional fields (path, pathType), all Ingress features remain accessible.

## Real-World Usage

### ArgoCD Ingress Umbrella Chart

See `apps/argocd/ingress/` for a complete example of using this library to manage 4 different ingresses via an umbrella chart:

- HTTP ingress (UI/API)
- gRPC ingress (CLI)
- Server webhook ingress
- ApplicationSet webhook ingress

Each subchart depends on this library and provides specific configuration.

## Chart Type

This chart is set to `type: application` rather than `type: library` to ensure templates are rendered. Helm library charts do not render templates by default.

## Maintenance

### Versioning

When making changes to this library:

1. Update `version` in `Chart.yaml`
2. Update dependencies in consuming charts
3. Run `helm dependency update` in consuming charts
4. Test with `helm template` before deploying

### Testing

Validate the library generates correct output:

```bash
# Create test values
cat > test-values.yaml <<EOF
ingress:
  name: test-ingress
  host: test.example.com
  backend:
    service:
      name: test-service
      port:
        number: 80
  tls:
    enabled: true
    secretName: test-tls
EOF

# Template and inspect
helm template test-ingress . --values test-values.yaml
```

## Migration Path

To migrate existing ingresses to this library:

1. Extract ingress configuration to values.yaml
2. Add this library as a dependency
3. Remove inline Ingress templates
4. Validate with `helm template`
5. Deploy and verify

## Contributing

When extending this library:
- Keep it generic (no application-specific logic)
- Maintain backward compatibility
- Update this README with new parameters
- Provide examples for new features

## Related

- [ArgoCD Ingress Example](../../apps/argocd/ingress/README.md) - Real-world umbrella chart usage
- [Kubernetes Ingress Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/)
