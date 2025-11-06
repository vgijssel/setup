# VCR Testing Strategy

This directory uses a decoupled approach to HTTP recording and testing.

## Overview

**Problem:** Tests that directly interact with live APIs are brittle and slow:
- Long setup/teardown times for real workspaces
- Tests depend on external state (Coder API availability)
- Difficult to debug when API state changes
- Cannot run tests offline

**Solution:** Use VCR.py to record HTTP interactions once, replay many times:
1. **Record once** using `record.py` script (only when API changes)
2. **Test many times** using pre-recorded cassettes
3. **Version-aware caching** to invalidate cassettes when Coder version changes

## Directory Structure

```
tests/
├── cassettes/              # Pre-recorded HTTP interactions (YAML)
├── fixtures.py             # Version-aware cassette utilities
├── record.py               # Standalone script to record cassettes
├── conftest.py             # Pytest configuration and VCR setup
├── integration/            # Integration tests for Coder API client
├── contract/               # Contract tests for MCP tools
└── unit/                   # Unit tests for data models
```

## Recording New Cassettes

When the Coder API changes or you need new test scenarios:

```bash
# 1. Set environment variables
export CODER_URL=https://your-coder.com
export CODER_SESSION_TOKEN=your-token

# 2. Run the recording script
cd libs/fleet-mcp
python tests/record.py
```

The script will:
- Clean up existing test workspaces (prefix: `fleet-mcp-test-`)
- Record all HTTP interactions needed for tests
- Filter sensitive data (tokens, hostnames, API keys)
- Save cassettes to `tests/cassettes/`
- Clean up created resources

**Important:** Commit the updated cassettes to version control!

## Writing Tests

Tests use the pytest-vcr integration. The cassettes are pre-recorded, so tests never hit the live API:

```python
import pytest
from fleet_mcp.coder.client import CoderClient

@pytest.mark.vcr
async def test_list_workspaces(coder_base_url, coder_token):
    """Test listing workspaces using VCR cassette"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # This will replay from cassette, not hit live API
    workspaces = await client.list_workspaces()

    assert isinstance(workspaces, list)
    assert len(workspaces) > 0
```

The test uses the cassette named after the test function (e.g., `test_list_workspaces.yaml`).

## Version-Aware Cassette Caching

The test suite supports version-specific cassettes for automatic cache invalidation:

```python
from tests.fixtures import get_cassette_path, coder_version

# In a test
def test_with_version_aware_cassette(cassette_dir, coder_version):
    cassette_path = get_cassette_path(cassette_dir, "test_my_feature", coder_version)
    # cassette_path will be:
    # - test_my_feature_v2.27.1.yaml (if exists)
    # - test_my_feature.yaml (fallback)
```

### How It Works

1. `get_coder_version()` extracts version from `coder --version`
2. `get_cassette_path()` checks for version-specific cassette first
3. Falls back to base cassette if version-specific doesn't exist
4. Opt-in per cassette (backward compatible)

### Benefits

- **Automatic invalidation**: Re-record when Coder API changes
- **Gradual migration**: Add version suffixes only when needed
- **Backward compatible**: Existing cassettes work without changes

## Cassette Loading Utilities

For advanced use cases, load cassette data directly:

```python
from tests.fixtures import load_cassette_response, load_all_cassette_responses

# Load single response
response = load_cassette_response(cassette_path, interaction_index=0)
body = response["parsed_body"]

# Load all responses from cassette
responses = load_all_cassette_responses(cassette_path)
for response in responses:
    body = response["parsed_body"]
    # Process each response
```

## Benefits of This Approach

### For Developers
- **Fast tests**: No network calls, no waiting for API responses
- **Deterministic**: Same results every time
- **Offline**: Work without Coder API access
- **Easy debugging**: Inspect cassette YAML files directly

### For AI Agents
- **Clear test intent**: Tests show expected behavior without API complexity
- **Predictable**: No race conditions or timing issues
- **Maintainable**: Update cassettes separately from test logic

### For CI/CD
- **Reliable**: No flaky tests due to API availability
- **Cheap**: No API costs for test runs
- **Parallel**: Run tests concurrently without conflicts

## Maintenance

### When to Re-record

Re-run `record.py` when:
- Coder API changes (new fields, endpoints, behavior)
- You add new test scenarios
- Cassettes become outdated (e.g., new Coder version)

### What Gets Filtered

The recording script automatically redacts:
- Authorization headers (all auth headers)
- Session tokens (`CODER_SESSION_TOKEN`, `CODER_AGENT_TOKEN`)
- API keys (query parameters)
- Hostnames (replaced with `coder.example.com`)
- Environment secrets (`GH_TOKEN`, `HA_TOKEN`, `NX_KEY`, etc.)

### Troubleshooting

**Problem**: Test fails with "Cassette not found"
**Solution**: Run `python tests/record.py` to generate cassettes

**Problem**: Test fails with unexpected response format
**Solution**: Re-record cassettes with updated API responses

**Problem**: Recording script fails with authentication error
**Solution**: Check `CODER_URL` and `CODER_SESSION_TOKEN` environment variables

**Problem**: Tests pass locally but fail in CI
**Solution**: Ensure cassettes are committed to version control

**Problem**: Test fails after Coder version upgrade
**Solution**: Re-record cassettes with new Coder version

## Test Organization

### Integration Tests (`integration/`)
Test the Coder API client directly. These tests:
- Use `@pytest.mark.vcr` to replay cassettes
- Test async methods of `CoderClient`
- Validate request/response handling
- Check error handling

### Contract Tests (`contract/`)
Test MCP tools through the FastMCP server. These tests:
- Use `@pytest.mark.vcr` to replay cassettes
- Test MCP tool inputs/outputs
- Validate tool contract compliance
- Check MCP protocol handling

### Unit Tests (`unit/`)
Test data models and utilities. These tests:
- Don't use VCR (no HTTP calls)
- Test Pydantic models
- Validate data transformations
- Check pure functions

## Best Practices

1. **One cassette per test**: Makes it easy to understand what's being tested
2. **Descriptive test names**: Test function name becomes cassette name
3. **Minimal interactions**: Only record what's necessary for the test
4. **Keep cassettes small**: Large cassettes are hard to review and maintain
5. **Review before commit**: Check that sensitive data is filtered
6. **Document changes**: Update this guide when adding new recording patterns
7. **Use record mode "once"**: Prevents accidental overwriting (set in `conftest.py`)

## References

- [VCR.py Documentation](https://vcrpy.readthedocs.io/)
- [pytest-vcr Documentation](https://pytest-vcr.readthedocs.io/)
- [pytest-asyncio Documentation](https://pytest-asyncio.readthedocs.io/)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
