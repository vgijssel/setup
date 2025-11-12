# Research: Fleet MCP Authentication

**Feature**: 004-fleet-mcp-auth
**Date**: 2025-11-11
**Status**: Complete

## Overview

This document captures research findings for implementing header-based authentication in the fleet-mcp FastMCP server. The approach has been simplified from the original OAuth 2.1 specification based on user requirements.

## Key Decisions

### 1. Authentication Approach: Header-Based Bearer Token

**Decision**: Use simple header-based authentication with `Authorization: Bearer <token>` header.

**Rationale**:
- User requirement: "Add header based authentication to the server"
- Matches standard Bearer token pattern used by OpenAI and Claude MCP clients
- FastMCP supports HTTP mode which can validate headers via middleware
- Simple to implement and test
- Adequate security for controlled deployment environment

**Alternatives Considered**:
- **OAuth 2.1 with JWKS** (original spec): Rejected as overly complex for current use case. Requires external auth provider, token refresh flow, and audience validation. User explicitly requested simpler approach.
- **API Key in Query Parameter**: Rejected due to security concerns (logged in URLs, browser history)
- **Basic Authentication**: Rejected because it requires username/password, more complex than single token
- **Custom Header (e.g., X-API-Key)**: Rejected in favor of standard Authorization header for better MCP client compatibility

### 2. Token Generation: Cryptographically Secure Random Bytes

**Decision**: Use `secrets.token_urlsafe(32)` from Python standard library for token generation.

**Rationale**:
- Cryptographically secure random number generator (CSPRNG)
- Produces URL-safe base64-encoded tokens (43 characters)
- 32 bytes = 256 bits of entropy, sufficient for access tokens
- No external dependency required (Python stdlib)
- Fast generation (<1ms)

**Alternatives Considered**:
- **UUID4**: Rejected due to lower entropy (122 bits vs 256 bits)
- **cryptography.Fernet**: Rejected as unnecessarily complex (we don't need encryption, just randomness)
- **hashlib with timestamp**: Rejected as not cryptographically secure (predictable)

**Research Source**: [Python secrets module documentation](https://docs.python.org/3/library/secrets.html)

### 3. Token Storage: File-Based Persistence

**Decision**: Store token in `~/.fleet-mcp/auth_token` file with restricted permissions (0600).

**Rationale**:
- User requirement: "When the server restarts the key should remain the same"
- Simple file-based storage sufficient for single-token use case
- XDG-compliant location (`~/.fleet-mcp/` directory)
- File permissions (0600) ensure only server process owner can read token
- Atomic write operations prevent corruption during server restart
- No database dependency needed

**Alternatives Considered**:
- **Environment Variable**: Rejected because it doesn't persist across restarts (user requirement)
- **SQLite Database**: Rejected as overkill for storing single token value
- **System Keyring (keyring library)**: Rejected as adds complexity and platform dependencies
- **Config File (TOML/YAML)**: Rejected to avoid exposing token in human-editable config

**Token File Structure**:
```
~/.fleet-mcp/
└── auth_token    # Contains single line: the bearer token (0600 permissions)
```

### 4. Middleware Integration: FastMCP Custom HTTP Middleware

**Decision**: Implement authentication as Starlette middleware integrated with FastMCP's HTTP app.

**Rationale**:
- FastMCP uses Starlette/FastAPI underneath for HTTP mode
- Middleware can intercept all requests before they reach MCP tools
- Allows excluding specific paths (e.g., `/health` endpoint)
- Clean separation of concerns (auth logic separate from business logic)
- Standard ASGI middleware pattern

**Research Finding**: FastMCP's `mcp.http_app(stateless_http=True)` returns a Starlette application. We can wrap this with custom middleware using:

```python
from starlette.middleware.base import BaseHTTPMiddleware

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Validate Authorization header
        # Return 401 if invalid, otherwise call_next(request)
```

**Alternatives Considered**:
- **Decorator on Each Tool**: Rejected as requires modifying all 10 tools, not DRY
- **FastAPI Dependency Injection**: Rejected because FastMCP abstracts away FastAPI details
- **Custom Routing Layer**: Rejected as too invasive to FastMCP's internal structure

### 5. Unauthenticated Endpoints: Explicit Allowlist

**Decision**: Exempt `/health` endpoint from authentication via path-based allowlist in middleware.

**Rationale**:
- Health checks must work without auth for load balancers and monitoring
- Existing `/health` endpoint at libs/fleet-mcp/src/fleet_mcp/__main__.py:327
- Simple path matching in middleware: `if request.url.path == "/health": return await call_next(request)`
- Future-proof: Easy to add more unauthenticated paths if needed

**Alternatives Considered**:
- **No Health Check**: Rejected as breaks load balancer health checking
- **Separate Port for Health**: Rejected as adds deployment complexity
- **Different Authentication for Health**: Rejected as unnecessarily complex

### 6. Error Responses: Standard HTTP 401 with JSON

**Decision**: Return HTTP 401 Unauthorized with JSON error body matching OAuth 2.1 error format.

**Rationale**:
- HTTP 401 is standard for authentication failures
- JSON response consistent with FastMCP's existing error handling
- Include `error` and `error_description` fields for clarity
- MCP clients can parse JSON for better error handling

**Error Response Format**:
```json
{
  "error": "invalid_token",
  "error_description": "The access token is invalid or missing"
}
```

**Error Codes**:
- `missing_token`: No Authorization header present
- `invalid_token`: Token doesn't match stored token
- `malformed_header`: Authorization header format is incorrect

**Alternatives Considered**:
- **Plain Text Error**: Rejected for lack of structure
- **HTML Error Page**: Rejected as MCP clients expect JSON
- **Custom Error Format**: Rejected in favor of standard OAuth 2.1 format for familiarity

### 7. Token Rotation: Manual Only (MVP)

**Decision**: No automatic token rotation in MVP. Token regeneration via manual file deletion or CLI command (future).

**Rationale**:
- User didn't request token rotation
- Single-token model simplifies implementation
- Token rotation adds complexity (grace periods, client updates)
- Manual rotation sufficient for MVP: admin can delete file and restart server
- Future enhancement: Add `fleet-mcp rotate-token` CLI command

**Alternatives Considered**:
- **Time-Based Rotation**: Rejected as adds complexity without clear security benefit
- **Rotation API Endpoint**: Rejected for MVP, can add in future version

### 8. Testing Strategy: Unit + Integration Tests

**Decision**: TDD approach with three test layers:
1. **Unit Tests**: `token_manager.py` (generation, file I/O, permissions)
2. **Unit Tests**: `middleware.py` (header parsing, validation logic)
3. **Integration Tests**: End-to-end HTTP requests with real middleware

**Test Cases**:
- Token generation produces valid 256-bit entropy tokens
- Token file created with 0600 permissions
- Token persists across multiple reads
- Token file created in correct directory
- Missing Authorization header returns 401
- Invalid token returns 401
- Valid token allows request through
- Health endpoint bypasses authentication
- Malformed Authorization header returns 401

**Test Tools**: pytest, pytest-asyncio, httpx (for HTTP client testing)

## Dependencies

### New Dependencies

| Package | Version | Purpose | Justification |
|---------|---------|---------|---------------|
| None | - | - | Using Python stdlib `secrets` module |

**Note**: Originally planned to add `cryptography==44.0.0`, but research showed Python's built-in `secrets` module is sufficient and more appropriate for token generation. No external dependencies needed.

### Existing Dependencies (Unchanged)

- fastmcp==2.13.0.2
- pydantic==2.12.3
- httpx==0.28.1
- python-dotenv==1.2.1
- uvicorn==0.34.0

## Security Considerations

### Token Entropy
- 256 bits of entropy sufficient to resist brute force attacks
- URL-safe encoding prevents issues with different transport mechanisms
- CSPRNG ensures unpredictability

### File Permissions
- 0600 permissions (read/write owner only) prevent other users on system from reading token
- Atomic writes prevent corruption
- Directory created with 0700 permissions

### Token Transmission
- Token transmitted via HTTPS (TLS termination handled by infrastructure per spec assumptions)
- Authorization header not logged by default in most web servers
- No token in URL (avoids logging in access logs, browser history)

### Rate Limiting
- Not implemented in MVP (per original spec: "Rate limiting and DDoS protection will be handled by infrastructure layer")
- Can be added in future via middleware if needed

## Performance Considerations

### Token Validation Performance
- String comparison: O(n) where n=43 characters
- No cryptographic operations needed (not JWT)
- Expected <1ms per request
- No external API calls (vs OAuth JWKS fetch)
- Middleware adds minimal overhead to FastMCP request handling

### Startup Performance
- Token generation: <1ms using secrets module
- File I/O: <10ms for read/write operations
- Total startup overhead: <20ms

### Memory Usage
- Single token in memory: ~50 bytes
- Middleware instance: <1KB
- No caching needed (direct string comparison)

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FLEET_MCP_AUTH_ENABLED` | No | `false` | Enable authentication (opt-in for safe migration) |
| `FLEET_MCP_AUTH_TOKEN_FILE` | No | `~/.fleet-mcp/auth_token` | Custom token file location |

**Deployment Strategy**: Authentication is opt-in via `FLEET_MCP_AUTH_ENABLED=true` to allow safe migration. When disabled, server operates without authentication (current behavior). This allows gradual rollout:

1. Deploy new version with auth disabled (default)
2. Verify server functionality
3. Enable auth and distribute token to MCP clients
4. Monitor and confirm client connectivity
5. Future version: Make auth mandatory (remove opt-out)

## Integration with MCP Clients

### OpenAI MCP Client
OpenAI's MCP client supports custom headers via configuration:
```json
{
  "mcpServers": {
    "fleet-mcp": {
      "url": "https://fleet-mcp.example.com",
      "headers": {
        "Authorization": "Bearer <token>"
      }
    }
  }
}
```

### Claude Code MCP Client
Claude Code supports headers via CLI flags:
```bash
claude-code connect fleet-mcp \
  --url https://fleet-mcp.example.com \
  --header "Authorization: Bearer <token>"
```

### Token Distribution
- Server logs token to stdout on first startup
- Admin copies token from logs or directly from file
- Token distributed to MCP client users via secure channel (e.g., 1Password, Vault)
- Token is single-use (same token for all users in MVP)

## Open Questions

None - all technical decisions finalized based on user requirements and research.

## References

1. [Python secrets module](https://docs.python.org/3/library/secrets.html) - Cryptographically secure random number generation
2. [FastMCP Documentation](https://github.com/jlowin/fastmcp) - FastMCP framework and HTTP mode
3. [Starlette Middleware](https://www.starlette.io/middleware/) - ASGI middleware patterns
4. [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) - OAuth 2.0 Bearer Token Usage (error format reference)
5. [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - Security best practices

## Conclusion

The header-based authentication approach provides adequate security for the fleet-mcp server's public internet exposure while maintaining simplicity. Using Python's built-in `secrets` module eliminates external dependencies. File-based token storage satisfies the persistence requirement. Middleware integration keeps auth logic separate from business logic, following clean architecture principles.

All constitutional gates passed. No complex dependencies. Clear testing strategy. Ready for Phase 1 design.
