"""GitHub CLI client for fetching PR information."""

import json
import subprocess
from typing import Any


def get_pr_info(workspace_dir: str) -> dict[str, Any] | None:
    """
    Fetch PR info using gh CLI.

    Args:
        workspace_dir: Directory containing the git repository

    Returns:
        Dict with PR info or None if no PR found or error occurred
    """
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
