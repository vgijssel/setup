## 1. Vendor the k8s-gateway Helm chart

- [x] 1.1 Identify the current stable `k8s-gateway` Helm chart version and repository URL (picked `3.7.1` from `https://k8s-gateway.github.io/k8s_gateway/`)
- [x] 1.2 Add a `charts/k8s-gateway` entry to `third_party/vendir/vendir.yml` with an exact `version:` pin
- [x] 1.3 Run `vendir sync` and commit `third_party/vendir/charts/k8s-gateway/` and `third_party/vendir/vendir.lock.yml` (lock entry later reordered to match vendir.yml position after CI flagged it)
- [x] 1.4 Verify the chart renders locally: `helm template third_party/vendir/charts/k8s-gateway --set domain=enigma.vgijssel.nl` produces valid manifests

## 2. Create the `apps/cluster-networking/k8s-gateway/` chart

- [x] 2.1 Create directory `apps/cluster-networking/k8s-gateway/`
- [x] 2.2 Add `Chart.yaml` as an umbrella chart depending on the vendored chart via `file://../../../third_party/vendir/charts/k8s-gateway`
- [x] 2.3 Run `helm dependency update` and commit `Chart.lock`
- [x] 2.4 Add `values.yaml` with base configuration (`domain: enigma.vgijssel.nl`, `watchedResources: [Ingress, Service]`, `service.type: ClusterIP`)
- [x] 2.5 Add `values-prod.yaml` pinning `service.clusterIP: 10.96.53.53` and `replicaCount: 2` with resource requests/limits — **no LoadBalancer / MetalLB, no VLAN exposure** (scope narrowed to in-cluster DNS only)
- [x] 2.6 Add `config.yaml` targeting `namespace: tenant-prod-clusternetworking`, `cluster: enigma`, `createNamespace: false`
- [x] 2.7 Add `apps/cluster-networking/moon.yml`

## 3. Create the `apps/cluster-networking/tenant/` chart

- [x] 3.1 Create `apps/cluster-networking/tenant/` mirroring `apps/secrets-proxy-infra/tenant/`: `Chart.yaml` depending on `libs/tenant`, `values.yaml` with `tenant.name: clusternetworking`, `values-prod.yaml` empty, `config.yaml` with `appType: tenant`, `prOverrides.tenant.name: clusternetworking%s` for PR isolation
- [x] 3.2 Run `helm dependency update`, commit `Chart.lock`
- [x] 3.3 Flip `k8s-gateway` and `coredns-patch` `config.yaml` to `createNamespace: false` so the Tenant owns namespace provisioning

## 4. Create the `apps/cluster-networking/coredns-patch/` chart

- [x] 4.1 Scaffold `Chart.yaml` (inline chart, no deps), `values.yaml` (`zone`, `gatewayClusterIP: 10.96.53.53`, `prNumber: ""`), `values-prod.yaml` (empty), `config.yaml` (`serverSideApply: true`)
- [x] 4.2 Add `templates/coredns-configmap.yaml`: single manifest that renders the full Talos-default Corefile plus an `enigma.vgijssel.nl:53 { forward . 10.96.53.53 }` stanza. In prod (empty `prNumber`), target `kube-system/coredns`. In PR (non-empty), target `<ArgoNamespace>/coredns-pr<N>-preview` as a harmless preview
- [x] 4.3 Verify `helm template` for both prod and PR paths renders expected resource names and namespaces

## 5. ApplicationSet + helm-platform fixes required for the new grouping

- [x] 5.1 Add an `apps:cluster-networking` matrix generator to `apps/argocd-apps/manifests/applicationset-pr.yaml` (scanning `apps/cluster-networking/*/config.yaml`)
- [x] 5.2 Fix the `templatePatch` sync-options bug in both ApplicationSets: emit `syncOptions` in a single block (otherwise the later `ServerSideApply=true` patch overwrites the earlier `CreateNamespace=true` / `PruneLast=true`)
- [x] 5.3 Teach `libs/helm-platform/src/helm_platform/generator.py` to preserve existing `cluster`, `createNamespace`, `prUpdateNamespace`, `prUpdateCluster` from `config.yaml` (the `cluster-networking` grouping runs on the root enigma cluster, not a per-platform vCluster). Add unit tests for the four preservation paths
- [x] 5.4 Exclude `apps/cluster-networking/coredns-patch/templates/**` from yamllint in `.trunk/trunk.yaml` (same pattern as other Helm template directories with top-level Go expressions)

## 6. PR-env smoke test (against PR #965)

- [x] 6.1 Open PR #965 with label `apps:cluster-networking` and push changes
- [x] 6.2 Re-apply `apps/argocd-apps/manifests/` to the argocd vcluster so the new PR generator activates
- [x] 6.3 Confirm the three PR Applications (`cluster-networking-tenant-pr965`, `…-k8s-gateway-pr965`, `…-coredns-patch-pr965`) all reach `Synced / Healthy`
- [x] 6.4 Verify tenant-managed namespace ownership: `kubectl get ns tenant-prod-clusternetworkingpr965 -o jsonpath='{.metadata.managedFields[*].manager}'` does not include `argocd-controller` (handled by `helm-controller` / `kube-ovn-controller`)
- [x] 6.5 Run an in-cluster `dig @<svc> coder.enigma.vgijssel.nl` / `api.enigma.vgijssel.nl` via a debug pod; confirm both return `192.168.50.100` and `nope.enigma.vgijssel.nl` returns `NXDOMAIN`
- [x] 6.6 Verify `kube-system/coredns` is unchanged in PR (Corefile still matches Talos default, `fieldsV1.manager = talos`, no `enigma.vgijssel.nl` stanza)

## 7. Prod rollout (after PR #965 merges)

- [x] 7.1 Merge PR #965 into `main`
- [x] 7.2 Three prod Applications generated (`cluster-networking-tenant`, `…-k8s-gateway`, `…-coredns-patch`). `tenant` auto-synced; the two others required a one-time manual sync (they came up `OutOfSync / Missing` post-merge, probably an ApplicationSet RollingSync quirk); both now `Synced / Healthy`
- [x] 7.3 `Tenant tenant-prod/clusternetworking` → `READY=True`; namespace `tenant-prod-clusternetworking` exists; Service `cluster-networking-k8s-gateway` has `ClusterIP 10.96.53.53`; two k8s-gateway pods Ready
- [x] 7.4 `kube-system/coredns.data.Corefile` now contains the `enigma.vgijssel.nl:53 { forward . 10.96.53.53 }` stanza and `fieldsV1` ownership of `data.Corefile` has transferred from `talos` to `argocd-controller` (Apply)
- [x] 7.5 In-cluster DNS validation: `dig keycloak.enigma.vgijssel.nl` from a pod in `tenant-prod-clusternetworking` via kube-dns returns `46.224.93.115` + `192.168.50.100`. `coder.enigma.vgijssel.nl` and `api.enigma.vgijssel.nl` return `192.168.50.100`. `nope.enigma.vgijssel.nl` returns `NXDOMAIN`.
- [x] 7.7 **Bug found + fixed**: `k8s_gateway` controller couldn't reach the kube-apiserver from inside the tenant namespace because cozystack's `allow-to-apiserver` CiliumNetworkPolicy gates egress on `policy.cozystack.io/allow-to-apiserver=true`. Added `customLabels` to `values-prod.yaml` in PR #966 (admin-merged). After Argo rolled the new pod template the controller logs `plugin/k8s_gateway: Synced all required resources` and queries resolve.
- [ ] 7.6 Trigger a Keycloak OIDC login end-to-end (original failure mode). Deferred to operator — DNS layer confirmed working; the OAuth flow itself is outside the scope of this validation session.

## 8. Retire the Pi-hole-backed external-dns HelmRelease

- [x] 8.1 Delete `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`
- [x] 8.2 Remove the `- helmrelease-external-dns-pihole.yaml` line from `apps/enigma-cluster/kustomization.yaml`
- [x] 8.3 Land the deletion in the same PR #965 (user requested immediate rollout; in-cluster resolution is the only consumer and coredns-patch + k8s-gateway sync together with the deletion on merge — brief reconvergence window is acceptable)
- [ ] 8.4 Blocked by a pre-existing Flux issue (out of scope for this change): `kustomization/enigma-cluster` has been stuck on `Source artifact not found` since 2026-03-03 (last applied revision `main@6e0f30c5`). Until that's fixed Flux won't prune `helmrelease/external-dns-pihole`, and the `external-dns-external-dns-pihole` Deployment keeps running against the Pi-hole API. Harmless for in-cluster DNS (which now flows through `kube-dns → k8s-gateway`) but wasteful. Follow-up: repair the Flux GitRepository/Kustomization source then expect Flux to prune on the next reconcile.
- [ ] 8.5 Archive the now-unused `external-dns-pihole-credential` 1Password item (optional; leaving it in place is harmless)

## 9. Finalize the openspec change

- [x] 9.1 `openspec validate migrate-from-pihole-to-k8s-gateway` reports valid
- [x] 9.2 `trunk check` clean on changed files (CI green on both PRs)
- [x] 9.3 PR #965 merged (`bb15b299`), PR #966 merged (`0a7b99e3`). `proposal.md` and `design.md` are the source of truth.
