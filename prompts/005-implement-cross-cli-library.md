<objective>
Create a new library `libs/cross` that provides a CLI tool for cross-platform builds within the Moon monorepo. The tool enables building projects for different OS/architecture combinations using Docker when the target platform differs from the host.
</objective>

<context>
This library will be used by Moon tasks to build artifacts for multiple platforms (e.g., linux/amd64, linux/arm64) from any host machine. The primary use case is building Python PEX executables for different architectures.

The tool must integrate with Moon's docker scaffolding workflow and leverage moon's build caching. It will be invoked from moon.yml task definitions like:

```yaml
build_linux_amd64:
  command: cross --platform linux/amd64 pex . -o dist/linux_amd64/coder-logstream-process.pex -c coder-logstream-process --venv --interpreter-constraint 'CPython>=3.10,<3.13'
```

Reference the existing library structure in `libs/coder-logstream-process/` for Python project conventions used in this monorepo.
</context>

<requirements>
## CLI Interface

All three named arguments are **mandatory** but can be provided via CLI arguments OR environment variables. CLI arguments take precedence over environment variables.

| Argument | Environment Variable | Description |
|----------|---------------------|-------------|
| `--platform` | `CROSS_PLATFORM` | Target platform (e.g., `linux/amd64`, `linux/arm64`) |
| `--moon-project-id` | `MOON_PROJECT_ID` | Moon project identifier |
| `--moon-task-id` | `MOON_TASK_ID` | Moon task identifier |

**Positional arguments**: Everything after the named arguments is the command to execute.

**Template variables**: The command can contain `{{ os }}` and `{{ arch }}` placeholders that get substituted with the target platform values.

Example invocations:
```bash
# All arguments via CLI
cross --platform linux/amd64 --moon-project-id coder-logstream-process --moon-task-id build_linux_amd64 \
  pex . -o dist/{{ os }}_{{ arch }}/output.pex -c myapp

# Arguments via environment variables (typical when run inside Moon task)
MOON_PROJECT_ID=coder-logstream-process MOON_TASK_ID=build_linux_amd64 \
  cross --platform linux/amd64 pex . -o dist/{{ os }}_{{ arch }}/output.pex -c myapp

# Mixed: platform via CLI, project/task from Moon environment
cross --platform linux/amd64 pex . -o dist/{{ os }}_{{ arch }}/output.pex -c myapp
```

Use Click's `envvar` parameter to implement environment variable fallback:
```python
@click.option('--platform', envvar='CROSS_PLATFORM', required=True, help='Target platform (os/arch)')
@click.option('--moon-project-id', envvar='MOON_PROJECT_ID', required=True, help='Moon project ID')
@click.option('--moon-task-id', envvar='MOON_TASK_ID', required=True, help='Moon task ID')
```

## Environment Detection

1. **Moon repo check**: Exit with code 1 if not invoked from within a Moon repository (check for `.moon/` directory in current or parent directories)
2. **Infinite loop prevention**: Check for `CROSS_MOON=true` environment variable. If set AND the current host platform differs from target, exit with code 1 and error message: "Cannot run cross within cross - nested cross-compilation detected"

## Platform Matching Logic

1. Detect current host OS and architecture
2. Parse target platform from `--platform` argument (format: `os/arch`)
3. **If platforms match**: Execute the command directly on the host (with template variables substituted)
4. **If platforms differ**: Build and run in Docker container for target platform

## Docker Build Workflow (when platforms differ)

1. Generate a Dockerfile with multi-stage build:

```dockerfile
#### BASE STAGE
#### Installs moon and system dependencies.

FROM ubuntu:22.04 AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*

# Install moon binary
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
ENV PATH="/root/.moon/bin:$PATH"

# Set cross-compilation marker to prevent infinite loops
ENV CROSS_MOON=true

#### SKELETON STAGE
#### Scaffolds repository skeleton structures.

FROM base AS skeleton

ARG CROSS_MOON_PROJECT_ID

# Copy entire repository and scaffold
COPY . .
RUN moon docker scaffold $CROSS_MOON_PROJECT_ID

#### BUILD STAGE
#### Builds the project.

FROM base AS build

ARG CROSS_MOON_PROJECT_ID
ARG CROSS_MOON_TASK_ID

# Copy workspace configs
COPY --from=skeleton /app/.moon/docker/workspace .

# Install dependencies
RUN moon docker setup

# Copy project sources
COPY --from=skeleton /app/.moon/docker/sources .

# Build the project
RUN moon run $CROSS_MOON_PROJECT_ID:$CROSS_MOON_TASK_ID
```

2. Run `docker buildx build` with:
   - `--platform` set to target platform (e.g., `linux/amd64`)
   - Build args: `CROSS_MOON_PROJECT_ID`, `CROSS_MOON_TASK_ID`
   - Context: Moon workspace root directory

3. After successful build, extract output files:
   - Query moon for task output files: `moon task <project>:<task> --json` and parse `outputFiles`
   - Copy files from the final Docker image to the host at the same relative paths

## Output File Extraction

1. Get output files from moon task metadata:
   ```bash
   moon task <project_id>:<task_id> --json | jq -r '.outputFiles | keys[]'
   ```
2. Create a temporary container from the build image
3. Use `docker cp` to copy each output file from container to host
4. Preserve relative path structure (e.g., `dist/linux_amd64/output.pex`)
</requirements>

<implementation>
## Project Structure

Create `libs/cross/` with:
```
libs/cross/
├── moon.yml
├── pyproject.toml
├── src/
│   └── cross/
│       ├── __init__.py
│       ├── __main__.py      # CLI entry point
│       ├── cli.py           # Click-based CLI
│       ├── platform.py      # Platform detection and matching
│       ├── docker.py        # Docker build and extraction logic
│       ├── moon.py          # Moon integration (repo detection, task metadata)
│       └── templates.py     # Jinja2 template variable substitution
└── tests/
    ├── __init__.py
    ├── conftest.py          # Shared pytest fixtures
    ├── test_cli.py          # CLI tests using CliRunner
    ├── test_platform.py
    ├── test_templates.py
    ├── test_docker.py
    └── test_moon.py
```

## Technology Choices

- Use **Click** for CLI argument parsing (consistent with other Python CLIs in this repo)
- Use **Jinja2** for template variable interpolation (`{{ os }}`, `{{ arch }}`)
- Use **pytest** for testing with **Click's CliRunner** for CLI integration tests
- Use **subprocess** for running docker and moon commands
- Use standard library for platform detection (`platform` module, `os.uname()`)
- Pin all dependencies to exact versions

## Testing Strategy

Use pytest with Click's built-in `CliRunner` for testing the CLI. Test both CLI arguments and environment variable fallbacks:

```python
from click.testing import CliRunner
from cross.cli import cli

def test_cli_help():
    runner = CliRunner()
    result = runner.invoke(cli, ['--help'])
    assert result.exit_code == 0
    assert '--platform' in result.output
    assert '--moon-project-id' in result.output
    assert '--moon-task-id' in result.output

def test_cli_missing_required_args():
    runner = CliRunner()
    result = runner.invoke(cli, ['echo', 'hello'])
    assert result.exit_code != 0
    assert 'Missing option' in result.output

def test_cli_args_via_cli():
    runner = CliRunner()
    with runner.isolated_filesystem():
        os.makedirs('.moon')
        result = runner.invoke(cli, [
            '--platform', 'linux/amd64',
            '--moon-project-id', 'myproject',
            '--moon-task-id', 'build',
            'echo', '{{ os }}_{{ arch }}'
        ])
        assert result.exit_code == 0

def test_cli_args_via_env_vars():
    runner = CliRunner(env={
        'CROSS_PLATFORM': 'linux/amd64',
        'MOON_PROJECT_ID': 'myproject',
        'MOON_TASK_ID': 'build'
    })
    with runner.isolated_filesystem():
        os.makedirs('.moon')
        result = runner.invoke(cli, ['echo', '{{ os }}_{{ arch }}'])
        assert result.exit_code == 0

def test_cli_args_override_env_vars():
    """CLI arguments should take precedence over environment variables."""
    runner = CliRunner(env={
        'CROSS_PLATFORM': 'linux/arm64',
        'MOON_PROJECT_ID': 'env-project',
        'MOON_TASK_ID': 'env-task'
    })
    with runner.isolated_filesystem():
        os.makedirs('.moon')
        result = runner.invoke(cli, [
            '--platform', 'linux/amd64',  # Override env var
            'echo', '{{ os }}_{{ arch }}'
        ])
        # Should use linux/amd64, not linux/arm64
```

Test files should include:
- **test_cli.py**: CLI argument parsing, env var fallback, precedence rules, help output, error cases using CliRunner
- **test_platform.py**: Platform detection and matching logic (unit tests)
- **test_templates.py**: Jinja2 template variable substitution (unit tests)
- **test_moon.py**: Moon repo detection, task metadata parsing (unit tests with mocked filesystem)
- **test_docker.py**: Dockerfile generation (unit tests, no actual Docker calls)
- **conftest.py**: Shared pytest fixtures (mock Moon repo, mock environment variables)

## Jinja2 Template Implementation

Use Jinja2 to interpolate `{{ os }}` and `{{ arch }}` variables in command arguments:

```python
# templates.py
from jinja2 import Template

def render_command(command_parts: list[str], os: str, arch: str) -> list[str]:
    """Render Jinja2 template variables in command arguments.

    Args:
        command_parts: List of command arguments (e.g., ['pex', '.', '-o', 'dist/{{ os }}_{{ arch }}/out.pex'])
        os: Target operating system (e.g., 'linux')
        arch: Target architecture (e.g., 'amd64')

    Returns:
        List of command arguments with variables substituted.
    """
    context = {'os': os, 'arch': arch}
    return [Template(part).render(context) for part in command_parts]
```

Example transformations:
- `dist/{{ os }}_{{ arch }}/output.pex` → `dist/linux_amd64/output.pex`
- `build-{{ arch }}.sh` → `build-amd64.sh`
- `echo "Building for {{ os }}"` → `echo "Building for linux"`

Test cases for `test_templates.py`:
```python
from cross.templates import render_command

def test_render_single_variable():
    result = render_command(['echo', '{{ os }}'], os='linux', arch='amd64')
    assert result == ['echo', 'linux']

def test_render_multiple_variables():
    result = render_command(['path/{{ os }}_{{ arch }}/file'], os='linux', arch='arm64')
    assert result == ['path/linux_arm64/file']

def test_render_no_variables():
    result = render_command(['echo', 'hello'], os='linux', arch='amd64')
    assert result == ['echo', 'hello']

def test_render_mixed_args():
    result = render_command(['cmd', '--os={{ os }}', 'literal', '{{ arch }}'], os='darwin', arch='arm64')
    assert result == ['cmd', '--os=darwin', 'literal', 'arm64']
```

## Key Implementation Notes

1. Use Jinja2 for template substitution - this must happen BEFORE command execution (both native and Docker paths)
2. The Docker build must happen from the Moon workspace root, not from the project directory
3. Use `docker buildx` for multi-platform builds (not regular `docker build`)
4. All three arguments (`--platform`, `--moon-project-id`, `--moon-task-id`) are mandatory - they must be provided via CLI or environment variables
5. CLI arguments always take precedence over environment variables when both are provided
6. Use Click's `envvar` parameter for automatic environment variable fallback - Click handles the precedence automatically

## Error Handling

- Clear error messages with actionable guidance
- Exit code 1 for all errors
- Specific error for nested cross-compilation attempts
- Specific error for missing Moon repository
- Specific error for Docker build failures (include docker output)
</implementation>

<constraints>
- Do NOT use `npx` or `uvx` - install dependencies explicitly with pinned versions
- Do NOT use floating version ranges - pin all dependencies to exact versions
- Follow the existing Python project conventions from `libs/coder-logstream-process/`
- Use hatchling as the build backend (consistent with other projects)
- Use **uv** for dependency management - run `uv sync` to generate `uv.lock` after creating pyproject.toml
- The CLI must be installable and runnable via `uv run cross` during development
- Tests must be runnable via `uv run pytest tests/ -v`
</constraints>

<output>
Create the following files with relative paths from workspace root:

- `libs/cross/moon.yml` - Moon project configuration
- `libs/cross/pyproject.toml` - Python project configuration with pinned dependencies
- `libs/cross/src/cross/__init__.py` - Package init
- `libs/cross/src/cross/__main__.py` - CLI entry point
- `libs/cross/src/cross/cli.py` - Main CLI implementation
- `libs/cross/src/cross/platform.py` - Platform detection
- `libs/cross/src/cross/docker.py` - Docker build logic
- `libs/cross/src/cross/moon.py` - Moon integration
- `libs/cross/src/cross/templates.py` - Template variable substitution
- `libs/cross/tests/__init__.py` - Test package init
- `libs/cross/tests/conftest.py` - Shared pytest fixtures (mock Moon repo, env vars)
- `libs/cross/tests/test_cli.py` - CLI tests using Click's CliRunner
- `libs/cross/tests/test_platform.py` - Platform detection tests
- `libs/cross/tests/test_templates.py` - Template substitution tests
- `libs/cross/tests/test_moon.py` - Moon integration tests
- `libs/cross/tests/test_docker.py` - Dockerfile generation tests
</output>

<verification>
After implementation, verify:

1. Generate lockfile: `cd libs/cross && uv sync` (creates uv.lock)
2. Run pytest directly: `cd libs/cross && uv run pytest tests/ -v`
3. Run via Moon: `moon run cross:test`
4. Test CLI help: `cd libs/cross && uv run cross --help` (should show all three required options)
5. Test with all CLI args:
   ```bash
   cd libs/cross && uv run cross --platform linux/amd64 --moon-project-id test --moon-task-id build echo "os={{ os }} arch={{ arch }}"
   ```
6. Test with environment variables:
   ```bash
   cd libs/cross && CROSS_PLATFORM=linux/amd64 MOON_PROJECT_ID=test MOON_TASK_ID=build uv run cross echo "os={{ os }} arch={{ arch }}"
   ```
7. Test CLI args override env vars:
   ```bash
   cd libs/cross && CROSS_PLATFORM=linux/arm64 uv run cross --platform linux/amd64 --moon-project-id test --moon-task-id build echo "os={{ os }} arch={{ arch }}"
   # Should output linux_amd64, not linux_arm64
   ```
8. Verify missing args error: `cd libs/cross && uv run cross echo hello` (should fail with missing option error)
9. Verify Moon repo detection: Run from outside Moon repo and confirm error
10. Verify nested cross detection: Set `CROSS_MOON=true` and attempt cross-compilation, confirm error
</verification>

<success_criteria>
1. CLI parses all three required arguments (`--platform`, `--moon-project-id`, `--moon-task-id`) correctly
2. All arguments support both CLI flags and environment variable fallback (`CROSS_PLATFORM`, `MOON_PROJECT_ID`, `MOON_TASK_ID`)
3. CLI arguments take precedence over environment variables when both are provided
4. Jinja2 template variables `{{ os }}` and `{{ arch }}` are substituted in command arguments
5. Same-platform execution runs command directly on host
6. Different-platform execution triggers Docker build with correct multi-stage Dockerfile
7. Output files are correctly extracted from Docker container to host
8. Proper error handling for: missing required args, missing Moon repo, nested cross, Docker failures
9. All unit tests pass (including env var fallback and precedence tests)
10. CLI is installable via pyproject.toml scripts entry
</success_criteria>
