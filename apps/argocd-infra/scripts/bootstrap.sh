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
helm template argocd-manifests ./apps/argocd-infra/manifests \
  -f ./apps/argocd-infra/manifests/values.yaml \
  -f ./apps/argocd-infra/manifests/values-prod.yaml \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 3a: Installing ArgoCD cluster registration (Kyverno policies)..."
helm dependency update ./apps/argocd-infra/argocd-cluster-registration
helm template argocd-cluster-registration ./apps/argocd-infra/argocd-cluster-registration \
  -f ./apps/argocd-infra/argocd-cluster-registration/values.yaml \
  -f ./apps/argocd-infra/argocd-cluster-registration/values-prod.yaml \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 4: Installing ArgoCD vCluster with name 'argocd-vcluster'..."
helm template argocd-vcluster ./apps/argocd-infra/vcluster \
  -f ./apps/argocd-infra/vcluster/values.yaml \
  -f ./apps/argocd-infra/vcluster/values-prod.yaml \
  --namespace tenant-prod-argocd | \
  kubectl apply -f -

echo "Step 5: Waiting for vCluster to be ready..."
kubectl rollout status deployment/argocd-vcluster \
  -n tenant-prod-argocd \
  --timeout=300s

echo "Step 5a: Waiting for vCluster etcd to be ready..."
kubectl rollout status statefulset/argocd-vcluster-etcd \
  -n tenant-prod-argocd \
  --timeout=300s

echo "Step 6: Installing ArgoCD to vCluster..."
echo "Step 6a: Installing ArgoCD Helm chart..."
helm template argocd ./apps/argocd/argocd \
  -f ./apps/argocd/argocd/values.yaml \
  -f ./apps/argocd/argocd/values-prod.yaml \
  --namespace argocd --create-namespace | \
  vcluster connect argocd-vcluster -n tenant-prod-argocd -- \
    kubectl apply -f - --server-side --force-conflicts

echo "Step 6b: Installing ArgoCD Ingress..."
helm template argocd-ingress ./apps/argocd/ingress \
  -f ./apps/argocd/ingress/values.yaml \
  -f ./apps/argocd/ingress/values-prod.yaml \
  --namespace argocd | \
  vcluster connect argocd-vcluster -n tenant-prod-argocd -- \
    kubectl apply -f -

# echo "Step 7: Applying ArgoCD ApplicationSets..."
# vcluster connect argocd-vcluster -n tenant-prod-argocd -- \
#   kubectl apply -k apps/argocd-apps/manifests --server-side --force-conflicts

echo "Bootstrap complete! Checking application status..."
sleep 10
vcluster connect argocd-vcluster -n tenant-prod-argocd -- \
  kubectl get applications -n argocd

echo ""
echo "=========================================="
echo "ArgoCD Admin Credentials"
echo "=========================================="
echo "URL:      https://argocd.enigma.vgijssel.nl"
echo "Username: admin"
ARGOCD_PASSWORD=$(vcluster connect argocd-vcluster -n tenant-prod-argocd -- \
  kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' 2>/dev/null | tail -1 | base64 -d)
echo "Password: ${ARGOCD_PASSWORD}"
echo "=========================================="
