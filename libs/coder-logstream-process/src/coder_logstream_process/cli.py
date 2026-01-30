"""CLI argument parsing with Click."""

import asyncio
import logging
import sys

import click

from .client import CoderClient
from .models import EXTERNAL_LOG_SOURCE_ID
from .runner import CommandRunner

logger = logging.getLogger(__name__)


def configure_logging(level: str) -> None:
    """Configure logging based on the specified level.

    Args:
        level: Log level string (DEBUG, INFO, WARN, ERROR)
    """
    # Map WARN to WARNING for logging module
    level_map = {"WARN": "WARNING"}
    actual_level = level_map.get(level.upper(), level.upper())

    numeric_level = getattr(logging, actual_level, logging.WARNING)

    # Configure root logger for the package
    package_logger = logging.getLogger("coder_logstream_process")
    package_logger.setLevel(numeric_level)

    # Add console handler if not already present
    if not package_logger.handlers:
        handler = logging.StreamHandler(sys.stderr)
        handler.setLevel(numeric_level)
        formatter = logging.Formatter("[coder-logstream] %(levelname)s: %(message)s")
        handler.setFormatter(formatter)
        package_logger.addHandler(handler)


@click.command()
@click.option(
    "--agent-url",
    envvar="CODER_AGENT_URL",
    default=None,
    help="Coder agent API URL (optional - command runs without log shipping if not set)",
)
@click.option(
    "--agent-token",
    envvar="CODER_AGENT_TOKEN",
    default=None,
    help="Coder agent token (optional - command runs without log shipping if not set)",
)
@click.option(
    "--source-name",
    envvar="CODER_LOGSTREAM_SOURCE_NAME",
    default=str(EXTERNAL_LOG_SOURCE_ID),
    help="Log source UUID (defaults to External log source)",
)
@click.option(
    "--buffer-interval",
    envvar="CODER_LOGSTREAM_BUFFER_INTERVAL",
    default=1.0,
    type=float,
    help="Seconds to buffer logs before sending to API (default: 1.0)",
)
@click.option(
    "--log-level",
    envvar="CODER_LOGSTREAM_LOG_LEVEL",
    default="WARN",
    type=click.Choice(["DEBUG", "INFO", "WARN", "ERROR"], case_sensitive=False),
    help="Logging verbosity (default: WARN)",
)
@click.argument("command")
def cli(
    agent_url: str | None,
    agent_token: str | None,
    source_name: str,
    buffer_interval: float,
    log_level: str,
    command: str,
) -> None:
    """Execute COMMAND and stream output to Coder logstream API.

    The command is executed via shell, with stdout and stderr captured
    and streamed to the Coder Agent API in real-time.

    Examples:

        # Using environment variables (typical in Coder workspaces)
        export CODER_AGENT_URL="http://localhost:4"
        export CODER_AGENT_TOKEN="secret-token"
        coder-logstream-process "devcontainer up --workspace-folder ."

        # Using CLI arguments
        coder-logstream-process --agent-url http://localhost:4 --agent-token secret "echo hello"

        # Debug mode to see HTTP requests
        coder-logstream-process --log-level DEBUG "npm install"
    """
    # Configure logging
    configure_logging(log_level)

    # Check for credentials
    if not agent_url or not agent_token:
        logger.warning(
            "CODER_AGENT_URL or CODER_AGENT_TOKEN not set - logs will not be shipped to Coder"
        )
        client = None
    else:
        client = CoderClient(
            agent_url=agent_url,
            agent_token=agent_token,
            source_id=source_name,
        )

    # Run the command
    exit_code = asyncio.run(run_command(client, command, buffer_interval))
    sys.exit(exit_code)


async def run_command(
    client: CoderClient | None,
    command: str,
    buffer_interval: float,
) -> int:
    """Run a command with optional log streaming.

    Args:
        client: Coder API client (None to disable log shipping)
        command: Shell command to execute
        buffer_interval: Seconds to buffer logs

    Returns:
        Exit code of the command
    """
    if client:
        async with client:
            runner = CommandRunner(client, buffer_interval)
            return await runner.run(command)
    else:
        runner = CommandRunner(None, buffer_interval)
        return await runner.run(command)
