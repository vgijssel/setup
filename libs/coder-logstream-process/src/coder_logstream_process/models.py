"""Pydantic models for Coder API requests."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

# The statically-defined log source ID that appears as "External" in the Coder dashboard
# This matches what envbuilder uses
EXTERNAL_LOG_SOURCE_ID = UUID("3b579bf4-1ed8-4b99-87a8-e9a1e3410410")


class LogEntry(BaseModel):
    """A single log entry to send to Coder API."""

    created_at: datetime
    output: str
    level: Literal["trace", "debug", "info", "warn", "error"]
    source_id: UUID = Field(default=EXTERNAL_LOG_SOURCE_ID)


class LogBatch(BaseModel):
    """A batch of log entries to send to Coder API."""

    logs: list[LogEntry]
