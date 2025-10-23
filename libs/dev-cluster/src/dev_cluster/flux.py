"""Flux GitOps bootstrap module."""

import os
import subprocess
import sys


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
    full_path = os.path.join(os.environ["SETUP_DIR"], path)

    if not os.path.exists(full_path):
        raise RuntimeError(f"Specified path does not exist: {full_path}")

    path = os.path.join("/", path)

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
        "setup",
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
        "--source=GitRepository/setup",
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
    timeout: int = 1800,  # 30 minutes default
    verbose: bool = False,
) -> bool:
    """Wait for Flux and all its resources to be ready.

    This function waits for:
    - Flux system deployments to be available
    - All GitRepository sources to be ready
    - All Kustomizations to be ready
    - All HelmReleases to be ready

    Args:
        cluster_context: Kubectl context for the cluster
        timeout: Timeout in seconds (default 30 minutes)
        verbose: Enable verbose output

    Returns:
        True if Flux is ready, False if timeout
    """
    timeout_str = f"{timeout}s"

    # Step 1: Wait for Flux deployments to be ready
    if verbose:
        print("Waiting for Flux system deployments...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "wait",
            "--for=condition=available",
            f"--timeout={timeout_str}",
            "deployment",
            "-n",
            "flux-system",
            "--all",
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        return False

    # Step 2: Wait for GitRepository sources to be ready
    if verbose:
        print("Waiting for GitRepository sources...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "wait",
            "-A",
            "--for=condition=ready",
            f"--timeout={timeout_str}",
            "gitrepositories.source.toolkit.fluxcd.io",
            "--all",
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        return False

    # Step 3: Wait for Kustomizations to be ready
    if verbose:
        print("Waiting for Kustomizations...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "wait",
            "-A",
            "--for=condition=ready",
            f"--timeout={timeout_str}",
            "kustomizations.kustomize.toolkit.fluxcd.io",
            "--all",
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        return False

    # Step 4: Wait for HelmReleases to be ready
    if verbose:
        print("Waiting for HelmReleases...")
    result = subprocess.run(
        [
            "kubectl",
            "--context",
            cluster_context,
            "wait",
            "-A",
            "--for=condition=ready",
            f"--timeout={timeout_str}",
            "helmreleases.helm.toolkit.fluxcd.io",
            "--all",
        ],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        return False

    return True
