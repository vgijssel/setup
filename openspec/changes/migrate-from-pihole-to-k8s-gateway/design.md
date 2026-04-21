## Context

The only consumer of the Pi-hole-backed `external-dns` HelmRelease turned out to be Kubernetes workloads that needed to resolve `*.enigma.vgijssel.nl` (most visibly Keycloak, which validates OIDC redirect URIs by resolving the configured issuer hostname). VLAN clients never relied on those records. The Pi-hole integration (`apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`) was disproportionate for that need: it requires a standalone appliance at `192.168.50.2`, a 1Password-sourced credential, `--pihole-tls-skip-verify`, and a separate `external-dns` deployment configured with `provider: pihole`.

With `k8s_gateway` the same queries can be answered directly from in-cluster API objects (Ingress, Service type LoadBalancer, etc.), and `kube-dns` can forward the zone to it via a single CoreDNS stanza. No record syncing, no appliance.

Repo layout context (see `apps/CLAUDE.md`): ArgoCD ApplicationSets discover apps via `apps/*/*/config.yaml`. Umbrella Helm charts reference vendored dependencies under `third_party/vendir/charts/<name>` via `file://` paths. Namespaces are created by cozystack `Tenant` CRs (see `apps/secrets-proxy-infra/tenant`) rather than by individual apps.

Talos owns `kube-system/coredns` at bootstrap (`managedFields.manager = talos`). However, reading `internal/app/machined/pkg/controllers/k8s/manifest_apply.go@v1.12.6` confirms the controller is Create-only on existing resources — so a server-side-apply overlay owned by ArgoCD is stable across reconciles.

Stakeholders: Keycloak OIDC flows (primary consumer), any future workload that references `*.enigma.vgijssel.nl` from inside the cluster, Flux (which currently reconciles the soon-to-be-deleted Pi-hole HelmRelease), ArgoCD (new owner of the DNS stack).

## Goals / Non-Goals

**Goals:**
- Kubernetes workloads can resolve `*.enigma.vgijssel.nl` from inside the cluster, with answers derived from live Ingress/Service resources.
- Deliver the full DNS stack declaratively through ArgoCD (tenant → k8s-gateway → coredns-patch), following the existing `apps/secrets-proxy-infra/tenant` + `apps/secrets-proxy/*` pattern.
- Retire the Flux-managed Pi-hole `external-dns` HelmRelease and its 1Password credential.
- Keep the change narrow: no VLAN DNS behavior change, no DHCP/router changes, no MetalLB reservation.

**Non-Goals:**
- Touching the Cloudflare-backed `external-dns` (`helmrelease-external-dns.yaml`). Public DNS is out of scope.
- Exposing `k8s_gateway` on the VLAN (no MetalLB LoadBalancer, no UDP/53 on `192.168.50.x`).
- Decommissioning the Pi-hole appliance. It stays up; only the record-syncing integration goes away.
- Reconfiguring Talos node DNS, `/etc/resolv.conf`, or machine-config patches. Pods use `kube-dns`, which now has the forwarder.
- Introducing a vCluster for DNS. Runs on the root enigma cluster.

## Decisions

### D1: Deliver everything via ArgoCD, following the secrets-proxy-infra + secrets-proxy split
**Decision**: A single `apps/cluster-networking/` grouping holds three charts — `tenant/`, `k8s-gateway/`, `coredns-patch/`. ArgoCD's `applicationset-prod` discovers them; the `applicationset-pr` matrix generator `apps:cluster-networking` handles PR previews. Rolling-sync ordering (`tenant → infra → apps`) ensures the Tenant exists before the apps below it try to consume the namespace.

**Why**: Mirrors the pattern the repo already uses for secrets-proxy. Keeping tenant + apps in one grouping (instead of a `-infra` sibling) is fine because there's no vCluster here to justify the split.

**Alternatives considered**:
- Reuse Flux to ship these resources alongside `helmrelease-external-dns-pihole.yaml`. Rejected — inconsistent with the rest of the app-layer stack and harder to PR-preview.

### D2: `k8s-gateway` stays ClusterIP on a pinned IP (`10.96.53.53`)
**Decision**: `values-prod.yaml` sets `service.type: ClusterIP, clusterIP: 10.96.53.53`. No `LoadBalancer`, no MetalLB annotation.

**Why**: The only consumer is `kube-dns`. Pinning the ClusterIP means the CoreDNS `forward` stanza has a stable target (avoids the bootstrap fragility of a DNS-name target that kube-dns itself would have to resolve). PR envs default to a dynamic ClusterIP, so they can't collide with prod.

**Alternatives considered**:
- `LoadBalancer` with a MetalLB reservation. Rejected — we'd take ownership of a VLAN IP for no current consumer, complicating the Pi-hole overlap story.
- Reference the k8s-gateway Service by DNS name in the forwarder. Rejected — CoreDNS → kube-dns → CoreDNS introduces a self-referential bootstrap risk.

### D3: `coredns-patch` is a single-manifest Helm chart that SSA-overlays `kube-system/coredns`
**Decision**: `apps/cluster-networking/coredns-patch/templates/coredns-configmap.yaml` renders the full Corefile (Talos default + an `enigma.vgijssel.nl:53 { forward . 10.96.53.53 }` stanza) and Argo applies it with `ServerSideApply=true`. PR envs render `coredns-pr<N>-preview` in the PR namespace instead, so the real cluster DNS is untouched until merge.

**Why**: Talos's `cluster.coreDNS` struct in v1.12.6 only exposes `disabled` and `image` — no Corefile customization. Disabling Talos's bootstrap CoreDNS and shipping our own chart is heavier (full bundle, brief DNS outage on rebuild). SSA overlay on the existing ConfigMap is stable because Talos's ManifestApplyController at `v1.12.6/internal/app/machined/pkg/controllers/k8s/manifest_apply.go` is Create-only on existing resources.

**Alternatives considered**:
- Ship `coredns-custom` ConfigMap + Deployment patch (DigitalOcean-style). Rejected — three moving parts for a one-line forwarder.
- Replace the Corefile wholesale via Talos `inlineManifests`. Rejected — doesn't apply retroactively to a bootstrapped cluster, plus we'd own the full Corefile.

### D4: Namespaces come from a cozystack Tenant, not the apps
**Decision**: `apps/cluster-networking/tenant/` creates `Tenant clusternetworking` → `tenant-prod-clusternetworking` namespace. k8s-gateway and coredns-patch set `createNamespace: false` and target that namespace. PR envs override `tenant.name` to `clusternetworkingpr<N>` → `tenant-prod-clusternetworkingpr<N>` namespace.

**Why**: Matches `apps/secrets-proxy-infra/tenant`. Keeps namespace provisioning in a single owner and avoids two ArgoCD Apps fighting over the same Namespace resource.

### D5: Vendor `k8s-gateway` via vendir (pinned to `3.7.1`)
**Decision**: `third_party/vendir/vendir.yml` entry at `https://k8s-gateway.github.io/k8s_gateway/`, version `3.7.1`, referenced from the umbrella chart via `file://../../../third_party/vendir/charts/k8s-gateway`.

**Why**: Matches every other Helm chart in the repo; gives reproducible builds and lets Renovate bump versions.

### D6: Fix the ApplicationSet `templatePatch` syncOptions bug
**Decision**: Both `applicationset-prod.yaml` and `applicationset-pr.yaml` emit a single `spec.syncPolicy.syncOptions` block that includes `PruneLast=true` plus conditional `CreateNamespace=true` and `ServerSideApply=true`.

**Why**: The original templatePatch emitted two separate `syncOptions` arrays. ApplicationSet's merge semantics replace arrays wholesale, so the later block (`ServerSideApply=true`) silently dropped `CreateNamespace=true` and `PruneLast=true`. This caused sync failures the first time we enabled both flags. The fix is generic — benefits every existing app that uses both options.

### D7: Teach the `helm-platform` generator to preserve non-convention fields
**Decision**: `libs/helm-platform/src/helm_platform/generator.py` now preserves `cluster`, `createNamespace`, `prUpdateNamespace`, `prUpdateCluster` from existing `config.yaml` (joining `namespace`, `serverSideApply`, `prOverrides`, which already rode that path).

**Why**: The generator's convention (`cluster: <platform>-vcluster`, `prUpdateCluster: true`, `prUpdateNamespace: false`) is right for groupings that deploy to a vCluster. `cluster-networking` deploys to the root enigma cluster — the convention is wrong here. Preservation keeps the generator as a *template* rather than an *enforcer*, with no change to how vCluster groupings behave.

### D8: Delete the Pi-hole HelmRelease directly, no DHCP cutover
**Decision**: Remove `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` and the matching line in `kustomization.yaml`. Archive the `external-dns-pihole-credential` 1Password item. Leave the Pi-hole appliance in place; don't touch DHCP or router settings.

**Why**: Reread of the status quo (confirmed by the user) showed that no VLAN client depends on the synced records — only in-cluster workloads did, and they now get answers from `kube-dns → k8s_gateway`. So the HelmRelease has no remaining consumer; we can delete it immediately.

## Risks / Trade-offs

- [Baseline Corefile drift from Talos] → `coredns-patch` bakes in the Talos v1.12 default Corefile. On Talos upgrade, diff the default against our rendered Corefile and update. Low frequency, easy to catch in CI if needed.
- [Chart misconfiguration returns empty responses] → Covered by the PR ApplicationSet: every PR renders k8s-gateway and the coredns-patch preview in an isolated namespace; an in-cluster `dig` from a debug pod validates before merge.
- [Ingress watch scope] → `k8s_gateway` watches `Ingress` and `Service` (set in `values.yaml`). Resources beyond those (HTTPRoute, DNSEndpoint) would silently not resolve. Enable additional `watchedResources` when needed.
- [Talos retakes ownership of the Corefile on upgrade] → ManifestApplyController is Create-only; confirmed by reading the source. An `upgrade-talos` run won't overwrite it. If a future Talos version changes this behavior, the PR env would show drift on the next sync.
- [ArgoCD can't reach the Helm chart path] → `Chart.lock` files are committed for both umbrella charts; the `file://` path resolves relative to the umbrella dir. Verified via `helm template`.

## Migration Plan

1. Merge PR #965 to `main`. ArgoCD's `prod-apps-helm` ApplicationSet generates three new Applications (`cluster-networking-tenant`, `cluster-networking-k8s-gateway`, `cluster-networking-coredns-patch`) and syncs them in rolling order (tenant → apps).
2. Verify `kube-system/coredns` Corefile now contains the `enigma.vgijssel.nl:53` stanza and that `fieldsV1` ownership of `data.Corefile` has shifted to `argocd-controller`.
3. Validate end-to-end: a pod on the enigma cluster resolves `keycloak.enigma.vgijssel.nl` and gets the tenant-root ingress IP (`192.168.50.100`). Re-trigger a Keycloak OIDC flow to confirm the redirect validator succeeds.
4. Delete `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` and its entry in `apps/enigma-cluster/kustomization.yaml`. Confirm Flux prunes the old `external-dns-pihole` Deployment + its Secret.
5. Archive the `external-dns-pihole-credential` 1Password item (optional; leaving it in place is also fine).

**Rollback**: re-add the HelmRelease + kustomization entry from the revert commit. The Pi-hole appliance kept running throughout, so `external-dns` would resume syncing records within a reconcile interval. Separately, remove the coredns-patch Application in ArgoCD to take the in-cluster forwarder out of the picture.
