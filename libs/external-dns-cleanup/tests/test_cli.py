"""Tests for the CLI module."""

import os
from unittest.mock import patch

import pytest
from click.testing import CliRunner
from external_dns_cleanup.cli import cli


@pytest.fixture
def runner():
    """Create a CLI runner for testing."""
    return CliRunner()


@pytest.fixture
def api_token():
    """Get API token from environment or use test value."""
    return os.getenv("CF_API_TOKEN", "test-token-12345")


def test_cli_missing_api_token(runner):
    """Test CLI fails when CF_API_TOKEN is not set."""
    with runner.isolated_filesystem():
        with patch.dict(os.environ, {}, clear=True):
            result = runner.invoke(
                cli,
                [
                    "--domain-filter",
                    "example.com",
                    "--txt-owner-id",
                    "test-owner",
                ],
            )
            assert result.exit_code == 1
            assert "CF_API_TOKEN environment variable is not set" in result.output


def test_cli_help(runner):
    """Test CLI help output."""
    result = runner.invoke(cli, ["--help"])
    assert result.exit_code == 0
    assert "Cleanup Cloudflare DNS records" in result.output
    assert "--domain-filter" in result.output
    assert "--txt-owner-id" in result.output
    assert "--txt-prefix" in result.output


def test_cli_requires_domain_filter(runner, api_token):
    """Test CLI requires --domain-filter option."""
    with patch.dict(os.environ, {"CF_API_TOKEN": api_token}):
        result = runner.invoke(cli, ["--txt-owner-id", "test-owner"])
        assert result.exit_code != 0
        assert "Missing option '--domain-filter'" in result.output


def test_cli_requires_txt_owner_id(runner, api_token):
    """Test CLI requires --txt-owner-id option."""
    with patch.dict(os.environ, {"CF_API_TOKEN": api_token}):
        result = runner.invoke(cli, ["--domain-filter", "example.com"])
        assert result.exit_code != 0
        assert "Missing option '--txt-owner-id'" in result.output
