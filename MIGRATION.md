# Migration Progress Tracking

This document tracks the progress of consolidating the monorepo structure into `apps/` and `libs/` directories.

See `.taskmaster/docs/prd-monorepo-consolidation.md` for the full migration plan.

## Phase 1: Foundation

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| Update CLAUDE.md with structure policy | Done | - | Already documented |
| Create migration tracking document | Done | - | This document |
| Configure NX dependency constraints | Done | - | Added workspaceLayout, targetDefaults, scope tags |

## Phase 2: Stacks Migration

Move `stacks/` contents to `apps/`.

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| codex | Done | - | Moved to apps/codex |
| dev-cluster | Done | - | Moved to apps/dev-cluster-stack (renamed to avoid collision) |
| enigma-cluster | Done | - | Moved to apps/enigma-cluster |
| enigma-cozy | Done | - | Moved to apps/enigma-cozy |
| provisioner | Done | - | Moved to apps/provisioner |
| root-cluster-prod | Done | - | Moved to apps/root-cluster-prod |
| Delete empty stacks/ | Done | - | Directory removed |

## Phase 3: Services Migration

Move `services/` contents to `apps/`.

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| kubevirt-config | Done | - | Moved to apps/kubevirt-config |
| myvm | Done | - | Moved to apps/myvm |
| testing | Done | - | Moved to apps/testing |
| tinkerbell | Done | - | Moved to apps/tinkerbell |
| windmill | Done | - | Moved to apps/windmill |
| windmill-ingress | Done | - | Moved to apps/windmill-ingress |
| Delete empty services/ | Done | - | Directory removed |

## Phase 4: Tools Cleanup and Migration

### 4a. Delete obsolete Bazel-only wrappers

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| bazel/ | Done | - | Deleted, workspace_status.sh not needed |
| black/ | Done | - | Deleted, use trunk/hermit instead |
| homebrew/ | Done | - | Deleted, please/plz obsolete |
| pulumi/ | Done | - | Deleted, use hermit instead |
| pytest/ | Done | - | Deleted, use standard py_test |
| teleport/ | Done | - | Deleted, use hermit instead |
| tilt/ | Done | - | Deleted, use hermit instead |

### 4b. Delete obsolete hypervisor tools

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| packer/ | Done | - | Deleted |
| pyinfra/ | Done | - | Deleted |
| vagrant/ | Done | - | Deleted |
| Clean BUILD.bazel | Done | - | Removed commented imports |

### 4c. Evaluate and decide

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| macos/ | Done | - | Deleted - no active references found, script unused |
| template/ | Done | - | Deleted - please/plz not used in repo |

### 4d. Migrate active tools to libs/

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| docker/ | Done | - | Moved to libs/docker |
| onepassword/ | Done | - | Moved to libs/onepassword |
| python/ | Done | - | Moved to libs/python, merged with third_party/python |
| Delete empty tools/ | Done | - | Directory removed |

## Phase 5: Third-Party Migration

Move `third_party/` contents to `libs/`.

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| hermit | Deferred | - | Kept in third_party/ - manages hermit packages |
| javascript | Deferred | - | Kept in third_party/ - Deno dependencies |
| python | Done | - | Merged into libs/python |
| vendir | Deferred | - | Kept in third_party/ - vendored Helm charts |
| Delete empty third_party/ | N/A | - | Keeping some items in third_party/ |

## Phase 6: Cleanup and Validation

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| Run nx graph validation | Done | - | 46 projects validated, no broken dependencies |
| Update CI/CD pipelines | Done | - | No changes needed, uses Nx-based commands |
| Run full test suite | Done | - | Core tests pass, environmental issues documented |
| Update documentation references | Done | - | MIGRATION.md updated |
| Update package-lock.json | Done | - | Removed stale stacks/* references |

## Detailed Migration Notes

### Phase 4c: tools/template/ and tools/macos/ Evaluation (Task 8)

**Analysis performed on 2025-12-23:**

1. **tools/template/** - Deleted
   - **References found**: PRD documentation, internal build files (template.build_defs, test files)
   - **Please/Plz usage check**:
     - .gitignore has plz-out entries (legacy)
     - No .plzconfig, BUILD.plz, or active Please builds found
     - PRD indicates Please is obsolete
   - **Decision**: Deleted via `git rm -r tools/template/`
   - **Rationale**: Please/Plz build system no longer used; template was only for Please templating

2. **tools/macos/** - Deleted
   - **References found**: Only in PRD documentation
   - **Directory contents**: BUILD.bazel (minimal), macos-remote-setup.sh (997 bytes)
   - **Usage check**: No active references in codebase
   - **Decision**: Deleted via `git rm -r tools/macos/`
   - **Rationale**: No active usage found; SSH setup script not referenced anywhere in code

**Files removed:**
- tools/template/main.py
- tools/template/template.build_defs
- tools/template/test/Dockerfile
- tools/template/test/Dockerfile.expected
- tools/template/test/template_test.py
- tools/macos/BUILD.bazel
- tools/macos/macos-remote-setup.sh
