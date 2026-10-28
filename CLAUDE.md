# Development Guidelines for AI Assistants

## Project Structure

This Moon monorepo uses a **two-directory structure**. All code MUST go into one of these directories:

- **`apps/`**: Deployable applications, services, and environment-specific configurations (clusters, stacks)
- **`libs/`**: Reusable libraries, shared utilities, build tools, and external dependency wrappers

### Code Placement Rules

**DO NOT** place new code in `stacks/`, `services/`, `tools/`, `third_party/`, or any other top-level directory. These directories are deprecated and being migrated. The `specs/` directory is managed by speckit and should be left as-is.

| If your code... | Place it in |
|-----------------|-------------|
| Is deployable independently | `apps/` |
| Has its own CI/CD pipeline | `apps/` |
| Is environment-specific (cluster config) | `apps/` |
| Is reusable across projects | `libs/` |
| Is a build tool or utility | `libs/` |
| Wraps an external dependency | `third_party/` |

## Core Commands

### Project Discovery
```bash
bin/help                      # Interactive help with real targets and descriptions
moon query projects           # List all projects
moon project <name>           # Show project details
moon query tasks              # List all tasks
```

### Common Operations
```bash
moon run <project>:build      # Build a project
moon run <project>:test       # Test a project
moon run :test --affected     # Test only affected projects
moon check --all              # Run build/test/lint on all projects
moon ci <base> <head>         # Run affected tasks in CI mode
```

## Code Quality Standards

- **Formatting & Linting**: Use `trunk fmt` and `trunk check` before committing
- **Testing**: All projects include tests for TDD and AI performance
- **Environment Setup**: Use `direnv allow` to setup binary dependencies
- **Platform Detection**: Use `IS_MACOS` and `IS_LINUX` environment variables

### Prose linting

Trunk runs Vale 3.13.0 with Google 0.6.3 at warning and error levels. The existing
`trunk_check` pull request job and local hooks use the same configuration. Trunk
installs Vale and the pinned comment parser; its `prepare_run` step runs `vale sync`
before checking prose. No global Vale installation or populated style cache is needed.
To initialize dependencies explicitly, or refresh styles after changing the package pin:

```bash
direnv allow
bin/trunk tools install vale prose-parser
bin/trunk exec -- vale --config .vale.ini --no-global sync
moon run prose-lint:test
trunk fmt
trunk check
trunk check --all --filter=vale --no-fix --show-existing
```

Coverage:

- First-party `.md` and `.markdown` files, including `openspec/specs/`, active
  `openspec/changes/`, and `openspec/changes/archive/`. Markdown code fences and inline
  code stay excluded. OpenSpec requirement keywords and change-section headings have
  narrow syntax exceptions; their prose still receives checks. These exact syntax
  exceptions apply to Markdown by extension because Vale 3.13 matches ignore patterns
  by extension, not by source path.
- First-party `.py` comments and module, class, and function documentation strings,
  through Vale's native Python parser. Ordinary strings are not prose.
- Comments in `apps/**/*.yaml`, `apps/**/*.yml`, `libs/**/*.yaml`, and `libs/**/*.yml`,
  including Kubernetes manifests and Helm values. A pinned YAML grammar selects comment
  nodes, not scalar values. Quoted hashes and literal or folded block scalars are not prose.
- Helm template comments and YAML comments in those YAML paths beneath `templates/`,
  plus `apps/**/templates/*.{tpl,txt}` and `libs/**/templates/*.{tpl,txt}` at any depth.
  The adapter recognizes trimmed comment delimiters and masks template expressions before
  parsing YAML. It does not render charts or contact a cluster. Diagnostics retain source
  paths, lines, and columns.

The adapter checks static comments, not prose produced by template evaluation, embedded
scripts, or scalar values. It parses masked templates without validating rendered YAML;
unclosed template expressions or comments produce an error. Python parser support is
limited to the grammar bundled with the pinned Vale version. Bats fixtures exercise all
three comment formats through Trunk, including the PiKVM deployment and Envoy template.

Existing all-linter exclusions remain in force. Vale also excludes `specs/`, `third_party/`,
downloaded `.vale/` styles, regression fixtures, dependency directories (`node_modules/`,
`vendor/`, `vendored/`, `charts/`, `.venv/`, `venv/`), build output (`dist/`, `build/`), and
generated Python protobuf files. Generated assistant instructions in
`.claude/commands/opsx/`, `.claude/commands/speckit.*.md`, and
`.claude/skills/openspec-*/` are excluded; OpenSpec specifications are not.
`openspec/config.yaml` is outside the YAML scope.
Use Trunk rather than a recursive direct Vale invocation to retain these path exclusions.
Existing findings remain a backlog; normal `trunk check` enforces new issues without a
repository-wide cleanup. Google spelling is off; no dictionary is configured.
The `Packages` and `BasedOnStyles` settings in `.vale.ini` support a later, separately
pinned ai-tells rollout. ai-tells is not enabled now.

## File Creation Policy

- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** create files unless absolutely necessary for the goal
- **NEVER** proactively create documentation files (*.md) or README files
- Only create documentation when explicitly requested

## Technology Stack

- **Build**: Moon monorepo orchestration (https://moonrepo.dev)
- **Infrastructure**: Talos Linux, Kubernetes
- **Automation**: Home Assistant, ESPHome, pyinfra
- **Quality**: Trunk CLI with black, ruff, shellcheck, yamllint

## Moon Concepts

- **Tasks**: Defined in `moon.yml` files in each project, or globally in `.moon/tasks/`
- **Caching**: Automatic content-based caching - repeated runs are instant
- **Dependencies**: Use `deps: ['^:build']` to depend on upstream project builds
- **CI Mode**: `moon ci <base> <head>` detects and runs only affected tasks
- **Sharding**: Use `--shard current/total` for parallel CI execution

## Best Practices

### Dependency Management
All external dependencies MUST be pinned to specific versions to prevent security vulnerabilities and unexpected behavior changes:
- **npm/yarn**: Use exact versions (e.g., `"lodash": "4.17.21"` not `"lodash": "^4.17.21"`)
- **Python**: Pin to exact versions in requirements.txt (e.g., `mkdocs==1.6.1`)
- **Docker**: Use specific tags (e.g., `python:3.12.8-slim` not `python:3.12-slim` or `python:latest`)
- **Terraform**: Pin provider versions (e.g., `version = "2.11.0"` not `version = "~> 2.11"`)
- **GitHub Actions**: Use commit SHAs or exact tags (e.g., `actions/checkout@v4` or `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`)
- **Go modules**: Use specific versions in go.mod
- **Helm charts**: Pin chart versions in Chart.yaml

**NEVER** use tools that run unpinned packages:
- **`npx`**: Fetches and runs the latest version of packages without version control
- **`uvx`**: Same issue - runs packages without pinning versions

Instead, install dependencies explicitly with pinned versions, then run them directly.

This ensures reproducible builds, prevents security vulnerabilities from compromised package updates, and avoids unexpected breaking changes. Use Renovatebot for automated dependency updates.

### Platform Detection
Use consistent environment variables:
- Chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
- Goss tests: `skip: {{.Env.IS_MACOS}}`
- Shell scripts: `if [ "$IS_MACOS" = "true" ]; then`

### Kubernetes Naming
Format: `<kind>-<name>.yaml` (e.g., `deployment-app.yaml`, `service-app.yaml`)

### kind (Kubernetes in Docker) Configuration
When creating kind clusters in Coder workspaces (docker-in-docker environment), **ALWAYS** use the native snapshotter instead of overlayfs to avoid overlay filesystem mount errors:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".containerd]
    snapshotter = "native"
nodes:
- role: control-plane
```
**Why**: The default overlayfs snapshotter fails in docker-in-docker with error:
```
failed to mount rootfs component: ... fstype: overlay, ... data: "...,index=off", err: invalid argument
```
The native snapshotter avoids this by using simple directory copies instead of overlay mounts.
**DO NOT** use `extraMounts` or `type: DirectoryOrCreate` - these don't solve the overlay issue and the `type` field is invalid in kind v1alpha4.

### Terraform Best Practices
Use `postconditions` in `data` resources to validate their state:
```hcl
data "aws_instance" "example" {
  instance_id = "i-1234567890abcdef0"

  lifecycle {
    postcondition {
      condition     = self.state == "running"
      error_message = "Instance must be running"
    }
  }
}
```

### Releases
Releases are managed via project-specific release tasks. Artifacts are automatically published to GitHub as part of the release process.

#### Commit messages are load-bearing

Version decisions are **derived** from conventional-commit types, so a wrongly-typed subject does
not merely read badly — it silently ships nothing. `commitlint.config.js` is therefore enforced
twice, and the split is not redundancy:

- **locally**, by Trunk's `commitlint` action (a commit-msg hook), on each commit as it is written
- **in CI**, by the `Commit Convention` job, on the **pull request title**

The CI half is the one that matters. This repo allows **squash merges only** and
`squash_merge_commit_title` is `PR_TITLE`, so a branch's individual commit messages never enter
`main`'s history — the PR title becomes the conventional commit release-please reads. Retitling a
PR re-runs the check.

**OpenBao plugins (`libs/openbao-netbird-plugin`, `libs/openbao-cloudflare-plugin`)** are the
onboarded packages. Two independent workflows, and the separation is load-bearing:

| Workflow | Trigger | Owns |
|---|---|---|
| `.github/workflows/release-please.yaml` | `push: main` | version decisions — `version.txt`, CHANGELOG, tag, GitHub Release |
| `.github/workflows/publish.yaml` | `push: main` + nightly | building and pushing images, and the consumer pins |

Merge-to-published, end to end:

1. A `fix:` or `feat:` commit touching a plugin directory lands on `main`. release-please routes
   it to a package by **file path**, not by the scope in the subject, and opens **one** release
   PR covering both packages at independent versions.
2. A human merges the release PR. That writes `libs/<plugin>/version.txt` and cuts a
   `<component>@<version>` tag.
3. `publish.yaml` runs `moon run :release --query "tag=releasable"` — selected by **tag**, so
   there is no list to maintain; a project opts in with `tags: [releasable]` and inherits the
   task from `.moon/tasks/tag-releasable.yml`. Each `release.sh` reads its `version.txt` — there
   is **no fallback version** — and probes the registry via `bin/registry-tag-exists`, which
   answers in **three** states: present → skip; an explicit `http 404` → publish; **anything
   else → fail**. A probe that fails for an unrelated reason is never read as permission to
   push, because re-pushing a live tag changes its digest and silently invalidates the checksums
   pinned downstream.
4. `moon run release:self_upgrade` then **opens a pull request** carrying the init-container
   image tags in `apps/secret/src/openbao/values.yaml` **and** the matching
   `plugins.<name>.{version,sha256}` in `apps/secret/src/openbao-config/values.yaml` — in
   **one** commit, as `vgijssel-bot`. Those values are **bot-written**; hand edits are
   overwritten.
5. **A human merges that PR**, and that is what makes the new plugin the deployed state. It is a
   PR and not a push to `main` because this is the only point at which the newly published
   plugin is validated against the apps that deploy it.

Things that look like bugs and are not:

- **`publish.yaml` reads none of release-please's outputs.** release-please is a label state
  machine, so on a re-run `releases_created` is false and `paths_released` empty; a workflow
  gated on them goes green having published nothing. Publishing instead converges against the
  registry, which is what makes re-running the whole workflow — and the nightly schedule —
  correct.
- **`self_upgrade` reuses one fixed branch** (`chore/openbao-plugin-pins`) and compares *trees*,
  not commits. Publishing runs on every push to `main` and nightly, so opening a fresh PR each
  time would accumulate them; instead there is always at most one, always describing the newest
  publish. Closing it unmerged is fine — the next run re-opens it.
- **The checksum is a values entry, not a literal in the Workspace.** `openbao-config` is a local
  Helm chart for exactly that reason: a `plugin_sha256` buried in the inline Terraform could only
  be changed by textual substitution, which is unsafe for both a human and Renovate.
- **Renovate tracks the plugin `version` but never the `sha256`.** It knows registry manifest
  digests, not the checksum of a file *inside* an image, so pointed at both it would move the tag
  and strand the checksum. Its manager here exists only to surface a published version that has
  not been pinned yet.
- **Changing a plugin's `src/` with no version bump publishes nothing.** Versions are
  immutable; the conventional-commit type is what ships a change. `renovate.json` types
  dependency updates in these two directories as `fix` for exactly this reason — otherwise an
  alpine CVE bump would change the image but produce no version, and the guard would then
  correctly refuse to re-push.

To check a config change before trusting it in CI:

```bash
bin/release-please release-pr --repo-url=vgijssel/setup --target-branch=<branch> \
  --token="$(gh auth token)" --dry-run
moon run release:test                 # bats over both bin/ scripts; no network, no docker
moon run release:self_upgrade_check   # assert the committed pins agree across both bundles
bin/openbao-plugin-pin --no-commit    # write the pins, leave the diff in the worktree
SELF_UPGRADE_DRY_RUN=1 moon run release:self_upgrade   # commit locally, never push or call gh
printf 'feat(x): y' | bin/commitlint  # the same rules CI applies to a PR title
```
