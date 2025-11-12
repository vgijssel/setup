"""Authentication module for Fleet MCP server.

This module provides header-based Bearer token authentication for the FastMCP server.

Components:
    - TokenManager: Manages token generation, persistence, and loading
    - AuthMiddleware: Starlette middleware for request authentication
    - AccessToken: Pydantic model for access tokens
    - AuthRequest: Pydantic model for authentication requests
    - AuthError: Pydantic model for authentication errors
    - AuthErrorCode: Enum for authentication error codes
"""

from .middleware import AuthMiddleware
from .models import AccessToken, AuthError, AuthErrorCode, AuthRequest
from .token_manager import TokenManager

__all__ = [
    "TokenManager",
    "AuthMiddleware",
    "AccessToken",
    "AuthRequest",
    "AuthError",
    "AuthErrorCode",
]
