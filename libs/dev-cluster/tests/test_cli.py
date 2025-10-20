"""Tests for CLI module."""

from unittest.mock import patch

from click.testing import CliRunner
from dev_cluster.cli import check_prerequisites, cli


@patch("dev_cluster.cli.kind.check_kind_installed")
@patch("dev_cluster.cli._check_kubectl_installed")
@patch("dev_cluster.cli.flux.check_flux_installed")
def test_check_prerequisites_all_installed(mock_flux, mock_kubectl, mock_kind):
    """Test prerequisites check when all tools are installed."""
    mock_kind.return_value = True
    mock_kubectl.return_value = True
    mock_flux.return_value = True

    assert check_prerequisites() is True


@patch("dev_cluster.cli.kind.check_kind_installed")
@patch("dev_cluster.cli._check_kubectl_installed")
@patch("dev_cluster.cli.flux.check_flux_installed")
def test_check_prerequisites_missing_tools(mock_flux, mock_kubectl, mock_kind):
    """Test prerequisites check when tools are missing."""
    mock_kind.return_value = False
    mock_kubectl.return_value = True
    mock_flux.return_value = False

    assert check_prerequisites() is False


def test_cli_help():
    """Test CLI help command."""
    runner = CliRunner()
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    assert "dev-cluster" in result.output
    assert "Local development cluster management" in result.output


def test_create_help():
    """Test create command help."""
    runner = CliRunner()
    result = runner.invoke(cli, ["create", "--help"])
    assert result.exit_code == 0
    assert "Create a development cluster" in result.output


def test_delete_help():
    """Test delete command help."""
    runner = CliRunner()
    result = runner.invoke(cli, ["delete", "--help"])
    assert result.exit_code == 0
    assert "Delete a development cluster" in result.output


@patch("dev_cluster.cli.check_prerequisites")
def test_create_missing_prerequisites(mock_prereqs):
    """Test create command when prerequisites are missing."""
    mock_prereqs.return_value = False
    runner = CliRunner()
    result = runner.invoke(cli, ["create", "test-cluster"])
    assert result.exit_code == 2


@patch("dev_cluster.cli.check_prerequisites")
@patch("dev_cluster.cli.kind.cluster_exists")
@patch("dev_cluster.cli.kind.create_cluster")
@patch("dev_cluster.cli.kind.get_cluster_context")
def test_create_cluster_new(
    mock_context,
    mock_create,
    mock_exists,
    mock_prereqs,
):
    """Test creating a new cluster."""
    mock_prereqs.return_value = True
    mock_exists.return_value = False
    mock_context.return_value = "kind-test-cluster"

    runner = CliRunner()
    result = runner.invoke(cli, ["create", "test-cluster", "--skip-flux"])
    assert result.exit_code == 0
    assert "Creating cluster" in result.output
    assert "✓ Cluster created" in result.output
    mock_create.assert_called_once()


@patch("dev_cluster.cli.check_prerequisites")
@patch("dev_cluster.cli.kind.cluster_exists")
@patch("dev_cluster.cli.kind.get_cluster_context")
def test_create_cluster_exists(
    mock_context,
    mock_exists,
    mock_prereqs,
):
    """Test creating a cluster that already exists."""
    mock_prereqs.return_value = True
    mock_exists.return_value = True
    mock_context.return_value = "kind-test-cluster"

    runner = CliRunner()
    result = runner.invoke(cli, ["create", "test-cluster", "--skip-flux"])
    assert result.exit_code == 0
    assert "already exists" in result.output


@patch("dev_cluster.cli.kind.check_kind_installed")
@patch("dev_cluster.cli.kind.cluster_exists")
@patch("dev_cluster.cli.kind.delete_cluster")
def test_delete_cluster(mock_delete, mock_exists, mock_kind):
    """Test deleting a cluster."""
    mock_kind.return_value = True
    mock_exists.return_value = True

    runner = CliRunner()
    result = runner.invoke(cli, ["delete", "test-cluster"])
    assert result.exit_code == 0
    assert "deleted" in result.output
    mock_delete.assert_called_once()


@patch("dev_cluster.cli.kind.check_kind_installed")
@patch("dev_cluster.cli.kind.cluster_exists")
def test_delete_cluster_not_exists(mock_exists, mock_kind):
    """Test deleting a cluster that doesn't exist."""
    mock_kind.return_value = True
    mock_exists.return_value = False

    runner = CliRunner()
    result = runner.invoke(cli, ["delete", "test-cluster"])
    assert result.exit_code == 1
    assert "does not exist" in result.output


@patch("dev_cluster.cli.kind.check_kind_installed")
def test_delete_kind_not_installed(mock_kind):
    """Test delete command when kind is not installed."""
    mock_kind.return_value = False

    runner = CliRunner()
    result = runner.invoke(cli, ["delete", "test-cluster"])
    assert result.exit_code == 2
    assert "kind" in result.output
    assert "not found" in result.output
