"""Flux GitOps bootstrap module."""

import os
import subprocess
import sys
import time
from typing import Optional


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
    repo_url: Optional[str] = None,
    branch: str = "main",
    path: Optional[str] = None,
    verbose: bool = False,
) -> None:
    """Bootstrap Flux on the cluster.

    Args:
        cluster_context: Kubectl context for the cluster
        cluster_name: Name of the cluster
        repo_url: Git repository URL (defaults to FLUX_REPO_URL env or https://github.com/vgijssel/setup)
        branch: Git branch to use
        path: Path in repo (defaults to clusters/<cluster-name>)
        verbose: Enable verbose output

    Raises:
        RuntimeError: If bootstrap fails
    """
    # Get repo URL from parameter or environment
    if not repo_url:
        repo_url = os.environ.get("FLUX_REPO_URL", "https://github.com/vgijssel/setup")

    # Parse repo URL to get owner and repo name
    # Expected format: https://github.com/owner/repo or git@github.com:owner/repo.git
    if "github.com" in repo_url:
        if repo_url.startswith("https://"):
            # https://github.com/owner/repo
            parts = repo_url.replace("https://github.com/", "").strip("/").split("/")
        elif repo_url.startswith("git@"):
            # git@github.com:owner/repo.git
            parts = (
                repo_url.replace("git@github.com:", "").replace(".git", "").split("/")
            )
        else:
            raise RuntimeError(f"Unsupported repository URL format: {repo_url}")

        if len(parts) < 2:
            raise RuntimeError(f"Could not parse owner and repo from URL: {repo_url}")

        owner = parts[0]
        repo = parts[1]
    else:
        raise RuntimeError(f"Only GitHub repositories are supported. Got: {repo_url}")

    # Get path
    if not path:
        path = os.environ.get("FLUX_PATH", f"clusters/{cluster_name}")

    # Build bootstrap command
    cmd = [
        "flux",
        "bootstrap",
        "github",
        f"--owner={owner}",
        f"--repository={repo}",
        f"--branch={branch}",
        f"--path={path}",
        "--context",
        cluster_context,
    ]

    result = subprocess.run(
        cmd,
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError("Failed to bootstrap Flux")


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
