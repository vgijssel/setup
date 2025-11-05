"""GitHub CLI client for fetching PR information."""

import json
import os
import subprocess
from typing import Any


def get_pr_info() -> dict[str, Any] | None:
    """
    Fetch PR info using gh CLI.

    Reads workspace directory from FLEET_MCP_WORKSPACE_DIR environment variable.

    Returns:
        Dict with PR info or None if no PR found or error occurred
    """
    workspace_dir = os.getenv("FLEET_MCP_WORKSPACE_DIR")
    if not workspace_dir:
        return None

    try:
        result = subprocess.run(
            ["gh", "pr", "view", "--json", "url"],
            cwd=workspace_dir,
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            pr_data = json.loads(result.stdout)
            return pr_data
        return None
    except (
        subprocess.TimeoutExpired,
        json.JSONDecodeError,
        FileNotFoundError,
        Exception,
    ):
        # Handle gracefully: gh not available, no git repo, no PR, invalid JSON, etc.
        return None
