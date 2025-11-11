# Quick Start: Fleet MCP Authentication

**Feature**: 004-fleet-mcp-auth
**Date**: 2025-11-11

## Overview

This guide shows how to enable and use header-based authentication with the fleet-mcp FastMCP server.

## For Server Administrators

### 1. Enable Authentication

Set the environment variable to enable authentication:

```bash
export FLEET_MCP_AUTH_ENABLED=true
```

Or add to your `.env` file:

```env
FLEET_MCP_AUTH_ENABLED=true
```

### 2. Start the Server

```bash
cd libs/fleet-mcp
python -m fleet_mcp
```

On first startup with authentication enabled, the server will:
1. Generate a secure access token
2. Store it in `~/.fleet-mcp/auth_token`
3. Log the token to stdout for distribution

**Example Output**:
```
2025-11-11 10:30:00 - fleet-mcp - INFO - Authentication enabled
2025-11-11 10:30:00 - fleet-mcp - INFO - Generated new access token
2025-11-11 10:30:00 - fleet-mcp - INFO - Token: rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7
2025-11-11 10:30:00 - fleet-mcp - INFO - Token saved to: /home/user/.fleet-mcp/auth_token
2025-11-11 10:30:00 - fleet-mcp - INFO - Server started on http://0.0.0.0:8000
```

### 3. Retrieve the Access Token

**Option A**: From server logs (shown on first startup)

**Option B**: Read from file
```bash
cat ~/.fleet-mcp/auth_token
```

Output (JSON format):
```json
{
  "value": "rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7",
  "created_at": "2025-11-11T10:30:00Z"
}
```

**Option C**: Using jq to extract just the token value
```bash
cat ~/.fleet-mcp/auth_token | jq -r '.value'
```

Output:
```
rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7
```

### 4. Distribute Token to Users

**Security Best Practices**:
- ✅ Share token via secure channel (1Password, Vault, encrypted message)
- ✅ Avoid email, Slack, or other unencrypted channels
- ✅ Token is single-use (same for all users in MVP)
- ⚠️ Anyone with the token can access the server

**Example**: Share via 1Password
```bash
# Store token in 1Password
op item create --category="API Credential" \
  --title="Fleet MCP Access Token" \
  --vault="Engineering" \
  token=$(cat ~/.fleet-mcp/auth_token | jq -r '.value')
```

### 5. Rotate Token (Manual)

To generate a new token:

1. Stop the server
2. Delete the token file
3. Restart the server

```bash
# Stop server (Ctrl+C or systemctl stop fleet-mcp)

# Delete token file
rm ~/.fleet-mcp/auth_token

# Start server (generates new token)
python -m fleet_mcp
```

**Note**: This invalidates all existing client connections. Distribute new token to all users.

## For MCP Client Users

### Claude Code

Configure Claude Code to use authentication:

```bash
# Via config file (~/.config/claude-code/mcp-servers.json)
{
  "fleet-mcp": {
    "url": "https://fleet-mcp.example.com",
    "headers": {
      "Authorization": "Bearer rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
    }
  }
}
```

Or via CLI flag:

```bash
claude-code connect fleet-mcp \
  --url https://fleet-mcp.example.com \
  --header "Authorization: Bearer rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
```

### OpenAI MCP Client

Configure in your OpenAI client settings:

```json
{
  "mcpServers": {
    "fleet-mcp": {
      "url": "https://fleet-mcp.example.com",
      "headers": {
        "Authorization": "Bearer rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
      }
    }
  }
}
```

### curl (Testing)

```bash
TOKEN="rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"

# List agents
curl https://fleet-mcp.example.com/mcp/list_agents \
  -H "Authorization: Bearer $TOKEN"

# Health check (no auth required)
curl https://fleet-mcp.example.com/health
```

## Troubleshooting

### Error: 401 Unauthorized

**Problem**: Request rejected with HTTP 401.

**Possible Causes**:

1. **Missing Authorization Header**
   ```json
   {
     "error": "missing_token",
     "error_description": "The access token is invalid or missing"
   }
   ```
   **Solution**: Add `Authorization: Bearer <token>` header to your request.

2. **Invalid Token**
   ```json
   {
     "error": "invalid_token",
     "error_description": "The access token is invalid or missing"
   }
   ```
   **Solution**: Verify you're using the correct token from `~/.fleet-mcp/auth_token`.

3. **Malformed Header**
   ```json
   {
     "error": "malformed_header",
     "error_description": "The access token is invalid or missing"
   }
   ```
   **Solution**: Ensure header format is exactly `Authorization: Bearer <token>` (case-sensitive for "Bearer").

### Health Check Failing

**Problem**: Health check endpoint returns 401.

**Diagnosis**: This should never happen - health check is exempt from authentication.

**Solution**: Check middleware configuration. File a bug report.

### Token File Not Found

**Problem**: Server fails to start with "Token file not found".

**Solution**: This is expected on first startup. Server will create the file automatically. Ensure server has write permissions to `~/.fleet-mcp/` directory.

### Permission Denied

**Problem**: Cannot read token file.

**Solution**: Check file permissions:
```bash
ls -la ~/.fleet-mcp/auth_token
# Should show: -rw------- (0600)

# Fix permissions if needed
chmod 600 ~/.fleet-mcp/auth_token
```

### Token Regenerates on Every Restart

**Problem**: New token generated each time server starts.

**Diagnosis**: Token file is not being persisted or is being deleted.

**Solution**:
1. Check file exists after server starts: `ls ~/.fleet-mcp/auth_token`
2. Check file permissions (should be 0600)
3. Check disk space: `df -h ~`
4. Check server logs for write errors

## Configuration Reference

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLEET_MCP_AUTH_ENABLED` | `false` | Enable authentication (opt-in) |
| `FLEET_MCP_AUTH_TOKEN_FILE` | `~/.fleet-mcp/auth_token` | Custom token file location |

### Token File Location

**Default**: `~/.fleet-mcp/auth_token`

**Custom Location**:
```bash
export FLEET_MCP_AUTH_TOKEN_FILE=/custom/path/token.json
python -m fleet_mcp
```

**File Format**: JSON
```json
{
  "value": "<43-character-token>",
  "created_at": "2025-11-11T10:30:00Z"
}
```

**Permissions**:
- File: `0600` (read/write owner only)
- Directory: `0700` (read/write/execute owner only)

## Security Best Practices

### Token Management

✅ **DO**:
- Store token file with 0600 permissions
- Distribute token via secure channels (1Password, Vault)
- Rotate token periodically (manual in MVP)
- Use HTTPS for all connections (TLS termination in infrastructure)
- Monitor authentication failures in server logs

❌ **DON'T**:
- Share token in plaintext via email, Slack, or chat
- Commit token to git repositories
- Store token in world-readable files
- Reuse tokens across different environments (dev/staging/prod)
- Log token values in application logs

### Deployment

✅ **DO**:
- Start with authentication disabled for safe migration
- Test with authentication enabled in non-production environment
- Distribute token before enabling auth in production
- Monitor for 401 errors after enabling auth
- Have rollback plan (disable auth via environment variable)

❌ **DON'T**:
- Enable auth in production without testing
- Distribute token after enabling auth (clients will fail)
- Assume all clients will update token immediately

## Migration Path

### Step 1: Deploy with Auth Disabled (Safe)

```bash
# .env file
FLEET_MCP_AUTH_ENABLED=false  # or omit (default)

# Deploy new version
# No client impact - server works as before
```

### Step 2: Generate and Distribute Token

```bash
# Enable auth
export FLEET_MCP_AUTH_ENABLED=true

# Start server (generates token)
python -m fleet_mcp

# Distribute token to all MCP client users
# Give users time to configure their clients (1 week recommended)
```

### Step 3: Enable Authentication

```bash
# After all users have configured clients:
# Auth is already enabled from Step 2

# Monitor for 401 errors
tail -f /var/log/fleet-mcp/access.log | grep 401

# Assist users who haven't configured auth yet
```

### Step 4: Make Authentication Mandatory (Future)

In future version:
- Remove `FLEET_MCP_AUTH_ENABLED` flag
- Authentication always enabled
- Update documentation

## Testing Authentication

### Test Script

```bash
#!/bin/bash
# test_auth.sh

TOKEN="rQ3vK9pL2mN4oP6qR8sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7"
BASE_URL="https://fleet-mcp.example.com"

# Test 1: Health check (no auth required)
echo "Test 1: Health check"
curl -s "$BASE_URL/health" | jq .

# Test 2: List agents (no auth - should fail)
echo "Test 2: List agents without auth"
curl -s "$BASE_URL/mcp/list_agents" | jq .
# Expected: {"error": "missing_token", ...}

# Test 3: List agents (with auth - should succeed)
echo "Test 3: List agents with auth"
curl -s "$BASE_URL/mcp/list_agents" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test 4: Invalid token (should fail)
echo "Test 4: Invalid token"
curl -s "$BASE_URL/mcp/list_agents" \
  -H "Authorization: Bearer INVALID_TOKEN" | jq .
# Expected: {"error": "invalid_token", ...}
```

Run tests:
```bash
chmod +x test_auth.sh
./test_auth.sh
```

## Next Steps

1. **For Admins**: Follow deployment guide above
2. **For Users**: Configure your MCP client with the provided token
3. **For Developers**: See [plan.md](plan.md) for implementation details
4. **For Testing**: See [data-model.md](data-model.md) for test cases

## FAQ

**Q: Can I have multiple tokens for different users?**
A: Not in MVP. Single token shared among all users. Multi-token support is a future enhancement.

**Q: How do I revoke access for a specific user?**
A: In MVP, rotate the token (invalidates all users) and redistribute to authorized users only. Future enhancement: user-specific tokens.

**Q: Does token expire?**
A: No automatic expiration in MVP. Manual rotation recommended. Future enhancement: configurable expiration.

**Q: Can I disable authentication after enabling it?**
A: Yes, set `FLEET_MCP_AUTH_ENABLED=false` and restart server. Token file remains but is not enforced.

**Q: What happens if I delete the token file while server is running?**
A: Server continues using in-memory token until restart. On next restart, new token is generated.

**Q: Is the token encrypted on disk?**
A: No, token is stored in plaintext with 0600 permissions. Encryption at rest is handled by filesystem (e.g., LUKS, FileVault). Future enhancement: encrypted storage.

**Q: Can I use the same token across multiple fleet-mcp instances?**
A: Not recommended. Each instance generates its own token. For multi-instance deployments, use load balancer with sticky sessions or shared token storage (future enhancement).
