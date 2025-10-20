"""Tests for kind module."""

from unittest.mock import MagicMock, patch

import pytest
from dev_cluster.kind import (
    check_kind_installed,
    cluster_exists,
    create_cluster,
    delete_cluster,
    get_cluster_context,
    wait_for_cluster_ready,
)


@patch("dev_cluster.kind.subprocess.run")
def test_check_kind_installed_true(mock_run):
    """Test check_kind_installed when kind is installed."""
    mock_run.return_value = MagicMock(returncode=0)
    assert check_kind_installed() is True


@patch("dev_cluster.kind.subprocess.run")
def test_check_kind_installed_false(mock_run):
    """Test check_kind_installed when kind is not installed."""
    mock_run.side_effect = FileNotFoundError
    assert check_kind_installed() is False


@patch("dev_cluster.kind.subprocess.run")
def test_cluster_exists_true(mock_run):
    """Test cluster_exists when cluster exists."""
    mock_run.return_value = MagicMock(
        returncode=0, stdout="cluster1\ntest-cluster\ncluster2\n"
    )
    assert cluster_exists("test-cluster") is True


@patch("dev_cluster.kind.subprocess.run")
def test_cluster_exists_false(mock_run):
    """Test cluster_exists when cluster doesn't exist."""
    mock_run.return_value = MagicMock(returncode=0, stdout="cluster1\ncluster2\n")
    assert cluster_exists("test-cluster") is False


@patch("dev_cluster.kind.subprocess.run")
def test_create_cluster_default_config(mock_run):
    """Test create_cluster with default config."""
    mock_run.return_value = MagicMock(returncode=0)
    create_cluster("test-cluster")
    mock_run.assert_called_once()
    # Verify kind create cluster was called
    args = mock_run.call_args[0][0]
    assert "kind" in args
    assert "create" in args
    assert "cluster" in args


@patch("dev_cluster.kind.subprocess.run")
def test_create_cluster_custom_config(mock_run):
    """Test create_cluster with custom config."""
    mock_run.return_value = MagicMock(returncode=0)
    create_cluster("test-cluster", config="/path/to/config.yaml")
    mock_run.assert_called_once()
    args = mock_run.call_args[0][0]
    assert "/path/to/config.yaml" in args


@patch("dev_cluster.kind.subprocess.run")
def test_create_cluster_failure(mock_run):
    """Test create_cluster when creation fails."""
    mock_run.return_value = MagicMock(returncode=1, stderr="error")
    with pytest.raises(RuntimeError, match="Failed to create cluster"):
        create_cluster("test-cluster")


@patch("dev_cluster.kind.subprocess.run")
def test_delete_cluster_success(mock_run):
    """Test delete_cluster successful deletion."""
    mock_run.return_value = MagicMock(returncode=0)
    delete_cluster("test-cluster")
    mock_run.assert_called_once()
    args = mock_run.call_args[0][0]
    assert "kind" in args
    assert "delete" in args


@patch("dev_cluster.kind.subprocess.run")
def test_delete_cluster_failure(mock_run):
    """Test delete_cluster when deletion fails."""
    mock_run.return_value = MagicMock(returncode=1, stderr="error")
    with pytest.raises(RuntimeError, match="Failed to delete cluster"):
        delete_cluster("test-cluster")


def test_get_cluster_context():
    """Test get_cluster_context."""
    assert get_cluster_context("my-cluster") == "kind-my-cluster"
    assert get_cluster_context("test") == "kind-test"


@patch("dev_cluster.kind.subprocess.run")
@patch("dev_cluster.kind.time.sleep")
def test_wait_for_cluster_ready_success(mock_sleep, mock_run):
    """Test wait_for_cluster_ready when cluster becomes ready."""
    # First call checks nodes
    # Second call checks pods
    mock_run.side_effect = [
        MagicMock(returncode=0, stdout="True True"),
        MagicMock(returncode=0, stdout="Running Running Running"),
    ]
    assert wait_for_cluster_ready("test-cluster", timeout=10) is True


@patch("dev_cluster.kind.subprocess.run")
@patch("dev_cluster.kind.time.sleep")
@patch("dev_cluster.kind.time.time")
def test_wait_for_cluster_ready_timeout(mock_time, mock_sleep, mock_run):
    """Test wait_for_cluster_ready when timeout occurs."""
    # Simulate time passing
    mock_time.side_effect = [0, 0, 400]  # Start, loop check, timeout
    mock_run.return_value = MagicMock(returncode=1)
    assert wait_for_cluster_ready("test-cluster", timeout=300) is False
