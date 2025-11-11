"""Integration tests for fleet-mcp authentication.

Tests end-to-end authentication flow with the FastMCP server.
"""

import pytest
from fleet_mcp.auth.middleware import AuthMiddleware
from fleet_mcp.auth.models import AuthErrorCode
from fleet_mcp.auth.token_manager import TokenManager
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.testclient import TestClient


@pytest.fixture
def temp_token_file(tmp_path):
    """Create a temporary token file for testing."""
    return tmp_path / "test_auth_token"


@pytest.fixture
def token_manager(temp_token_file):
    """Create a TokenManager with a test token."""
    manager = TokenManager(token_file_path=str(temp_token_file))
    return manager


@pytest.fixture
def valid_token(token_manager):
    """Get or create a valid token."""
    token = token_manager.get_or_create_token()
    return token.value


@pytest.fixture
def test_app(token_manager):
    """Create a test FastMCP-like application."""

    async def list_agents(request: Request):
        """Simulated MCP tool endpoint."""
        return JSONResponse({"agents": ["agent1", "agent2"]})

    async def health(request: Request):
        """Health check endpoint."""
        return JSONResponse({"status": "healthy"})

    app = Starlette(
        routes=[
            Route("/mcp/list_agents", list_agents),
            Route("/health", health),
        ]
    )

    # Add authentication middleware
    app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

    return app


class TestIntegration:
    """Integration tests for authentication."""

    def test_unauthenticated_request_returns_401(self, test_app):
        """Test that unauthenticated request to MCP endpoint returns 401."""
        client = TestClient(test_app)

        # Request without Authorization header
        response = client.get("/mcp/list_agents")

        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MISSING_TOKEN.value
        assert "error_description" in data

    def test_authenticated_request_succeeds(self, test_app, valid_token):
        """Test that authenticated request to MCP endpoint succeeds."""
        client = TestClient(test_app)

        # Request with valid Authorization header
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": f"Bearer {valid_token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["agents"] == ["agent1", "agent2"]

    def test_health_endpoint_bypasses_auth(self, test_app):
        """Test that /health endpoint bypasses authentication."""
        client = TestClient(test_app)

        # Request to health endpoint without auth
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_invalid_token_returns_correct_error_code(self, test_app):
        """Test that invalid token returns correct error code."""
        client = TestClient(test_app)

        # Request with invalid token
        invalid_token = "INVALID_TOKEN_" + "x" * 30  # 43 chars
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": f"Bearer {invalid_token}"},
        )

        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.INVALID_TOKEN.value
        assert "error_description" in data

    def test_malformed_authorization_header_returns_401(self, test_app, valid_token):
        """Test that malformed Authorization header returns 401."""
        client = TestClient(test_app)

        # Test case 1: Missing "Bearer" prefix
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": valid_token},
        )
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MALFORMED_HEADER.value

        # Test case 2: Wrong authentication scheme
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": f"Basic {valid_token}"},
        )
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MALFORMED_HEADER.value

        # Test case 3: Empty Authorization header
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": ""},
        )
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MALFORMED_HEADER.value


class TestConfiguration:
    """Tests for authentication configuration."""

    def test_auth_disabled_by_default(self, token_manager):
        """Test that authentication is disabled by default."""

        async def list_agents(request: Request):
            """Simulated MCP tool endpoint."""
            return JSONResponse({"agents": ["agent1", "agent2"]})

        app = Starlette(routes=[Route("/mcp/list_agents", list_agents)])

        # Add middleware with enabled=False (default behavior)
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=False)

        client = TestClient(app)

        # Request without Authorization header should succeed
        response = client.get("/mcp/list_agents")
        assert response.status_code == 200
        data = response.json()
        assert data["agents"] == ["agent1", "agent2"]

    def test_auth_enabled_with_env_var(self, token_manager, valid_token):
        """Test that authentication is enabled when configured."""

        async def list_agents(request: Request):
            """Simulated MCP tool endpoint."""
            return JSONResponse({"agents": ["agent1", "agent2"]})

        app = Starlette(routes=[Route("/mcp/list_agents", list_agents)])

        # Add middleware with enabled=True
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Request without auth should fail
        response = client.get("/mcp/list_agents")
        assert response.status_code == 401

        # Request with auth should succeed
        response = client.get(
            "/mcp/list_agents",
            headers={"Authorization": f"Bearer {valid_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["agents"] == ["agent1", "agent2"]
