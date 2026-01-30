"""Coder API client for log streaming."""

import logging
import time
from datetime import datetime, timezone

import httpx

from .models import EXTERNAL_LOG_SOURCE_ID, LogBatch, LogEntry

logger = logging.getLogger(__name__)

# Maximum request size for log batches (1MB)
MAX_REQUEST_SIZE = 1024 * 1024


class CoderClient:
    """Client for streaming logs to Coder Agent API."""

    def __init__(
        self,
        agent_url: str,
        agent_token: str,
        source_id: str = str(EXTERNAL_LOG_SOURCE_ID),
    ) -> None:
        """Initialize the Coder client.

        Args:
            agent_url: Base URL of the Coder agent API
            agent_token: Agent authentication token
            source_id: Log source UUID (defaults to External)
        """
        self.agent_url = agent_url.rstrip("/")
        self.agent_token = agent_token
        self.source_id = source_id
        self._client: httpx.AsyncClient | None = None

    async def __aenter__(self) -> "CoderClient":
        """Enter async context and create HTTP client."""
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(30.0),
            headers={"Coder-Session-Token": self.agent_token},
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        """Exit async context and close HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def send_logs(self, entries: list[LogEntry]) -> bool:
        """Send a batch of log entries to the Coder API.

        Args:
            entries: List of log entries to send

        Returns:
            True if logs were sent successfully, False otherwise
        """
        if not entries:
            return True

        if not self._client:
            logger.error("Client not initialized - use async context manager")
            return False

        batch = LogBatch(logs=entries)
        url = f"{self.agent_url}/api/v2/workspaceagents/me/logs"

        # Serialize to JSON for size checking
        payload = batch.model_dump(mode="json")

        logger.debug("Sending %d logs to %s", len(entries), url)

        start_time = time.monotonic()
        try:
            response = await self._send_with_retry(url, payload)
            elapsed = time.monotonic() - start_time
            logger.debug(
                "PATCH %s -> %d (%.2fms)", url, response.status_code, elapsed * 1000
            )

            if response.status_code >= 400:
                logger.error(
                    "Failed to send logs: HTTP %d - %s",
                    response.status_code,
                    response.text,
                )
                return False

            # Log payload preview at INFO level
            if logger.isEnabledFor(logging.INFO):
                preview = self._format_log_preview(entries)
                logger.info("Sent %d logs: %s", len(entries), preview)

            return True

        except httpx.HTTPError as e:
            elapsed = time.monotonic() - start_time
            logger.error("HTTP error sending logs (%.2fms): %s", elapsed * 1000, e)
            return False

    async def _send_with_retry(
        self,
        url: str,
        payload: dict,
        max_retries: int = 3,
        base_delay: float = 0.5,
    ) -> httpx.Response:
        """Send request with exponential backoff retry.

        Args:
            url: Request URL
            payload: JSON payload
            max_retries: Maximum number of retries
            base_delay: Base delay in seconds for exponential backoff

        Returns:
            HTTP response

        Raises:
            httpx.HTTPError: If all retries fail
        """
        last_exception: httpx.HTTPError | None = None

        for attempt in range(max_retries + 1):
            try:
                response = await self._client.patch(url, json=payload)

                # Don't retry client errors (4xx)
                if response.status_code < 500:
                    return response

                # Retry server errors (5xx)
                if attempt < max_retries:
                    delay = base_delay * (2**attempt)
                    logger.warning(
                        "Server error %d, retrying in %.1fs (attempt %d/%d)",
                        response.status_code,
                        delay,
                        attempt + 1,
                        max_retries,
                    )
                    await self._sleep(delay)
                else:
                    return response

            except httpx.HTTPError as e:
                last_exception = e
                if attempt < max_retries:
                    delay = base_delay * (2**attempt)
                    logger.warning(
                        "Request failed, retrying in %.1fs (attempt %d/%d): %s",
                        delay,
                        attempt + 1,
                        max_retries,
                        e,
                    )
                    await self._sleep(delay)

        if last_exception:
            raise last_exception

        # Should not reach here
        raise httpx.HTTPError("All retries failed")

    async def _sleep(self, seconds: float) -> None:
        """Sleep for the given duration (allows mocking in tests)."""
        import asyncio

        await asyncio.sleep(seconds)

    def _format_log_preview(self, entries: list[LogEntry], max_chars: int = 200) -> str:
        """Format a preview of log entries for logging.

        Args:
            entries: Log entries to preview
            max_chars: Maximum characters to show

        Returns:
            Truncated preview string
        """
        combined = " ".join(e.output.strip() for e in entries)
        if len(combined) > max_chars:
            return combined[: max_chars - 3] + "..."
        return combined

    def create_log_entry(
        self,
        output: str,
        level: str = "info",
        timestamp: datetime | None = None,
    ) -> LogEntry:
        """Create a log entry with the configured source ID.

        Args:
            output: Log message text
            level: Log level (info, error, etc.)
            timestamp: Optional timestamp (defaults to now)

        Returns:
            LogEntry instance
        """
        from uuid import UUID

        return LogEntry(
            created_at=timestamp or datetime.now(timezone.utc),
            output=output,
            level=level,
            source_id=UUID(self.source_id),
        )
