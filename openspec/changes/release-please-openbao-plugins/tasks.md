# Tasks

## 1. Pre-flight checks that can change the design

These are cheap and each one invalidates part of `design.md` if it comes out the other way. Do
them before writing code.

- [x] 1.1 Confirm `sys/plugins/catalog` requires `sha256` on this OpenBao version — check the
      running server's API docs or attempt a registration without it — and record the result in
      `design.md`. If it is optional, D5's entire write-back mechanism is unnecessary and the
      change shrinks substantially.
- [x] 1.2 Determine whether `main` is protected and whether `RELEASES_TOKEN_GITHUB` /
      `vgijssel-bot` can push to it directly (`gh api repos/vgijssel/setup/branches/main/protection`).
      If a direct push is rejected, switch D5 to opening a PR and note it in `design.md` — no spec
      changes either way.
- [x] 1.3 Confirm a workflow `GITHUB_TOKEN` with `packages: write` can push to
      `ghcr.io/vgijssel/setup/*`, or that `PACKAGES_TOKEN_GITHUB` can. Verify by pushing a
      throwaway tag from a scratch workflow run and deleting it; no *local* credential carries
      `write:packages`, which is why the cloudflare repository does not exist.
- [x] 1.4 Record the exact `regctl manifest head` stderr for all three states against real
      references — an existing tag, a 404 tag in an existing repo, and the nonexistent
      `openbao-plugin-secrets-cloudflare` repo — and confirm `http 404` / `NAME_UNKNOWN` actually
      appear in them. D6's entire correctness rests on this string match.

## 2. Shared registry probe

- [x] 2.1 Add `bin/registry-tag-exists <ref>` implementing the three-state contract from D6
      (exit `0` present, `10` positively absent, anything else failure with the probe's own error
      on stderr), using the strings captured in 1.4. Verify `trunk check` passes on it, including
      shellcheck.
- [x] 2.2 Add a `bats` suite covering all three states with a stubbed `regctl` earlier on `PATH`,
      following the harness in `.devcontainer/tests/test.bats`. Verify it fails when the
      ambiguous case is deliberately made to exit `10` instead of `1` — a test that cannot catch
      the fail-open bug is not testing the thing that matters.
- [x] 2.3 Wire the suite into a moon task so it runs in CI, and verify it executes under
      `moon run <project>:test` and under `moon ci`.

## 3. Version single-sourcing in both plugins

- [x] 3.1 Add `libs/openbao-netbird-plugin/version.txt` containing `0.1.4` and
      `libs/openbao-cloudflare-plugin/version.txt` containing `0.1.0` — the versions
      `apps/secret/src/openbao/values.yaml` already pins, per D8. Verify each matches the
      corresponding `image:` tag in `values.yaml` exactly.
- [x] 3.2 Change both `release.sh` to read `version.txt` with no fallback, deleting the
      `VERSION="${VERSION:-0.1.3}"` / `0.1.0` defaults. Verify that moving `version.txt` aside
      makes the script exit non-zero without building, and that with it present the script
      reports the expected `IMAGE_REF`.
- [x] 3.3 Narrow both `release` tasks in `moon.yml` to `inputs: [version.txt, /bin/registry-tag-exists,
      "@group(regctl_bin)"]` and nothing from `src/` or `Dockerfile`, per D3. Verify with
      `moon run <project>:release --dry-run` (or by touching a source file and confirming the
      task is reported as not affected) that a source-only change does not re-trigger a publish.
- [x] 3.4 Add `libs/openbao-netbird-plugin/plugin-sha.sh` and a `plugin_sha` moon task mirroring
      the cloudflare plugin's, replacing the logic inlined in `release-local.sh` — including the
      `--entrypoint sha256sum` that is required because the image ENTRYPOINT is the plugin binary
      itself. Verify both `moon run openbao-netbird-plugin:plugin_sha` and
      `moon run openbao-cloudflare-plugin:plugin_sha` print a 64-character hex digest for a
      locally-built image.

## 4. Idempotent publish

- [x] 4.1 Add the `bin/registry-tag-exists` call to both `release.sh` ahead of the build, mapping
      exit `0` to a clean skip and exit `10` to proceeding, per D6. Verify by running
      `release.sh` twice against a version already in the registry and confirming it skips and
      exits `0` both times with no push.
- [x] 4.2 Verify the ambiguous path end to end: run `release.sh` with an unreachable or
      unauthenticated registry and confirm it exits non-zero and pushes nothing, rather than
      treating the failed probe as permission to publish.
- [x] 4.3 Update the comments in both `release.sh` to state that the script's single side effect
      is the push, and that pin propagation deliberately lives outside it (D6 rule 2). Verify the
      comment names the bootstrap case, which is where the two disagree.

## 5. Pin propagation

- [x] 5.1 (SUPERSEDED by 10.6 — rewritten to write openbao-config/values.yaml.) Add `bin/openbao-plugin-pin` writing, in one pass, the init-container image tags in
      `apps/secret/src/openbao/values.yaml` and the `plugin_sha256` values in
      `apps/secret/src/openbao-config/plugin-{netbird,cloudflare}.yaml`, using `yq` and the arm64
      digest from `plugin-sha.sh`. Verify `trunk check` passes and that a run against the current
      tree produces a diff touching exactly those three files.
- [x] 5.2 (SUPERSEDED by 10.6/10.7.) Make the script commit only when the diff is non-empty. Verify that running it twice in
      a row produces exactly one commit, satisfying the spec's "re-propagating correct pins is a
      no-op".
- [x] 5.3 (SUPERSEDED by 10.6.) Verify atomicity directly: confirm that no committed state has a new image tag beside
      an old checksum, by checking that each produced commit either changes both files or
      neither. This is the single property that D5's whole shape exists to guarantee.
- [x] 5.4 (SUPERSEDED by 10.6 — fixture tree changes with the chart.) Add a `bats` case asserting the no-op behaviour against a fixture tree with
      already-correct pins, reusing the harness from 2.2.
- [x] 5.5 (SUPERSEDED by 10.4 — the comments move with the files.) Update the "update both together" comments in `values.yaml`,
      `plugin-netbird.yaml` and `plugin-cloudflare.yaml` to say the values are now written by
      `bin/openbao-plugin-pin` from CI, and that hand-editing them will be overwritten. Verify
      the comments no longer instruct a human to run `plugin_sha` manually as the normal path.

## 6. release-please configuration

- [x] 6.1 Add `release-please-config.json` per D1: `separate-pull-requests: false`,
      `include-component-in-tag: true`, `tag-separator: "@"`, both packages at
      `release-type: "simple"` with explicit `component` values, and no `extra-files`. Verify
      with `release-please --dry-run` that it resolves both packages and proposes no edit to
      `values.yaml`.
- [x] 6.2 Add `.release-please-manifest.json` seeded to `0.1.4` and `0.1.0`, matching
      `version.txt` from 3.1. Verify the two files agree.
- [x] 6.3 Set `bootstrap-sha` to this change's merge commit. Verify via `--dry-run` that
      release-please proposes versions derived from the manifest and does not start either
      package at `1.0.0` off the ~239 legacy tags.
- [x] 6.4 Verify path-based routing with a dry run over a commit touching only one plugin
      directory, confirming only that package is proposed for a bump, and over one touching both,
      confirming both are.

## 7. Workflows

- [x] 7.1 Add `.github/workflows/release-please.yaml` on `push: main`, using
      `RELEASES_TOKEN_GITHUB`. Verify the release PR it opens is labelled with release-please's
      default labels — D-level note: do not rename them without also setting `label` /
      `release-label`, and do not set `skip-github-release`, which would suppress the git tag.
- [x] 7.2 (SUPERSEDED by 10.3/10.9.) Add `.github/workflows/publish.yaml` on `push: main` plus a nightly `schedule`, with
      `concurrency: { group: publish-main, cancel-in-progress: false }` and `packages: write`,
      invoking the two `release` tasks explicitly rather than `moon run :release` (which would
      fire the broken `fleet-mcp` / `devcontainer` scripts and the carved-out `talos-image`).
      Verify it reads none of release-please's outputs.
- [x] 7.3 (SUPERSEDED by 10.9 — the step opens a PR now.) Add the `bin/openbao-plugin-pin` step to `publish.yaml`, after both publishes succeed,
      committing as `vgijssel-bot` with a `chore(secret):` subject. Verify the commit touches
      only `apps/secret/**` and so cannot route to either release-please package.
- [x] 7.4 Delete `.github/workflows/release-openbao-netbird-plugin.yaml` and remove the
      commented-out body and the `# TODO: Need to replace release pipeline with something else`
      from `.github/workflows/release.yaml`. Verify no remaining workflow passes a hard-coded
      `VERSION` to either plugin.
- [x] 7.5 (SUPERSEDED by 10.9 — the documented flow changed.) Document the pipeline where the next person will look — a short section covering the
      merge-to-published flow, the three-state guard, and that pins are bot-written. Verify the
      commands it names run as written.

## 8. Renovate

- [x] 8.1 Add the `packageRules` entry from D7 overriding `semanticCommitType` to `"fix"` for
      `libs/openbao-netbird-plugin/**` and `libs/openbao-cloudflare-plugin/**`. Verify against
      the renovate schema and, if available, with a dry run that an `alpine` bump in those
      directories is typed `fix(deps):` rather than `chore(deps):`.
- [x] 8.2 Verify the complementary direction: confirm the existing automerge rule
      (`matchUpdateTypes: [minor, patch]`, `matchCurrentVersion: "!/^0/"`) still does not apply
      to these 0.x packages, so their dependency PRs continue to land by hand.

## 10. Rework: review feedback and the PR-based pin flow

Raised on PR #1077 and in review of the merged implementation. Tasks 5.1–5.3, 7.2 and 7.3 were
completed against the direct-push design and are superseded by 10.4–10.6; the atomicity property
they verified is unchanged and must still hold.

- [x] 10.1 Delete `plan.md` (PR #1077 review). Verify nothing references it — `design.md` and
      `proposal.md` cite it repeatedly, so replace those citations with the facts they stood for
      rather than leaving dangling pointers.
- [x] 10.2 Reply to the `.release-please-manifest.json` review comment. Manifest mode requires
      the file and `release-type: simple` writes `version.txt` regardless, so neither can be
      dropped; record in `design.md` which is the tool's bookkeeping and which is the build
      input, so the duplication is explained rather than merely present.
- [x] 10.3 Replace the enumerated task list in `publish.yaml` with
      `moon run :release --query "tag=releasable"` (PR #1077 review), and move the shared
      `release` task shape into `.moon/tasks/tag-releasable.yml` per D10. Verify the query
      resolves to exactly the two plugin `release` tasks and excludes `devcontainer`,
      `fleet-mcp` and `talos-image`, and that the inherited task still carries D3's narrow
      inputs and D6's `cache: false`.
- [x] 10.4 Convert `apps/secret/src/openbao-config` to a local Helm chart per D11: `Chart.yaml`,
      `values.yaml` carrying `plugins.<name>.{version,sha256}`, and the 18 manifests moved into
      `templates/`. Verify `helm template` renders byte-identical objects to the current flat
      manifests for the sixteen untouched files, and that the two plugin manifests differ only
      in the interpolated checksum.
- [x] 10.5 Verify the bundle still builds and targets correctly after the conversion:
      `moon run platform:fleet_build` and `bin/fleet-lint-targets` both pass, and the rendered
      bundle still carries the `openbao-config` label and both `dependsOn` selectors — it is a
      `dependsOn` target, so a mis-shaped bundle stalls everything downstream of it.
- [x] 10.6 Rewrite `bin/openbao-plugin-pin` to write `openbao-config/values.yaml` instead of the
      two `plugin-*.yaml` files, keeping the single-commit atomicity and the post-write
      verification that a `yq` selector matching nothing fails loudly. Update the bats suite,
      including the fixture tree, and verify the "no commit ever changes a tag without the
      checksum beside it" case still fails if atomicity is deliberately broken.
- [x] 10.7 Add `libs/release` with `self_upgrade` — compute the pins, commit them on the fixed
      branch `chore/openbao-plugin-pins`, push it, and open or update one PR against `main`.
      Verify it converges rather than accumulating: running it twice against the same published
      images leaves exactly one PR, and running it after a newer publish updates that PR instead
      of opening a second.
- [x] 10.8 Add `self_upgrade_check` asserting the committed pins are internally consistent — the
      init-container tag in `openbao/values.yaml` equals `plugins.<name>.version` in
      `openbao-config/values.yaml` — and wire it into CI. Verify it fails when the two are
      deliberately desynchronised, since that cross-bundle duplication is the one thing the
      single-commit property cannot itself guarantee.
- [x] 10.9 Point `publish.yaml` at `release:self_upgrade` and remove the direct push to `main`.
      Verify no step in any workflow pushes to `main`, and that the job still fails when the
      pins cannot be proposed — publishing nothing must never report success.
- [x] 10.10 Enable Trunk's `commitlint` action with a `commitlint.config.js` whose types match
      what release-please treats as releasable. Verify a malformed message is rejected at commit
      time and a conventional one is not.
- [x] 10.11 Add a `pull_request` CI job linting the **PR title** against the same config, on
      `[opened, edited, synchronize, reopened]` per D12. Verify it fails a non-conventional
      title and passes a conventional one, and confirm by API that
      `squash_merge_commit_title` is still `PR_TITLE` — the job is only meaningful while that
      holds.
- [x] 10.12 Add a Renovate `customManagers` entry tracking `plugins.<name>.version` in
      `openbao-config/values.yaml` against the ghcr repositories, so a human can see when a
      published plugin has not yet been pinned. Verify it does **not** also try to manage
      `sha256`, which Renovate cannot compute and would leave half-updated.

## 9. Rollout and integration verification

- [x] 9.1 On merge, confirm `publish.yaml` published both `0.1.4` and `0.1.0` and that
      `regctl manifest head` resolves both — the ghcr drift reconciled with no version
      bump.
- [x] 9.2 Make the `openbao-plugin-secrets-cloudflare` ghcr package public and verify an
      unauthenticated pull succeeds. Until this is done a fresh pull fails exactly as the current
      404 does.
- [x] 9.3 Confirm `release:self_upgrade` opened ONE pull request, that its single commit moves
      the init-container tags and `plugins.<name>.{version,sha256}` together, and that merging it
      makes `release:self_upgrade_check` pass on `main`. Expect the shas to change even though
      the versions did not, because the previously pinned values came from local builds.
- [x] 9.4 Remove the side-loaded plugin images from the secret cluster node's containerd so the
      registry copies are pulled, then verify both engines register with no "checksum mismatch"
      and `openbao-config` reconciles. Without this the node keeps serving the locally-built
      image under `imagePullPolicy: IfNotPresent` while the pin now describes the registry's.
- [x] 9.5 Verify idempotence on the real pipeline: re-run `publish.yaml` unchanged and confirm it
      pushes nothing, opens no second pull request, and succeeds — and separately that a re-run of a *whole*
      workflow (not just failed jobs) is still correct, which is the property gating on
      `releases_created` would have broken.
- [ ] 9.6 Verify the multi-package release end to end: land a `fix:` touching both plugin
      directories, confirm one release PR covering both packages at independent versions, merge
      it, and confirm two tags, two published images, and one pin commit.
- [ ] 9.7 Verify a source-only change publishes nothing: push a change to a plugin's `src/` with
      no version bump and confirm no push occurs and the existing digest is unchanged.
