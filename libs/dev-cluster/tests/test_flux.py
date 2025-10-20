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


@patch("dev_cluster.flux.subprocess.run")
@patch("dev_cluster.flux.os.environ.get")
def test_bootstrap_flux_install_success(mock_env, mock_run):
    """Test bootstrap_flux with flux install + create."""
    mock_env.side_effect = lambda k, default=None: {
        "FLUX_REPO_URL": "https://github.com/vgijssel/setup",
        "FLUX_PATH": "./stacks/dev-cluster",
    }.get(k, default)
    # All three commands succeed
    mock_run.return_value = MagicMock(returncode=0)

    bootstrap_flux("kind-test", "test", branch="main")

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


@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_install_failure(mock_run):
    """Test bootstrap_flux when flux install fails."""
    mock_run.return_value = MagicMock(returncode=1, stderr="error")

    with pytest.raises(RuntimeError, match="Failed to install Flux"):
        bootstrap_flux("kind-test", "test")


@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_source_failure(mock_run):
    """Test bootstrap_flux when create source fails."""
    # First call (install) succeeds, second (create source) fails
    mock_run.side_effect = [
        MagicMock(returncode=0),
        MagicMock(returncode=1, stderr="error"),
    ]

    with pytest.raises(
        RuntimeError, match="Failed to create Flux GitRepository source"
    ):
        bootstrap_flux("kind-test", "test")


@patch("dev_cluster.flux.subprocess.run")
def test_bootstrap_flux_kustomization_failure(mock_run):
    """Test bootstrap_flux when create kustomization fails."""
    # First two calls succeed, third (create kustomization) fails
    mock_run.side_effect = [
        MagicMock(returncode=0),
        MagicMock(returncode=0),
        MagicMock(returncode=1, stderr="error"),
    ]

    with pytest.raises(RuntimeError, match="Failed to create Flux Kustomization"):
        bootstrap_flux("kind-test", "test")


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
@patch("dev_cluster.flux.time.sleep")
def test_wait_for_flux_ready_success(mock_sleep, mock_run):
    """Test wait_for_flux_ready when flux becomes ready."""
    # First call checks pods, second checks deployments
    mock_run.side_effect = [
        MagicMock(returncode=0, stdout="Running Running"),
        MagicMock(returncode=0, stdout="True True"),
    ]
    assert wait_for_flux_ready("kind-test", timeout=10) is True


@patch("dev_cluster.flux.subprocess.run")
@patch("dev_cluster.flux.time.sleep")
@patch("dev_cluster.flux.time.time")
def test_wait_for_flux_ready_timeout(mock_time, mock_sleep, mock_run):
    """Test wait_for_flux_ready when timeout occurs."""
    # Simulate time passing
    mock_time.side_effect = [0, 0, 400]  # Start, loop check, timeout
    mock_run.return_value = MagicMock(returncode=1)
    assert wait_for_flux_ready("kind-test", timeout=300) is False
