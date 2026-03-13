#!/usr/bin/env bash
set -e
set -o pipefail

# Change to workspace root
cd "$(dirname "$0")/../../.."

echo "Step 1: Installing ArgoCD Tenant (Helm chart)..."
helm template argocd-tenant ./apps/argocd-infra/tenant \
  -f ./apps/argocd-infra/tenant/values.yaml \
  -f ./apps/argocd-infra/tenant/values-prod.yaml \
  --namespace tenant-prod | \
  kubectl apply -f -

echo "Step 2: Waiting for tenant to create namespace..."
# Wait for namespace to be created first
until kubectl get namespace tenant-prod-argocd &> /dev/null; do
  echo "  Waiting for namespace tenant-prod-argocd to be created..."
  sleep 2
done
# Now wait for it to be Active
kubectl wait --for=jsonpath='{.status.phase}'=Active namespace/tenant-prod-argocd --timeout=5m

echo "Step 3: Applying ArgoCD infrastructure manifests to enigma cluster..."
helm template argocd-infra-manifests ./apps/argocd-infra/manifests \
  -f ./apps/argocd-infra/manifests/values.yaml \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 4: Installing ArgoCD vCluster with name 'argocd-infra-vcluster'..."
helm template argocd-infra-vcluster ./apps/argocd-infra/vcluster \
  -f ./apps/argocd-infra/vcluster/values.yaml \
  -f ./apps/argocd-infra/vcluster/values-prod.yaml \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 5: Waiting for vCluster to be ready..."
kubectl rollout status deployment/argocd-infra-vcluster \
  -n tenant-prod-argocd \
  --timeout=300s

echo "Step 5a: Waiting for vCluster etcd to be ready..."
kubectl rollout status statefulset/argocd-infra-vcluster-etcd \
  -n tenant-prod-argocd \
  --timeout=300s

echo "Step 6: Installing ArgoCD to vCluster..."
echo "Step 6a: Installing ArgoCD Helm chart..."
helm template argocd ./apps/argocd/argocd \
  -f ./apps/argocd/argocd/values.yaml \
  -f ./apps/argocd/argocd/values-prod.yaml \
  --namespace argocd --create-namespace | \
  vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
    kubectl apply -f - --server-side --force-conflicts

echo "Step 6b: Installing ArgoCD Ingress..."
helm template argocd-ingress ./apps/argocd/ingress \
  -f ./apps/argocd/ingress/values.yaml \
  -f ./apps/argocd/ingress/values-prod.yaml \
  --namespace argocd | \
  vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
    kubectl apply -f -

echo "Step 7: Applying ArgoCD ApplicationSets..."
vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
  kubectl apply -f apps/argocd-apps/manifests/applicationset-helm.yaml \
    -f apps/argocd-apps/manifests/applicationset-manifests.yaml \
    -f apps/argocd-apps/manifests/applicationset-pr-helm.yaml

echo "Bootstrap complete! Checking application status..."
sleep 10
vcluster connect argocd-infra-vcluster -n tenant-prod-argocd -- \
  kubectl get applications -n argocd
