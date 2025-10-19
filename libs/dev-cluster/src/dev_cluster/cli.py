"""Main CLI module for dev-cluster."""

import sys
import time

import click

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
        "op": (
            onepassword.check_op_installed(),
            "https://developer.1password.com/docs/cli/",
        ),
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
    help="Wait duration for cluster to be ready (e.g., 5m, 300s)",
)
@click.option(
    "--repo-url",
    envvar="FLUX_REPO_URL",
    help="Git repository URL for Flux bootstrap",
)
@click.option(
    "--flux-path",
    envvar="FLUX_PATH",
    help="Path in repository for Flux (default: clusters/<name>)",
)
@click.option(
    "--skip-flux",
    is_flag=True,
    help="Skip Flux bootstrap",
)
@click.option(
    "--skip-onepassword",
    is_flag=True,
    help="Skip 1Password operator setup",
)
@click.pass_context
def create(ctx, name, config, wait, repo_url, flux_path, skip_flux, skip_onepassword):
    """Create a development cluster."""
    verbose = ctx.obj.get("VERBOSE", False)

    # Check prerequisites
    if not check_prerequisites(verbose):
        sys.exit(2)

    # Parse wait duration
    timeout = _parse_duration(wait)

    try:
        # Check if cluster exists
        if kind.cluster_exists(name):
            click.echo(f"Cluster '{name}' already exists, skipping creation")
        else:
            click.echo(f"Creating cluster '{name}'...")
            kind.create_cluster(name, config=config, verbose=verbose)
            click.echo("✓ Cluster created")

        # Wait for cluster to be ready
        click.echo("Waiting for cluster to be ready...")
        start_time = time.time()
        if kind.wait_for_cluster_ready(name, timeout=timeout, verbose=verbose):
            elapsed = int(time.time() - start_time)
            click.echo(f"✓ Cluster ready ({elapsed}s)")
        else:
            click.echo(f"✗ Cluster did not become ready within {wait}", err=True)
            sys.exit(1)

        # Get cluster context
        context = kind.get_cluster_context(name)

        # Install 1Password operator
        if not skip_onepassword:
            click.echo("Installing 1Password operator...")
            onepassword.install_op_operator(context, verbose=verbose)
            click.echo("✓ 1Password operator installed")

        # Bootstrap Flux
        if not skip_flux:
            click.echo("Bootstrapping Flux...")
            flux.bootstrap_flux(
                context,
                name,
                repo_url=repo_url,
                path=flux_path,
                verbose=verbose,
            )
            click.echo(f"✓ Flux bootstrapped to {flux_path or f'clusters/{name}'}")

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


def _parse_duration(duration: str) -> int:
    """Parse duration string to seconds.

    Args:
        duration: Duration string (e.g., '5m', '300s', '1h')

    Returns:
        Duration in seconds
    """
    duration = duration.strip()
    if duration.endswith("s"):
        return int(duration[:-1])
    elif duration.endswith("m"):
        return int(duration[:-1]) * 60
    elif duration.endswith("h"):
        return int(duration[:-1]) * 3600
    else:
        # Assume seconds if no suffix
        return int(duration)


if __name__ == "__main__":
    cli()
