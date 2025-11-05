### VCR Testing Strategy

This directory uses a decoupled approach to HTTP recording and testing:

## Overview

**Problem:** Tests that call live APIs through VCR are brittle and confusing because:
- Cassette data can get out of sync with system state
- Long setup/teardown times for real workspaces
- Tests depend on external state (Coder API availability)
- Difficult for AI agents and developers to understand test failures

**Solution:** Separate HTTP recording from test execution:
1. **Record once** using `record.py` script (only when API changes)
2. **Test many times** using pre-recorded cassettes as fixtures with mocking

## Directory Structure

```
tests/
├── cassettes/              # Pre-recorded HTTP interactions (YAML)
├── fixtures.py             # Utility functions to load cassette data
├── record.py               # Script to record new cassettes
├── integration/            # Tests for Coder API client
│   ├── test_coder_client_refactored.py
│   └── test_beta_task_api_refactored.py
├── contract/               # Tests for MCP tools
│   └── test_mcp_tools.py
└── unit/                   # Tests for data models
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
- Clean up existing test workspaces
- Record all HTTP interactions
- Filter sensitive data (tokens, hostnames)
- Save cassettes to `tests/cassettes/`
- Clean up created resources

**Important:** Commit the updated cassettes to version control!

## Writing Tests

### Approach 1: Integration Tests (Direct API Client)

Use RESPX to mock HTTPX requests with cassette data:

```python
import pytest
import respx
from httpx import Response
from fleet_mcp.coder.client import CoderClient
from tests.fixtures import get_all_responses

@pytest.mark.asyncio
@respx.mock
async def test_list_workspaces():
    """Test listing workspaces using mocked responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load response from cassette
    workspaces = get_response_body("test_list_workspaces")

    # Mock the API call
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    # Execute test
    result = await client.list_workspaces()

    # Assertions
    assert isinstance(result, list)
```

### Approach 2: Contract Tests (MCP Tools)

For MCP tool tests, you can still use VCR with pytest-vcr since the cassettes are pre-recorded:

```python
import pytest
from fastmcp import Client
from fleet_mcp.tools.agent_management import register_agent_tools

@pytest.mark.vcr
async def test_list_agents(agent_server):
    """Test list_agents MCP tool"""
    async with Client(agent_server) as client:
        result = await client.call_tool("list_agents", {})
        # Assertions...
```

The test will replay the cassette interactions without hitting the live API.

## Benefits of This Approach

### For Developers
- **Fast tests**: No network calls, no waiting for workspaces
- **Deterministic**: Same results every time
- **Offline**: Work without Coder API access
- **Easy debugging**: Inspect cassette YAML files directly

### For AI Agents
- **Clear test intent**: Tests show expected behavior without API noise
- **Predictable**: No race conditions or timing issues
- **Maintainable**: Update cassettes separately from test logic

### For CI/CD
- **Reliable**: No flaky tests due to API availability
- **Cheap**: No API costs for test runs
- **Parallel**: Run tests concurrently without conflicts

## Fixture Utilities

The `fixtures.py` module provides helper functions:

```python
from tests.fixtures import (
    get_response_body,      # Get parsed JSON from cassette
    get_all_responses,      # Get all responses from cassette
    workspace_list_response,  # Pre-defined fixture
    agent_create_response,   # Pre-defined fixture
)
```

### Custom Fixtures

Load any cassette response:

```python
# Load the first response body
data = get_response_body("test_my_api_call")

# Load a specific interaction
data = get_response_body("test_my_api_call", interaction_index=2)

# Load all responses from a cassette
responses = get_all_responses("test_my_api_call")
for response in responses:
    body = response.get("parsed_body")
    # Process each response
```

## Maintenance

### When to Re-record

Re-run `record.py` when:
- Coder API changes (new fields, endpoints, behavior)
- You add new test scenarios
- Cassettes become outdated (e.g., new template format)

### What Gets Filtered

The recording script automatically redacts:
- Authorization headers
- Session tokens (CODER_SESSION_TOKEN, CODER_AGENT_TOKEN)
- API keys (query parameters)
- Hostnames (replaced with coder.example.com)
- Other secrets from .env file

### Troubleshooting

**Problem**: Test fails with "Cassette not found"
**Solution**: Run `python tests/record.py` to generate cassettes

**Problem**: Test fails with unexpected response format
**Solution**: Re-record cassettes with updated API responses

**Problem**: Recording script fails with authentication error
**Solution**: Check CODER_URL and CODER_SESSION_TOKEN environment variables

**Problem**: Tests pass locally but fail in CI
**Solution**: Ensure cassettes are committed to version control

## Migration Guide

### Migrating Old VCR Tests

1. **Keep the cassette**: The cassette is still useful as a fixture
2. **Add RESPX mocking**: Mock HTTP calls with cassette data
3. **Remove VCR dependency**: Use pytest.mark.asyncio instead of pytest.mark.vcr
4. **Update fixtures**: Use fixture utilities instead of VCR internals

Example migration:

```python
# Before (brittle, slow, dependent on live API)
@pytest.mark.vcr
async def test_list_workspaces(coder_base_url, coder_token):
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    workspaces = await client.list_workspaces()
    assert isinstance(workspaces, list)

# After (fast, deterministic, offline)
@pytest.mark.asyncio
@respx.mock
async def test_list_workspaces():
    base_url = "https://coder.example.com"
    client = CoderClient(base_url=base_url, token="test-token")

    workspaces = get_response_body("test_list_workspaces")
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    result = await client.list_workspaces()
    assert isinstance(result, list)
```

## Best Practices

1. **One cassette per test**: Makes it easy to understand what's being tested
2. **Descriptive names**: Use test function name as cassette name
3. **Minimal interactions**: Only record what's necessary for the test
4. **Keep cassettes small**: Large cassettes are hard to review and maintain
5. **Review before commit**: Check that sensitive data is filtered
6. **Document changes**: Update this guide when adding new recording patterns

## References

- [VCR.py Documentation](https://vcrpy.readthedocs.io/)
- [RESPX Documentation](https://lundberg.github.io/respx/)
- [pytest-asyncio Documentation](https://pytest-asyncio.readthedocs.io/)
