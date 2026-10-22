# Design

## Context

See `proposal.md` — Why. The constraints that shape the approach, each verified against the
live systems or this worktree on 2026-10-21:

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
`RELEASES_TOKEN_GITHUB`. Any other identity, including the repo owner (whose
`current_user_can_bypass` reads `never`), cannot push to `main` at all.

> **This finding was acted on and then superseded.** It said the direct push *could* work, and the
> original D5 took that as permission to do it. D5 has since been revised to open a PR instead —
> not because the push was blocked, but because a pin pushed to `main` is a pin nothing validated.
> The bypass is therefore no longer used by anything. The identity is still `vgijssel-bot`, now for
> the reason in **D13**: a PR opened with `GITHUB_TOKEN` triggers no CI, so the five
> `required_status_checks` recorded above would never report and the PR could never be merged.
> Note how the two halves of this ruleset changed roles — `bypass_actors` stopped mattering and
> `required_status_checks` became the binding constraint.

**1.3 — `GITHUB_TOKEN` with `packages: write` can push to `ghcr.io/vgijssel/setup/*`.**
Demonstrated by existing state rather than a throwaway tag:
`.github/workflows/release-openbao-netbird-plugin.yaml` authenticates with
`secrets.GITHUB_TOKEN` and `permissions: packages: write`, and
`ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.3` resolves today. `PACKAGES_TOKEN_GITHUB`
is not needed. The "no credential carries `write:packages`" problem is about *local*
credentials — which is why `release-local.sh` exists — not about the workflow token.
`gh api /orgs/vgijssel/packages?package_type=container` also confirms the drift directly:
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
- The first run reconciles the ghcr drift without any version bump — by publishing the
  versions the cluster already pins.

**Non-Goals:**

- Writing a general release framework. Two packages are enumerated explicitly; generalising the
  opt-in is deferred.
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

*Alternative — a moon-metadata generator:* a `libs/release` project reading
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

The `release` tasks are selected by **tag**, not enumerated:
`moon run :release --query "tag=releasable"`. A bare `moon run :release` would also fire the
broken `fleet-mcp` / `devcontainer` scripts and the carved-out `talos-image` — those five are
the projects that currently define a `release` task — which is why the first draft listed the
two plugins literally. A list in a workflow is a list that goes stale, so the opt-in moved into
the projects themselves: a project is releasable because it says it is. Verified that the query
restricts correctly (2026-10-21): `moon run :release --query "tag=go"` resolved to exactly
`openbao-cloudflare-plugin:release` and `openbao-netbird-plugin:release`, with the other three
excluded. `tag=releasable` replaces `tag=go` so the set is about release-ability rather than
language. Onboarding a third package is one line in its `moon.yml`, and this is also what D1's
deferred config generator would have been for.

### D5 — Pins propagate as a PULL REQUEST, opened by `release:self_upgrade`

> **Revised 2026-10-21.** This decision originally had the publish job commit the pins straight
> to `main`. It no longer does, and the reason is one the original framing missed: a pin commit
> pushed to `main` has, by construction, never been validated against the apps that deploy it.
> It asserts "this checksum describes this image" — which `bin/openbao-plugin-pin` verifies —
> but says nothing about whether the newly published plugin actually *works* once Fleet rolls
> it out. Pushing it to `main` makes the deployed state the place that question gets answered.
> Routing it through a PR instead puts CI between the publish and the cluster, which is the
> whole point of having CI. The atomicity requirement is unchanged; only the delivery is.

After both publishes succeed, `publish.yaml` runs `moon run release:self_upgrade`. That task
computes each plugin binary's arm64 sha256 from the **published** image and writes, in a
**single commit on a branch**, then opens a PR against `main`:

- `apps/secret/src/openbao/values.yaml` → the two `extraInitContainers[*].image` tags
- `apps/secret/src/openbao-config/values.yaml` → `plugins.<name>.version` and
  `plugins.<name>.sha256` (see D11)

A human merges it (chosen for the same reason as D2). The commit is still atomic — both halves
of every pin move together or not at all — so no *committed* state ever mismatches, on the
branch or on `main`.

Consequences of the PR shape that the direct push did not have:

- **It must converge, not accumulate.** Publishing runs on every push to `main` and nightly, so
  a naive "open a PR" would open one per run. The task therefore reuses a single fixed branch
  (`chore/openbao-plugin-pins`): if the computed pins match what that branch already carries *and*
  its PR is open, it does nothing; if they differ, it force-updates the branch and lets the
  existing PR follow. One outstanding proposal, always describing the newest publish.

  **The outstanding proposal is two things — a branch AND an open PR — and they come apart.** The
  first implementation compared only the branch's tree, which reads "the branch is correct" as "a
  proposal exists". That is wrong, and it bit on the very first real run (2026-10-22): the push
  succeeded and `gh pr create` was then rejected by a PAT lacking `Pull requests: write`, leaving
  a branch carrying exactly the right pins with no PR. A re-run would have matched the tree,
  skipped, and **reported success having proposed nothing** — the same fail-open-to-skipping shape
  D6 rule 1 exists to forbid, reintroduced one layer up. It also silently falsified this decision's
  own claim that a PR closed unmerged is re-opened by the next run: with a tree-only check it never
  would be. Both conditions are now checked, with the three states separated — matching branch with
  no open PR *proposes without re-pushing*, so identical content never churns the PR. Six bats
  cases cover it, and a mutation check confirms reverting to the tree-only test fails two of
  them.
- **Branch protection stops mattering for the pins.** The write path is now "push a branch +
  open a PR", which needs no bypass of `protected-main`. The bot identity is still used, but
  the `required_signatures` / `pull_request` rules are satisfied the ordinary way.
- **The nightly run becomes the retry.** If the PR is closed unmerged, the next run re-opens it.

*Alternative — Renovate for the whole job:* rejected on a hard technical limit, not preference.
Renovate can bump the image **tag** (a regex manager over D11's `values.yaml`, docker datasource
against `ghcr.io/vgijssel/setup/openbao-plugin-secrets-*`), but it cannot compute
`plugin_sha256`: that is the sha256 of a **file inside** the image, and Renovate knows registry
manifest digests, not file checksums. Pointed at these pins it would move the tag and leave the
checksum behind — exactly the half-updated state this decision exists to forbid. Renovate keeps
the job it can do correctly: the plugins' own inputs (alpine, golang, go modules), typed `fix`
per D7 so they produce version bumps. `release:self_upgrade` owns the pins, because computing
the sha requires pulling the published image, and only something in this repo does that.

*Alternative — keep the direct push and add a post-merge validation:* rejected. It inverts the
order: the cluster finds the problem first and CI confirms it afterwards.

**release-please must not touch `values.yaml`.** It is technically capable of it — `extra-files`
with a `yaml` entry and a `jsonpath`, repo-root-relative via a leading `/` — but using it splits
the tag and the sha across two commits. Between them, `main` says "pull `:0.1.5`" while still
pinning 0.1.4's checksum, Fleet deploys that state, and plugin registration fails with a bare
"checksum mismatch". The atomicity requirement is the whole reason the image tag is written by
the publish job rather than by release-please.

Mechanism: `libs/release`, a moon project exposing `self_upgrade` (write + propose) and
`self_upgrade_check` (assert the committed pins are internally consistent, for CI). The writing
is done by `bin/openbao-plugin-pin`, following the `bin/fleet-apply` / `bin/fleet-build` /
`bin/fleet-lint-targets` convention so the same logic is runnable by hand and the workflow stays
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

**The version is pinned in two bundles and that cannot be collapsed.** The init-container image
tag lives in the `openbao` chart's values; the catalog checksum lives in the `openbao-config`
bundle. Fleet has no mechanism for sharing values across bundles, and an image tag cannot come
from a ConfigMap, so the version necessarily appears in both. `self_upgrade` writes both in one
commit, and `self_upgrade_check` fails CI if they ever disagree — the duplication is accepted
but not left unguarded.

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
publishes exactly the two tags `values.yaml` already references. The ghcr drift is
reconciled with no release PR and no version bump. `.release-please-manifest.json` is seeded to
the same two values so the next real change bumps from there.

### D9 — Retire the hard-coded workflow

`.github/workflows/release-openbao-netbird-plugin.yaml` is deleted: a path-filtered trigger with
`VERSION: 0.1.3` re-pushes one fixed tag on every plugin change, which is precisely the
tag-mutation D3 and D6 exist to prevent. The commented-out body of `.github/workflows/release.yaml`
is removed along with its `# TODO: Need to replace release pipeline with something else`.

### D10 — The shared `release` task shape lives in a tag file, not in each project

`.moon/tasks/tag-releasable.yml` defines the `release` task once — command, the narrow
`inputs` of D3, `cache: false`, `runInCI: false` — and each releasable project opts in with
`tags: [releasable]`. This follows the repo's existing `.moon/tasks/tag-*.yml` convention
(`tag-fleet.yml`, `tag-pnpm-tool.yml`, …).

It matters more than tidiness: D3's narrow `inputs` are the mechanism that stops a source-only
change re-pushing a tag, and D6's `cache: false` is what keeps the registry the arbiter. Both
were duplicated per project, so onboarding a third package meant re-deriving two non-obvious
properties from scratch — and getting either wrong is silent. Declared once, they are inherited.

### D11 — `openbao-config` becomes a Helm chart so the pins are values, not text

The catalog registration is a `provider-opentofu` `Workspace` carrying inline HCL, and
`plugin_sha256` was a `vars` entry **inside** that embedded program. A checksum in that position
can only be changed by textual substitution: there is no path for `yq`, for Renovate, or for a
reviewer to see that the value is machine-maintained rather than hand-chosen.

So `apps/secret/src/openbao-config` converts from flat manifests to a **local Helm chart** — the
shape `apps/secret/src/openbao` already uses, and which Fleet auto-detects from `Chart.yaml`:

```
Chart.yaml                 # no dependencies; a plain local chart
values.yaml                # plugins.<name>.{version,sha256}  <- the only file self_upgrade writes
templates/*.yaml           # the 18 manifests, moved verbatim
```

Only the two plugin manifests reference the values; the other sixteen move unchanged. Verified
safe before committing to it: `grep -rn '{{'` over the directory found **nothing**, so Helm has
no sequence to misinterpret in the HCL, the policy documents, or the JWKS config.

`version` is carried in `values.yaml` beside `sha256` even though only `sha256` is interpolated
into the Workspace. It is what makes the file self-describing — "this checksum is of *that*
version" — gives `self_upgrade_check` something to compare the init-container tag against, and
gives a Renovate regex manager a tag to track with a docker datasource.

*Alternative — a ConfigMap consumed via `Workspace.spec.forProvider.varFiles`:* genuinely
viable, and confirmed supported (`kubectl explain workspace.spec.forProvider.varFiles` on the
live CRD shows `configMapKeyRef` + `format`). Rejected on two counts: the pins would live as a
tfvars blob *inside* YAML — better than inline HCL but still not a values file — and it adds a
second resource the Workspace cannot reconcile without, which is the exact failure mode
`plugin-cloudflare.yaml`'s own header warns about for this bundle, a `dependsOn` target whose
stalling blocks everything downstream.

*Alternative — one root-level file rendered into both bundles:* rejected. It removes the
cross-bundle duplication D5 notes, but replaces a value with committed codegen, and a `--check`
task is the cheaper way to get the same guarantee.

### D12 — The commit convention is enforced on the PR title, because that is what lands

`commitlint` is enabled two ways, and the split is not redundancy:

| Where | What it checks | Why |
|---|---|---|
| Trunk's `commitlint` **action** (commit-msg hook) | each commit message as it is written | fast feedback; catches the mistake at the keyboard |
| A `pull_request` CI job | the **PR title** | that is the message that reaches `main` |

The repository allows **squash merges only** (`protected-main`'s `allowed_merge_methods:
["squash"]`) and `squash_merge_commit_title` is `PR_TITLE` — both read from the API. So the
individual commit messages on a branch never enter `main`'s history; the PR title becomes the
conventional commit that release-please reads. Linting only the branch commits would enforce the
convention on exactly the messages that do not matter, and a git hook cannot run in CI at all.
Hence both, with the CI job on `pull_request: [opened, edited, synchronize, reopened]` so
retitling a PR re-checks it.

This was listed as out of scope in `proposal.md` ("a repo-wide convention change, independent of
releasing these two plugins"). That was wrong in one direction: version decisions are *derived*
from these messages, so a wrongly-typed subject does not merely look untidy, it silently ships
nothing — which is the same class of bug as D7. It is now in scope.

### D13 — A `vgijssel-bot` PAT, and why `GITHUB_TOKEN` cannot stand in

Both workflows authenticate as `vgijssel-bot` via `RELEASES_TOKEN_GITHUB`. Once D5 moved the pins
off a direct push to `main`, the original reason for that — being the only `bypass_actors` entry
on `protected-main` — stopped applying. A different reason took its place.

**Events triggered by `GITHUB_TOKEN` do not start workflow runs.** So a PR opened with it receives
no `pull_request` event and therefore no CI. In most repositories that is an annoyance; here it is
fatal twice over:

1. `protected-main` has five **required** status checks (`Trunk Check`, `Trunk Check Runner`,
   `Linux (1/2)`, `Linux (2/2)`, `macOS (1/1)`). A context that never reports leaves the PR at
   "Expected — waiting for status to be reported", so **nobody can merge it** —
   `github-actions[bot]` is not a bypass actor, and `current_user_can_bypass` reads `never` even
   for the repo owner.
2. The pin PR exists precisely so that CI answers "does the newly published plugin work in the
   apps that deploy it?" A PR no CI ever looks at is a slower push to `main`.

`release-please-action`'s own README states it plainly: a PAT is needed "if you want GitHub Actions
CI checks to run on Release Please PRs".

A near-miss worth naming, because it looks like the fix and is not: the repository setting **"Allow
GitHub Actions to create and approve pull requests"** (`can_approve_pull_request_reviews`, read as
`false` on 2026-10-22). Flipping it resolves `GitHub Actions is not permitted to create or approve
pull requests` — permission to *open* the PR. It does nothing about whether workflows then trigger
on it. Two separate mechanisms; only the first is a setting.

The existing evidence in this repository is the cleanest statement of the rule: all 52 bot-authored
PRs come from `app/renovate` — a GitHub **App**, not `GITHUB_TOKEN` — and they receive all five
checks, which is why `#1060` could automerge.

*Alternative — a GitHub App:* the better engineering answer, and rejected only on cost/benefit for
a two-package pipeline. An App's installation token is minted per run with a 1-hour TTL, so there
is nothing to rotate; its permissions scope to this repository and to exactly `contents: write` +
`pull-requests: write`; the org already runs five Apps, so the pattern is established; and an App
can create **signed** commits through the Contents API, which would settle the open question below
about the pin branch. The PAT was chosen because it already exists, is already wired into three
references across two workflows, and switching later is a few lines — this is not a one-way door.
A bot user costs nothing here (the org is on the `free` plan), so seat cost did not enter into it.

*The PAT's known weakness, accepted deliberately:* **it expires, and its death is quiet.** That is
not hypothetical — it is what happened. The secret set on 2025-09-16 expired, and from then every
push to `main` failed, unnoticed for months, because the workflow it gated
(`.github/workflows/release.yaml`) had its entire body commented out: a red run and a green run did
the same amount of work, so red on `main` *was* the normal state.

Two mitigations, because "remember to rotate it" is not one:

- Both workflows now do real work, so their failure is meaningful rather than ambient.
- Each opens with a **credential pre-flight** (`gh api user`) that fails with the action to take.
  Without it the symptom is `actions/checkout` reporting
  `fatal: could not read Username for 'https://github.com': terminal prompts disabled`, which
  reads like a missing username and is actually an auth rejection — the single most misleading
  part of the whole incident.

Set the replacement PAT to **no expiration**. A `classic` PAT with `repo` suffices; `workflow` is
not needed, because release-please only writes `CHANGELOG.md`, `version.txt` and the manifest for
these packages, none of which live under `.github/`.

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

- **Branch protection may reject the write-back push.** → **This happened, and D5 now routes the
  pins through a PR instead, so the risk is retired rather than mitigated.** `main` does require a
  PR; the fallback the original note anticipated is what shipped, and it changed no specs — the
  atomicity requirement was always about a single commit, not about where that commit landed. What
  replaced it is D13's constraint: the PR must be opened by something other than `GITHUB_TOKEN`,
  or no CI runs on it and the five required checks never report.

- **No *local* credential carries `write:packages`.** That is why the cloudflare
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
