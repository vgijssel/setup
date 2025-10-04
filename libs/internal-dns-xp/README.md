# internal-dns-xp

A Crossplane configuration package that provides an internal DNS service for Kubernetes Ingress resources.

## Overview

This package enables automatic DNS resolution for Kubernetes Ingresses using external-dns and PowerDNS. It creates a self-contained DNS deployment that discovers Ingress resources and makes them resolvable via DNS queries.

## Features

- **Automatic Ingress Discovery**: Monitors all Ingress resources cluster-wide
- **DNS Resolution**: Makes ingress hostnames resolvable within 2 minutes
- **Persistent Storage**: DNS records persist across pod restarts via PVC
- **Performance**: DNS query response time < 500ms
- **Scale**: Supports 10+ ingresses (up to 100)
- **Clean Deletion**: Removes DNS records when ingresses are deleted

## Architecture

```
Ingress Resources → external-dns → PowerDNS API → SQLite DB → DNS Queries (port 53)
```

Components:
- **external-dns**: Syncs Ingress resources to PowerDNS
- **PowerDNS**: Authoritative DNS server with SQLite backend
- **PVC**: Persistent storage for DNS database
- **Service**: ClusterIP service exposing DNS on port 53

## Usage

### Install Crossplane and Dependencies

```bash
# Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system \
  --create-namespace

# Install provider-kubernetes
kubectl apply -f - <<EOF
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: xpkg.upbound.io/crossplane-contrib/provider-kubernetes:v0.11.4
EOF

# Install cdk8s-function-xp
kubectl apply -f - <<EOF
apiVersion: pkg.crossplane.io/v1beta1
kind: Function
metadata:
  name: function-cdk8s
spec:
  package: <registry>/cdk8s-function-xp:latest
EOF
```

### Create Internal DNS

```yaml
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: my-dns
spec:
  domain: "internal.example.com"
  storageSize: "1Gi"
  externalDnsVersion: "v0.14.0"
  powerdnsVersion: "powerdns/pdns-auth-50"
  syncInterval: "30s"
```

### Verify Deployment

```bash
# Check deployment status
kubectl get internaldns my-dns

# Verify pods are running
kubectl get pods -l app=internal-dns

# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- \
  nslookup myapp.internal.example.com internal-dns-service.default.svc.cluster.local
```

## API Specification

### Spec Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `domain` | string | Yes | - | Internal domain suffix (e.g., 'internal.example.com') |
| `storageSize` | string | No | "1Gi" | PVC storage size for DNS database |
| `externalDnsVersion` | string | No | "v0.14.0" | external-dns image version tag |
| `powerdnsVersion` | string | No | "powerdns/pdns-auth-50" | PowerDNS image version |
| `syncInterval` | string | No | "30s" | external-dns sync interval (Go duration) |

### Status Fields

| Field | Type | Description |
|-------|------|-------------|
| `ready` | boolean | Overall readiness status |
| `powerdnsEndpoint` | string | PowerDNS API endpoint for debugging |
| `recordCount` | integer | Number of DNS records currently stored |
| `conditions` | array | Standard Kubernetes conditions |

## Development

### Project Structure

```
libs/internal-dns-xp/
├── src/
│   └── dns_resources.py      # Resource generation functions
├── tests/
│   ├── unit/                 # Pytest unit tests
│   ├── render/               # Crossplane render tests
│   └── integration/kuttl/    # Integration tests
├── compositions/
│   └── internal-dns.yaml     # Crossplane composition
├── definition.yaml           # XRD specification
├── crossplane.yaml          # Package metadata
└── pyproject.toml          # Python project config
```

### Build and Test

```bash
# Run unit tests
nx test internal-dns-xp

# Run Crossplane render test
nx crossplane-render internal-dns-xp

# Run kuttl integration tests (requires Docker and kind)
nx integration-test internal-dns-xp

# Lint code
nx lint internal-dns-xp

# Format code
nx format internal-dns-xp
```

## Testing

### Unit Tests

Tests use pytest with snapshot testing for cdk8s-generated manifests:

```bash
cd libs/internal-dns-xp && uv run pytest tests/unit/
```

### Integration Tests

Integration tests use kuttl and kind to validate end-to-end functionality:

```bash
kubectl kuttl test --config libs/internal-dns-xp/tests/integration/kuttl/kuttl-test.yaml
```

## Dependencies

### Runtime Dependencies

- **Crossplane**: >= 2.0.2
- **provider-kubernetes**: >= v0.11.4
- **cdk8s-function-xp**: >= v0.1.0

### External Services

- **external-dns**: v0.14.0 (container image)
- **PowerDNS**: powerdns/pdns-auth-50 (container image)

## Deployment Guide

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## Troubleshooting

### Pods Not Starting

```bash
# Check deployment status
kubectl describe deployment internal-dns-deployment

# Check pod logs
kubectl logs -l app=internal-dns -c external-dns
kubectl logs -l app=internal-dns -c powerdns
```

### DNS Not Resolving

```bash
# Check external-dns logs for sync activity
kubectl logs deployment/internal-dns-deployment -c external-dns --tail=50

# Verify PowerDNS API is accessible
kubectl exec -it deployment/internal-dns-deployment -c powerdns -- \
  curl http://localhost:8081/api/v1/servers/localhost
```

### Records Not Updating

```bash
# Check sync interval is configured correctly
kubectl get internaldns -o yaml | grep syncInterval

# Check ingress has correct annotation
kubectl get ingress <name> -o yaml | grep external-dns
```

## References

- **Crossplane**: [third_party/helm/crossplane/README.md](../../third_party/helm/crossplane/README.md)
- **external-dns**: [third_party/helm/external-dns/README.md](../../third_party/helm/external-dns/README.md)
- **PowerDNS**: [third_party/helm/powerdns/README.md](../../third_party/helm/powerdns/README.md)
- **cdk8s**: [third_party/python/cdk8s/README.md](../../third_party/python/cdk8s/README.md)
- **Quickstart Guide**: [specs/001-build-a-dns/quickstart.md](../../specs/001-build-a-dns/quickstart.md)
