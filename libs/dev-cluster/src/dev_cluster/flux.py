"""Flux GitOps bootstrap module."""

import os
import subprocess
import sys
import time


def check_flux_installed() -> bool:
    """Check if flux CLI is installed."""
    try:
        result = subprocess.run(
            ["flux", "version", "--client"],
            capture_output=True,
            text=True,
            check=False,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def bootstrap_flux(
    cluster_context: str,
    cluster_name: str,
    repo_url: str,
    branch: str,
    path: str,
    verbose: bool,
) -> None:
    """Install Flux and create GitRepository and Kustomization resources.

    Args:
        cluster_context: Kubectl context for the cluster
        cluster_name: Name of the cluster
        repo_url: Git repository URL
        branch: Git branch to use
        path: Path in repo
        verbose: Enable verbose output

    Raises:
        RuntimeError: If Flux installation fails
    """
    path = os.path.join(os.environ["SETUP_DIR"], path)

    if not os.path.exists(path):
        raise RuntimeError(f"Specified path does not exist: {path}")

    # Step 1: Install Flux
    install_cmd = [
        "flux",
        "install",
        "--context",
        cluster_context,
    ]

    result = subprocess.run(
        install_cmd,
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to install Flux")

    # Step 2: Create GitRepository source
    git_source_cmd = [
        "flux",
        "create",
        "source",
        "git",
        cluster_name,
        f"--url={repo_url}",
        f"--branch={branch}",
        "--interval=1m",
        "--context",
        cluster_context,
    ]

    result = subprocess.run(
        git_source_cmd,
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to create Flux GitRepository source")

    # Step 3: Create Kustomization
    kustomization_cmd = [
        "flux",
        "create",
        "kustomization",
        "root",
        "--source=GitRepository/" + cluster_name,
        f"--path={path}",
        "--prune=true",
        "--interval=1m",
        "--context",
        cluster_context,
    ]

    result = subprocess.run(
        kustomization_cmd,
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to create Flux Kustomization")


def suspend_flux_reconciliation(
    cluster_context: str,
    verbose: bool = False,
) -> None:
    """Suspend Flux reconciliation.

    Args:
        cluster_context: Kubectl context for the cluster
        verbose: Enable verbose output

    Raises:
        RuntimeError: If suspension fails
    """
    # Suspend git source
    result = subprocess.run(
        [
            "flux",
            "suspend",
            "source",
            "git",
            "flux-system",
            "-n",
            "flux-system",
            "--context",
            cluster_context,
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to suspend Flux git source")

    # Suspend kustomization
    result = subprocess.run(
        [
            "flux",
            "suspend",
            "kustomization",
            "flux-system",
            "-n",
            "flux-system",
            "--context",
            cluster_context,
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to suspend Flux kustomization")


def wait_for_flux_ready(
    cluster_context: str,
    timeout: int = 300,
    verbose: bool = False,
) -> bool:
    """Wait for Flux to be ready.

    Args:
        cluster_context: Kubectl context for the cluster
        timeout: Timeout in seconds
        verbose: Enable verbose output

    Returns:
        True if Flux is ready, False if timeout
    """
    start_time = time.time()

    while time.time() - start_time < timeout:
        # Check if flux-system namespace exists and pods are running
        result = subprocess.run(
            [
                "kubectl",
                "--context",
                cluster_context,
                "get",
                "pods",
                "-n",
                "flux-system",
                "-o",
                "jsonpath={.items[*].status.phase}",
            ],
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode == 0:
            phases = result.stdout.strip().split()
            if phases and all(phase in ["Running", "Succeeded"] for phase in phases):
                # Also check that key Flux resources are ready
                result = subprocess.run(
                    [
                        "kubectl",
                        "--context",
                        cluster_context,
                        "get",
                        "deploy",
                        "-n",
                        "flux-system",
                        "-o",
                        "jsonpath={.items[*].status.conditions[?(@.type=='Available')].status}",
                    ],
                    capture_output=True,
                    text=True,
                    check=False,
                )

                if result.returncode == 0:
                    statuses = result.stdout.strip().split()
                    if statuses and all(status == "True" for status in statuses):
                        return True

        time.sleep(2)

    return False
