## Why

The cluster currently resolves internal DNS names by syncing ingresses from the enigma cluster into a standalone Pi-hole instance at `192.168.50.2` via `external-dns` with the Pi-hole provider. This Pi-hole lives outside the Kubernetes cluster, is manually maintained, depends on Pi-hole's API, and adds operational overhead (credential rotation, TLS skip-verify, HelmRelease `external-dns-pihole`). Replacing it with [`k8s_gateway`](https://github.com/k8s-gateway/k8s_gateway) running inside the enigma cluster lets Kubernetes answer DNS queries directly from its own API resources (Ingresses, Services, HTTPRoutes), eliminates the external appliance, and removes the need for a second `external-dns` instance.

## What Changes

- Add a new `apps/cluster-networking/` grouping that deploys `k8s-gateway` as an umbrella Helm chart via ArgoCD to the root enigma cluster (not inside a vCluster) following the `apps/secrets-proxy` + `apps/secrets-proxy-infra` pattern.
- Vendorize the upstream `k8s-gateway` Helm chart into `third_party/vendir/charts/k8s-gateway` via `vendir.yml` alongside existing charts (e.g., `external-dns`, `ingress-nginx`).
- Configure `k8s-gateway` to watch Ingress resources (and any other required resource kinds) in the enigma cluster and answer DNS queries from a MetalLB-exposed ClusterIP/LoadBalancer so it can replace the Pi-hole DNS endpoint at `192.168.50.2`.
- **BREAKING** Remove `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml` and its entry in `apps/enigma-cluster/kustomization.yaml`; retire the Pi-hole provider, its 1Password credential reference (`external-dns-pihole-credential`), and the `--pihole-*` args.
- Update DNS clients on the `192.168.50.0/24` VLAN to point at the new `k8s-gateway` service IP instead of `192.168.50.2` (out-of-band network change, documented in tasks).

## Capabilities

### New Capabilities
- `cluster-networking-dns`: In-cluster authoritative DNS resolver (`k8s_gateway`) that serves records derived from Kubernetes Ingress/Service resources on the enigma root cluster, replacing the external Pi-hole appliance for internal network name resolution.

### Modified Capabilities
<!-- No existing openspec specs to modify; Pi-hole was never captured in a spec, so its removal is handled via the proposal/impact + tasks.md rather than a delta spec. -->

## Impact

- **New code**:
  - `apps/cluster-networking/k8s-gateway/` (umbrella Helm chart: `Chart.yaml`, `Chart.lock`, `values.yaml`, `values-prod.yaml`, `config.yaml`).
  - `apps/cluster-networking/moon.yml` (project registration).
  - `third_party/vendir/vendir.yml` entry + `third_party/vendir/charts/k8s-gateway/` vendored chart.
- **Removed code**:
  - `apps/enigma-cluster/helmrelease-external-dns-pihole.yaml`.
  - `helmrelease-external-dns-pihole.yaml` entry in `apps/enigma-cluster/kustomization.yaml`.
- **ArgoCD / ApplicationSet**: Auto-discovered via `apps/cluster-networking/k8s-gateway/config.yaml` by `applicationset-prod.yaml` (scans `apps/*/*/config.yaml`). Targets the root enigma cluster (`cluster: enigma`), not a vCluster.
- **Networking / Infra**:
  - MetalLB IP reservation required for the `k8s-gateway` DNS service on the `192.168.50.0/24` VLAN (likely reusing `192.168.50.2` or a new address from the internal pool).
  - DHCP / router upstream DNS config must be repointed to the new address.
- **Dependencies / secrets**: `external-dns-pihole-credential` (1Password-backed) becomes unused; the remaining Cloudflare-backed `external-dns` HelmRelease is unaffected.
- **Operations**: One fewer external appliance to patch; reconciliation fully declarative through ArgoCD.
