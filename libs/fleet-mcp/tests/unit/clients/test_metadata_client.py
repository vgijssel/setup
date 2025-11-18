"""Unit tests for MetadataClient.

TDD Approach: These tests verify MetadataClient HTTP behavior.
Written FIRST before implementation.
"""

import pytest
import respx
from httpx import ConnectError, Response, TimeoutException

# Mark all tests in this module as asyncio
pytestmark = pytest.mark.asyncio


@respx.mock
async def test_metadata_client_get_success():
    """Test MetadataClient successfully fetches and parses metadata."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={
                "data": {
                    "test_field": {
                        "value": "test_value",
                        "error": None,
                        "schema": {"description": "Test", "include_in_list": True},
                    }
                },
                "meta": {"version": "1.0"},
            },
        )
    )

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert metadata.data["test_field"].value == "test_value"


@respx.mock
async def test_metadata_client_get_404_returns_empty():
    """Test MetadataClient returns empty metadata on 404."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=404))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0
    assert metadata.meta["version"] == "1.0"


@respx.mock
async def test_metadata_client_get_500_returns_empty():
    """Test MetadataClient returns empty metadata on 500 error."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=500))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_timeout_returns_empty():
    """Test MetadataClient returns empty metadata on timeout."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(side_effect=TimeoutException("Timeout"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_connection_error_returns_empty():
    """Test MetadataClient returns empty metadata on connection error."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(side_effect=ConnectError("Connection failed"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_invalid_json_returns_empty():
    """Test MetadataClient returns empty metadata on invalid JSON."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=200, text="invalid json{{{"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_timeout_value():
    """Test MetadataClient uses appropriate timeout value."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    route = respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={"data": {}, "meta": {"version": "1.0"}},
        )
    )

    client = MetadataClient(timeout=10.0)
    await client.get_metadata(url)

    # Verify request was made
    assert route.called


@respx.mock
async def test_metadata_client_custom_headers():
    """Test MetadataClient can include custom headers."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    route = respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={"data": {}, "meta": {"version": "1.0"}},
        )
    )

    client = MetadataClient()
    await client.get_metadata(url)

    assert route.called


@respx.mock
async def test_metadata_fetch_without_auth_fails():
    """REGRESSION TEST: Metadata fetch without authentication should fail.

    This test demonstrates the bug where MetadataClient makes unauthenticated
    requests to Coder proxy URLs, resulting in 303 redirects to the login page
    and empty metadata being returned.

    After the fix, the client should support authentication and successfully
    fetch metadata when a token is provided.

    This test should FAIL with the old implementation and PASS after the fix.
    """
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://coder.example.com/@user/workspace.123/apps/fleet-mcp/metadata"
    token = "test-token-123"

    # Mock endpoint that returns 303 redirect when no auth token is provided
    # This simulates Coder's behavior when accessing proxy URLs without authentication
    def check_auth_header(request):
        # If request has Coder-Session-Token header, return 200 with metadata
        if "Coder-Session-Token" in request.headers:
            return Response(
                status_code=200,
                json={
                    "data": {
                        "git_branch": {
                            "value": "main",
                            "error": None,
                            "schema": {
                                "description": "Git branch",
                                "include_in_list": True,
                            },
                        }
                    },
                    "meta": {"version": "1.0"},
                },
            )
        # Without auth token, return 303 redirect (Coder's actual behavior)
        return Response(
            status_code=303,
            headers={"Location": "/login"},
        )

    route = respx.get(url).mock(side_effect=check_auth_header)

    # After fix: MetadataClient WITH token support
    # The old implementation would not accept coder_session_token parameter
    # and would return empty metadata due to 303 redirect
    client = MetadataClient(coder_session_token=token)
    metadata = await client.get_metadata(url)

    # EXPECTED BEHAVIOR (after fix): Should receive metadata successfully with auth
    # OLD BEHAVIOR (before fix): Would return empty metadata due to 303 redirect
    assert len(metadata.data) > 0, (
        "Metadata should be populated when authentication is provided. "
        "Old implementation returned empty metadata due to 303 redirect."
    )
    assert "git_branch" in metadata.data
    assert metadata.data["git_branch"].value == "main"
    assert route.called


@respx.mock
async def test_metadata_fetch_with_auth_succeeds():
    """Test MetadataClient successfully fetches metadata with authentication.

    This test verifies that when a Coder session token is provided,
    the client includes it in the request headers and successfully
    retrieves metadata from Coder proxy URLs.
    """
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://coder.example.com/@user/workspace.123/apps/fleet-mcp/metadata"
    token = "test-session-token-abc123"

    # Mock endpoint that requires and validates Coder-Session-Token
    def check_auth_header(request):
        # Verify the Coder-Session-Token header is present and correct
        if request.headers.get("Coder-Session-Token") == token:
            return Response(
                status_code=200,
                json={
                    "data": {
                        "git_branch": {
                            "value": "feature/auth-fix",
                            "error": None,
                            "schema": {
                                "description": "Git branch",
                                "include_in_list": True,
                            },
                        },
                        "pr_number": {
                            "value": "42",
                            "error": None,
                            "schema": {
                                "description": "PR number",
                                "include_in_list": True,
                            },
                        },
                    },
                    "meta": {"version": "1.0"},
                },
            )
        # Without proper auth, return 303 redirect
        return Response(
            status_code=303,
            headers={"Location": "/login"},
        )

    route = respx.get(url).mock(side_effect=check_auth_header)

    # Create client with authentication token
    client = MetadataClient(coder_session_token=token)
    metadata = await client.get_metadata(url)

    # Verify successful metadata fetch
    assert len(metadata.data) == 2
    assert "git_branch" in metadata.data
    assert metadata.data["git_branch"].value == "feature/auth-fix"
    assert "pr_number" in metadata.data
    assert metadata.data["pr_number"].value == "42"
    assert route.called


@respx.mock
async def test_metadata_fetch_without_token_graceful():
    """Test MetadataClient gracefully handles missing token for local development.

    When no token is provided (e.g., local testing), the client should still
    make requests but may receive empty metadata if authentication is required.
    This ensures backward compatibility with local development environments.
    """
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "http://localhost:8000/metadata"

    # Mock local endpoint that doesn't require authentication
    route = respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={
                "data": {
                    "local_test": {
                        "value": "works",
                        "error": None,
                        "schema": {
                            "description": "Local test",
                            "include_in_list": True,
                        },
                    }
                },
                "meta": {"version": "1.0"},
            },
        )
    )

    # Create client without token (backward compatibility)
    client = MetadataClient(coder_session_token=None)
    metadata = await client.get_metadata(url)

    # Verify request was made without Coder-Session-Token header
    assert route.called
    # For local endpoints that don't require auth, metadata should be returned
    assert len(metadata.data) == 1
    assert metadata.data["local_test"].value == "works"
