# Spec: Automatic OpenBao Backups to Hetzner S3

## Objective

Back up the `secret` cluster's OpenBao **integrated Raft state** off-cluster on a
schedule, so the homelab's secret/state broker survives loss of the single OrbStack VM
disk (see the *vind disk-pressure* failure mode). This mirrors the intent of the existing
Omada controller backup (commit `#999`): a scheduled job pushes point-in-time snapshots to
the **same** Hetzner S3 bucket using the **same** credentials, just under a different
prefix.

**User:** the homelab operator (single admin). **Success = a fresh OpenBao can be restored
from an S3 snapshot** with no data loss beyond the last snapshot interval.

Chosen approach (confirmed with operator):
- **Mechanism:** the OpenBao Helm chart's **built-in `snapshotAgent` CronJob** (not a
  hand-rolled CronJob). Image `ghcr.io/openbao/openbao-snapshot-agent`, which takes a Raft
  snapshot via OpenBao's API and uploads it to S3 with `s3cmd`.
- **Destination:** same bucket as Omada — `s3://enigma-s3-backup` — under prefix
  `openbao/`.
- **Credentials & all S3 connection settings:** same OpenBao secret as Omada —
  `kv/s3-backup` — surfaced into the cluster via an ESO `ExternalSecret` (same pattern as
  `omada-backup-s3`). **Every S3 setting (access keys, host/endpoint, bucket) comes from the
  secret**, not from `values.yaml`. The only job-specific, non-secret string kept in git is
  the `openbao/` prefix (it can't live in the *shared* secret without coupling it to Omada).
- **Retention:** rotating / age-based via the agent's `S3_EXPIRE_DAYS` (keep ~14 days).
- **Schedule:** hourly (`0 * * * *`).

### Acceptance criteria

1. A `CronJob/openbao-snapshot` exists in namespace `secret` on the `secret` cluster,
   rendered by the OpenBao umbrella chart with `snapshotAgent.enabled: true`.
2. It runs **hourly** and, on each run, authenticates to OpenBao via Kubernetes auth as a
   dedicated **`snapshot`** role, takes a Raft snapshot, and uploads it to
   `s3://enigma-s3-backup/openbao/`.
3. **All** S3 settings (keys, host, bucket) come from `kv/s3-backup` via an `ExternalSecret`
   — **nothing S3-connection-related is hardcoded in git**. Only the OpenBao path/property
   names and the non-secret `openbao/` prefix appear in the repo.
4. Old snapshots are pruned automatically (age-based, ~14 days) so the bucket does not grow
   unbounded.
5. A snapshot object is verified present in the bucket after a manual test run, and a
   **restore** into a scratch OpenBao succeeds (disaster-recovery drill).
6. The least-privilege `snapshot` policy + role are **Crossplane-managed MRs** in
   `apps/secret/src/openbao-config/` (per the repo's `init ⊂ crossplane` invariant), not in
   the self-init stanza.

## Tech Stack

- **OpenBao** v2.5.5, chart `openbao` 0.28.4 (vendored at
  `third_party/vendir/charts/openbao`), single-node integrated Raft, static auto-unseal
  (boots already unsealed — no unseal step needed for the snapshot job).
- **Snapshot agent:** `ghcr.io/openbao/openbao-snapshot-agent:0.3.0` (pin by digest at
  implement time). Uses `s3cmd` internally.
- **Secret delivery:** External Secrets Operator + `ClusterSecretStore/openbao` (local,
  in-cluster, Kubernetes-auth as role `external-secrets`).
- **OpenBao config:** Crossplane + `upbound/provider-vault` MRs (`Policy`,
  `kubernetes.vault.upbound.io/AuthBackendRole`).
- **Deploy:** Fleet (bundles targeted to `cluster.vgijssel.nl/name: secret`).
- **S3:** Hetzner Object Storage, bucket `enigma-s3-backup` (host/region live in
  `kv/s3-backup`).

## Commands

```bash
# Bring up / reconcile the whole secret cluster (creates vind cluster + Fleet + bundles)
moon run secret:start

# Apply bundles to an already-running secret cluster
moon run secret:apply

# Render the OpenBao chart locally to confirm the CronJob/ConfigMap/SA appear
helm template openbao apps/secret/src/openbao \
  --show-only charts/openbao/templates/snapshotagent-cronjob.yaml

# Break-glass admin token (to seed kv/s3-backup or inspect policies)
moon run secret:get_openbao_auth   # exports BAO_ADDR / BAO_TOKEN
moon run secret:forward     # port-forward OpenBao to the workstation

# One-time: ensure S3 creds exist in OpenBao (shared with Omada — likely already set)
bao kv get kv/s3-backup
# If missing:
bao kv put kv/s3-backup access_key_id=... secret_access_key=... \
  region=... bucket=enigma-s3-backup endpoint=<hetzner-s3-host>

# Manual test run of the snapshot job (do not wait an hour)
kubectl -n secret create job openbao-snapshot-manual --from=cronjob/openbao-snapshot
kubectl -n secret logs -f job/openbao-snapshot-manual

# Verify the object landed (from a host with mesh/S3 access, using rclone like Omada)
rclone ls s3:enigma-s3-backup/openbao/
```

## Project Structure

All changes live under `apps/secret/` (this feature is entirely secret-cluster scoped):

```
apps/secret/src/openbao/
  values.yaml                                  # EDIT: add openbao.snapshotAgent block
  templates/
    externalsecret-openbao-backup-s3.yaml      # NEW: kv/s3-backup -> Secret (AWS_* keys)

apps/secret/src/openbao-config/
  policy-snapshot.yaml                          # NEW: Crossplane Policy (raft snapshot read)
  role-snapshot.yaml                            # NEW: Crossplane k8s AuthBackendRole `snapshot`
```

- The `ExternalSecret` goes in the **openbao chart templates** (mirrors where Omada put
  `externalsecret-omada-backup-s3.yaml`), so it deploys in the same Fleet bundle that
  enables the agent.
- The **policy + role** go in `openbao-config` because full OpenBao config is
  Crossplane-owned and reconciled (`init ⊂ crossplane` — see `apps/secret/CLAUDE.md`). They
  are **not** added to the self-init stanza (the snapshot job is not part of Crossplane's
  auth bootstrap).

## Code Style

Match the existing Omada backup + openbao-config conventions.

**`openbao.snapshotAgent` values block** (nested under the `openbao:` subchart key, like the
rest of `values.yaml`):

```yaml
openbao:
  # ... existing server/raft/self-init config above ...
  snapshotAgent:
    enabled: true
    schedule: "0 * * * *"            # hourly
    restartPolicy: OnFailure
    image:
      repository: ghcr.io/openbao/openbao-snapshot-agent
      tag: 0.3.0                     # pin by @sha256 digest at implement time
    serviceAccount:
      create: true                   # creates SA `openbao-snapshot` in ns secret
    s3CredentialsSecret: openbao-backup-s3   # provides AWS_ACCESS_KEY_ID/SECRET (from kv)
    # S3 connection settings come from the SECRET, not git. The chart's ConfigMap emits
    # S3_HOST/S3_BUCKET/S3_URI from config.* below, but container `env:` overrides `envFrom`
    # ConfigMap values in Kubernetes — so these extraSecretEnvironmentVars win. Leave the
    # config.s3* placeholders empty to make it obvious they're overridden.
    extraSecretEnvironmentVars:
      - envName: S3_HOST
        secretName: openbao-backup-s3
        secretKey: S3_HOST
      - envName: S3_BUCKET
        secretName: openbao-backup-s3
        secretKey: S3_BUCKET
      - envName: S3_URI
        secretName: openbao-backup-s3
        secretKey: S3_URI
    config:
      s3Host: ""                     # overridden by extraSecretEnvironmentVars (from kv)
      s3Bucket: ""                   # overridden (from kv)
      s3Uri: ""                      # overridden (from kv + openbao/ prefix)
      s3ExpireDays: "14"             # job behavior (not a shared secret): rotating retention
      baoAuthPath: kubernetes        # job behavior
      baoRole: snapshot              # job behavior
    securityContext:
      pod:
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      container:
        allowPrivilegeEscalation: false
        capabilities: { drop: [ALL] }
```

**`ExternalSecret`** (pulls **all** S3 settings from the shared `kv/s3-backup` and composes
the env keys the agent's `s3cmd` expects; same store/pattern as `omada-backup-s3`). It uses
`target.template` so `S3_URI` = `s3://<bucket>/openbao/` is built from the secret's `bucket`
property plus the git-side prefix, and `S3_HOST` is scheme-stripped (s3cmd wants a bare host,
but the shared value may carry `https://` for Omada's rclone):

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: openbao-backup-s3
  namespace: secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: openbao
    kind: ClusterSecretStore
  target:
    name: openbao-backup-s3
    creationPolicy: Owner
    template:
      engineVersion: v2
      data:
        AWS_ACCESS_KEY_ID: "{{ .access_key_id }}"
        AWS_SECRET_ACCESS_KEY: "{{ .secret_access_key }}"
        # s3cmd S3_HOST must be a bare host — strip any scheme the shared value carries.
        S3_HOST: "{{ .endpoint | trimPrefix \"https://\" | trimPrefix \"http://\" }}"
        S3_BUCKET: "{{ .bucket }}"
        S3_URI: "s3://{{ .bucket }}/openbao/"   # only the openbao/ prefix is git-side
  data:
    - secretKey: access_key_id
      remoteRef: { key: s3-backup, property: access_key_id }
    - secretKey: secret_access_key
      remoteRef: { key: s3-backup, property: secret_access_key }
    - secretKey: endpoint
      remoteRef: { key: s3-backup, property: endpoint }
    - secretKey: bucket
      remoteRef: { key: s3-backup, property: bucket }
```

**Crossplane `Policy`** (least privilege — only what a snapshot needs):

```yaml
apiVersion: vault.vault.upbound.io/v1alpha1
kind: Policy
metadata:
  name: snapshot
spec:
  deletionPolicy: Orphan
  providerConfigRef: { name: openbao }
  forProvider:
    name: snapshot
    policy: |
      path "sys/storage/raft/snapshot" {
        capabilities = ["read"]
      }
```

**Crossplane `AuthBackendRole`** (binds the chart-created SA `openbao-snapshot`):

```yaml
apiVersion: kubernetes.vault.upbound.io/v1alpha1
kind: AuthBackendRole
metadata:
  name: snapshot
spec:
  deletionPolicy: Orphan
  providerConfigRef: { name: openbao }
  forProvider:
    backend: kubernetes
    roleName: snapshot
    boundServiceAccountNames: [openbao-snapshot]
    boundServiceAccountNamespaces: [secret]
    tokenPolicies: [snapshot]
    tokenTtl: 900
    tokenMaxTtl: 3600
```

Conventions: `deletionPolicy: Orphan` on every MR (never let deleting an MR delete the live
OpenBao object); pin all images to exact tag + digest; no secrets or endpoints-that-are-
credentials in git; keep header comments explaining *why* (the file explains the disk-loss
threat and the shared-bucket/secret reuse).

## Testing Strategy

No unit-test framework applies (declarative infra). Verification is behavioral, gated:

1. **Render** — `helm template` shows `CronJob/openbao-snapshot`, its `ConfigMap`, and SA;
   the CronJob's `env:` includes `S3_HOST`/`S3_BUCKET`/`S3_URI` from `openbao-backup-s3`
   (overriding the empty ConfigMap values) plus `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`;
   `BAO_ROLE` is `snapshot`; `BAO_ADDR` resolves to `http://openbao.secret.svc:8200`.
2. **Reconcile** — after `moon run secret:apply`: `ExternalSecret/openbao-backup-s3` is
   `SecretSynced`; the `snapshot` `Policy` and `AuthBackendRole` MRs are `Ready/Synced`.
3. **Auth** — a manual job run authenticates as role `snapshot` (check job logs for a
   successful `auth/kubernetes/login`, no `permission denied`).
4. **Upload** — after a manual run, `rclone ls s3:enigma-s3-backup/openbao/` shows a fresh
   `.snap` object; a second run adds another; objects past `S3_EXPIRE_DAYS` are pruned.
5. **Restore drill (the real test)** — download a snapshot and
   `bao operator raft snapshot restore` it into a **scratch** OpenBao configured with the
   **same static seal key** (`openbao-seal`), then confirm a known kv key reads back.
   Snapshots are encrypted with the barrier key derived from the seal key, so restore
   REQUIRES the same seal key — document this alongside the backup.
6. **Idempotence** — `moon run secret:apply` twice leaves resources unchanged.

## Boundaries

- **Always:**
  - Source **all** S3 settings from the shared `kv/s3-backup` secret; the only new,
    git-side value is the `openbao/` prefix. Do **not** hardcode host/bucket/keys in
    `values.yaml`, and do **not** add openbao-specific keys (prefix, expire days) to the
    *shared* secret (that would couple it to Omada).
  - Keep the `snapshot` policy least-privilege (only `sys/storage/raft/snapshot`).
  - Put policy/role as Crossplane MRs with `deletionPolicy: Orphan`; keep the self-init
    stanza untouched.
  - Pin the agent image by tag **and** digest.
  - Run `trunk fmt` / `trunk check` before committing.
- **Ask first:**
  - Changing the schedule, retention window, or bucket/prefix from the values agreed here.
  - Any change to `values.yaml` beyond the additive `snapshotAgent` block (the seal/raft/
    self-init config is load-bearing).
  - Adding a new OpenBao auth method or broadening the snapshot policy (e.g. if `sudo` turns
    out to be required — see Open Questions).
  - Falling back to a custom rclone CronJob if the agent proves incompatible with Hetzner
    (see Risks).
- **Never:**
  - Commit S3 credentials, tokens, or the seal key to git.
  - Put snapshots and the seal key in the **same** location (a snapshot + its seal key = full
    plaintext compromise). Seal key stays only in the `openbao-seal` K8s Secret.
  - `kubectl delete` the Crossplane Configuration/MRs in a way that orphans or destroys live
    OpenBao state (see `apps/secret/CLAUDE.md` gotchas).
  - Add snapshot config to the self-init stanza.

## Risks & Open Questions

1. **`s3cmd` vs Hetzner (highest risk).** The chart's agent uploads with `s3cmd`, which is
   fussier with non-AWS S3 than Omada's `rclone`. Hetzner Object Storage may need explicit
   host-bucket/path-style/region handling. The chart only exposes `S3_HOST`, `S3_BUCKET`,
   `S3_URI`, and `S3CMD_EXTRA_FLAG`. **Verify with a manual run early**; if it fails, use
   `S3CMD_EXTRA_FLAG` (e.g. host-bucket/signature flags) or fall back to a custom
   rclone CronJob that mirrors Omada exactly. → *Ask-first before switching approaches.*
2. **`S3_HOST`/`S3_BUCKET`/`S3_URI` source — RESOLVED.** All come from `kv/s3-backup` via the
   `ExternalSecret` + `snapshotAgent.extraSecretEnvironmentVars` (container `env:` overrides
   the chart's ConfigMap). `config.s3*` are left empty placeholders. Watch for: (a) the shared
   `endpoint` value's scheme — s3cmd wants a bare host, so the template strips `http(s)://`
   (Omada's rclone tolerates either); (b) whether the shared `endpoint` includes a port or
   region-specific hostname that s3cmd path-style addressing needs — verify in the manual run.
3. **Snapshot path privilege.** `sys/storage/raft/snapshot` may be sudo-protected depending
   on OpenBao version. If a manual run returns `permission denied`, add `sudo` to the policy
   capabilities (`["read", "sudo"]`) — surfaced as an ask-first widening.
4. **Retention volume.** Hourly × 14 days = ~336 snapshots. They're tiny (data PVC is 1Gi),
   but if this is undesirable, reduce `S3_EXPIRE_DAYS` (e.g. 7). Confirmed acceptable for
   now.
5. **Restore prerequisite.** DR requires the `openbao-seal` static key. Ensure that key is
   itself durably recorded out-of-band (it is generate-once and `helm.sh/resource-policy:
   keep`), otherwise snapshots are unrestorable. Consider documenting/backing up the seal
   key separately (not in the snapshot bucket).

## Success Criteria (testable)

- [ ] `CronJob/openbao-snapshot` present, schedule `0 * * * *`, on the `secret` cluster.
- [ ] Manual run authenticates as `snapshot` role and exits 0.
- [ ] `.snap` object appears under `s3://enigma-s3-backup/openbao/`.
- [ ] Objects older than `S3_EXPIRE_DAYS` are pruned.
- [ ] No credentials/seal key in git; `ExternalSecret` is `SecretSynced`.
- [ ] `snapshot` `Policy` + `AuthBackendRole` MRs are `Ready`.
- [ ] Restore drill into a scratch OpenBao (same seal key) reads back a known kv value.
