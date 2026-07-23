# apps/secret — AI assistant guide

The `secret` cluster runs **OpenBao** (single-node raft, static auto-unseal) as the
homelab's secret/state broker. It is **self-initializing** and configured by
**Crossplane + `upbound/provider-vault`** over OpenBao's Kubernetes auth method. There is
no `bootstrap`/`configure` step and no Terranetes (both were removed in the migration).

Bring-up is one command: `moon run secret:start` (creates the vind cluster, installs
Fleet, and applies every bundle end-to-end).

## ⚠️ THE KEY INVARIANT — self-init is a SUBSET of openbao-config

There are **two** places OpenBao configuration is expressed, and they are not peers:

| File | Role |
|---|---|
| `src/openbao/values.yaml` → `initialize` stanza | **Irreducible auth foothold.** Runs once on first boot, then the root token is revoked. Seeds ONLY what Crossplane needs to authenticate. Never reconciles. Keep it tiny. |
| `src/openbao-config/*.yaml` (Crossplane MRs) | **Full config + durable source of truth.** Reconciled continuously by provider-vault via the `openbao` ProviderConfig. |

**RULE (one-directional): `init ⊂ crossplane`.**

- **init must stay minimal** — its ONLY job is to let Crossplane authenticate. That is
  exactly four things: enable the `kubernetes` auth method, configure it, and create the
  `crossplane` policy + role that provider-vault logs in with. **Do NOT add anything else
  to init** (not admin, not kv, not app grants). Once Crossplane can log in, *Crossplane*
  provisions the rest — including the `admin` role that mints break-glass tokens.
- **everything in init MUST also be a Crossplane MR** (so it is owned/reconciled, not just
  seeded once). Every init item has a mirror; keep them semantically identical.
- **most of Crossplane is NOT in init** (the reverse does not hold).

Init items and their required mirrors (keep in sync):

| init request (`values.yaml`) | Crossplane MR (`src/openbao-config/`) |
|---|---|
| enable `kubernetes` auth | `authbackend-kubernetes.yaml` (adopts via `external-name`) |
| configure `kubernetes` auth | `authbackendconfig-kubernetes.yaml` |
| `crossplane` policy | `policy-crossplane.yaml` |
| `crossplane` k8s-auth role | `role-crossplane.yaml` |

Crossplane-**only** (must NOT be in init): the `admin` policy+role (`policy-admin.yaml`,
`role-admin.yaml`), the `kv` mount, `external-secrets` policy+role, and the `jwt-network`
backend + `network-*` roles/policy.

### Why the mirror is safe (not a fight)
- Self-init is **fire-once**: it runs only while OpenBao is uninitialized and never again
  (not even on pod restart). So there is no ongoing tug-of-war — it seeds, Crossplane
  takes over.
- OpenBao stores policy text **verbatim**, so a mirrored MR does not perpetually drift.
- The auth-method *mount* mirror uses `crossplane.io/external-name` so provider-vault
  **adopts** the self-init-created mount instead of re-creating it (re-enabling an existing
  auth path errors "path already in use").
- Every mirrored MR uses `deletionPolicy: Orphan`, so deleting an MR can't delete the
  live object and lock anything out.

### Why keep init at all (don't collapse it into Crossplane)
The `crossplane` policy+role (and the auth method they use) must exist **before** Crossplane
can log in — chicken/egg — so they must be seeded by self-init. Everything else can wait
until Crossplane is authenticated. Note the `admin` break-glass role is Crossplane-owned,
so it appears shortly after first boot; if the Crossplane *controller* is down you can
still break-glass by logging in as the self-init `crossplane` role (via the provider-vault
SA token) and acting directly.

## Break-glass / human admin
Self-init revokes root and generates no recovery keys, so admin comes from
`moon run secret:auth`: it mints a short-lived (1h) SA token, logs in to OpenBao's
`admin` kubernetes-auth role, and prints `export BAO_ADDR/BAO_TOKEN`. It only works for
someone with **kubectl admin** on the cluster (they can mint the `openbao-admin` SA token
and exec the pod) — which already implies full cluster access, so it grants nothing extra.
Use it to seed human-only kv secrets and to run recovery-key rotation
(`sys/rotate/recovery/init`). Reach OpenBao from a workstation via `moon run secret:forward`.

## Fleet targeting — every fleet.yaml needs a cluster selector
`bin/fleet-apply` (repo root) applies **every** `fleet.yaml` in the repo to whatever
cluster's Fleet runs it. Cluster targeting is the **only** deploy gate, so **every**
`fleet.yaml` must declare `targetCustomizations` with a `clusterSelector` on
`cluster.vgijssel.nl/name`. A bundle without one deploys everywhere and will collide
across clusters (e.g. a same-named `ClusterSecretStore` clobbering another cluster's).
apps/secret bundles target `secret`; shared platform bundles target the clusters that
consume them.

## Non-obvious gotchas (all cost a debug cycle)
- **self-init `operation`** takes an ACL capability (`update`/`read`/…), **not** `"write"`.
- **`skip_child_token` is NOT honoured** by provider-vault on the auth_login path, and
  OpenBao's `default` policy grants no token creation — so the `crossplane` policy must
  include `auth/token/create`.
- **Fleet applies a bundle as one atomic Helm release**, so a `vault.upbound.io` CR (e.g.
  `ProviderConfig`) cannot live in the same bundle as the `Provider` that installs its
  CRD. Provider + DeploymentRuntimeConfig live in `src/crossplane-provider`; ProviderConfig
  + all MRs live in `src/openbao-config` (dependsOn crossplane-provider).
- **Fleet builds umbrella `file://` chart deps at apply time** — do NOT commit
  `charts/*.tgz` or `Chart.lock` (both gitignored under `apps/secret/src`).
- The `jwt-network` backend fetches the network cluster's live JWKS over the tailnet, so
  it only reconciles when the network cluster is reachable (not in an isolated cluster).
