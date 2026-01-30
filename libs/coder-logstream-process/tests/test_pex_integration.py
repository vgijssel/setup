"""Integration tests for the built PEX file."""

import os
import subprocess

import pytest


def get_pex_path() -> str:
    """Get the path to the built pex file."""
    return os.path.join(
        os.path.dirname(__file__), "..", "dist", "coder-logstream-process.pex"
    )


@pytest.mark.integration
class TestPexHelp:
    """Tests for PEX help output."""

    def test_pex_help_shows_options(self):
        """Test that the built pex file shows help with all options."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip(
                "PEX file not built yet - run 'moon run coder-logstream-process:build' first"
            )

        result = subprocess.run(
            [pex_path, "--help"],
            capture_output=True,
            text=True,
        )

        assert result.returncode == 0
        assert "--agent-url" in result.stdout
        assert "--agent-token" in result.stdout
        assert "--buffer-interval" in result.stdout
        assert "--log-level" in result.stdout
        assert "CODER_AGENT_URL" in result.stdout


@pytest.mark.integration
class TestPexExecution:
    """Tests for PEX command execution."""

    def test_pex_executes_simple_command(self):
        """Test that the pex file can execute simple commands."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "echo 'Hello from pex test'"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        assert result.returncode == 0
        assert "Hello from pex test" in result.stdout

    def test_pex_preserves_exit_code_zero(self):
        """Test that the pex preserves exit code 0."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "true"],
            capture_output=True,
            text=True,
        )

        assert result.returncode == 0

    def test_pex_preserves_exit_code_42(self):
        """Test that the pex preserves exit code 42."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "exit 42"],
            capture_output=True,
            text=True,
        )

        assert result.returncode == 42

    def test_pex_preserves_exit_code_1(self):
        """Test that the pex preserves exit code 1."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "exit 1"],
            capture_output=True,
            text=True,
        )

        assert result.returncode == 1


@pytest.mark.integration
class TestPexWithCredentials:
    """Tests for PEX with Coder credentials."""

    def test_pex_runs_without_credentials(self):
        """Test that pex runs commands even without credentials."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        # Explicitly clear credentials
        env = os.environ.copy()
        env.pop("CODER_AGENT_URL", None)
        env.pop("CODER_AGENT_TOKEN", None)

        result = subprocess.run(
            [pex_path, "echo 'works without creds'"],
            capture_output=True,
            text=True,
            env=env,
            timeout=30,
        )

        assert result.returncode == 0
        assert "works without creds" in result.stdout
        # Should have warning about missing credentials
        assert "not set" in result.stderr or "logs will not be shipped" in result.stderr

    def test_pex_with_buffer_interval(self):
        """Test that buffer interval option works."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "--buffer-interval", "0.1", "echo 'quick'"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        assert result.returncode == 0
        assert "quick" in result.stdout

    def test_pex_with_log_level_debug(self):
        """Test that log level option works."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "--log-level", "DEBUG", "echo 'debug mode'"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        assert result.returncode == 0
        assert "debug mode" in result.stdout


@pytest.mark.integration
class TestPexMultilineOutput:
    """Tests for PEX with multi-line output."""

    def test_pex_captures_multiline_stdout(self):
        """Test that multi-line stdout is captured."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "echo 'line1'; echo 'line2'; echo 'line3'"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        assert result.returncode == 0
        assert "line1" in result.stdout
        assert "line2" in result.stdout
        assert "line3" in result.stdout

    def test_pex_captures_mixed_output(self):
        """Test that mixed stdout/stderr is captured."""
        pex_path = get_pex_path()

        if not os.path.exists(pex_path):
            pytest.skip("PEX file not built yet")

        result = subprocess.run(
            [pex_path, "echo 'stdout'; echo 'stderr' >&2"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        assert result.returncode == 0
        # Both stdout and stderr from the command go to stdout (via print)
        assert "stdout" in result.stdout
        assert "stderr" in result.stdout
