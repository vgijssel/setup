#!/usr/bin/env bash
set -euo pipefail

# Script to validate the gateway ingress exposure implementation
# Run this after the changes have been deployed to the cluster

echo "=== Gateway Ingress Exposure Validation ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function check_step() {
    local description="$1"
    local command="$2"

    echo -n "Checking: $description... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

echo "Step 1: Reconcile Flux GitRepository"
flux reconcile source git setup -n flux-system
echo ""

echo "Step 2: Reconcile HelmReleases"
flux reconcile helmrelease internal-networking -n flux-system
flux reconcile helmrelease external-dns -n flux-system
echo ""

echo "Step 3: Wait for reconciliation to complete"
sleep 10
echo ""

echo "Step 4: Verify Kyverno Policies"
check_step "generate-gateway-ingress policy exists" \
    "kubectl get clusterpolicy generate-gateway-ingress"
check_step "generate-tailscale-ingress policy exists" \
    "kubectl get clusterpolicy generate-tailscale-ingress"
echo ""

echo "Step 5: Check for policy errors"
kubectl get policyreports -A --no-headers | grep -i fail && \
    echo -e "${YELLOW}Warning: Some policy reports show failures${NC}" || \
    echo -e "${GREEN}No policy failures detected${NC}"
echo ""

echo "Step 6: Verify RBAC permissions"
check_step "ClusterRole has IngressClass permissions" \
    "kubectl get clusterrole kyverno-generate-service -o yaml | grep -q ingressclasses"
echo ""

echo "Step 7: Check existing IngressClasses"
echo "Current IngressClasses:"
kubectl get ingressclass
echo ""

echo "Step 8: Look for generated gateway IngressClasses"
GATEWAY_CLASSES=$(kubectl get ingressclass -o name | grep -c "\-gateway" || echo "0")
if [ "$GATEWAY_CLASSES" -gt 0 ]; then
    echo -e "${GREEN}Found $GATEWAY_CLASSES gateway IngressClass(es)${NC}"
    kubectl get ingressclass | grep gateway
else
    echo -e "${YELLOW}No gateway IngressClasses found yet (expected if no tenant-* classes exist)${NC}"
fi
echo ""

echo "Step 9: Apply test ingress with internal-networking/expose label"
echo "Applying test ingress..."
kubectl apply -f test-gateway-ingress.yaml
echo ""

echo "Step 10: Wait for Kyverno to generate resources"
sleep 5
echo ""

echo "Step 11: Verify gateway IngressClass was created"
check_step "tenant-root-gateway IngressClass exists" \
    "kubectl get ingressclass tenant-root-gateway"
echo ""

echo "Step 12: Verify mirrored gateway ingress was created"
check_step "test-gateway-exposure-gateway ingress exists" \
    "kubectl get ingress test-gateway-exposure-gateway -n tenant-root"
echo ""

echo "Step 13: Verify gateway ingress has correct labels"
check_step "Gateway ingress has internal-networking=true label" \
    "kubectl get ingress test-gateway-exposure-gateway -n tenant-root -o jsonpath='{.metadata.labels.internal-networking}' | grep -q '^true$'"
echo ""

echo "Step 14: Verify gateway ingress uses correct IngressClass"
GATEWAY_INGRESS_CLASS=$(kubectl get ingress test-gateway-exposure-gateway -n tenant-root -o jsonpath='{.spec.ingressClassName}')
if [ "$GATEWAY_INGRESS_CLASS" = "tenant-root-gateway" ]; then
    echo -e "${GREEN}✓ Gateway ingress uses tenant-root-gateway IngressClass${NC}"
else
    echo -e "${RED}✗ Gateway ingress uses $GATEWAY_INGRESS_CLASS instead of tenant-root-gateway${NC}"
fi
echo ""

echo "Step 15: Verify NO Tailscale service was created"
if kubectl get svc test-gateway-exposure-tailscale -n tenant-root > /dev/null 2>&1; then
    echo -e "${RED}✗ Tailscale service exists (should not for exposed ingresses)${NC}"
else
    echo -e "${GREEN}✓ No Tailscale service created for exposed ingress${NC}"
fi
echo ""

echo "Step 16: Check external-dns is watching ingresses"
check_step "external-dns watches ingress resources" \
    "kubectl get helmrelease external-dns -n flux-system -o yaml | grep -q '- ingress'"
echo ""

echo "Step 17: View gateway ingress details"
echo "Gateway ingress YAML:"
kubectl get ingress test-gateway-exposure-gateway -n tenant-root -o yaml
echo ""

echo "=== Validation Complete ==="
echo ""
echo "Next steps:"
echo "1. Verify DNS records are created for test-gateway.enigma.vgijssel.nl"
echo "2. Check that the gateway ingress controller pods are scheduled on gateway nodes"
echo "3. Test actual HTTP/HTTPS connectivity to the exposed service"
echo "4. Clean up test resources:"
echo "   kubectl delete -f test-gateway-ingress.yaml"
echo ""
