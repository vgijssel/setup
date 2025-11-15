# Fleet MCP Development Guide

## Development Environment

When developing fleet-mcp inside a Coder workspace, the fleet-mcp server runs under `supervisorctl` for process management.

### Using Supervisorctl

**Check service status:**
```bash
supervisorctl status fleet-mcp
```

**View logs:**
```bash
supervisorctl tail -f fleet-mcp
```

**Restart the service:**
```bash
supervisorctl restart fleet-mcp
```

**Stop the service:**
```bash
supervisorctl stop fleet-mcp
```

**Start the service:**
```bash
supervisorctl start fleet-mcp
```

### After Making Code Changes

When you modify the fleet-mcp source code:

1. The service runs with `--reload` flag and should automatically pick up changes
2. If changes don't apply automatically, restart the service:
   ```bash
   supervisorctl restart fleet-mcp
   ```

### Checking Logs

To monitor the fleet-mcp service in real-time:
```bash
supervisorctl tail -f fleet-mcp
```

To see the full log output:
```bash
supervisorctl tail fleet-mcp
```

## Environment Variables

### FLEET_MCP_TASKFILE

Specifies the absolute path to the Taskfile.yml for workspace metadata collection.

**Default**: `./Taskfile.yml` (in current working directory)

**Example**:
```bash
export FLEET_MCP_TASKFILE=/workspaces/setup/Taskfile.yml
```

This environment variable is used by the `/metadata` endpoint to determine which Taskfile to execute for collecting workspace metadata (git branch, PR number, etc.).
