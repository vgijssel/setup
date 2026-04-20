## 1. Vendor the k8s-gateway Helm chart

- [ ] 1.1 Identify the current stable `k8s-gateway` Helm chart version and repository URL from https://github.com/k8s-gateway/k8s_gateway
- [ ] 1.2 Add a `charts/k8s-gateway` entry to `third_party/vendir/vendir.yml` with an **exact** `version:` pin (no `~>` or `^`) and the correct `repository.url`
- [ ] 1.3 Run `vendir sync` and commit `third_party/vendir/charts/k8s-gateway/` and the updated `third_party/vendir/vendir.lock.yml`
- [ ] 1.4 Verify the chart renders locally: `helm template third_party/vendir/charts/k8s-gateway` produces valid manifests

## 2. Create the `apps/cluster-networking/` grouping

- [ ] 2.1 Create directory `apps/cluster-networking/k8s-gateway/`
- [ ] 2.2 Add `apps/cluster-networking/k8s-gateway/Chart.yaml` as an umbrella chart that depends on the vendored chart via `file://../../../third_party/vendir/charts/k8s-gateway` (mirror `apps/secrets-proxy/onepassword-operator/Chart.yaml`)
- [ ] 2.3 Run `helm dependency update apps/cluster-networking/k8s-gateway` and commit the resulting `Chart.lock`
- [ ] 2.4 Add `apps/cluster-networking/k8s-gateway/values.yaml` with base configuration (watched resource kinds, DNS zone, log level)
- [ ] 2.5 Add `apps/cluster-networking/k8s-gateway/values-prod.yaml` with production overrides (Service `type: LoadBalancer`, MetalLB IP annotation, resource requests/limits)
- [ ] 2.6 Add `apps/cluster-networking/k8s-gateway/config.yaml` with `appType: apps`, `appName: k8s-gateway`, `platform: cluster-networking`, `cluster: enigma`, the target `namespace:`, and `createNamespace: true`
- [ ] 2.7 Add `apps/cluster-networking/moon.yml` registering the project (match the style of existing `apps/*/moon.yml` files)

## 3. Resolve open configuration questions before merging

- [ ] 3.1 Decide the target namespace (e.g., `k8s-gateway` vs `dns`) and reflect it in `config.yaml` + `values*.yaml`
- [ ] 3.2 Decide whether to reuse `192.168.50.2` or claim a new internal MetalLB IP; record the choice in `values-prod.yaml` via a MetalLB loadBalancerIP / `metallb.io/loadBalancerIPs` annotation
- [ ] 3.3 Confirm that the existing internal-VLAN MetalLB pool (`apps/enigma-cluster/metallb-ip-address-pool.yml`) includes the chosen IP; update the pool if not
- [ ] 3.4 Enumerate the resource kinds `k8s_gateway` must watch (Ingress is required; also Service/HTTPRoute if internal clients rely on them) and enable them in `values.yaml`

## 4. Smoke-test before cutover

- [ ] 4.1 Merge the `apps/cluster-networking/` + vendored chart commit on a branch targeting the enigma cluster
- [ ] 4.2 Confirm ArgoCD creates the `cluster-networking-k8s-gateway` Application and syncs to Healthy
- [ ] 4.3 Verify the Service has a MetalLB-assigned LB IP: `kubectl -n <ns> get svc`
- [ ] 4.4 From a VLAN client, resolve a known internal ingress hostname against the new LB IP with `dig @<lb-ip> <hostname>` and confirm the expected A record is returned
- [ ] 4.5 Confirm a non-existent hostname returns `NXDOMAIN` (or expected upstream delegation)

## 5. Cutover DNS clients

- [ ] 5.1 Repoint the router/DHCP upstream DNS from `192.168.50.2` (Pi-hole) to the `k8s-gateway` LB IP
- [ ] 5.2 Flush DNS caches on critical clients and verify resolution still works for representative internal hostnames
- [ ] 5.3 Monitor `k8s-gateway` pod logs for resolver errors during the first 24h

## 6. Retire Pi-hole integration

- [ ] 6.1 Delete `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`
- [ ] 6.2 Remove the `- helmrelease-external-dns-pihole.yaml` line from `apps/enigma-cluster/kustomization.yaml`
- [ ] 6.3 Confirm Flux prunes the `external-dns-pihole` HelmRelease and its Deployment/Pods in the `external-dns` namespace
- [ ] 6.4 Remove or archive the unused `external-dns-pihole-credential` 1Password item / secret reference
- [ ] 6.5 Decommission the Pi-hole appliance at `192.168.50.2` (power off, remove from inventory); if its IP is being reused by `k8s-gateway`, do this **before** MetalLB claims the address
- [ ] 6.6 Update any documentation that still references `192.168.50.2` as the internal DNS server

## 7. Validate and finalize the openspec change

- [ ] 7.1 Run `openspec status --change migrate-from-pihole-to-k8s-gateway` and confirm all artifacts are `done`
- [ ] 7.2 Run `trunk check` and `trunk fmt` on the changed files
- [ ] 7.3 Open a PR summarizing the change, cutover sequence, and rollback plan (reference this change's `proposal.md` and `design.md`)
