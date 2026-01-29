<objective>
Create a Python library called "coder-logstream-process" in the libs/ directory that executes arbitrary commands and streams their stdout/stderr to the Coder logstream API in real-time.

This library solves the problem of capturing build/setup output from devcontainer processes and making it visible in the Coder dashboard, similar to what envbuilder and coder-logstream-kube do for container builds.
</objective>

<context>
This is a Moon monorepo using uv for Python package management. The library will be used inside Coder workspaces to wrap command execution (like `devcontainer up`) and ship the output logs to the Coder Agent API.

Reference implementation patterns from:
- @libs/fleet-mcp/pyproject.toml - Python project structure with uv, hatchling, and dev dependencies
- @libs/fleet-mcp/moon.yml - Moon task definitions for Python projects
- @libs/fleet-mcp/tests/conftest.py - Test fixtures and configuration patterns

Coder Agent API details (from coder/coder repository):
- **ExternalLogSourceID**: `uuid.UUID("3b579bf4-1ed8-4b99-87a8-e9a1e3410410")` - The statically-defined log source ID that appears as "External" in the Coder dashboard
- **PATCH endpoint**: `/api/v2/workspaceagents/me/logs` - For sending log messages (limited to 1MB per request)
- **POST log source**: `/api/v2/workspaceagents/me/log-source` - For creating custom log sources
- **Authentication**: Uses `CODER_AGENT_TOKEN` in the `Coder-Session-Token` header

The default log source name should match envbuilder's behavior (which uses the ExternalLogSourceID).
</context>

<requirements>
## Core Functionality

1. **CLI Entry Point**: `coder-logstream-process [OPTIONS] "<command>"`
   - Execute the provided command string via shell
   - Stream stdout and stderr to Coder logstream API in real-time
   - Exit with the same exit code as the wrapped command
   - Pass through environment variables to the child process

2. **Configuration Options** (all options can be set via CLI argument OR environment variable):

   | CLI Argument | Environment Variable | Required | Default | Description |
   |--------------|---------------------|----------|---------|-------------|
   | `--agent-url` | `CODER_AGENT_URL` | No* | - | Base URL of the Coder agent API (e.g., `http://localhost:4`) |
   | `--agent-token` | `CODER_AGENT_TOKEN` | No* | - | Agent authentication token |
   | `--source-name` | `CODER_LOGSTREAM_SOURCE_NAME` | No | `"External"` | Custom log source display name (matches envbuilder default) |
   | `--buffer-interval` | `CODER_LOGSTREAM_BUFFER_INTERVAL` | No | `1.0` | Seconds to buffer logs before sending to API |
   | `--log-level` | `CODER_LOGSTREAM_LOG_LEVEL` | No | `"WARN"` | Logging verbosity: DEBUG, INFO, WARN, ERROR |

   *\*If `--agent-url` or `--agent-token` are not set, the command still runs but logs are not shipped to Coder (a warning is printed).*

   **Log Levels**:
   | Level | Behavior |
   |-------|----------|
   | `DEBUG` | Show HTTP requests/responses to Coder API (method, URL, status code, timing) |
   | `INFO` | Show log payloads being sent (truncated to first 200 chars per batch) |
   | `WARN` | Show warnings when CODER_AGENT_URL/TOKEN not set, or API unreachable (default) |
   | `ERROR` | Only show errors that prevent log shipping |

   **Precedence**: CLI arguments take precedence over environment variables.

   **Usage Examples**:
   ```bash
   # Using environment variables (typical in Coder workspaces)
   export CODER_AGENT_URL="http://localhost:4"
   export CODER_AGENT_TOKEN="secret-token"
   coder-logstream-process "devcontainer up --workspace-folder ."

   # Using CLI arguments
   coder-logstream-process --agent-url http://localhost:4 --agent-token secret "echo hello"

   # Custom buffer interval (send logs every 500ms)
   coder-logstream-process --buffer-interval 0.5 "npm install"

   # Debug mode to see HTTP requests to Coder API
   coder-logstream-process --log-level DEBUG "npm install"

   # Run without Coder credentials (command runs, logs not shipped)
   coder-logstream-process "echo hello"  # Prints warning, still executes command

   # Mixed: env vars for secrets, CLI for tuning
   export CODER_AGENT_URL="http://localhost:4"
   export CODER_AGENT_TOKEN="secret-token"
   coder-logstream-process --buffer-interval 2.0 --source-name "Build" --log-level INFO "make build"
   ```

3. **Log Streaming**:
   - Buffer logs and send to Coder API at the configured interval (default: every 1 second)
   - Only send if there are buffered logs (don't send empty batches)
   - Send logs in batches to avoid API rate limits (1MB max per request)
   - Include timestamps with each log entry
   - Distinguish between stdout and stderr in log output (use level field: "info" for stdout, "error" for stderr)
   - Handle connection errors gracefully - continue command execution even if log shipping fails
   - Flush any remaining buffered logs when the command completes

4. **API Integration**:
   - Use the PATCH `/api/v2/workspaceagents/me/logs` endpoint
   - Send logs with the ExternalLogSourceID (`3b579bf4-1ed8-4b99-87a8-e9a1e3410410`)
   - Include proper authentication headers (`Coder-Session-Token`)
   - Implement retry logic with exponential backoff for transient failures

## Project Structure

```
libs/coder-logstream-process/
├── moon.yml                    # Moon task definitions
├── pyproject.toml              # Project metadata and dependencies
├── uv.lock                     # Lockfile (generated by uv)
├── src/
│   └── coder_logstream_process/
│       ├── __init__.py
│       ├── __main__.py         # CLI entry point
│       ├── cli.py              # Argument parsing
│       ├── runner.py           # Command execution and output capture
│       ├── client.py           # Coder API client for log streaming
│       └── models.py           # Pydantic models for API requests
├── tests/
│   ├── conftest.py             # Pytest fixtures
│   ├── cassettes/              # VCR cassettes for API mocking
│   ├── test_cli.py             # CLI argument tests
│   ├── test_runner.py          # Command execution tests
│   └── test_client.py          # API client tests (using VCR)
└── dist/                       # Built pex file output (gitignored)
```

## Dependencies

Production:
- `httpx` - Async HTTP client for API calls
- `pydantic` - Data validation for API models
- `click` - CLI framework

Development:
- `pytest` - Test framework
- `pytest-asyncio` - Async test support
- `vcrpy` - Record and replay HTTP interactions
- `pytest-cov` - Coverage reporting

Build:
- `pex` - Installed via Hermit (NOT a Python dependency)

## Hermit Manifest for pex

Create a custom Hermit manifest at `third_party/hermit/pex.hcl`:

```hcl
description = "A tool for generating .pex (Python EXecutable) files"
homepage = "https://pex.readthedocs.io/"
binaries = ["pex"]
source = "https://github.com/pex-tool/pex/releases/download/v${version}/pex"
dont-extract = true

version "2.86.1" {
  auto-version {
    github-release = "pex-tool/pex"
  }
}

on "unpack" {
  chmod {
    file = "${root}/pex"
    mode = 493
  }
}
```

Then activate it with `hermit install pex@2.86.1` in the repository root.
</requirements>

<implementation>
## Moon Configuration (moon.yml)

```yaml
language: python
layer: library
tags:
  - python
  - coder
  - logging
tasks:
  test:
    command: uv run pytest tests/ -v
    inputs:
      - "@files(python_sources)"
      - "@files(python_configs)"
      - "tests/cassettes/**/*"
    options:
      cache: true

  build:
    command: pex . -o dist/coder-logstream-process.pex -c coder-logstream-process --venv
    inputs:
      - "@files(python_sources)"
      - "@files(python_configs)"
    outputs:
      - dist/coder-logstream-process.pex
    deps:
      - ~:test
```

Note: The `pex` binary is installed via Hermit, not as a Python dependency.

## API Request Format

The PATCH `/api/v2/workspaceagents/me/logs` endpoint expects:

```json
{
  "logs": [
    {
      "created_at": "2024-01-15T10:30:00Z",
      "output": "Building container...\n",
      "level": "info",
      "source_id": "3b579bf4-1ed8-4b99-87a8-e9a1e3410410"
    }
  ]
}
```

## Key Implementation Details

1. **Async streaming**: Use `asyncio.subprocess` to capture stdout/stderr with non-blocking reads
2. **Time-based buffering**:
   - Use an `asyncio.Queue` to collect log entries from stdout/stderr readers
   - Run a separate coroutine that flushes the queue to the API at the configured interval
   - Use `asyncio.wait_for` with timeout to implement the flush interval
   - Example pattern:
     ```python
     async def flush_loop(queue: asyncio.Queue, client: CoderClient, interval: float):
         buffer = []
         while True:
             try:
                 # Wait for item or timeout
                 item = await asyncio.wait_for(queue.get(), timeout=interval)
                 buffer.append(item)
             except asyncio.TimeoutError:
                 # Interval elapsed, flush if we have logs
                 if buffer:
                     await client.send_logs(buffer)
                     buffer = []
     ```
3. **CLI with Click**: Use `click.option` with `envvar` parameter for dual env/CLI support:
   ```python
   import logging

   @click.command()
   @click.option('--agent-url', envvar='CODER_AGENT_URL', default=None,
                 help='Coder agent API URL (optional - command runs without log shipping if not set)')
   @click.option('--agent-token', envvar='CODER_AGENT_TOKEN', default=None,
                 help='Coder agent token (optional - command runs without log shipping if not set)')
   @click.option('--source-name', envvar='CODER_LOGSTREAM_SOURCE_NAME', default='3b579bf4-1ed8-4b99-87a8-e9a1e3410410')
   @click.option('--buffer-interval', envvar='CODER_LOGSTREAM_BUFFER_INTERVAL', default=1.0, type=float)
   @click.option('--log-level', envvar='CODER_LOGSTREAM_LOG_LEVEL', default='WARN',
                 type=click.Choice(['DEBUG', 'INFO', 'WARN', 'ERROR'], case_sensitive=False))
   @click.argument('command')
   def main(agent_url, agent_token, source_name, buffer_interval, log_level, command):
       # Configure logging based on level
       numeric_level = getattr(logging, log_level.upper(), logging.WARN)
       logging.basicConfig(level=numeric_level, format='[coder-logstream] %(levelname)s: %(message)s')

       # Warn if credentials not set
       if not agent_url or not agent_token:
           logging.warning("CODER_AGENT_URL or CODER_AGENT_TOKEN not set - logs will not be shipped to Coder")
       ...
   ```
4. **Graceful degradation**: If API calls fail, log the error to stderr but don't stop the subprocess
5. **Exit code preservation**: The CLI must exit with the same code as the wrapped command
6. **Final flush**: When the subprocess completes, flush any remaining buffered logs before exiting

## Testing with VCR

Configure VCR to record against the live Coder instance at `coder.enigma.vgijssel.nl`:

```python
# conftest.py
import vcr

@pytest.fixture
def vcr_config():
    return {
        "cassette_library_dir": "tests/cassettes",
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "filter_headers": ["Coder-Session-Token"],
        "decode_compressed_response": True,
    }
```

Create tests that exercise:
1. Successful log streaming to the API
2. Handling of API errors (401, 500, etc.)
3. Large output batching
4. Connection timeout handling
5. Buffer interval behavior (logs sent after interval elapses)

## Integration Test for Built PEX

Add a test that validates the built pex file works end-to-end:

```python
# tests/test_pex_integration.py
import subprocess
import os
import pytest

@pytest.mark.integration
def test_pex_executes_command_and_returns_exit_code():
    """Test that the built pex file can execute commands and preserve exit codes."""
    pex_path = os.path.join(os.path.dirname(__file__), "..", "dist", "coder-logstream-process.pex")

    if not os.path.exists(pex_path):
        pytest.skip("PEX file not built yet - run 'moon run coder-logstream-process:build' first")

    # Test successful command (exit code 0)
    result = subprocess.run(
        [pex_path, "--help"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0
    assert "--agent-url" in result.stdout
    assert "--buffer-interval" in result.stdout
    assert "--log-level" in result.stdout

@pytest.mark.integration
@pytest.mark.vcr
def test_pex_streams_logs_to_coder_api(vcr_cassette):
    """Test that the pex file streams command output to Coder API."""
    pex_path = os.path.join(os.path.dirname(__file__), "..", "dist", "coder-logstream-process.pex")

    if not os.path.exists(pex_path):
        pytest.skip("PEX file not built yet")

    result = subprocess.run(
        [
            pex_path,
            "--agent-url", os.environ.get("CODER_AGENT_URL", "https://coder.enigma.vgijssel.nl"),
            "--agent-token", os.environ.get("CODER_AGENT_TOKEN", "test-token"),
            "--buffer-interval", "0.1",
            "echo 'Hello from pex test'"
        ],
        capture_output=True,
        text=True,
        timeout=30,
    )
    assert result.returncode == 0
    assert "Hello from pex test" in result.stdout

@pytest.mark.integration
def test_pex_preserves_nonzero_exit_code():
    """Test that the pex preserves non-zero exit codes from wrapped commands."""
    pex_path = os.path.join(os.path.dirname(__file__), "..", "dist", "coder-logstream-process.pex")

    if not os.path.exists(pex_path):
        pytest.skip("PEX file not built yet")

    # Provide dummy values to bypass required args (command will fail anyway)
    result = subprocess.run(
        [
            pex_path,
            "--agent-url", "http://localhost:4",
            "--agent-token", "dummy",
            "exit 42"
        ],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 42
```

Update moon.yml to include an integration test task:

```yaml
  test-integration:
    command: uv run pytest tests/ -v -m integration
    deps:
      - ~:build
    inputs:
      - "@files(python_sources)"
      - "dist/coder-logstream-process.pex"
    options:
      cache: true
```
</implementation>

<output>
Create the following files with relative paths from repository root:

1. `./third_party/hermit/pex.hcl` - Hermit manifest for pex
2. `./libs/coder-logstream-process/moon.yml` - Moon task definitions
3. `./libs/coder-logstream-process/pyproject.toml` - Project configuration with pinned dependencies
4. `./libs/coder-logstream-process/src/coder_logstream_process/__init__.py` - Package init
5. `./libs/coder-logstream-process/src/coder_logstream_process/__main__.py` - Entry point
6. `./libs/coder-logstream-process/src/coder_logstream_process/cli.py` - CLI argument parsing
7. `./libs/coder-logstream-process/src/coder_logstream_process/runner.py` - Command execution
8. `./libs/coder-logstream-process/src/coder_logstream_process/client.py` - Coder API client
9. `./libs/coder-logstream-process/src/coder_logstream_process/models.py` - Pydantic models
10. `./libs/coder-logstream-process/tests/conftest.py` - Test configuration and VCR setup
11. `./libs/coder-logstream-process/tests/test_cli.py` - CLI tests
12. `./libs/coder-logstream-process/tests/test_runner.py` - Runner tests
13. `./libs/coder-logstream-process/tests/test_client.py` - API client tests with VCR
14. `./libs/coder-logstream-process/tests/test_pex_integration.py` - Integration tests for built pex
15. `./libs/coder-logstream-process/.gitignore` - Ignore dist/, .venv/, cassettes with secrets

After creating the files:
1. Run `hermit install pex@2.86.1` to install pex via Hermit
2. Run `cd libs/coder-logstream-process && uv sync` to install dependencies and create lockfile
3. Run `moon run coder-logstream-process:test` to verify unit tests pass
4. Run `moon run coder-logstream-process:build` to create the pex file
5. Run `moon run coder-logstream-process:test-integration` to verify pex integration tests pass
</output>

<verification>
Before declaring complete, verify:

1. **Hermit manifest created**: `third_party/hermit/pex.hcl` exists and is valid
2. **Pex installed via Hermit**: `which pex` points to hermit-managed binary, `pex --version` shows 2.86.1
3. **Dependencies are pinned**: All versions in pyproject.toml must be exact (e.g., `httpx==0.28.1`)
4. **Unit tests pass**: `moon run coder-logstream-process:test` exits successfully
5. **Build succeeds**: `moon run coder-logstream-process:build` creates dist/coder-logstream-process.pex
6. **CLI works**: The pex file can be executed and shows help with `./dist/coder-logstream-process.pex --help`
7. **Integration tests pass**: `moon run coder-logstream-process:test-integration` exits successfully
8. **Exit code preservation**: Running `./dist/coder-logstream-process.pex --agent-url http://x --agent-token x "exit 42"` returns exit code 42
9. **VCR cassettes exist**: Tests create cassettes when run against live API (record mode)
</verification>

<success_criteria>
- Custom Hermit manifest for pex created at `third_party/hermit/pex.hcl`
- Pex installed via Hermit, not as a Python dependency
- Library follows Moon monorepo conventions (moon.yml, pyproject.toml structure)
- All configuration options work via both CLI arguments and environment variables
- CLI arguments take precedence over environment variables when both are set
- Buffer interval is configurable (default 1 second) and logs are batched accordingly
- Log level controls verbosity (DEBUG shows HTTP requests, INFO shows payloads, WARN shows missing config)
- Command executes successfully even without Coder credentials (graceful degradation with warning)
- Logs are streamed to Coder API with proper authentication when credentials are provided
- Tests use VCR for reproducible API testing
- Build produces working pex executable in dist/ using Hermit-installed pex
- Integration tests validate the built pex file works correctly
- Exit code of wrapped command is preserved
</success_criteria>
