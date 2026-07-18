# Spec: Standalone OpenBao "secret" cluster

## Objective

Stand up a **single, standalone Kubernetes cluster** — the **secret cluster** — whose sole job
is to run OpenBao and serve secrets to services in *other* clusters. It runs locally on
[`vind`](https://www.vcluster.com/vind) (vCluster-in-Docker, the k3d/kind replacement) and is
provisioned declaratively by the **Rancher Fleet CLI** into an empty cluster.

The end state: **`https://secret.vgijssel.nl` reaches the OpenBao UI/API, but only from the
tailnet.** The DNS record holds a **Tailscale IP** (published by external-dns into Cloudflare),
and the endpoint serves a **valid public certificate** (cert-manager via Cloudflare DNS-01).

Two deliberate simplifications versus the previous design:

1. **No auth on OpenBao.** We use the **root token** to mint short-lived tokens for our use
   cases for now. (OIDC/Authentik is out of scope.)
2. **Auto-unseal.** OpenBao uses **static auto-unseal** so it boots unsealed with no manual
   unseal dance — `fleet apply` yields a ready cluster non-interactively.

This is a **stepping stone**, not the final topology. The cluster runs standalone for a short
time; **later, Rancher will manage this same cluster's Fleet bundles externally**. Therefore the
design's durable artifact is the set of **portable `fleet.yaml` bundles** — the standalone Fleet
controller and the `fleet apply` command are throwaway bootstrap; the bundles are reused verbatim
when Rancher takes over.

### Services (all in the one cluster)

| Service | Purpose |
|---|---|
| **OpenBao** | Serve secrets to services in other clusters. Single-node raft, static auto-unseal. |
| **External Secrets Operator** | Sync OpenBao → in-cluster K8s Secrets for tailscale / external-dns / netdata. |
| **vault-config-operator** | Declarative OpenBao config (kv engine, policies, kubernetes auth roles) from manifests. |
| **Tailscale operator** | Cluster access + publish the OpenBao Service on the tailnet. |
| **external-dns** | Publish the OpenBao Tailscale Service IP into Cloudflare (`secret.vgijssel.nl`). |
| **cert-manager** | Issue the `secret.vgijssel.nl` certificate (Cloudflare DNS-01, Let's Encrypt prod). |
| **Netdata** | Cluster observability. |

## Architecture

### Fleet model — standalone now, Rancher-managed later

`fleet apply` renders local directories (Helm charts + a `fleet.yaml`) into **Bundle** resources,
but a Bundle only unpacks if the **Fleet controller** is running in-cluster. So:

- **Standalone (now):** `vind` up → Helm-install `fleet-crd` + `fleet` into `cattle-fleet-system`
  (**single-cluster mode** — the same cluster is both Fleet manager and agent, the `fleet-local`
  workspace) → `fleet apply <name> apps/...` pushes each bundle in. No Git server dependency.
- **Rancher-managed (later):** Rancher *imports* the cluster and runs its **own** Fleet, pointing
  a `GitRepo` at the very same bundle directories. Only the standalone `fleet-crd`/`fleet` install
  and the `fleet apply` invocation are discarded; **every `fleet.yaml` bundle migrates unchanged.**

> Because Rancher installs and manages its own Fleet in `cattle-fleet-system`, at handoff the
> standalone Fleet is removed (or the cluster re-created) to avoid a conflicting controller.

### Bootstrap sequence

```
1. vcluster create secret              # empty vind cluster (docker driver), kubeconfig auto-set
2. seed-seal                           # 1Password -> 32-byte static seal key -> K8s Secret (ns: secret)
3. fleet-install                       # helm install fleet-crd + fleet (cattle-fleet-system)
4. fleet apply apps/platform apps/secret   # push bundles; controller reconciles
5. OpenBao boots AUTO-UNSEALED via the static seal key (no manual unseal)
6. secret:init                         # bao operator init -> root token + recovery keys -> 1Password
7. vault-config-operator reconciles    # kv engine + external-secrets policy/role + k8s auth roles
8. secret:seed                         # operator seeds real kv values into OpenBao (root token)
9. ESO syncs cloudflare/tailscale/netdata secrets -> cert-manager issues cert,
   tailscale publishes the Service, external-dns writes secret.vgijssel.nl -> Tailscale IP
```

The **static seal key is the one bootstrap secret that cannot come from OpenBao** (chicken-and-egg),
so it is seeded directly from 1Password into a K8s Secret *before* the OpenBao pod starts — mounted
and referenced by the `seal "static"` stanza. This mirrors the old "only the unseal material lives
in 1Password" rule. The ESO-fed operators (cert-manager, external-dns, tailscale) stay NotReady and
their CRs error-and-retry until OpenBao is seeded — expected, and Fleet reconciles continuously.

## Tech Stack

All CLIs are **hermit-managed and pinned** (`bin/` + `third_party/hermit/*.hcl`); no unpinned installs.

| Component | Version |
|---|---|
| Cluster | `vind` = **`vcluster` 0.32.1** (hermit), docker driver; k3s image pinned |
| GitOps | Rancher **Fleet** — **`fleet` CLI 0.15.4** (hermit, `third_party/hermit/fleet.hcl`) + `fleet-crd`/`fleet` Helm charts (pin) |
| OpenBao | chart `openbao-0.28.4` (single-node raft, `seal "static"`) |
| External Secrets | chart `external-secrets-2.0.1` |
| vault-config-operator | chart `vault-config-operator-v0.8.49` |
| Tailscale operator | chart `tailscale-operator-1.90.9` |
| external-dns | chart TBD — **pin on add** (Cloudflare provider) |
| cert-manager | chart `cert-manager-v1.20.3` |
| Netdata | chart `netdata-3.7.168` |

## Commands

```bash
# Cluster lifecycle
vcluster use driver docker                # one-time: use Docker as the vind driver
vcluster create secret                    # empty vind cluster; kubeconfig auto-configured
vcluster delete secret

# Provision (Moon tasks; interactive/1Password ones are runInCI:false)
moon run secret:seed-seal                 # 1Password -> static seal-key Secret (+ namespace); idempotent
moon run secret:fleet-install             # helm install fleet-crd + fleet (cattle-fleet-system)
moon run secret:up                        # fleet apply apps/platform + apps/secret bundles
moon run secret:init                      # bao operator init -> root token + recovery keys -> 1Password; idempotent
moon run secret:seed                      # seed real kv values into OpenBao (root token)
moon run secret:down                      # fleet cleanup / vcluster delete

# Validation
moon run <app>:lint                       # kubeconform + helm template + `fleet apply -o -` render check
moon check --all
trunk fmt && trunk check
```

## Project Structure

Keep the **platform (shared operators) + secret (OpenBao)** split — least churn, and it maps
cleanly onto the future Rancher `GitRepo` paths. Everything under `apps/` per repo policy.

```
apps/secret/                  → OpenBao bundle + declarative OpenBao config
  fleet.yaml                    Fleet bundle: openbao Helm chart + values
  openbao/                      Helm values, static-seal stanza, Service + tailnet exposure
  config/                       vault-config-operator CRs: kv engine, policies, k8s auth roles
  scripts/{seed-seal,init,seed}.sh
  moon.yml                      + cluster lifecycle tasks (vind create/delete, fleet-install, up/down)

apps/platform/                → the six operators, each a Fleet bundle
  fleet.yaml (+ per-chart dirs) cert-manager/ external-secrets/ vault-config-operator/
                                tailscale/ external-dns/ netdata/
  config/                       ClusterIssuer, ClusterSecretStore->OpenBao, ExternalSecrets,
                                external-dns DNSEndpoint / annotations
  moon.yml
```

Both projects are authored as **portable `fleet.yaml` bundles** (Helm charts wrapped by
`fleet.yaml`) so a Rancher `GitRepo` can later target these exact paths.

### Retire (out of scope — remove as tasks)

`apps/bootstrap` (Tilt + k3d), `apps/gateway-prod`, `libs/gateway-image`, the **aws-sigv4-proxy**
(`apps/secret/sigv4-proxy` + `libs/aws-sigv4-proxy` usage here), and **Authentik/OIDC** (`apps/auth`).

### Exposure & persistence

- **Tailnet only.** The Tailscale operator publishes OpenBao as a Tailscale Service (tailnet IP);
  external-dns writes that IP to Cloudflare as `secret.vgijssel.nl`; TLS terminates on a
  cert-manager-issued cert. **Exact termination point (Ingress vs Tailscale operator HTTPS) and how
  external-dns reads the tailnet IP is the main integration risk — see Open Questions.**
- **Persistence.** OpenBao single-node raft on a PVC. `vcluster delete secret` destroys data; a
  re-created cluster re-seeds the seal key and re-inits (or restores) OpenBao. Acceptable for a
  short-lived stepping-stone cluster.

## Code Style

Match existing infra apps: Kubernetes `<kind>-<name>.yaml` naming; pin every Helm chart and image
version; keep manifests declarative and reconciled (config via vault-config-operator CRs, never
imperative `bao write` beyond the init foothold).

```hcl
# OpenBao server config — static auto-unseal. The 32-byte key is mounted from a
# K8s Secret seeded out-of-band from 1Password (never in git, never from OpenBao).
seal "static" {
  current_key_id = "secret-2026-07"
  current_key    = "file:///openbao/seal/current.key"   # or env://SEAL_KEY
}
```

```yaml
# apps/secret/fleet.yaml — portable bundle consumed by `fleet apply` now and a
# Rancher GitRepo later. Same file, both worlds.
defaultNamespace: secret
helm:
  releaseName: openbao
  chart: ./openbao
  valuesFiles:
    - openbao/values.yaml
```

## Testing Strategy

- **Manifest validation** (`<app>:lint`): kubeconform + `helm template` + `fleet apply -o -`
  render check across `apps/**` — catches errors before Fleet applies. `runInCI: false` stays the
  convention for the interactive/1Password tasks.
- **Bootstrap dry-run:** `vcluster create` → `fleet-install` → `fleet apply` brings all bundles to
  Active; **OpenBao reports `sealed=false` with zero manual unseal** (auto-unseal proof).
- **Bundle portability check:** `fleet apply -o -` output for `apps/platform` + `apps/secret` is a
  valid Bundle set a Rancher `GitRepo` would produce — no `fleet apply`-only assumptions.
- **Acceptance (manual/scripted):** all pods Ready; vault-config-operator shows the `kv` engine +
  external-secrets policy/role; ESO syncs cloudflare/tailscale/netdata secrets; `curl
  https://secret.vgijssel.nl` from the tailnet returns a **valid Let's Encrypt cert** + OpenBao UI,
  and **fails from off-tailnet**; Netdata is observing the cluster.

## Boundaries

**Always**
- Author every service as a **portable `fleet.yaml` bundle** (reusable by Rancher's Fleet later).
- Treat OpenBao as the source of truth; only the **static seal key + root token + recovery keys**
  live in 1Password. Never write any other secret to local disk or git.
- Pin all versions (charts, images, k3s, Fleet). `trunk fmt` / `trunk check` before commit.
- Keep code in `apps/` / `libs/` only. Validate manifests before Fleet applies.

**Ask first**
- Adding any chart/provider/dependency not listed; changing the Cloudflare zone.
- Changing the seal-key handling or key rotation (`previous_key`).
- Enabling any OpenBao auth method (the no-auth/root-token model is deliberate for now).
- Whether to persist OpenBao across `vcluster delete` (snapshot/restore) vs re-init.

**Never**
- Commit secrets, the seal key, recovery keys, root token, or kubeconfigs.
- Expose OpenBao (or the OpenBao UI/API) to the **public internet** — tailnet only.
- Use unpinned/`latest` images or `npx` / `uvx`.
- Reintroduce OIDC/Authentik, the sigv4-proxy, or the Hetzner gateway cluster without approval.

## Success Criteria (testable)

- [ ] `vcluster create secret` + `secret:fleet-install` + `secret:up` bring up all 7 services with
      no manual `kubectl`.
- [ ] OpenBao boots **auto-unsealed** (static seal) — `bao status` shows `sealed=false`, zero
      manual unseal steps.
- [ ] `secret:init` stores the **root token + recovery keys in 1Password**; no secret persists on
      local disk.
- [ ] vault-config-operator reconciles the `kv` engine + external-secrets policy/role + kubernetes
      auth roles from `apps/secret/config`.
- [ ] external-secrets syncs cloudflare / tailscale / netdata secrets from OpenBao.
- [ ] `https://secret.vgijssel.nl` resolves to the **Tailscale IP** (external-dns → Cloudflare),
      serves a **valid Let's Encrypt cert** (cert-manager DNS-01), and is reachable **only on the
      tailnet**.
- [ ] Netdata is observing the cluster.
- [ ] `fleet apply -o -` bundle output for `apps/platform` + `apps/secret` is portable — a Rancher
      `GitRepo` pointed at these paths would deploy identically.
- [ ] Retired: `apps/bootstrap`, `apps/gateway-prod`, `libs/gateway-image`, the sigv4-proxy, and
      `apps/auth` (OIDC) removed.

## Open Questions

1. **Exposure/TLS termination** — how `secret.vgijssel.nl` terminates the cert-manager cert behind
   the Tailscale Service (Ingress serving the cert vs Tailscale operator HTTPS), and how external-dns
   reads the tailnet IP (Service `LoadBalancer` status vs annotation). **Primary integration risk.**
2. **external-dns chart + Cloudflare provider** — exact chart/version and config to publish the
   Tailscale IP as an A/AAAA record.
3. **Cluster-lifecycle task ownership** — `vcluster create/delete` + `fleet-install` in `apps/secret`
   vs a thin dedicated bootstrap project (given `apps/bootstrap` is being retired).
4. **Persistence across recreate** — whether raft data + recovery-key reuse should survive
   `vcluster delete`, or re-init each time is acceptable for this stepping-stone.
