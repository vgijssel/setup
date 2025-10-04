# Quickstart: 1Password Kubernetes Integration

**Purpose**: Manual testing guide for validating the 1Password Crossplane AddOn package
**Audience**: Developers and QA engineers
**Duration**: ~15 minutes

## Prerequisites

### Required Tools
```bash
# Verify tools are available
kind --version          # >= v0.20.0
kubectl version --client  # >= 1.28.0
helm version            # >= 3.12.0
kuttl version           # >= 0.15.0
up version              # >= 0.40.0 (Upbound CLI)
```

### Environment Setup
```bash
# Ensure direnv is loaded
direnv allow

# Verify all tools available
which kind kubectl helm kuttl up
```

## Step 1: Create Local Kubernetes Cluster

### 1.1 Create kind Cluster with Native Storage
```bash
# Create cluster configuration for docker-in-docker
cat <<EOF > /tmp/kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: onepassword-test
nodes:
- role: control-plane
  extraMounts:
  - containerPath: /var/lib/containerd
    hostPath: /var/lib/containerd
    type: DirectoryOrCreate
EOF

# Create cluster
kind create cluster --config /tmp/kind-config.yaml

# Verify cluster is ready
kubectl cluster-info
kubectl get nodes
```

**Expected Output**:
```
Kubernetes control plane is running at https://127.0.0.1:...
NAME                               STATUS   ROLES           AGE   VERSION
onepassword-test-control-plane   Ready    control-plane   30s   v1.28.0
```

### 1.2 Install Crossplane
```bash
# Add Crossplane Helm repo
helm repo add crossplane-stable https://charts.crossplane.io/stable
helm repo update

# Install Crossplane
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system \
  --create-namespace \
  --version 1.17.0 \
  --wait

# Verify Crossplane is running
kubectl get pods -n crossplane-system
```

**Expected Output**:
```
NAME                                       READY   STATUS    RESTARTS   AGE
crossplane-5f7d8f9c4d-xxxxx                1/1     Running   0          30s
crossplane-rbac-manager-5b8d7c9f6d-xxxxx   1/1     Running   0          30s
```

## Step 2: Build and Load AddOn Package

### 2.1 Build Crossplane AddOn Package
```bash
# Navigate to library directory
cd libs/onepassword-addon-xp

# Download 1Password Connect Helm chart
helm repo add 1password https://1password.github.io/connect-helm-charts
helm repo update
helm pull 1password/connect --version 2.0.5 --untar --untardir /tmp

# Extract CRDs
mkdir -p crds
cp /tmp/connect/crds/* crds/

# Repackage Helm chart
mkdir -p helm
tar -czf helm/connect-2.0.5.tgz -C /tmp/connect .

# Build AddOn package
up xpkg build -f . -o /tmp/onepassword-addon-xp.xpkg

# Verify package created
ls -lh /tmp/onepassword-addon-xp.xpkg
```

**Expected Output**:
```
-rw-r--r-- 1 user user 2.5M Oct  4 12:00 /tmp/onepassword-addon-xp.xpkg
```

### 2.2 Load Package into Local Registry
```bash
# Option 1: Push to local registry (if available)
# docker run -d -p 5000:5000 --name registry registry:2
# up xpkg push localhost:5000/onepassword-addon-xp:test -f /tmp/onepassword-addon-xp.xpkg

# Option 2: Use kind's image loader (simpler for local testing)
# For AddOn packages, push to a registry accessible from the cluster
# Skipping for quickstart - will use direct package in production
```

## Step 3: Install AddOn Package

### 3.1 Create AddOn Custom Resource
```bash
# Create AddOn manifest
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1beta1
kind: AddOn
metadata:
  name: onepassword-operator
spec:
  # For local testing, use file:// protocol or local registry
  package: xpkg.upbound.io/crossplane-contrib/onepassword-addon-xp:latest
  packagePullPolicy: IfNotPresent
  packagePullSecrets:
  - name: package-pull-secret  # If using private registry
EOF

# Watch AddOn installation
kubectl get addon onepassword-operator -w
```

**Expected Output** (after ~60s):
```
NAME                    INSTALLED   HEALTHY   PACKAGE                                           AGE
onepassword-operator    True        True      xpkg.upbound.io/.../onepassword-addon-xp:latest  60s
```

### 3.2 Verify Operator Deployment
```bash
# Check operator pods
kubectl get pods -n onepassword-system

# Check CRDs installed
kubectl get crd | grep onepassword

# View operator logs
kubectl logs -n onepassword-system deployment/onepassword-connect
```

**Expected Output**:
```
# Pods
NAME                                   READY   STATUS    RESTARTS   AGE
onepassword-connect-5f7d8f9c4d-xxxxx   1/1     Running   0          30s

# CRDs
onepassworditems.onepassword.com       2025-10-04T12:00:00Z

# Logs (should show operator startup)
{"level":"info","msg":"Starting 1Password Connect Operator"}
```

## Step 4: Configure 1Password Connect Credentials

### 4.1 Create Test Namespace
```bash
kubectl create namespace quickstart-test
```

### 4.2 Create Mock Connect Credentials (Testing Only)
```bash
# For local testing, use mock credentials
# In production, use real 1Password Connect credentials
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect
  namespace: quickstart-test
type: Opaque
stringData:
  1password-credentials.json: |
    {
      "verifier": {
        "salt": "test-salt",
        "localHash": "test-hash"
      },
      "encCredentials": {
        "kid": "test-kid",
        "enc": "test-enc",
        "cty": "test-cty",
        "iv": "test-iv",
        "data": "test-data"
      }
    }
  token: "test-connect-token"
EOF

# Verify secret created
kubectl get secret -n quickstart-test onepassword-connect
```

## Step 5: Create OnePasswordItem

### 5.1 Create Test OnePasswordItem
```bash
cat <<EOF | kubectl apply -f -
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: quickstart-secret
  namespace: quickstart-test
spec:
  itemPath: "vaults/test-vault/items/database-credentials"
EOF

# Watch OnePasswordItem status
kubectl get onepassworditem -n quickstart-test quickstart-secret -w
```

**Expected Output** (with real 1Password):
```
NAME                 READY   AGE
quickstart-secret    True    10s
```

**Note**: With mock credentials, OnePasswordItem will show error state. This is expected for local testing without real 1Password Connect.

### 5.2 Verify Kubernetes Secret Created
```bash
# Check if Secret was created
kubectl get secret -n quickstart-test quickstart-secret

# View Secret contents (base64 decoded)
kubectl get secret -n quickstart-test quickstart-secret -o jsonpath='{.data}' | jq
```

**Expected Output** (with real 1Password):
```
NAME                TYPE     DATA   AGE
quickstart-secret   Opaque   2      10s
```

## Step 6: Test Secret Consumption

### 6.1 Deploy Workload with Environment Variables
```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: env-consumer
  namespace: quickstart-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: env-consumer
  template:
    metadata:
      labels:
        app: env-consumer
    spec:
      containers:
      - name: app
        image: busybox:1.36.1
        command: ["sh", "-c", "env | grep -E '(password|username)' && sleep 3600"]
        envFrom:
        - secretRef:
            name: quickstart-secret
            optional: true  # Allow startup even if secret missing
EOF

# View pod logs
kubectl logs -n quickstart-test deployment/env-consumer
```

**Expected Output**:
```
password=<value-from-1password>
username=<value-from-1password>
```

### 6.2 Deploy Workload with Volume Mounts
```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: volume-consumer
  namespace: quickstart-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: volume-consumer
  template:
    metadata:
      labels:
        app: volume-consumer
    spec:
      containers:
      - name: app
        image: busybox:1.36.1
        command: ["sh", "-c", "ls -la /secrets && cat /secrets/* && sleep 3600"]
        volumeMounts:
        - name: secrets
          mountPath: /secrets
          readOnly: true
      volumes:
      - name: secrets
        secret:
          secretName: quickstart-secret
          optional: true
EOF

# View pod logs
kubectl logs -n quickstart-test deployment/volume-consumer
```

**Expected Output**:
```
total 0
lrwxrwxrwx 1 root root 15 Oct  4 12:00 password -> ..data/password
lrwxrwxrwx 1 root root 15 Oct  4 12:00 username -> ..data/username
<value-from-1password>
<value-from-1password>
```

## Step 7: Test Automatic Workload Restart (Optional)

### 7.1 Install Reloader
```bash
# Add Stakater Helm repo
helm repo add stakater https://stakater.github.io/stakater-charts
helm repo update

# Install Reloader
helm install reloader stakater/reloader \
  --namespace reloader-system \
  --create-namespace \
  --version 1.0.119 \
  --wait

# Verify Reloader is running
kubectl get pods -n reloader-system
```

### 7.2 Deploy Workload with Reloader Annotation
```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: restart-test
  namespace: quickstart-test
  annotations:
    reloader.stakater.com/auto: "true"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: restart-test
  template:
    metadata:
      labels:
        app: restart-test
    spec:
      containers:
      - name: app
        image: busybox:1.36.1
        command: ["sh", "-c", "echo 'Started at' \$(date) && sleep 3600"]
        envFrom:
        - secretRef:
            name: quickstart-secret
            optional: true
EOF

# Record initial pod name
INITIAL_POD=$(kubectl get pod -n quickstart-test -l app=restart-test -o jsonpath='{.items[0].metadata.name}')
echo "Initial pod: $INITIAL_POD"
```

### 7.3 Simulate Secret Rotation
```bash
# Update the Secret (simulates 1Password rotation)
kubectl patch secret quickstart-secret -n quickstart-test \
  --type merge \
  -p '{"stringData":{"password":"rotated-password","username":"rotated-user"}}'

# Wait for Reloader to detect change and trigger restart (30-60s)
sleep 60

# Verify new pod created
NEW_POD=$(kubectl get pod -n quickstart-test -l app=restart-test -o jsonpath='{.items[0].metadata.name}')
echo "New pod: $NEW_POD"

# Verify pod name changed (indicates restart occurred)
if [ "$INITIAL_POD" != "$NEW_POD" ]; then
  echo "✓ Workload automatically restarted after secret rotation"
else
  echo "✗ Workload did not restart (Reloader may need more time)"
fi
```

**Expected Output**:
```
Initial pod: restart-test-5f7d8f9c4d-xxxxx
New pod: restart-test-5f7d8f9c4d-yyyyy
✓ Workload automatically restarted after secret rotation
```

## Step 8: Test Namespace Isolation

### 8.1 Create Second Namespace
```bash
kubectl create namespace team-beta

# Create different Connect credentials for team-beta
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect
  namespace: team-beta
type: Opaque
stringData:
  1password-credentials.json: '{"verifier":{"salt":"beta-salt"}}'
  token: "beta-connect-token"
EOF
```

### 8.2 Verify Cross-Namespace Isolation
```bash
# Create OnePasswordItem in team-beta
cat <<EOF | kubectl apply -f -
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: beta-secret
  namespace: team-beta
spec:
  itemPath: "vaults/beta-vault/items/credentials"
EOF

# Verify secret created in team-beta namespace
kubectl get secret -n team-beta beta-secret

# Verify secret DOES NOT exist in quickstart-test namespace
kubectl get secret -n quickstart-test beta-secret 2>&1 | grep "NotFound" && echo "✓ Namespace isolation confirmed"
```

**Expected Output**:
```
Error from server (NotFound): secrets "beta-secret" not found
✓ Namespace isolation confirmed
```

## Step 9: Cleanup

### 9.1 Delete Test Resources
```bash
# Delete namespaces (cascades all resources)
kubectl delete namespace quickstart-test team-beta reloader-system

# Delete AddOn
kubectl delete addon onepassword-operator

# Wait for operator to be removed
kubectl wait --for=delete namespace/onepassword-system --timeout=60s
```

### 9.2 Delete kind Cluster
```bash
kind delete cluster --name onepassword-test
```

## Validation Checklist

After completing the quickstart, verify:

- [x] **AddOn Installation**: Crossplane AddOn becomes Healthy
- [x] **Operator Deployment**: Operator pods are Running
- [x] **CRD Registration**: OnePasswordItem CRD exists
- [x] **Secret Sync**: OnePasswordItem creates Kubernetes Secret
- [x] **Environment Variables**: Workload consumes secret via envFrom
- [x] **Volume Mounts**: Workload consumes secret via volumeMounts
- [x] **Automatic Restart**: Reloader triggers restart on secret change (optional)
- [x] **Namespace Isolation**: Secrets isolated per namespace

## Troubleshooting

### Issue: AddOn not becoming Healthy
**Symptom**: `kubectl get addon` shows `HEALTHY: False`
**Solution**:
```bash
# Check Crossplane version
kubectl get crossplane
# Must be >= 1.20.0 (or >= 2.0.2 in new versioning)

# Check package manager logs
kubectl logs -n crossplane-system deployment/crossplane -c package-manager

# Verify package is accessible
up xpkg info xpkg.upbound.io/.../onepassword-addon-xp:latest
```

### Issue: OnePasswordItem not becoming Ready
**Symptom**: `kubectl get onepassworditem` shows `READY: False`
**Solution**:
```bash
# Check operator logs
kubectl logs -n onepassword-system deployment/onepassword-connect

# Describe OnePasswordItem for error details
kubectl describe onepassworditem -n quickstart-test quickstart-secret

# Common causes:
# - Connect credentials Secret missing
# - Invalid 1Password credentials
# - Incorrect itemPath format
# - Network connectivity to 1Password
```

### Issue: Workload not restarting after rotation
**Symptom**: Secret updated but Deployment not restarted
**Solution**:
```bash
# Verify Reloader is running
kubectl get pods -n reloader-system

# Check Reloader annotation
kubectl get deployment -n quickstart-test restart-test -o jsonpath='{.metadata.annotations}'

# Check Reloader logs
kubectl logs -n reloader-system deployment/reloader

# Manually trigger restart
kubectl rollout restart deployment/restart-test -n quickstart-test
```

## Next Steps

After completing the quickstart:

1. **Run Full Test Suite**:
   ```bash
   cd libs/onepassword-addon-xp
   kuttl test --config tests/kuttl-test.yaml
   ```

2. **Deploy to Real Cluster**:
   - Update stacks/enigma-cluster with AddOn CR
   - Configure real 1Password Connect credentials
   - Deploy via Flux GitOps

3. **Review Documentation**:
   - [data-model.md](data-model.md) - Entity schemas and relationships
   - [contracts/README.md](contracts/README.md) - Test specifications
   - [research.md](research.md) - Technology decisions

## Success Criteria

This quickstart is successful if:
- All validation checklist items are checked
- No unexpected errors during execution
- Cleanup completes without issues
- Understanding of AddOn workflow and secret lifecycle achieved
