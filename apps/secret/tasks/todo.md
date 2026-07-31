# TODO: OpenBao S3 Backups

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · **CP** = checkpoint (stop, verify, then continue)

## Phase 0 — Prereqs & discovery
- [ ] 0.1 Verify `kv/s3-backup` has `access_key_id`, `secret_access_key`, `endpoint`, `bucket`
      (`secret:auth` + `secret:forward` → `bao kv get kv/s3-backup`). Seed if missing (ask-first on host).
      → LIVE: deferred to apply phase (needs secret-cluster break-glass).
- [x] 0.2 Resolve `openbao-snapshot-agent:0.3.0` `@sha256:` digest.
      → `sha256:d7a8ca9d26b12cf226ce093b9051f243c53aefbb8a419b3dc0b554e7575c931c` (multi-arch amd64+arm64).
- [x] 0.3 Confirm chart-emitted snapshot SA name == `openbao-snapshot` (chart helper render-confirmed).
- [x] **CP0** digest resolved · SA name confirmed = `openbao-snapshot` (role bind is correct). creds → live.

## Phase 1 — Authorization (bundle: openbao-config)
- [x] 1.1 Add `apps/secret/src/openbao-config/policy-snapshot.yaml` (Policy, `read` on
      `sys/storage/raft/snapshot`, Orphan).
- [x] 1.2 Add `apps/secret/src/openbao-config/role-snapshot.yaml` (AuthBackendRole, backend
      kubernetes, bind SA `openbao-snapshot`/ns `secret`, tokenPolicies `[snapshot]`, Orphan).
- [x] 1.3 Confirm self-init stanza untouched (`init ⊂ crossplane`).
- [x] 1.4 Verify: `trunk fmt/check` + LIVE `secret:apply` done. Policy/snapshot + AuthBackendRole/
      snapshot MRs both SYNCED=True READY=True on the secret cluster.

## Phase 2 — Secret delivery (bundle: openbao)
- [x] 2.1 Add `apps/secret/src/openbao/templates/externalsecret-openbao-backup-s3.yaml`
      (store `openbao`, `remoteRef.key: s3-backup`, template emits AWS_* + S3_HOST scheme-stripped
      + S3_BUCKET + `S3_URI=s3://<bucket>/openbao/`; Helm-escaped ESO template).
- [x] 2.2 Verify: `helm template` shows verbatim ESO template; LIVE `ExternalSecret/openbao-backup-s3`
      = SecretSynced/Ready; Secret has all 5 keys; `S3_HOST` has no scheme; `S3_URI` ends `/openbao/`.

## Phase 3 — Snapshot job (bundle: openbao) — **CP**
- [x] 3.1 Add additive `openbao.snapshotAgent` block to `apps/secret/src/openbao/values.yaml`
      (enabled, hourly, image pinned tag+digest, SA create, s3CredentialsSecret,
      extraSecretEnvironmentVars for S3_*, empty config.s3* placeholders, s3ExpireDays 14,
      baoRole snapshot, hardened securityContext incl. runAsUser=100). Seal/raft/self-init untouched.
- [x] 3.2 Verify render: `helm template --show-only .../snapshotagent-cronjob.yaml` →
      `CronJob/openbao-snapshot`, ConfigMap, SA; env has S3_* + AWS_*; `BAO_ROLE=snapshot`;
      `BAO_ADDR=http://openbao-active.secret.svc:8200` (chart HA `-active` leader svc).
- [x] 3.3 LIVE manual run `openbao-snapshot-manual`: logs `Using OpenBao auth path: kubernetes`
      (snapshot role, no permission denied) + s3cmd upload; pod Succeeded (exit 0).
- [x] 3.4 Independent `s3cmd ls` shows a fresh `.snapshot`; a 2nd manual run added a second object.
- [x] 3.R RISK: NOT triggered — s3cmd → Hetzner uploaded on the FIRST try (no S3CMD_EXTRA_FLAG);
      no `permission denied` on `sys/storage/raft/snapshot` (plain `read` sufficed, no `sudo`).
- [x] **CP3** two `.snap` objects confirmed in `s3://enigma-s3-backup/openbao/` from live runs.

## Unplanned fix — disable unused agent-injector (root-cause unblock)
- [x] Fx.1 `secret:apply` failed the openbao Helm upgrade on an SSA conflict on the UNUSED
      agent-injector webhook caBundle (fleetagent Apply vs vault-k8s Update), which — via
      dependsOn — blocked openbao-config (the snapshot MRs). Set `openbao.injector.enabled=false`
      (no workload uses agent-inject here; ESO+Crossplane deliver secrets). Approved by operator.
      Re-apply → Helm deployed, injector pruned, both bundles 1/1 Ready.

## Phase 4 — Retention
- [x] 4.1 `S3_EXPIRE_DAYS=14` in the rendered ConfigMap; the agent's entrypoint prunes every run
      (`s3cmd ls "$S3_URI" … | … s3cmd del` for objects older than 14d). Wired + functional.

## Phase 5 — DR restore drill — **CP** (PASSED 2026-07-31, isolated scratch, live untouched)
- [x] 5.1 Scratch OpenBao (ns openbao-dr, emptyDir raft) booted with the SAME copied `openbao-seal`
      key; init'd + auto-unsealed via the static seal.
- [x] 5.2 initContainer `s3cmd get` pulled the latest `.snap` FROM S3 (bao_2026-07-31-0600, the
      06:00 automatic hourly run); `bao operator raft snapshot restore` succeeded and the node
      stayed UNSEALED (proves same-seal-key decrypt); logged in via the restored `admin` k8s role
      and read back `kv/s3-backup` bucket = `enigma-s3-backup` (full kv tree restored intact).
- [x] 5.3 Documented in values.yaml snapshotAgent block: restore needs the seal key; keep it
      out-of-band; never store it in the snapshot bucket; verified restore commands.
- [x] **CP5** known kv value reads back post-restore → feature accepted. Scratch torn down.

## Phase 6 — Idempotence & cleanup
- [x] 6.1 `secret:apply` re-run reports `unchanged (bundle): …secret-openbao`; both bundles 1/1.
- [x] 6.2 `trunk fmt`/`trunk check` clean; manual test Jobs deleted.

## Success criteria (from SPEC)
- [x] `CronJob/openbao-snapshot`, schedule `0 * * * *`, on `secret` cluster.
- [x] Manual run authenticates as `snapshot` and exits 0.
- [x] `.snap` under `s3://enigma-s3-backup/openbao/`.
- [x] Objects older than `S3_EXPIRE_DAYS` pruned (agent prune logic wired; 14d window).
- [x] No creds/seal key in git; `ExternalSecret` `SecretSynced`.
- [x] `snapshot` `Policy` + `AuthBackendRole` MRs `Ready`.
- [x] Restore drill (same seal key) reads back a known kv value — PASSED (isolated scratch).
- [ ] Restore drill (same seal key) reads back a known kv value.
