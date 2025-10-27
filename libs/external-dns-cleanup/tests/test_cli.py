"""Tests for the CLI interface."""

import os
import subprocess

import pytest


@pytest.fixture
def script_path():
    """Get path to the executable script."""
    return os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "external-dns-cleanup"
    )


@pytest.fixture
def api_token():
    """Get API token from environment or use test value."""
    return os.getenv("CF_API_TOKEN", "test-token-12345")


def test_cli_help(script_path):
    """Test CLI help output."""
    result = subprocess.run(
        [script_path, "--help"],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0
    assert "Cleanup Cloudflare DNS records" in result.stdout
    assert "--domain-filter" in result.stdout
    assert "--txt-owner-id" in result.stdout
    assert "--txt-prefix" in result.stdout


def test_cli_requires_domain_filter(script_path, api_token):
    """Test CLI requires --domain-filter option."""
    env = os.environ.copy()
    env["CF_API_TOKEN"] = api_token

    result = subprocess.run(
        [script_path, "--txt-owner-id", "test-owner"],
        capture_output=True,
        text=True,
        check=False,
        env=env,
    )
    assert result.returncode != 0
    assert "Error" in result.stderr or "Missing option" in result.stderr


def test_cli_requires_txt_owner_id(script_path, api_token):
    """Test CLI requires --txt-owner-id option."""
    env = os.environ.copy()
    env["CF_API_TOKEN"] = api_token

    result = subprocess.run(
        [script_path, "--domain-filter", "example.com"],
        capture_output=True,
        text=True,
        check=False,
        env=env,
    )
    assert result.returncode != 0
    assert "Error" in result.stderr or "Missing option" in result.stderr
