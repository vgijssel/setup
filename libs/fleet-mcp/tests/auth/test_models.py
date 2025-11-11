"""Tests for authentication models."""

import pytest
from datetime import datetime
from fleet_mcp.auth.models import AccessToken, AuthErrorCode, AuthError, AuthRequest


class TestAccessToken:
    """Tests for AccessToken model."""

    def test_access_token_valid(self):
        """Test creating a valid AccessToken."""
        token = AccessToken(
            value="NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0",
            created_at=datetime(2025, 11, 11, 10, 30, 0)
        )
        assert token.value == "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"
        assert token.created_at == datetime(2025, 11, 11, 10, 30, 0)

    def test_access_token_invalid_length_too_short(self):
        """Test AccessToken rejects tokens that are too short."""
        with pytest.raises(Exception):  # Pydantic raises ValidationError
            AccessToken(
                value="NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6",  # 40 chars
                created_at=datetime(2025, 11, 11, 10, 30, 0)
            )

    def test_access_token_invalid_length_too_long(self):
        """Test AccessToken rejects tokens that are too long."""
        with pytest.raises(Exception):  # Pydantic raises ValidationError
            AccessToken(
                value="NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0EXTRA",  # 48 chars
                created_at=datetime(2025, 11, 11, 10, 30, 0)
            )

    def test_access_token_invalid_characters(self):
        """Test AccessToken rejects tokens with invalid characters."""
        with pytest.raises(ValueError, match="Token must be 43 URL-safe base64 characters"):
            AccessToken(
                value="NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6+/=ABC",  # 43 chars but invalid chars (+/=)
                created_at=datetime(2025, 11, 11, 10, 30, 0)
            )

    def test_access_token_immutable(self):
        """Test AccessToken is immutable after creation."""
        token = AccessToken(
            value="NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0",
            created_at=datetime(2025, 11, 11, 10, 30, 0)
        )
        with pytest.raises(Exception):  # Pydantic raises ValidationError or AttributeError
            token.value = "new_value"


class TestAuthErrorCode:
    """Tests for AuthErrorCode enum."""

    def test_auth_error_code_missing_token(self):
        """Test MISSING_TOKEN error code."""
        assert AuthErrorCode.MISSING_TOKEN == "missing_token"

    def test_auth_error_code_invalid_token(self):
        """Test INVALID_TOKEN error code."""
        assert AuthErrorCode.INVALID_TOKEN == "invalid_token"

    def test_auth_error_code_malformed_header(self):
        """Test MALFORMED_HEADER error code."""
        assert AuthErrorCode.MALFORMED_HEADER == "malformed_header"


class TestAuthError:
    """Tests for AuthError model."""

    def test_auth_error_creation(self):
        """Test creating an AuthError."""
        error = AuthError(
            error=AuthErrorCode.MISSING_TOKEN,
            error_description="The access token is invalid or missing"
        )
        assert error.error == AuthErrorCode.MISSING_TOKEN
        assert error.error_description == "The access token is invalid or missing"
        assert error.status_code == 401

    def test_auth_error_custom_status_code(self):
        """Test AuthError with custom status code."""
        error = AuthError(
            error=AuthErrorCode.INVALID_TOKEN,
            error_description="Invalid token",
            status_code=403
        )
        assert error.status_code == 403

    def test_auth_error_serialization(self):
        """Test AuthError serializes enum as string."""
        error = AuthError(
            error=AuthErrorCode.MISSING_TOKEN,
            error_description="Token missing"
        )
        data = error.model_dump()
        assert data["error"] == "missing_token"  # String, not enum object


class TestAuthRequest:
    """Tests for AuthRequest model."""

    def test_auth_request_exempted_path(self):
        """Test AuthRequest recognizes exempted paths."""
        request = AuthRequest(path="/health", authorization_header=None)
        assert request.is_exempted is True

    def test_auth_request_non_exempted_path(self):
        """Test AuthRequest recognizes non-exempted paths."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="Bearer token123"
        )
        assert request.is_exempted is False

    def test_auth_request_extract_bearer_token(self):
        """Test AuthRequest extracts bearer token from header."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="Bearer NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"
        )
        assert request.bearer_token == "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"

    def test_auth_request_bearer_token_case_insensitive(self):
        """Test AuthRequest handles case-insensitive 'Bearer' keyword."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="bearer token123"
        )
        assert request.bearer_token == "token123"

    def test_auth_request_missing_header(self):
        """Test AuthRequest handles missing Authorization header."""
        request = AuthRequest(path="/mcp/list_agents", authorization_header=None)
        assert request.bearer_token is None

    def test_auth_request_malformed_header_no_bearer(self):
        """Test AuthRequest handles malformed header without 'Bearer' prefix."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="token123"
        )
        assert request.bearer_token is None

    def test_auth_request_malformed_header_wrong_scheme(self):
        """Test AuthRequest handles wrong authentication scheme."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="Basic dXNlcjpwYXNz"
        )
        assert request.bearer_token is None

    def test_auth_request_empty_token(self):
        """Test AuthRequest handles empty token after 'Bearer'."""
        request = AuthRequest(
            path="/mcp/list_agents",
            authorization_header="Bearer "
        )
        assert request.bearer_token == ""
