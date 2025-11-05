# Test Fixture Recording

This directory contains scripts for recording and generating test fixtures from a live Coder API instance.

## Overview

The hybrid fixture approach combines:
- **80% Real Data**: Generated from live Coder API responses (high fidelity, easy to refresh)
- **20% Manual**: Hand-written for edge cases, errors, and special states

This approach provides realistic test data while maintaining flexibility for testing error conditions.

## Workflow

```
Live Coder API
     ↓
[record_fixtures.py]  ← Makes real HTTP calls
     ↓
recordings/*.json     ← Sanitized responses (gitignored)
     ↓
[generate_factories.py] ← Transforms JSON to Python
     ↓
tests/fixtures/generated.py  ← Auto-generated functions (committed)
```

## Quick Start

### 1. Set Environment Variables

```bash
export CODER_URL="https://your-coder-instance.com"
export CODER_SESSION_TOKEN="your-api-token"
```

> **Important**: Never commit these values. They should only exist in your local environment.

### 2. Record Fixtures

Record a specific scenario:
```bash
cd libs/fleet-mcp
python scripts/record_fixtures.py --scenario agent_creation
```

Record all scenarios:
```bash
python scripts/record_fixtures.py --all
```

Available scenarios (from `scenarios.yaml`):
- `agent_creation`: Workspace creation flow
- `agent_lifecycle`: Full agent lifecycle (create, start, stop, delete)
- `agent_list`: Workspace and agent listing
- `template_metadata`: Template configuration
- `build_states`: Build state transitions

### 3. Generate Fixture Factories

Transform recorded JSON to Python functions:
```bash
python scripts/generate_factories.py
```

This generates `tests/fixtures/generated.py` with functions like:
```python
from tests.fixtures import generated

# Use in tests
workspace = generated.make_workspace_real()
templates = generated.make_list_templates_real()
```

### 4. Use Fixtures in Tests

```python
import pytest
from tests.fixtures import generated, manual

@pytest.mark.asyncio
async def test_workspace_creation(coder_client, respx_mock):
    # Use real data for happy path
    workspace = generated.make_workspace_real()

    respx_mock.get(
        f"{coder_client.base_url}/api/v2/workspaces/{workspace['id']}"
    ).mock(return_value=httpx.Response(200, json=workspace))

    result = await coder_client.get_workspace(workspace['id'])
    assert result['id'] == workspace['id']

@pytest.mark.asyncio
async def test_workspace_not_found(coder_client, respx_mock):
    # Use manual fixture for error case
    error = manual.make_workspace_error_404()

    respx_mock.get(url__regex=r".*/workspaces/.*").mock(
        return_value=httpx.Response(404, json=error)
    )

    with pytest.raises(Exception):
        await coder_client.get_workspace("nonexistent")
```

## Scripts

### `record_fixtures.py`

Records HTTP responses from a live Coder API.

**Features**:
- Makes real HTTP calls to Coder API
- Automatic secret sanitization (tokens, UUIDs, timestamps, emails, URLs)
- Scenario-based recording with setup/teardown
- Cleanup of created resources

**Usage**:
```bash
python scripts/record_fixtures.py --scenario <name>
python scripts/record_fixtures.py --all
python scripts/record_fixtures.py --scenario agent_creation --no-sanitize  # DEBUGGING ONLY
```

**Output**: `tests/fixtures/recordings/*.json` (gitignored)

### `generate_factories.py`

Generates Python fixture factories from JSON recordings.

**Features**:
- Transforms JSON → Python code
- Type annotations
- Docstrings with metadata
- Clean formatting

**Usage**:
```bash
python scripts/generate_factories.py
python scripts/generate_factories.py --input recordings/ --output tests/fixtures/generated.py
```

**Output**: `tests/fixtures/generated.py` (committed to Git)

### `sanitize.py`

Secret sanitization module used by the recording script.

**What it sanitizes**:
- Coder session tokens → `test-token-placeholder`
- Bearer tokens → `Bearer test-token`
- SSH keys → `ssh-rsa AAAAB3NzaC1yc2ETEST`
- Tailscale domains (`.ts.net`) → `.example.com`
- UUIDs → deterministic `test-uuid-001`, `test-uuid-002`, etc.
- Timestamps → normalized to `2025-01-01T00:00:00Z`
- Email addresses → `test@example.com`
- URLs → `https://coder.example.com/...`

**Verification**: Automatically checks that no secrets remain in sanitized data.

### `scenarios.yaml`

Configuration file defining recording scenarios.

**Structure**:
```yaml
scenario_name:
  description: "Human-readable description"
  setup:  # Optional: runs before recording (not recorded)
    - create_workspace
  record:  # API calls to record
    - list_templates
    - get_workspace
  teardown:  # Optional: cleanup (not recorded)
    - delete_workspace
```

## Secret Safety

### Automatic Sanitization

All recordings are automatically sanitized to remove:
- API tokens and authentication credentials
- Real hostnames and URLs
- UUIDs (replaced with deterministic test IDs)
- Timestamps (normalized to fixed date)
- Email addresses
- SSH keys

### Verification

The sanitizer includes verification checks that raise errors if secrets are detected:
```python
sanitizer.verify_no_secrets(data)  # Raises ValueError if secrets found
```

### Git Protection

**Recordings directory is gitignored**:
```gitignore
# libs/fleet-mcp/tests/fixtures/.gitignore
recordings/
```

**Generated fixtures are committed**:
- `tests/fixtures/generated.py` ✅ (committed - sanitized)
- `tests/fixtures/manual.py` ✅ (committed - hand-written)
- `tests/fixtures/recordings/*.json` ❌ (gitignored - raw)

### Pre-commit Protection

Add to `.pre-commit-config.yaml`:
```yaml
- repo: local
  hooks:
    - id: check-secrets
      name: Check for leaked secrets
      entry: python libs/fleet-mcp/scripts/check_secrets.py
      language: python
      files: ^libs/fleet-mcp/tests/fixtures/.*\.py$
```

## Testing

### Run Sanitization Tests

```bash
cd libs/fleet-mcp
python -m pytest tests/test_sanitize.py -v
```

These tests verify:
- Tokens are sanitized
- URLs are normalized
- UUIDs are replaced
- Timestamps are normalized
- Email addresses are sanitized
- Verification catches leaked secrets

### Run All Tests

```bash
cd libs/fleet-mcp
python -m pytest tests/ -v
```

## Maintenance

### Refreshing Fixtures

When the Coder API changes:

1. Re-record fixtures:
   ```bash
   python scripts/record_fixtures.py --all
   ```

2. Regenerate Python code:
   ```bash
   python scripts/generate_factories.py
   ```

3. Run tests:
   ```bash
   python -m pytest tests/ -v
   ```

4. Commit updated `generated.py`:
   ```bash
   git add tests/fixtures/generated.py
   git commit -m "chore: regenerate test fixtures from updated Coder API"
   ```

### Adding New Scenarios

1. Edit `scenarios.yaml`:
   ```yaml
   my_new_scenario:
     description: "Test something new"
     record:
       - list_templates
       - create_workspace
     teardown:
       - delete_workspace
   ```

2. Record and generate:
   ```bash
   python scripts/record_fixtures.py --scenario my_new_scenario
   python scripts/generate_factories.py
   ```

### Adding Manual Fixtures

Edit `tests/fixtures/manual.py` to add edge cases:

```python
def make_my_edge_case() -> dict[str, Any]:
    """Description of edge case."""
    return {
        # ... fixture data
    }
```

## Troubleshooting

### "No recordings found"

Make sure you run the recording script first:
```bash
python scripts/record_fixtures.py --scenario agent_creation
```

### "Secret leaked!" error

The sanitization detected a potential secret. Check:
1. Patterns in `sanitize.py` may need updating
2. Verification logic may be too strict (check forbidden_patterns)

To debug (DANGEROUS - don't commit):
```bash
python scripts/record_fixtures.py --scenario agent_creation --no-sanitize
cat tests/fixtures/recordings/agent_creation.json | grep -i "secret_pattern"
```

### "Workspace already exists"

Clean up manually:
```bash
# List workspaces
coder list

# Delete test workspaces
coder delete <workspace-name>
```

Or use the Coder web UI to delete workspaces starting with `fleet-record-test-`.

### Import errors in tests

Make sure you've generated the fixtures:
```bash
python scripts/generate_factories.py
```

Check that `tests/fixtures/generated.py` exists.

## Architecture

### Why Hybrid?

**Real Data (80%)**:
- ✅ High fidelity - matches actual API
- ✅ Easy to refresh when API changes
- ✅ Documents API structure
- ✅ Catches breaking changes early

**Manual Fixtures (20%)**:
- ✅ Error cases (404, 500, etc.)
- ✅ Edge cases (empty lists, long names)
- ✅ State transitions (pending, starting, stopping)
- ✅ Special conditions hard to reproduce

### File Organization

```
libs/fleet-mcp/
├── scripts/
│   ├── README.md              # This file
│   ├── record_fixtures.py     # Records from live API
│   ├── generate_factories.py  # Generates Python code
│   ├── sanitize.py            # Secret sanitization
│   └── scenarios.yaml         # Recording scenarios
├── tests/
│   ├── fixtures/
│   │   ├── recordings/        # *.json (GITIGNORED)
│   │   ├── generated.py       # Auto-generated (COMMITTED)
│   │   ├── manual.py          # Hand-written (COMMITTED)
│   │   ├── __init__.py        # Exports
│   │   ├── agent_factory.py   # Legacy factories
│   │   ├── template_factory.py
│   │   └── workspace_factory.py
│   └── test_*.py              # Test files
```

## Contributing

When adding new API interactions:

1. Add scenario to `scenarios.yaml`
2. Record: `python scripts/record_fixtures.py --scenario <name>`
3. Generate: `python scripts/generate_factories.py`
4. Add manual fixtures for error cases
5. Write tests using both generated and manual fixtures
6. Commit only `generated.py` and `manual.py` (not recordings/)

## References

- [Coder API Documentation](https://coder.com/docs/api)
- [RESPX Documentation](https://lundberg.github.io/respx/)
- [pytest Documentation](https://docs.pytest.org/)
