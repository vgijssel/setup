# Contract Tests for 1Password Kubernetes Integration

## Overview
This directory contains contract test specifications for the 1Password Crossplane AddOn package. Tests are written in kuttl format and validate functional requirements from the feature specification.

## Test Suite Structure

### 00-addon-installation.yaml
**Validates**: FR-001 (enable workloads to retrieve secrets)
**Purpose**: Verify Crossplane AddOn package installs successfully and operator becomes healthy
**Key Assertions**:
- AddOn CR shows Healthy condition
- Operator Deployment is Available
- Operator pods are Running

### 01-secret-sync.yaml
**Validates**: FR-001, FR-008 (all secret types), FR-009 (validate secrets exist)
**Purpose**: Verify OnePasswordItem creates Kubernetes Secret with correct data
**Key Assertions**:
- OnePasswordItem status becomes Ready
- Kubernetes Secret is created
- Secret contains expected labels

### 02-secret-consumption.yaml
**Validates**: FR-004 (environment variables and mounted files)
**Purpose**: Verify workloads can consume secrets via env vars and volume mounts
**Key Assertions**:
- Pod with envFrom secret reference starts successfully
- Pod with volume mount secret reference starts successfully
- Both consumption patterns work simultaneously

### 03-workload-restart-on-rotation.yaml
**Validates**: FR-002, FR-010 (automatic restart on rotation)
**Purpose**: Verify workloads automatically restart when secrets are rotated
**Key Assertions**:
- Reloader is installed and running
- Deployment with reloader.stakater.com/auto annotation exists
- Secret update triggers Deployment rollout
- Deployment observedGeneration increases after secret change

### 04-offline-resilience.yaml
**Validates**: FR-005 (handle connection failures gracefully)
**Purpose**: Verify workloads can start with cached secrets when 1Password unavailable
**Key Assertions**:
- Deployment starts with existing cached Secret
- Pods reach Running state despite no Connect credentials
- OnePasswordItem shows error state when 1Password unreachable
- Cached Secret persists and remains usable

### 05-namespace-authorization.yaml
**Validates**: FR-003 (namespace-based permissions), FR-006 (multi-cluster support)
**Purpose**: Verify namespace isolation and authorization model
**Key Assertions**:
- Different namespaces use different Connect credentials
- Secrets created only in same namespace as OnePasswordItem
- Cross-namespace secret access is denied
- Namespace isolation prevents credential leakage

## Running Tests

### Prerequisites
- kind cluster running with Crossplane installed
- kuttl CLI available
- Crossplane AddOn package built and available

### Local Execution
```bash
# Create kind cluster
kind create cluster --name onepassword-test

# Install Crossplane
helm repo add crossplane-stable https://charts.crossplane.io/stable
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system --create-namespace

# Run kuttl tests
cd libs/onepassword-addon-xp
kuttl test --config tests/kuttl-test.yaml
```

### CI Execution
Tests run automatically via Nx:
```bash
nx test onepassword-addon-xp
```

## Test Configuration

### kuttl-test.yaml
```yaml
apiVersion: kuttl.dev/v1beta1
kind: TestSuite
testDirs:
- contracts/
kindContainers: 1
skipDelete: false
timeout: 300
parallel: 1
```

## Test Limitations

### Mock 1Password Connect
Tests use mock/stub Connect credentials because:
- Contract tests validate Kubernetes integration, not 1Password API
- Real 1Password Connect requires external infrastructure
- Integration tests (separate) will validate real 1Password connectivity

### Known Test Gaps
The following scenarios require manual or integration testing:
1. **Real 1Password rotation**: Contract tests simulate rotation by updating Secret directly
2. **Multi-cluster scenarios**: Contract tests run in single cluster
3. **Performance/scale**: Contract tests use minimal resources
4. **Network partitions**: Contract tests don't simulate network failures

## Mapping to Functional Requirements

| FR | Requirement | Test File | Test Case |
|----|-------------|-----------|-----------|
| FR-001 | Enable workloads to retrieve secrets | 00, 01 | AddOn install + secret sync |
| FR-002 | Detect secret rotation | 03 | Workload restart on secret update |
| FR-003 | Namespace-based authorization | 05 | Namespace isolation |
| FR-004 | Support env vars and mounted files | 02 | Secret consumption patterns |
| FR-005 | Handle connection failures | 04 | Offline resilience |
| FR-006 | Multi-cluster support | 05 | Independent namespace credentials |
| FR-007 | Audit secret access | N/A | Validated via logs (manual) |
| FR-008 | Support all secret types | 01 | Plain text, binary, structured |
| FR-009 | Validate secrets exist | 01 | OnePasswordItem Ready condition |
| FR-010 | Auto-restart workloads | 03 | Reloader integration |

## Troubleshooting

### Test Failures

#### AddOn not becoming Healthy
- Check Crossplane version >= 2.0.2
- Verify package OCI image is accessible
- Check Crossplane package manager logs

#### OnePasswordItem not Ready
- Verify Connect credentials Secret exists in namespace
- Check operator logs for authentication errors
- Confirm itemPath format: `vaults/<vault>/items/<item>`

#### Reloader not triggering restart
- Verify reloader.stakater.com/auto annotation present
- Check Reloader RBAC permissions
- Confirm Secret actually changed (checksum)

### Debug Commands
```bash
# Check operator logs
kubectl logs -n onepassword-system deployment/onepassword-connect

# Describe OnePasswordItem status
kubectl describe onepassworditem -n <namespace> <name>

# View kuttl test output
kuttl test --config tests/kuttl-test.yaml -v 2

# Inspect generated Secrets
kubectl get secret -n <namespace> -l onepassword.com/managed-by=onepassword-connect
```

## Future Enhancements

### Additional Test Cases (Out of Scope for v1)
- **Performance tests**: Secret sync latency under load
- **Chaos tests**: Random pod/network failures
- **Upgrade tests**: AddOn version migrations
- **Security tests**: RBAC boundary validation
