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
| codex | TODO | - | |
| dev-cluster | TODO | - | Name collision with libs/dev-cluster |
| enigma-cluster | TODO | - | |
| enigma-cozy | TODO | - | |
| provisioner | TODO | - | |
| root-cluster-prod | TODO | - | |
| Delete empty stacks/ | TODO | - | After all items migrated |

## Phase 3: Services Migration

Move `services/` contents to `apps/`.

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| kubevirt-config | TODO | - | |
| myvm | TODO | - | |
| testing | TODO | - | |
| tinkerbell | TODO | - | |
| windmill | TODO | - | |
| windmill-ingress | TODO | - | |
| Delete empty services/ | TODO | - | After all items migrated |

## Phase 4: Tools Cleanup and Migration

### 4a. Delete obsolete Bazel-only wrappers

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| bazel/ | TODO | - | Inline workspace_status.sh if needed |
| black/ | TODO | - | Use trunk/hermit instead |
| homebrew/ | TODO | - | please/plz obsolete |
| pulumi/ | TODO | - | Use hermit instead |
| pytest/ | TODO | - | Use standard py_test |
| teleport/ | TODO | - | Use hermit instead |
| tilt/ | TODO | - | Use hermit instead |

### 4b. Delete obsolete hypervisor tools

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| packer/ | TODO | - | Commented out in hypervisor |
| pyinfra/ | TODO | - | Commented out in hypervisor |
| vagrant/ | TODO | - | Commented out in hypervisor |
| Clean BUILD.bazel | TODO | - | Remove commented imports |

### 4c. Evaluate and decide

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| macos/ | Done | - | Deleted - no active references found, script unused |
| template/ | Done | - | Deleted - please/plz not used in repo |

### 4d. Migrate active tools to libs/

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| docker/ | TODO | - | Move to libs/docker |
| onepassword/ | TODO | - | Move to libs/onepassword |
| python/ | TODO | - | Merge with third_party/python |
| Delete empty tools/ | TODO | - | After all items handled |

## Phase 5: Third-Party Migration

Move `third_party/` contents to `libs/`.

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| hermit | TODO | - | |
| javascript | TODO | - | |
| python | TODO | - | Merge with tools/python |
| vendir | TODO | - | |
| Delete empty third_party/ | TODO | - | After all items migrated |

## Phase 6: Cleanup and Validation

| Item | Status | PR Link | Notes |
|------|--------|---------|-------|
| Run nx graph validation | TODO | - | |
| Update CI/CD pipelines | TODO | - | |
| Run full test suite | TODO | - | |
| Update documentation references | TODO | - | |

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
