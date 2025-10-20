"""1Password operator module."""

import base64
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


def create_op_connect_token_secret(
    cluster_context: str,
    verbose: bool = False,
) -> None:
    """Create 1Password secrets in the cluster.

    Creates two secrets required by the 1Password operator:
    1. 1password-credentials: Contains the 1password-credentials.json file
    2. 1password-operator-token: Contains the operator token

    Both secrets are created in the 1password namespace.

    Args:
        cluster_context: Kubectl context for the cluster
        verbose: Enable verbose output

    Raises:
        RuntimeError: If secret creation fails
    """
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

    # Create 1password-credentials secret
    # Read the credentials file from 1Password
    if verbose:
        print("Reading 1password-credentials.json from 1Password...")
    op_read_result = subprocess.run(
        [
            "op",
            "read",
            "op://enigma-cluster/enigma-cluster Credentials File/1password-credentials.json",
        ],
        capture_output=True,
        text=True,
        check=False,
    )

    if op_read_result.returncode != 0:
        if not verbose:
            print(op_read_result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to read 1password-credentials.json from 1Password")

    # Base64 encode the credentials
    credentials_b64 = base64.b64encode(op_read_result.stdout.encode()).decode()

    # Create the secret
    if verbose:
        print("Creating 1password-credentials secret...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "create",
            "secret",
            "generic",
            "1password-credentials",
            f"--from-literal=1password-credentials.json={credentials_b64}",
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
        raise RuntimeError("Failed to create 1password-credentials secret")

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
        raise RuntimeError("Failed to apply 1password-credentials secret")

    # Create 1password-operator-token secret
    # Read the operator token from 1Password
    if verbose:
        print("Reading 1password-operator-token from 1Password...")
    op_read_result = subprocess.run(
        [
            "op",
            "read",
            "op://enigma-cluster/hxmp2hgt5iluzk5zfq2trx4oae/credential",
        ],
        capture_output=True,
        text=True,
        check=False,
    )

    if op_read_result.returncode != 0:
        if not verbose:
            print(op_read_result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to read 1password-operator-token from 1Password")

    token = op_read_result.stdout.strip()

    # Create the secret
    if verbose:
        print("Creating 1password-operator-token secret...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "create",
            "secret",
            "generic",
            "1password-operator-token",
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
        raise RuntimeError("Failed to create 1password-operator-token secret")

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
        raise RuntimeError("Failed to apply 1password-operator-token secret")
