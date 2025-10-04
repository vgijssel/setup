# external-dns

**Version**: v0.14.0
**Type**: Kubernetes Controller
**Purpose**: Synchronize Kubernetes Ingress resources to DNS providers

## Description

external-dns makes Kubernetes resources discoverable via public or internal DNS servers. It retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine desired DNS records.

## Usage in internal-dns-xp

Used as a sidecar container in the internal DNS deployment to:
- Monitor Kubernetes Ingress resources cluster-wide
- Synchronize discovered ingresses to PowerDNS via API
- Maintain DNS records automatically

## Configuration

```yaml
args:
  - --source=ingress
  - --provider=pdns
  - --pdns-server=http://localhost:8081
  - --pdns-api-key=$(PDNS_API_KEY)
  - --domain-filter=<domain>
  - --interval=30s
```

## References

- **Image**: `registry.k8s.io/external-dns/external-dns:v0.14.0`
- **Documentation**: https://github.com/kubernetes-sigs/external-dns
- **Providers**: https://github.com/kubernetes-sigs/external-dns#status-of-providers
