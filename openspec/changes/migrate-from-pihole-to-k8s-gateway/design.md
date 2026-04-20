## Context

Internal DNS for the `192.168.50.0/24` VLAN is currently answered by a standalone Pi-hole appliance at `192.168.50.2`. The enigma Kubernetes cluster feeds records to it via a dedicated `external-dns` HelmRelease (`apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`) configured with `provider: pihole`, `--pihole-api-version=6`, and a 1Password-sourced credential. A second `external-dns` (Cloudflare provider) continues to handle public DNS.

The repo layout (see `apps/CLAUDE.md`) uses ArgoCD ApplicationSets that discover apps via `apps/*/*/config.yaml`. Umbrella Helm charts reference vendored dependencies in `third_party/vendir/charts/<name>` via `file://` paths. `apps/secrets-proxy/` and `apps/secrets-proxy-infra/` illustrate the split between app and infra groupings for a vCluster-hosted capability. Here there is no vCluster: `k8s_gateway` must run directly on the root enigma cluster because it has to serve DNS via a MetalLB `LoadBalancer` IP reachable from the VLAN, and it relies on watching cluster-scoped Ingress/Service resources on that cluster.

Stakeholders: whoever manages DNS on the home network (clients on the VLAN point to `192.168.50.2`), Flux/ArgoCD (deploys the chart), MetalLB (assigns the LB IP), and operators removing the Pi-hole appliance.

## Goals / Non-Goals

**Goals:**
- Serve authoritative DNS for Ingress-exposed hostnames on the internal VLAN from inside the enigma cluster via `k8s_gateway`.
- Deliver the chart declaratively through the existing ArgoCD `applicationset-prod` pipeline with `cluster: enigma` (root cluster), using the umbrella-chart + vendored-chart pattern already established by `apps/secrets-proxy/*`.
- Retire the Pi-hole-specific `external-dns` HelmRelease and the Pi-hole appliance as the internal resolver.
- Keep infrastructure reproducible: the upstream chart is pinned and vendored via `vendir`.

**Non-Goals:**
- Changing the Cloudflare-backed `external-dns` HelmRelease (`helmrelease-external-dns.yaml`). Public DNS keeps working as-is.
- Re-homing the Pi-hole as a DHCP server or ad-blocker. Those roles, if still wanted, are handled elsewhere and out of scope.
- Introducing a vCluster for DNS. This app is explicitly root-cluster only.
- Modifying the MetalLB address pool definitions beyond reserving one IP for DNS.
- Building a new openspec grouping `apps/cluster-networking-infra/`; the simpler proposal is a single `apps/cluster-networking/` with just `k8s-gateway` inside it.

## Decisions

### D1: Deploy `k8s_gateway` via ArgoCD, not Flux HelmRelease
**Decision**: Package as an umbrella Helm chart under `apps/cluster-networking/k8s-gateway/` with a `config.yaml` discovered by `apps/argocd-apps/manifests/applicationset-prod.yaml`.

**Why**: The user asked for the secrets-proxy pattern. That pattern is ArgoCD-driven. Keeping it consistent avoids mixing Flux HelmReleases (used today for cluster bootstrap infra in `apps/enigma-cluster/`) with ArgoCD for app-level DNS — the retired Pi-hole HelmRelease was Flux; its replacement moves up the stack into the ArgoCD-managed layer.

**Alternatives considered**:
- Add a `helmrelease-k8s-gateway.yaml` in `apps/enigma-cluster/`. Simpler but inconsistent with the requested pattern and with how application workloads are deployed in this repo.

### D2: Single `apps/cluster-networking/` grouping, no `-infra` sibling
**Decision**: Create only `apps/cluster-networking/k8s-gateway/`. Do not create `apps/cluster-networking-infra/`.

**Why**: `-infra` siblings exist in `apps/secrets-proxy-infra/` to host a vCluster + tenant + namespace for a nested environment. `k8s_gateway` runs in the root cluster and owns one namespace only; there is no vCluster to bootstrap and no tenant/namespace orchestration that requires a separate grouping.

### D3: Target root cluster `cluster: enigma` (not a vCluster)
**Decision**: `config.yaml` sets `cluster: enigma`, `createNamespace: true`, `namespace: <k8s-gateway-ns>`.

**Why**: `k8s_gateway` must watch cluster-scoped resources (Ingress, Service) on the enigma cluster and requires a MetalLB LoadBalancer on the `192.168.50.0/24` VLAN — both are root-cluster concerns. The `applicationset-prod.yaml` template uses `destination.name: "{{.cluster}}"`, so `enigma` must be registered as an ArgoCD destination; it already is (other apps use it).

### D4: Vendor the upstream chart through `third_party/vendir/vendir.yml`
**Decision**: Add a `charts/k8s-gateway` entry to `vendir.yml` pointing at the official k8s-gateway Helm repository, and reference it from the umbrella chart via `file://../../../third_party/vendir/charts/k8s-gateway`.

**Why**: Every other Helm chart in the repo is vendored for reproducibility and to avoid runtime network pulls from ArgoCD. Using `vendir` keeps the update workflow identical (`vendir sync` → commit). Chart version must be pinned (per `CLAUDE.md` dependency-pinning rules) and updated by Renovate.

**Alternatives considered**:
- ArgoCD pulling the chart directly from the upstream Helm repo at sync time. Rejected: breaks the repo's vendoring convention and introduces a network dependency during sync.

### D5: DNS service exposure via MetalLB LoadBalancer
**Decision**: Configure the `k8s-gateway` Service as `type: LoadBalancer` with an annotation requesting a specific IP from the existing MetalLB pool (defined in `apps/enigma-cluster/metallb-ip-address-pool.yml`). Target UDP/TCP 53.

**Why**: Clients on the VLAN need a stable, routable DNS endpoint. Reusing MetalLB (already in the cluster) avoids new infra. Pinning the IP (preferably `192.168.50.2` once Pi-hole is decommissioned, else a new address in the internal pool) minimizes client reconfiguration.

**Alternatives considered**:
- `NodePort`: requires clients to know a node IP + nonstandard port — unfriendly for DHCP-pushed DNS settings.
- `hostNetwork`: pins DNS to a specific node and defeats HA; rejected.

### D6: Cutover sequence: add → verify → remove
**Decision**: Land the `k8s-gateway` chart first, verify resolution works against the new service IP, then remove `helmrelease-external-dns-pihole.yaml` in a follow-up step (same PR, sequenced in `tasks.md`). Router DNS repointing is an out-of-band step but documented.

**Why**: Keeps DNS working throughout. Removing the Pi-hole HelmRelease before clients are pointed away would break internal name resolution.

## Risks / Trade-offs

- [IP-address collision] → Pi-hole currently holds `192.168.50.2`. Plan: decommission Pi-hole before MetalLB claims that IP, or assign `k8s-gateway` a new address and repoint clients first.
- [Chart misconfiguration causes empty responses] → Deploy first with `kubectl port-forward` / internal ClusterIP smoke test (`dig @<clusterIP> <known-ingress-host>`) before exposing via MetalLB and flipping clients.
- [Ingress watch scope] → `k8s_gateway` by default watches Ingress only. If any internal records were served via Services/HTTPRoutes on Pi-hole, enable the corresponding resource kinds in `values.yaml`; otherwise some lookups will silently fail.
- [Loss of ad-blocking if Pi-hole was doing more than DNS] → `k8s_gateway` is not an ad-blocker. If that feature was relied on, it is dropped by this change (explicit non-goal; call it out in the PR description).
- [ArgoCD can't reach the Helm chart path] → `Chart.lock` must be committed and the `file://` relative path must resolve from the umbrella-chart directory (same pattern as `apps/secrets-proxy/onepassword-operator/Chart.yaml`).
- [Cluster destination `enigma` not registered] → verify with `argocd cluster list` before sync; other apps already target it, so this is low risk but worth confirming.

## Migration Plan

1. Vendor the chart: add `third_party/vendir/vendir.yml` entry, run `vendir sync`, commit `third_party/vendir/charts/k8s-gateway/` and `vendir.lock.yml`.
2. Create `apps/cluster-networking/k8s-gateway/` umbrella chart (`Chart.yaml`, `Chart.lock`, `values.yaml`, `values-prod.yaml`, `config.yaml`) and `apps/cluster-networking/moon.yml`.
3. Merge; let ArgoCD create the Application. Verify pod health, Service LB IP assignment, and resolution (`dig @<new-ip>` for a known ingress hostname).
4. Repoint router/DHCP upstream DNS from `192.168.50.2` (Pi-hole) to the `k8s_gateway` LB IP. Flush DNS caches on critical clients.
5. Remove `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` and its entry in `apps/enigma-cluster/kustomization.yaml`. Confirm Flux prunes the HelmRelease cleanly.
6. Decommission the Pi-hole appliance and archive/remove the `external-dns-pihole-credential` 1Password reference.

**Rollback**: Re-point DHCP back at `192.168.50.2` and re-add the Pi-hole HelmRelease (revert the deletion commit). Pi-hole stays reachable until step 6.

## Open Questions

- Which IP on the `192.168.50.0/24` MetalLB pool should `k8s-gateway` claim — reuse `192.168.50.2` after Pi-hole is decommissioned, or take a new IP and leave `.2` free?
- Exact target namespace name (e.g., `k8s-gateway`, `cluster-networking`, or `dns`)?
- Does the existing internal DNS usage rely on any record kinds beyond Ingress (e.g., Service A records) that must be enabled in `values.yaml`?
- Upstream chart version to pin (must be resolved against the k8s-gateway Helm repo at implementation time).
