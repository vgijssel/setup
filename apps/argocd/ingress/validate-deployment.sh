#!/usr/bin/env bash
# Validation script for ArgoCD ingress migration deployment
# This script validates the Helm charts are ready for deployment and provides deployment commands

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARGOCD_CHART_DIR="$(dirname "${SCRIPT_DIR}")/argocd"

echo "=== ArgoCD Ingress Migration - Deployment Validation ==="
echo

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo -e "${RED}✗ helm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ helm is installed${NC}"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ kubectl is installed${NC}"

echo

# Validate main ArgoCD chart generates 0 ingresses
echo "Validating main ArgoCD chart (should generate 0 ingresses)..."
ARGOCD_INGRESS_COUNT=$(helm template argocd "${ARGOCD_CHART_DIR}" \
  --namespace argocd \
  --values "${ARGOCD_CHART_DIR}/values-prod.yaml" 2>/dev/null | \
  grep -c "kind: Ingress" || true)

if [[ "${ARGOCD_INGRESS_COUNT}" -eq 0 ]]; then
    echo -e "${GREEN}✓ Main ArgoCD chart generates 0 ingresses${NC}"
else
    echo -e "${RED}✗ Main ArgoCD chart generates ${ARGOCD_INGRESS_COUNT} ingresses (expected 0)${NC}"
    exit 1
fi

# Validate ingress umbrella chart generates 4 ingresses
echo "Validating ingress umbrella chart (should generate 4 ingresses)..."
UMBRELLA_INGRESS_COUNT=$(helm template argocd-ingress "${SCRIPT_DIR}" \
  --namespace argocd \
  --values "${SCRIPT_DIR}/values-prod.yaml" 2>/dev/null | \
  grep -c "kind: Ingress" || true)

if [[ "${UMBRELLA_INGRESS_COUNT}" -eq 4 ]]; then
    echo -e "${GREEN}✓ Ingress umbrella chart generates 4 ingresses${NC}"
else
    echo -e "${RED}✗ Ingress umbrella chart generates ${UMBRELLA_INGRESS_COUNT} ingresses (expected 4)${NC}"
    exit 1
fi

# List the ingresses
echo
echo "Generated ingresses:"
helm template argocd-ingress "${SCRIPT_DIR}" \
  --namespace argocd \
  --values "${SCRIPT_DIR}/values-prod.yaml" 2>/dev/null | \
  grep -E "^  name: " | \
  sed 's/^/  - /' || echo "  (Could not extract ingress names)"

echo
echo -e "${GREEN}=== Validation Complete ===${NC}"
echo
echo "Ready to deploy! Use the following commands:"
echo
echo -e "${YELLOW}# Step 1: Update main ArgoCD chart (ingresses now disabled)${NC}"
echo "helm upgrade --install argocd ${ARGOCD_CHART_DIR} \\"
echo "  --namespace argocd \\"
echo "  --create-namespace \\"
echo "  --values ${ARGOCD_CHART_DIR}/values-prod.yaml"
echo
echo -e "${YELLOW}# Step 2: Deploy all ingresses via umbrella chart${NC}"
echo "helm upgrade --install argocd-ingress ${SCRIPT_DIR} \\"
echo "  --namespace argocd \\"
echo "  --values ${SCRIPT_DIR}/values-prod.yaml"
echo
echo -e "${YELLOW}# Step 3: Verify ingresses are created${NC}"
echo "kubectl get ingress -n argocd"
echo
echo -e "${YELLOW}# Step 4: Test endpoints${NC}"
echo "curl -k https://argocd.enigma.vgijssel.nl"
echo "curl -k https://argocd-grpc.enigma.vgijssel.nl"
echo "curl -k https://argocd-webhook-public.enigma.vgijssel.nl/api/webhook"
echo "curl -k https://argocd-applicationset-webhook-public.enigma.vgijssel.nl/api/webhook"
echo
echo -e "${YELLOW}# Step 5: After successful validation, remove old manifests${NC}"
echo "rm -rf $(dirname "${SCRIPT_DIR}")/manifests/ingress-*.yaml"
