# Data Model: 1Password Kubernetes Integration

**Date**: 2025-10-04
**Source**: Derived from feature requirements and 1Password Connect Operator CRDs

## Overview
This document defines the key entities and their relationships for the 1Password Kubernetes integration. The data model is primarily defined by the 1Password Connect Operator's Custom Resource Definitions (CRDs).

## Core Entities

### Entity 1: AddOn (Crossplane)
**Purpose**: Crossplane package definition for deploying the 1Password operator

**Schema** (crossplane.yaml):
```yaml
apiVersion: meta.pkg.upbound.io/v1beta1
kind: AddOn
metadata:
  name: onepassword-operator
  annotations:
    friendly-name.meta.crossplane.io: "1Password Connect Operator"
    meta.crossplane.io/description: "Synchronize secrets from 1Password vaults to Kubernetes"
    meta.crossplane.io/maintainer: "Setup Monorepo"
spec:
  packagingType: Helm
  helm:
    releaseName: onepassword-connect
    releaseNamespace: onepassword-system
```

**Fields**:
- `metadata.name`: Unique identifier for the AddOn
- `spec.packagingType`: Always "Helm" for this package
- `spec.helm.releaseName`: Helm release name when deployed
- `spec.helm.releaseNamespace`: Kubernetes namespace for operator deployment

**Validation Rules**:
- `metadata.name` must be DNS-1123 compliant
- `releaseNamespace` should not be `default` (best practice)

**Relationships**:
- **Contains**: Helm chart (connect-2.0.5.tgz) and CRDs
- **Deployed by**: Crossplane package manager
- **Deployed to**: Kubernetes cluster (e.g., enigma-cluster)

### Entity 2: OnePasswordItem (CRD)
**Purpose**: Declarative specification for syncing a secret from 1Password to Kubernetes

**Schema** (onepassworditems.onepassword.com CRD):
```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: example-secret
  namespace: app-namespace
spec:
  itemPath: "vaults/<vault-name>/items/<item-name>"
  ## Optional fields:
  # fields:
  #   - fieldPath: "password"
  #     fieldName: "password"
  #   - fieldPath: "username"
  #     fieldName: "username"
status:
  conditions:
  - type: Ready
    status: "True"
    reason: SecretSynced
    message: "Secret successfully synced"
```

**Fields**:
- `spec.itemPath`: Path to 1Password item (format: `vaults/{vault}/items/{item}`)
- `spec.fields[]`: Optional field mappings (defaults to all fields if omitted)
  - `fieldPath`: Field identifier in 1Password
  - `fieldName`: Key name in resulting Kubernetes Secret
- `status.conditions[]`: Sync status (Ready, Error, etc.)

**Validation Rules**:
- `itemPath` must match pattern: `vaults/[^/]+/items/[^/]+`
- `fieldPath` cannot be empty if `fields` is specified
- `metadata.namespace` determines where Secret is created

**Relationships**:
- **Reads from**: 1Password Vault (via Connect API)
- **Creates**: Kubernetes Secret (same namespace)
- **Watched by**: 1Password Connect Operator
- **Triggers**: Reloader for workload restart (via annotation)

**State Transitions**:
1. **Created** → Operator detects new OnePasswordItem
2. **Syncing** → Operator fetches from 1Password
3. **Ready** → Secret created/updated in Kubernetes
4. **Error** → 1Password unavailable or permission denied
5. **Deleted** → Secret removed from Kubernetes

### Entity 3: Kubernetes Secret
**Purpose**: Standard Kubernetes Secret populated from 1Password

**Schema**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-secret  # Matches OnePasswordItem name
  namespace: app-namespace
  labels:
    onepassword.com/item-path: "vaults/my-vault/items/my-item"
    onepassword.com/managed-by: "onepassword-connect"
type: Opaque
data:
  password: <base64-encoded>
  username: <base64-encoded>
```

**Fields**:
- `data.*`: Key-value pairs from 1Password item fields (base64-encoded)
- `metadata.labels`: Tracking labels for 1Password integration

**Validation Rules**:
- Automatically created/updated by operator (not manually edited)
- Data keys match OnePasswordItem.spec.fields[].fieldName
- Values are base64-encoded

**Relationships**:
- **Created by**: OnePasswordItem controller
- **Consumed by**: Pods (via envFrom or volumeMounts)
- **Watched by**: Reloader (for triggering restarts)

**Lifecycle**:
- Created when OnePasswordItem becomes Ready
- Updated when 1Password item changes
- Persists during 1Password outages (cached)
- Deleted when OnePasswordItem is deleted

### Entity 4: Connect Credentials Secret
**Purpose**: Stores 1Password Connect API credentials per namespace

**Schema**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect
  namespace: app-namespace
type: Opaque
data:
  1password-credentials.json: <base64-encoded-credentials>
  token: <base64-encoded-connect-token>
```

**Fields**:
- `data.1password-credentials.json`: 1Password Connect credentials file
- `data.token`: API token for Connect server

**Validation Rules**:
- Must exist before creating OnePasswordItem in namespace
- Token must have read access to vaults referenced in OnePasswordItem
- Credentials file must be valid JSON

**Relationships**:
- **Used by**: OnePasswordItem controller for API authentication
- **Scoped to**: Namespace (each namespace can have different credentials)
- **Created by**: Cluster admin (via Sealed Secrets or SOPS)

**Security Considerations**:
- Never commit to Git in plaintext
- Use SealedSecret or SOPS for GitOps
- Rotate tokens periodically
- Limit vault access per namespace (principle of least privilege)

### Entity 5: Deployment/StatefulSet with Secret Injection
**Purpose**: Workload consuming secrets from 1Password

**Schema** (example):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: app-namespace
  annotations:
    reloader.stakater.com/auto: "true"  # Auto-restart on secret change
spec:
  template:
    spec:
      containers:
      - name: app
        image: myapp:latest
        ## Option 1: Environment variables
        envFrom:
        - secretRef:
            name: example-secret
        ## Option 2: Mounted files
        volumeMounts:
        - name: secrets
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: secrets
        secret:
          secretName: example-secret
```

**Fields**:
- `metadata.annotations.reloader.stakater.com/auto`: Enables automatic restart
- `spec.template.spec.containers[].envFrom`: Injects secret as env vars
- `spec.template.spec.volumes[]`: Mounts secret as files

**Validation Rules**:
- Secret must exist before Pod starts (or Pod will fail)
- Reloader annotation enables FR-002/FR-010 (automatic restart)

**Relationships**:
- **Consumes**: Kubernetes Secret (from OnePasswordItem)
- **Restarted by**: Reloader when Secret changes
- **Depends on**: OnePasswordItem being Ready

**Behavior**:
- **Initial start**: Waits for Secret to exist
- **Secret rotation**: Reloader triggers rolling restart
- **1Password outage**: Uses cached Secret (no restart needed)

## Entity Relationships Diagram

```
1Password Vault
      ↓ (API read)
OnePasswordItem (CRD)
      ↓ (creates/updates)
Kubernetes Secret
      ↓ (consumed by)
Deployment/StatefulSet
      ↑ (watches)
Reloader
      ↓ (triggers restart)
Deployment/StatefulSet (updated)

Connect Credentials Secret
      → (auth for)
OnePasswordItem Controller
```

## Data Flow

### Flow 1: Initial Secret Sync
1. Admin creates Connect Credentials Secret in namespace
2. Admin creates OnePasswordItem referencing vault/item
3. Operator authenticates to 1Password using credentials
4. Operator fetches secret from 1Password
5. Operator creates Kubernetes Secret with data
6. OnePasswordItem status → Ready
7. Pod starts and consumes Secret

### Flow 2: Secret Rotation
1. Secret updated in 1Password (manual or automatic rotation)
2. Operator polls 1Password (or receives webhook)
3. Operator detects change
4. Operator updates Kubernetes Secret
5. Reloader detects Secret change
6. Reloader triggers Deployment rolling restart
7. Pods restart with new secret values

### Flow 3: 1Password Outage (Offline Resilience)
1. 1Password becomes unavailable
2. Operator fails to connect
3. OnePasswordItem status → Error (condition: SyncFailed)
4. Kubernetes Secret **remains unchanged** (cached)
5. Pods continue using cached secret
6. New Pods can still start (Secret exists)
7. When 1Password recovers, operator resumes sync

### Flow 4: Multi-Cluster Deployment
1. Crossplane AddOn package published to ghcr.io
2. Flux in enigma-cluster pulls AddOn CR
3. Crossplane installs operator in onepassword-system namespace
4. Admin creates Connect Credentials per application namespace
5. Applications create OnePasswordItem resources
6. (Repeat for additional clusters with independent credentials)

## Validation and Constraints

### Namespace Isolation (FR-003)
- Each namespace has own Connect Credentials Secret
- OnePasswordItem can only create Secret in same namespace
- Credentials scope limits vault access per namespace

### Secret Type Support (FR-008)
- **Plain text**: Stored as Secret data keys
- **Binary data**: Base64-encoded in Secret data
- **Structured data** (JSON/YAML): Stored as single key with structured value

Example:
```yaml
# 1Password item with JSON field
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: config-json
spec:
  itemPath: "vaults/app-vault/items/app-config"
  fields:
  - fieldPath: "notesPlain"  # Contains JSON
    fieldName: "config.json"
---
# Resulting Secret
apiVersion: v1
kind: Secret
data:
  config.json: <base64-encoded-json>
```

### Audit Trail (FR-007)
- Operator logs all sync operations
- OnePasswordItem status includes last sync time
- Kubernetes audit logs capture Secret access
- 1Password Connect logs API requests

**Logged Events**:
- OnePasswordItem created/updated/deleted
- Secret synced successfully
- Sync failed (with reason)
- 1Password API errors
- Credential authentication failures

## Testing Considerations

### Unit Test Scenarios (N/A - using operator as-is)
Operator is third-party; no custom code to unit test.

### Integration Test Scenarios (kuttl)
1. **Install AddOn** → Operator pods become Ready
2. **Create OnePasswordItem** → Secret created with correct data
3. **Update 1Password item** → Secret updated, Deployment restarted
4. **Delete OnePasswordItem** → Secret deleted
5. **1Password unavailable** → Secret persists, new Pods can start
6. **Invalid credentials** → OnePasswordItem status shows Error

### Contract Test Scenarios
1. **OnePasswordItem CRD schema** → Matches official CRD version
2. **Secret format** → Contains expected keys from OnePasswordItem.spec.fields
3. **Reloader annotation** → Deployment restarts when Secret changes

## Performance Characteristics

### Sync Latency
- **Initial sync**: < 5 seconds (FR-002 performance goal)
- **Rotation detection**: 30-60 seconds (operator poll interval)
- **Workload restart**: 30-60 seconds (Reloader + rolling update)

### Scale Limits
- **OnePasswordItems per namespace**: Unlimited (practical limit: 1000+)
- **Secrets per cluster**: Unlimited (Kubernetes etcd limit applies)
- **Concurrent syncs**: Operator concurrency tunable (default: 10)

### Resource Usage
- **Operator CPU**: 100m-500m (varies with # of OnePasswordItems)
- **Operator Memory**: 128Mi-512Mi
- **Secret storage**: Minimal (etcd overhead only)

## Migration and Compatibility

### Versioning
- OnePasswordItem CRD: v1 (stable API)
- Crossplane AddOn: Follows semver based on Helm chart version
- Backward compatibility: CRD changes follow Kubernetes API versioning

### Upgrade Path
1. Update AddOn package version in Flux
2. Crossplane applies Helm chart upgrade
3. Operator restarted with new version
4. Existing OnePasswordItems remain functional
5. CRD schema updated (backward compatible)

## Future Considerations

### Potential Enhancements (Out of Scope for v1)
- **Webhook-based sync**: Replace polling with 1Password webhooks (lower latency)
- **Field-level encryption**: Encrypt Secret data at rest in etcd
- **Multi-vault support**: OnePasswordItem referencing multiple vaults
- **Secret rotation policies**: Automatic expiration and rotation triggers
- **External Secrets Operator integration**: Alternative backend option

### Known Limitations
- **Polling delay**: 30-60s between rotation and detection (webhook would fix)
- **No cross-namespace secrets**: OnePasswordItem and Secret must be co-located
- **No templating**: Secret values used as-is (no string interpolation)
