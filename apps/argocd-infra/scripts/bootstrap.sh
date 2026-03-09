#!/usr/bin/env bash
set -e
set -o pipefail

# Change to workspace root
cd "$(dirname "$0")/../../.."

echo "Step 1: Installing ArgoCD Tenant (Helm chart)..."
helm template argocd-tenant ./apps/argocd-infra/tenant \
  --namespace tenant-prod | \
  kubectl apply -f -

echo "Step 2: Waiting for tenant to create namespace..."
kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/tenant-prod-argocd --timeout=5m

echo "Step 3: Applying ArgoCD infrastructure manifests to enigma cluster..."
kubectl apply -k apps/argocd-infra/manifests --server-side --force-conflicts

echo "Step 4: Installing ArgoCD vCluster with name 'argocd-infra-vcluster'..."
helm template argocd-infra-vcluster ./apps/argocd-infra/vcluster \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 5: Waiting for vCluster to be ready..."
kubectl wait --for=condition=ready pod \
  -l app=vcluster,release=argocd-infra-vcluster \
  -n tenant-prod-argocd \
  --timeout=300s

echo "Step 6: Installing ArgoCD to vCluster with server-side apply..."
vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
  kubectl apply -k apps/argocd/manifests --server-side --force-conflicts

echo "Step 7: Applying ArgoCD ApplicationSets..."
vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
  kubectl apply -k apps/argocd-apps/manifests --server-side --force-conflicts

echo "Bootstrap complete! Checking application status..."
sleep 10
vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
  kubectl get applications -n argocd
