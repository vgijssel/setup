# Spec: `network` cluster — Omada controller on the tailnet

Status: **DRAFT — awaiting approval.** Gated spec-driven workflow: SPECIFY → PLAN → TASKS → IMPLEMENT.
This document covers SPECIFY only. Do not write implementation code until this is approved.

---

## Objective

Stand up a new self-managed Kubernetes cluster named **`network`** (in `apps/network`), modeled on the
existing `apps/secret` cluster, that runs the **TP-Link Omada controller** and exposes it on the tailnet at
**`https://omada.network.vgijssel.nl`** with a valid Let's Encrypt certificate.

The `network` cluster is a *consumer* of secrets, not a producer: it reads its secrets from the **`secret`
cluster's OpenBao** at `https://secret.vgijssel.nl` over the tailnet. It runs no OpenBao of its own.

**Why:** Give the Omada controller a durable, GitOps-managed home reachable from anywhere on the tailnet,
with automated TLS and secret delivery, following the same portable-Fleet-bundle pattern proven on `secret`.

**Primary user:** the operator (repo owner) managing home/lab network gear (Omada APs/switches/gateways),
plus the Omada devices themselves adopting the controller over the tailnet.

### Success looks like

- `moon run network:start && network:bootstrap && network:apply` brings up the cluster from nothing.
- `https://omada.network.vgijssel.nl` serves the Omada UI over the tailnet with a **valid Let's Encrypt
  cert** (no cert warning, no `*.ts.net` cert in the path).
- A stable **Tailscale Service VIP** (`omada-network`) fronts the Omada controller; the A record for
  `omada.network.vgijssel.nl` points at that VIP and does not churn when proxy pods restart.
- The controller's full documented TCP/UDP port set is reachable on the VIP so Omada devices can be
  **adopted over the tailnet** via the Inform-URL mechanism (see Risk R1).
- external-secrets on `network` authenticates to the remote OpenBao via **JWT auth** (no static token on
  disk) and syncs Cloudflare / Tailscale / netdata secrets from `kv/*`.
- The Tailscale chicken-and-egg is broken: `bootstrap.sh` seeds the operator OAuth secret out-of-band so
  the Tailscale operator starts before ESO is functional.

---

## Decisions locked (from clarifying questions)

| Area | Decision |
|------|----------|
| **OpenBao auth (network → remote OpenBao)** | **JWT auth**, bound to the network cluster's OIDC issuer; keys fetched **live** via `jwks_url` (the `network-operator` noauth API-server proxy on the tailnet), not a static copy on `secret`. No static credential on disk. |
| **Platform charts** | **Refactor `apps/platform` to be multi-cluster** — one shared bundle set, parameterized per cluster via Fleet `targetCustomizations` keyed on a cluster label. Both `secret` and `network` consume it. |
| **Omada exposure** | **Single Tailscale `LoadBalancer` Service** exposing all documented Omada ports (incl. 8043 HTTPS). `omada.network.vgijssel.nl` → the Service VIP. TLS cert issued by cert-manager and **mounted into the Omada container** (`/cert`), *not* terminated by ingress-nginx. |
| **Bootstrap credential** | `bootstrap.sh` authenticates to OpenBao with the **`secret`-cluster root token** read from the `enigma-prod` 1Password vault (same source `secret:configure` uses). |

---

## Tech Stack (pinned)

Reuse the exact versions already vendored in `third_party/vendir/charts/`:

| Component | Chart / tool | Version | Notes |
|-----------|--------------|---------|-------|
| vcluster (vind) | vcluster docker driver | 0.32.1 | standalone, single-node, kubeadm+flannel + built-in VIP LB |
| Fleet | fleet / fleet-crd | 0.15.4 | standalone single-cluster mode (`fleet-local`) |
| cert-manager | cert-manager | v1.20.3 | LE prod, Cloudflare DNS-01 |
| ingress-nginx | ingress-nginx | 4.12.0 | **NOT deployed on `network`** — excluded via Fleet cluster selector (secret-only) |
| external-dns | external-dns | 1.19.0 | Cloudflare, `source=service`, **unique** `txtOwnerId: network-cluster` |
| tailscale-operator | tailscale-operator | 1.90.9 | operator hostname `network-operator` |
| external-secrets | external-secrets | 2.0.1 | JWT auth to remote OpenBao |
| netdata | netdata | (as vendored) | observability |
| **Omada controller** | `omada-controller-helm` | **1.4.1** (appVersion 6.2.14.11) | OCI chart `oci://registry-1.docker.io/mbentley/omada-controller-helm` — **must be vendored** |
| **MongoDB** (external, for Omada) | pinned MongoDB chart | TBD exact ver | Decision: **external MongoDB** (chart's supported rootless path). Deployed as a `network-mongodb` bundle; Omada points at it via `config.externalMongoDBUrlSecret`. Verify image availability given Bitnami's 2025 catalog/licensing changes; pick a maintained, pinned chart. |

No new tool is introduced that isn't already pinned. OCI Omada chart gets vendored into
`third_party/vendir/charts/omada-controller-helm` at 1.4.1 (no `npx`/`uvx`/unpinned fetches).

### Omada port set (controller 6.x, from chart 1.4.1 `service.yaml`)

All exposed on the single Tailscale LoadBalancer Service. `port == targetPort` is required by Omada.

| Port | Proto | Purpose |
|------|-------|---------|
| 8088 | TCP | management/portal HTTP (redirects to HTTPS) |
| 8043 | TCP | **management UI HTTPS** (the `omada.network.vgijssel.nl` endpoint) |
| 8843 | TCP | portal HTTPS |
| 27001 | UDP | app discovery (L2 only) |
| 29810 | UDP | device discovery (L2 only) |
| 19810 | UDP | device management UDP (L2 only) |
| 29811 | TCP | device manager v1 |
| 29812 | TCP | device adopt v1 |
| 29813 | TCP | device upgrade v1 |
| 29814 | TCP | device manager v2 |
| 29815 | TCP | device transfer v2 |
| 29816 | TCP | rtty (remote terminal) |
| 29817 | TCP | device monitor (Omada 6) |

---

## Commands

Moon project id: `network` (mirrors `secret`). All tasks are `interactive`, `runInCI: false`, `cache: false`
(they manage external Docker / tailnet / 1Password / OpenBao state, not file outputs).

```bash
# Full bring-up, in order:
moon run network:start        # 1. create/reconnect the standalone vind cluster "network"
moon run network:bootstrap    # 2. seed operator-oauth from remote OpenBao (root token); capture the
                              #    cluster's OIDC issuer+JWKS and print the OpenBao grant instructions
# --- one-time on the SECRET cluster: grant network JWT access (see Project Structure > apps/secret) ---
moon run secret:configure     # 3. re-run after adding the network JWT auth backend + read policy/role
moon run network:apply        # 4. install Fleet + apply network & shared platform bundles (cluster=network)

moon run network:stop         # tear down the vind cluster (tailnet/1Password/OpenBao state persists)
```

Quality / repo-wide:

```bash
trunk fmt        # format (yamllint, shfmt, etc.)
trunk check      # lint
moon run network:test    # goss/manual verification task (see Testing Strategy) — if added
bin/help         # discover real targets
```

---

## Project Structure

New code goes **only** in `apps/` and `libs/` (repo rule). Two areas change:

### 1. `apps/network/` (new)

```
apps/network/
├── moon.yml                         # start / bootstrap / apply / stop tasks (NO openbao/configure)
├── SPEC.md                          # this document
├── scripts/
│   ├── start.sh                     # vcluster create network --driver docker --connect (idempotent)
│   ├── bootstrap.sh                 # read root token from 1Password (enigma-prod) -> read kv/tailscale
│   │                                #   from OpenBao @ secret.vgijssel.nl -> create operator-oauth Secret;
│   │                                #   extract cluster OIDC issuer + JWKS -> print grant instructions
│   ├── apply.sh                     # install Fleet controller + `fleet apply` network + platform bundles
│   └── stop.sh                      # vcluster delete network
└── src/
    ├── config/
    │   ├── fleet.yaml                       # bundle: network-config
    │   ├── clustersecretstore-openbao.yaml  # ClusterSecretStore -> https://secret.vgijssel.nl, JWT auth
    │   ├── certificate-omada.yaml           # cert-manager Certificate for omada.network.vgijssel.nl
    │   ├── externalsecret-cloudflare-api-token.yaml
    │   ├── externalsecret-external-dns.yaml
    │   ├── externalsecret-operator-oauth.yaml   # ESO takes over the bootstrap-seeded secret
    │   └── externalsecret-netdata-claim.yaml
    ├── omada/
    │   ├── Chart.yaml               # umbrella depending on vendored omada-controller-helm 1.4.1
    │   ├── Chart.lock               # committed
    │   ├── values.yaml             # ports, config.tlsSecretName, persistence, service annotations,
    │   │                            #   config.externalMongoDBUrlSecret -> the network-mongodb service
    │   ├── fleet.yaml              # bundle: network-omada (dependsOn: network-mongodb)
    │   └── charts/omada-controller-helm-1.4.1.tgz   # vendored (via vendir)
    └── mongodb/
        ├── Chart.yaml               # umbrella depending on a pinned, vendored MongoDB chart
        ├── Chart.lock               # committed
        ├── values.yaml             # single-node, PVC; creds sourced from OpenBao via ExternalSecret
        └── fleet.yaml              # bundle: network-mongodb
```

Cluster-scoped Tailscale VIP for Omada: a `network-ingress` **ProxyGroup** (type `ingress`, replicas 2) —
lives in the refactored platform `tailscale-proxygroup` bundle (parameterized), not duplicated here.

### 2. `apps/platform/` (refactor to multi-cluster)

The refactor uses **Fleet cluster targeting** on the label `cluster.vgijssel.nl/name: secret|network`. The
standalone Fleet `local` Cluster object in each cluster is labeled by that cluster's `apply.sh`. Two Fleet
mechanisms are used together:

- **`targets` + `clusterSelector`** — gate *whether* a bundle deploys to a cluster at all. A bundle whose
  targets don't match the local cluster's label produces no BundleDeployment. This is how **ingress-nginx is
  excluded from `network`** (Q3): its `fleet.yaml` targets only `cluster.vgijssel.nl/name: secret`. Same for
  the `secret-ingress` ProxyGroup and any other secret-only bundle.
- **`targetCustomizations`** — per-cluster *values* for bundles that deploy to both clusters.

Per-cluster parameterization today:

| File | membership | secret value | network value |
|------|-----------|--------------|---------------|
| `ingress-nginx/values.yaml` | **secret only** (selector) | hostname `secret`, proxy-group `secret-ingress`, host `secret.vgijssel.nl` | — not deployed — |
| `tailscale-proxygroup/proxygroup.yaml` | both (customized) | `secret-ingress` | `network-ingress` (for the Omada VIP) |
| `tailscale/values.yaml` | both (customized) | operator hostname `secret-operator` | `network-operator` |
| `external-dns/values.yaml` | both (customized) | `txtOwnerId: secret-cluster` | **`txtOwnerId: network-cluster`** |
| `config/clustersecretstore-openbao.yaml` | both (customized) | in-cluster `http://openbao.secret.svc:8200`, k8s auth | `https://secret.vgijssel.nl`, JWT auth |

**Unique external-dns ownership (Q2).** Both clusters run external-dns against the same Cloudflare zone
(`domainFilters: [vgijssel.nl]`), so each **must** use a distinct `txtOwnerId` (`secret-cluster` vs
`network-cluster`) and TXT registry. This is what prevents one cluster's external-dns from treating another
cluster's records as orphans and deleting them. Any future cluster added to this zone gets its own unique
owner id. This is a hard requirement, not a preference (see Boundaries → Always, and Risk R7).

Refactor approach must keep the **working `secret` cluster behavior byte-for-byte identical** after the
change (verify by diffing rendered manifests for the `secret` target).

### 3. `apps/secret/` (grant network access — small, additive)

The `network` cluster's read access is configured **on the OpenBao side**, in the existing OpenTofu module:

```
apps/secret/src/openbao-config/main.tf   # ADD:
  - vault_jwt_auth_backend  "network"          (path "jwt-network", bound to network OIDC issuer)
  - vault_policy            "network-read"     (read-only on kv/data/* + kv/metadata/*)
  - vault_jwt_auth_backend_role "network-eso"  (bound_audiences=["openbao"], user_claim="sub",
                                                bound_subject/claims = the network ESO service account,
                                                token_policies=["network-read"])
apps/secret/src/openbao-config/variables.tf  # network_oidc_issuer, network_jwks_url (+ network_jwks_ca_pem)
```

Reconciled in-cluster by terranetes from `configuration-openbao.yaml` (the source of truth); `secret:configure`
reads the same `network_oidc_issuer` + `network_jwks_url` from that file so the local root-token apply agrees.
`network_jwks_url` points at the tailnet-reachable `network-operator` JWKS endpoint and is **stable** across
network recreation — set it once (safe to commit; it's just a URL to public key material). OpenBao fetches the
keys live, so nothing is re-extracted after a `network:stop`+`start`.

---

## Code Style

Match the `apps/secret` conventions exactly:

- **Kubernetes manifests:** one resource per file, named `<kind>-<name>.yaml` (e.g. `certificate-omada.yaml`,
  `clustersecretstore-openbao.yaml`).
- **Heavy top-of-file comments** explaining *why*, the ordering/bootstrap constraints, and cross-references
  to sibling files — the `secret` cluster's manifests are the style reference. Example (real target style):

```yaml
# ClusterSecretStore the network cluster reads all secrets from. Unlike the secret
# cluster (in-cluster k8s auth against a local OpenBao), network is REMOTE: it reaches
# OpenBao over the tailnet at https://secret.vgijssel.nl and authenticates with JWT
# auth. ESO mints a projected SA token (audience "openbao") for external-secrets and
# posts it to the jwt-network backend; OpenBao validates the signature against the
# network cluster's JWKS (configured out-of-band in apps/secret/src/openbao-config) and
# grants the read-only network-read policy. No static Vault token is ever written to disk.
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: openbao
spec:
  provider:
    vault:
      server: https://secret.vgijssel.nl
      path: kv
      version: v2
      auth:
        jwt:
          path: jwt-network
          role: network-eso
          kubernetesServiceAccountToken:
            serviceAccountRef:
              name: external-secrets
              namespace: external-secrets
            audiences: ["openbao"]
```

- **Bash scripts:** `set -euo pipefail`, idempotent, interactive-friendly, numbered `[1/N]` progress echoes,
  read `OP_SERVICE_ACCOUNT_TOKEN` from `.env` (never interactive `op signin`), `enigma-prod` vault.
- **Fleet bundles:** carry `fleet.vgijssel.nl/bundle: <name>` labels; use `dependsOn` label selectors for
  ordering (CRD-before-CR), matching the `secret` pattern.
- **Versions pinned everywhere**; charts vendored under `third_party/vendir/charts/`; no `npx`/`uvx`.
- Platform detection via `IS_MACOS` / `IS_LINUX` where scripts branch.

---

## Testing Strategy

Follow whatever test convention the repo already uses for clusters (the `secret` project ships no unit
tests; verification is operational). Provide:

1. **Rendered-manifest diff (refactor safety):** `helm template` / `fleet apply --dry-run` the `secret`
   target before vs after the platform refactor — must be identical. This is the gate that the multi-cluster
   change did not disturb the working cluster.
2. **Bring-up smoke test (manual / goss task `network:test`):**
   - `kubectl get pods -A` all Running/Ready.
   - `kubectl get externalsecret -A` all `SecretSynced` (proves JWT auth to remote OpenBao works).
   - `kubectl get certificate -n <ns>` `Ready=True` for `omada-network-vgijssel-nl`.
   - Tailscale Service VIP present; `dig omada.network.vgijssel.nl` resolves to the VIP.
   - `curl -v https://omada.network.vgijssel.nl` from a tailnet host → 200/redirect to Omada login, cert
     issued by Let's Encrypt (not `*.ts.net`), SAN `omada.network.vgijssel.nl`.
   - `nc -vz <vip> 29814` / `nc -vzu <vip> 29810` reachability checks for the adoption ports.
3. **Adoption acceptance:** one real Omada device set with Inform URL = the controller's tailnet address is
   adopted successfully over the tailnet (Risk R1).

Coverage expectation: operational/functional verification, not code coverage (this is infra config).

---

## Boundaries

### Always
- Pin every version; vendor charts under `third_party/vendir/charts/`; commit `Chart.lock`.
- Keep the `secret` cluster's rendered manifests **identical** through the platform refactor (diff to prove).
- One resource per file, `<kind>-<name>.yaml`, with explanatory top comments.
- Least privilege: the `network-read` OpenBao policy is **read-only** on `kv/*` and nothing else.
- **Every cluster's external-dns uses a unique `txtOwnerId`** (`network-cluster` here) so it never prunes
  another cluster's records in the shared `vgijssel.nl` zone.
- Idempotent scripts; read 1Password via `OP_SERVICE_ACCOUNT_TOKEN` from `.env`.
- `trunk fmt` + `trunk check` before committing; keep code inside `apps/` or `libs/`.
- Fleet `dependsOn` ordering so CRDs establish before CRs (avoid fresh-cluster deadlock).

### Proceed autonomously (standing authorization — no approval needed)
The operator has granted standing authorization to implement the recommended/best-practice approach and to
**modify live systems without pausing for per-change approval**. Do these directly, verify, and log what
changed:
- Changes to `apps/secret` — the OpenBao grant (additive `jwt-network` backend/policy/role) and the platform
  refactor. Verify existing `secret` behavior is unchanged (manifest diff) rather than asking first.
- **Tailnet ACL changes:** the new `omada-network` Tailscale Service (`autoApprovers.services` + `grants`)
  and the `network-operator` grant to reach `svc:secret`. Prefer a version-controlled ACL/policy file; apply
  directly if an API/token is available.
- Pinning the MongoDB chart/version for `network-mongodb` (pick the best maintained, pullable option — R6).
- OpenBao changes needed for this work (new auth backends/roles); avoid touching the seal or unrelated
  existing roles.
- Managing `omada.network.vgijssel.nl` under the existing `vgijssel.nl` Cloudflare zone.

Only stop for genuinely destructive/irreversible actions beyond the intended change (e.g. deleting the
terranetes Configuration, wiping OpenBao storage, revoking the seal) — see Never.

### Never
- Commit secrets, tokens, the Tailscale OAuth client, or the OpenBao root token to git.
- Commit the git-ignored terraform backend override (`zz_backend.tf`) or terraform state.
- `kubectl delete` the terranetes `Configuration` on the secret cluster (destroys OpenBao → orphaned state).
- Grant the network cluster anything beyond read on `kv/*`.
- Use `npx`/`uvx` or unpinned images/charts.
- Place new code outside `apps/`/`libs/`.

---

## Success Criteria (testable)

1. `moon run network:start` creates a connected `vcluster-docker_network` context with a Ready node.
2. `moon run network:bootstrap` creates the `operator-oauth` Secret in the `network` cluster from
   `kv/tailscale` in the remote OpenBao, and outputs the cluster's OIDC issuer + JWKS.
3. After the OpenBao grant + `secret:configure`, `bao read auth/jwt-network/role/network-eso` shows the
   `network-read` policy bound to the network ESO service account.
4. `moon run network:apply` results in all Fleet bundles `Ready`; all ExternalSecrets `SecretSynced`; the
   `network-mongodb` pod is Running and Omada connects to it (external MongoDB).
5. Certificate `omada-network-vgijssel-nl` is `Ready=True` and mounted into the Omada pod at `/cert`.
   ingress-nginx is **not** present on `network` (Fleet target excluded it).
6. From a tailnet host, `https://omada.network.vgijssel.nl` returns the Omada login over a valid Let's
   Encrypt certificate; the A record resolves to the stable `omada-network` VIP.
7. TCP adoption ports (29811/29812/29814…) and the UDP ports are reachable on the VIP.
8. An Omada device configured with the controller's tailnet Inform URL is adopted successfully.
9. Re-running any task is a safe no-op (idempotence).
10. The `secret` cluster is unaffected: its rendered platform manifests are unchanged and it still works.
11. Each cluster's external-dns TXT ownership records carry a distinct owner id; no cross-cluster record
    deletion occurs in the `vgijssel.nl` zone.

---

## Risks & Mitigations

- **R1 — UDP discovery does not cross the tailnet (L3).** Omada auto-discovery (UDP 29810/27001/19810) is
  L2-broadcast only. Adoption over the tailnet therefore relies on each device's **Inform URL** pointing at
  the controller's tailnet address over the TCP management/adopt ports. *Mitigation:* expose the full port
  set anyway (same-subnet devices still auto-discover), document the Inform-URL flow, verify adoption end to
  end (Success Criterion 8). This qualifies the original "adoption just works over the tailnet" assumption.
- **R2 — UDP over a Tailscale LoadBalancer Service.** The stable-VIP UDP path must actually forward UDP.
  *Mitigation:* verify UDP reachability early (spike) before building the rest; fall back to TCP-only + Inform
  URL if UDP forwarding is unsupported (acceptable given R1).
- **R3 — Omada HTTPS-only backend.** The controller force-redirects 8088→8043 and speaks HTTPS with the
  mounted cert. Since we expose the Service directly (no nginx), clients hit 8043 with the LE cert — fine.
  The cert's CN/SAN must be `omada.network.vgijssel.nl` and match what clients request via the VIP.
- **R4 — Platform refactor regressing `secret`.** *Mitigation:* rendered-manifest diff gate (Testing #1).
- **R5 — JWT issuer stability across cluster recreation.** vind SA-token JWKS change if the cluster is
  destroyed/recreated, but OpenBao fetches them **live** from `network_jwks_url` (the stable `network-operator`
  MagicDNS endpoint), so no re-extraction/re-grant is needed. The `bound_issuer`
  (`https://kubernetes.default.svc.cluster.local`) is also stable. *Residual risk:* the live design inverts the
  trust direction — `secret` must reach `network` at auth time (mitigated by ACL-C scoping + noauth authz that
  exposes only the two OIDC discovery endpoints anonymously).
- **R6 — MongoDB availability.** External MongoDB chosen; the exact chart must be pinned and its image must
  be pullable (Bitnami relicensed/moved much of its catalog in 2025). *Mitigation:* pick a maintained,
  pinned MongoDB chart at implementation time; verify the image pulls before wiring Omada to it.
- **R7 — external-dns record deletion across clusters.** Two clusters manage the same zone; a shared/blank
  `txtOwnerId` would let one delete the other's records. *Mitigation:* unique `txtOwnerId` per cluster
  (enforced as an Always boundary); verify each cluster's TXT ownership records are distinct after apply.

---

## Resolved Decisions (formerly Open Questions)

- **Q1 — MongoDB → EXTERNAL.** Add a pinned `network-mongodb` bundle and point Omada at it via
  `config.externalMongoDBUrlSecret` (the chart's supported rootless path). Exact chart/version pinned at
  implementation time (see R6).
- **Q2 — DNS → `omada.network.vgijssel.nl`**, managed by the existing Cloudflare zone `vgijssel.nl`
  (external-dns `domainFilters: [vgijssel.nl]` covers sub-subdomains). **Each cluster's external-dns uses a
  unique `txtOwnerId`** so records aren't cross-deleted (`network-cluster`).
- **Q3 — ingress-nginx → NOT deployed on `network`.** Excluded via Fleet cluster selector (`targets`
  matching `cluster.vgijssel.nl/name: secret`). Omada is exposed directly by its Tailscale LB Service.
- **Q4 — Cluster label key → `cluster.vgijssel.nl/name`** (`secret` | `network`) on the Fleet `local`
  Cluster object, set by each cluster's `apply.sh`; matched by `targets`/`targetCustomizations`.

No open questions remain blocking implementation.

---

## Out of Scope

- Production Rancher/GitRepo Fleet management (bundles stay portable for a future move, as on `secret`).
- Multi-node HA for either the cluster or Omada (single-node vind, replicas 1).
- Migrating the existing `network-controllers-prod` / `tailscale-prod` apps — unrelated to this cluster.
- Automating Omada device Inform-URL configuration (manual per-device or DHCP Option 138 by the operator).
