"""Tests for CLI argument parsing."""

import os
from unittest.mock import patch

import pytest
from click.testing import CliRunner
from coder_logstream_process.cli import cli
from coder_logstream_process.models import EXTERNAL_LOG_SOURCE_ID


@pytest.fixture
def runner():
    """Create a CLI test runner."""
    return CliRunner()


class TestCliHelp:
    """Tests for CLI help output."""

    def test_help_shows_options(self, runner):
        """Test that --help shows all options."""
        result = runner.invoke(cli, ["--help"])

        assert result.exit_code == 0
        assert "--agent-url" in result.output
        assert "--agent-token" in result.output
        assert "--source-name" in result.output
        assert "--buffer-interval" in result.output
        assert "--log-level" in result.output
        assert "CODER_AGENT_URL" in result.output
        assert "CODER_AGENT_TOKEN" in result.output

    def test_help_shows_log_levels(self, runner):
        """Test that --help shows available log levels."""
        result = runner.invoke(cli, ["--help"])

        assert result.exit_code == 0
        assert "DEBUG" in result.output
        assert "INFO" in result.output
        assert "WARN" in result.output
        assert "ERROR" in result.output


class TestCliArguments:
    """Tests for CLI argument parsing."""

    def test_command_required(self, runner):
        """Test that command argument is required."""
        result = runner.invoke(cli, [])

        assert result.exit_code != 0
        assert "Missing argument" in result.output

    def test_runs_without_credentials(self, runner):
        """Test that command runs without Coder credentials."""
        # Clear any env vars that might be set
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["echo hello"], env=env)

        assert result.exit_code == 0
        assert "hello" in result.output

    def test_buffer_interval_option(self, runner):
        """Test that buffer interval can be set."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["--buffer-interval", "0.5", "echo test"], env=env)

        assert result.exit_code == 0

    def test_log_level_option(self, runner):
        """Test that log level can be set."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["--log-level", "DEBUG", "echo test"], env=env)

        assert result.exit_code == 0


class TestCliEnvironmentVariables:
    """Tests for environment variable support."""

    def test_agent_url_from_env(self, runner):
        """Test that CODER_AGENT_URL is read from environment."""
        env = {
            "CODER_AGENT_URL": "http://test.example.com",
            "CODER_AGENT_TOKEN": "",
        }

        # This should not raise an error about missing agent_url
        result = runner.invoke(cli, ["echo test"], env=env)

        assert result.exit_code == 0

    def test_agent_token_from_env(self, runner):
        """Test that CODER_AGENT_TOKEN is read from environment."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "secret-token",
        }

        result = runner.invoke(cli, ["echo test"], env=env)

        assert result.exit_code == 0

    def test_buffer_interval_from_env(self, runner):
        """Test that CODER_LOGSTREAM_BUFFER_INTERVAL is read from environment."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
            "CODER_LOGSTREAM_BUFFER_INTERVAL": "2.5",
        }

        result = runner.invoke(cli, ["echo test"], env=env)

        assert result.exit_code == 0

    def test_log_level_from_env(self, runner):
        """Test that CODER_LOGSTREAM_LOG_LEVEL is read from environment."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
            "CODER_LOGSTREAM_LOG_LEVEL": "INFO",
        }

        result = runner.invoke(cli, ["echo test"], env=env)

        assert result.exit_code == 0


class TestCliPrecedence:
    """Tests for CLI vs environment variable precedence."""

    def test_cli_arg_overrides_env_var(self, runner):
        """Test that CLI arguments take precedence over environment variables."""
        env = {
            "CODER_AGENT_URL": "http://env.example.com",
            "CODER_AGENT_TOKEN": "env-token",
            "CODER_LOGSTREAM_BUFFER_INTERVAL": "5.0",
        }

        # CLI args should override env vars
        result = runner.invoke(
            cli,
            [
                "--agent-url",
                "http://cli.example.com",
                "--buffer-interval",
                "0.1",
                "echo test",
            ],
            env=env,
        )

        assert result.exit_code == 0


class TestCliExitCodes:
    """Tests for exit code preservation."""

    def test_preserves_success_exit_code(self, runner):
        """Test that exit code 0 is preserved."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["true"], env=env)

        assert result.exit_code == 0

    def test_preserves_failure_exit_code(self, runner):
        """Test that non-zero exit codes are preserved."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["exit 42"], env=env)

        assert result.exit_code == 42

    def test_preserves_exit_code_1(self, runner):
        """Test that exit code 1 is preserved."""
        env = {
            "CODER_AGENT_URL": "",
            "CODER_AGENT_TOKEN": "",
        }

        result = runner.invoke(cli, ["exit 1"], env=env)

        assert result.exit_code == 1
