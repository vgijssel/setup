"""Pytest configuration and shared fixtures."""

import pytest
import respx
from typing import AsyncGenerator
import httpx
import os

# Set test environment variables
os.environ["CODER_URL"] = "https://test-coder.example.com"
os.environ["CODER_SESSION_TOKEN"] = "test-token-12345"


@pytest.fixture
def coder_url() -> str:
    """Coder API base URL for testing."""
    return "https://test-coder.example.com"


@pytest.fixture
def coder_token() -> str:
    """Coder API session token for testing."""
    return "test-token-12345"


@pytest.fixture
async def http_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """Async HTTP client for testing."""
    async with httpx.AsyncClient() as client:
        yield client


@pytest.fixture
def sample_workspace_id() -> str:
    """Sample workspace UUID for testing."""
    return "550e8400-e29b-41d4-a716-446655440000"


@pytest.fixture
def sample_template_id() -> str:
    """Sample template UUID for testing."""
    return "660e8400-e29b-41d4-a716-446655440001"


@pytest.fixture
def sample_agent_name() -> str:
    """Sample agent name for testing."""
    return "test-agent"


@pytest.fixture
def respx_mock():
    """Respx mock for HTTP mocking."""
    with respx.mock(assert_all_mocked=False) as mock_router:
        yield mock_router
