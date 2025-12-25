# PRD: Migrate from NX to Moon

## Overview

This document outlines the migration from NX (a JavaScript-based monorepo build orchestrator) to Moon (a Rust-based polyglot build system) for the setup monorepo. The migration addresses several pain points with NX while maintaining the current developer experience and project structure.

### Problems Solved

1. **Configuration verbosity**: NX requires `package.json` for configuration which lacks comments and becomes unwieldy. Moon uses dedicated `moon.yml` files with YAML syntax supporting comments.

2. **Forced JavaScript ecosystem**: NX is a JavaScript package requiring `package.json` for all dependencies, causing issues like bloated Deno lockfiles that include dependencies from unrelated apps/libs across the monorepo.

3. **Secret management overhead**: NX requires `NX_KEY` for S3 cache extension, adding another secret to manage. Moon has built-in remote caching without additional licensing keys.

4. **Job sharding complexity**: Moon provides straightforward job sharding out of the box, simplifying CI parallelization.

5. **MCP server integration**: Moon provides an MCP server for AI-assisted development workflows.

6. **Installation simplicity**: NX requires npm/node and multiple packages. Moon is a single binary installable via hermit.

### Non-Goals

- **Backward compatibility**: Releases managed by NX will be disabled during migration; no need to maintain `nx release` functionality.
- **Toolchain management**: Moon toolchains will not be used since all tools are already managed via hermit in `bin/`.

## Core Features

### 1. Moon Installation via Hermit

Install Moon version 1.41.8 using hermit package management:
- Add moon package to hermit configuration
- Moon binary available at `bin/moon`
- Consistent versioning across all developer machines and CI

### 2. Automated Migration via migrate-nx Extension

Moon provides a built-in `migrate-nx` extension that automates most of the conversion:

```bash
moon ext migrate-nx --cleanup
```

**Automated conversions:**
- `nx.json` `targetDefaults` → global tasks in `.moon/tasks/node.yml`
- `nx.json` `namedInputs` → Moon file groups
- `nx.json` `workspaceLayout` → project discovery patterns
- `project.json` settings → `moon.yml` equivalents
- NX target executors → npm package commands (e.g., `@nx/webpack:build` → `webpack build`)
- Target options → task arguments
- Token replacements (`{projectRoot}`, `{workspaceRoot}`)

**The `--cleanup` flag** removes NX configuration files after successful migration.

**Note:** This extension is experimental. Manual patching will be required for unsupported features.

### 3. Manual Post-Migration Patching

After running the automated migration, manual fixes are needed for:

**Unsupported NX features (ignored during conversion):**
- Most `nx.json` settings beyond targetDefaults/namedInputs/workspaceLayout
- Named input variants (external dependencies, dependent task outputs, runtime commands)
- Target `configurations` and `defaultConfiguration`
- Project `root` and `sourceRoot` settings
- Release configuration (out of scope anyway)
- S3 cache configuration (Moon has different remote caching)

**Required manual work:**
- Remove toolchain configuration (we use hermit)
- Add YAML comments for task documentation
- Verify task dependencies are correctly mapped
- Configure VCS settings in workspace.yml
- Review and adjust cache inputs/outputs

### 4. Task Definition Patterns

Standard task patterns to implement:
- **build**: Compile/bundle tasks with dependency on upstream builds
- **test**: Test tasks with caching enabled
- **lint**: Linting tasks with caching
- **serve**: Development server tasks (non-cacheable)
- **Custom tasks**: Ansible playbooks, infrastructure commands

### 5. Developer Experience Tooling

Update `bin/help` script to:
- Use `moon query projects` instead of NX commands
- Display available tasks per project
- Maintain current interactive UX

## Technical Architecture

### File Structure Changes

```
# Remove
nx.json
package.json (NX dependencies only)
node_modules/ (NX-related packages)
apps/*/project.json
libs/*/project.json

# Add
.moon/
├── workspace.yml          # Workspace configuration
├── toolchain.yml          # Empty/minimal (using hermit)
└── tasks/                 # Shared task configurations (optional)
    └── node.yml           # Common node project tasks
apps/*/moon.yml            # Per-project task definitions
libs/*/moon.yml            # Per-library task definitions
```

### Configuration Mapping

**NX nx.json → Moon .moon/workspace.yml**

```yaml
# .moon/workspace.yml
projects:
  - 'apps/*'
  - 'libs/*'

vcs:
  manager: git
  defaultBranch: main

hasher:
  walkStrategy: vcs

# Remote cache can be configured later
# runner:
#   cacheLifetime: "7 days"
```

**NX project.json → Moon moon.yml**

Example migration for `apps/blueorange`:

```yaml
# apps/blueorange/moon.yml
language: javascript
type: application
tags:
  - scope:app
  - type:webapp

# Optional: Define file groups for input patterns
fileGroups:
  sources:
    - 'src/**/*'
    - 'public/**/*'
    - 'index.html'
  configs:
    - 'vite.config.*'
    - 'package.json'
    - 'tsconfig*.json'

tasks:
  build:
    command: 'vite build'
    inputs:
      - '@group(sources)'
      - '@group(configs)'
    outputs:
      - '../../dist/apps/blueorange'
    deps:
      - '^:build'  # Upstream dependencies
    options:
      cache: true

  serve:
    command: 'vite'
    local: true  # Non-cacheable, interactive

  preview:
    command: 'vite preview'
    local: true

  test:
    command: 'vitest run'
    inputs:
      - '@group(sources)'
      - 'tests/**/*'
      - '@group(configs)'
      - 'vitest.config.*'
    options:
      cache: true

  e2e:
    command: 'playwright test'
    local: true
```

### CI Integration

Moon provides native CI features:
- `moon ci` command for affected task detection
- `--shard` flag for parallel job distribution
- Built-in comparison against base branch

## Development Roadmap

### Phase 1: Foundation Setup

1. **Install Moon via Hermit**
   - Create hermit package for moon@1.41.8
   - Verify binary works: `moon --version`

2. **Create Minimal Workspace Configuration**
   - Create `.moon/workspace.yml` with project patterns (required before running migrate-nx)
   - Create empty `.moon/toolchain.yml` (no toolchains, using hermit)
   - Configure VCS settings (git, defaultBranch: main)

3. **Validate Workspace Recognition**
   - Run `moon query projects` to verify workspace setup
   - Ensure Moon can discover apps/* and libs/* projects

### Phase 2: Automated Migration

4. **Run migrate-nx Extension**
   - Execute `moon ext migrate-nx` (without --cleanup initially)
   - Review generated `.moon/tasks/node.yml` for global task defaults
   - Review generated `moon.yml` files in each project
   - Verify token replacements and executor conversions

5. **Post-Migration Patching**
   - Remove or empty `.moon/toolchain.yml` (hermit manages tools)
   - Add VCS configuration to workspace.yml if not present
   - Review and fix any unsupported feature gaps:
     - Named input variants that were ignored
     - Target configurations that didn't convert
   - Add YAML comments for task documentation

6. **Verify Task Execution**
   - Run `moon run <project>:<task>` for each project with tasks
   - Test key workflows: blueorange build/test, provisioner playbooks
   - Verify task dependencies resolve correctly
   - Test caching behavior (run tasks twice)

7. **Clean Up NX Artifacts**
   - Run `moon ext migrate-nx --cleanup` OR manually remove:
     - Delete `nx.json`
     - Delete all `project.json` files
     - Remove NX dependencies from root `package.json`
   - Clean up `node_modules` (may still be needed for project dependencies)

### Phase 3: Developer Tooling

8. **Update bin/help Script**
   - Replace NX commands with Moon equivalents
   - Use `moon query projects` and `moon query tasks`
   - Maintain interactive selection UX

9. **Update Documentation**
   - Update CLAUDE.md with Moon commands
   - Update any CI configuration references

### Phase 4: CI Integration

10. **Configure CI Pipeline**
    - Replace `nx affected` with `moon ci`
    - Implement job sharding with `--shard` flag if needed
    - Configure remote caching (optional, for later)

11. **Validate Full Pipeline**
    - Run complete CI pipeline on migration branch
    - Verify all projects build/test correctly
    - Compare performance with NX

## Logical Dependency Chain

```
Phase 1: Foundation
├── 1. Install Moon (no dependencies)
├── 2. Create workspace config (depends on 1)
└── 3. Validate workspace (depends on 2)

Phase 2: Automated Migration (depends on Phase 1)
├── 4. Run migrate-nx extension (depends on 3)
├── 5. Post-migration patching (depends on 4)
├── 6. Verify task execution (depends on 5)
└── 7. Clean up NX artifacts (depends on 6, all tasks verified)

Phase 3: Tooling (depends on Phase 2)
├── 8. Update bin/help (depends on 7)
└── 9. Update docs (depends on 8)

Phase 4: CI (depends on Phase 3)
├── 10. Configure CI (depends on 9)
└── 11. Validate pipeline (final step)
```

### Quick Wins for Early Validation

The dependency chain ensures we can validate early:
- After step 3: Moon recognizes workspace structure
- After step 4: All projects have moon.yml files generated automatically
- After step 6: Full project functionality verified before removing NX
- The migrate-nx extension significantly reduces manual work compared to manual migration

## Risks and Mitigations

### Risk 1: Task Behavior Differences

**Risk**: Moon task execution semantics may differ from NX, causing unexpected behavior.

**Mitigation**:
- Migrate incrementally, testing each project thoroughly
- Keep NX configuration during parallel testing phase
- Document any behavioral differences discovered

### Risk 2: Cache Invalidation Differences

**Risk**: Moon's hasher may include/exclude different files, causing cache misses or false hits.

**Mitigation**:
- Explicitly define `inputs` for all cacheable tasks
- Use Moon's `fileGroups` to centralize input definitions
- Test cache behavior by running tasks twice

### Risk 3: migrate-nx Extension Limitations

**Risk**: The migrate-nx extension is experimental and has known limitations. Some NX features are explicitly unsupported and will be ignored during conversion.

**Mitigation**:
- Run extension without `--cleanup` first to review output
- Document which features were not converted
- Plan manual patching for:
  - Named input variants (external deps, dependent task outputs, runtime commands)
  - Target configurations and defaultConfiguration
  - Project root/sourceRoot settings
- Features explicitly out of scope (acceptable losses):
  - `release`: Will be removed anyway
  - S3 cache config: Moon has different remote caching
  - `metadata.description`: Use YAML comments instead

### Risk 4: Hermit Package Availability

**Risk**: Moon 1.41.8 may not be available as a hermit package.

**Mitigation**:
- Verify hermit package availability before starting
- If needed, create custom hermit package definition
- Fallback: Install Moon via alternative method temporarily

### Risk 5: Developer Learning Curve

**Risk**: Team needs to learn new CLI commands and configuration format.

**Mitigation**:
- Update `bin/help` early to provide discoverability
- Commands are similar: `moon run` vs `nx run`
- YAML configuration is more readable than JSON

## Appendix

### NX to Moon Command Mapping

| NX Command | Moon Equivalent |
|------------|-----------------|
| `nx run <project>:<target>` | `moon run <project>:<task>` |
| `nx affected --target=<target>` | `moon ci` or `moon run :task --affected` |
| `nx show projects` | `moon query projects` |
| `nx graph` | `moon project-graph` |
| `nx reset` | `moon clean` |
| (migration) | `moon ext migrate-nx --cleanup` |

### Projects to Migrate

**Applications (apps/)**:
- blueorange - Vite webapp with build/test/serve/e2e
- codex - CI setup with shell scripts
- escaperoom - TBD (check configuration)
- kubevirt-config - Kubernetes configuration
- myvm - VM configuration
- provisioner - Ansible playbooks (complex)
- testing - Empty/placeholder
- tinkerbell - Infrastructure provisioning
- windmill - Workflow automation
- windmill-ingress - Ingress configuration

**Libraries (libs/)**:
- docker - Tool library
- onepassword - Secret management
- python - Python utilities

### Moon Configuration Reference

Key Moon concepts:
- **Workspace**: Root configuration in `.moon/`
- **Project**: Individual app or lib with `moon.yml`
- **Task**: Executable command within a project
- **Target**: Reference to a task: `<project>:<task>`
- **Deps**: Task dependencies, `^:task` for upstream deps

### Resources

- [Moon Documentation](https://moonrepo.dev/docs)
- [Moon Extensions Guide](https://moonrepo.dev/docs/guides/extensions) - includes migrate-nx extension
- [Moon MCP Server](https://moonrepo.dev/docs/guides/mcp)
- [Moon Migration Guide](https://moonrepo.dev/docs/guides/migration)
- [Hermit Package Management](https://cashapp.github.io/hermit/)
