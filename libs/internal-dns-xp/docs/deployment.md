# Deployment Guide: Internal DNS Service

This guide provides step-by-step instructions for deploying the internal DNS service using Crossplane.

## Prerequisites

- Kubernetes cluster (>= 1.27)
- kubectl CLI configured
- Helm 3.x installed
- Docker (for building function image)
- Sufficient permissions to create cluster-scoped resources

## Deployment Steps

### 1. Install Crossplane

```bash
# Add Crossplane Helm repository
helm repo add crossplane-stable https://charts.crossplane.io/stable
helm repo update

# Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system \
  --create-namespace \
  --version 1.14.5 \
  --wait

# Verify installation
kubectl get pods -n crossplane-system
```

Expected output:
```
NAME                                     READY   STATUS    RESTARTS   AGE
crossplane-7d8c8c8c8c-xxxxx              1/1     Running   0          1m
crossplane-rbac-manager-xxxxxx-xxxxx     1/1     Running   0          1m
```

### 2. Install provider-kubernetes

```bash
# Create provider
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: xpkg.upbound.io/crossplane-contrib/provider-kubernetes:v0.11.4
EOF

# Wait for provider to be healthy
kubectl wait --for=condition=healthy provider/provider-kubernetes --timeout=300s

# Verify provider installation
kubectl get providers
```

### 3. Build and Install cdk8s Function

```bash
# Build function Docker image
nx docker-build cdk8s-function-xp

# Tag and push to your registry (replace with your registry)
docker tag cdk8s-function:latest <your-registry>/cdk8s-function:v0.1.0
docker push <your-registry>/cdk8s-function:v0.1.0

# Install function
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1beta1
kind: Function
metadata:
  name: function-cdk8s
spec:
  package: <your-registry>/cdk8s-function:v0.1.0
EOF

# Wait for function to be healthy
kubectl wait --for=condition=healthy function/function-cdk8s --timeout=300s
```

### 4. Install Internal DNS Configuration

```bash
# Apply XRD
kubectl apply -f libs/internal-dns-xp/definition.yaml

# Wait for XRD to be established
kubectl wait --for=condition=established xrd/xinternaldnses.dns.internal --timeout=60s

# Apply Composition
kubectl apply -f libs/internal-dns-xp/compositions/internal-dns.yaml

# Verify installation
kubectl get xrd
kubectl get composition
```

### 5. Create Internal DNS Instance

```bash
# Create InternalDNS resource
cat <<EOF | kubectl apply -f -
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: my-internal-dns
  namespace: default
spec:
  domain: "internal.example.com"
  storageSize: "1Gi"
  externalDnsVersion: "v0.14.0"
  powerdnsVersion: "powerdns/pdns-auth-50"
  syncInterval: "30s"
EOF

# Watch resource creation
kubectl get internaldns -w
```

### 6. Verify Deployment

```bash
# Check composite resource status
kubectl get internaldns my-internal-dns -o yaml

# Verify all pods are running
kubectl get pods -l app=internal-dns

# Check deployment is ready
kubectl get deployment internal-dns-deployment

# Verify service is created
kubectl get service internal-dns-service

# Check PVC is bound
kubectl get pvc dns-storage
```

Expected resources:
- 1 Deployment (internal-dns-deployment)
- 1 Service (internal-dns-service)
- 1 PVC (dns-storage)
- 1 ConfigMap (powerdns-config)
- 1 Secret (powerdns-api-key)

### 7. Test DNS Resolution

```bash
# Create a test Ingress
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test-app
  annotations:
    external-dns.alpha.kubernetes.io/hostname: myapp.internal.example.com
spec:
  rules:
    - host: myapp.internal.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: test-service
                port:
                  number: 80
EOF

# Wait for external-dns to sync (up to 2 minutes)
sleep 60

# Test DNS resolution
kubectl run -it --rm dns-test --image=busybox --restart=Never -- \
  nslookup myapp.internal.example.com internal-dns-service.default.svc.cluster.local
```

Expected output:
```
Server:    internal-dns-service.default.svc.cluster.local
Address:   10.x.x.x

Name:      myapp.internal.example.com
Address:   <ingress-ip>
```

## Configuration Options

### Storage Size

Adjust PVC size based on expected number of DNS records:

```yaml
spec:
  storageSize: "2Gi"  # For 100+ ingresses
```

### Sync Interval

Faster updates require more frequent syncing:

```yaml
spec:
  syncInterval: "15s"  # Check every 15 seconds
```

### Version Pinning

Use specific versions for reproducibility:

```yaml
spec:
  externalDnsVersion: "v0.14.0"  # Pin to specific version
  powerdnsVersion: "powerdns/pdns-auth-50"
```

## Upgrading

### Update Configuration

```bash
# Edit existing InternalDNS resource
kubectl edit internaldns my-internal-dns

# Or apply updated manifest
kubectl apply -f updated-dns.yaml
```

### Update Function

```bash
# Build new function version
nx docker-build cdk8s-function-xp
docker tag cdk8s-function:latest <your-registry>/cdk8s-function:v0.2.0
docker push <your-registry>/cdk8s-function:v0.2.0

# Update function package
kubectl edit function function-cdk8s
# Change spec.package to v0.2.0
```

## Monitoring

### Check Logs

```bash
# external-dns logs
kubectl logs deployment/internal-dns-deployment -c external-dns --tail=50 -f

# PowerDNS logs
kubectl logs deployment/internal-dns-deployment -c powerdns --tail=50 -f
```

### Metrics

```bash
# Check number of DNS records
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  curl -s http://localhost:8081/api/v1/servers/localhost/zones | jq length

# Check DNS query performance
time kubectl run -it --rm perf-test --image=busybox --restart=Never -- \
  nslookup myapp.internal.example.com internal-dns-service
```

## Troubleshooting

### Pods Not Starting

**Symptom**: Deployment stays in Pending or CrashLoopBackOff

**Solutions**:
```bash
# Check events
kubectl describe deployment internal-dns-deployment

# Check pod logs
kubectl logs -l app=internal-dns -c external-dns --previous
kubectl logs -l app=internal-dns -c powerdns --previous

# Verify PVC is bound
kubectl get pvc dns-storage
```

### DNS Not Resolving

**Symptom**: nslookup returns NXDOMAIN

**Solutions**:
```bash
# Verify external-dns discovered the ingress
kubectl logs deployment/internal-dns-deployment -c external-dns | grep myapp

# Check PowerDNS API for records
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  curl -s http://localhost:8081/api/v1/servers/localhost/zones

# Verify ingress has correct annotation
kubectl get ingress test-app -o yaml | grep external-dns
```

### Slow DNS Updates

**Symptom**: DNS records take > 2 minutes to appear

**Solutions**:
```bash
# Reduce sync interval
kubectl edit internaldns my-internal-dns
# Change syncInterval to "15s"

# Check external-dns is not rate-limited
kubectl logs deployment/internal-dns-deployment -c external-dns | grep -i rate

# Verify PowerDNS API is responsive
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  curl -w "\nTime: %{time_total}s\n" http://localhost:8081/api/v1/servers/localhost
```

### PVC Storage Full

**Symptom**: PowerDNS crashes or stops accepting records

**Solutions**:
```bash
# Check PVC usage
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  df -h /var/lib/powerdns

# Increase storage size
kubectl edit internaldns my-internal-dns
# Change storageSize to larger value (requires PVC recreation)

# Clean up old records manually
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  sqlite3 /var/lib/powerdns/pdns.sqlite3 "DELETE FROM records WHERE content = '';"
```

## Uninstallation

### Remove DNS Instance

```bash
# Delete InternalDNS resource
kubectl delete internaldns my-internal-dns

# Verify all resources are deleted
kubectl get deployment,service,pvc,configmap,secret -l app=internal-dns
```

### Remove Configuration

```bash
# Delete Composition
kubectl delete composition internal-dns

# Delete XRD
kubectl delete xrd xinternaldnses.dns.internal
```

### Remove Function

```bash
# Delete Function
kubectl delete function function-cdk8s
```

### Remove Provider

```bash
# Delete Provider
kubectl delete provider provider-kubernetes
```

### Remove Crossplane

```bash
# Uninstall Crossplane
helm uninstall crossplane -n crossplane-system

# Delete namespace
kubectl delete namespace crossplane-system
```

## Production Considerations

### High Availability

This implementation uses a single-instance deployment. For production:

- Consider using PowerDNS with MySQL/PostgreSQL backend
- Deploy multiple replicas with anti-affinity rules
- Use StatefulSet instead of Deployment for stable DNS

### Security

- Store PowerDNS API key in external secret manager (e.g., 1Password, Vault)
- Enable RBAC for InternalDNS resources
- Restrict network access to DNS service using NetworkPolicies
- Use Pod Security Standards to enforce security constraints

### Backup and Recovery

```bash
# Backup DNS database
kubectl exec deployment/internal-dns-deployment -c powerdns -- \
  cat /var/lib/powerdns/pdns.sqlite3 > dns-backup-$(date +%Y%m%d).sqlite3

# Restore DNS database
kubectl cp dns-backup.sqlite3 \
  internal-dns-deployment-xxx:/var/lib/powerdns/pdns.sqlite3 -c powerdns

# Restart deployment
kubectl rollout restart deployment internal-dns-deployment
```

### Monitoring and Alerting

Recommended metrics to track:

- DNS query response time
- Number of DNS records
- external-dns sync duration
- PowerDNS API availability
- PVC disk usage

## References

- [Crossplane Installation](https://docs.crossplane.io/latest/software/install/)
- [provider-kubernetes Documentation](https://marketplace.upbound.io/providers/crossplane-contrib/provider-kubernetes)
- [external-dns Guide](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pdns.md)
- [PowerDNS API Reference](https://doc.powerdns.com/authoritative/http-api/)
- [Quickstart Guide](../../../specs/001-build-a-dns/quickstart.md)
