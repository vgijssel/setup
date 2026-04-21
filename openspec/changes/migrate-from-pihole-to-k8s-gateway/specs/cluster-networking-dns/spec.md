## ADDED Requirements

### Requirement: In-cluster authoritative DNS for `*.enigma.vgijssel.nl`

The system SHALL run `k8s_gateway` on the root enigma cluster as an authoritative resolver for `enigma.vgijssel.nl`, serving records derived from in-cluster `Ingress` and `LoadBalancer Service` resources, so Kubernetes workloads (e.g. Keycloak OIDC validators) can resolve those names without depending on an external appliance.

#### Scenario: Pod resolves an ingress hostname

- **WHEN** a pod on the enigma cluster looks up a hostname such as `keycloak.enigma.vgijssel.nl` that is backed by an Ingress resource
- **THEN** the response SHALL contain the Ingress's `status.loadBalancer.ingress` IP (e.g. `192.168.50.100`)

#### Scenario: Non-existent hostname returns NXDOMAIN

- **WHEN** a pod looks up a hostname under `enigma.vgijssel.nl` that no watched Kubernetes resource exposes
- **THEN** `k8s_gateway` SHALL return `NXDOMAIN` rather than timing out or returning an unrelated answer

### Requirement: `kube-dns` forwards the zone to `k8s_gateway` via a stable ClusterIP

The cluster's `kube-system/coredns` Corefile SHALL contain a zone block for `enigma.vgijssel.nl` that forwards queries to the `k8s_gateway` ClusterIP. The `k8s_gateway` Service SHALL be of type `ClusterIP` with a pinned address (`10.96.53.53`) so the Corefile target is stable across reconciles.

#### Scenario: kube-dns picks up the new zone

- **WHEN** `kubectl -n kube-system get cm coredns -o jsonpath='{.data.Corefile}'` is inspected after the change has been applied
- **THEN** it SHALL contain a stanza of the form `enigma.vgijssel.nl:53 { ... forward . 10.96.53.53 ... }`

#### Scenario: k8s_gateway holds its pinned ClusterIP

- **WHEN** `kubectl -n tenant-prod-clusternetworking get svc` is inspected
- **THEN** the `k8s-gateway` Service SHALL have `type: ClusterIP` and `spec.clusterIP: 10.96.53.53`

### Requirement: `coredns-patch` applies the Corefile overlay via server-side apply

The Corefile change SHALL be delivered by a dedicated Helm chart at `apps/cluster-networking/coredns-patch/` whose Argo Application syncs with `ServerSideApply=true`, so ownership of `kube-system/coredns.data.Corefile` transfers from Talos's one-time bootstrap apply to `argocd-controller`.

#### Scenario: Argo owns the Corefile field

- **WHEN** `kubectl get --raw /api/v1/namespaces/kube-system/configmaps/coredns | jq '.metadata.managedFields'` is inspected after the prod sync
- **THEN** the field `data.Corefile` SHALL be owned by `argocd-controller` (not `talos`)

#### Scenario: PR envs do not modify the real Corefile

- **WHEN** the `coredns-patch` PR Application (`cluster-networking-coredns-patch-pr<N>`) syncs
- **THEN** `kube-system/coredns` SHALL remain unchanged, and a harmless `coredns-pr<N>-preview` ConfigMap SHALL exist in the PR namespace for inspection

### Requirement: Namespace ownership via a cozystack Tenant

`apps/cluster-networking/tenant/` SHALL define a cozystack `Tenant` CR named `clusternetworking` under `tenant-prod`, which creates and owns the `tenant-prod-clusternetworking` namespace. The `k8s-gateway` and `coredns-patch` Applications SHALL deploy into that namespace with `createNamespace: false`.

#### Scenario: Tenant creates the namespace

- **WHEN** the `cluster-networking-tenant` Application syncs
- **THEN** a `Tenant clusternetworking` SHALL exist under `tenant-prod` with `READY=True`, and namespace `tenant-prod-clusternetworking` SHALL exist on the cluster

#### Scenario: Apps do not self-manage namespaces

- **WHEN** the `k8s-gateway` or `coredns-patch` Application is inspected
- **THEN** its `config.yaml` SHALL set `createNamespace: false` and target `tenant-prod-clusternetworking`

### Requirement: Upstream chart vendored with an exact version pin

The upstream `k8s-gateway` Helm chart SHALL be vendored into `third_party/vendir/charts/k8s-gateway/` through an entry in `third_party/vendir/vendir.yml`, with an exact `version:` (no `~>`/`^`). The umbrella chart in `apps/cluster-networking/k8s-gateway/` SHALL reference it via `file://../../../third_party/vendir/charts/k8s-gateway` with a committed `Chart.lock`.

#### Scenario: Vendor sync

- **WHEN** `vendir sync` runs against `third_party/vendir/vendir.yml`
- **THEN** `third_party/vendir/charts/k8s-gateway/` SHALL be present and `third_party/vendir/vendir.lock.yml` SHALL record the same version as `vendir.yml`

### Requirement: Retire the Pi-hole-backed `external-dns` integration

The Flux `HelmRelease` at `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` SHALL be removed, along with its entry in `apps/enigma-cluster/kustomization.yaml`, since no consumer remains (VLAN clients never depended on the synced records; in-cluster workloads now resolve via `kube-dns → k8s_gateway`). The Cloudflare-backed `external-dns` HelmRelease SHALL remain unchanged. The Pi-hole appliance SHALL NOT be decommissioned as part of this change, and no DHCP/router changes SHALL be required.

#### Scenario: Pi-hole HelmRelease gone

- **WHEN** `kubectl get helmrelease -n flux-system` is run after the change has been applied
- **THEN** no `external-dns-pihole` HelmRelease SHALL exist, and Flux SHALL have pruned the matching `external-dns` Deployment in the `external-dns` namespace

#### Scenario: Cloudflare external-dns untouched

- **WHEN** the change has been applied
- **THEN** `apps/enigma-cluster/helmrelease-external-dns.yaml` (Cloudflare provider, `internal-networking=true` label filter) SHALL remain unchanged and continue to function

#### Scenario: No VLAN/DHCP changes required

- **WHEN** the change is applied
- **THEN** no MetalLB IP, router DHCP setting, Talos nameserver, or `/etc/resolv.conf` on any node SHALL need to change

### Requirement: ApplicationSet `templatePatch` merges sync options correctly

Both `applicationset-prod.yaml` and `applicationset-pr.yaml` SHALL emit `spec.syncPolicy.syncOptions` as a single block that includes `PruneLast=true` plus conditional `CreateNamespace=true` and `ServerSideApply=true`, so no sync option is lost when multiple flags are true.

#### Scenario: All three options on a single Application

- **WHEN** an Application has `createNamespace: true`, `serverSideApply: true` in its `config.yaml`
- **THEN** the generated Application SHALL have `spec.syncPolicy.syncOptions` equal to `[PruneLast=true, CreateNamespace=true, ServerSideApply=true]`

### Requirement: `helm-platform` generator preserves non-vCluster config fields

`libs/helm-platform/src/helm_platform/generator.py` SHALL preserve `cluster`, `createNamespace`, `prUpdateNamespace`, and `prUpdateCluster` from an existing `config.yaml` when present, in addition to the already-preserved `namespace`, `serverSideApply`, and `prOverrides`.

#### Scenario: Root-cluster app keeps its cluster value

- **WHEN** `config.yaml` exists with `cluster: enigma` for a grouping that would otherwise default to `<platform>-vcluster`
- **THEN** the regenerated config SHALL keep `cluster: enigma`
