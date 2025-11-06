"""Pytest configuration for fleet-mcp tests

This module configures pytest for the fleet-mcp test suite:
- Imports all fixtures from fixtures.py
- All tests use respx mocking via pytest fixtures
- No VCR is used directly in tests
"""

import pytest

# Import all fixtures (makes them available to all tests)
pytest_plugins = ["tests.fixtures"]


# ============================================================================
# Global Respx Configuration
# ============================================================================


def pytest_configure(config):
    """Configure pytest - runs once before all tests

    This ensures respx is configured to fail on unmocked requests via
    the respx_mock fixture in fixtures.py, making it impossible for tests
    to accidentally hit real APIs.
    """
    pass
