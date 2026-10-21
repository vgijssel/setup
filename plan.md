# Release automation for the setup monorepo

Research findings and design for introducing release-please + Moon-driven publishing.

Everything marked **VERIFIED** was checked empirically against this repo, the live
registry, or release-please source on `main` (2026-10-21). Everything else is a
recommendation or an open decision.

---

## 1. Motivating bug: four artifacts are pinned but not published

**VERIFIED** via `regctl` and the PyPI JSON API:

| Project | Artifact | Actually published | Pinned / expected | State |
|---|---|---|---|---|
| `openbao-netbird-plugin` | ghcr image | `0.1.0 0.1.1 0.1.2 0.1.3` | `0.1.4` (`apps/secret/src/openbao/values.yaml:57`) | **404** |
| `openbao-cloudflare-plugin` | ghcr image | *repository `NAME_UNKNOWN`* | `0.1.0` (`values.yaml:63`) | **404** |
| `fleet-mcp` | PyPI `setup-fleet-mcp` | `0.7.3 … 0.12.1` | `pyproject.toml` says `0.0.0` | pipeline broken |
| `devcontainer` | ghcr `devcontainer:<v>` + `:latest` | digest-pinned in `.docker-version` | — | pipeline broken |

Both plugin images the OpenBao chart currently pins are **absent from ghcr** — the
cloudflare repository has never existed. This is the "unpublished plugin images"
cold-start blocker, reached without any release pipeline at all.

### Root cause

**VERIFIED**: both broken scripts read a `package.json` that no longer exists.

```
.devcontainer/release.sh:46     node -p "require('${SCRIPT_DIR}/package.json').version"
libs/fleet-mcp/release.sh:32    jq -r .version < "${SCRIPT_DIR}/package.json"
```

Both files were deleted in `435231ca "feat: Migrate from NX to moon (#862)"`.
Neither is gitignored — they are simply gone, so both tasks fail on their first
line. This is what the `# TODO: Need to replace release pipeline with something
else` in `.github/workflows/release.yaml` stands in for. The plugins were
hand-built via `release-local.sh` ever since, which is how the 404s happened.

---

## 2. Scope: which projects opt in

**VERIFIED** by sweeping all 81 moon projects for release/publish tasks, versioned
manifests, Dockerfiles, Chart.yaml, packer templates, and every pinned
`ghcr.io/vgijssel/*` reference in the repo.

### Opt in (4)

`openbao-netbird-plugin`, `openbao-cloudflare-plugin`, `fleet-mcp`, `devcontainer`

### Deliberate carve-out: `talos-image`

Has a `release` task and ships `ghcr.io/vgijssel/setup/talos:v1.11.6` (consumed by
`apps/enigma-cozy/all.patch.yaml:37`), but its version **is** the upstream Talos
version, derived from `DEPENDENCIES` and driven by renovate plus
`scripts/upgrade-talos.sh`. Giving it to release-please means two systems fighting
over one tag.

> **Rule for the opt-in contract:** release-please owns semver you choose. It must
> never own a version that mirrors an upstream.

Keep `talos-image` on its moon `release` task and give it the same idempotence
guard (§5). Its `release.sh` already uses `regctl`, so that is a two-line change.

### Ruled out (checked, with reasons)

- `occupancy_component` — version `0.3.0` and legacy tags, but **not on PyPI**
  (404), only a `test` task, consumed as Home Assistant YAML inside `apps/haos`.
- `dev-cluster`, `helm-platform`, `pyinfra-custom`, `pikvm` — versioned
  `pyproject.toml`, no publish task, nothing on PyPI, no root uv workspace.
- `ipxe-efi`, `ipxe-vm`, `pikvm-lxc`, `distrobuilder-image` — produce artifacts,
  no release task, no pinned consumer.
- `blueorange`, `verjaardag-hilde` — `"private": true`; only `-dev:cache` /
  `-dev:latest` build-cache tags exist in ghcr.
- `apps/docs` — `publish` is `mkdocs gh-deploy`, unversioned, `interactive: true`.
- ~30 `Chart.yaml` under `apps/*/src/*/` — Fleet bundle charts deployed via the
  Rancher GitRepo, never pushed to a chart registry.
- ~40 historical tag prefixes (`enigma-cluster`, `root-cluster-prod`, `coder-prod`,
  `windmill`, `haos`, `testing`, `tinkerbell`, `myvm`, `escaperoom`, …) — the old
  changesets/nx setup versioned *deployables*. Do not reinstate; that is how the
  repo got 239 tags for 4 real artifacts.

---

## 3. Does release-please fit?

Yes, in **manifest mode**. It is a GitHub Action reading commits and writing files;
it does not care about Moon, Bazel, or the `apps/`/`libs/` split.

- Commits already conform to Conventional Commits.
- **Scope mismatch is a non-issue**: manifest mode routes commits to packages by
  **file path**, not by commit scope. `feat(openbao): …` touching both plugin dirs
  correctly bumps both.
- Go is a first-class release type (`"go"` = CHANGELOG only). `"simple"` is better
  here — it maintains a `version.txt` that `release.sh` can read, removing a
  hand-edited constant.

### Answers to the three original requirements

| Requirement | Verdict |
|---|---|
| Multiple packages bumped in one PR | **Yes** — the default in manifest mode (`separate-pull-requests: false`) |
| No human approval of the release PR | **Possible, against the grain** — the PR always exists; you auto-merge it |
| Use changesets | **No** — mutually exclusive input models, no plugin, no bridge |

On changesets: release-please derives everything from commit messages; changesets
derives everything from `.changeset/*.md`. This repo has already been down both
roads — the `coder-devcontainer@0.13.5`-style tags are from a changesets era
(removed in `45d69461`) and `.claude/commands/version-plan.md` still drives Nx
`release plan` version-plans. Pick one; do not try to bridge them.

### Config sketch

**VERIFIED**: `extra-files` paths are package-relative by default; a **leading `/`
makes them repo-root-relative**; `../` is hard-rejected with
`illegal pathing characters in path`.

```jsonc
// release-please-config.json  (generated — see §4)
{
  "separate-pull-requests": false,
  "include-component-in-tag": true,
  "tag-separator": "@",                       // matches legacy changesets-era tags
  "group-pull-request-title-pattern": "chore(release): ${branch}",
  "packages": {
    "libs/openbao-netbird-plugin": {
      "release-type": "simple",
      "component": "openbao-netbird-plugin",
      "extra-files": [
        "release.sh",                          // via `# x-release-please-version`
        { "type": "yaml",
          "path": "/apps/secret/src/openbao/values.yaml",
          "jsonpath": "$.server.extraInitContainers[0].image" }
      ]
    }
  }
}
```

Bootstrapping: seed `.release-please-manifest.json` with the real current versions
and set `bootstrap-sha`, or release-please scans 239 legacy tags and starts at
`1.0.0`.

---

## 4. Leveraging Moon

### 4a. Commit-scope lint bound to moon projects

**VERIFIED**: `moon query projects --json` runs in **0.77s** and exposes `id`,
`source`, `config.tags`, and `config.project.metadata`.

**VERIFIED**: `moon generate` **cannot** do this. Codegen templates receive only
`dest_dir`, `dest_rel_dir`, `working_dir`, `workspace_root`, `variables()`, and
string/path filters — there is no project-graph access. Codegen scaffolds new
projects from templates; it cannot aggregate repo state.

So compute the enum at config-load time instead of generating a file:

```js
// commitlint.config.js
const { execSync } = require('node:child_process');
const { projects } = JSON.parse(execSync('moon query projects --json'));
const scopes = [
  ...projects.map((p) => p.id),
  ...new Set(projects.flatMap((p) => p.config.tags ?? [])),
  'deps', 'release', 'ci', 'repo',
];
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: { 'scope-enum': [2, 'always', scopes] },
};
```

Zero drift, no generated artifact, no staleness guard needed.

**VERIFIED**: `scope-enum`'s default delimiters are `["/", "\\", ","]`, so the
existing `fix(network,secret):` form already splits and validates per-scope.

**Blocker — most current scopes would fail.** Against the 81 project ids:

| Scope in use | Status |
|---|---|
| `network`, `secret`, `harvester` | ✅ project ids |
| `mesh` | ❌ not a project |
| `secrets` | ❌ the project is `secret` |
| `openbao` | ❌ projects are `openbao-{netbird,cloudflare}-plugin` |
| `fleet` | ❌ a *tag*, not a project |
| `deps` | ❌ renovate-generated, ~half of recent commits |

Including **tags** in the enum legalises `fix(fleet):` and is meaningful
(`--query "tag=fleet"` already works). Expect a one-time convention cleanup, or
start the rule at severity `1` (warn).

### 4b. Per-project opt-in

**VERIFIED**: there is **no per-project release-please config**. It reads exactly
one `release-please-config.json` (path overridable via `--config-file`), with no
per-directory discovery. Aggregation is mandatory.

**VERIFIED**: `moon.yml` rejects unknown top-level keys (allowed: `$schema`,
`dependsOn`, `docker`, `env`, `fileGroups`, `id`, `language`, `layer`, `type`,
`owners`, `platform`, `project`, `stack`, `tags`, `tasks`, `toolchain`,
`workspace`) — **but `project.metadata` is a free-form `object`** in the schema and
round-trips through `moon query projects --json` intact.

```yaml
# libs/openbao-netbird-plugin/moon.yml
tags: [go, release]                    # opt-in -> inherits .moon/tasks/tag-release.yml
project:
  description: OpenBao NetBird secrets engine plugin   # becomes REQUIRED & non-empty
  metadata:
    release:
      type: simple
      extraFiles:
        - release.sh
        - { type: yaml, path: /apps/secret/src/openbao/values.yaml,
            jsonpath: $.server.extraInitContainers[0].image }
```

Two layers, both already idiomatic here:

- **`tags: [release]`** → `.moon/tasks/tag-release.yml` injects the `release` task
  and its input contract into every opted-in project. Same pattern as the existing
  `.moon/tasks/tag-fleet.yml`.
- **`project.metadata.release`** → the per-project release-please knobs.

A `libs/release` project then holds a task that reads `moon query projects --json`
and writes the root config, with a `--check` mode in CI — the same guard shape as
the existing `fleet_build` / `fleet-lint-targets` tasks. Map moon `source` →
release-please package path, moon `id` → `component`.

### 4c. One invocation; only changed versions release

**VERIFIED**: a cacheable task with **no `outputs`** is still hashed and skipped.

```
network:fleet_lint_targets (2s 994ms, 5d9f5110)   <- run 1
network:fleet_lint_targets (cached, 5d9f5110)     <- run 2, 63ms
```

**VERIFIED**: `--affected` is **task-input-scoped**, not project-scoped. Two tasks
in the same project differing only in `inputs`:

```
t_hit   inputs: [src/omada/fleet.yaml]        (modified)   -> RAN
t_miss  inputs: [src/crossplane/fleet.yaml]   (unmodified) -> "not affected by touched files"
```

Also **VERIFIED**:

- `--query` composes with `--affected`.
- `--stdin` accepts an explicit touched-file list, overriding git.
- No-ops exit **0** (both "nothing affected" and "query matched nothing").
- `runInCI: false` only gates `moon ci`; an explicit `moon run <p>:release` still
  executes. The existing task options need no change.
- `moon query touched-files` has `--defaultBranch`, `--base`, `--head`, `--remote`.

```yaml
# .moon/tasks/tag-release.yml
tasks:
  release:
    command: ./release.sh
    inputs: [version.txt]          # the ONLY input
    options:
      cache: true
      runFromWorkspaceRoot: false
```

**Make `version.txt` the only input.** Adding `src/**` or `Dockerfile` means a
source change without a version bump re-pushes the *same* image tag with different
content — tag mutation, which is poison for a sha256-pinned plugin catalog.

---

## 5. Trigger design: always on main, idempotent targets

### Why not "only after the release PR merges"

**VERIFIED** from source and docs: release-please is a **label state machine, not a
function of repo state**. `findMergedReleasePullRequests()` skips every merged PR
lacking `autorelease: pending`; `createReleasesForPullRequest()` strips that label
and applies `autorelease: tagged` after tagging. On a re-run there is no candidate
PR → `releases_created=false`, `paths_released=[]` → a gated publish step is
skipped and **the workflow goes green having published nothing**.

Note this means gating on `paths_released` is the *less* restartable design. A
workflow re-run checks out the same SHA, so `git diff-tree -r HEAD` is
deterministic and the `--affected --stdin` path *is* restartable. `--affected`
only loses a retry if an unrelated commit later lands on main and moves the diff
window off the release commit.

### Two independent workflows, both on `push: main`

| Workflow | Owns | Knows about the other |
|---|---|---|
| `release-please.yaml` | version decisions: bump files, tag, GitHub Release | — |
| `publish.yaml` → `moon run :release --query "tag=release"` | artifact convergence | nothing |

Consequences:

- **The `GITHUB_TOKEN` auto-merge problem stops being fatal.** Merging a release PR
  with `GITHUB_TOKEN` does not trigger `push` workflows (GitHub's recursion guard),
  so publish does not fire on *that* push — it converges on the next one. A delayed
  release, not a lost one. Still use `RELEASES_TOKEN_GITHUB` / `vgijssel-bot` for
  timeliness, but it is no longer load-bearing.
- **Add `schedule:` as a backstop** — same command, extra trigger. Idempotence is
  what makes a nightly convergence run free.

### Single logic: make the targets idempotent

The registry becomes the source of truth for "has this version shipped", replacing
diff windows and cache hashes. `regctl` is already vendored (`bin/regctl`) and
already a declared file group (`regctl_bin`) in `.moon/tasks.yml`.

**VERIFIED**: `regctl` cannot distinguish failure modes by exit code —

```
exists             -> 0
tag 404            -> 1
repo NAME_UNKNOWN  -> 1
host unreachable   -> 1     <- same code as "not published"
```

A naive `if regctl manifest head …; then exit 0; fi` therefore conflates "not
published" with "registry unreachable". The residual bug: a transient probe failure
followed by a *successful* push re-pushes an existing tag, producing a new digest
and invalidating `plugin_sha256`. Make it three-state:

```bash
set +e; err=$(regctl manifest head "$IMAGE_REF" 2>&1 >/dev/null); rc=$?; set -e
if [ $rc -eq 0 ]; then
  echo "already published: $IMAGE_REF"; exit 0
elif ! printf '%s' "$err" | grep -qE 'http 404|NAME_UNKNOWN'; then
  echo "registry probe failed, not a 404: $err" >&2; exit 1   # fail loud
fi
docker buildx build --platform linux/amd64,linux/arm64 --push --tag "$IMAGE_REF" "$SCRIPT_DIR"
```

Two rules this generalises to:

1. **One guard per observable side effect, not per task.** Today `release.sh` has
   exactly one effect. The moment the `plugin_sha256` write-back lands there, a
   registry hit would short-circuit and the sha would never be written.
2. **Never fail-open to skipping.** Probe the real system, treat only an explicit
   "absent" as permission to act, treat ambiguity as failure.

With this, `--affected` and `cache: true` both degrade to pure speed
optimisations that can be added or removed without changing behaviour.

### What release-please offers for a broken release

Only for **its own** step (tag + GitHub Release). It has no concept of a downstream
publish — `autorelease: published` is documented as a convention for publication
tooling that release-please deliberately does not set itself.

- **"Re-run failed jobs", never "Re-run all jobs"** — preserves the release job's
  outputs. Re-run-all / manual dispatch / a later push all produce the silent green
  no-op above.
- **Label reset**: flip the merged PR back to `autorelease: pending`, delete the
  tag, re-run.
- `release-please github-release` standalone to retry just the tag/release step.
- `release-please:force-run` label (GitHub App users); `Release-As:` footer.
- If the failure is in the code at the release commit there is **no retry** — the
  tag is pinned to that commit, so ship a fix as the next patch.

Traps: a stuck `autorelease: pending` blocks all future release PRs; renaming the
labels without setting `label`/`release-label` leaves the action looking for the
old names; `skip-github-release: true` also suppresses the **git tag**, aborting
every subsequent run.

---

## 6. Dependent / transitive releases

### What release-please supports

Dependent-bumping lives in the workspace plugins and does exactly what is wanted:

> "Even when a particular package was not updated by release-please, if a
> dependency did have an update, it will patch bump the package, create a changelog
> entry, and add it to the list of PR changes."

**VERIFIED** plugin registry (`src/factories/plugin-factory.ts:56`):
`linked-versions`, `cargo-workspace`, `node-workspace`, `maven-workspace`,
`sentence-case`, `group-priority`. **There is no `go-workspace` and no
`python-workspace`.** The four candidates are Go ×2, Python ×1, Docker image ×1 —
zero coverage. release-please also has no way to learn Moon's graph.

### It is moot today

**VERIFIED** dependency graph:

```
openbao-netbird-plugin      dependsOn = []
openbao-cloudflare-plugin   dependsOn = []
fleet-mcp                   dependsOn = []
devcontainer                dependsOn = [docker(build), devenv(production),
                                         devcontainers-cli(build), vendir(build)]
```

No candidate depends on another candidate. `devcontainer`'s only production-scope
dep is `devenv`, which is not releasable. In reverse,
`coder-devcontainer-kubernetes` consumes `fleet-mcp` + `devcontainer` and
`enigma-cozy` consumes `talos-image`, but both consumers are deployed, not
published.

### The case that works natively — and its trap

External dependency updates need no plugin, because commits are path-matched.
Precedent: `af8e23a8 fix(deps): update module github.com/openbao/openbao/sdk/v2 to
v2.3.0 [security]` touched `libs/openbao-netbird-plugin` → patch bump → release.

**But `renovate.json` sets `semanticCommitType: "chore"` globally**, and `chore` is
not a releasable type:

```
fix(deps):   update module github.com/openbao/openbao/sdk/v2 [security]   -> patch bump
chore(deps): update alpine docker tag to v3.24.2                          -> NO bump
```

**VERIFIED** that the second one matters:

```
libs/openbao-netbird-plugin/Dockerfile:13    FROM alpine:3.24.1   <- runtime base of BOTH plugins
libs/openbao-cloudflare-plugin/Dockerfile:13 FROM alpine:3.24.1
```

An alpine CVE bump changes the shipped image but produces no version bump —
and combined with the idempotence guard (existing tag → skip), **the rebuilt image
never gets pushed**. The guard is correct; the version simply never moved. Net
effect: base-image CVE fixes silently never reach the cluster.

The lever is in renovate, not release-please:

```jsonc
// renovate.json
{ "packageRules": [{
    "matchFilePatterns": ["libs/openbao-*-plugin/**", "libs/fleet-mcp/**", ".devcontainer/**"],
    "semanticCommitType": "fix"
}]}
```

> **Opt-in checklist rule:** if a project is releasable, its dependency updates
> must be releasable too.

### Custom plugins are possible — but not via the Action

**VERIFIED** from source on `main`:

```
src/factories/plugin-factory.ts:156  export function registerPlugin(name, pluginBuilder)
src/factories/plugin-factory.ts:160  export function unregisterPlugin(name)
src/index.ts:46                      registerPlugin   <- exported from the package entrypoint
```

`WorkspacePlugin<T>` is an **exported abstract base class**
(`src/plugins/workspace.ts:57`) that all three workspace plugins extend. You inherit
the graph traversal and implement nine methods: `bumpVersion`, `updateCandidate`,
`newCandidate`, `buildAllPackages`, `buildGraph`, `inScope`,
`packageNameFromPackage`, `pathFromPackage`, `postProcessCandidates`.
`appendDependenciesSectionToChangelog` is exported too (`workspace.ts:487`).

`DependencyGraph<T> = Map<string, DependencyNode<T>>` is **generic over the package
type**, so `T` can be a moon project and `buildGraph` is just
`moon query projects --json` edges. The right plugin to write is therefore
**`moon-workspace`, not `go-workspace`** — one plugin covering Go, Python, Docker
and anything else moon knows, because moon owns a graph that `go.mod` /
`pyproject.toml` cannot express.

Delivery routes, in descending viability:

1. **Node library** — pin `release-please` exactly, write a ~100-line entrypoint
   calling `registerPlugin('moon-workspace', …)` then driving
   `Manifest.fromManifest(...)`, run as a workflow step instead of the Action.
   Dropping the Action costs `paths_released`, which §5 already decided not to use.
2. **CLI `--plugin`** — exists (`src/bin/release-please.ts:889`,
   `describe: 'load plugin named release-please-<plugin-name>'`) but is a **trap**:
   the middleware `require`s the plugin and swallows *every* failure as a
   `console.warn` (`failed to require plugin: …`, `… did not have an init()
   function.`). It never throws and never exits non-zero, so a typo yields a
   normal-looking release with no dependent bumps. If used, assert
   `getPluginTypes()` contains the plugin and fail hard.
3. **GitHub Action** — **impossible.** `action.yml` has no `plugin` input and
   `main: dist/index.js` is a prebuilt bundle.

**Recommendation: do not build it yet.** Zero present value (no inter-candidate
edges) and a real maintenance tax — those nine methods are `protected abstract`
internal shape, not semver-protected, against a pinned dependency. The cheap thing
that covers the risk actually observed is the renovate rule above. If an edge
appears later, `linked-versions` covers the plugin pair with zero code. Write
`moon-workspace` only for a genuine diamond.

---

## 7. Unresolved: the `plugin_sha256` chicken-and-egg

`apps/secret/src/openbao-config/plugin-cloudflare.yaml` pins the binary's sha256,
knowable only *after* `docker buildx build` runs — i.e. after the release PR has
merged. **No release tool solves this**; it is a property of the plugin-catalog
design. Options:

1. The release workflow pushes a **second commit** writing the sha back to `main`
   (with a guard so that commit does not retrigger a release).
2. Drop sha pinning from the plugin catalog.
3. Reproducible builds so the sha is computable in the release PR — multi-arch
   buildx is not bit-identical by default; do not bet on this.

This is the most likely place for "fully automatic" to leak. **Decide before
building**, otherwise the version bump gets automated while the catalog is still
hand-edited every release — which is where the existing drift came from.

---

## 8. Implementation order

1. **Decide §7** (sha write-back vs drop pinning). Blocks nothing below, but
   determines whether the pipeline is truly hands-off.
2. Resurrect the two broken `release.sh` scripts (`fleet-mcp`, `devcontainer`) —
   drop the dead `package.json` reads. For `fleet-mcp`, invert ownership so
   `pyproject.toml` is the source of truth and `uv version "${VERSION}"` is removed.
3. Add the three-state `regctl` idempotence guard to all five release scripts
   (4 candidates + `talos-image`).
4. Add `.moon/tasks/tag-release.yml`; tag the 4 candidates; add
   `project.metadata.release` blocks (remember `project.description` becomes
   required).
5. Add `libs/release` config generator + `--check` CI guard.
6. Seed `.release-please-manifest.json` with real current versions; set
   `bootstrap-sha`.
7. Add `release-please.yaml` + `publish.yaml` workflows; enable repo
   `allow_auto_merge`; auto-merge via `RELEASES_TOKEN_GITHUB`.
8. Add the renovate `semanticCommitType: "fix"` packageRule for released dirs.
9. Add `commitlint.config.js` (start at severity `1`), then clean up scope
   conventions and raise to `2`.

First release should reconcile the four drifts in §1.

---

## Caveats

- release-please source references were read from `main` on 2026-10-21. Pin a
  version and re-verify line numbers before building against them.
- `apps/platform/src/netbird-operator/values.yaml` showed as modified during this
  research; it was not touched by it.
