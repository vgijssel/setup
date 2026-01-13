#!/usr/bin/env python3
r"""Standalone CLI script for updating Coder workspaces to new template versions.

This script provides a command-line interface for the two-step workspace update workflow
required by Coder's REST API. It can be used independently of the fleet-mcp server.

Usage:
    # Update workspace to specific template version
    python update_workspace.py --workspace-id abc-123 --template-version-id def-456

    # Update workspace by name to latest active version
    python update_workspace.py --workspace-name my-workspace

    # Update with custom timeout settings
    python update_workspace.py --workspace-id abc-123 --template-version-id def-456 \\
        --stop-timeout 120 --start-timeout 240

Environment Variables:
    CODER_URL: Base URL for Coder API (required)
    CODER_SESSION_TOKEN: Authentication token (required)

Example:
    export CODER_URL="https://coder.example.com"
    export CODER_SESSION_TOKEN="your-token-here"
    python update_workspace.py --workspace-name my-agent
"""

import argparse
import asyncio
import logging
import os
import sys
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


async def update_workspace(
    workspace_id: str,
    template_version_id: Optional[str] = None,
    stop_timeout: int = 60,
    start_timeout: int = 120,
    coder_url: Optional[str] = None,
    token: Optional[str] = None,
) -> dict:
    """Update a workspace to a new template version.

    Args:
        workspace_id: Workspace UUID
        template_version_id: Template version UUID (if None, uses active version)
        stop_timeout: Maximum seconds to wait for stop completion
        start_timeout: Maximum seconds to wait for start completion
        coder_url: Coder API base URL (defaults to CODER_URL env var)
        token: Coder session token (defaults to CODER_SESSION_TOKEN env var)

    Returns:
        Updated workspace data

    Raises:
        ValueError: If required credentials are missing
        Exception: If workspace update fails
    """
    # Import CoderClient here to avoid circular imports
    from fleet_mcp.clients import CoderClient

    # Validate credentials
    coder_url = coder_url or os.getenv("CODER_URL")
    token = token or os.getenv("CODER_SESSION_TOKEN")

    if not coder_url or not token:
        raise ValueError(
            "CODER_URL and CODER_SESSION_TOKEN must be set via environment variables or parameters"
        )

    logger.info(f"Connecting to Coder API at {coder_url}")

    async with CoderClient(base_url=coder_url, token=token) as client:
        # If no template_version_id provided, get the active version
        if template_version_id is None:
            logger.info(
                f"No template version specified, fetching active version for workspace {workspace_id}"
            )
            workspace = await client.get_workspace(workspace_id)
            template_id = workspace.get("template_id")

            if not template_id:
                raise ValueError(
                    f"Workspace {workspace_id} has no template_id in workspace data"
                )

            template = await client.get_template(template_id)
            template_version_id = template.get("active_version_id")

            if not template_version_id:
                raise ValueError(
                    f"Template {template_id} has no active version available"
                )

            logger.info(f"Using active template version: {template_version_id}")

        # Perform the update
        logger.info(
            f"Updating workspace {workspace_id} to template version {template_version_id}"
        )
        logger.info(
            f"Timeouts: stop={stop_timeout}s, start={start_timeout}s (1s poll interval)"
        )

        workspace = await client.update_workspace(
            workspace_id=workspace_id,
            template_version_id=template_version_id,
            max_stop_attempts=stop_timeout,
            max_start_attempts=start_timeout,
        )

        logger.info(f"Successfully updated workspace {workspace_id}")
        return workspace


async def update_workspace_by_name(
    workspace_name: str,
    template_version_id: Optional[str] = None,
    stop_timeout: int = 60,
    start_timeout: int = 120,
    coder_url: Optional[str] = None,
    token: Optional[str] = None,
) -> dict:
    """Update a workspace by name to a new template version.

    Args:
        workspace_name: Workspace name
        template_version_id: Template version UUID (if None, uses active version)
        stop_timeout: Maximum seconds to wait for stop completion
        start_timeout: Maximum seconds to wait for start completion
        coder_url: Coder API base URL (defaults to CODER_URL env var)
        token: Coder session token (defaults to CODER_SESSION_TOKEN env var)

    Returns:
        Updated workspace data

    Raises:
        ValueError: If required credentials are missing or workspace not found
        Exception: If workspace update fails
    """
    # Import CoderClient here to avoid circular imports
    from fleet_mcp.clients import CoderClient

    # Validate credentials
    coder_url = coder_url or os.getenv("CODER_URL")
    token = token or os.getenv("CODER_SESSION_TOKEN")

    if not coder_url or not token:
        raise ValueError(
            "CODER_URL and CODER_SESSION_TOKEN must be set via environment variables or parameters"
        )

    logger.info(f"Looking up workspace by name: {workspace_name}")

    async with CoderClient(base_url=coder_url, token=token) as client:
        # Find workspace by name
        workspaces = await client.list_workspaces(owner="me")
        workspace = None
        for ws in workspaces:
            if ws.get("name", "").lower() == workspace_name.lower():
                workspace = ws
                break

        if not workspace:
            raise ValueError(f"Workspace '{workspace_name}' not found")

        workspace_id = workspace.get("id")
        logger.info(f"Found workspace {workspace_name} with ID: {workspace_id}")

        # Delegate to update_workspace
        return await update_workspace(
            workspace_id=workspace_id,
            template_version_id=template_version_id,
            stop_timeout=stop_timeout,
            start_timeout=start_timeout,
            coder_url=coder_url,
            token=token,
        )


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Update a Coder workspace to a new template version",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    # Workspace identification (mutually exclusive)
    id_group = parser.add_mutually_exclusive_group(required=True)
    id_group.add_argument(
        "--workspace-id",
        help="Workspace UUID to update",
    )
    id_group.add_argument(
        "--workspace-name",
        help="Workspace name to update (case-insensitive)",
    )

    # Template version
    parser.add_argument(
        "--template-version-id",
        help="Template version UUID to update to (if not specified, uses active version)",
    )

    # Timeout settings
    parser.add_argument(
        "--stop-timeout",
        type=int,
        default=60,
        help="Maximum seconds to wait for stop completion (default: 60)",
    )
    parser.add_argument(
        "--start-timeout",
        type=int,
        default=120,
        help="Maximum seconds to wait for start completion (default: 120)",
    )

    # Credentials (optional, can use env vars)
    parser.add_argument(
        "--coder-url",
        help="Coder API base URL (default: CODER_URL env var)",
    )
    parser.add_argument(
        "--token",
        help="Coder session token (default: CODER_SESSION_TOKEN env var)",
    )

    # Logging level
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Logging level (default: INFO)",
    )

    args = parser.parse_args()

    # Set logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))

    try:
        # Run the update
        if args.workspace_id:
            result = asyncio.run(
                update_workspace(
                    workspace_id=args.workspace_id,
                    template_version_id=args.template_version_id,
                    stop_timeout=args.stop_timeout,
                    start_timeout=args.start_timeout,
                    coder_url=args.coder_url,
                    token=args.token,
                )
            )
        else:
            result = asyncio.run(
                update_workspace_by_name(
                    workspace_name=args.workspace_name,
                    template_version_id=args.template_version_id,
                    stop_timeout=args.stop_timeout,
                    start_timeout=args.start_timeout,
                    coder_url=args.coder_url,
                    token=args.token,
                )
            )

        logger.info("Update completed successfully")
        logger.info(f"Workspace name: {result.get('name')}")
        logger.info(f"Workspace ID: {result.get('id')}")
        logger.info(f"Template: {result.get('template_display_name')}")
        logger.info(
            f"Latest build status: {result.get('latest_build', {}).get('status')}"
        )

        return 0

    except KeyboardInterrupt:
        logger.error("Operation cancelled by user")
        return 130
    except Exception as e:
        logger.error(f"Failed to update workspace: {e}")
        if args.log_level == "DEBUG":
            import traceback

            traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
