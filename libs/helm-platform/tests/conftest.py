"""Pytest fixtures for helm-platform tests."""

from pathlib import Path
from typing import Generator

import pytest


@pytest.fixture
def tmp_platform_dir(tmp_path: Path) -> Generator[Path, None, None]:
    """Create a temporary platform directory structure."""
    yield tmp_path


@pytest.fixture
def infra_platform(tmp_path: Path) -> Path:
    """Create a secrets-proxy-infra style directory structure."""
    platform_dir = tmp_path / "secrets-proxy-infra"
    platform_dir.mkdir()

    # Create vcluster app
    vcluster = platform_dir / "vcluster"
    vcluster.mkdir()
    (vcluster / "Chart.yaml").write_text("apiVersion: v2\nname: vcluster\n")

    # Create tenant app
    tenant = platform_dir / "tenant"
    tenant.mkdir()
    (tenant / "Chart.yaml").write_text("apiVersion: v2\nname: tenant\n")

    return platform_dir


@pytest.fixture
def apps_platform(tmp_path: Path) -> Path:
    """Create a secrets-proxy style directory structure."""
    platform_dir = tmp_path / "secrets-proxy"
    platform_dir.mkdir()

    # Create onepassword-operator app
    op = platform_dir / "onepassword-operator"
    op.mkdir()
    (op / "Chart.yaml").write_text("apiVersion: v2\nname: onepassword-operator\n")

    # Create another app
    secrets = platform_dir / "external-secrets"
    secrets.mkdir()
    (secrets / "kustomization.yaml").write_text(
        "apiVersion: kustomize.config.k8s.io/v1beta1\n"
    )

    return platform_dir
