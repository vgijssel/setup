# Data Model: Internal DNS Service

## Overview

This document defines the data entities and their relationships for the internal DNS service implementation using Crossplane, external-dns, and PowerDNS.

## Core Entities

### 1. InternalDNS (Composite Resource)

**Description**: Crossplane composite resource representing the internal DNS service instance

**Fields**:
```yaml
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: string              # Name of the DNS service instance
spec:
  domain: string            # Internal domain suffix (e.g., "internal.example.com")
  storageSize: string       # PVC storage size (default: "1Gi")
  externalDnsVersion: string # external-dns image version (pinned)
  powerdnsVersion: string   # PowerDNS image version (default: "powerdns/pdns-auth-50")
  syncInterval: string      # external-dns sync interval (default: "30s")
status:
  ready: boolean            # Overall readiness status
  powerdnsEndpoint: string  # PowerDNS API endpoint for debugging
  recordCount: integer      # Number of DNS records (if available)
  conditions: []Condition   # Standard Kubernetes conditions
```

**Validation Rules**:
- `domain` must be valid DNS domain format
- `storageSize` must be valid Kubernetes quantity (e.g., "1Gi", "500Mi")
- `externalDnsVersion` must match semantic version pattern
- `syncInterval` must be valid duration string

**Relationships**:
- Creates: Deployment (containing external-dns and PowerDNS containers)
- Creates: Service (DNS service endpoint)
- Creates: PersistentVolumeClaim (DNS storage)
- Creates: ConfigMap (PowerDNS configuration)
- Creates: Secret (PowerDNS API key)

### 2. DNSDeployment (Kubernetes Resource)

**Description**: Kubernetes Deployment containing external-dns and PowerDNS containers

**Fields**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: string
  labels:
    app: internal-dns
    instance: string        # References parent InternalDNS
spec:
  replicas: 1               # Single instance per requirements
  selector:
    matchLabels:
      app: internal-dns
      instance: string
  template:
    spec:
      containers:
      - name: external-dns
        image: string       # external-dns image with version tag
        args:
        - --source=ingress
        - --provider=pdns
        - --pdns-server=http://localhost:8081
        - --pdns-api-key=$(PDNS_API_KEY)
        - --domain-filter=$(DOMAIN)
        - --interval=$(SYNC_INTERVAL)
        env:
        - name: PDNS_API_KEY
          valueFrom:
            secretKeyRef:
              name: string
              key: api-key
        - name: DOMAIN
          value: string
        - name: SYNC_INTERVAL
          value: string

      - name: powerdns
        image: string       # PowerDNS image with version tag
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        - containerPort: 8081
          name: api
        volumeMounts:
        - name: dns-data
          mountPath: /var/lib/powerdns
        - name: config
          mountPath: /etc/powerdns

      volumes:
      - name: dns-data
        persistentVolumeClaim:
          claimName: string
      - name: config
        configMap:
          name: string
```

**State Transitions**:
- Creating → Running → Ready
- On failure → CrashLoopBackOff → Running (after fix)
- On deletion → Terminating → Deleted

### 3. DNSService (Kubernetes Service)

**Description**: Kubernetes Service exposing DNS functionality

**Fields**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: string
  labels:
    app: internal-dns
spec:
  type: ClusterIP           # Internal only
  selector:
    app: internal-dns
    instance: string
  ports:
  - name: dns-udp
    port: 53
    targetPort: 53
    protocol: UDP
  - name: dns-tcp
    port: 53
    targetPort: 53
    protocol: TCP
  - name: api
    port: 8081
    targetPort: 8081
    protocol: TCP
status:
  clusterIP: string         # Assigned cluster IP for DNS queries
```

**Relationships**:
- Routes to: DNSDeployment pods
- Used by: Tailscale clients for DNS resolution

### 4. DNSStorage (PersistentVolumeClaim)

**Description**: Persistent storage for PowerDNS SQLite database

**Fields**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: string
spec:
  accessModes:
  - ReadWriteOnce           # Single pod access
  resources:
    requests:
      storage: string       # From InternalDNS.spec.storageSize
status:
  phase: string             # Pending, Bound, Lost
  capacity:
    storage: string
```

**Contents**:
- SQLite database file: `pdns.sqlite3`
- Database schema initialized from `/usr/local/share/doc/pdns/schema.sqlite3.sql`

### 5. PowerDNSConfig (ConfigMap)

**Description**: PowerDNS server configuration

**Fields**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: string
data:
  pdns.conf: |
    launch=gsqlite3
    gsqlite3-database=/var/lib/powerdns/pdns.sqlite3
    webserver=yes
    webserver-address=0.0.0.0
    webserver-port=8081
    api=yes
    api-key=$(PDNS_API_KEY)
    local-address=0.0.0.0
    local-port=53
```

### 6. PowerDNSSecret (Secret)

**Description**: PowerDNS API key for external-dns authentication

**Fields**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: string
type: Opaque
data:
  api-key: string           # Base64 encoded random key
```

**Generation**: Created automatically by composition with random API key

### 7. DNSRecord (PowerDNS Database Entity)

**Description**: DNS record stored in PowerDNS SQLite database (not a Kubernetes resource)

**Schema** (from PowerDNS schema.sqlite3.sql):
```sql
CREATE TABLE domains (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  master VARCHAR(128) DEFAULT NULL,
  last_check INTEGER DEFAULT NULL,
  type VARCHAR(6) NOT NULL,
  notified_serial INTEGER DEFAULT NULL,
  account VARCHAR(40) DEFAULT NULL
);

CREATE TABLE records (
  id INTEGER PRIMARY KEY,
  domain_id INTEGER DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  type VARCHAR(10) DEFAULT NULL,
  content VARCHAR(65535) DEFAULT NULL,
  ttl INTEGER DEFAULT NULL,
  prio INTEGER DEFAULT NULL,
  disabled BOOLEAN DEFAULT 0,
  ordername VARCHAR(255),
  auth BOOL DEFAULT 1
);

CREATE INDEX rec_name_index ON records(name);
CREATE INDEX nametype_index ON records(name,type);
CREATE INDEX domain_id ON records(domain_id);
```

**Fields**:
- `id`: Auto-increment primary key
- `domain_id`: Foreign key to domains table
- `name`: Full DNS name (e.g., "app.internal.example.com")
- `type`: Record type (A, AAAA, CNAME, etc.)
- `content`: Record value (IP address, hostname, etc.)
- `ttl`: Time to live in seconds
- `prio`: Priority for MX, SRV records
- `disabled`: Whether record is active
- `auth`: Authoritative flag

**Lifecycle**:
- Created: external-dns detects new Ingress
- Updated: Ingress IP or hostname changes
- Deleted: Ingress is removed from cluster

### 8. KubernetesIngress (Source Entity)

**Description**: Kubernetes Ingress resource that triggers DNS record creation (not created by this system, but monitored)

**Relevant Fields**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: string
  namespace: string
  annotations:
    external-dns.alpha.kubernetes.io/hostname: string  # Optional override
spec:
  rules:
  - host: string            # e.g., "app.internal.example.com"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: string
            port:
              number: 80
status:
  loadBalancer:
    ingress:
    - ip: string            # IP address for DNS record
```

**Relationship to DNS**:
- `spec.rules[].host` becomes DNS record name
- `status.loadBalancer.ingress[].ip` becomes DNS record content
- external-dns watches for changes and syncs to PowerDNS

## Data Flow

### DNS Record Creation Flow

```
1. User creates Ingress
   ↓
2. Ingress Controller assigns IP
   ↓
3. external-dns detects Ingress (every syncInterval)
   ↓
4. external-dns validates hostname matches domain filter
   ↓
5. external-dns calls PowerDNS API: POST /api/v1/servers/localhost/zones/{zone}/records
   ↓
6. PowerDNS inserts record into SQLite database
   ↓
7. DNS queries for hostname now return IP
```

### DNS Query Flow

```
1. Tailscale client performs DNS lookup
   ↓
2. Query reaches DNS Service (ClusterIP)
   ↓
3. Service routes to PowerDNS container
   ↓
4. PowerDNS queries SQLite database
   ↓
5. PowerDNS returns A record with IP
   ↓
6. Client receives IP and connects to Ingress
```

### DNS Record Deletion Flow

```
1. User deletes Ingress
   ↓
2. external-dns detects deletion (next sync cycle)
   ↓
3. external-dns calls PowerDNS API: DELETE /api/v1/servers/localhost/zones/{zone}/records
   ↓
4. PowerDNS removes record from SQLite database
   ↓
5. DNS queries for hostname return NXDOMAIN
```

## Entity Relationships Diagram

```
InternalDNS (Composite Resource)
    ├── creates → DNSDeployment
    │               ├── contains → external-dns container
    │               │               └── watches → KubernetesIngress
    │               │                            └── syncs to → PowerDNS API
    │               └── contains → PowerDNS container
    │                               ├── stores → DNSRecord (in SQLite)
    │                               └── serves → DNS queries
    ├── creates → DNSService
    │               └── routes to → DNSDeployment pods
    ├── creates → DNSStorage (PVC)
    │               └── stores → SQLite database
    ├── creates → PowerDNSConfig (ConfigMap)
    │               └── configures → PowerDNS container
    └── creates → PowerDNSSecret
                    └── authenticates → external-dns to PowerDNS API

External (not created):
    KubernetesIngress (monitored by external-dns)
    TailscaleClient (queries DNSService)
```

## Validation Rules Summary

### InternalDNS Resource
- Domain must be valid DNS domain (RFC 1035)
- Storage size must be valid Kubernetes quantity
- Version strings must follow semver
- Sync interval must be valid Go duration

### DNS Records
- Hostname must match domain filter
- Hostname must be globally unique (enforced by PowerDNS unique constraint)
- TTL must be positive integer
- IP addresses must be valid IPv4 or IPv6

### Deployment
- Must have exactly 1 replica (constitutional requirement: single instance)
- Containers must have resource limits defined
- Volume mounts must reference existing volumes

### Service
- Must be ClusterIP type (internal only)
- Must expose ports 53 UDP/TCP for DNS

## Schema Evolution

### Version: v1alpha1 (Initial)
- Basic InternalDNS resource with domain and storage configuration
- Single deployment pattern
- SQLite storage backend

### Future Considerations (Not in Scope)
- v1beta1: Add redundancy support (multi-replica)
- v1beta1: Add metrics and monitoring configuration
- v1: Production-ready with SLA guarantees
- v2: Support for multiple storage backends (PostgreSQL, MySQL)

## Testing Data Model

### Unit Test Fixtures

**Valid InternalDNS**:
```yaml
apiVersion: dns.internal/v1alpha1
kind: InternalDNS
metadata:
  name: test-dns
spec:
  domain: "internal.test.com"
  storageSize: "1Gi"
  externalDnsVersion: "v0.14.0"
  powerdnsVersion: "powerdns/pdns-auth-50"
  syncInterval: "30s"
```

**Valid Ingress** (for testing external-dns):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test-app
  namespace: default
spec:
  rules:
  - host: "app.internal.test.com"
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: test-app
            port:
              number: 80
status:
  loadBalancer:
    ingress:
    - ip: "10.96.0.100"
```

### Invalid Cases (for validation tests)
- InternalDNS with invalid domain: "not a domain!"
- InternalDNS with invalid storage: "not-a-quantity"
- Ingress with hostname not matching domain filter: "app.example.com"
- Duplicate ingress hostnames in different namespaces

## Completion Checklist

- [x] All entities from feature spec identified
- [x] Entity fields and types documented
- [x] Validation rules defined
- [x] Relationships between entities mapped
- [x] Data flow documented
- [x] State transitions identified
- [x] Test fixtures provided
- [x] Schema versioning considered
