# Proposal

## Why

The two first-party OpenBao secrets-engine plugins have no release pipeline, and the drift
this caused is now a cold-start blocker: `apps/secret/src/openbao/values.yaml` pins
`openbao-plugin-secrets-netbird:0.1.4` and `openbao-plugin-secrets-cloudflare:0.1.0`, and
**neither image exists in ghcr** — the cloudflare repository has never been created at all
(`plan.md` §1, verified 2026-10-21). A cluster that loses its containerd cache cannot start
OpenBao, because both plugin init containers fail to pull.

Nothing in the repo would have caught this. `release.sh` hard-codes `VERSION="${VERSION:-0.1.3}"`
and `0.1.0` respectively; `.github/workflows/release-openbao-netbird-plugin.yaml` passes
`VERSION: 0.1.3` on a path filter, so merging a plugin change re-pushes the *same* tag with
different content and never produces 0.1.4; and `.github/workflows/release.yaml` is entirely
commented out behind `# TODO: Need to replace release pipeline with something else`. The
plugins have been hand-built with `release-local.sh` into a single node's containerd ever
since, which is exactly how the 404s arose.

This change establishes version-driven releases for both plugins. Two packages in one release
PR demonstrates that the monorepo can release multiple artifacts independently, and making the
publish step converge against the registry rather than against a diff window gives a pipeline
that is safe to re-run, schedule, and retry.

## What Changes

- **Adopt release-please in manifest mode** for `libs/openbao-netbird-plugin` and
  `libs/openbao-cloudflare-plugin`, with a hand-written root `release-please-config.json` and a
  `.release-please-manifest.json` seeded to the currently-pinned versions. Commits route to
  packages by **file path**, not commit scope, so the existing `feat(openbao):`-style scopes
  need no cleanup.
- **`version.txt` becomes each plugin's single source of version truth** (`release-type:
  "simple"`), read by `release.sh`. The hard-coded `VERSION` default is removed, so a release
  cannot silently target the wrong tag.
- **Both plugin releases land in one release PR** (`separate-pull-requests: false`), tagged
  `<component>@<version>`. A human merges the release PR; auto-merge is deliberately not
  enabled yet.
- **`release.sh` becomes idempotent** via a three-state `regctl manifest head` probe: tag
  present → skip; an explicit `http 404` / `NAME_UNKNOWN` → build and push; any other probe
  failure → **fail loudly**. A registry probe that fails for an unrelated reason must never be
  read as permission to push, because re-pushing an existing tag mutates its digest and
  invalidates the `plugin_sha256` pin downstream.
- **A new `publish.yaml` workflow runs on every push to `main` plus a nightly schedule**,
  invoking the moon `release` tasks. It is deliberately **not** gated on release-please's
  `releases_created` / `paths_released` outputs: release-please is a label state machine, so a
  re-run finds no candidate PR and would report success having published nothing.
- **The publish job commits the consumer pins back to `main`** after a successful push: the
  init-container image tag in `apps/secret/src/openbao/values.yaml` and the matching
  `plugin_sha256` in `apps/secret/src/openbao-config/plugin-{netbird,cloudflare}.yaml`, in a
  single commit. The two values **must** move together — a tag bump without its sha leaves
  Fleet deploying an image whose binary fails catalog registration with a bare checksum
  mismatch. release-please therefore does **not** touch `values.yaml`.
- **Renovate dependency updates for these two directories become releasable** by overriding
  the repo-global `semanticCommitType: "chore"` to `"fix"`. Both plugins run on
  `FROM alpine:3.24.1`; under the current config an alpine CVE bump changes the shipped image
  but produces no version bump, and the new idempotence guard then correctly refuses to
  re-push the existing tag — so base-image CVE fixes would silently never reach the cluster.
- **`release-openbao-netbird-plugin.yaml` is deleted**, superseded by `publish.yaml`.
- The first release reconciles the drift in `plan.md` §1 by publishing the two tags the
  cluster already pins.

### Deliberately out of scope

- `fleet-mcp` and `devcontainer` (the other two broken pipelines in `plan.md` §1) and the
  `talos-image` carve-out. The release-please config is additive; onboarding them later is a
  few lines.
- The moon-metadata-driven config generator and `.moon/tasks/tag-release.yml` (`plan.md` §4b).
  With two packages a hand-written root config is smaller than the generator that would write
  it.
- `commitlint.config.js` and the commit-scope convention cleanup (`plan.md` §4a) — a repo-wide
  convention change, independent of releasing these two plugins.
- A custom `moon-workspace` release-please plugin (`plan.md` §6). Neither plugin depends on the
  other, so it would have zero present effect.

## Capabilities

### New Capabilities

- `artifact-release`: How a versioned artifact produced by this monorepo gets its version
  decided, published exactly once, and propagated to the in-repo consumers that pin it.
  Covers conventional-commit-driven version decisions, multi-package release batching,
  publish idempotence against the registry as source of truth, re-runnability, and keeping a
  consumer's image tag and content checksum consistent with each other.

### Modified Capabilities

None. `mesh-service-exposure` is the only existing spec and is unrelated.

## Impact

**New files**
- `release-please-config.json`, `.release-please-manifest.json`
- `libs/openbao-netbird-plugin/version.txt`, `libs/openbao-cloudflare-plugin/version.txt`
- `libs/openbao-*-plugin/CHANGELOG.md` (created by release-please on first release)
- `.github/workflows/release-please.yaml`, `.github/workflows/publish.yaml`

**Modified**
- `libs/openbao-netbird-plugin/release.sh`, `libs/openbao-cloudflare-plugin/release.sh` —
  version from `version.txt`, three-state registry guard
- `libs/openbao-*-plugin/moon.yml` — `release` task inputs narrowed to `version.txt` so a
  source change without a version bump cannot re-push a tag
- `apps/secret/src/openbao/values.yaml`, `apps/secret/src/openbao-config/plugin-netbird.yaml`,
  `apps/secret/src/openbao-config/plugin-cloudflare.yaml` — now bot-written; the "update both
  together" instruction in their comments becomes an enforced property
- `renovate.json` — `packageRules` entry for the two plugin directories
- `.github/workflows/release.yaml` — the dead commented-out body removed

**Deleted**
- `.github/workflows/release-openbao-netbird-plugin.yaml`

**Repo / org settings**
- A token for the write-back commit and for release-please. `GITHUB_TOKEN` cannot push to
  `main` if it is protected, and pushes made with it do not trigger `push` workflows;
  `RELEASES_TOKEN_GITHUB` / `vgijssel-bot` already exists and is used by
  `.github/workflows/release.yaml`.
- `packages: write` for the publish job. `plan.md` notes no current token carries
  `write:packages` — this is the first thing that genuinely needs it, and is why the cloudflare
  repository does not exist.

**Operational**
- First publish creates the `openbao-plugin-secrets-cloudflare` ghcr repository, which is
  **private by default** — the init containers pull without credentials, so it must be made
  public (or the chart given an imagePullSecret).
- The write-back commit touches only `apps/secret/**`, outside both release-please package
  paths, so it cannot trigger a further release.
