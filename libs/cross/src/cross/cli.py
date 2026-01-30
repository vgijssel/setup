"""Click-based CLI for cross-platform builds."""

import os
import subprocess
import sys
from pathlib import Path

import click

from .docker import DockerError, run_cross_build
from .moon import MoonError, find_moon_root, get_project_root
from .platform import detect_host_platform, parse_platform, platforms_match
from .templates import render_command


@click.command(context_settings={"ignore_unknown_options": True})
@click.option(
    "--platform",
    "target_platform",
    envvar="CROSS_PLATFORM",
    required=True,
    show_envvar=True,
    help="Target platform (os/arch), e.g., linux/amd64",
)
@click.option(
    "--moon-project-id",
    envvar="MOON_PROJECT_ID",
    required=True,
    show_envvar=True,
    help="Moon project identifier",
)
@click.option(
    "--moon-task-id",
    envvar="MOON_TASK_ID",
    required=True,
    show_envvar=True,
    help="Moon task identifier",
)
@click.argument("command", nargs=-1, required=True)
def cli(
    target_platform: str,
    moon_project_id: str,
    moon_task_id: str,
    command: tuple[str, ...],
) -> None:
    """Cross-platform build tool for Moon monorepo.

    Executes COMMAND for the target platform. If the host platform matches
    the target, runs directly. Otherwise, builds in Docker.

    Template variables {{ os }} and {{ arch }} in the command are substituted
    with the target platform values.

    Examples:

        cross --platform linux/amd64 pex . -o dist/{{ os }}_{{ arch }}/out.pex

        CROSS_PLATFORM=linux/amd64 cross pex . -o dist/{{ os }}_{{ arch }}/out.pex
    """
    # Check for Moon repository
    try:
        workspace_root = find_moon_root()
    except MoonError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

    # Parse target platform
    try:
        target = parse_platform(target_platform)
    except ValueError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

    # Detect host platform
    host = detect_host_platform()

    # Render template variables in command
    rendered_command = render_command(list(command), target.os, target.arch)

    # Check if platforms match (native execution)
    if platforms_match(host, target):
        click.echo(f"Platforms match ({host}), running natively...")
        _run_native(rendered_command)
        return

    # Cross-compilation needed - check for nested cross
    if os.environ.get("CROSS_MOON") == "true":
        click.echo(
            "Error: Cannot run cross within cross - nested cross-compilation detected",
            err=True,
        )
        sys.exit(1)

    # Run cross-platform build in Docker
    click.echo(f"Cross-compiling from {host} to {target}...")

    try:
        project_root = get_project_root(moon_project_id)
    except MoonError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)

    try:
        extracted_files = run_cross_build(
            workspace_root=workspace_root,
            platform=target_platform,
            project_id=moon_project_id,
            task_id=moon_task_id,
            project_root=project_root,
        )

        if extracted_files:
            click.echo("Extracted output files:")
            for f in extracted_files:
                click.echo(f"  - {f}")
        else:
            click.echo("No output files extracted.")

    except (DockerError, MoonError) as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)


def _run_native(command: list[str]) -> None:
    """Run a command natively on the host.

    Args:
        command: List of command arguments.

    Raises:
        SystemExit: With the command's exit code.
    """
    try:
        result = subprocess.run(command)
        sys.exit(result.returncode)
    except FileNotFoundError:
        click.echo(f"Error: Command not found: {command[0]}", err=True)
        sys.exit(1)
    except Exception as e:
        click.echo(f"Error running command: {e}", err=True)
        sys.exit(1)
