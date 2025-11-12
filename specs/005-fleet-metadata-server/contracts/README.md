# API Contracts

This directory contains API contracts for the Fleet Metadata Server.

## Files

- **openapi.yaml**: OpenAPI 3.1 specification for all HTTP endpoints
- **metadata-response.schema.json**: JSON Schema for `/metadata` response validation

## Endpoints

### `GET /metadata`

Returns all workspace metadata collected from git, GitHub, and workspace environment.

**Response**: `200 OK`
```json
{
  "data": {
    "git_branch": {
      "value": "main",
      "schema": {
        "type": "string",
        "description": "Current git branch name",
        "includeInList": true
      }
    },
    "github_pr_number": {
      "value": 810,
      "schema": {
        "type": "number",
        "description": "Pull request number",
        "includeInList": true
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

### `GET /health`

Health check endpoint for monitoring.

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

## Validation

### Contract Tests

Contract tests in `tests/contract/` validate that actual responses match these schemas:

```python
import json
import jsonschema

def test_metadata_response_schema(metadata_response):
    """Validate /metadata response against JSON schema."""
    with open("specs/005-fleet-metadata-server/contracts/metadata-response.schema.json") as f:
        schema = json.load(f)

    # Should not raise ValidationError
    jsonschema.validate(metadata_response, schema)
```

### OpenAPI Validation

OpenAPI spec can be validated using:

```bash
# Install validator
npm install -g @apidevtools/swagger-cli

# Validate schema
swagger-cli validate specs/005-fleet-metadata-server/contracts/openapi.yaml
```

## Usage by Fleet-MCP

Fleet-MCP server consumes this API to query agent metadata:

```python
import httpx

async def get_agent_metadata(workspace_id: str) -> dict:
    """Query metadata from agent's metadata server."""
    url = f"http://{workspace_id}.metadata.fleet.internal/metadata"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=5.0)
        response.raise_for_status()
        return response.json()
```

## Size Limits (FR-015)

- **Keys**: Maximum 256 characters
- **Values**: Maximum 4KB per value (JSON serialized)
- **Total**: Maximum 1MB for entire response (JSON serialized)

Responses exceeding these limits will return `500 Internal Server Error`.

## Versioning

API version is included in `meta.version` field. Breaking changes will increment the major version (e.g., "1.0" → "2.0").

**Current version**: 1.0
