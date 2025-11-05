# Fleet MCP Testing Strategy

## Overview

This document describes the testing approach for `libs/fleet-mcp`, including the migration from pytest-vcr to direct VCR.py usage for HTTP cassette recording.

## Test Structure

```
libs/fleet-mcp/tests/
├── unit/               # Unit tests for models and business logic
├── integration/        # Integration tests using VCR cassettes (refactored)
├── contract/           # MCP tool contract tests (partial migration)
├── cassettes/          # VCR cassette recordings (37 files, 61MB)
├── conftest.py         # Pytest configuration and fixtures
├── record.py           # Script to record VCR cassettes (NEW)
└── TESTING.md          # This file
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)
- **Purpose**: Test data models, validation, and business logic in isolation
- **No HTTP calls**: These tests don't make any network requests
- **Fast**: Run in <0.1s
- **Examples**: `test_models.py`, `test_workspaces.py`, `test_task_pagination.py`

### 2. Integration Tests (`tests/integration/`) ✅ REFACTORED
- **Purpose**: Test Coder API client interactions
- **HTTP Recording**: Use VCR.py directly for HTTP cassette playback
- **Idempotent**: Tests replay pre-recorded cassettes, no live HTTP calls
- **Fast**: Run in ~0.2s (previously could take minutes with live calls)
- **Examples**:
  - `test_coder_client.py` - Workspace CRUD operations
  - `test_beta_task_api.py` - Experimental task API endpoints

### 3. Contract Tests (`tests/contract/`) ⚠️ PARTIAL MIGRATION
- **Purpose**: Test MCP tool behavior end-to-end
- **Status**: Currently make live HTTP calls (pytest-vcr decorators commented out)
- **TODO**: Migrate to VCR.py direct usage like integration tests

## VCR Testing Strategy (NEW)

### Problem with pytest-vcr

The previous approach using `pytest-vcr` had several issues:

1. **State Pollution**: HTTP requests changed Coder system state, making re-runs inconsistent
2. **Slow Recording**: Creating/deleting workspaces took minutes
3. **Timing Hacks**: Tests had `is_recording` checks and `asyncio.sleep()` calls scattered throughout
4. **Non-Idempotent**: Couldn't easily re-record cassettes without manual Coder cleanup
5. **Confusing DX**: Tests behaved differently when recording vs replaying

### Solution: Direct VCR.py Usage

#### Key Changes

1. **Removed** `pytest-vcr` dependency (replaced with `vcrpy==7.0.0`)
2. **Created** `tests/record.py` script for recording cassettes **outside of pytest**
3. **Refactored** integration tests to use VCR.py directly via fixtures
4. **Eliminated** `is_recording` checks and conditional sleeps from tests

#### How It Works

**Recording Phase** (Manual, Idempotent):
```bash
# Run record.py to record all cassettes
python tests/record.py

# This script:
# 1. Cleans up ALL fleet-mcp workspaces
# 2. Records HTTP interactions for each test
# 3. Saves cassettes to tests/cassettes/
# 4. Cleans up again for idempotency
```

**Playback Phase** (Automated, Fast):
```bash
# Run pytest - uses pre-recorded cassettes
uv run pytest tests/integration/ -v

# Tests:
# 1. Load VCR cassettes from tests/cassettes/
# 2. Replay HTTP responses (no live calls)
# 3. Complete in <1s per test
```

## New Test Pattern

### Old Pattern (pytest-vcr)
```python
# OLD: Using pytest-vcr decorator
@pytest.mark.vcr
async def test_create_workspace(coder_base_url, coder_token, vcr_cassette):
    """Test workspace creation"""
    is_recording = not vcr_cassette.rewound  # ❌ Recording check

    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspace = await client.create_workspace(...)

    # Wait for workspace with conditional sleep
    for _ in range(60):
        ws = await client.get_workspace(workspace_id)
        if ws["status"] == "running":
            break
        if is_recording:  # ❌ Conditional sleep
            await asyncio.sleep(2)
```

###  New Pattern (VCR.py direct)
```python
# NEW: Using VCR.py directly via fixtures
async def test_create_workspace(coder_base_url, coder_token, my_vcr, vcr_cassette_dir):
    """Test workspace creation"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_create_workspace.yaml")
    with my_vcr.use_cassette(cassette_path):  # ✅ Direct VCR usage
        workspace = await client.create_workspace(...)

        # Wait for workspace (polling recorded in cassette)
        for _ in range(60):
            ws = await client.get_workspace(workspace_id)
            if ws["status"] == "running":
                break
        # ✅ No is_recording checks!
        # ✅ No asyncio.sleep() calls!
```

## VCR Configuration

### Fixtures (`tests/conftest.py`)

```python
@pytest.fixture(scope="module")
def vcr_config():
    """VCR configuration with secret redaction"""
    return {
        "filter_headers": ["authorization", "cookie", ...],
        "before_record_response": _redact_secrets,
        "before_record_request": _redact_secrets_from_request,
        "record_mode": "none",  # Never record during pytest
        "match_on": ["method", "scheme", "host", "port", "path"],
        "cassette_library_dir": "tests/cassettes",
    }

@pytest.fixture(scope="module")
def my_vcr(vcr_config):
    """Create VCR instance with config"""
    return vcr.VCR(**vcr_config)
```

### Secret Redaction

VCR automatically redacts sensitive data from cassettes:
- Environment variables: `GH_TOKEN`, `HA_TOKEN`, `CODER_SESSION_TOKEN`, etc.
- Hostnames: Replaces actual hostnames with `coder.example.com`
- Tokens in JSON: Redacts `CODER_SESSION_TOKEN` and `CODER_AGENT_TOKEN` from responses

## Recording New Cassettes

### When to Re-record

- API changes in Coder
- New test scenarios
- Updated test logic that changes HTTP interactions

### How to Record

1. **Ensure clean Coder state**:
   ```bash
   # Delete all fleet-mcp workspaces manually or via record.py cleanup
   ```

2. **Set environment variables**:
   ```bash
   export CODER_URL="https://your-coder-instance.com"
   export CODER_SESSION_TOKEN="your-token"
   ```

3. **Run record script**:
   ```bash
   cd libs/fleet-mcp
   python tests/record.py
   ```

4. **Review and commit cassettes**:
   ```bash
   git diff tests/cassettes/
   git add tests/cassettes/
   git commit -m "chore: update VCR cassettes"
   ```

## Running Tests

### All Tests
```bash
uv run pytest tests/
```

### Unit Tests Only (fastest)
```bash
uv run pytest tests/unit/ -v
# ✓ 41 passed in 0.10s
```

### Integration Tests Only (with VCR)
```bash
uv run pytest tests/integration/ -v
# ✓ 12 passed in 0.22s
```

### Contract Tests (live HTTP calls currently)
```bash
uv run pytest tests/contract/ -v
# ⚠️ Makes live HTTP calls to Coder
# TODO: Migrate to VCR.py direct usage
```

## Migration Status

### ✅ Completed
- [x] Research current VCR usage and pain points
- [x] Design new VCR.py direct approach
- [x] Create `tests/record.py` script
- [x] Refactor integration tests (`test_coder_client.py`, `test_beta_task_api.py`)
- [x] Update fixtures in `conftest.py`
- [x] Remove pytest-vcr dependency
- [x] Add documentation

### ⚠️ In Progress
- [ ] Migrate contract tests (`test_mcp_tools.py`) to VCR.py direct usage
  - Currently: `@pytest.mark.vcr` decorators commented out
  - Tests make live HTTP calls
  - Need to adapt `tests/record.py` for contract test scenarios

### 📝 TODO
- [ ] Create migration guide for contract tests
- [ ] Add automated cassette validation
- [ ] Consider cassette versioning strategy

## Benefits of New Approach

### For Developers
- **Faster tests**: Integration tests run in <1s instead of minutes
- **Deterministic**: Same cassettes = same results every time
- **No timing hacks**: Tests are cleaner without `is_recording` checks
- **Better DX**: Clear separation between recording and playback

### For CI/CD
- **Reliable**: No dependency on Coder being available
- **Fast**: Tests complete quickly
- **Consistent**: No flaky tests from network issues

### For AI Agents
- **Understandable**: Simple, direct VCR usage pattern
- **Maintainable**: Clear record/playback workflow
- **Debuggable**: Easy to see what's recorded in cassettes

## Troubleshooting

### Cassette Mismatch Errors
**Problem**: `CannotOverwriteExistingCassetteException` or "No matching request"

**Solution**:
1. Delete the cassette: `rm tests/cassettes/test_name.yaml`
2. Re-record: `python tests/record.py` (or record specific test)
3. Re-run test: `uv run pytest tests/integration/test_name.py`

### Tests Make Live HTTP Calls
**Problem**: Test is slow or fails without Coder access

**Check**:
1. Is VCR cassette loaded? Check `with my_vcr.use_cassette(...)` block
2. Does cassette exist? `ls tests/cassettes/test_name.yaml`
3. Is `record_mode` set to `"none"`? Check `vcr_config` fixture

### Cassettes Too Large
**Problem**: Cassettes are MB+ in size

**Solutions**:
- Reduce polling iterations in tests (cassette includes all polling)
- Split test into multiple smaller tests
- Consider mocking instead of VCR for very chatty endpoints

## References

- [VCR.py Documentation](https://vcrpy.readthedocs.io/)
- [fleet-mcp README](../README.md)
- [Coder API Documentation](https://coder.com/docs/reference/api)

## Questions?

For questions or issues with the testing strategy:
1. Review this document
2. Check existing test examples in `tests/integration/`
3. Open an issue in the monorepo
