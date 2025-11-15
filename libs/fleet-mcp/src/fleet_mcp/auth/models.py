"""Authentication data models."""

import re
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, computed_field, field_validator


class AccessToken(BaseModel):
    """Authentication token for MCP server access."""

    value: str = Field(
        ...,
        min_length=43,
        max_length=43,
        description="URL-safe base64-encoded token (256-bit entropy)",
    )
    created_at: datetime = Field(..., description="Timestamp when token was generated")

    @field_validator("value")
    @classmethod
    def validate_token_format(cls, v: str) -> str:
        """Ensure token contains only URL-safe base64 characters."""
        if not re.match(r"^[A-Za-z0-9_-]{43}$", v):
            raise ValueError("Token must be 43 URL-safe base64 characters")
        return v

    model_config = {
        "frozen": True,  # Immutable after creation
    }


class AuthErrorCode(str, Enum):
    """Standard OAuth 2.1-style error codes for authentication failures."""

    MISSING_TOKEN = "missing_token"
    INVALID_TOKEN = "invalid_token"
    MALFORMED_HEADER = "malformed_header"


class AuthError(BaseModel):
    """Authentication error response following OAuth 2.1 format."""

    error: AuthErrorCode = Field(..., description="Error code")
    error_description: str = Field(..., description="Human-readable error message")
    status_code: int = Field(default=401, description="HTTP status code")

    model_config = {
        "use_enum_values": True,  # Serialize enum as string value
    }


class AuthRequest(BaseModel):
    """Represents an HTTP request being authenticated."""

    path: str = Field(..., description="URL path of the request")
    authorization_header: str | None = Field(
        None, description="Value of Authorization header"
    )

    @computed_field
    @property
    def is_exempted(self) -> bool:
        """Check if this path is exempt from authentication."""
        UNAUTHENTICATED_PATHS = {"/health", "/metadata"}
        return self.path in UNAUTHENTICATED_PATHS

    @computed_field
    @property
    def bearer_token(self) -> str | None:
        """Extract bearer token from Authorization header."""
        if not self.authorization_header:
            return None

        parts = self.authorization_header.split(" ", 1)
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None

        return parts[1]
