// Conventional-commit rules for this repo.
//
// WHY THIS IS ENFORCED RATHER THAN REVIEWED: release-please derives each package's next version
// from the commit TYPES that touched its files (release-please-config.json). A wrongly-typed or
// malformed subject therefore does not merely read badly — it silently produces the wrong version
// decision, or none at all, and the artifact never ships. That is the same class of bug as the
// renovate `semanticCommitType` override in renovate.json.
//
// WHERE IT RUNS, AND WHY BOTH PLACES:
//   - locally, via Trunk's `commitlint` action (a commit-msg hook) — see .trunk/trunk.yaml
//   - in CI, against the PULL REQUEST TITLE — see .github/workflows/test.yaml
//
// The CI half is the one that matters for correctness. This repository allows squash merges ONLY
// (the `protected-main` ruleset's `allowed_merge_methods: ["squash"]`) and
// `squash_merge_commit_title` is `PR_TITLE`, so the individual commit messages on a branch never
// enter main's history — the PR title becomes the conventional commit release-please reads.
// Linting only the branch commits would enforce the convention on exactly the messages that do
// not matter, and a git hook cannot run in CI at all.
//
// THE RULES ARE SPELLED OUT RATHER THAN `extends`-ed. Two reasons. Resolution: the CLI is a pinned
// pnpm tool under third_party/javascript/tools/commitlint, so `@commitlint/config-conventional`
// is not resolvable from this file's directory and `extends` fails with MODULE_NOT_FOUND. And
// legibility: this rule set encodes which commit types do and do not ship a release, which is
// worth reading here instead of chasing through a preset.
//
// See openspec/changes/release-please-openbao-plugins/design.md (D12).
module.exports = {
  rules: {
    // The types release-please understands. `feat` and `fix` are the two that produce a version
    // bump; the rest are recorded but non-releasable. Anything outside this list is REJECTED
    // rather than silently treated as non-releasable — a typo'd `faet:` must not read as "no
    // release intended".
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Scopes are free-form on purpose. Commits route to release-please packages by FILE PATH, not
    // by scope, so constraining the scope list would add a rule that governs nothing while
    // breaking the repo's existing `fix(network,secret):`-style multi-scope subjects.
    "scope-case": [2, "always", "lower-case"],

    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],

    // Generous: a squashed subject carries a ` (#1234)` suffix it did not have on the branch.
    "header-max-length": [2, "always", 120],

    // Structural, and cheap to get right.
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
  },
};
