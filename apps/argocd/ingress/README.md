# ArgoCD Ingress Umbrella Chart

Unified Helm chart managing all 4 ArgoCD ingress resources using a reusable ingress library.

## Overview

This umbrella chart consolidates all ArgoCD ingress management into a single Helm release, replacing the previous mixed approach of Helm-managed and plain manifest ingresses.

### Architecture

```
apps/argocd/ingress/              ← Umbrella chart
├── charts/
│   ├── ingress-http/             ← Main UI/API ingress
│   ├── ingress-grpc/             ← CLI access ingress
│   ├── ingress-webhook/          ← Server webhook ingress
│   └── ingress-applicationset-webhook/  ← Git Generator webhook
└── values-prod.yaml              ← Production configuration

libs/ingress/                     ← Reusable library (DRY)
```

## Ingresses Managed

| Name | Host | Service | Port | Purpose |
|------|------|---------|------|---------|
| argocd-http | argocd.enigma.vgijssel.nl | argocd-server | 80 | Main UI & API |
| argocd-grpc | argocd-grpc.enigma.vgijssel.nl | argocd-server | 80 | CLI access |
| argocd-server-webhook | argocd-webhook-public.enigma.vgijssel.nl | argocd-server | 80 | GitHub webhooks |
| argocd-applicationset-webhook | argocd-applicationset-webhook-public.enigma.vgijssel.nl | argocd-applicationset-controller | 7000 | ApplicationSet Git Generator |

## Deployment

### Prerequisites

- Main ArgoCD chart deployed with ingresses disabled (see `apps/argocd/argocd/values-prod.yaml`)
- cert-manager installed for TLS certificate management
- Ingress controller with class `tenant-prod` available

### Validation

Run the validation script to verify charts are ready:

```bash
./validate-deployment.sh
```

### Deploy

```bash
helm upgrade --install argocd-ingress . \
  --namespace argocd \
  --values values-prod.yaml
```

### Verify

```bash
# Check all ingresses are created
kubectl get ingress -n argocd

# Test endpoints
curl -k https://argocd.enigma.vgijssel.nl
curl -k https://argocd-grpc.enigma.vgijssel.nl
```

## Configuration

### values-prod.yaml Structure

Each subchart is configured under its name:

```yaml
ingress-http:
  ingress:
    name: argocd-http
    host: argocd.enigma.vgijssel.nl
    backend:
      service:
        name: argocd-server
        port:
          number: 80
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
      nginx.ingress.kubernetes.io/backend-protocol: HTTP

ingress-grpc:
  ingress:
    name: argocd-grpc
    host: argocd-grpc.enigma.vgijssel.nl
    annotations:
      nginx.ingress.kubernetes.io/backend-protocol: GRPC
# ... etc
```

## Benefits

1. **Unified Management**: Single Helm release for all ingresses
2. **Per-Ingress Annotations**: Each ingress has independent annotation control
3. **Reusable Pattern**: Uses `libs/ingress` library for DRY principle
4. **Atomic Updates**: Helm provides rollback capabilities
5. **Clean Separation**: Networking concerns separated from ArgoCD application

## Migration

This chart replaces the following:
- `apps/argocd/argocd/values-prod.yaml`: `server.ingress` (disabled)
- `apps/argocd/argocd/values-prod.yaml`: `server.ingressGrpc` (disabled)
- `apps/argocd/argocd/values-prod.yaml`: `applicationSet.ingress` (disabled)
- `apps/argocd/manifests/ingress-http.yaml` (removed after validation)
- `apps/argocd/manifests/ingress-grpc.yaml` (removed after validation)
- `apps/argocd/manifests/ingress-server-webhook.yaml` (removed after validation)
- `apps/argocd/manifests/ingress-applicationset-webhook.yaml` (removed after validation)

## ApplicationSet Discovery

This directory contains a `config.json` file to enable ArgoCD ApplicationSet discovery and automatic deployment.

```json
{
  "cluster": "https://kubernetes.default.svc",
  "namespace": "argocd"
}
```

## Maintenance

### Updating Dependencies

When updating the `libs/ingress` library:

```bash
# Update all subcharts
for chart in charts/*/; do
  helm dependency update "$chart"
done

# Update umbrella chart
helm dependency update .
```

### Adding New Ingress

1. Create new subchart under `charts/ingress-<name>/`
2. Add dependency on `libs/ingress` in subchart's `Chart.yaml`
3. Configure default values in subchart's `values.yaml`
4. Add subchart to umbrella `Chart.yaml` dependencies
5. Add configuration to `values-prod.yaml`
6. Run `helm dependency update`

## Related Documentation

- [libs/ingress](../../../libs/ingress/README.md) - Reusable ingress library
- [Migration Summary](/tmp/argocd-comparison/FINAL_INGRESS_MIGRATION.md) - Complete migration documentation
