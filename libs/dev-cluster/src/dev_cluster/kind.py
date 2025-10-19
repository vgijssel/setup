"""Kind cluster management module."""

import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Optional

import yaml


def check_kind_installed() -> bool:
    """Check if kind is installed."""
    try:
        result = subprocess.run(
            ["kind", "version"],
            capture_output=True,
            text=True,
            check=False,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def cluster_exists(name: str) -> bool:
    """Check if a kind cluster exists."""
    try:
        result = subprocess.run(
            ["kind", "get", "clusters"],
            capture_output=True,
            text=True,
            check=True,
        )
        clusters = result.stdout.strip().split("\n")
        return name in clusters
    except subprocess.CalledProcessError:
        return False


def create_cluster(
    name: str,
    config: Optional[str] = None,
    verbose: bool = False,
) -> None:
    """Create a kind cluster.

    Args:
        name: Name of the cluster to create
        config: Optional path to kind config file
        verbose: Enable verbose output
    """
    cmd = ["kind", "create", "cluster", "--name", name]

    # If no config provided, use default with native snapshotter
    if config:
        cmd.extend(["--config", config])
    else:
        # Create temporary config file with native snapshotter
        default_config = {
            "kind": "Cluster",
            "apiVersion": "kind.x-k8s.io/v1alpha4",
            "containerdConfigPatches": [
                '[plugins."io.containerd.grpc.v1.cri".containerd]\n  snapshotter = "native"'
            ],
            "nodes": [{"role": "control-plane"}],
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".yaml", delete=False) as f:
            yaml.dump(default_config, f)
            temp_config = f.name

        try:
            cmd.extend(["--config", temp_config])
            result = subprocess.run(
                cmd,
                capture_output=not verbose,
                text=True,
                check=False,
            )
        finally:
            Path(temp_config).unlink(missing_ok=True)

        if result.returncode != 0:
            if not verbose:
                print(result.stderr, file=sys.stderr)
            raise RuntimeError(f"Failed to create cluster '{name}'")
        return

    result = subprocess.run(
        cmd,
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError(f"Failed to create cluster '{name}'")


def delete_cluster(name: str, verbose: bool = False) -> None:
    """Delete a kind cluster.

    Args:
        name: Name of the cluster to delete
        verbose: Enable verbose output
    """
    result = subprocess.run(
        ["kind", "delete", "cluster", "--name", name],
        capture_output=not verbose,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        if not verbose:
            print(result.stderr, file=sys.stderr)
        raise RuntimeError(f"Failed to delete cluster '{name}'")


def wait_for_cluster_ready(
    name: str,
    timeout: int = 300,
    verbose: bool = False,
) -> bool:
    """Wait for cluster to be ready.

    Args:
        name: Name of the cluster
        timeout: Timeout in seconds
        verbose: Enable verbose output

    Returns:
        True if cluster is ready, False if timeout
    """
    context = get_cluster_context(name)
    start_time = time.time()

    while time.time() - start_time < timeout:
        # Check if nodes are ready
        result = subprocess.run(
            [
                "kubectl",
                "--context",
                context,
                "get",
                "nodes",
                "-o",
                "jsonpath={.items[*].status.conditions[?(@.type=='Ready')].status}",
            ],
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode == 0:
            statuses = result.stdout.strip().split()
            if all(status == "True" for status in statuses):
                # Also check that core pods are running
                result = subprocess.run(
                    [
                        "kubectl",
                        "--context",
                        context,
                        "get",
                        "pods",
                        "-n",
                        "kube-system",
                        "-o",
                        "jsonpath={.items[*].status.phase}",
                    ],
                    capture_output=True,
                    text=True,
                    check=False,
                )

                if result.returncode == 0:
                    phases = result.stdout.strip().split()
                    if phases and all(
                        phase in ["Running", "Succeeded"] for phase in phases
                    ):
                        return True

        time.sleep(2)

    return False


def get_cluster_context(name: str) -> str:
    """Get the kubectl context name for a kind cluster.

    Args:
        name: Name of the cluster

    Returns:
        Context name (kind-<name>)
    """
    return f"kind-{name}"
