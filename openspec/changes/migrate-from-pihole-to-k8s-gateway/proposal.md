## Why

The standalone Pi-hole appliance at `192.168.50.2` is fed ingress records by an `external-dns` HelmRelease (`apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`) so that **Kubernetes workloads** (notably Keycloak during OIDC redirect validation) can resolve `*.enigma.vgijssel.nl` names. VLAN clients don't rely on those records. Running a standalone appliance + a Pi-hole-specific `external-dns` + a 1Password-sourced credential + `--pihole-tls-skip-verify` just to feed a handful of in-cluster DNS lookups is disproportionate. Replacing it with [`k8s_gateway`](https://github.com/k8s-gateway/k8s_gateway) (in-cluster), wired into `kube-dns` via a zone forwarder, means Kubernetes answers those queries directly from its own API objects — no external appliance, no record-syncing dance, no credential to rotate.

## What Changes

- Add a new `apps/cluster-networking/` grouping with three charts:
  - `tenant/` — a cozystack `Tenant` CR named `clusternetworking` that creates the `tenant-prod-clusternetworking` namespace (no self-managed namespaces).
  - `k8s-gateway/` — the upstream `k8s-gateway` chart, as `ClusterIP` only, on a pinned `10.96.53.53`. It answers `*.enigma.vgijssel.nl` from in-cluster Ingress/Service resources.
  - `coredns-patch/` — a tiny inline chart that SSA-overlays `kube-system/coredns`'s `data.Corefile` to add a zone stanza forwarding `enigma.vgijssel.nl` to `10.96.53.53`. PR envs render a harmless sibling ConfigMap instead.
- Vendor the upstream `k8s-gateway` Helm chart into `third_party/vendir/charts/k8s-gateway` via `vendir`.
- Teach `libs/helm-platform`'s generator to preserve `cluster`, `createNamespace`, `prUpdateNamespace`, `prUpdateCluster` from existing `config.yaml` (the `cluster-networking` grouping deploys to the root enigma cluster, not a per-platform vCluster).
- Fix the `applicationset-prod.yaml` / `applicationset-pr.yaml` `templatePatch` bug that dropped sync options when multiple flags were true (each block replaced the `syncOptions` array wholesale).
- **BREAKING (internal only):** remove `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` and its entry in `kustomization.yaml`; the Pi-hole provider and its 1Password credential become unused. Pi-hole VLAN clients are unaffected (they never depended on the synced records). **No DHCP / router changes needed.**

## Capabilities

### New Capabilities
- `cluster-networking-dns`: Intra-cluster authoritative DNS for `*.enigma.vgijssel.nl` served by `k8s_gateway` on the enigma root cluster, wired into `kube-dns` via a CoreDNS zone forwarder, enabling Kubernetes workloads (notably Keycloak OIDC) to resolve ingress hostnames without an external appliance.

### Modified Capabilities
<!-- No existing openspec specs to modify; Pi-hole was never captured in a spec, so its removal is handled via impact + tasks.md rather than a delta spec. -->

## Impact

- **New code**:
  - `apps/cluster-networking/tenant/` (tenant chart: `Chart.yaml`, `Chart.lock`, `values.yaml`, `values-prod.yaml`, `config.yaml`).
  - `apps/cluster-networking/k8s-gateway/` (umbrella chart over vendored `k8s-gateway`).
  - `apps/cluster-networking/coredns-patch/` (single-manifest chart that SSA-overlays `kube-system/coredns`).
  - `apps/cluster-networking/moon.yml`.
  - `third_party/vendir/vendir.yml` entry + `third_party/vendir/charts/k8s-gateway/` vendored chart.
- **Modified code**:
  - `libs/helm-platform/src/helm_platform/generator.py` + tests (preserve cluster/prUpdate* fields).
  - `apps/argocd-apps/manifests/applicationset-prod.yaml` + `applicationset-pr.yaml` (merge sync-options correctly; add `apps:cluster-networking` PR generator).
  - `.trunk/trunk.yaml` (ignore yamllint for the new template).
- **Removed code**:
  - `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`.
  - `helmrelease-external-dns-pihole.yaml` entry in `apps/enigma-cluster/kustomization.yaml`.
- **ArgoCD / ApplicationSet**: discovery via `apps/cluster-networking/*/config.yaml` (prod ApplicationSet, plus PR generator gated on the `apps:cluster-networking` label). Destination: root enigma cluster, `tenant-prod-clusternetworking` namespace (created by the Tenant).
- **Networking / Infra**: **no MetalLB changes, no DHCP changes.** The `k8s-gateway` Service stays ClusterIP (`10.96.53.53`, pinned) — only kube-dns talks to it.
- **Dependencies / secrets**: `external-dns-pihole-credential` (1Password) becomes unused and can be retired. The Cloudflare-backed `external-dns` HelmRelease is unchanged. Pi-hole appliance stays up for whatever VLAN role it still serves.
- **Operations**: one fewer HelmRelease, one fewer 1Password credential, fully declarative.
