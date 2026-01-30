"""Command execution and output streaming."""

import asyncio
import logging
from datetime import datetime, timezone

from .client import CoderClient
from .models import LogEntry

logger = logging.getLogger(__name__)


class CommandRunner:
    """Executes commands and streams output to Coder API."""

    def __init__(
        self,
        client: CoderClient | None,
        buffer_interval: float = 1.0,
    ) -> None:
        """Initialize the command runner.

        Args:
            client: Coder API client (None to disable log shipping)
            buffer_interval: Seconds to buffer logs before sending
        """
        self.client = client
        self.buffer_interval = buffer_interval
        self._queue: asyncio.Queue[LogEntry] = asyncio.Queue()
        self._flush_task: asyncio.Task | None = None
        self._stop_event: asyncio.Event = asyncio.Event()

    async def run(self, command: str) -> int:
        """Execute a command and stream its output.

        Args:
            command: Shell command to execute

        Returns:
            Exit code of the command
        """
        logger.debug("Executing command: %s", command)

        # Start the flush loop if we have a client
        if self.client:
            self._flush_task = asyncio.create_task(self._flush_loop())

        try:
            # Create subprocess
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            # Read stdout and stderr concurrently
            await asyncio.gather(
                self._read_stream(process.stdout, "info"),
                self._read_stream(process.stderr, "error"),
            )

            # Wait for process to complete
            exit_code = await process.wait()
            logger.debug("Command exited with code %d", exit_code)

            return exit_code

        finally:
            # Stop flush loop and flush remaining logs
            self._stop_event.set()
            if self._flush_task:
                await self._flush_task
            await self._final_flush()

    async def _read_stream(
        self,
        stream: asyncio.StreamReader | None,
        level: str,
    ) -> None:
        """Read from a stream and queue log entries.

        Args:
            stream: Stream to read from
            level: Log level for entries (info/error)
        """
        if stream is None:
            return

        while True:
            line = await stream.readline()
            if not line:
                break

            # Decode and print to console
            text = line.decode("utf-8", errors="replace")
            print(text, end="", flush=True)

            # Queue for API if we have a client
            if self.client:
                entry = LogEntry(
                    created_at=datetime.now(timezone.utc),
                    output=text,
                    level=level,
                )
                await self._queue.put(entry)

    async def _flush_loop(self) -> None:
        """Periodically flush buffered logs to the API."""
        buffer: list[LogEntry] = []

        while not self._stop_event.is_set():
            try:
                # Wait for item or timeout
                entry = await asyncio.wait_for(
                    self._queue.get(),
                    timeout=self.buffer_interval,
                )
                buffer.append(entry)

            except asyncio.TimeoutError:
                # Interval elapsed, flush if we have logs
                if buffer and self.client:
                    await self._send_logs(buffer)
                    buffer = []

            except asyncio.CancelledError:
                break

        # Flush any remaining logs in buffer
        if buffer and self.client:
            await self._send_logs(buffer)

    async def _final_flush(self) -> None:
        """Flush any remaining logs in the queue."""
        if not self.client:
            return

        buffer: list[LogEntry] = []
        while not self._queue.empty():
            try:
                entry = self._queue.get_nowait()
                buffer.append(entry)
            except asyncio.QueueEmpty:
                break

        if buffer:
            await self._send_logs(buffer)

    async def _send_logs(self, entries: list[LogEntry]) -> None:
        """Send logs to the API with error handling.

        Args:
            entries: Log entries to send
        """
        try:
            success = await self.client.send_logs(entries)
            if not success:
                logger.warning("Failed to send %d log entries", len(entries))
        except Exception as e:
            # Never let log shipping failures stop command execution
            logger.warning("Error sending logs: %s", e)
