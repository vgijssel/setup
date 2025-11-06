# VCR Testing Strategy

This directory uses a decoupled approach to HTTP recording and testing with RESPX mocking.

## Overview

**Problem:** Tests that directly interact with live APIs are brittle and slow:
- Long setup/teardown times for real workspaces
- Tests depend on external state (Coder API availability)
- Difficult to debug when API state changes
- Cannot run tests offline

**Solution:** Separate HTTP recording from test execution using RESPX mocking:
1. **Record once** using `record.py` script (only when API changes) - generates VCR cassettes
2. **Test many times** using respx mocks populated from cassette data via pytest fixtures
3. **Version-aware caching** to invalidate cassettes when Coder version changes
4. **No VCR in tests** - tests use respx mocking, cassettes are only used by record.py and fixtures

## Directory Structure

```
tests/
├── cassettes/              # Pre-recorded HTTP interactions (YAML) - used by fixtures
├── fixtures.py             # Pytest fixtures that load cassettes and configure respx mocks
├── record.py               # Standalone script to record cassettes
├── conftest.py             # Pytest configuration
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

All tests use **respx mocking with pytest fixtures**. Tests never directly use VCR cassettes - instead, fixtures load cassette data and configure respx mocks.

### Pattern: Clean Tests with Pytest Fixtures

Tests should only contain assertions - all mock setup is done by fixtures:

```python
import pytest

@pytest.mark.asyncio
async def test_get_task_exists(coder_client, mock_get_task_exists):
    """Test getting an existing task

    The mock_get_task_exists fixture:
    - Loads cassette data for this test
    - Configures respx to mock the Coder API endpoint
    - Returns the expected task data
    """
    # The fixture already set up the mock, so we just call the client
    task = mock_get_task_exists

    # Run regular coder_client method using the task id from the mock
    task_result = await coder_client.get_task("maarten", task['id'])

    # Assertions only - no mock setup
    assert task_result['id'] == task['id']
    assert task_result['current_state'] == 'idle'
```

### Pattern: Integration Tests (Direct API Client)

Integration tests use pytest fixtures that configure respx mocks:

```python
import pytest

@pytest.mark.asyncio
async def test_list_workspaces(coder_client, mock_list_workspaces):
    """Test listing workspaces using respx mocking

    The mock_list_workspaces fixture:
    - Loads workspace data from cassette
    - Configures respx to mock GET /api/v2/workspaces
    - Returns the expected workspace list
    """
    # Execute test - respx mock is already configured by fixture
    result = await coder_client.list_workspaces()

    # Assertions
    assert isinstance(result, list)
    assert len(result) > 0
    assert result == mock_list_workspaces
```

### Pattern: Contract Tests (MCP Tools)

Contract tests also use respx mocking via pytest fixtures:

```python
import pytest

@pytest.mark.asyncio
async def test_list_agents(agent_server, mock_list_workspaces):
    """Test list_agents MCP tool

    The mock_list_workspaces fixture configures respx mocks for
    the Coder API calls that the MCP tool will make.
    """
    from fastmcp import Client

    # The fixture has already configured respx mocks
    async with Client(agent_server) as client:
        result = await client.call_tool("list_agents", {})

        # Assertions
        agents = result.content[0].text
        assert "agent_name" in agents
```

## Version-Aware Cassette Caching

Fixtures support version-specific cassettes for automatic cache invalidation:

```python
from tests.fixtures import get_cassette_path, coder_version

# In a fixture
@pytest.fixture
def mock_my_feature(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock for my_feature test"""
    # Get version-aware cassette path
    cassette_path = get_cassette_path(cassette_dir, "test_my_feature", coder_version)

    # Load cassette data
    response = load_cassette_response(cassette_path)
    data = response["parsed_body"]

    # Configure respx mock
    respx_mock.get(f"{coder_base_url}/api/v2/my-feature").mock(
        return_value=Response(200, json=data)
    )

    return data
```

### How It Works

1. `get_coder_version()` extracts version from `coder --version`
2. `get_cassette_path()` checks for version-specific cassette first
3. Falls back to base cassette if version-specific doesn't exist
4. Fixtures load cassette data and configure respx mocks
5. Tests receive mocked data via fixture parameters

### Benefits

- **Automatic invalidation**: Re-record when Coder API changes
- **Gradual migration**: Add version suffixes only when needed
- **Backward compatible**: Existing cassettes work without changes
- **Clean tests**: All mock setup in fixtures

## Fixture Architecture

### Core Fixtures (in `fixtures.py`)

1. **`respx_mock`**: Configures respx to fail on unmocked requests
2. **`coder_base_url`**: Base URL for Coder API
3. **`coder_token`**: API token placeholder
4. **`coder_client`**: Configured CoderClient instance
5. **`cassette_dir`**: Path to cassettes directory
6. **`coder_version`**: Current Coder version for cache keys

### Mock Fixtures (in `fixtures.py`)

Each test scenario has a fixture that:
- Loads cassette data using version-aware path
- Configures respx mock for the API endpoint
- Returns expected data for assertions

Examples:
- `mock_list_workspaces`: Mocks workspace listing
- `mock_create_workspace`: Mocks workspace creation
- `mock_get_task_exists`: Mocks task retrieval
- `mock_list_templates`: Mocks template listing

## Benefits of This Approach

### For Developers
- **Fast tests**: No network calls, respx is in-memory
- **Deterministic**: Same results every time
- **Offline**: Work without Coder API access
- **Clean tests**: Only assertions, no mock setup
- **Easy debugging**: Inspect cassette YAML files

### For AI Agents
- **Clear test intent**: Tests show expected behavior
- **Predictable**: No race conditions or timing issues
- **Maintainable**: Update cassettes separately from test logic
- **Fixtures**: Clear separation between setup and assertions

### For CI/CD
- **Reliable**: No flaky tests due to API availability
- **Cheap**: No API costs for test runs
- **Parallel**: Run tests concurrently without conflicts
- **Fast**: Respx mocking is very fast

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

**Problem**: Test fails with "RESPX: <Request> not mocked!"
**Solution**: Add a fixture that loads the cassette and configures respx for that endpoint

**Problem**: Fixture not found
**Solution**: Ensure the fixture is defined in `fixtures.py` and imported via `conftest.py`

**Problem**: Test fails with unexpected response format
**Solution**: Re-record cassettes with updated API responses using `record.py`

**Problem**: Recording script fails with authentication error
**Solution**: Check `CODER_URL` and `CODER_SESSION_TOKEN` environment variables

**Problem**: Tests pass locally but fail in CI
**Solution**: Ensure cassettes are committed to version control

**Problem**: Test fails after Coder version upgrade
**Solution**: Re-record cassettes with new Coder version

## Test Organization

### Integration Tests (`integration/`)
Test the Coder API client directly. These tests:
- Use `@pytest.mark.asyncio` for async tests
- Use respx mock fixtures (e.g., `mock_list_workspaces`)
- Test async methods of `CoderClient`
- Validate request/response handling
- Check error handling

### Contract Tests (`contract/`)
Test MCP tools through the FastMCP server. These tests:
- Use `@pytest.mark.asyncio` for async tests
- Use respx mock fixtures to mock underlying API calls
- Test MCP tool inputs/outputs
- Validate tool contract compliance
- Check MCP protocol handling

### Unit Tests (`unit/`)
Test data models and utilities. These tests:
- Don't use HTTP mocking (no network calls)
- Test Pydantic models
- Validate data transformations
- Check pure functions

## Best Practices

1. **One cassette per test**: Makes it easy to understand what's being tested
2. **Fixtures for mocks**: All respx mock setup in fixtures, not in tests
3. **Clean test bodies**: Tests only contain assertions
4. **Descriptive fixture names**: Name fixtures after what they mock (e.g., `mock_list_workspaces`)
5. **Keep cassettes small**: Large cassettes are hard to review and maintain
6. **Review before commit**: Check that sensitive data is filtered
7. **Document fixtures**: Add docstrings explaining what each fixture mocks
8. **Fail on unmocked requests**: Respx configured to fail if test tries unmocked request

## Creating New Fixtures

When adding a new test scenario:

1. **Record the cassette** using `record.py` (add new recording function if needed)
2. **Create a fixture** in `fixtures.py`:

```python
@pytest.fixture
def mock_my_new_feature(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock for my_new_feature API call

    Loads cassette data and configures respx to mock:
    GET /api/v2/my-new-feature
    """
    # Load cassette with version awareness
    cassette_path = get_cassette_path(cassette_dir, "test_my_new_feature", coder_version)
    response = load_cassette_response(cassette_path)
    data = response["parsed_body"]

    # Configure respx mock
    respx_mock.get(f"{coder_base_url}/api/v2/my-new-feature").mock(
        return_value=Response(200, json=data)
    )

    return data
```

3. **Use the fixture** in your test:

```python
@pytest.mark.asyncio
async def test_my_new_feature(coder_client, mock_my_new_feature):
    """Test my new feature"""
    result = await coder_client.my_new_feature()
    assert result == mock_my_new_feature
```

## References

- [RESPX Documentation](https://lundberg.github.io/respx/)
- [VCR.py Documentation](https://vcrpy.readthedocs.io/) (for understanding cassette format)
- [pytest-asyncio Documentation](https://pytest-asyncio.readthedocs.io/)
- [Pytest Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
