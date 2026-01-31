# Monorepo Structure Consolidation PRD

## Overview

This PRD outlines the migration of all project code into a standardized two-directory structure following NX monorepo best practices. Currently, the codebase is fragmented across multiple top-level directories (`stacks/`, `services/`, `tools/`, `third_party/`, `specs/`), which creates confusion about where code belongs and makes dependency management harder. The goal is to consolidate everything into just `apps/` and `libs/`, providing clear ownership and consistent patterns.

**Problem**: Developers (human and AI) face ambiguity about where to place new code and how directories relate to each other.

**Solution**: Migrate all code into `apps/` (deployable units) or `libs/` (reusable modules), deprecating all other top-level code directories.

## Core Features

### 1. Clear Two-Directory Structure
- **apps/**: Contains deployable applications, services, and environment-specific configurations
- **libs/**: Contains reusable libraries, shared utilities, and modular components

### 2. Migration of Existing Directories

| Current Directory | Items | Target |
|-------------------|-------|--------|
| `stacks/` | codex, dev-cluster, enigma-cluster, enigma-cozy, provisioner, root-cluster-prod | `apps/` - These are deployable environment configurations |
| `services/` | kubevirt-config, myvm, testing, tinkerbell, windmill, windmill-ingress | `apps/` - These are deployable services |
| `tools/` | See detailed analysis below | Mixed: keep some in `libs/`, delete obsolete items |
| `third_party/` | hermit, javascript, python, vendir | `libs/` - External dependency management libraries |
| `specs/` | Feature specifications | **Keep as-is** - Managed by speckit |

### 2.1 Tools Directory Analysis

The `tools/` directory contains a mix of actively-used libraries and obsolete Bazel-only wrappers. After investigation:

#### KEEP - Migrate to `libs/` (actively used)

| Tool | Purpose | Usage |
|------|---------|-------|
| `python/` | Python OCI image building (`py_image`, `py_image_layer`), Python toolchain | Used by `libs/bunq2ynab`, `MODULE.bazel` |
| `docker/` | Docker loading utilities (`docker_load.bzl`, `docker_local_tar.bzl`, `docker_run_and_commit.bzl`) | Used by `tools/python/defs.bzl` |
| `onepassword/` | 1Password CLI wrapper with Python library for secrets | Used extensively in `libs/bunq2ynab`, `libs/rules_release`, root `BUILD.bazel` |

#### DELETE - Bazel-only executable wrappers (no longer needed)

These directories only exist to make executables available within Bazel. With Hermit/Trunk managing tools, they are obsolete:

| Tool | Contents | Reason to Delete |
|------|----------|------------------|
| `black/` | Single BUILD.bazel wrapping black formatter | Use trunk/hermit instead |
| `pulumi/` | BUILD.bazel files for pulumi CLI | Use hermit instead |
| `teleport/` | BUILD.bazel files for tsh CLI | Use hermit instead |
| `tilt/` | BUILD.bazel for tilt | Use hermit instead |
| `bazel/` | Single `workspace_status.sh` script | Minimal utility, can inline if needed |
| `homebrew/` | please/plz build definition only | Not Bazel, obsolete |
| `pytest/` | Bazel wrapper for pytest | Can use standard py_test |

#### DELETE - Obsolete hypervisor tools (commented out, unused)

These are referenced in `apps/hypervisor/BUILD.bazel` but ALL references are commented out:

| Tool | Contents | Reason to Delete |
|------|----------|------------------|
| `packer/` | Full packer_image Bazel rule | Commented out in hypervisor |
| `vagrant/` | Vagrant box conversion scripts | Commented out in hypervisor |
| `pyinfra/` | pyinfra runner for Bazel | Commented out in hypervisor |

#### EVALUATE - May delete or keep

| Tool | Contents | Decision Needed |
|------|----------|-----------------|
| `macos/` | Single script `macos-remote-setup.sh` for SSH setup | May move to `bin/` or delete if unused |
| `template/` | Jinja2 templating for please/plz (not Bazel) | Delete if please/plz not used |

### 3. NX Project Configuration
Each migrated project must have:
- A `project.json` with proper NX configuration
- Clear `tags` for dependency constraints
- Defined `targets` (build, test, lint, deploy as applicable)

## User Experience

### User Personas
1. **Developers**: Need clear guidance on where to add new code
2. **AI Assistants**: Need unambiguous rules for code placement
3. **CI/CD Systems**: Need consistent project structure for automation

### Key User Flows
1. **Adding new code**: Check if it's deployable (apps) or reusable (libs)
2. **Finding existing code**: Look only in apps/ or libs/
3. **Understanding dependencies**: libs can depend on libs; apps can depend on libs and other apps

## Technical Architecture

### Directory Structure After Migration

```
/workspaces/setup/
├── apps/
│   ├── blueorange/              # Existing app
│   ├── coder-cluster-prod/      # Existing app
│   ├── coder-prod/              # Existing app
│   ├── codex/                   # From stacks/
│   ├── dev-cluster/             # From stacks/
│   ├── docs/                    # Existing app
│   ├── enigma-cluster/          # From stacks/
│   ├── enigma-cozy/             # From stacks/
│   ├── escaperoom/              # Existing app
│   ├── gateway-prod/            # Existing app
│   ├── haos/                    # Existing app
│   ├── hypervisor/              # Existing app
│   ├── kubevirt-config/         # From services/
│   ├── myvm/                    # From services/
│   ├── provisioner/             # From stacks/
│   ├── root-cluster-prod/       # From stacks/
│   ├── testing/                 # From services/
│   ├── tinkerbell/              # From services/
│   ├── windmill/                # From services/
│   └── windmill-ingress/        # From services/
├── libs/
│   ├── 1password-secrets/       # Existing lib
│   ├── ansible/                 # Existing lib
│   ├── bunq2ynab/               # Existing lib
│   ├── coder-devcontainer/      # Existing lib
│   ├── dev-cluster/             # Existing lib
│   ├── devenv/                  # Existing lib
│   ├── distrobuilder-image/     # Existing lib
│   ├── docker/                  # From tools/ (KEEP)
│   ├── esphome_nimble/          # Existing lib
│   ├── external-dns-cleanup/    # Existing lib
│   ├── fleet-mcp/               # Existing lib
│   ├── hermit/                  # From third_party/
│   ├── internal-dns/            # Existing lib
│   ├── internal-networking/     # Existing lib
│   ├── ipxe-efi/                # Existing lib
│   ├── ipxe-vm/                 # Existing lib
│   ├── javascript/              # From third_party/
│   ├── nx-help/                 # Existing lib
│   ├── nx-internal/             # Existing lib
│   ├── occupancy_component/     # Existing lib
│   ├── onepassword/             # From tools/ (KEEP)
│   ├── pikvm-lxc/               # Existing lib
│   ├── python/                  # From tools/ (KEEP) and third_party/
│   ├── rules_release/           # Existing lib
│   ├── rules_task/              # Existing lib
│   ├── spacelift/               # Existing lib
│   ├── vault-login/             # Existing lib
│   ├── vault-shell/             # Existing lib
│   └── vendir/                  # From third_party/
└── bin/                         # Keep: CLI scripts (not NX projects)
```

### Non-Migrated Directories (Keep As-Is)
- `bin/`: Standalone CLI scripts, not NX projects
- `specs/`: Feature specifications managed by speckit
- `.github/`: GitHub workflows and configurations
- `.taskmaster/`: Task Master configuration
- `.devcontainer/`: Dev container configuration
- `secrets/`: Secret management (gitignored)
- `node_modules/`: Package dependencies
- `.nx/`: NX cache

### NX Tags Strategy
```json
{
  "tags": ["scope:app", "type:cluster"]     // For cluster deployments
  "tags": ["scope:app", "type:service"]     // For services
  "tags": ["scope:lib", "type:tool"]        // For build tools
  "tags": ["scope:lib", "type:infra"]       // For infrastructure libs
  "tags": ["scope:lib", "type:external"]    // For third-party wrappers
}
```

## Development Roadmap

### Phase 1: Foundation (MVP)
1. Update CLAUDE.md to document new structure policy
2. Create migration tracking document
3. Set up NX dependency constraints for new structure

### Phase 2: Stacks Migration
1. Move `stacks/codex` to `apps/codex`
2. Move `stacks/dev-cluster` to `apps/dev-cluster`
3. Move `stacks/enigma-cluster` to `apps/enigma-cluster`
4. Move `stacks/enigma-cozy` to `apps/enigma-cozy`
5. Move `stacks/provisioner` to `apps/provisioner`
6. Move `stacks/root-cluster-prod` to `apps/root-cluster-prod`
7. Delete empty `stacks/` directory

### Phase 3: Services Migration
1. Move `services/kubevirt-config` to `apps/kubevirt-config`
2. Move `services/myvm` to `apps/myvm`
3. Move `services/testing` to `apps/testing`
4. Move `services/tinkerbell` to `apps/tinkerbell`
5. Move `services/windmill` to `apps/windmill`
6. Move `services/windmill-ingress` to `apps/windmill-ingress`
7. Delete empty `services/` directory

### Phase 4: Tools Cleanup and Migration

#### 4a. Delete obsolete Bazel-only wrappers
1. Delete `tools/black/` (use trunk/hermit)
2. Delete `tools/pulumi/` (use hermit)
3. Delete `tools/teleport/` (use hermit)
4. Delete `tools/tilt/` (use hermit)
5. Delete `tools/bazel/` (inline script if needed)
6. Delete `tools/homebrew/` (please/plz obsolete)
7. Delete `tools/pytest/` (use standard py_test)

#### 4b. Delete obsolete hypervisor tools (all commented out)
1. Delete `tools/packer/`
2. Delete `tools/vagrant/`
3. Delete `tools/pyinfra/`
4. Clean up commented imports in `apps/hypervisor/BUILD.bazel`

#### 4c. Evaluate and decide
1. `tools/macos/` - Move script to `bin/` or delete if unused
2. `tools/template/` - Delete if please/plz not used

#### 4d. Migrate actively-used tools to libs/
1. Move `tools/python/` to `libs/python/` (merge with third_party/python)
2. Move `tools/docker/` to `libs/docker/`
3. Move `tools/onepassword/` to `libs/onepassword/`
4. Update all Bazel references (e.g., `//tools/python:` → `//libs/python:`)
5. Delete empty `tools/` directory

### Phase 5: Third-Party Migration
1. Move `third_party/hermit` to `libs/hermit`
2. Move `third_party/javascript` to `libs/javascript`
3. Move `third_party/python` to `libs/python` (merge with tools/python if exists)
4. Move `third_party/vendir` to `libs/vendir`
5. Delete empty `third_party/` directory

### Phase 6: Cleanup and Validation
1. Run `nx graph` to validate dependency structure
2. Update CI/CD pipelines if needed
3. Run full test suite to ensure nothing is broken
4. Update any documentation references

## Logical Dependency Chain

1. **CLAUDE.md update** (no dependencies) - Establishes policy first
2. **Stacks migration** (depends on policy) - High visibility, validates approach
3. **Services migration** (can parallel with stacks) - Similar pattern
4. **Tools migration** (after stacks/services) - Lower priority, more items
5. **Third-party migration** (after tools) - Careful handling needed
6. **Cleanup** (after all migrations) - Final validation

## Risks and Mitigations

### Risk 1: Breaking Existing References
- **Mitigation**: Use NX's built-in refactoring or search-and-replace to update all imports and references before moving directories

### Risk 2: Git History Fragmentation
- **Mitigation**: Use `git mv` for all moves to preserve history

### Risk 3: CI/CD Pipeline Failures
- **Mitigation**: Update pipeline configurations in the same PR as migrations

### Risk 4: Name Collisions
- **Mitigation**: `libs/dev-cluster` already exists; rename or merge with `stacks/dev-cluster` carefully

### Risk 5: Large PR Size
- **Mitigation**: Migrate in phases (one PR per phase) to keep changes reviewable

## Appendix

### Current Directory Inventory

**stacks/** (6 items to migrate to apps/):
- codex, dev-cluster, enigma-cluster, enigma-cozy, provisioner, root-cluster-prod

**services/** (6 items to migrate to apps/):
- kubevirt-config, myvm, testing, tinkerbell, windmill, windmill-ingress

**tools/** (17 items - mixed actions):
- **KEEP (migrate to libs/)**: docker, onepassword, python
- **DELETE (Bazel-only wrappers)**: bazel, black, homebrew, pulumi, pytest, teleport, tilt
- **DELETE (obsolete hypervisor)**: packer, pyinfra, vagrant
- **EVALUATE**: macos, template

**third_party/** (4 items to migrate to libs/):
- hermit, javascript, python, vendir

**specs/** (keep as-is):
- Managed by speckit, not part of this migration

### Decision: apps/ vs libs/

| Criteria | apps/ | libs/ |
|----------|-------|-------|
| Deployable independently | Yes | No |
| Has its own CI/CD pipeline | Yes | No |
| Produces artifacts/binaries | Yes | Sometimes |
| Can be imported by other projects | Sometimes | Yes |
| Environment-specific configuration | Yes | No |
| Reusable across multiple apps | No | Yes |
