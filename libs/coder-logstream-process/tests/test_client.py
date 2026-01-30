"""Tests for Coder API client."""

from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch
from uuid import UUID

import httpx
import pytest
from coder_logstream_process.client import CoderClient
from coder_logstream_process.models import EXTERNAL_LOG_SOURCE_ID, LogEntry


class TestCoderClient:
    """Tests for CoderClient class."""

    @pytest.fixture
    def client(self, agent_url, agent_token):
        """Create a test client."""
        return CoderClient(
            agent_url=agent_url,
            agent_token=agent_token,
        )

    @pytest.fixture
    def sample_entry(self, sample_timestamp):
        """Create a sample log entry."""
        return LogEntry(
            created_at=sample_timestamp,
            output="Test log message\n",
            level="info",
        )

    @pytest.mark.asyncio
    async def test_context_manager(self, client):
        """Test that client works as async context manager."""
        async with client:
            assert client._client is not None

        assert client._client is None

    @pytest.mark.asyncio
    async def test_send_logs_empty_list(self, client):
        """Test that sending empty list returns True."""
        async with client:
            result = await client.send_logs([])

        assert result is True

    @pytest.mark.asyncio
    async def test_send_logs_not_initialized(self, client, sample_entry):
        """Test that send_logs fails if client not initialized."""
        # Don't use context manager
        result = await client.send_logs([sample_entry])

        assert result is False

    @pytest.mark.asyncio
    async def test_create_log_entry(self, client):
        """Test creating log entries with client."""
        entry = client.create_log_entry("Test message", level="info")

        assert entry.output == "Test message"
        assert entry.level == "info"
        assert entry.source_id == UUID(client.source_id)

    @pytest.mark.asyncio
    async def test_create_log_entry_with_timestamp(self, client, sample_timestamp):
        """Test creating log entries with custom timestamp."""
        entry = client.create_log_entry(
            "Test message",
            level="error",
            timestamp=sample_timestamp,
        )

        assert entry.created_at == sample_timestamp

    def test_format_log_preview_short(self, client):
        """Test log preview formatting for short logs."""
        entries = [
            LogEntry(
                created_at=datetime.now(timezone.utc),
                output="Short message",
                level="info",
            )
        ]

        preview = client._format_log_preview(entries)

        assert preview == "Short message"

    def test_format_log_preview_long(self, client):
        """Test log preview formatting for long logs."""
        long_message = "A" * 300
        entries = [
            LogEntry(
                created_at=datetime.now(timezone.utc),
                output=long_message,
                level="info",
            )
        ]

        preview = client._format_log_preview(entries, max_chars=200)

        assert len(preview) == 200
        assert preview.endswith("...")


class TestCoderClientRetry:
    """Tests for retry logic."""

    @pytest.fixture
    def client(self, agent_url, agent_token):
        """Create a test client."""
        return CoderClient(
            agent_url=agent_url,
            agent_token=agent_token,
        )

    @pytest.fixture
    def sample_entry(self, sample_timestamp):
        """Create a sample log entry."""
        return LogEntry(
            created_at=sample_timestamp,
            output="Test log message\n",
            level="info",
        )

    @pytest.mark.asyncio
    async def test_retry_on_server_error(self, client, sample_entry):
        """Test that 5xx errors are retried."""
        mock_response_500 = AsyncMock()
        mock_response_500.status_code = 500
        mock_response_500.text = "Server error"

        mock_response_200 = AsyncMock()
        mock_response_200.status_code = 200

        async with client:
            # First call returns 500, second returns 200
            mock_patch = AsyncMock(side_effect=[mock_response_500, mock_response_200])
            client._client.patch = mock_patch
            client._sleep = AsyncMock()  # Skip actual sleep

            result = await client.send_logs([sample_entry])

            assert result is True
            assert mock_patch.call_count == 2

    @pytest.mark.asyncio
    async def test_no_retry_on_client_error(self, client, sample_entry):
        """Test that 4xx errors are not retried."""
        mock_response = AsyncMock()
        mock_response.status_code = 401
        mock_response.text = "Unauthorized"

        async with client:
            mock_patch = AsyncMock(return_value=mock_response)
            client._client.patch = mock_patch

            result = await client.send_logs([sample_entry])

            assert result is False
            assert mock_patch.call_count == 1

    @pytest.mark.asyncio
    async def test_retry_on_connection_error(self, client, sample_entry):
        """Test that connection errors are retried."""
        mock_response = AsyncMock()
        mock_response.status_code = 200

        async with client:
            # First two calls fail, third succeeds
            mock_patch = AsyncMock(
                side_effect=[
                    httpx.ConnectError("Connection failed"),
                    httpx.ConnectError("Connection failed"),
                    mock_response,
                ]
            )
            client._client.patch = mock_patch
            client._sleep = AsyncMock()  # Skip actual sleep

            result = await client.send_logs([sample_entry])

            assert result is True
            assert mock_patch.call_count == 3


class TestLogEntry:
    """Tests for LogEntry model."""

    def test_default_source_id(self):
        """Test that default source ID is External."""
        entry = LogEntry(
            created_at=datetime.now(timezone.utc),
            output="Test",
            level="info",
        )

        assert entry.source_id == EXTERNAL_LOG_SOURCE_ID

    def test_custom_source_id(self):
        """Test setting custom source ID."""
        custom_id = UUID("11111111-1111-1111-1111-111111111111")
        entry = LogEntry(
            created_at=datetime.now(timezone.utc),
            output="Test",
            level="info",
            source_id=custom_id,
        )

        assert entry.source_id == custom_id

    def test_valid_levels(self):
        """Test that all valid levels are accepted."""
        for level in ["trace", "debug", "info", "warn", "error"]:
            entry = LogEntry(
                created_at=datetime.now(timezone.utc),
                output="Test",
                level=level,
            )
            assert entry.level == level
