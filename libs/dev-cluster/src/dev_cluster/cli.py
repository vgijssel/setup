"""Main CLI module for dev-cluster."""

import subprocess
import sys
import time

import click
from pytimeparse import parse as parse_duration

from . import flux, kind, onepassword


def check_prerequisites(verbose: bool = False) -> bool:
    """Check if all required tools are installed.

    Args:
        verbose: Enable verbose output

    Returns:
        True if all prerequisites are met
    """
    tools = {
        "kind": (kind.check_kind_installed(), "https://kind.sigs.k8s.io/"),
        "kubectl": (
            _check_kubectl_installed(),
            "https://kubernetes.io/docs/tasks/tools/",
        ),
        "flux": (flux.check_flux_installed(), "https://fluxcd.io/flux/installation/"),
    }

    missing = []
    for tool, (installed, url) in tools.items():
        if not installed:
            missing.append((tool, url))

    if missing:
        click.echo("Error: Missing required tools:", err=True)
        for tool, url in missing:
            click.echo(f"  - {tool}: Install from {url}", err=True)
        return False

    return True


def _check_kubectl_installed() -> bool:
    """Check if kubectl is installed."""
    import subprocess

    try:
        result = subprocess.run(
            ["kubectl", "version", "--client"],
            capture_output=True,
            text=True,
            check=False,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


@click.group(invoke_without_command=True)
@click.pass_context
@click.option("--verbose", "-v", is_flag=True, help="Enable verbose output")
def cli(ctx, verbose):
    """dev-cluster: Local development cluster management.

    If no subcommand is provided, defaults to 'create'.
    """
    ctx.ensure_object(dict)
    ctx.obj["VERBOSE"] = verbose

    # If no subcommand and no arguments, show help
    if ctx.invoked_subcommand is None:
        click.echo(ctx.get_help())


@cli.command()
@click.argument("name")
@click.option(
    "--config",
    type=click.Path(exists=True),
    help="Path to kind cluster config file",
)
@click.option(
    "--wait",
    default="5m",
    help="Wait duration for Flux to be ready (e.g., 5m, 300s)",
)
@click.option(
    "--repo-url",
    envvar="FLUX_REPO_URL",
    default="https://github.com/vgijssel/setup",
    help="Git repository URL for Flux bootstrap",
)
@click.option(
    "--flux-path",
    envvar="FLUX_PATH",
    default="apps/dev-cluster-stack",
    help="Path in repository for Flux",
)
@click.option(
    "--branch",
    help="Git branch to use (defaults to current branch)",
)
@click.pass_context
def create(ctx, name, config, wait, repo_url, flux_path, branch):
    """Create a development cluster."""
    verbose = ctx.obj.get("VERBOSE", False)

    # Check prerequisites
    if not check_prerequisites(verbose):
        sys.exit(2)

    # Parse wait duration
    timeout = parse_duration(wait)
    if timeout is None:
        click.echo(f"Error: Invalid duration format: {wait}", err=True)
        sys.exit(1)

    try:
        # Check if cluster exists
        if kind.cluster_exists(name):
            click.echo(f"Cluster '{name}' already exists, skipping creation")
        else:
            click.echo(f"Creating cluster '{name}'...")
            kind.create_cluster(name, config=config, verbose=verbose)
            click.echo("✓ Cluster created")

        # Get cluster context
        context = kind.get_cluster_context(name)
        onepassword.create_op_connect_token_secret(context, verbose=verbose)

        # Get current git branch if not specified
        if not branch:
            result = subprocess.run(
                ["git", "branch", "--show-current"],
                capture_output=True,
                text=True,
                check=False,
            )
            branch = result.stdout.strip() if result.returncode == 0 else "main"

        click.echo(f"Installing Flux and creating GitRepository (branch: {branch})...")
        flux.bootstrap_flux(
            context,
            name,
            repo_url,
            branch,
            flux_path,
            verbose,
        )
        click.echo("✓ Flux installed with GitRepository and Kustomization")

        # Wait for Flux to be ready
        click.echo("Waiting for Flux to be ready...")
        start_time = time.time()
        if flux.wait_for_flux_ready(context, timeout=timeout, verbose=verbose):
            elapsed = int(time.time() - start_time)
            click.echo(f"✓ Flux ready ({elapsed}s)")
        else:
            click.echo("✗ Flux did not become ready within timeout", err=True)
            sys.exit(1)

        # Suspend Flux reconciliation
        click.echo("Suspending Flux reconciliation...")
        flux.suspend_flux_reconciliation(context, verbose=verbose)
        click.echo("✓ Flux reconciliation suspended")

        # Success message
        click.echo(f"\nCluster '{name}' ready!")
        click.echo(f"Context: {context}")

    except RuntimeError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)
    except KeyboardInterrupt:
        click.echo("\nOperation cancelled by user", err=True)
        sys.exit(1)


@cli.command()
@click.argument("name")
@click.pass_context
def delete(ctx, name):
    """Delete a development cluster."""
    verbose = ctx.obj.get("VERBOSE", False)

    # Check if kind is installed
    if not kind.check_kind_installed():
        click.echo(
            "Error: 'kind' not found. Install from: https://kind.sigs.k8s.io/",
            err=True,
        )
        sys.exit(2)

    try:
        # Check if cluster exists
        if not kind.cluster_exists(name):
            click.echo(f"Cluster '{name}' does not exist", err=True)
            sys.exit(1)

        # Delete cluster
        click.echo(f"Deleting cluster '{name}'...")
        kind.delete_cluster(name, verbose=verbose)
        click.echo(f"✓ Cluster '{name}' deleted")

    except RuntimeError as e:
        click.echo(f"Error: {e}", err=True)
        sys.exit(1)
    except KeyboardInterrupt:
        click.echo("\nOperation cancelled by user", err=True)
        sys.exit(1)


if __name__ == "__main__":
    cli()
