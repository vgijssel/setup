# Implementation Plan: Automatic OpenBao Backups to Hetzner S3

Source of truth: `apps/secret/SPEC-openbao-backup.md`. Read it first — this plan only
sequences the work and adds acceptance/verification detail. Anything here that contradicts
the SPEC loses; update both if the SPEC changes.

> **Location note:** these planning artifacts live in `apps/secret/tasks/` (not a repo-root
> `tasks/`) to keep the feature self-contained next to its SPEC and respect the monorepo's
> "code only in `apps/` or `libs/`" rule.

## Goal (one sentence)

A dedicated `snapshot` role lets the OpenBao chart's built-in `snapshotAgent` CronJob take an
hourly Raft snapshot and push it to `s3://enigma-s3-backup/openbao/`, using the **same**
`kv/s3-backup` credentials as Omada, and a snapshot can be **restored** into a scratch OpenBao.

## Deploy model (how "apply" works here)

`apps/secret` is **Fleet + moon**, not ArgoCD. There is no `config.json` for this app. Changes
land by **committing YAML** and running `moon run secret:apply` (or `moon run secret:start` for a
full bring-up). Two bundles are touched:

| Bundle | Directory | This feature adds |
|---|---|---|
| `openbao` | `apps/secret/src/openbao/` | `snapshotAgent` block in `values.yaml`; `templates/externalsecret-openbao-backup-s3.yaml` |
| `openbao-config` | `apps/secret/src/openbao-config/` | `policy-snapshot.yaml`; `role-snapshot.yaml` (Crossplane MRs) |

Both bundles already target `cluster.vgijssel.nl/name: secret` — new files inherit that gate.
No new `fleet.yaml`, no dependency-graph edits needed.

## Dependency graph

```
kv/s3-backup (must be populated in OpenBao)  ─┐
                                              ├─► ExternalSecret openbao-backup-s3 ──► Secret (AWS_*, S3_*)
ClusterSecretStore openbao (exists) ──────────┘                                             │
                                                                                            ▼
crossplane provider-vault + `crossplane` foothold (exists) ──► Policy snapshot ──► Role snapshot
                                                                                            │
                                                            (SA `openbao-snapshot` binds role)
                                                                                            ▼
openbao.snapshotAgent.enabled=true ──► CronJob openbao-snapshot + ConfigMap + SA ──► k8s-auth login
                                                                                            │
                                                                                            ▼
                                                              Raft snapshot ──► s3cmd upload ──► S3 object
                                                                                            │
                                                                                            ▼
                                                        Restore drill (scratch OpenBao + same seal key)
```

Independent leaves that can be built in parallel: **Policy+Role** (openbao-config) and
**ExternalSecret** (openbao). Both must exist and be healthy *before* the first manual job run.
The snapshot only needs the seal key at **restore** time, not at backup time.

## Vertical slices

Each phase is a thin, independently verifiable path — not a horizontal layer. Ship, verify, then
proceed. Declarative infra has no unit tests; verification is behavioral (render + reconcile +
live run), matching the SPEC's gated testing strategy.

### Phase 0 — Prereqs & discovery (no cluster mutation)
Confirm the ground truth the rest depends on, so later phases don't fail on missing inputs.
- Verify `kv/s3-backup` exists and carries `access_key_id`, `secret_access_key`, `endpoint`,
  `bucket` (break-glass: `moon run secret:auth` + `moon run secret:forward`, then `bao kv get
  kv/s3-backup`). If missing/incomplete → seed per SPEC "Commands" (ask-first if unsure of host).
- Resolve the `openbao-snapshot-agent:0.3.0` image `@sha256:` digest for pinning.
- Confirm the SA name the chart emits for the snapshot agent is **`openbao-snapshot`** (the role
  binds this exact name). Render-check the `serviceAccount.name` helper default.
- **CHECKPOINT 0:** creds present, digest resolved, SA name confirmed = `openbao-snapshot`.
  If the SA name differs, fix `role-snapshot`'s `boundServiceAccountNames` in Phase 1.

### Phase 1 — Authorization path (Crossplane MRs)  ·  bundle: openbao-config
Give the future job an identity + least privilege it can log into.
- New `apps/secret/src/openbao-config/policy-snapshot.yaml` — `Policy`, capability `read` on
  `sys/storage/raft/snapshot`, `deletionPolicy: Orphan`, `providerConfigRef: openbao`.
- New `apps/secret/src/openbao-config/role-snapshot.yaml` — `AuthBackendRole` on `backend:
  kubernetes`, `roleName: snapshot`, bound SA `openbao-snapshot`/ns `secret`, `tokenPolicies:
  [snapshot]`, TTLs 900/3600, `deletionPolicy: Orphan`.
- Do **NOT** touch the self-init stanza (`init ⊂ crossplane` invariant — the snapshot role is
  Crossplane-only, like admin).
- **Verify:** `trunk fmt/check`; `moon run secret:apply`; both MRs report `Ready=True` /
  `Synced=True`; `bao policy read snapshot` and `bao read auth/kubernetes/role/snapshot` match.

### Phase 2 — Secret delivery path (ExternalSecret)  ·  bundle: openbao
Materialize every S3 setting from the shared secret — nothing S3-connection-related in git.
- New `apps/secret/src/openbao/templates/externalsecret-openbao-backup-s3.yaml` per SPEC:
  `ClusterSecretStore openbao`, target `openbao-backup-s3`, `target.template` emitting
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_HOST` (scheme-stripped), `S3_BUCKET`,
  `S3_URI = s3://<bucket>/openbao/`. `remoteRef.key: s3-backup` (store path is `kv`, so **not**
  `kv/s3-backup`). Helm-escape the ESO Go-template (backtick raw-string) as omada does, since
  this file is rendered by the umbrella chart.
- **Verify:** `helm template` shows the ExternalSecret; after apply, `ExternalSecret/
  openbao-backup-s3` is `SecretSynced`; the materialized Secret has all five keys and `S3_HOST`
  has no `http(s)://` scheme and `S3_URI` ends `/openbao/`.

### Phase 3 — Snapshot job path (the integrating slice)  ·  bundle: openbao  ·  **CHECKPOINT**
Wire the agent and prove a real snapshot lands in S3.
- Edit `apps/secret/src/openbao/values.yaml`: add the `openbao.snapshotAgent` block per SPEC
  (enabled, `schedule "0 * * * *"`, image pinned by tag **and** digest from Phase 0,
  `serviceAccount.create: true`, `s3CredentialsSecret: openbao-backup-s3`,
  `extraSecretEnvironmentVars` for `S3_HOST/S3_BUCKET/S3_URI`, empty `config.s3*` placeholders,
  `s3ExpireDays "14"`, `baoRole snapshot`, hardened `securityContext`). Additive only — the
  seal/raft/self-init config is load-bearing; do not touch it.
- **Verify (render):** `helm template ... --show-only charts/openbao/templates/
  snapshotagent-cronjob.yaml` shows `CronJob/openbao-snapshot`, its ConfigMap, and SA; the
  container `env:` carries `S3_HOST/S3_BUCKET/S3_URI` (overriding the empty ConfigMap values) and
  `AWS_*`; `BAO_ROLE=snapshot`; `BAO_ADDR=http://openbao.secret.svc:8200`.
- **Verify (live):** `moon run secret:apply`; manual run
  `kubectl -n secret create job openbao-snapshot-manual --from=cronjob/openbao-snapshot`; logs
  show a successful `auth/kubernetes/login` as `snapshot` (no `permission denied`), a snapshot
  taken, and an s3cmd upload; job exits 0.
- **Verify (object):** `rclone ls s3:enigma-s3-backup/openbao/` shows a fresh `.snap`; a second
  run adds another.
- **RISK BRANCH — s3cmd vs Hetzner (highest risk):** if upload fails on host-bucket/path-style/
  signature, add `config.s3cmdExtraFlag` (e.g. host-bucket/signature flags). **ASK-FIRST** before
  falling back to a custom rclone CronJob.
- **RISK BRANCH — snapshot privilege:** if login/read returns `permission denied` on
  `sys/storage/raft/snapshot`, the path may be sudo-protected. **ASK-FIRST** before widening the
  Phase-1 policy to `["read", "sudo"]`.
- **CHECKPOINT 3:** a `.snap` object is confirmed in the bucket from a live manual run. Do not
  proceed to DR until this holds.

### Phase 4 — Retention
Keep the bucket bounded.
- Confirm `S3_EXPIRE_DAYS=14` is present in the rendered ConfigMap/env and that the agent invokes
  s3 expiry. Real-time pruning can't be observed in one session; verify the flag is wired and
  note that objects >14d age out. (Ask-first to change the window.)

### Phase 5 — DR restore drill (the real acceptance test)  ·  **CHECKPOINT**
Prove the backup is actually restorable — the whole point of the feature.
- Stand up a **scratch** OpenBao configured with the **same** static seal key (`openbao-seal`;
  snapshots are barrier-encrypted, so the same seal key is mandatory).
- Download a `.snap` from the bucket; `bao operator raft snapshot restore` it into the scratch
  instance; confirm a known `kv` key reads back.
- Document that DR requires the seal key, and that the seal key must be recorded out-of-band —
  **never** in the snapshot bucket (snapshot + seal key together = full plaintext compromise).
- **CHECKPOINT 5:** known kv value reads back post-restore → feature accepted.

### Phase 6 — Idempotence & cleanup
- `moon run secret:apply` twice leaves resources unchanged (no diff, no re-creates).
- `trunk fmt` / `trunk check` clean. Delete the manual test Job.

## Cross-cutting invariants (apply to every task)

- **`init ⊂ crossplane`:** never add snapshot config to the self-init stanza in `values.yaml`.
- **`deletionPolicy: Orphan`** on every MR; never `kubectl delete` the Configuration/MRs in a way
  that orphans/destroys live OpenBao state.
- **No secrets in git:** all S3 settings via `kv/s3-backup`; only the `openbao/` prefix,
  `s3ExpireDays`, and OpenBao path/role names are git-side. Never commit the seal key.
- **Pin images** by tag **and** `@sha256` digest.
- **`values.yaml` changes are additive** — the seal/raft/self-init config is load-bearing
  (ask-first for anything beyond the `snapshotAgent` block).
- Run `trunk fmt` / `trunk check` before each commit.

## Ask-first triggers (from SPEC Boundaries)

Schedule/retention/bucket/prefix changes; any non-additive `values.yaml` edit; broadening the
snapshot policy (e.g. `sudo`); adding a new auth method; falling back to a custom rclone CronJob.
```
