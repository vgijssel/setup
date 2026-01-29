#!/usr/bin/env python3
"""
Coder Log Streamer for Devcontainer Build Process

This script streams build logs from devcontainer CLI to the Coder workspace UI.
It uses the Coder API to register a log source and stream log entries
in batches for efficient transmission.

API Reference:
- POST /api/v2/workspaceagents/me/log-source - Register log source
- PATCH /api/v2/workspaceagents/me/logs - Stream log entries
"""

import argparse
import json
import os
import select
import sys
import time
import uuid
from datetime import datetime, timezone
from typing import Optional

import requests


class CoderLogStreamer:
    """Streams logs to Coder workspace agent API."""

    def __init__(self, coder_url: str, agent_token: str, batch_interval: float = 1.0):
        """
        Initialize the Coder log streamer.

        Args:
            coder_url: Base URL of the Coder server (e.g., https://coder.example.com)
            agent_token: Coder workspace agent token for authentication
            batch_interval: Time in seconds between log batches (default: 1.0)
        """
        self.coder_url = coder_url.rstrip("/")
        self.agent_token = agent_token
        self.batch_interval = batch_interval
        self.log_source_id: Optional[str] = None
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Coder-Session-Token": agent_token,
                "Content-Type": "application/json",
            }
        )
        self._log_buffer: list[dict] = []
        self._last_flush = time.time()

    def register_log_source(self, display_name: str = "Devcontainer Build") -> str:
        """
        Register a log source with the Coder agent API.

        Args:
            display_name: Human-readable name for the log source

        Returns:
            The log source ID

        Raises:
            requests.HTTPError: If the API request fails
        """
        url = f"{self.coder_url}/api/v2/workspaceagents/me/log-source"
        payload = {
            "id": str(uuid.uuid4()),
            "display_name": display_name,
            "icon": "/emojis/1f4e6.png",  # Package emoji
        }

        response = self.session.post(url, json=payload)
        response.raise_for_status()

        self.log_source_id = payload["id"]
        return self.log_source_id

    def _format_timestamp(self) -> str:
        """Return current UTC timestamp in ISO 8601 format."""
        return datetime.now(timezone.utc).isoformat()

    def _add_log_entry(self, line: str, level: str = "info") -> None:
        """
        Add a log entry to the buffer.

        Args:
            line: The log message
            level: Log level (debug, info, warn, error)
        """
        entry = {
            "created_at": self._format_timestamp(),
            "output": line,
            "level": level,
        }
        self._log_buffer.append(entry)

    def _should_flush(self) -> bool:
        """Check if the log buffer should be flushed."""
        if not self._log_buffer:
            return False
        return (
            time.time() - self._last_flush >= self.batch_interval
            or len(self._log_buffer) >= 100
        )

    def flush(self) -> bool:
        """
        Flush the log buffer to the Coder API.

        Returns:
            True if flush was successful, False otherwise
        """
        if not self._log_buffer or not self.log_source_id:
            return True

        url = f"{self.coder_url}/api/v2/workspaceagents/me/logs"
        payload = {
            "log_source_id": self.log_source_id,
            "logs": self._log_buffer,
        }

        try:
            response = self.session.patch(url, json=payload)
            response.raise_for_status()
            self._log_buffer = []
            self._last_flush = time.time()
            return True
        except requests.RequestException as e:
            print(f"Warning: Failed to send logs to Coder: {e}", file=sys.stderr)
            return False

    def log(self, message: str, level: str = "info") -> None:
        """
        Add a log message and flush if needed.

        Args:
            message: The log message
            level: Log level (debug, info, warn, error)
        """
        # Also print to stdout/stderr for local visibility
        if level == "error":
            print(message, file=sys.stderr)
        else:
            print(message)

        self._add_log_entry(message, level)

        if self._should_flush():
            self.flush()

    def stream_from_stdin(self) -> None:
        """Stream logs from stdin in real-time."""
        try:
            while True:
                # Use select to check if stdin has data (with timeout)
                ready, _, _ = select.select([sys.stdin], [], [], self.batch_interval)

                if ready:
                    line = sys.stdin.readline()
                    if not line:
                        break
                    # Determine log level based on content
                    line = line.rstrip("\n")
                    level = "info"
                    lower_line = line.lower()
                    if "error" in lower_line or "fatal" in lower_line:
                        level = "error"
                    elif "warn" in lower_line:
                        level = "warn"
                    elif "debug" in lower_line:
                        level = "debug"

                    self.log(line, level)
                else:
                    # Timeout - flush any buffered logs
                    self.flush()
        finally:
            # Final flush
            self.flush()

    def stream_from_file(self, filepath: str) -> None:
        """
        Tail and stream logs from a file.

        Args:
            filepath: Path to the log file to tail
        """
        # Wait for file to exist
        while not os.path.exists(filepath):
            time.sleep(0.1)

        with open(filepath, "r") as f:
            # Seek to end
            f.seek(0, 2)

            while True:
                line = f.readline()
                if line:
                    line = line.rstrip("\n")
                    level = "info"
                    lower_line = line.lower()
                    if "error" in lower_line or "fatal" in lower_line:
                        level = "error"
                    elif "warn" in lower_line:
                        level = "warn"
                    elif "debug" in lower_line:
                        level = "debug"

                    self.log(line, level)
                else:
                    # No new content - check if we should flush
                    if self._should_flush():
                        self.flush()
                    time.sleep(0.1)


def main():
    parser = argparse.ArgumentParser(
        description="Stream logs to Coder workspace UI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Stream from stdin (pipe devcontainer output)
  devcontainer up --workspace-folder /workspaces/repo 2>&1 | python log-streamer.py

  # Stream from a file
  python log-streamer.py --file /tmp/build.log

Environment variables:
  CODER_AGENT_URL   - Coder server URL (required)
  CODER_AGENT_TOKEN - Coder agent token (required)
        """,
    )
    parser.add_argument(
        "--file",
        "-f",
        help="Path to log file to tail (default: read from stdin)",
    )
    parser.add_argument(
        "--batch-interval",
        "-b",
        type=float,
        default=1.0,
        help="Time between log batches in seconds (default: 1.0)",
    )
    parser.add_argument(
        "--source-name",
        "-n",
        default="Devcontainer Build",
        help="Display name for the log source (default: 'Devcontainer Build')",
    )

    args = parser.parse_args()

    # Get required environment variables
    coder_url = os.environ.get("CODER_AGENT_URL")
    agent_token = os.environ.get("CODER_AGENT_TOKEN")

    if not coder_url or not agent_token:
        print(
            "Error: CODER_AGENT_URL and CODER_AGENT_TOKEN environment variables are required",
            file=sys.stderr,
        )
        sys.exit(1)

    # Initialize streamer
    streamer = CoderLogStreamer(
        coder_url=coder_url,
        agent_token=agent_token,
        batch_interval=args.batch_interval,
    )

    try:
        # Register log source
        source_id = streamer.register_log_source(args.source_name)
        streamer.log(f"Registered log source: {source_id}")

        # Stream logs
        if args.file:
            streamer.log(f"Streaming logs from file: {args.file}")
            streamer.stream_from_file(args.file)
        else:
            streamer.log("Streaming logs from stdin...")
            streamer.stream_from_stdin()

    except KeyboardInterrupt:
        streamer.log("Log streaming interrupted", level="warn")
    except requests.HTTPError as e:
        streamer.log(f"HTTP Error: {e}", level="error")
        sys.exit(1)
    except Exception as e:
        streamer.log(f"Error: {e}", level="error")
        sys.exit(1)
    finally:
        streamer.flush()


if __name__ == "__main__":
    main()
