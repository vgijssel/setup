# Coder MCP Server

Model Context Protocol (MCP) server for managing AI agent fleets running on Coder workspaces.

## Features

- **Fleet Visibility**: List all agents with status, capabilities, and metrics
- **Agent Details**: Query individual agent information and execution logs
- **Task Assignment**: Create and assign tasks to agents with validation
- **Agent Control**: Delete workspaces and send input to running agents
- **Fleet Metrics**: Aggregate statistics on utilization, health, and performance

## Installation

### Prerequisites

- Python 3.12+
- uv package manager: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Access to Coder instance with experimental AI tasks API
- Coder session token stored in 1Password

### Setup

```bash
# Navigate to project directory
cd libs/coder-mcp

# Install dependencies
uv sync

# Generate credentials
nx secrets coder-mcp
```

## Usage

### Running the Server

```bash
# Via uv
uv run python -m coder_mcp.server

# Via Nx
nx serve coder-mcp
```

### MCP Tools

The server exposes the following tools:

1. **list_all_agents**: List all agents in the fleet
   - Filters: status, user
   - Returns: List of Agent objects

2. **get_fleet_status_metrics**: Get aggregate fleet statistics
   - Returns: FleetStatus with utilization and health metrics

3. **get_agent_details_by_id**: Get detailed agent information
   - Params: user, agent_id
   - Returns: Agent object with full details

4. **get_agent_execution_logs**: Retrieve agent logs
   - Params: user, agent_id, level (optional), limit (optional)
   - Returns: List of LogEntry objects

5. **create_new_agent_task**: Create and assign task to agent
   - Params: user, prompt, workspace_name, template_name (optional), rich_parameters (optional)
   - Returns: Created task data

6. **delete_agent_workspace**: Delete workspace (cancels all tasks)
   - Params: workspace_id
   - Returns: Deletion confirmation

7. **send_input_to_agent**: Send input to running agent
   - Params: user, agent_id, input_text
   - Returns: Send confirmation

## Development

### Running Tests

```bash
# All tests
uv run pytest

# Specific test suites
uv run pytest tests/unit/
uv run pytest tests/integration/
uv run pytest tests/contract/

# With coverage
uv run pytest --cov=src/coder_mcp --cov-report=html
```

### Code Quality

```bash
# Format code
trunk fmt

# Run linters
trunk check

# Type checking
uv run mypy src/coder_mcp
```

### VCR Cassettes

Integration tests use VCR.py to record HTTP interactions:

```bash
# Record new cassettes (requires real Coder API access)
uv run pytest tests/integration/ --vcr-record=new_episodes

# Re-record all cassettes
uv run pytest tests/integration/ --vcr-record=rewrite
```

## Configuration

Environment variables (loaded from `.env`):

- `CODER_SESSION_TOKEN`: Coder API authentication token
- `CODER_URL`: Coder instance URL (default: https://macbook-pro-van-maarten.tail2c33e2.ts.net)

Generate `.env` file:

```bash
nx secrets coder-mcp
```

## Architecture

**Stateless Design**: All agent state queried from Coder API on-demand. No persistent storage.

**Error Handling**: Layered approach with specific error codes:
- `AGENT_NOT_FOUND`: Agent/workspace does not exist
- `AUTHENTICATION_FAILED`: Invalid session token
- `NETWORK_ERROR`: HTTP communication failure
- `VALIDATION_ERROR`: Invalid input parameters
- `CODER_API_ERROR`: Coder API returned error

**Technology Stack**:
- FastMCP: MCP server framework
- httpx: Async HTTP client
- Pydantic: Data validation
- VCR.py: HTTP interaction recording for tests
- uv: Fast Python package management

## Deployment

### Local Development

```bash
uv run python -m coder_mcp.server
```

### Systemd Service

```ini
[Unit]
Description=Coder MCP Server
After=network.target

[Service]
Type=simple
User=coder
WorkingDirectory=/path/to/libs/coder-mcp
Environment="PATH=/home/coder/.local/bin:/usr/bin"
ExecStart=/home/coder/.local/bin/uv run python -m coder_mcp.server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Container

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install uv && uv sync
CMD ["uv", "run", "python", "-m", "coder_mcp.server"]
```

## Troubleshooting

### Authentication Errors

```bash
# Regenerate token
nx secrets coder-mcp

# Verify token
source .env
curl -H "Coder-Session-Token: $CODER_SESSION_TOKEN" \
  $CODER_URL/api/v2/users/me
```

### VCR Cassette Mismatches

```bash
# Delete and re-record
rm tests/fixtures/cassettes/test_name.yaml
uv run pytest tests/integration/test_name.py
```

### Import Errors

```bash
# Sync dependencies
uv sync

# Verify installation
uv run python -c "import coder_mcp; print(coder_mcp.__file__)"
```

## Contributing

1. Write tests first (TDD approach)
2. Run tests: `uv run pytest`
3. Format code: `trunk fmt`
4. Check linters: `trunk check`
5. Update VCR cassettes if API changes

## License

See monorepo root LICENSE file.

## Support

For issues or questions:
- Check existing tests for examples
- Review design documents in `specs/001-agent-fleet-interface/`
- Open issue in monorepo with `[coder-mcp]` prefix
