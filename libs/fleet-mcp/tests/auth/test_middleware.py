"""Tests for authentication middleware.

Following TDD approach:
1. Write test (RED - should fail)
2. Implement code (GREEN - should pass)
3. Refactor if needed
"""

import pytest
from fleet_mcp.auth.middleware import AuthMiddleware
from fleet_mcp.auth.models import AuthErrorCode
from fleet_mcp.auth.token_manager import TokenManager
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, PlainTextResponse
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


class TestAuthMiddleware:
    """Test suite for AuthMiddleware."""

    def test_extract_auth_header(self, token_manager, valid_token):
        """Test extracting Authorization header from request."""

        # Create a simple test app
        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])

        # Wrap with auth middleware
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        # Create test client
        client = TestClient(app)

        # Test with valid authorization header
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        assert response.text == "OK"

    def test_validate_bearer_token_format(self, token_manager, valid_token):
        """Test validating Bearer token format."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test with valid Bearer format
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200

    def test_validate_token_timing_safe_comparison(self, token_manager, valid_token):
        """Test timing-safe token comparison."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test with valid token
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200

        # Test with invalid token (should use timing-safe comparison)
        invalid_token = "a" * 43  # Invalid token with correct length
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {invalid_token}"}
        )
        assert response.status_code == 401

    def test_exempted_path_bypasses_auth(self, token_manager):
        """Test that exempted paths bypass authentication."""

        async def health_endpoint(request: Request):
            return JSONResponse({"status": "healthy"})

        app = Starlette(routes=[Route("/health", health_endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test health endpoint without auth
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_metadata_endpoint_requires_auth(self, token_manager, valid_token):
        """Test that /metadata endpoint requires authentication."""

        async def metadata_endpoint(request: Request):
            return JSONResponse({"data": {}})

        app = Starlette(routes=[Route("/metadata", metadata_endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test metadata endpoint without auth - should return 401
        response = client.get("/metadata")
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MISSING_TOKEN.value

        # Test metadata endpoint with valid auth - should succeed
        response = client.get(
            "/metadata", headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        assert response.json() == {"data": {}}

    def test_missing_authorization_returns_401(self, token_manager):
        """Test that missing Authorization header returns 401."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test without Authorization header
        response = client.get("/test")
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MISSING_TOKEN.value
        assert "error_description" in data

    def test_invalid_token_returns_401(self, token_manager):
        """Test that invalid token returns 401."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test with invalid token
        invalid_token = "INVALID_TOKEN_" + "x" * 30  # 43 chars but wrong value
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {invalid_token}"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.INVALID_TOKEN.value

    def test_malformed_header_returns_401(self, token_manager, valid_token):
        """Test that malformed Authorization header returns 401."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test with missing "Bearer" prefix
        response = client.get("/test", headers={"Authorization": valid_token})
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MALFORMED_HEADER.value

        # Test with wrong scheme
        response = client.get(
            "/test", headers={"Authorization": f"Basic {valid_token}"}
        )
        assert response.status_code == 401
        data = response.json()
        assert data["error"] == AuthErrorCode.MALFORMED_HEADER.value

    def test_valid_token_allows_request(self, token_manager, valid_token):
        """Test that valid token allows request through."""

        async def endpoint(request: Request):
            return PlainTextResponse("OK")

        app = Starlette(routes=[Route("/test", endpoint)])
        app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)

        client = TestClient(app)

        # Test with valid token
        response = client.get(
            "/test", headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        assert response.text == "OK"
