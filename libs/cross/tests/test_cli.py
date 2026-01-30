"""Tests for CLI using Click's CliRunner."""

import os
from pathlib import Path
from unittest.mock import patch

from click.testing import CliRunner
from cross.cli import cli


class TestCliHelp:
    """Tests for CLI help output."""

    def test_cli_help(self) -> None:
        """Test that --help shows required options."""
        runner = CliRunner()
        result = runner.invoke(cli, ["--help"])
        assert result.exit_code == 0
        assert "--platform" in result.output
        assert "--moon-project-id" in result.output
        assert "--moon-task-id" in result.output

    def test_cli_help_shows_envvar_info(self) -> None:
        """Test that --help mentions environment variables."""
        runner = CliRunner()
        result = runner.invoke(cli, ["--help"])
        assert result.exit_code == 0
        # Click shows env vars in help text
        assert "CROSS_PLATFORM" in result.output
        assert "MOON_PROJECT_ID" in result.output
        assert "MOON_TASK_ID" in result.output


class TestCliMissingArgs:
    """Tests for CLI with missing arguments."""

    def test_missing_all_required_args(self) -> None:
        """Test that missing required args produces error."""
        # Explicitly clear all cross-related env vars
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "",
                "MOON_PROJECT_ID": "",
                "MOON_TASK_ID": "",
            }
        )
        result = runner.invoke(cli, ["echo", "hello"])
        assert result.exit_code != 0
        assert "Missing option" in result.output or "required" in result.output.lower()

    def test_missing_platform(self) -> None:
        """Test that missing --platform produces error."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "",  # Explicitly unset
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
            }
        )
        result = runner.invoke(cli, ["echo", "hello"])
        assert result.exit_code != 0

    def test_missing_moon_project_id(self) -> None:
        """Test that missing --moon-project-id produces error."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "",  # Explicitly unset
                "MOON_TASK_ID": "build",
            }
        )
        result = runner.invoke(cli, ["echo", "hello"])
        assert result.exit_code != 0

    def test_missing_moon_task_id(self) -> None:
        """Test that missing --moon-task-id produces error."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "",  # Explicitly unset
            }
        )
        result = runner.invoke(cli, ["echo", "hello"])
        assert result.exit_code != 0

    def test_missing_command(self) -> None:
        """Test that missing command produces error."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "",
                "MOON_PROJECT_ID": "",
                "MOON_TASK_ID": "",
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            result = runner.invoke(
                cli,
                [
                    "--platform",
                    "linux/amd64",
                    "--moon-project-id",
                    "test",
                    "--moon-task-id",
                    "build",
                ],
            )
            assert result.exit_code != 0


class TestCliArgsViaCli:
    """Tests for CLI arguments provided via command line."""

    def test_all_args_via_cli(self) -> None:
        """Test providing all arguments via CLI flags."""
        runner = CliRunner(env={})
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            result = runner.invoke(
                cli,
                [
                    "--platform",
                    "linux/amd64",
                    "--moon-project-id",
                    "myproject",
                    "--moon-task-id",
                    "build",
                    "echo",
                    "hello",
                ],
            )
            # Should succeed or at least not fail due to missing args
            # (may fail for other reasons like not running on linux/amd64)
            assert "Missing option" not in result.output


class TestCliArgsViaEnvVars:
    """Tests for CLI arguments provided via environment variables."""

    def test_all_args_via_env_vars(self) -> None:
        """Test providing all arguments via environment variables."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "myproject",
                "MOON_TASK_ID": "build",
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            result = runner.invoke(cli, ["echo", "hello"])
            # Should succeed or at least not fail due to missing args
            assert "Missing option" not in result.output


class TestCliArgsPrecedence:
    """Tests for CLI arguments taking precedence over env vars."""

    def test_cli_args_override_env_vars(self) -> None:
        """Test that CLI arguments override environment variables."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/arm64",  # This should be overridden
                "MOON_PROJECT_ID": "env-project",  # This should be used
                "MOON_TASK_ID": "env-task",  # This should be used
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            # Patch platforms_match to verify the platform used
            with patch("cross.cli.platforms_match") as mock_match:
                with patch("cross.cli.detect_host_platform") as mock_detect:
                    from cross.platform import Platform

                    mock_detect.return_value = Platform(os="linux", arch="amd64")
                    mock_match.return_value = True
                    with patch("cross.cli._run_native"):
                        result = runner.invoke(
                            cli,
                            ["--platform", "linux/amd64", "echo", "test"],  # Override
                        )
                        # Verify platforms_match was called with linux/amd64, not linux/arm64
                        call_args = mock_match.call_args
                        target_platform = call_args[0][1]
                        assert target_platform.arch == "amd64"  # CLI arg, not arm64


class TestCliMoonRepoDetection:
    """Tests for Moon repository detection."""

    def test_fails_outside_moon_repo(self) -> None:
        """Test that CLI fails when run outside a Moon repository."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
            }
        )
        with runner.isolated_filesystem():
            # No .moon directory
            result = runner.invoke(cli, ["echo", "hello"])
            assert result.exit_code == 1
            assert "Not within a Moon repository" in result.output


class TestCliNestedCrossDetection:
    """Tests for nested cross-compilation detection."""

    def test_fails_when_cross_moon_set(self) -> None:
        """Test that CLI fails when CROSS_MOON=true and cross-compilation needed."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/arm64",  # Different from amd64 host
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
                "CROSS_MOON": "true",  # Already inside cross container
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            with patch("cross.cli.detect_host_platform") as mock_detect:
                from cross.platform import Platform

                # Host is amd64, target is arm64 - requires cross-compilation
                mock_detect.return_value = Platform(os="linux", arch="amd64")
                result = runner.invoke(cli, ["echo", "hello"])
                assert result.exit_code == 1
                assert "nested cross-compilation" in result.output.lower()

    def test_succeeds_when_cross_moon_set_but_platforms_match(self) -> None:
        """Test that CLI succeeds with CROSS_MOON=true when platforms match."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
                "CROSS_MOON": "true",
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            with patch("cross.cli.detect_host_platform") as mock_detect:
                with patch("cross.cli._run_native") as mock_run:
                    from cross.platform import Platform

                    # Host matches target - no cross-compilation needed
                    mock_detect.return_value = Platform(os="linux", arch="amd64")
                    result = runner.invoke(cli, ["echo", "hello"])
                    # Should succeed because platforms match (native execution)
                    mock_run.assert_called_once()


class TestCliTemplateSubstitution:
    """Tests for template variable substitution in commands."""

    def test_template_variables_substituted(self) -> None:
        """Test that {{ os }} and {{ arch }} are substituted."""
        runner = CliRunner(
            env={
                "CROSS_PLATFORM": "linux/amd64",
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            with patch("cross.cli.detect_host_platform") as mock_detect:
                with patch("cross.cli._run_native") as mock_run:
                    from cross.platform import Platform

                    mock_detect.return_value = Platform(os="linux", arch="amd64")
                    result = runner.invoke(cli, ["echo", "{{ os }}_{{ arch }}", "test"])
                    # Check that _run_native was called with substituted values
                    mock_run.assert_called_once()
                    call_args = mock_run.call_args[0][0]
                    assert call_args == ["echo", "linux_amd64", "test"]


class TestCliInvalidPlatform:
    """Tests for invalid platform format."""

    def test_invalid_platform_format(self) -> None:
        """Test that invalid platform format produces error."""
        runner = CliRunner(
            env={
                "MOON_PROJECT_ID": "test",
                "MOON_TASK_ID": "build",
            }
        )
        with runner.isolated_filesystem():
            os.makedirs(".moon")
            result = runner.invoke(
                cli,
                ["--platform", "invalid-platform", "echo", "hello"],
            )
            assert result.exit_code == 1
            assert "Invalid platform format" in result.output
