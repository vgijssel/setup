# Tasks

## 1. Pre-flight checks that can change the design

These are cheap and each one invalidates part of `design.md` if it comes out the other way. Do
them before writing code.

- [ ] 1.1 Confirm `sys/plugins/catalog` requires `sha256` on this OpenBao version — check the
      running server's API docs or attempt a registration without it — and record the result in
      `design.md`. If it is optional, D5's entire write-back mechanism is unnecessary and the
      change shrinks substantially.
- [ ] 1.2 Determine whether `main` is protected and whether `RELEASES_TOKEN_GITHUB` /
      `vgijssel-bot` can push to it directly (`gh api repos/vgijssel/setup/branches/main/protection`).
      If a direct push is rejected, switch D5 to opening a PR and note it in `design.md` — no spec
      changes either way.
- [ ] 1.3 Confirm a workflow `GITHUB_TOKEN` with `packages: write` can push to
      `ghcr.io/vgijssel/setup/*`, or that `PACKAGES_TOKEN_GITHUB` can. Verify by pushing a
      throwaway tag from a scratch workflow run and deleting it; `plan.md` records that no
      current credential carries `write:packages`, which is why the cloudflare repository does
      not exist.
- [ ] 1.4 Record the exact `regctl manifest head` stderr for all three states against real
      references — an existing tag, a 404 tag in an existing repo, and the nonexistent
      `openbao-plugin-secrets-cloudflare` repo — and confirm `http 404` / `NAME_UNKNOWN` actually
      appear in them. D6's entire correctness rests on this string match.

## 2. Shared registry probe

- [ ] 2.1 Add `bin/registry-tag-exists <ref>` implementing the three-state contract from D6
      (exit `0` present, `10` positively absent, anything else failure with the probe's own error
      on stderr), using the strings captured in 1.4. Verify `trunk check` passes on it, including
      shellcheck.
- [ ] 2.2 Add a `bats` suite covering all three states with a stubbed `regctl` earlier on `PATH`,
      following the harness in `.devcontainer/tests/test.bats`. Verify it fails when the
      ambiguous case is deliberately made to exit `10` instead of `1` — a test that cannot catch
      the fail-open bug is not testing the thing that matters.
- [ ] 2.3 Wire the suite into a moon task so it runs in CI, and verify it executes under
      `moon run <project>:test` and under `moon ci`.

## 3. Version single-sourcing in both plugins

- [ ] 3.1 Add `libs/openbao-netbird-plugin/version.txt` containing `0.1.4` and
      `libs/openbao-cloudflare-plugin/version.txt` containing `0.1.0` — the versions
      `apps/secret/src/openbao/values.yaml` already pins, per D8. Verify each matches the
      corresponding `image:` tag in `values.yaml` exactly.
- [ ] 3.2 Change both `release.sh` to read `version.txt` with no fallback, deleting the
      `VERSION="${VERSION:-0.1.3}"` / `0.1.0` defaults. Verify that moving `version.txt` aside
      makes the script exit non-zero without building, and that with it present the script
      reports the expected `IMAGE_REF`.
- [ ] 3.3 Narrow both `release` tasks in `moon.yml` to `inputs: [version.txt, /bin/registry-tag-exists,
      "@group(regctl_bin)"]` and nothing from `src/` or `Dockerfile`, per D3. Verify with
      `moon run <project>:release --dry-run` (or by touching a source file and confirming the
      task is reported as not affected) that a source-only change does not re-trigger a publish.
- [ ] 3.4 Add `libs/openbao-netbird-plugin/plugin-sha.sh` and a `plugin_sha` moon task mirroring
      the cloudflare plugin's, replacing the logic inlined in `release-local.sh` — including the
      `--entrypoint sha256sum` that is required because the image ENTRYPOINT is the plugin binary
      itself. Verify both `moon run openbao-netbird-plugin:plugin_sha` and
      `moon run openbao-cloudflare-plugin:plugin_sha` print a 64-character hex digest for a
      locally-built image.

## 4. Idempotent publish

- [ ] 4.1 Add the `bin/registry-tag-exists` call to both `release.sh` ahead of the build, mapping
      exit `0` to a clean skip and exit `10` to proceeding, per D6. Verify by running
      `release.sh` twice against a version already in the registry and confirming it skips and
      exits `0` both times with no push.
- [ ] 4.2 Verify the ambiguous path end to end: run `release.sh` with an unreachable or
      unauthenticated registry and confirm it exits non-zero and pushes nothing, rather than
      treating the failed probe as permission to publish.
- [ ] 4.3 Update the comments in both `release.sh` to state that the script's single side effect
      is the push, and that pin propagation deliberately lives outside it (D6 rule 2). Verify the
      comment names the bootstrap case, which is where the two disagree.

## 5. Pin propagation

- [ ] 5.1 Add `bin/openbao-plugin-pin` writing, in one pass, the init-container image tags in
      `apps/secret/src/openbao/values.yaml` and the `plugin_sha256` values in
      `apps/secret/src/openbao-config/plugin-{netbird,cloudflare}.yaml`, using `yq` and the arm64
      digest from `plugin-sha.sh`. Verify `trunk check` passes and that a run against the current
      tree produces a diff touching exactly those three files.
- [ ] 5.2 Make the script commit only when the diff is non-empty. Verify that running it twice in
      a row produces exactly one commit, satisfying the spec's "re-propagating correct pins is a
      no-op".
- [ ] 5.3 Verify atomicity directly: confirm that no committed state has a new image tag beside
      an old checksum, by checking that each produced commit either changes both files or
      neither. This is the single property that D5's whole shape exists to guarantee.
- [ ] 5.4 Add a `bats` case asserting the no-op behaviour against a fixture tree with
      already-correct pins, reusing the harness from 2.2.
- [ ] 5.5 Update the "update both together" comments in `values.yaml`,
      `plugin-netbird.yaml` and `plugin-cloudflare.yaml` to say the values are now written by
      `bin/openbao-plugin-pin` from CI, and that hand-editing them will be overwritten. Verify
      the comments no longer instruct a human to run `plugin_sha` manually as the normal path.

## 6. release-please configuration

- [ ] 6.1 Add `release-please-config.json` per D1: `separate-pull-requests: false`,
      `include-component-in-tag: true`, `tag-separator: "@"`, both packages at
      `release-type: "simple"` with explicit `component` values, and no `extra-files`. Verify
      with `release-please --dry-run` that it resolves both packages and proposes no edit to
      `values.yaml`.
- [ ] 6.2 Add `.release-please-manifest.json` seeded to `0.1.4` and `0.1.0`, matching
      `version.txt` from 3.1. Verify the two files agree.
- [ ] 6.3 Set `bootstrap-sha` to this change's merge commit. Verify via `--dry-run` that
      release-please proposes versions derived from the manifest and does not start either
      package at `1.0.0` off the ~239 legacy tags.
- [ ] 6.4 Verify path-based routing with a dry run over a commit touching only one plugin
      directory, confirming only that package is proposed for a bump, and over one touching both,
      confirming both are.

## 7. Workflows

- [ ] 7.1 Add `.github/workflows/release-please.yaml` on `push: main`, using
      `RELEASES_TOKEN_GITHUB`. Verify the release PR it opens is labelled with release-please's
      default labels — D-level note: do not rename them without also setting `label` /
      `release-label`, and do not set `skip-github-release`, which would suppress the git tag.
- [ ] 7.2 Add `.github/workflows/publish.yaml` on `push: main` plus a nightly `schedule`, with
      `concurrency: { group: publish-main, cancel-in-progress: false }` and `packages: write`,
      invoking the two `release` tasks explicitly rather than `moon run :release` (which would
      fire the broken `fleet-mcp` / `devcontainer` scripts and the carved-out `talos-image`).
      Verify it reads none of release-please's outputs.
- [ ] 7.3 Add the `bin/openbao-plugin-pin` step to `publish.yaml`, after both publishes succeed,
      committing as `vgijssel-bot` with a `chore(secret):` subject. Verify the commit touches
      only `apps/secret/**` and so cannot route to either release-please package.
- [ ] 7.4 Delete `.github/workflows/release-openbao-netbird-plugin.yaml` and remove the
      commented-out body and the `# TODO: Need to replace release pipeline with something else`
      from `.github/workflows/release.yaml`. Verify no remaining workflow passes a hard-coded
      `VERSION` to either plugin.
- [ ] 7.5 Document the pipeline where the next person will look — a short section covering the
      merge-to-published flow, the three-state guard, and that pins are bot-written. Verify the
      commands it names run as written.

## 8. Renovate

- [ ] 8.1 Add the `packageRules` entry from D7 overriding `semanticCommitType` to `"fix"` for
      `libs/openbao-netbird-plugin/**` and `libs/openbao-cloudflare-plugin/**`. Verify against
      the renovate schema and, if available, with a dry run that an `alpine` bump in those
      directories is typed `fix(deps):` rather than `chore(deps):`.
- [ ] 8.2 Verify the complementary direction: confirm the existing automerge rule
      (`matchUpdateTypes: [minor, patch]`, `matchCurrentVersion: "!/^0/"`) still does not apply
      to these 0.x packages, so their dependency PRs continue to land by hand.

## 9. Rollout and integration verification

- [ ] 9.1 On merge, confirm `publish.yaml` published both `0.1.4` and `0.1.0` and that
      `regctl manifest head` resolves both — the `plan.md` §1 drift reconciled with no version
      bump.
- [ ] 9.2 Make the `openbao-plugin-secrets-cloudflare` ghcr package public and verify an
      unauthenticated pull succeeds. Until this is done a fresh pull fails exactly as the current
      404 does.
- [ ] 9.3 Confirm the pin commit landed and that `values.yaml` and both `plugin_sha256` values
      are mutually consistent within it. Expect the shas to change even though the versions did
      not, because the previously pinned values came from local builds.
- [ ] 9.4 Remove the side-loaded plugin images from the secret cluster node's containerd so the
      registry copies are pulled, then verify both engines register with no "checksum mismatch"
      and `openbao-config` reconciles. Without this the node keeps serving the locally-built
      image under `imagePullPolicy: IfNotPresent` while the pin now describes the registry's.
- [ ] 9.5 Verify idempotence on the real pipeline: re-run `publish.yaml` unchanged and confirm it
      pushes nothing, produces no commit, and succeeds — and separately that a re-run of a *whole*
      workflow (not just failed jobs) is still correct, which is the property gating on
      `releases_created` would have broken.
- [ ] 9.6 Verify the multi-package release end to end: land a `fix:` touching both plugin
      directories, confirm one release PR covering both packages at independent versions, merge
      it, and confirm two tags, two published images, and one pin commit.
- [ ] 9.7 Verify a source-only change publishes nothing: push a change to a plugin's `src/` with
      no version bump and confirm no push occurs and the existing digest is unchanged.
