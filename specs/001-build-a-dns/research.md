# Research: Internal DNS with Crossplane and cdk8s

## Decision Summary

This document captures the technical research and decisions made during the planning phase for the internal DNS service implementation using Crossplane, cdk8s, external-dns, and PowerDNS.

## 1. Crossplane Function for cdk8s Rendering

**Decision**: Create custom Crossplane function in Python that renders cdk8s code

**Rationale**:
- No existing Crossplane function supports rendering cdk8s Python code
- Crossplane functions can execute arbitrary code during composition rendering
- Python is well-suited for both Crossplane functions and cdk8s
- uv package manager provides fast, deterministic Python dependency installation

**Alternatives Considered**:
- Using Crossplane's built-in patch-and-transform: Insufficient - cannot execute cdk8s code
- Using Helm templates: Not type-safe, lacks cdk8s benefits (autocomplete, testing)
- Pre-rendering cdk8s to YAML: Loses dynamic composition capability

**Implementation Approach**:
- Function receives Crossplane composition request
- Installs cdk8s using uv in function runtime
- Executes Python cdk8s code to generate Kubernetes manifests
- Returns rendered manifests to Crossplane composition pipeline

**References**:
- Crossplane Functions: https://docs.crossplane.io/latest/concepts/composition-functions/
- cdk8s: https://cdk8s.io/

## 2. external-dns Integration with PowerDNS

**Decision**: Use external-dns with PowerDNS provider for ingress discovery

**Rationale**:
- external-dns natively supports PowerDNS provider
- Proven solution for syncing Kubernetes resources to DNS
- Actively maintained by kubernetes-sigs community
- Supports multiple DNS sources including Ingress resources

**Configuration**:
- external-dns watches Ingress resources across all namespaces
- Syncs discovered ingresses to PowerDNS via HTTP API
- PowerDNS provider configuration requires:
  - PowerDNS API endpoint
  - API key authentication
  - Zone configuration

**Alternatives Considered**:
- Custom ingress watcher: Violates constitution (write minimal code, prefer third-party)
- CoreDNS with K8s plugin: Doesn't provide persistent storage or SQL backend
- etcd-based DNS: More complex, no specific ingress integration

**References**:
- external-dns: https://github.com/kubernetes-sigs/external-dns
- external-dns PowerDNS provider: https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pdns.md

## 3. PowerDNS Storage Backend

**Decision**: Use PowerDNS with SQLite backend on persistent volume

**Rationale**:
- SQLite provides simple, file-based storage suitable for single-instance deployment
- PowerDNS pdns-auth-50 image includes SQLite support
- Schema available at `/usr/local/share/doc/pdns/schema.sqlite3.sql` in container
- Replicated PVC ensures data persistence across pod restarts

**Configuration**:
- SQLite database file stored on PersistentVolumeClaim
- PowerDNS configured with gsqlite3 backend
- Database initialized with schema from container on first run

**Alternatives Considered**:
- PostgreSQL/MySQL: Over-engineered for single-instance, small-scale deployment
- In-memory storage: Loses DNS records on pod restart
- etcd backend: Additional complexity, not needed for 100 ingresses

**Storage Requirements**:
- Minimal: 100 ingresses * ~1KB per record = ~100KB
- PVC size: 1GB (provides ample headroom)
- Access mode: ReadWriteOnce (single pod)

## 4. Testing Strategy

### 4.1 cdk8s Testing with pytest

**Decision**: Use cdk8s Testing library with pytest and snapshot tests

**Rationale**:
- cdk8s provides official testing utilities
- Snapshot tests catch unintended resource changes
- Type safety from Python helps catch errors early
- Aligns with TDD principle from constitution

**Approach**:
- Write tests first defining expected Kubernetes resources
- Use `Testing.synth()` to render cdk8s charts
- Compare against snapshots
- Validate resource properties programmatically

**References**:
- cdk8s Testing: https://cdk8s.io/docs/latest/basics/testing/

### 4.2 Crossplane Render Tests

**Decision**: Use Crossplane render command with snapshot validation

**Rationale**:
- Crossplane CLI provides `crossplane render` for composition testing
- Tests composition logic without requiring cluster
- Snapshot tests validate composition output stability
- Integrates with CI for automated validation

**Approach**:
```bash
crossplane render <test-input> <composition> <function-package> > output.yaml
diff output.yaml expected-snapshot.yaml
```

### 4.3 Integration Testing with kuttl

**Decision**: Use kuttl for end-to-end integration tests with kind

**Rationale**:
- kuttl designed for Kubernetes operator testing
- Declarative test cases as YAML
- Supports step-by-step validation
- kind provides lightweight local cluster

**Test Scenario**:
1. Create kind cluster with native storage
2. Install Crossplane
3. Install cdk8s function package
4. Install internal-dns configuration package
5. Create InternalDNS resource
6. Assert pods are running (external-dns, PowerDNS)
7. Create test Ingress resource
8. Query DNS service for ingress hostname
9. Validate correct IP resolution

**kind Configuration**:
- Native storage: Use kind's built-in local-path-provisioner
- No external storage required (already in Docker)

**References**:
- kuttl: https://kuttl.dev/
- kind: https://kind.sigs.k8s.io/

## 5. Deployment Architecture

**Decision**: Single deployment with external-dns and PowerDNS containers

**Rationale**:
- Requirements specify single instance (no redundancy)
- Simplifies pod networking and service configuration
- Both containers need to run continuously
- Shared persistent volume for PowerDNS database

**Pod Architecture**:
```yaml
Pod:
  containers:
  - name: external-dns
    # Watches Kubernetes Ingresses
    # Syncs to PowerDNS API
  - name: powerdns
    # Runs DNS server
    # Stores records in SQLite
  volumes:
  - name: dns-data
    persistentVolumeClaim:
      claimName: dns-storage
```

**Alternatives Considered**:
- Separate deployments: More complex networking, unnecessary for single instance
- StatefulSet: Overkill for single replica without scaling needs
- DaemonSet: Not appropriate - needs single instance, not per-node

## 6. Crossplane Package Structure

**Decision**: Configuration package (not provider)

**Rationale**:
- Configuration packages bundle compositions and XRDs
- Suitable for infrastructure patterns that compose existing resources
- Can depend on function packages
- Follows Crossplane best practices for reusable infrastructure

**Package Dependencies**:
- Depends on: cdk8s-function-xp (custom function)
- Depends on: provider-kubernetes (creates K8s resources)

**XRD (Composite Resource Definition)**:
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xinternaldnses.dns.internal
spec:
  group: dns.internal
  names:
    kind: XInternalDNS
    plural: xinternaldnses
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        properties:
          spec:
            properties:
              domain:
                type: string
                description: Internal domain suffix for ingresses
              storageSize:
                type: string
                default: "1Gi"
```

**References**:
- Crossplane Packages: https://docs.crossplane.io/latest/concepts/packages/

## 7. Version Pinning

**Decision**: Pin all dependencies to exact versions

**Rationale**: Constitutional requirement for deterministic builds

**Version Matrix**:
```
Crossplane: >= 2.0.2 → Will use 2.0.2 exactly
PowerDNS: powerdns/pdns-auth-50 → Exact tag
external-dns: TBD → Will pin to specific version (e.g., v0.14.0)
Python: 3.11 → Will use 3.11.x in Dockerfile
cdk8s: TBD → Will pin to exact version in requirements.txt
pytest: TBD → Will pin to exact version in requirements.txt
```

**Update Strategy**: Renovatebot for automated dependency updates

## 8. DNS Resolution Flow

**Decision**: Direct DNS queries to PowerDNS service

**End-to-End Flow**:
1. Developer creates Kubernetes Ingress with hostname `app.internal.example.com`
2. external-dns watches Ingress resources
3. external-dns detects new ingress within 30s (default sync interval)
4. external-dns calls PowerDNS API to create DNS record
5. PowerDNS stores record in SQLite database
6. Client (connected to Tailscale) queries DNS service
7. PowerDNS responds with ingress IP from SQLite
8. Client routes traffic to ingress

**DNS Service Configuration**:
- Service type: ClusterIP (internal only)
- Port: 53 (UDP/TCP for DNS)
- Tailscale integration: Expose via Tailscale subnet router or advertise service

**Alternatives Considered**:
- NodePort: Not needed - Tailscale provides network access
- LoadBalancer: Overkill for internal-only service
- Headless service: Need stable service IP for DNS queries

## 9. Nx Project Configuration

**Decision**: Create two independent libraries with Nx

**Library Structure**:
- `libs/cdk8s-function-xp`: Crossplane function (reusable)
- `libs/internal-dns-xp`: DNS configuration (uses function)

**Nx Configuration Requirements**:
```json
// libs/cdk8s-function-xp/project.json
{
  "name": "cdk8s-function-xp",
  "targets": {
    "build": {
      "executor": "@nx/python:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/cdk8s-function-xp"
      }
    },
    "test": {
      "executor": "@nx/python:pytest"
    },
    "docker-build": {
      "executor": "@nx/docker:build",
      "options": {
        "context": "libs/cdk8s-function-xp",
        "file": "libs/cdk8s-function-xp/Dockerfile"
      }
    }
  }
}

// libs/internal-dns-xp/project.json
{
  "name": "internal-dns-xp",
  "targets": {
    "test": {
      "executor": "@nx/python:pytest"
    },
    "crossplane-render": {
      "executor": "nx:run-commands",
      "options": {
        "command": "crossplane render ..."
      }
    },
    "integration-test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "kubectl kuttl test --config kuttl.yaml"
      }
    }
  }
}
```

**Testing with Nx**:
- Unit tests: `nx test cdk8s-function-xp`
- Unit tests: `nx test internal-dns-xp`
- Integration: `nx integration-test internal-dns-xp`
- Affected: `nx affected:test` (runs only changed libraries)

## 10. Tool Requirements

**Decision**: Ensure required tools available in bin/ or via Hermit

**Required Tools**:
- Python 3.11+ with uv
- kubectl
- kind
- kuttl
- crossplane CLI
- Docker (for building function image)

**Provisioning Strategy**:
- Add to `.envrc` for direnv auto-setup
- Use Hermit for version-pinned binaries
- Update `bin/help` with new tool documentation

**References**:
- Hermit: https://cashapp.github.io/hermit/

## Research Completion Checklist

- [x] All NEEDS CLARIFICATION items resolved
- [x] Technology choices documented with rationale
- [x] Alternatives considered and rejected with reasons
- [x] Integration patterns defined
- [x] Testing strategy established
- [x] Version pinning approach defined
- [x] Tool requirements identified
- [x] Architecture decisions documented

## Next Steps

Phase 1 will use this research to:
1. Define data model (XRD schema, DNS records structure)
2. Generate contracts (XRD spec, function API)
3. Create quickstart guide (deployment and testing steps)
4. Update agent context with new technologies and patterns
