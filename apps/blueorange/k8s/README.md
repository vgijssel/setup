# Blue Orange Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Blue Orange application with Cloudflare Tunnel.

## Prerequisites

1. A Cloudflare account with a configured tunnel
2. Tunnel credentials JSON file
3. Kubernetes cluster access

## Setup

### 1. Create Cloudflare Tunnel Secret

First, create the tunnel credentials secret. You need to obtain your tunnel credentials JSON from Cloudflare:

```bash
kubectl create namespace blueorange
kubectl create secret generic cloudflared-credentials \
  --from-file=credentials.json=/path/to/your/credentials.json \
  -n blueorange
```

### 2. Update ConfigMap

Edit `configmap-cloudflared.yaml` and replace:
- `blueorange-tunnel` with your actual tunnel name
- `blueorange.example.com` with your actual domain

### 3. Deploy with Kustomize (Recommended)

Deploy all resources in the correct order using kustomize:

```bash
kubectl apply -k k8s/
```

Or preview what will be applied:

```bash
kubectl kustomize k8s/
```

### Alternative: Apply Manually

If you prefer to apply manifests individually without kustomize:

```bash
kubectl apply -f k8s/namespace-blueorange.yaml
kubectl apply -f k8s/service-blueorange.yaml
kubectl apply -f k8s/configmap-cloudflared.yaml
kubectl apply -f k8s/deployment-blueorange.yaml
kubectl apply -f k8s/deployment-cloudflared.yaml
```

## Verify Deployment

Check that all pods are running:

```bash
kubectl get pods -n blueorange -l app=blueorange
kubectl get pods -n blueorange -l app=cloudflared
```

Check all resources in the namespace:

```bash
kubectl get all -n blueorange
```

Check cloudflared logs:

```bash
kubectl logs -n blueorange -l app=cloudflared -f
```

## Architecture

- **blueorange deployment**: Runs 2 replicas of the nginx container serving the built application
- **blueorange service**: ClusterIP service exposing port 80
- **cloudflared deployment**: Runs 2 replicas of cloudflared tunnel connector
- **cloudflared configmap**: Contains tunnel configuration

The cloudflared tunnel connects to Cloudflare's edge and routes traffic to the blueorange service.

## Troubleshooting

If the cloudflared pods are not starting:
1. Verify the secret exists: `kubectl get secret cloudflared-credentials -n blueorange`
2. Check the tunnel name in configmap matches your Cloudflare tunnel
3. View logs: `kubectl logs -n blueorange -l app=cloudflared`

## Cleanup

To remove all resources:

```bash
kubectl delete -k k8s/
```

Or delete the entire namespace:

```bash
kubectl delete namespace blueorange
```
