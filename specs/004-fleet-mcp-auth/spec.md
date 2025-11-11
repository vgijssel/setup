# Feature Specification: Fleet MCP Authentication

**Feature Branch**: `004-fleet-mcp-auth`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "Implement simple authentication for the fleet-mcp FastMCP server. This is necessary because the FastMCP will be exposed to the public internet and will be consumed by OpenAI / Claude MCP. It's required that the authentication implementation matches whatever OpenAI and Claude are expecting."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Public Access (Priority: P1)

External AI systems (OpenAI, Claude) need to securely connect to the fleet-mcp server over the public internet using industry-standard authentication that prevents unauthorized access.

**Why this priority**: This is the core security requirement. Without proper authentication, the server cannot be safely exposed to the internet, making all other features unusable in a public deployment.

**Independent Test**: Can be fully tested by attempting to connect from an MCP client (like Claude Code or OpenAI) with valid credentials and verifying access is granted, while invalid credentials are rejected with proper error responses.

**Acceptance Scenarios**:

1. **Given** an MCP client with valid OAuth 2.1 credentials, **When** the client requests an access token with proper resource indicators, **Then** the server issues a token scoped to the fleet-mcp server
2. **Given** an MCP client with a valid access token, **When** the client makes API requests to fleet-mcp endpoints, **Then** the server validates the token and grants access
3. **Given** an unauthenticated client, **When** the client attempts to access fleet-mcp endpoints, **Then** the server returns HTTP 401 Unauthorized with appropriate error details

---

### User Story 2 - Token Lifecycle Management (Priority: P2)

MCP clients need to manage token lifecycle including token refresh and expiration handling without service interruption.

**Why this priority**: Essential for production use but depends on P1 authentication being in place. Enables long-running sessions without requiring frequent re-authentication.

**Independent Test**: Can be tested by obtaining a token, waiting for it to expire, and verifying that the refresh flow works correctly to obtain a new token without requiring user interaction.

**Acceptance Scenarios**:

1. **Given** a valid access token approaching expiration, **When** the client requests a token refresh, **Then** the server issues a new access token with updated expiration
2. **Given** an expired access token, **When** the client makes API requests, **Then** the server returns HTTP 401 with token_expired error code
3. **Given** a valid refresh token, **When** the client uses it to obtain new access token, **Then** the server validates and issues new token pair

---

### User Story 3 - Audience Validation (Priority: P1)

The server must validate that access tokens were specifically issued for the fleet-mcp server to prevent token misuse across different services.

**Why this priority**: Critical security requirement mandated by MCP specification (RFC 8707). Prevents token mis-redemption attacks where tokens intended for other services could be misused. Must be implemented alongside basic authentication.

**Independent Test**: Can be tested by presenting a valid OAuth token issued for a different resource/audience and verifying the server rejects it with appropriate error.

**Acceptance Scenarios**:

1. **Given** an access token with audience claim matching fleet-mcp server URI, **When** the server validates the token, **Then** the token is accepted
2. **Given** an access token with audience claim for a different service, **When** the server validates the token, **Then** the server returns HTTP 401 with invalid_audience error
3. **Given** an access token without audience claim, **When** the server validates the token, **Then** the server returns HTTP 401 with missing_audience error

---

### User Story 4 - Configuration and Setup (Priority: P2)

System administrators need to configure OAuth settings for the fleet-mcp server including issuer URL, client credentials, and audience validation parameters.

**Why this priority**: Required for deployment but is a one-time setup activity. System can't function without configuration but it's not a runtime user flow.

**Independent Test**: Can be tested by providing configuration through environment variables or config file and verifying the server starts successfully and uses the configured values.

**Acceptance Scenarios**:

1. **Given** OAuth configuration with issuer URL and audience, **When** the server starts, **Then** the server loads configuration and validates required parameters are present
2. **Given** incomplete OAuth configuration, **When** the server starts, **Then** the server fails to start with clear error message indicating missing configuration
3. **Given** configuration updates, **When** the administrator restarts the server, **Then** the server applies new configuration without data loss

---

### Edge Cases

- What happens when the OAuth provider is temporarily unavailable?
  - Server should cache public keys for token validation with appropriate TTL
  - Server should return 503 Service Unavailable if it cannot validate tokens due to provider outage
  - Server should log provider connectivity issues for monitoring

- How does system handle malformed tokens?
  - Server must return HTTP 401 with specific error code (invalid_token)
  - Server must not expose internal error details that could aid attackers
  - Server must log malformed token attempts for security monitoring

- What happens during token validation failures?
  - Server must distinguish between expired, invalid, and missing tokens with appropriate error codes
  - Each error type must return specific error code per OAuth 2.1 specification
  - Rate limiting should apply to failed validation attempts to prevent brute force

- How does system handle concurrent requests with same token?
  - Token validation should be stateless to support horizontal scaling
  - Multiple concurrent requests with same valid token should all succeed
  - Token revocation must be honored across all server instances

- What happens when JWT signing keys are rotated?
  - Server must support multiple valid signing keys simultaneously during rotation
  - Server must refresh public keys from JWKS endpoint periodically
  - Old keys should be cached with TTL to handle clock skew

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement OAuth 2.1 authorization framework as the authentication mechanism
- **FR-002**: System MUST validate access tokens according to OAuth 2.1 Section 5.2 requirements
- **FR-003**: System MUST require resource indicators (RFC 8707) in token validation to verify tokens were issued for this specific fleet-mcp server
- **FR-004**: System MUST validate that access token audience claim matches the fleet-mcp server's canonical URI
- **FR-005**: System MUST return HTTP 401 Unauthorized for requests without valid access token
- **FR-006**: System MUST return HTTP 401 Unauthorized for requests with expired access token, including token_expired error code
- **FR-007**: System MUST return HTTP 401 Unauthorized for requests with access token issued for different audience, including invalid_audience error code
- **FR-008**: System MUST follow OAuth 2.1 Section 5.3 error handling requirements for token validation failures
- **FR-009**: System MUST support Bearer token authentication via Authorization header
- **FR-010**: System MUST allow configuration of OAuth issuer URL, expected audience, and token validation parameters
- **FR-011**: System MUST validate token signature using public keys from OAuth provider's JWKS endpoint
- **FR-012**: System MUST cache OAuth provider's public keys with appropriate TTL for performance
- **FR-013**: System MUST refresh public keys periodically to support key rotation
- **FR-014**: System MUST support token refresh flow for obtaining new access tokens
- **FR-015**: System MUST validate token expiration time (exp claim) and reject expired tokens
- **FR-016**: System MUST log authentication failures including timestamp, error type, and source IP for security monitoring
- **FR-017**: System MUST expose health check endpoint that does not require authentication
- **FR-018**: System MUST gracefully handle OAuth provider unavailability with appropriate error responses and logging

### Key Entities

- **Access Token**: OAuth 2.1 access token (typically JWT) containing claims including subject, audience, issuer, expiration time, and scope. Used to authenticate API requests to fleet-mcp server.

- **Refresh Token**: Long-lived token used to obtain new access tokens when current token expires. Enables long-running sessions without repeated user authentication.

- **OAuth Configuration**: Server configuration containing OAuth issuer URL (authorization server), expected audience URI for this fleet-mcp server, token validation parameters, and public key cache settings.

- **Token Validation Result**: Outcome of token validation process including validation status (valid/invalid/expired), error code if invalid, extracted claims if valid, and validation timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Unauthorized access attempts are rejected with HTTP 401 response in under 100 milliseconds
- **SC-002**: Valid access tokens are validated and accepted in under 50 milliseconds on average
- **SC-003**: Server successfully validates 1000 concurrent authenticated requests without performance degradation
- **SC-004**: Token validation continues to succeed for at least 5 minutes during temporary OAuth provider outage using cached keys
- **SC-005**: 100% of token validation failures are logged with sufficient detail for security analysis
- **SC-006**: MCP clients from both OpenAI and Claude successfully authenticate and access fleet-mcp server using standard OAuth 2.1 flow
- **SC-007**: Server startup fails immediately with clear error message when OAuth configuration is incomplete or invalid
- **SC-008**: Token refresh flow completes in under 2 seconds from client perspective

### Assumptions

- **Assumption 1**: An OAuth 2.1 compliant authorization server (like Keycloak, Auth0, or similar) will be available and configured to issue tokens for the fleet-mcp server
- **Assumption 2**: MCP clients (OpenAI, Claude) will provide resource indicators (RFC 8707) in their token requests as required by MCP specification
- **Assumption 3**: Access tokens will be in JWT format with standard claims (aud, iss, exp, sub, scope)
- **Assumption 4**: OAuth provider's JWKS endpoint will be publicly accessible for signature verification
- **Assumption 5**: The fleet-mcp server will have a stable canonical URI that serves as the audience identifier
- **Assumption 6**: Server will run behind TLS termination (handled by infrastructure) so authentication focuses on token validation
- **Assumption 7**: Rate limiting and DDoS protection will be handled by infrastructure layer (reverse proxy/load balancer)
- **Assumption 8**: Clock skew tolerance of 60 seconds is acceptable for token expiration validation
