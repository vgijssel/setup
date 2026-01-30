"""Tests for command runner."""

import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from coder_logstream_process.runner import CommandRunner


class TestCommandRunner:
    """Tests for CommandRunner class."""

    @pytest.mark.asyncio
    async def test_runs_command_without_client(self):
        """Test that commands run without a Coder client."""
        runner = CommandRunner(client=None, buffer_interval=0.1)

        exit_code = await runner.run("echo hello")

        assert exit_code == 0

    @pytest.mark.asyncio
    async def test_preserves_exit_code(self):
        """Test that exit codes are preserved."""
        runner = CommandRunner(client=None, buffer_interval=0.1)

        exit_code = await runner.run("exit 42")

        assert exit_code == 42

    @pytest.mark.asyncio
    async def test_captures_stdout(self, capsys):
        """Test that stdout is captured and printed."""
        runner = CommandRunner(client=None, buffer_interval=0.1)

        await runner.run("echo 'test output'")

        captured = capsys.readouterr()
        assert "test output" in captured.out

    @pytest.mark.asyncio
    async def test_captures_stderr(self, capsys):
        """Test that stderr is captured and printed."""
        runner = CommandRunner(client=None, buffer_interval=0.1)

        await runner.run("echo 'error output' >&2")

        captured = capsys.readouterr()
        assert "error output" in captured.out  # Both go to stdout via print

    @pytest.mark.asyncio
    async def test_sends_logs_to_client(self):
        """Test that logs are sent to the Coder client."""
        mock_client = AsyncMock()
        mock_client.send_logs = AsyncMock(return_value=True)

        runner = CommandRunner(client=mock_client, buffer_interval=0.1)
        await runner.run("echo 'test log'")

        # Give time for flush
        await asyncio.sleep(0.2)

        # Logs should have been sent
        assert mock_client.send_logs.called

    @pytest.mark.asyncio
    async def test_continues_on_client_error(self, capsys):
        """Test that command continues even if client fails."""
        mock_client = AsyncMock()
        mock_client.send_logs = AsyncMock(side_effect=Exception("API error"))

        runner = CommandRunner(client=mock_client, buffer_interval=0.1)
        exit_code = await runner.run("echo 'still works'")

        assert exit_code == 0
        captured = capsys.readouterr()
        assert "still works" in captured.out


class TestBufferInterval:
    """Tests for buffer interval behavior."""

    @pytest.mark.asyncio
    async def test_respects_buffer_interval(self):
        """Test that logs are buffered according to interval."""
        mock_client = AsyncMock()
        mock_client.send_logs = AsyncMock(return_value=True)

        # Use longer interval
        runner = CommandRunner(client=mock_client, buffer_interval=0.5)

        # Run a quick command
        await runner.run("echo line1; echo line2")

        # Logs should be batched
        assert mock_client.send_logs.called
        # Should have fewer calls than lines due to batching
        # (exact number depends on timing)

    @pytest.mark.asyncio
    async def test_flushes_on_completion(self):
        """Test that remaining logs are flushed when command completes."""
        mock_client = AsyncMock()
        mock_client.send_logs = AsyncMock(return_value=True)

        # Use very long interval that won't naturally trigger
        runner = CommandRunner(client=mock_client, buffer_interval=10.0)

        # Run a quick command
        await runner.run("echo 'final log'")

        # Logs should still be sent (via final flush)
        assert mock_client.send_logs.called
