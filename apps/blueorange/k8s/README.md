# Blue Orange Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Blue Orange application with Cloudflare Tunnel.

## Prerequisites

1. A Cloudflare account with a configured tunnel
2. Cloudflare tunnel token
3. Kubernetes cluster access

## Setup

### 1. Create Cloudflare Tunnel Token Secret

First, obtain your tunnel token from Cloudflare Zero Trust dashboard, then create the secret:

```bash
kubectl create namespace blueorange
kubectl create secret generic tunnel-token \
  --from-literal=token='YOUR_TUNNEL_TOKEN_HERE' \
  -n blueorange
```

**To get your tunnel token:**
1. Go to Cloudflare Zero Trust dashboard
2. Navigate to Networks > Tunnels
3. Create a new tunnel or select an existing one
4. Copy the tunnel token (starts with `eyJ...`)

### 2. Deploy with Kustomize (Recommended)

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
- **cloudflared deployment**: Runs 2 replicas of cloudflared tunnel connector using tunnel token
- **tunnel-token secret**: Contains the Cloudflare tunnel token for authentication

The cloudflared tunnel connects to Cloudflare's edge using the tunnel token and routes traffic to the blueorange service based on the tunnel configuration in Cloudflare's dashboard.

## Troubleshooting

If the cloudflared pods are not starting:
1. Verify the secret exists: `kubectl get secret tunnel-token -n blueorange`
2. Check the tunnel token is valid (not expired)
3. Verify tunnel configuration in Cloudflare dashboard includes the blueorange service
4. View logs: `kubectl logs -n blueorange -l app=cloudflared`

Common issues:
- **Invalid token**: Make sure you copied the full tunnel token including any trailing characters
- **Tunnel not found**: Verify the tunnel still exists in your Cloudflare dashboard
- **Connection refused**: Ensure the blueorange service is running and accessible

## Cleanup

To remove all resources:

```bash
kubectl delete -k k8s/
```

Or delete the entire namespace:

```bash
kubectl delete namespace blueorange
```
