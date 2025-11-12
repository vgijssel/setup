# Data Model: Fleet MCP Authentication

**Feature**: 004-fleet-mcp-auth
**Date**: 2025-11-11
**Status**: Complete

## Overview

This document defines the data structures and entities for the fleet-mcp authentication system. The model is intentionally simple, focusing on a single persistent access token.

## Core Entities

### 1. AccessToken

**Purpose**: Represents the server's authentication token used to verify MCP client requests.

**Attributes**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `value` | `str` | Yes | The token string | 43 characters, URL-safe base64 |
| `created_at` | `datetime` | Yes | When token was generated | ISO 8601 timestamp |

**Lifecycle**:
- **Creation**: Generated on first server startup using `secrets.token_urlsafe(32)`
- **Storage**: Persisted to `~/.fleet-mcp/auth_token` file
- **Validation**: Loaded from file on each server startup
- **Rotation**: Manual deletion of file triggers regeneration (future: CLI command)

**Validation Rules**:
- Token value MUST be exactly 43 characters (32 bytes base64-encoded)
- Token value MUST contain only URL-safe characters: `[A-Za-z0-9_-]`
- Created timestamp MUST be valid ISO 8601 format
- Token file MUST have 0600 permissions (read/write owner only)

**Pydantic Model** (libs/fleet-mcp/src/fleet_mcp/auth/models.py):
```python
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class AccessToken(BaseModel):
    """Authentication token for MCP server access."""

    value: str = Field(
        ...,
        min_length=43,
        max_length=43,
        description="URL-safe base64-encoded token (256-bit entropy)"
    )
    created_at: datetime = Field(
        ...,
        description="Timestamp when token was generated"
    )

    @field_validator("value")
    @classmethod
    def validate_token_format(cls, v: str) -> str:
        """Ensure token contains only URL-safe base64 characters."""
        import re
        if not re.match(r'^[A-Za-z0-9_-]{43}$', v):
            raise ValueError("Token must be 43 URL-safe base64 characters")
        return v

    class Config:
        frozen = True  # Immutable after creation
```

### 2. AuthRequest

**Purpose**: Represents an incoming HTTP request being authenticated.

**Attributes**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `path` | `str` | Yes | Request path (e.g., "/mcp/list_agents") | Valid URL path |
| `authorization_header` | `str | None` | Value of Authorization header | Format: "Bearer {token}" |
| `is_exempted` | `bool` | Yes | Whether path is exempt from auth | Computed property |

**Lifecycle**:
- **Creation**: Extracted from Starlette Request object in middleware
- **Validation**: Checked against allowlist and token
- **Response**: Returns 401 if invalid, passes request if valid

**Computed Properties**:
- `is_exempted`: Returns `True` if path in `UNAUTHENTICATED_PATHS` (e.g., `/health`)
- `bearer_token`: Extracts token from Authorization header, returns `None` if missing/malformed

**Pydantic Model** (libs/fleet-mcp/src/fleet_mcp/auth/models.py):
```python
from pydantic import BaseModel, Field, computed_field

class AuthRequest(BaseModel):
    """Represents an HTTP request being authenticated."""

    path: str = Field(..., description="URL path of the request")
    authorization_header: str | None = Field(
        None,
        description="Value of Authorization header"
    )

    @computed_field
    @property
    def is_exempted(self) -> bool:
        """Check if this path is exempt from authentication."""
        UNAUTHENTICATED_PATHS = {"/health"}
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
```

### 3. AuthError

**Purpose**: Represents authentication failure with standard error code and description.

**Attributes**:
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `error` | `str` | Yes | Error code | One of: missing_token, invalid_token, malformed_header |
| `error_description` | `str` | Yes | Human-readable error message | Non-empty string |
| `status_code` | `int` | Yes | HTTP status code | Always 401 |

**Error Codes**:
- `missing_token`: No Authorization header present
- `invalid_token`: Token doesn't match stored token
- `malformed_header`: Authorization header not in "Bearer {token}" format

**Pydantic Model** (libs/fleet-mcp/src/fleet_mcp/auth/models.py):
```python
from enum import Enum
from pydantic import BaseModel, Field

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

    class Config:
        use_enum_values = True  # Serialize enum as string value
```

## File Storage Format

### Token File: ~/.fleet-mcp/auth_token

**Format**: JSON with metadata

```json
{
  "value": "rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7",
  "created_at": "2025-11-11T10:30:00Z"
}
```

**File Permissions**: `0600` (read/write owner only)
**Directory Permissions**: `0700` (read/write/execute owner only)

**Rationale for JSON**:
- Extensible for future metadata (e.g., expiration_at, description)
- Easy to parse with Python `json` module
- Human-readable for debugging
- Allows atomic writes with temporary file + rename

**Alternative Considered**:
- Plain text (single line with token): Rejected because it's not extensible for metadata
- TOML/YAML: Rejected as overkill for simple key-value storage

## State Transitions

### Token Lifecycle State Machine

```
┌─────────────┐
│   ABSENT    │ (File doesn't exist)
└──────┬──────┘
       │
       │ Server Start
       │ + Generate Token
       ▼
┌─────────────┐
│  GENERATED  │ (Token created in memory)
└──────┬──────┘
       │
       │ Write to File
       │ + Set Permissions
       ▼
┌─────────────┐
│  PERSISTED  │ (Token stored on disk)
└──────┬──────┘
       │
       │ Server Restart
       │ + Load from File
       ▼
┌─────────────┐
│   LOADED    │ (Token in memory)
└──────┬──────┘
       │
       │ Validate Requests
       │ (Steady State)
       │
       │ Manual File Deletion
       │ + Server Restart
       ▼
┌─────────────┐
│   ABSENT    │ (Cycle repeats)
└─────────────┘
```

**Invariants**:
- Token in memory MUST match token on disk (after initial persistence)
- Token file MUST have 0600 permissions at all times
- Token directory MUST have 0700 permissions at all times
- Only one token exists at any time (no token rotation in MVP)

### Request Authentication Flow

```
Incoming HTTP Request
       │
       ▼
┌──────────────────┐
│ Extract AuthReq  │ (path, authorization_header)
└────────┬─────────┘
         │
         ▼
    ┌────────┐
    │Exempted?│ (is_exempted == True?)
    └───┬────┘
        │
    Yes │         No
        ▼          ▼
  ┌─────────┐  ┌──────────────┐
  │  ALLOW  │  │Extract Bearer│
  │ Request │  │    Token     │
  └─────────┘  └──────┬───────┘
                      │
                      ▼
                 ┌────────┐
                 │ Valid? │ (bearer_token == stored_token?)
                 └───┬────┘
                     │
                 Yes │    No
                     ▼     ▼
               ┌─────────┬──────────┐
               │  ALLOW  │  REJECT  │
               │ Request │ (401)    │
               └─────────┴──────────┘
```

## Relationships

### Entity Relationship Diagram

```
┌─────────────────┐
│  AccessToken    │
│  - value        │
│  - created_at   │
└────────┬────────┘
         │
         │ 1
         │
         │ validated against
         │
         │ *
         ▼
┌─────────────────┐
│  AuthRequest    │
│  - path         │
│  - auth_header  │
│  - bearer_token │
└────────┬────────┘
         │
         │ produces on failure
         │
         │ 0..1
         ▼
┌─────────────────┐
│   AuthError     │
│  - error        │
│  - description  │
└─────────────────┘
```

**Cardinality**:
- 1 AccessToken : Many AuthRequests (token validated against many requests)
- 1 AuthRequest : 0 or 1 AuthError (request either passes or fails once)

## Validation Rules Summary

### Token Generation
- ✅ MUST use `secrets.token_urlsafe(32)` for CSPRNG
- ✅ MUST produce exactly 43 characters
- ✅ MUST contain only `[A-Za-z0-9_-]` characters
- ✅ MUST be unique on each generation

### Token Storage
- ✅ File MUST be created at `~/.fleet-mcp/auth_token`
- ✅ File permissions MUST be 0600
- ✅ Directory permissions MUST be 0700
- ✅ File MUST contain valid JSON with `value` and `created_at`
- ✅ Write operations MUST be atomic (temp file + rename)

### Token Loading
- ✅ File MUST exist and be readable
- ✅ File MUST contain valid JSON
- ✅ Token value MUST pass format validation
- ✅ Created timestamp MUST be valid ISO 8601

### Request Authentication
- ✅ Exempted paths MUST bypass authentication
- ✅ Non-exempted paths MUST have Authorization header
- ✅ Authorization header MUST match "Bearer {token}" format
- ✅ Token MUST match stored token exactly (timing-safe comparison)
- ✅ Failed authentication MUST return 401 with AuthError JSON

## Testing Data

### Valid Token Examples
```python
# Valid tokens (generated by secrets.token_urlsafe(32))
"rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
"aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF6"
"xY9zA0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU0vW1xY2zA3bC4"
```

### Invalid Token Examples
```python
# Too short
"rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH"  # 40 chars

# Too long
"rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7mN9"  # 46 chars

# Invalid characters
"rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1g+/="  # Contains +/=

# Empty
""

# None
null
```

### Authorization Header Examples
```python
# Valid
"Bearer rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"

# Invalid - missing "Bearer" prefix
"rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"

# Invalid - wrong scheme
"Basic rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"

# Invalid - lowercase "bearer"
"bearer rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"  # Should accept case-insensitive

# Invalid - multiple spaces
"Bearer  rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
```

## Migration Strategy

### Phase 1: Deploy with Authentication Disabled (Default)
- Server starts without authentication (current behavior)
- Token file still generated but not enforced
- Allows safe deployment without breaking existing clients

### Phase 2: Enable Authentication (Opt-In)
- Set `FLEET_MCP_AUTH_ENABLED=true` environment variable
- Middleware activates token validation
- Distribute token to MCP client users
- Monitor for authentication failures

### Phase 3: Make Authentication Mandatory (Future)
- Remove `FLEET_MCP_AUTH_ENABLED` flag
- Authentication always enabled
- Update documentation to reflect mandatory auth

**Backward Compatibility**: MVP maintains backward compatibility via opt-in flag. Future versions will remove opt-in and make auth mandatory.

## Conclusion

The data model is intentionally minimal, focusing on a single persistent access token. All entities are immutable after creation (Pydantic `frozen=True`). State transitions are simple and deterministic. Validation rules ensure security and correctness. Ready for implementation in Phase 2 (tasks).
