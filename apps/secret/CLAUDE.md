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
| `src/openbao/values.yaml` → `initialize` stanza | **Bootstrap SUBSET.** Runs once on first boot, then the root token is revoked. Seeds only the minimum needed to hand control to Crossplane, plus the break-glass admin foothold. Never reconciles. |
| `src/openbao-config/*.yaml` (Crossplane MRs) | **Full config + durable source of truth.** Reconciled continuously by provider-vault via the `openbao` ProviderConfig. |

**RULE: `src/openbao/values.yaml`'s `initialize` config MUST be a strict subset of
`src/openbao-config/`.** Anything you add to self-init for initialization (a policy, an
auth role, an auth-method config) **must be duplicated** as the matching Crossplane
managed resource in `src/openbao-config/`, kept **semantically identical**. Self-init
seeds it; Crossplane owns and reconciles it thereafter.

Current duplications (keep in sync):

| self-init (`values.yaml`) | Crossplane MR (`src/openbao-config/`) |
|---|---|
| `crossplane` policy | `policy-crossplane.yaml` |
| `admin` policy | `policy-admin.yaml` |
| `crossplane` k8s-auth role | *(self-init only — mirror it if you extend it)* |
| `admin` k8s-auth role | *(self-init only — mirror it if you extend it)* |
| enable + configure `kubernetes` auth | *(self-init only — the foothold mount)* |

Config that lives **only** in Crossplane (never in self-init): the `kv` mount,
`external-secrets` policy+role, and the `jwt-network` backend + `network-*` roles/policy.

### Why the duplication is safe (not a fight)
- Self-init is **fire-once**: it runs only while OpenBao is uninitialized and never again
  (not even on pod restart). So there is no ongoing tug-of-war — it seeds, Crossplane
  takes over.
- OpenBao stores policy text **verbatim**, so a mirrored MR does not perpetually drift.
- Every mirrored MR uses `deletionPolicy: Orphan`, so deleting an MR can't delete the
  live object and lock anything out.

### Why keep the subset at all (don't collapse it into Crossplane)
- The `crossplane` policy+role must exist **before** Crossplane can log in — chicken/egg,
  so it has to be seeded by self-init.
- The `admin` policy+role is the **break-glass** path (`moon run secret:auth`); it must
  work **even when Crossplane is broken** (you may need admin to fix Crossplane).

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
