# Design

## Context

See `proposal.md` — Why. The constraints that shape the approach, all verified in `plan.md`
(2026-10-21) or against this worktree:

- **release-please reads exactly one config file.** There is no per-directory discovery and no
  per-project config, so aggregation at the repo root is mandatory.
- **Manifest mode routes commits to packages by file path, not commit scope.** The repo's
  existing `feat(openbao):` / `fix(network,secret):` conventions need no cleanup for this to
  work.
- **release-please is a label state machine, not a function of repo state.** A merged release PR
  carries `autorelease: pending`; tagging strips it and applies `autorelease: tagged`. On a
  workflow re-run no candidate PR remains, so `releases_created=false` and `paths_released=[]`.
  Anything gated on those outputs is skipped and the workflow **goes green having published
  nothing**.
- **`regctl` cannot distinguish failure modes by exit code.** Tag-404, repository-`NAME_UNKNOWN`,
  and host-unreachable all exit 1; only "exists" exits 0. Distinguishing them requires reading
  stderr. `bin/regctl` (0.11.1) is already hermit-managed and already a declared file group
  (`regctl_bin` in `.moon/tasks/tasks.yml:23`).
- **The pinned `plugin_sha256` is the sha256 of the plugin *binary inside* the image, per
  architecture** — not the image manifest digest. OpenBao hashes the file it finds in
  `plugin_directory` and compares. Both clusters are arm64. `sys/plugins/catalog` requires the
  field, so it cannot be dropped.
- **A moon task with no `outputs` is still hashed and cached.** `runInCI: false` gates only
  `moon ci`; an explicit `moon run <project>:release` still executes.
- Current state: `release.sh` hard-codes `VERSION="${VERSION:-0.1.3}"` / `0.1.0`;
  `release-openbao-netbird-plugin.yaml` passes `VERSION: 0.1.3` on a path filter;
  `release.yaml` is commented out; `renovate.json:5` sets `semanticCommitType: "chore"`
  globally.

### Pre-flight results (tasks 1.1–1.4, measured 2026-10-21)

All four checks were run before any code was written; none invalidated the design.

**1.1 — `sha256` is required.** OpenBao v2.5.5 (`028992583c`, the running server) rejects a
catalog registration without it:

```
PUT /v1/sys/plugins/catalog/secret/zz-preflight-nosha  →  400  * missing SHA-256 value
```

and the entry is not created. D5's write-back mechanism is therefore necessary, not optional.

**1.2 — `main` is protected, but `vgijssel-bot` bypasses it.** The `protected-main` ruleset
(id 8160790, `~DEFAULT_BRANCH`, `enforcement: active`) carries `deletion`, `non_fast_forward`,
**`required_signatures`**, `pull_request` (squash-only, 0 approvals) and five
`required_status_checks`. A plain CI push would be rejected twice over — no PR, and unsigned.
But `bypass_actors` holds team `vgijssel/bot` (`actor_id: 14203826`) at
`bypass_mode: always`, and that team's sole member is **`vgijssel-bot`** — the identity behind
`RELEASES_TOKEN_GITHUB`. So D5's direct push to `main` stands as designed, and it must be made
**as `vgijssel-bot`**: any other identity (including the repo owner, whose
`current_user_can_bypass` reads `never`) cannot push to `main` at all.

**1.3 — `GITHUB_TOKEN` with `packages: write` can push to `ghcr.io/vgijssel/setup/*`.**
Demonstrated by existing state rather than a throwaway tag:
`.github/workflows/release-openbao-netbird-plugin.yaml` authenticates with
`secrets.GITHUB_TOKEN` and `permissions: packages: write`, and
`ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.3` resolves today. `PACKAGES_TOKEN_GITHUB`
is not needed. `plan.md`'s "no credential carries `write:packages`" is about *local*
credentials — which is why `release-local.sh` exists — not about the workflow token.
`gh api /orgs/vgijssel/packages?package_type=container` also confirms the §1 drift directly:
`setup/openbao-plugin-secrets-netbird` exists and is **public**, and
`setup/openbao-plugin-secrets-cloudflare` is absent entirely.

**1.4 — `regctl` 0.11.1 stderr, verified against real references.** `http 404` appears in both
absent states; the ambiguous state carries neither string:

| Reference | stderr | rc |
|---|---|---|
| `…-netbird:0.1.3` (exists) | *(digest on stdout)* | 0 |
| `…-netbird:0.1.4` (tag absent) | `request failed: not found [http 404]:` | 1 |
| `…-cloudflare:0.1.0` (repo absent) | `request failed: not found [http 404]:` | 1 |
| `nonexistent-registry.invalid/foo/bar:1.0` | `dial tcp: lookup …: no such host` | 1 |

Two refinements this forces on D6:

- ghcr never emits `NAME_UNKNOWN` — it answers `http 404` for an unknown *repository* too. The
  `NAME_UNKNOWN` branch is kept for registries that are spec-compliant here, but on ghcr it is
  dead code, so the `http 404` match is what actually carries the contract.
- ghcr also answers `http 404` for a repository that exists but is **private and
  unauthenticated** — it does not distinguish "absent" from "not yours". So an unauthenticated
  probe of a private published tag reads as absent. This is survivable rather than correct: the
  push that follows is unauthenticated too and fails with `denied`, so no tag is mutated. The
  invariant the helper actually relies on is that the probe and the push use the *same*
  credentials, which `publish.yaml` guarantees by doing `docker/login-action` before either.

## Goals / Non-Goals

**Goals:**

- Two packages reach the registry from one release approval, at independent versions.
- Publishing converges from committed state + registry state, so it is safe to re-run, schedule,
  and retry after a partial failure.
- A consumer's image tag and its content checksum are never committed out of step with each
  other.
- The first run reconciles the `plan.md` §1 drift without any version bump — by publishing the
  versions the cluster already pins.

**Non-Goals:**

- Writing a general release framework. Two packages are enumerated explicitly; generalising the
  opt-in is deferred (`plan.md` §4b).
- Reproducible builds. The design assumes the published binary's sha256 is discovered
  **after** the build, never predicted before it.
- Changing how OpenBao registers plugins. The catalog keeps its binary-checksum pin; this change
  only automates who writes it.

## Decisions

### D1 — release-please in manifest mode, hand-written root config

`release-please-config.json` + `.release-please-manifest.json` at the repo root, naming both
packages with `release-type: "simple"`.

- `separate-pull-requests: false` — one release PR covering both packages, which is the
  "multiple packages from one monorepo" demonstration.
- `include-component-in-tag: true`, `tag-separator: "@"`, **`include-v-in-tag: false`** — tags
  read `openbao-netbird-plugin@0.1.5`, matching the repo's legacy tag shape. The third option
  was missing from this decision and a dry run caught it: `include-v-in-tag` defaults to
  **true**, so the first dry run proposed `openbao-netbird-plugin@v0.1.4`, while all 239
  legacy `<component>@<version>` tags (`blueorange@0.2.0`, …) carry no `v`.
- `component` set explicitly per package rather than derived from the path.
- `bootstrap-sha` pinned to this change's merge commit. Without it release-please scans ~239
  legacy tags from the changesets/nx era and starts both packages at `1.0.0`.

  In practice it is pinned to `0b2c307a` — the `main` HEAD this change is rebased onto, i.e.
  the **parent** of its merge commit, which is knowable before the merge whereas a squash
  commit's own SHA is not. The merge commit is therefore scanned; it proposes nothing because
  it is typed `chore`, which is the second guard D5 relies on anyway. Verified by dry run
  (2026-10-21): `commits: 2`, both packages resolving from the manifest at `0.1.4` / `0.1.0`
  rather than `1.0.0`, and `Would open 0 pull requests` — D8's bootstrap exactly.

  A `bootstrap-sha` that is **not an ancestor** of the branch being evaluated is silently
  ignored, and the scan then runs to the beginning of history. The first dry run here hit that:
  run against the pre-rebase branch, it walked back past `0b2c307a` and attributed `#1008` and
  `#1012` to the netbird plugin. It looks like a broken config and is not one — it is a stale
  branch. Rebase before reading a dry run.
- `extra-files` is **empty**. See D3 and D5: the version lives in `version.txt`, which
  `release-type: "simple"` maintains natively, and the consumer pins are deliberately not
  release-please's business.

*Alternative — the moon-metadata generator (`plan.md` §4b):* a `libs/release` project reading
`moon query projects --json` and generating this file, guarded by a `--check` task. Rejected for
now: for two packages the generator is larger than the file it generates. `project.metadata` is
free-form in moon's schema and round-trips through `moon query`, so this stays available
unchanged if a third or fourth package is onboarded.

*Alternative — changesets:* rejected. Mutually exclusive input model (commit messages vs
`.changeset/*.md`), no bridge. This repo has already run both and still carries artifacts of the
changesets era.

*Alternative — `release-type: "go"`:* produces a CHANGELOG only, with no version file for
`release.sh` to read, which would leave the version hard-coded. `"simple"` maintains
`version.txt`, which is exactly the single source D3 needs.

### D2 — Human merges the release PR

Chosen for the first releases, so the version decision and changelog are seen before anything
ships. Auto-merge is a one-setting change later with no redesign, precisely because D4 makes
publishing independent of how the PR got merged.

### D3 — `version.txt` is the single source of version truth

Each `release.sh` reads its sibling `version.txt` and **has no default**:

```bash
VERSION="$(cat "${SCRIPT_DIR}/version.txt")"   # no ${VERSION:-...} fallback
```

A missing or empty file fails the script. The current `${VERSION:-0.1.3}` form is what let the
workflow publish 0.1.3 while `values.yaml` pinned 0.1.4 — a fallback version is a silent wrong
answer, so there is no fallback.

`moon.yml`'s `release` task takes `inputs: [version.txt]` and nothing else. Adding `src/**` or
`Dockerfile` would mean a source change without a version bump re-pushes the *same* tag with
different content — tag mutation, which invalidates every `plugin_sha256` pin downstream.

### D4 — Two independent workflows; publish is never gated on the release step

| Workflow | Trigger | Owns |
|---|---|---|
| `release-please.yaml` | `push: main` | version decisions: `version.txt`, CHANGELOG, tag, GitHub Release |
| `publish.yaml` | `push: main` + nightly `schedule` | artifact convergence and consumer pins |

`publish.yaml` knows nothing about release-please. It does not read `releases_created` or
`paths_released`, for the reason in Context: those outputs are not reproducible on a re-run, and
a design that depends on them reports success while publishing nothing. Instead it asks the
registry what is missing and fixes it. Consequences:

- Re-running the whole workflow after a failure is correct, not just "re-run failed jobs".
- `GITHUB_TOKEN`'s push-event recursion guard stops being fatal: if a release-PR merge does not
  fire `push`, publish converges on the next push or on the nightly run. A delayed release
  rather than a lost one.
- The nightly schedule is free *because* the work is idempotent.

`publish.yaml` carries `concurrency: { group: publish-main, cancel-in-progress: false }`. Two
concurrent runs would race on the write-back commit in D5; cancelling mid-run could abort between
a push and its pin commit.

The two `release` tasks are invoked **explicitly** —
`moon run openbao-netbird-plugin:release openbao-cloudflare-plugin:release` — not via
`moon run :release`, which would also fire the broken `fleet-mcp` / `devcontainer` scripts and
the carved-out `talos-image`. This enumeration is the one piece D1's deferred generator would
replace.

### D5 — Pins propagate in one post-publish commit, written by the publish job

After both publishes succeed, the job computes each plugin binary's arm64 sha256 from the
published image and writes, in a **single commit** to `main`:

- `apps/secret/src/openbao/values.yaml` → the two `extraInitContainers[*].image` tags
- `apps/secret/src/openbao-config/plugin-netbird.yaml` → `plugin_sha256`
- `apps/secret/src/openbao-config/plugin-cloudflare.yaml` → `plugin_sha256`

**release-please must not touch `values.yaml`.** It is technically capable of it — `extra-files`
with a `yaml` entry and a `jsonpath`, repo-root-relative via a leading `/` — but using it splits
the tag and the sha across two commits. Between them, `main` says "pull `:0.1.5`" while still
pinning 0.1.4's checksum, Fleet deploys that state, and plugin registration fails with a bare
"checksum mismatch". The atomicity requirement is the whole reason the image tag is written by
the publish job rather than by release-please.

Mechanism: a repo-level script, following the `bin/fleet-apply` / `bin/fleet-build` /
`bin/fleet-lint-targets` convention, so the same logic is runnable by hand and the workflow stays
thin. It edits with `yq` (already a declared `yq_bin` file group) and commits only if the
resulting diff is non-empty — satisfying the spec's "re-propagating correct pins is a no-op".
Commit as `vgijssel-bot` with a `chore(secret):` subject.

The commit touches only `apps/secret/**`, which is outside both release-please package paths, so
it cannot route to a package and cannot propose a further bump. The `chore` type is a second,
independent guard on the same property.

`libs/openbao-cloudflare-plugin/plugin-sha.sh` already does the per-architecture computation
(including the non-obvious `--entrypoint sha256sum`, required because the image's ENTRYPOINT *is*
the plugin binary). The netbird plugin has the same logic inlined in `release-local.sh`; it gets
a matching `plugin-sha.sh` and `plugin_sha` task so both projects present the same interface.

*Alternative — a second PR instead of a direct commit:* rejected per decision; it keeps `main`
self-consistent too but costs a human merge per release.

*Alternative — keep the sha out of git*, written by the publish job into a Secret or OpenBao kv
and read by the catalog Workspace as a var: rejected. Git would stop describing what the cluster
runs, and `openbao-config` — a `dependsOn` target for bundles downstream — would gain a
cold-start dependency on a value that only exists after a publish.

*Alternative — compute the sha in-cluster:* rejected on its own merits. The pin exists so that
something outside the cluster asserts which binary is intended; a cluster-computed checksum
validates nothing, it rubber-stamps whatever arrived.

### D6 — Three-state registry probe, in one shared helper

The probe lives in a single repo-level script, `bin/registry-tag-exists <ref>`, with a
three-state exit contract:

| Exit | Meaning | Caller's obligation |
|---|---|---|
| `0` | present | skip, succeed |
| `10` | positively absent (`http 404` or `NAME_UNKNOWN`) | publish |
| any other | ambiguous — unreachable, unauthorised, unparsed | fail, do not publish |

```bash
# bin/registry-tag-exists
set +e; err=$(regctl manifest head "$1" 2>&1 >/dev/null); rc=$?; set -e
[ "$rc" -eq 0 ] && exit 0
printf '%s' "$err" | grep -qE 'http 404|NAME_UNKNOWN' && exit 10
printf 'registry probe failed, not a 404: %s\n' "$err" >&2; exit 1
```

Each `release.sh` then reduces to a three-line call. Inlining the guard in both scripts was the
obvious first shape, but it puts the one piece of logic whose failure mode is silent into two
places that will drift; a shared helper also gives the behaviour a single place to be tested.
This follows the existing `bin/fleet-build` / `bin/fleet-lint-targets` convention, and the
`release` tasks gain `@group(regctl_bin)` plus `/bin/registry-tag-exists` as inputs.

Two rules this encodes:

1. **Never fail open to skipping.** Probe the real system; treat only an explicit "absent" as
   permission to act; treat ambiguity as failure. The residual bug otherwise is specific and
   bad: a transient probe failure followed by a *successful* push re-pushes an existing tag,
   producing a new digest and invalidating `plugin_sha256`.
2. **One guard per observable side effect, not per task.** Today `release.sh` has exactly one
   effect, so one guard at the top is right. The pin write-back is deliberately kept **outside**
   `release.sh` (D5) — were it inside, a registry hit would short-circuit and the pins would
   never be written. This is not hypothetical: it is exactly the shape of bug that would make
   the first bootstrap run (D8) publish both images and then skip writing the pins, because
   bootstrap is the one case where the guard and the write-back disagree about whether there is
   work to do.

Because the helper is where a silent wrong answer would do the most damage, it gets the change's
one unit test: a `bats` suite (the harness already exists, used by `.devcontainer/tests` and
`libs/coder-devcontainer-kubernetes/tests`) driving a stubbed `regctl` on `PATH` through all
three states.

With this guard, moon's `cache: true` and `--affected` become pure speed optimisations that can
be added or removed without changing behaviour.

### D7 — Renovate updates to these directories are releasable

```jsonc
{ "matchFileNames": ["libs/openbao-netbird-plugin/**", "libs/openbao-cloudflare-plugin/**"],
  "semanticCommitType": "fix" }
```

Both plugins run on `FROM alpine:3.24.1`. Under the repo-global `chore` type, an alpine CVE bump
changes the shipped image but produces no version bump — and D6's guard then *correctly* refuses
to re-push the existing tag. Net effect without this rule: base-image CVE fixes silently never
reach the cluster. The lever is in renovate, not release-please.

**Correction (task 8.2, 2026-10-21): the note that followed here was wrong.** It read that the
existing automerge rule (`matchUpdateTypes: [minor, patch]` with
`matchCurrentVersion: "!/^0/"`) "does not apply to these 0.x packages, so their dependency PRs
still land by hand". `matchCurrentVersion` matches the **dependency's** current version, not the
version of the package containing it. `alpine:3.24.x` and `golang:1.25.x` do not start with `0`,
so `!/^0/` matches them and the rule *does* apply.

Verified against history rather than reasoning: PR #1060,
`chore(deps): update alpine docker tag to v3.24.2`, which touches
`libs/openbao-netbird-plugin/Dockerfile`, was merged **by `app/renovate` 16 minutes after it was
opened**.

This is accepted rather than fixed, and the reason is that it does not move the gate D2 cares
about. The sequence becomes: dependency PR automerges → the commit is now typed `fix` and routes
to the package → release-please proposes a bump → **a human merges the release PR** → publish.
The human still sees the version decision before anything ships; what changed is that a CVE bump
reaches that decision without a hand-merge first, which is the outcome this rule exists to
produce. Suppressing automerge for these two directories would be the alternative, and would only
add a second hand-merge in front of the one that already exists.

### D8 — Bootstrap by publishing what the cluster already pins

`version.txt` is seeded to the **currently pinned** versions — netbird `0.1.4`, cloudflare
`0.1.0` — not to the latest published ones. Because `publish.yaml` publishes whatever
`version.txt` declares, independent of any version decision (D4), the first run on merge
publishes exactly the two tags `values.yaml` already references. The `plan.md` §1 drift is
reconciled with no release PR and no version bump. `.release-please-manifest.json` is seeded to
the same two values so the next real change bumps from there.

### D9 — Retire the hard-coded workflow

`.github/workflows/release-openbao-netbird-plugin.yaml` is deleted: a path-filtered trigger with
`VERSION: 0.1.3` re-pushes one fixed tag on every plugin change, which is precisely the
tag-mutation D3 and D6 exist to prevent. The commented-out body of `.github/workflows/release.yaml`
is removed along with its `# TODO: Need to replace release pipeline with something else`.

## Risks / Trade-offs

- **The first publish may change the checksum of an already-pinned version.** The currently
  pinned shas were computed from locally-built images; a CI build of the same source may differ
  bit-for-bit, so the write-back may legitimately rewrite both `plugin_sha256` values for
  unchanged version numbers. → Expected and correct. But it interacts with the next item.

- **The cluster's locally-loaded image will not be re-pulled, and will then mismatch the new
  pin.** `release-local.sh` side-loaded `0.1.4` into the node's containerd, and the init
  container pins a tag, so `imagePullPolicy` defaults to `IfNotPresent` — the node keeps the
  local image while the pin now describes the registry's. Registration fails with a bare
  "checksum mismatch". → After the first publish, remove the side-loaded images from the node's
  containerd (or recreate the cluster) so the registry copy is pulled. Covered in the migration
  plan.

- **Branch protection may reject the write-back push.** A direct commit to `main` from CI needs a
  token permitted to push, and `GITHUB_TOKEN` cannot push to a protected branch. →
  `RELEASES_TOKEN_GITHUB` / `vgijssel-bot` already exists for exactly this. Verify before
  building; if `main` requires a PR, D5 falls back to opening one, which changes no specs.

- **No token currently carries `write:packages`.** `plan.md` records this as why the cloudflare
  repository has never existed; `release-local.sh` exists as the workaround. → This is the first
  thing that genuinely needs it. The publish job requests `packages: write`; confirm the job's
  `GITHUB_TOKEN` suffices for `ghcr.io/vgijssel/setup/*` before relying on
  `PACKAGES_TOKEN_GITHUB`.

- **A new ghcr repository is private by default.** The init containers pull with no credentials,
  so a private `openbao-plugin-secrets-cloudflare` fails to pull exactly as the current 404 does.
  → Set the package public immediately after the first publish and verify an unauthenticated
  pull. This is a one-time manual step that no pipeline can do for us.

- **A nightly schedule plus a never-resolving failure is a nightly alert.** If a version is
  declared but unpublishable, every scheduled run fails. → That is the intended behaviour
  ("publishing nothing is never reported as a successful release"), but it means the schedule
  must be quiet when healthy, which D6's skip path provides.

- **`version.txt` as the sole `release` task input means a source change alone never republishes.**
  That is deliberate (immutable versions), but it makes "I changed the plugin and nothing
  happened" a supported outcome rather than a bug. → The conventional-commit type is what makes
  a change ship; D7 extends that to dependency updates, which is where the gap actually was.

- **A stuck `autorelease: pending` label blocks all future release PRs**, and
  `skip-github-release: true` would also suppress the git tag, aborting every subsequent run. →
  Do not rename release-please's labels without setting `label` / `release-label`, and do not set
  `skip-github-release`.

## Migration Plan

1. Land the change with `version.txt` seeded to `0.1.4` / `0.1.0` (D8). No release PR is involved.
2. On merge, `publish.yaml` publishes both tags. Verify both resolve with
   `regctl manifest head`.
3. Make the `openbao-plugin-secrets-cloudflare` ghcr package public; verify an unauthenticated
   pull.
4. Confirm the write-back commit landed and that `values.yaml` tags and both `plugin_sha256`
   values are consistent in that one commit.
5. Remove the side-loaded plugin images from the secret cluster's node containerd so the registry
   copies are pulled, then confirm both engines register (no "checksum mismatch") and
   `openbao-config` reconciles.
6. Exercise idempotence: re-run `publish.yaml` unchanged and confirm it pushes nothing, produces
   no commit, and succeeds.
7. Exercise the real path: land a `fix:` touching both plugin directories, confirm one release PR
   covering both packages, merge it, and confirm two tags, two images, and one pin commit.

**Rollback:** the pieces are separable. Disabling `publish.yaml` stops all publishing while
leaving version decisions intact; deleting `release-please-config.json` stops version decisions
while leaving publishing able to converge on whatever `version.txt` declares. Reverting the whole
change restores the hand-built `release-local.sh` path, since published tags are never deleted.

## Open Questions

- Whether to attach the plugin binaries as GitHub Release assets in addition to the ghcr image.
  Nothing consumes them; the image is linked to the repo by the
  `org.opencontainers.image.source` label `release.sh` already sets. Deferrable — it affects no
  requirement.
