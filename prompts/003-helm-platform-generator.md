<objective>
Create a Python CLI tool called `helm-platform` that generates and validates `config.yaml` files for ArgoCD ApplicationSet configuration in platform directories. This tool will be used by moon tasks to ensure consistent configuration across all platform applications.
</objective>

<context>
This is a Moon monorepo using Python with uv as the package manager. The tool will be used in platform directories like `apps/secrets-proxy` and `apps/secrets-proxy-infra` to generate ArgoCD configuration files.

Examine these files for patterns and conventions:
- `.moon/tasks/tag-python.yml` - existing Python tag configuration
- `apps/secrets-proxy-infra/vcluster/config.yaml` - example infra config
- `apps/secrets-proxy-infra/tenant/config.yaml` - example tenant config
- `apps/secrets-proxy/onepassword-operator/config.yaml` - example apps config
- `libs/*/moon.yml` - existing lib project structures
- `bin/supervisorctl` - binstub pattern to follow
</context>

<requirements>
## CLI Tool: libs/helm-platform

Create a Python CLI using click with two subcommands: `generate` and `validate`.

### Command: `helm-platform generate`
For every subdirectory in the current folder, create/update a `config.yaml` file.

**Generation rules for config.yaml fields:**

1. **appType** (determines most other values):
   - `"infra"` when parent folder ends with `-infra`
   - `"tenant"` when directory name is `tenant`
   - `"apps"` otherwise

2. **appName**: name of the subdirectory

3. **platform**: name of the parent directory, with `-infra` suffix removed if present

4. **namespace** (user-defined, preserve existing):
   - Initial value for `tenant`: `"tenant-prod"`
   - Initial value for `infra`: `"tenant-prod-"` + platform name without dashes
     - Example: platform `secrets-proxy` → `tenant-prod-secretsproxy`
   - Initial value for `apps`: `"default"`
   - **IMPORTANT**: If config.yaml already exists, preserve the existing namespace value

5. **cluster**:
   - For `infra` or `tenant`: `"enigma"`
   - For `apps`: platform name + `"-vcluster"`
     - Example: platform `secrets-proxy` → `secrets-proxy-vcluster`

6. **createNamespace**:
   - `false` for `infra` or `tenant`
   - `true` for `apps`

7. **prUpdateNamespace**:
   - `false` for `tenant` or `apps`
   - `true` for `infra`

8. **prUpdateCluster**:
   - `false` for `tenant` or `infra`
   - `true` for `apps`

9. **prOverrides** (user-defined, preserve existing):
   - Initial value: empty mapping `{}`
   - **IMPORTANT**: If config.yaml already exists, preserve the existing prOverrides value

**Output format** (use this exact YAML structure with comments for infra/tenant types):
```yaml
# ArgoCD ApplicationSet configuration for <appName>
appType: <type>
appName: <name>
platform: <platform>
namespace: <namespace>

cluster: <cluster>
createNamespace: <bool>
prUpdateNamespace: <bool>
prUpdateCluster: <bool>

prOverrides: {}
```

For `apps` type, omit the header comment. Ensure proper YAML formatting with no trailing whitespace and a trailing newline.

### Command: `helm-platform validate`
Validate that existing config.yaml files match what would be generated.

- For each subdirectory, compare existing config.yaml with generated content
- Exit with code 0 if all files match (no changes would be made)
- Exit with code 1 if any differences found, printing a diff for each mismatch
- Skip directories without config.yaml (they would be created by generate)

## YAML Handling

Use `ruamel.yaml` (https://pypi.org/project/ruamel.yaml/) for reading and writing YAML files. This library preserves:
- Comments
- Whitespace and indentation
- Key ordering

This is critical for maintaining user-added comments and consistent formatting.

## Project Structure

```
libs/helm-platform/
├── moon.yml              # Moon project config with tags: [python]
├── pyproject.toml        # uv project with click, ruamel.yaml dependencies
├── src/
│   └── helm_platform/
│       ├── __init__.py
│       ├── cli.py        # Click CLI entry point
│       └── generator.py  # Core generation logic
└── tests/
    ├── __init__.py
    ├── conftest.py       # pytest fixtures
    └── test_generator.py # Unit tests for generation logic
```

## Dependencies in pyproject.toml

```toml
[project]
dependencies = [
    "click>=8.0.0",
    "ruamel.yaml>=0.18.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
]

[project.scripts]
helm-platform = "helm_platform.cli:main"
```

## Moon Tag: helm-platform

Create `.moon/tasks/tag-helm-platform.yml` with:

```yaml
tasks:
  generate:
    command: helm-platform generate
    inputs:
      - "*/Chart.yaml"
      - "*/kustomization.yaml"
    outputs:
      - "*/config.yaml"
    options:
      runInCI: false

  validate:
    command: helm-platform validate
    inputs:
      - "*/config.yaml"
      - "*/Chart.yaml"
      - "*/kustomization.yaml"
    options:
      cache: true
```

## Binstub

Create `bin/helm-platform` following the pattern from `bin/supervisorctl`:

```bash
#!/bin/bash
# Binstub for helm-platform

set -eo pipefail

LOCAL_SETUP_DIR="$(realpath "$(dirname "$(realpath "$0")")/.." || true)"
EXEC_BIN="${LOCAL_SETUP_DIR}"/bin/exec

exec ${EXEC_BIN} uv run --project "${LOCAL_SETUP_DIR}"/libs/helm-platform helm-platform "$@"
```

## Platform Projects

Add the `helm-platform` tag to these existing projects:
- `apps/secrets-proxy/moon.yml`
- `apps/secrets-proxy-infra/moon.yml`

Create moon.yml if it doesn't exist.

## Test Cases (pytest)

Create comprehensive tests covering:

1. **appType detection**:
   - Parent folder ending with `-infra` → `infra`
   - Directory named `tenant` → `tenant`
   - Other directories → `apps`

2. **platform extraction**:
   - `secrets-proxy-infra` → `secrets-proxy`
   - `secrets-proxy` → `secrets-proxy`

3. **namespace generation**:
   - tenant: `tenant-prod`
   - infra with platform `secrets-proxy`: `tenant-prod-secretsproxy`
   - apps: `default`

4. **cluster generation**:
   - infra/tenant: `enigma`
   - apps with platform `secrets-proxy`: `secrets-proxy-vcluster`

5. **boolean flags** for each appType

6. **preservation of user fields**:
   - Existing namespace should not be overwritten
   - Existing prOverrides should not be overwritten
   - Comments should be preserved

7. **validate command**:
   - Returns 0 when files match
   - Returns 1 when files differ
   - Shows diff output on mismatch
</requirements>

<implementation>
1. Start by examining existing patterns in the codebase for Python libs and moon tags
2. Create the Python package structure with proper pyproject.toml
3. Implement the generator logic using ruamel.yaml for YAML handling
4. Implement the CLI commands using click
5. Create comprehensive pytest tests with fixtures for temp directories
6. Create the moon tag configuration
7. Create the binstub following bin/supervisorctl pattern and make it executable
8. Add the tag to platform project moon.yml files
9. Run the generate command to verify it works on existing directories

**Key considerations:**
- Use ruamel.yaml's RoundTrip mode to preserve comments and formatting
- Preserve user-defined fields (namespace, prOverrides) when updating existing files
- Handle edge cases: missing directories, malformed YAML, empty directories
- Follow existing code patterns in the repository
</implementation>

<output>
Create/modify these files:

- `libs/helm-platform/moon.yml`
- `libs/helm-platform/pyproject.toml`
- `libs/helm-platform/src/helm_platform/__init__.py`
- `libs/helm-platform/src/helm_platform/cli.py`
- `libs/helm-platform/src/helm_platform/generator.py`
- `libs/helm-platform/tests/__init__.py`
- `libs/helm-platform/tests/conftest.py`
- `libs/helm-platform/tests/test_generator.py`
- `.moon/tasks/tag-helm-platform.yml`
- `bin/helm-platform`
- `apps/secrets-proxy/moon.yml` (create or add tag)
- `apps/secrets-proxy-infra/moon.yml` (add tag if not present)
</output>

<verification>
Before declaring complete, verify:

1. Run `uv sync` in libs/helm-platform to install dependencies
2. Run `uv run pytest` in libs/helm-platform to verify tests pass
3. Run `bin/helm-platform --help` to verify CLI works
4. Run `bin/helm-platform generate` in apps/secrets-proxy-infra to test generation
5. Run `bin/helm-platform validate` in apps/secrets-proxy-infra to verify validation
6. Run `moon run apps/secrets-proxy-infra:validate` to verify moon integration
</verification>

<success_criteria>
- CLI tool generates correct config.yaml files matching the documented rules
- ruamel.yaml preserves comments and formatting in existing files
- Existing user-defined fields (namespace, prOverrides) are preserved on regeneration
- validate correctly identifies differences and exits with appropriate codes
- Moon tag works with both platform directories
- All pytest tests pass
- Binstub is executable and works from repository root
</success_criteria>
