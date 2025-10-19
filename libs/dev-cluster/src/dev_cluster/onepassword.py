"""1Password operator module."""

import os
import subprocess
import sys


def check_op_installed() -> bool:
    """Check if op CLI is installed."""
    try:
        result = subprocess.run(
            ["op", "--version"],
            capture_output=True,
            text=True,
            check=False,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def get_op_token() -> str:
    """Get 1Password Connect token from environment.

    Returns:
        The OP_CONNECT_TOKEN value

    Raises:
        RuntimeError: If token is not found
    """
    token = os.environ.get("OP_CONNECT_TOKEN")
    if not token:
        raise RuntimeError(
            "OP_CONNECT_TOKEN environment variable not set. "
            "Please set it before creating a cluster."
        )
    return token


def create_op_connect_token_secret(
    cluster_context: str,
    verbose: bool = False,
) -> None:
    """Create 1Password Connect token secret in the cluster.

    Args:
        cluster_context: Kubectl context for the cluster
        verbose: Enable verbose output

    Raises:
        RuntimeError: If secret creation fails
    """
    token = get_op_token()

    # Create namespace first
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "create",
            "namespace",
            "1password",
            "--dry-run=client",
            "-o",
            "yaml",
        ],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode == 0:
        subprocess.run(
            ["kubectl", "--context", cluster_context, "apply", "-f", "-"],
            input=result.stdout,
            text=True,
            capture_output=not verbose,
            check=False,
        )

    # Create secret
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "create",
            "secret",
            "generic",
            "op-credentials",
            f"--from-literal=token={token}",
            "-n",
            "1password",
            "--dry-run=client",
            "-o",
            "yaml",
        ],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to create 1Password credentials secret")

    # Apply the secret
    result = subprocess.run(
        ["kubectl", "--context", cluster_context, "apply", "-f", "-"],
        input=result.stdout,
        text=True,
        capture_output=not verbose,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to apply 1Password credentials secret")


def install_op_operator(
    cluster_context: str,
    verbose: bool = False,
) -> None:
    """Install 1Password operator in the cluster.

    Args:
        cluster_context: Kubectl context for the cluster
        verbose: Enable verbose output

    Raises:
        RuntimeError: If installation fails
    """
    # Note: The actual operator installation would typically be done via Helm or
    # Kubernetes manifests. For now, we just ensure the secret is created.
    # The operator itself will be installed by Flux after bootstrap.
    create_op_connect_token_secret(cluster_context, verbose)
