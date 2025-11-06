# VCR Testing Refinements - Implementation Status

## ✅ Completed

### 1. Version-Aware Fixture Caching
- Implemented `get_coder_version()` function to extract Coder version
- Created `get_cassette_path()` to use version-specific cassettes when available
- Falls back to base cassettes if version-specific don't exist
- Session-scoped `coder_version` and `cassette_dir` fixtures

### 2. Proper Pytest Fixtures
- Converted `fixtures.py` to use proper pytest fixture syntax
- All mocking logic is inside fixture functions
- Fixtures return data and set up respx mocks
- Clean separation of concerns

### 3. Respx Configuration to Fail on Unmocked Requests
- `respx_mock` fixture configured with `assert_all_mocked=True`
- Tests will fail if they try to make unmocked HTTP requests
- Global configuration in `conftest.py`

### 4. Clean Test Pattern
- Refactored integration tests follow clean pattern
- Tests only contain assertions
- No manual mock setup in tests
- Example: `test_coder_client_refactored.py` and `test_beta_task_api_refactored.py`

### 5. Updated conftest.py
- Imports all fixtures via `pytest_plugins`
- Maintains backward compatibility with VCR tests
- Clear documentation

## 🔧 Needs Debugging

### Respx Mock Registration
**Issue**: Mocks are configured in fixtures but not being recognized by respx during test execution.

**Current Behavior**:
```
respx.models.AllMockedAssertionError: RESPX: <Request(b'GET', 'https://coder.example.com/api/v2/workspaces')> not mocked!
```

**Root Cause**: The way respx mocks are being registered in fixtures may need adjustment. The current approach uses:
```python
respx_mock.get(f"{coder_base_url}/api/v2/workspaces").respond(
    status_code=200, json=workspaces_response
)
```

**Possible Solutions**:
1. Use respx `route()` method differently
2. Check if respx context manager scope is correct
3. Verify respx fixture setup matches respx API expectations
4. Consider using `respx_mock.route(...)` instead of `respx_mock.get(...)`

**Debug Steps**:
1. Create minimal test with hardcoded mock to verify respx setup
2. Check respx documentation for fixture-based mocking patterns
3. Verify the mock is actually registered before test runs
4. Add logging to see when mocks are being set up

## 📋 TODO

### High Priority
- [ ] Fix respx mock registration in fixtures
- [ ] Verify all integration tests pass with new fixtures
- [ ] Apply pattern to ALL contract tests in `test_mcp_tools.py`

### Medium Priority
- [ ] Update `TESTING.md` with refined approach
- [ ] Add examples of version-aware cassettes
- [ ] Document respx fixture usage patterns
- [ ] Update `record.py` to generate version-specific cassettes

### Low Priority
- [ ] Consider creating helper functions for common mock patterns
- [ ] Add more granular fixtures for complex test scenarios
- [ ] Performance optimization for fixture loading

## 🎯 Next Steps

1. **Debug Respx Integration** (30 min)
   - Create minimal reproducer
   - Check respx v0.21.1 documentation
   - Try alternative mock registration approaches

2. **Apply to All Tests** (1-2 hours)
   - Once respx is working, apply pattern to all integration tests
   - Refactor contract tests similarly
   - Remove old VCR-based test files

3. **Documentation** (30 min)
   - Update TESTING.md with working examples
   - Add troubleshooting section
   - Document version-aware caching

4. **Validation** (30 min)
   - Run full test suite
   - Verify no unmocked requests
   - Check CI passes

## 💡 Key Insights

### What Works Well
- Clean test pattern with fixtures
- Version-aware caching architecture
- Separation of concerns (fixtures vs tests)
- Fail-fast on unmocked requests

### What Needs Attention
- Respx API usage in fixtures
- Documentation of new patterns
- Migration path for existing tests

## 📚 References

- [Respx Documentation](https://lundberg.github.io/respx/)
- [Pytest Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [VCR.py](https://vcrpy.readthedocs.io/)
