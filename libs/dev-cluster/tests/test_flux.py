"""Tests for flux module."""

from unittest.mock import MagicMock, patch

import pytest
from dev_cluster.flux import (
    bootstrap_flux,
    check_flux_installed,
    suspend_flux_reconciliation,
    wait_for_flux_ready,
)


@patch("dev_cluster.flux.subprocess.run")
def test_check_flux_installed_true(mock_run):
    """Test check_flux_installed when flux is installed."""
    mock_run.return_value = MagicMock(returncode=0)
    assert check_flux_installed() is True


@patch("dev_cluster.flux.subprocess.run")
def test_check_flux_installed_false(mock_run):
    """Test check_flux_installed when flux is not installed."""
    mock_run.side_effect = FileNotFoundError
    assert check_flux_installed() is False


@patch("dev_cluster.flux.os.path.exists")
@patch("dev_cluster.flux.os.environ")
@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_install_success(mock_run, mock_environ, mock_exists):
    """Test bootstrap_flux with flux install + create."""
    mock_environ.__getitem__.return_value = "/workspaces/setup"
    mock_exists.return_value = True
    # All three commands succeed
    mock_run.return_value = MagicMock(returncode=0)

    bootstrap_flux(
        "kind-test",
        "test",
        "https://github.com/vgijssel/setup",
        "main",
        "apps/dev-cluster-stack",
        False,
    )

    # Should be called 3 times: install, create source, create kustomization
    assert mock_run.call_count == 3

    # Check flux install was called
    install_args = mock_run.call_args_list[0][0][0]
    assert "flux" in install_args
    assert "install" in install_args

    # Check flux create source git was called
    source_args = mock_run.call_args_list[1][0][0]
    assert "flux" in source_args
    assert "create" in source_args
    assert "source" in source_args
    assert "git" in source_args

    # Check flux create kustomization was called
    kustomization_args = mock_run.call_args_list[2][0][0]
    assert "flux" in kustomization_args
    assert "create" in kustomization_args
    assert "kustomization" in kustomization_args


@patch("dev_cluster.flux.os.path.exists")
@patch("dev_cluster.flux.os.environ")
@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_install_failure(mock_run, mock_environ, mock_exists):
    """Test bootstrap_flux when flux install fails."""
    mock_environ.__getitem__.return_value = "/workspaces/setup"
    mock_exists.return_value = True
    mock_run.return_value = MagicMock(returncode=1, stderr="error")

    with pytest.raises(RuntimeError, match="Failed to install Flux"):
        bootstrap_flux(
            "kind-test",
            "test",
            "https://github.com/vgijssel/setup",
            "main",
            "apps/dev-cluster-stack",
            False,
        )


@patch("dev_cluster.flux.os.path.exists")
@patch("dev_cluster.flux.os.environ")
@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_source_failure(mock_run, mock_environ, mock_exists):
    """Test bootstrap_flux when create source fails."""
    mock_environ.__getitem__.return_value = "/workspaces/setup"
    mock_exists.return_value = True
    # First call (install) succeeds, second (create source) fails
    mock_run.side_effect = [
        MagicMock(returncode=0),
        MagicMock(returncode=1, stderr="error"),
    ]

    with pytest.raises(
        RuntimeError, match="Failed to create Flux GitRepository source"
    ):
        bootstrap_flux(
            "kind-test",
            "test",
            "https://github.com/vgijssel/setup",
            "main",
            "apps/dev-cluster-stack",
            False,
        )


@patch("dev_cluster.flux.os.path.exists")
@patch("dev_cluster.flux.os.environ")
@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_kustomization_failure(mock_run, mock_environ, mock_exists):
    """Test bootstrap_flux when create kustomization fails."""
    mock_environ.__getitem__.return_value = "/workspaces/setup"
    mock_exists.return_value = True
    # First two calls succeed, third (create kustomization) fails
    mock_run.side_effect = [
        MagicMock(returncode=0),
        MagicMock(returncode=0),
        MagicMock(returncode=1, stderr="error"),
    ]

    with pytest.raises(RuntimeError, match="Failed to create Flux Kustomization"):
        bootstrap_flux(
            "kind-test",
            "test",
            "https://github.com/vgijssel/setup",
            "main",
            "apps/dev-cluster-stack",
            False,
        )


@patch("dev_cluster.flux.subprocess.run")
def test_suspend_flux_reconciliation_success(mock_run):
    """Test suspend_flux_reconciliation successful."""
    mock_run.return_value = MagicMock(returncode=0)
    suspend_flux_reconciliation("kind-test")
    # Should be called twice (git source and kustomization)
    assert mock_run.call_count == 2


@patch("dev_cluster.flux.subprocess.run")
def test_suspend_flux_reconciliation_git_failure(mock_run):
    """Test suspend_flux_reconciliation when git source suspension fails."""
    mock_run.return_value = MagicMock(returncode=1, stderr="error")
    with pytest.raises(RuntimeError, match="Failed to suspend Flux git source"):
        suspend_flux_reconciliation("kind-test")


@patch("dev_cluster.flux.subprocess.run")
def test_suspend_flux_reconciliation_kustomization_failure(mock_run):
    """Test suspend_flux_reconciliation when kustomization suspension fails."""
    # First call succeeds, second fails
    mock_run.side_effect = [
        MagicMock(returncode=0),
        MagicMock(returncode=1, stderr="error"),
    ]
    with pytest.raises(RuntimeError, match="Failed to suspend Flux kustomization"):
        suspend_flux_reconciliation("kind-test")


@patch("dev_cluster.flux.subprocess.run")
def test_wait_for_flux_ready_success(mock_run):
    """Test wait_for_flux_ready when flux becomes ready."""
    # All four kubectl wait calls succeed
    # 1. deployments, 2. GitRepositories, 3. Kustomizations, 4. HelmReleases
    mock_run.return_value = MagicMock(returncode=0)
    assert wait_for_flux_ready("kind-test", timeout=10) is True
    # Should be called 4 times
    assert mock_run.call_count == 4


@patch("dev_cluster.flux.subprocess.run")
def test_wait_for_flux_ready_deployment_timeout(mock_run):
    """Test wait_for_flux_ready when deployment wait fails."""
    # First call (deployments) fails
    mock_run.return_value = MagicMock(returncode=1, stderr="timeout")
    assert wait_for_flux_ready("kind-test", timeout=10) is False
    # Should only be called once (fails at first step)
    assert mock_run.call_count == 1


@patch("dev_cluster.flux.subprocess.run")
def test_wait_for_flux_ready_gitrepository_timeout(mock_run):
    """Test wait_for_flux_ready when GitRepository wait fails."""
    # First call succeeds, second fails
    mock_run.side_effect = [
        MagicMock(returncode=0),  # deployments
        MagicMock(returncode=1, stderr="timeout"),  # GitRepositories
    ]
    assert wait_for_flux_ready("kind-test", timeout=10) is False
    assert mock_run.call_count == 2


@patch("dev_cluster.flux.subprocess.run")
def test_wait_for_flux_ready_kustomization_timeout(mock_run):
    """Test wait_for_flux_ready when Kustomization wait fails."""
    # First two calls succeed, third fails
    mock_run.side_effect = [
        MagicMock(returncode=0),  # deployments
        MagicMock(returncode=0),  # GitRepositories
        MagicMock(returncode=1, stderr="timeout"),  # Kustomizations
    ]
    assert wait_for_flux_ready("kind-test", timeout=10) is False
    assert mock_run.call_count == 3


@patch("dev_cluster.flux.subprocess.run")
def test_wait_for_flux_ready_helmrelease_timeout(mock_run):
    """Test wait_for_flux_ready when HelmRelease wait fails."""
    # First three calls succeed, fourth fails
    mock_run.side_effect = [
        MagicMock(returncode=0),  # deployments
        MagicMock(returncode=0),  # GitRepositories
        MagicMock(returncode=0),  # Kustomizations
        MagicMock(returncode=1, stderr="timeout"),  # HelmReleases
    ]
    assert wait_for_flux_ready("kind-test", timeout=10) is False
    assert mock_run.call_count == 4
