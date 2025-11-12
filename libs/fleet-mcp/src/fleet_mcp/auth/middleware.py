"""FastMCP authentication middleware.

This module provides authentication middleware for the FastMCP server.
It validates Bearer tokens in the Authorization header and rejects
unauthorized requests with HTTP 401.
"""

import secrets
from typing import Callable

from fleet_mcp.auth.models import AuthError, AuthErrorCode, AuthRequest
from fleet_mcp.auth.token_manager import TokenManager
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware for FastMCP HTTP requests.

    Validates Bearer tokens in the Authorization header. Exempts specific
    paths (e.g., /health) from authentication.

    Args:
        app: ASGI application to wrap
        token_manager: TokenManager instance for token validation
        enabled: Whether authentication is enabled (default: True)
    """

    def __init__(self, app, token_manager: TokenManager, enabled: bool = True):
        """Initialize the authentication middleware.

        Args:
            app: ASGI application to wrap
            token_manager: TokenManager instance for token validation
            enabled: Whether authentication is enabled (default: True)
        """
        super().__init__(app)
        self.token_manager = token_manager
        self.enabled = enabled

    def _create_auth_request(self, request: Request) -> AuthRequest:
        """Create an AuthRequest from a Starlette Request.

        Args:
            request: Incoming HTTP request

        Returns:
            AuthRequest with path and authorization header
        """
        authorization_header = request.headers.get("Authorization")
        return AuthRequest(
            path=request.url.path,
            authorization_header=authorization_header,
        )

    def _validate_token(self, bearer_token: str | None) -> bool:
        """Validate bearer token against stored token.

        Uses timing-safe comparison to prevent timing attacks.

        Args:
            bearer_token: Token from Authorization header

        Returns:
            True if token is valid, False otherwise
        """
        if bearer_token is None:
            return False

        # Get the stored token
        stored_token = self.token_manager.get_or_create_token()

        # Timing-safe comparison
        return secrets.compare_digest(bearer_token, stored_token.value)

    def _create_error_response(
        self, error_code: AuthErrorCode, description: str
    ) -> JSONResponse:
        """Create a JSON error response.

        Args:
            error_code: AuthErrorCode enum value
            description: Human-readable error description

        Returns:
            JSONResponse with 401 status code
        """
        auth_error = AuthError(
            error=error_code,
            error_description=description,
        )
        return JSONResponse(
            status_code=401,
            content=auth_error.model_dump(),
        )

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request and validate authentication.

        Args:
            request: Incoming HTTP request
            call_next: Next middleware/endpoint in chain

        Returns:
            Response from next middleware/endpoint or 401 error
        """
        # If authentication is disabled, pass through
        if not self.enabled:
            return await call_next(request)

        # Create auth request
        auth_request = self._create_auth_request(request)

        # Check if path is exempted from authentication
        if auth_request.is_exempted:
            return await call_next(request)

        # Check if Authorization header is present
        if auth_request.authorization_header is None:
            return self._create_error_response(
                AuthErrorCode.MISSING_TOKEN,
                "The access token is invalid or missing",
            )

        # Extract bearer token
        bearer_token = auth_request.bearer_token

        # Check if bearer token was successfully extracted
        if bearer_token is None:
            return self._create_error_response(
                AuthErrorCode.MALFORMED_HEADER,
                "The Authorization header format is invalid",
            )

        # Validate token
        if not self._validate_token(bearer_token):
            return self._create_error_response(
                AuthErrorCode.INVALID_TOKEN,
                "The access token is invalid or missing",
            )

        # Token is valid, proceed with request
        return await call_next(request)
