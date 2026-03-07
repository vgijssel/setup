# Cross-vCluster Connectivity Findings

## Overview

This document summarizes the findings from implementing automatic vCluster registration to ArgoCD and enabling cross-vCluster connectivity in a CozyStack environment.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Enigma Host Cluster                         │
│                                                                 │
│  ┌─────────────────────┐       ┌─────────────────────────────┐ │
│  │ tenant-prod-argocd  │       │ tenant-prod-secretsproxy    │ │
│  │                     │       │                             │ │
│  │  ┌───────────────┐  │       │  ┌───────────────────────┐  │ │
│  │  │ ArgoCD vCluster│  │ ───▶ │  │ secrets-proxy vCluster│  │ │
│  │  │               │  │       │  │                       │  │ │
│  │  │ - ArgoCD      │  │       │  │ - 1password-operator  │  │ │
│  │  │ - Apps        │  │       │  │ - secrets             │  │ │
│  │  └───────────────┘  │       │  └───────────────────────┘  │ │
│  └─────────────────────┘       └─────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────┐                                        │
│  │  argocd-clusters    │  ◀── Kyverno generates cluster secrets │
│  │  namespace          │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Problem Statement

ArgoCD running inside a vCluster needs to deploy applications to other vClusters (e.g., secrets-proxy). This requires:

1. **Automatic cluster registration** - vClusters should be automatically registered as ArgoCD destinations
2. **Network connectivity** - ArgoCD pods must be able to reach other vCluster API servers
3. **DNS resolution** - ArgoCD must resolve the DNS names of other vClusters

## Findings

### 1. vCluster Secret Structure

Each vCluster creates a kubeconfig secret with the prefix `vc-` containing:
- `certificate-authority` - CA certificate (base64 encoded)
- `client-certificate` - Client cert for authentication
- `client-key` - Client private key

**Location**: `vc-<vcluster-name>` in the vCluster's host namespace (e.g., `tenant-prod-secretsproxy`)

### 2. vCluster fromHost Secrets Sync Limitations

vCluster's `sync.fromHost.secrets` feature has limitations:
- **Does NOT support prefix patterns** like `cluster-*`
- Only supports full namespace wildcards: `"namespace/*": "target-namespace/*"`
- Attempting prefix patterns causes errors: `parsed object name from key is not valid`

**Solution**: Use a dedicated namespace (`argocd-clusters`) for all cluster secrets and sync the entire namespace.

### 3. CozyStack Tenant Network Isolation

CozyStack uses CiliumClusterwideNetworkPolicies to isolate tenants:

- `tenant-prod-argocd-egress` - Controls egress from ArgoCD namespace
- `tenant-prod-secretsproxy-ingress` - Controls ingress to secrets-proxy namespace

**Finding**: Cross-tenant traffic is blocked by default. Pods in `tenant-prod-argocd` cannot reach pods in `tenant-prod-secretsproxy`.

**Solution**: Create CiliumNetworkPolicies to explicitly allow cross-tenant traffic:
- `allow-to-secrets-proxy` (egress from ArgoCD)
- `allow-from-argocd` (ingress to secrets-proxy)

**Important**: Port-specific rules (`toPorts`) caused issues. Using endpoint-only rules without port restrictions works.

### 4. DNS Domain Differences

- **Host cluster DNS domain**: `cozy.local` (CozyStack default)
- **vCluster internal DNS domain**: `cluster.local` (Kubernetes default)

Services in the host cluster are accessible at `<service>.<namespace>.svc.cozy.local`, but this domain is not resolvable from inside a vCluster by default.

### 5. vCluster DNS Fallback Limitations

The `networking.advanced.fallbackHostCluster: true` setting is supposed to forward unknown DNS queries to the host cluster, but:
- It doesn't properly forward `cozy.local` domain queries
- The vCluster's CoreDNS still returns "no such host" for host cluster services

### 6. vCluster Pro Features

Several features require vCluster Pro license:
- `controlPlane.coredns.embedded: true` - Embedded CoreDNS
- `networking.replicateServices` - Service replication (triggers embedded CoreDNS)
- `networking.resolveDNS` - DNS resolution rules (requires embedded CoreDNS)

**Error**: "you are trying to use a vCluster pro feature 'Security-Hardened vCluster Image'"

### 7. Custom CoreDNS Configuration

**Solution**: Use `controlPlane.coredns.overwriteManifests` to inject custom CoreDNS configuration:

```yaml
controlPlane:
  coredns:
    overwriteManifests: |-
      apiVersion: v1
      kind: ConfigMap
      metadata:
        name: coredns
        namespace: kube-system
      data:
        Corefile: |-
          .:1053 {
            # ... standard config ...
          }
          cozy.local:1053 {
            errors
            cache 30
            forward . 10.96.0.10
          }
```

**Caveat**: `overwriteManifests` only applies during vCluster creation. For existing vClusters, manually patch the ConfigMap.

### 8. vCluster Internal DNS Network Policy

vCluster workload pods need a network policy to reach the vCluster's internal CoreDNS:

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: allow-to-vcluster-dns
  namespace: tenant-prod-argocd
spec:
  endpointSelector: {}
  egress:
    - toEndpoints:
        - matchLabels:
            k8s-app: vcluster-kube-dns
            k8s:io.kubernetes.pod.namespace: tenant-prod-argocd
      toPorts:
        - ports:
            - port: "1053"
              protocol: UDP
```

**Note**: vCluster CoreDNS uses label `k8s-app: vcluster-kube-dns` (not `kube-dns`) and listens on port `1053`.

### 9. Kyverno Background Controller Memory

With many secrets to process, Kyverno's background controller can OOM:
- Default memory limit was 128Mi
- 287 pending UpdateRequests caused memory spikes
- **Solution**: Increase to 512Mi limit, 256Mi request

### 10. Multiple Kyverno Policies

Be careful with multiple Kyverno policies generating similar secrets. Old policies may leave orphaned secrets that conflict with new ones.

## Implementation Summary

### Files Created/Modified

1. **`apps/secrets-proxy-infra/clusterpolicy-argocd-cluster-registration.yaml`**
   - Generic policy matching any `vc-*` secret in `tenant-*` namespaces
   - Uses `trim_prefix()` to extract service name
   - Generates secrets in `argocd-clusters` namespace
   - Uses `cozy.local` DNS domain

2. **`apps/secrets-proxy-infra/namespace-argocd-clusters.yaml`**
   - Dedicated namespace for ArgoCD cluster secrets

3. **`apps/argocd-infra/helmrelease-vcluster.yaml`**
   - Added `sync.fromHost.secrets` mapping: `"argocd-clusters/*": "argocd/*"`
   - Added custom CoreDNS config to forward `cozy.local` queries
   - Enabled `fallbackHostCluster: true`

4. **`apps/argocd-infra/ciliumnetworkpolicy-allow-to-secrets-proxy.yaml`**
   - Allows ArgoCD egress to secrets-proxy namespace

5. **`apps/secrets-proxy-infra/ciliumnetworkpolicy-allow-from-argocd.yaml`**
   - Allows ingress from ArgoCD to secrets-proxy namespace

6. **`apps/argocd-infra/ciliumnetworkpolicy-allow-to-vcluster-dns.yaml`**
   - Allows pods to reach vCluster's internal CoreDNS

7. **`apps/enigma-cluster/helmrelease-kyverno.yaml`**
   - Increased background controller memory limits

## vCluster Service Discovery

### 11. vCluster Host Services

**Finding**: vCluster automatically creates services on the host cluster for accessing the vCluster API server.

For each vCluster, a service is created with the name matching the vCluster instance name:
- `secrets-proxy` service in `tenant-prod-secretsproxy` namespace (ClusterIP: 10.96.152.184:443)
- `tenant-prod-argocd-vc-argocd` service in `tenant-prod-argocd` namespace (ClusterIP: 10.96.109.89:443)

**DNS Names**:
- Full FQDN: `secrets-proxy.tenant-prod-secretsproxy.svc.cozy.local`
- Short form: `secrets-proxy.tenant-prod-secretsproxy`

**Important**: The vCluster kubeconfig secrets (`vc-*`) contain `server: https://localhost:8443`, which is meant for use with the vCluster CLI that sets up port-forwarding.

### 12. TLS Certificate Limitations

**Finding**: vCluster TLS certificates only include short DNS names, not full FQDNs with `.svc.cozy.local`.

The secrets-proxy vCluster certificate includes these SANs:
- `secrets-proxy`
- `secrets-proxy.tenant-prod-secretsproxy`

The certificate does NOT include:
- `secrets-proxy.tenant-prod-secretsproxy.svc.cozy.local`

This causes TLS verification errors when ArgoCD tries to connect using the full FQDN.

**Solution**: Updated Kyverno policy to generate cluster secrets with the short DNS name (`secrets-proxy.tenant-prod-secretsproxy`) instead of the full FQDN.

### 13. DNS Resolution Challenges

**Problem**: The short DNS name `secrets-proxy.tenant-prod-secretsproxy` doesn't resolve from inside the ArgoCD vCluster.

**Investigation**:
- Inside vCluster, default DNS domain is `cluster.local`
- Custom CoreDNS config only forwards `cozy.local` zone queries to host DNS
- Queries for `secrets-proxy.tenant-prod-secretsproxy` (no domain suffix) don't match any zone
- The `fallbackHostCluster` setting in `.:1053` zone should forward unknown queries, but this is unreliable

**Testing**:
```bash
kubectl exec -n tenant-prod-argocd deploy/tenant-prod-argocd-vc-argocd -- nslookup secrets-proxy.tenant-prod-secretsproxy
# Result: NXDOMAIN - can't resolve
```

### 14. Service Replication Solution

**Finding**: vCluster supports `replicateServices` to sync services from host to vCluster (open source feature, no Pro license required).

**How it works**:
- Replicates a service from the host cluster into the vCluster
- Makes the service available using standard Kubernetes DNS inside the vCluster
- Service endpoints point to the actual pods on the host

**Configuration**:
```yaml
networking:
  replicateServices:
    fromHost:
      - from: "tenant-prod-secretsproxy/secrets-proxy"
        to: "argocd/secrets-proxy"
```

**Benefits**:
- Service available at `secrets-proxy.argocd.svc.cluster.local` inside vCluster
- No need for custom DNS forwarding for `cozy.local`
- ArgoCD can use standard Kubernetes service discovery
- TLS certificate SAN `secrets-proxy` will match the short name

**Note**: The `resolveDNS` feature requires vCluster Pro and won't help here since it only adds DNS rules, not service endpoints.

## Remaining Issues

1. **DNS resolution for cross-vCluster communication** - Short DNS names (`secrets-proxy.tenant-prod-secretsproxy`) don't resolve inside vCluster without service replication

2. **Secret sync timing** - The cluster secret in the ArgoCD vCluster may not immediately reflect changes to the source secret in `argocd-clusters`

3. **ArgoCD cache** - ArgoCD caches cluster information; may need to restart application controller after secret updates

4. **Manual CoreDNS patching** - For existing vClusters, the CoreDNS ConfigMap needs to be manually patched as `overwriteManifests` only applies on creation

## Recommendations

1. **Use dedicated namespace for cluster secrets** - Avoids vCluster sync pattern limitations

2. **Avoid port-specific network policies** - Use endpoint-only rules for cross-tenant communication

3. **Use service replication for cross-vCluster connectivity** - The `replicateServices.fromHost` feature (open source, no Pro license) provides reliable DNS resolution and service discovery inside vClusters

4. **Monitor Kyverno resources** - Ensure adequate memory for background controller when processing many secrets

5. **Match TLS certificate SANs** - Use short DNS names that match vCluster certificate SANs, avoid full FQDNs with `.svc.cozy.local` that aren't in the certificate

6. **Consider vCluster Pro** - For production environments needing advanced `resolveDNS` rules (though `replicateServices` handles most use cases)
