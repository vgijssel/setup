# TODO: OpenBao S3 Backups

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · **CP** = checkpoint (stop, verify, then continue)

## Phase 0 — Prereqs & discovery
- [ ] 0.1 Verify `kv/s3-backup` has `access_key_id`, `secret_access_key`, `endpoint`, `bucket`
      (`secret:auth` + `secret:forward` → `bao kv get kv/s3-backup`). Seed if missing (ask-first on host).
- [ ] 0.2 Resolve `openbao-snapshot-agent:0.3.0` `@sha256:` digest.
- [ ] 0.3 Confirm chart-emitted snapshot SA name == `openbao-snapshot`.
- [ ] **CP0** creds present · digest resolved · SA name confirmed. If SA name differs, adjust 1.2.

## Phase 1 — Authorization (bundle: openbao-config)
- [ ] 1.1 Add `apps/secret/src/openbao-config/policy-snapshot.yaml` (Policy, `read` on
      `sys/storage/raft/snapshot`, Orphan).
- [ ] 1.2 Add `apps/secret/src/openbao-config/role-snapshot.yaml` (AuthBackendRole, backend
      kubernetes, bind SA `openbao-snapshot`/ns `secret`, tokenPolicies `[snapshot]`, Orphan).
- [ ] 1.3 Confirm self-init stanza untouched (`init ⊂ crossplane`).
- [ ] 1.4 Verify: `trunk fmt/check`; `secret:apply`; both MRs `Ready`/`Synced`; `bao policy read
      snapshot` + `bao read auth/kubernetes/role/snapshot` correct.

## Phase 2 — Secret delivery (bundle: openbao)
- [ ] 2.1 Add `apps/secret/src/openbao/templates/externalsecret-openbao-backup-s3.yaml`
      (store `openbao`, `remoteRef.key: s3-backup`, template emits AWS_* + S3_HOST scheme-stripped
      + S3_BUCKET + `S3_URI=s3://<bucket>/openbao/`; Helm-escape the ESO template).
- [ ] 2.2 Verify: `helm template` shows it; after apply `SecretSynced`; Secret has all 5 keys;
      `S3_HOST` has no scheme; `S3_URI` ends `/openbao/`.

## Phase 3 — Snapshot job (bundle: openbao) — **CP**
- [ ] 3.1 Add additive `openbao.snapshotAgent` block to `apps/secret/src/openbao/values.yaml`
      (enabled, hourly, image pinned tag+digest, SA create, s3CredentialsSecret,
      extraSecretEnvironmentVars for S3_*, empty config.s3* placeholders, s3ExpireDays 14,
      baoRole snapshot, hardened securityContext). Do not touch seal/raft/self-init.
- [ ] 3.2 Verify render: `helm template --show-only .../snapshotagent-cronjob.yaml` →
      `CronJob/openbao-snapshot`, ConfigMap, SA; env has S3_* + AWS_*; `BAO_ROLE=snapshot`;
      `BAO_ADDR=http://openbao.secret.svc:8200`.
- [ ] 3.3 `secret:apply`; manual run `kubectl -n secret create job openbao-snapshot-manual
      --from=cronjob/openbao-snapshot`; logs show `snapshot`-role login + upload; exit 0.
- [ ] 3.4 `rclone ls s3:enigma-s3-backup/openbao/` shows a fresh `.snap`; second run adds another.
- [ ] 3.R RISK: s3cmd/Hetzner upload fails → try `config.s3cmdExtraFlag`; **ask-first** before
      rclone fallback. Privilege `permission denied` → **ask-first** before policy `["read","sudo"]`.
- [ ] **CP3** `.snap` object confirmed in bucket from a live run. Do not start DR until true.

## Phase 4 — Retention
- [ ] 4.1 Confirm `S3_EXPIRE_DAYS=14` wired in rendered env; note >14d objects age out
      (ask-first to change window).

## Phase 5 — DR restore drill — **CP**
- [ ] 5.1 Scratch OpenBao with the SAME seal key (`openbao-seal`).
- [ ] 5.2 Download a `.snap`; `bao operator raft snapshot restore`; confirm a known kv key reads back.
- [ ] 5.3 Document: DR needs the seal key; record seal key out-of-band; never store it in the
      snapshot bucket.
- [ ] **CP5** known kv value reads back → feature accepted.

## Phase 6 — Idempotence & cleanup
- [ ] 6.1 `secret:apply` twice = no changes.
- [ ] 6.2 `trunk fmt`/`trunk check` clean; delete manual test Job.

## Success criteria (from SPEC)
- [ ] `CronJob/openbao-snapshot`, schedule `0 * * * *`, on `secret` cluster.
- [ ] Manual run authenticates as `snapshot` and exits 0.
- [ ] `.snap` under `s3://enigma-s3-backup/openbao/`.
- [ ] Objects older than `S3_EXPIRE_DAYS` pruned.
- [ ] No creds/seal key in git; `ExternalSecret` `SecretSynced`.
- [ ] `snapshot` `Policy` + `AuthBackendRole` MRs `Ready`.
- [ ] Restore drill (same seal key) reads back a known kv value.
