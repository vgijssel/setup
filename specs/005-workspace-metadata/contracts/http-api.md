# HTTP API Contract: Workspace Metadata Endpoint

**Version**: 1.0
**Base URL**: `http://fleet-mcp-server:8000`
**Content-Type**: `application/json`

## Endpoints

### GET /metadata

Retrieve workspace metadata from the current agent's workspace by executing Taskfile commands defined in the `meta` key.

**IMPORTANT**: This endpoint does NOT require a `?workspace=` query parameter. The workspace context is automatically determined from the request context (e.g., which agent workspace the MCP server is running in, or from authentication headers).

#### Query Parameters

None. Workspace context is implicit.

#### Request Example

```http
GET /metadata HTTP/1.1
Host: fleet-mcp-server:8000
Accept: application/json
```

#### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "data": {
    "<field_name>": {
      "value": "<any JSON value or null>",
      "error": "<string or null>",
      "schema": {
        "description": "<string>",
        "include_in_list": "<boolean>"
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

**Field Descriptions**:
- `data`: Map of metadata field names to MetadataField objects
- `data.<field_name>.value`: Actual value from command execution (null if failed)
- `data.<field_name>.error`: Error message if command failed (null on success)
- `data.<field_name>.schema.description`: Human-readable field description from Taskfile `meta` key
- `data.<field_name>.schema.include_in_list`: Whether field should appear in list views (from Taskfile `meta` key)
- `meta.version`: Metadata schema version (currently "1.0")

**Example**:
```json
{
  "data": {
    "pull_request_number": {
      "value": 819,
      "error": null,
      "schema": {
        "description": "The number of the current pull request on GitHub",
        "include_in_list": true
      }
    },
    "pull_request_state": {
      "value": "OPEN",
      "error": null,
      "schema": {
        "description": "The state of the current pull request on GitHub",
        "include_in_list": false
      }
    },
    "git_branch": {
      "value": "005-workspace-metadata",
      "error": null,
      "schema": {
        "description": "The name of the current git branch",
        "include_in_list": false
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

#### Error Responses

##### 404 Not Found
**Condition**: Workspace context could not be determined

```json
{
  "error": "Workspace context not found"
}
```

##### 500 Internal Server Error
**Condition**: Unexpected server error

```json
{
  "error": "Internal server error: <error message>"
}
```

#### Special Cases

##### Empty Metadata
**Condition**: Taskfile.yml missing or contains no tasks

```json
{
  "data": {},
  "meta": {
    "version": "1.0"
  }
}
```

##### Partial Metadata
**Condition**: Some commands succeeded, some failed

```json
{
  "data": {
    "successful_field": {
      "value": "some-value",
      "error": null,
      "schema": {
        "description": "This command succeeded",
        "include_in_list": true
      }
    },
    "failed_field": {
      "value": null,
      "error": "Command 'gh pr view' failed: not found",
      "schema": {
        "description": "This command failed",
        "include_in_list": false
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

---

## Performance Characteristics

- **Timeout**: 10 seconds maximum per request
- **Task Timeout**: 5 seconds per individual Taskfile task
- **Concurrency**: Metadata collection executes tasks in parallel
- **Caching**: None (metadata collected fresh on each request)

---

## Security

- **Authentication**: Inherits fleet-mcp server authentication (Bearer token if enabled)
- **Authorization**: Requires permissions to list workspaces in Coder
- **Rate Limiting**: None currently implemented

---

## Versioning

The `meta.version` field tracks the metadata schema version:

| Version | Description |
|---------|-------------|
| 1.0 | Initial implementation with value+schema structure |

Future versions may add additional fields to `meta` or change the structure of `data`.
