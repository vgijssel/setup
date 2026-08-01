# Spec: Shared `netbird-reverse-proxy` platform chart + expose PiKVM at `https://pikvm.network.vgijssel.nl`

Status: **DRAFT — awaiting review**
Branch: `mg/feat/expose-pikvm-ui`
Owner: maarten@hackerone.com

> This SPEC currently sits in the network bundle dir; on implementation it moves to
> `apps/platform/netbird-reverse-proxy/SPEC.md` (the chart it primarily describes).

---

## Objective

**What & why.** The PiKVM device (`apps/pikvm`) is reachable by macOS at
`https://192.168.10.2` and over the NetBird mesh at its peer IP, but **only with a
self-signed certificate** — every visit throws a TLS warning. We want the PiKVM web UI
served at a stable, publicly-trusted name, reachable **only over the NetBird mesh**,
exactly the way OpenBao is served at `https://openbao.secret.vgijssel.nl`.

While doing so we **factor the reusable parts of the BYOP reverse proxy into a single
Helm chart** at `apps/platform/netbird-reverse-proxy`, and keep the **genuinely
cluster-specific parts as their own per-cluster workspace**:

- **Shared chart (generic, parameterized by `domain`):**
  1. Kubernetes manifests for the NetBird reverse proxy — deployment (via the vendored
     subchart), TLS cert, ESO proxy-token, self-heal watchdog + RBAC.
  2. The Crossplane `provider-opentofu` code that **links the proxy into Cloudflare** —
     registers the reverse-proxy `domain` and its `*.<domain>` CNAME.
- **Per-cluster services workspace (NOT in the chart):** the actual upstreams each proxy
  fronts (`POST /api/reverse-proxies/services`). OpenBao and PiKVM differ in target type,
  protocol, options, and access groups, so each cluster hand-authors its own workspace.

The shared chart is **included by two thin per-cluster bundles** — `apps/secret/src/
netbird-reverse-proxy` (OpenBao) and `apps/network/src/netbird-reverse-proxy` (PiKVM) —
each **parameterized through `helm.values` in its own `fleet.yaml`**.

**Success looks like:**
1. From a `homelab` NetBird client peer, `https://pikvm.network.vgijssel.nl` loads the
   PiKVM UI with a **valid Let's Encrypt cert — no warning**, and is **unreachable from a
   non-mesh client**.
2. The proxy deployment + Cloudflare linking is **one chart** consumed by both clusters;
   each cluster's service definitions live in a small, readable, cluster-local workspace.

**Users.** The homelab operator and their NetBird client peers (`homelab` group).

**Non-goals.**
- Not changing how PiKVM serves TLS on the box (keeps self-signed `:443`; proxy
  terminates the trusted cert upstream).
- Not removing the `pikvm.enigma.vgijssel.nl` ingress — kept as an upload fallback (Risks).
- Not exposing PiKVM's raw/non-HTTPS ports.
- Not genericizing service definitions into a shared value — they stay per-cluster.

---

## Decisions (locked with the user)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Chart layout | **One reusable chart `apps/platform/netbird-reverse-proxy`** = proxy k8s manifests **+** Cloudflare/domain linking (parameterized by `domain`). No `fleet.yaml` there → not deployed standalone. |
| 2 | Services split | **The per-service registration (`/api/reverse-proxies/services`) is a separate per-cluster Crossplane workspace**, NOT in the chart — OpenBao and PiKVM are structurally different. |
| 3 | Consumption | **Included by both** `apps/secret/src/netbird-reverse-proxy` and `apps/network/src/netbird-reverse-proxy`, each a thin bundle referencing the shared chart. |
| 4 | Parameterization | Per-cluster values (`domain`, `tokenKvPath`) live in each bundle's `fleet.yaml`. |
| 5 | Domain for PiKVM | `network` bundle → `domain: network.vgijssel.nl`, service `pikvm.network.vgijssel.nl`. |
| 6 | Upstream target | **PiKVM NetBird peer `:443`**, `protocol: https`, `options.skip_tls_verify: true`, `target_type: peer`. |
| 7 | Access scope | **`homelab` group only** (`private: true`, mesh-only). |

---

## Architecture

```
apps/platform/netbird-reverse-proxy/        ← ONE chart (no fleet.yaml; a library)
  templates/  k8s: certificate, externalsecret-proxy-token, cronjob-watchdog, sa+rbac
              crossplane: workspace-reverse-proxy-domain (opentofu: cloudflare CNAME +
                          netbird_reverse_proxy_domain, parameterized by .Values.domain)
  Chart.yaml  dep → third_party/vendir/charts/netbird-reverse-proxy (0.1.0)
  values.yaml parameters: domain, tokenKvPath (+ subchart proxy/tls/securityContext)

        ▲ file:// dep                                   ▲ file:// dep
        │                                               │
apps/secret/src/netbird-reverse-proxy/          apps/network/src/netbird-reverse-proxy/
  fleet.yaml  helm.values:                        fleet.yaml  helm.values:
    domain: secret.vgijssel.nl                      domain: network.vgijssel.nl
    tokenKvPath: secret-netbird-proxy               tokenKvPath: network-netbird-pikvm-proxy
  Chart.yaml  dep → platform chart                Chart.yaml  dep → platform chart

apps/secret/src/cloudflare-config/              apps/network/src/cloudflare-config/
  workspace-reverse-proxy-services.yaml           workspace-reverse-proxy-services.yaml   ← NEW
    (OpenBao: target_type=cluster,                  (PiKVM: target_type=peer,
     svc:8200 http, direct_upstream,                 peer:443 https, skip_tls_verify,
     access_groups homelab/network/network-k8s)      access_groups homelab)
        │                                               │
        ▼ proxy → openbao.secret.vgijssel.nl           ▼ proxy → pikvm.network.vgijssel.nl

macOS (homelab) ──https──► NetBird mesh ──► matching cluster's proxy
   • VALID *.<domain> LE cert   • private:true (no interstitial)   • access_groups:[homelab]
```

NetBird routes a private service through the cluster whose registered reverse-proxy
domain is the **most-specific parent** of the service domain, so
`pikvm.network.vgijssel.nl` → network proxy, `openbao.secret.vgijssel.nl` → secret proxy.

### Why the split is clean

- **Chart (shared):** everything that is byte-identical modulo one string (`domain`) —
  the proxy workload, its cert, its token wiring, its watchdog, and the one-liner that
  tells Cloudflare/NetBird "this proxy owns `*.<domain>`".
- **Services workspace (per-cluster):** the upstream map, which is *different in kind*
  between clusters (a cluster ClusterIP over `direct_upstream` vs. a mesh peer with
  `skip_tls_verify`). Hand-authored HCL per cluster reads better than a value contract
  trying to cover both. OpenBao's existing workspace **stays put** (no migration);
  PiKVM's is a new sibling on the network cluster.

### Bundle discovery (why the layout is safe)

`bin/fleet-apply` runs `find apps -type f -name fleet.yaml`; a Bundle exists only where a
`fleet.yaml` exists, named `<group>-<component>`. The shared chart has **no** `fleet.yaml`,
so it is pulled in only as a `file://` Helm dependency of the two thin bundles. `fleet
apply` runs with CWD = repo root, which is how existing bundles resolve `file://` deps
against `third_party/vendir/charts`.

### Values contract (chart)

```yaml
# rendered from each bundle's fleet.yaml helm.values
domain: secret.vgijssel.nl          # proxy.domain + cert SAN *.<domain> + NB reverse-proxy domain + CNAME
tokenKvPath: secret-netbird-proxy   # OpenBao KV path → ESO netbird-proxy-token#token
# network bundle: domain=network.vgijssel.nl, tokenKvPath=network-netbird-pikvm-proxy
```

### Prerequisites reused (referenced, not recreated)

Each cluster's `cloudflare-config`/`config` bundles already provide the `crossplane-system`
secrets (`netbird-mgmt-api-token`, `cloudflare-credentials`), the opentofu `ProviderConfig`,
ESO `ClusterSecretStore/openbao`, and (shared) `letsencrypt-prod`. Both the chart's
domain workspace and the per-cluster services workspace reference these by name (via
`dependsOn` on `cloudflare-config`). `netbird-operator` `v0.7.0` + the vendored chart stay shared.

---

## Tech Stack

- **Chart:** first-party umbrella `apps/platform/netbird-reverse-proxy` (pinned `version`),
  dep on vendored `netbird-reverse-proxy` `0.1.0` (image `netbirdio/reverse-proxy:0.72.4`).
- **Crossplane:** `provider-opentofu` inline HCL; providers `netbirdio/netbird ~> 0.0.9`,
  `Mastercard/restapi 3.0.0`, `cloudflare/cloudflare ~> 5.0`.
- **Certs:** cert-manager `Certificate` → `letsencrypt-prod` (Cloudflare DNS-01).
- **Secrets:** OpenBao KV v2 via per-cluster ESO `ClusterSecretStore/openbao`.
- **GitOps:** Fleet; two single-cluster bundles gating on `cluster.vgijssel.nl/name`.
- **NetBird operator:** `v0.7.0` (pinned).
- **Device config:** pyinfra (`apps/pikvm`) — touched only if goss contract extended.

---

## Commands

```bash
moon project platform            # discover tasks
bin/help

# One-time: mint network BYOP proxy token → OpenBao (clone of
# apps/secret/scripts/put_netbird_proxy_auth.sh → kv/network-netbird-pikvm-proxy#token)
moon run <cluster>:put_netbird_pikvm_proxy_auth     # exact id TBD in Plan

kubectl config current-context   # MUST be the intended cluster before apply
bin/fleet-apply

trunk fmt && trunk check
moon run pikvm:apply -- --dry    # only if goss contract changes
```

---

## Project Structure

```
apps/platform/netbird-reverse-proxy/                 # NEW shared chart (NO fleet.yaml)
  Chart.yaml                                          # dep → vendored netbird-reverse-proxy 0.1.0
  values.yaml                                         # params: domain, tokenKvPath (+ subchart)
  templates/
    certificate-netbird-reverse-proxy.yaml            # dnsNames: ["*.{{ .Values.domain }}"]
    externalsecret-netbird-proxy-token.yaml           # remoteRef.key: {{ .Values.tokenKvPath }}
    cronjob-watchdog.yaml                             # identical logic
    serviceaccount-watchdog.yaml                      # identical RBAC
    workspace-reverse-proxy-domain.yaml               # Crossplane opentofu: cloudflare CNAME +
                                                      #   netbird_reverse_proxy_domain({{ .Values.domain }})

apps/secret/src/netbird-reverse-proxy/               # THIN bundle (replaces current full one)
  Chart.yaml                                          # dep → file://../../../platform/netbird-reverse-proxy
  fleet.yaml                                          # helm.values: domain, tokenKvPath (OpenBao)

apps/network/src/netbird-reverse-proxy/              # THIN bundle (dir currently stale .tgz only)
  Chart.yaml                                          # dep → file://../../../platform/netbird-reverse-proxy
  fleet.yaml                                          # helm.values: domain, tokenKvPath (PiKVM)

apps/secret/src/cloudflare-config/
  workspace-reverse-proxy-services.yaml               # STAYS (OpenBao service; unchanged)
apps/network/src/cloudflare-config/
  workspace-reverse-proxy-services.yaml               # NEW (PiKVM service: peer:443 https skip_tls_verify)

# MIGRATED into the shared chart:
apps/secret/src/netbird-reverse-proxy/templates/*     # proxy k8s manifests → chart templates
apps/secret/src/cloudflare-config/workspace-reverse-proxy-dns-secret.yaml  # domain link → chart template

apps/{secret|network}/scripts/put_netbird_pikvm_proxy_auth.sh   # NEW token-mint helper (network)
apps/pikvm/files/goss.yaml                            # OPTIONAL assert
```

OpenBao token path for PiKVM: `kv/network-netbird-pikvm-proxy#token` (confirm `network-eso`
read policy covers it — Plan).

---

## Code Style

Thin bundle = `Chart.yaml` (single `file://` dep on the platform chart) + a
values-carrying `fleet.yaml`:

```yaml
# apps/network/src/netbird-reverse-proxy/fleet.yaml
labels: { fleet.vgijssel.nl/bundle: netbird-reverse-proxy }
defaultNamespace: netbird
helm:
  releaseName: netbird-reverse-proxy
  values:
    netbird-reverse-proxy:            # keyed under the platform chart name (umbrella nesting)
      domain: network.vgijssel.nl
      tokenKvPath: network-netbird-pikvm-proxy
dependsOn:
  - selector: { matchLabels: { fleet.vgijssel.nl/bundle: netbird-operator } }
  - selector: { matchLabels: { fleet.vgijssel.nl/bundle: network-cloudflare-config } }
targetCustomizations:
  - name: network
    clusterSelector: { matchLabels: { cluster.vgijssel.nl/name: network } }
```

Per-cluster services workspace (hand-authored HCL, network/PiKVM):

```hcl
resource "restapi_object" "pikvm" {
  path = "/api/reverse-proxies/services"
  data = jsonencode({
    name          = "pikvm-network"
    domain        = "pikvm.network.vgijssel.nl"
    enabled       = true
    private       = true
    mode          = "http"
    access_groups = [data.netbird_group.homelab.id]
    targets = [{
      enabled     = true
      target_type = "peer"
      target_id   = data.netbird_peer.pikvm.id     # resolved by name/IP (Risk #4)
      port        = 443
      protocol    = "https"
      options     = { skip_tls_verify = true }
    }]
  })
  lifecycle { precondition {          # proxy cluster must be online first
    condition     = contains([for c in data.netbird_reverse_proxy_clusters.all.clusters : c.address], "network.vgijssel.nl")
    error_message = "network.vgijssel.nl BYOP proxy is not online yet"
  } }
}
```

Conventions (CLAUDE.md + repo norms): pin every version exactly; `<kind>-<name>.yaml`
filenames; secrets only via ESO/OpenBao; watchdog detection stays output-based
(`grep '"all_clients_healthy":false'`), `alpine/kubectl` pinned by digest, non-root,
`readOnlyRootFilesystem`.

---

## Testing Strategy

Operational, cheapest → most end-to-end:

1. **Render/lint** — `trunk check`; `helm template` of **both** bundles renders the right
   domain/cert/KV; chart lints standalone; the network services workspace HCL validates.
2. **Migration gate (secret, no-regression)** — after moving the proxy manifests + the
   secret domain workspace into the chart: the `netbird-reverse-proxy` Helm release (ns
   `netbird`, same release name) is **adopted, not reinstalled**; the migrated domain
   workspace adopts existing opentofu state (no `netbird_reverse_proxy_domain`
   destroy/recreate); `openbao.secret.vgijssel.nl` stays mesh-reachable with a valid cert.
   OpenBao's **services** workspace is untouched.
3. **Bundle health (network)** — bundle `Ready`; Deployment `Available`; `Certificate`
   `Ready` (`*.network.vgijssel.nl`); ESO `SecretSynced`; the new PiKVM `restapi_object`
   is `enabled`.
4. **Proxy registration** — `data.netbird_reverse_proxy_clusters` lists both
   `secret.vgijssel.nl` and `network.vgijssel.nl`.
5. **Cert correctness (primary)** — from a `homelab` peer:
   `curl -sv https://pikvm.network.vgijssel.nl` → issuer Let's Encrypt, subject
   `*.network.vgijssel.nl`, no verify error; browser UI loads without warning.
6. **Mesh-only** — same URL from a non-mesh client fails.
7. **Live UI** — video WebSocket stays up; terminal works (ISO upload = Risk #6).
8. **No regression elsewhere** — `omada.network.vgijssel.nl` loads; `pikvm:apply --dry`
   clean; goss `validate` passes.
9. **Self-heal** — wedge the network proxy's mesh client; watchdog restarts within ~5 min.

---

## Boundaries

**Always**
- Verify `kubectl config current-context` before `bin/fleet-apply` (context-clobber has
  caused a real OpenBao outage — memory `fleet-apply-context-clobber`).
- Keep `helm.releaseName: netbird-reverse-proxy` + ns `netbird` unchanged so the live secret
  release is adopted, not reinstalled.
- Pin all versions; secrets ESO-sourced; keep operator `v0.7.0`; `trunk fmt`/`check` pre-commit.

**Ask first**
- Executing the secret refactor (moving proxy manifests + the secret **domain** workspace into
  the shared chart) — live critical path; confirm Helm release + opentofu state are **adopted
  in place** before applying. See Risk #1.
- Minting/rotating the NetBird proxy token → OpenBao; extending `network-eso` for the new KV path.
- Registering `network.vgijssel.nl` as a reverse-proxy domain / any `*.network.vgijssel.nl`
  CNAME — confirm it does not shadow `omada.network.vgijssel.nl`.
- Any `apps/pikvm/deploy.py` / `goss.yaml` change; adding/bumping any dependency.

**Never**
- Commit a token/secret value. Make `pikvm.network.vgijssel.nl` public (`private` stays true).
- Hand-edit `third_party/vendir/charts/**`. `rollout restart deploy/router` as a fix.
- Remove/repoint the `pikvm.enigma.vgijssel.nl` ingress.

---

## Success Criteria

1. `https://pikvm.network.vgijssel.nl` loads the PiKVM UI from a `homelab` peer with a valid,
   non-warning LE cert (subject `*.network.vgijssel.nl`).
2. Unreachable from a non-mesh client; access limited to `homelab`.
3. **One** shared chart (proxy manifests + Cloudflare/domain linking) consumed by both clusters;
   each cluster's **services** live in a small cluster-local workspace. OpenBao unchanged.
4. Network proxy self-heals via the watchdog.
5. No regression: Omada works; `pikvm:apply --dry` + goss pass.
6. All secrets via ESO/OpenBao; nothing sensitive committed.

---

## Open Questions / Risks (resolve during Plan)

1. **In-place migration of the live secret bundle.** Moving the proxy manifests + the secret
   **domain** workspace into the shared chart must **adopt, not recreate**: keep Helm release
   name + ns; keep the domain workspace's resource name / opentofu state (`secret_suffix`) so
   `netbird_reverse_proxy_domain` for `secret.vgijssel.nl` isn't destroyed/recreated (a recreate
   could briefly drop OpenBao mesh reachability). The OpenBao **services** workspace is *not*
   touched (stays in cloudflare-config). Plan: diff `helm template` and Workspace specs old-vs-new.
2. **Nested `file://` chart deps.** Downstream umbrella → platform chart → vendored subchart is
   two `file://` levels. Confirm `fleet apply` builds transitively; **fallback**: pre-vendor the
   christianhuth subchart into the platform chart's `charts/` (or inline its Deployment/Service
   templates so the platform chart is one level / self-contained).
3. **Values nesting.** With umbrella-of-umbrella, `helm.values` in `fleet.yaml` must be keyed
   under the platform chart name. Confirm the key depth, or use Fleet `helm.chart` path for
   top-level values if the repo can resolve it.
4. **`target_type: peer` + peer-id resolution.** Confirm `netbirdio/netbird ~> 0.0.9` + the
   service payload accept `target_type: peer`, and how to resolve the PiKVM peer id in HCL (peer
   data source by name/IP). Fallback: direct-IP upstream to the peer's mesh address.
5. **`skip_tls_verify` option key.** Confirm exact spelling in `targets[].options`.
6. **Large ISO uploads (~1 GB).** Chart exposes no request-body-size knob. `pikvm.enigma`
   ingress (1 GB) stays as upload fallback. Determine the proxy's default limit / override.
7. **WebSockets.** `maxSessionIdleTimeout` empty = no cap (should be fine); verify video stream.
8. **Domain most-specific routing.** Confirm `network.vgijssel.nl` registration routes
   `pikvm.network.vgijssel.nl` to the network proxy and doesn't disturb Omada's DNS.
9. **OpenBao policy + token-script home.** Confirm `network-eso` covers
   `kv/network-netbird-pikvm-proxy`; decide the token-mint script's location.
```
