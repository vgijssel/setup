## ADDED Requirements

### Requirement: In-cluster authoritative DNS for internal hostnames

The system SHALL run `k8s_gateway` on the root enigma Kubernetes cluster to answer DNS queries for internal hostnames that are exposed as Kubernetes Ingress (and other configured) resources, replacing the external Pi-hole appliance as the internal DNS resolver.

#### Scenario: Resolving an ingress hostname from the VLAN

- **WHEN** a client on the `192.168.50.0/24` VLAN queries the internal DNS service IP for a hostname that exists as an Ingress resource on the enigma cluster
- **THEN** `k8s_gateway` SHALL return the LoadBalancer/ingress address configured for that Ingress

#### Scenario: Resolving a hostname that does not exist

- **WHEN** a client queries the internal DNS service IP for a hostname that is not backed by any watched Kubernetes resource
- **THEN** `k8s_gateway` SHALL return `NXDOMAIN` (or delegate upstream if configured) rather than silently hanging

### Requirement: Declarative ArgoCD delivery following the `apps/<grouping>/<app>/` pattern

The `k8s_gateway` deployment SHALL be defined as an umbrella Helm chart under `apps/cluster-networking/k8s-gateway/` with a `config.yaml` that is auto-discovered by the production ApplicationSet (`apps/argocd-apps/manifests/applicationset-prod.yaml`) and SHALL target the root enigma cluster, not a vCluster.

#### Scenario: ApplicationSet discovery

- **WHEN** `applicationset-prod` scans `apps/*/*/config.yaml`
- **THEN** it SHALL find `apps/cluster-networking/k8s-gateway/config.yaml` and generate an ArgoCD `Application` with `cluster: enigma` and the configured namespace

#### Scenario: Umbrella chart references vendored dependency

- **WHEN** ArgoCD renders the `k8s-gateway` umbrella chart
- **THEN** its `Chart.yaml` SHALL reference the vendored chart via a `file://` path under `third_party/vendir/charts/k8s-gateway`, and `Chart.lock` SHALL be committed so ArgoCD can resolve the dependency without network access

### Requirement: Upstream chart vendored via `vendir` with pinned version

The upstream `k8s-gateway` Helm chart SHALL be vendored into `third_party/vendir/charts/k8s-gateway/` through an entry in `third_party/vendir/vendir.yml`, with an exact `version:` pin (no `~>` / `^` ranges).

#### Scenario: Syncing vendored chart

- **WHEN** `vendir sync` runs against `third_party/vendir/vendir.yml`
- **THEN** it SHALL fetch the pinned `k8s-gateway` chart version, write it to `third_party/vendir/charts/k8s-gateway/`, and update `third_party/vendir/vendir.lock.yml`

#### Scenario: Version pinning enforcement

- **WHEN** the `vendir.yml` entry for `k8s-gateway` is inspected
- **THEN** the `version:` field SHALL be an exact semver (e.g., `2.4.0`) matching the repo's dependency-pinning policy

### Requirement: DNS service reachable on the internal VLAN via MetalLB

`k8s_gateway` SHALL expose its DNS endpoint on UDP/TCP port 53 through a Kubernetes `Service` of `type: LoadBalancer` backed by MetalLB, with a stable IP address on the `192.168.50.0/24` internal VLAN.

#### Scenario: MetalLB assigns the requested IP

- **WHEN** the `k8s-gateway` Service is reconciled by ArgoCD
- **THEN** MetalLB SHALL allocate the configured IP from the internal address pool and make UDP/TCP port 53 reachable from VLAN clients

#### Scenario: DNS endpoint survives pod restart

- **WHEN** a `k8s-gateway` pod is deleted and rescheduled
- **THEN** the Service LoadBalancer IP SHALL remain unchanged and queries SHALL resume without client reconfiguration

### Requirement: Retire the Pi-hole-backed `external-dns`

The Flux `HelmRelease` at `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` SHALL be removed, along with its entry in `apps/enigma-cluster/kustomization.yaml`, once `k8s_gateway` is serving internal DNS. The Cloudflare-backed `external-dns` HelmRelease SHALL remain unchanged.

#### Scenario: Pi-hole HelmRelease removed

- **WHEN** `kubectl get helmrelease -n flux-system` is run after the change is applied
- **THEN** no `external-dns-pihole` HelmRelease SHALL exist, and Flux SHALL have pruned its `external-dns` deployment in the `external-dns` namespace that was backed by `provider: pihole`

#### Scenario: Cloudflare external-dns untouched

- **WHEN** the change is applied
- **THEN** `apps/enigma-cluster/helmrelease-external-dns.yaml` (Cloudflare provider, `internal-networking=true` label filter) SHALL remain unchanged and functional

### Requirement: No vCluster introduced for the DNS capability

The `cluster-networking` grouping SHALL NOT create a companion `cluster-networking-infra/` grouping, a vCluster, or a nested tenant/namespace orchestration chart. `k8s-gateway` runs directly on the root enigma cluster.

#### Scenario: Repo layout inspection

- **WHEN** `apps/cluster-networking*` is listed
- **THEN** only `apps/cluster-networking/` SHALL exist, containing `k8s-gateway/` and a `moon.yml`, with no `apps/cluster-networking-infra/` directory
