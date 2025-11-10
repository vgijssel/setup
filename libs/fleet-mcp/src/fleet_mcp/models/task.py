"""Task domain models."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Task(BaseModel):
    """Task entity representing a work assignment given to an agent.

    Business Rules:
    1. Task message MUST NOT be empty or whitespace-only
    2. Only one task can run on an agent at a time
    3. Tasks can be canceled via interrupt signal (SIGINT)
    4. Task history persists after task completion
    """

    message: str = Field(..., min_length=1, description="Task description")
    uri: Optional[str] = Field(None, description="Optional resource reference")
    needs_user_attention: bool = Field(False, description="Requires human intervention")
    created_at: datetime

    @field_validator("message")
    @classmethod
    def validate_message_not_empty(cls, v: str) -> str:
        """Validate task message is not empty or whitespace-only."""
        if not v.strip():
            raise ValueError("Task message cannot be empty or whitespace-only")
        return v


class LogEntry(BaseModel):
    """Single log entry in a conversation log."""

    timestamp: datetime
    message: str
    level: str = Field(..., pattern=r"^(DEBUG|INFO|WARN|ERROR)$")


class TaskHistory(BaseModel):
    """Collection of task records for an agent with pagination metadata.

    Business Rules:
    1. Tasks MUST be ordered by created_at descending (newest first)
    2. Page size MUST NOT exceed 100
    3. Page numbers are 1-indexed
    4. Empty histories return empty tasks list with total_count=0
    """

    agent_name: str
    tasks: list[Task] = Field(default_factory=list)
    total_count: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1, le=100)

    @field_validator("page_size")
    @classmethod
    def validate_page_size(cls, v: int) -> int:
        """Validate page size does not exceed 100."""
        if v > 100:
            raise ValueError("Page size cannot exceed 100")
        return v

    @property
    def has_next_page(self) -> bool:
        """Check if more pages are available."""
        return (self.page * self.page_size) < self.total_count

    @property
    def has_previous_page(self) -> bool:
        """Check if previous pages exist."""
        return self.page > 1


class ConversationLog(BaseModel):
    """Collection of log entries for an agent with pagination metadata.

    Business Rules:
    1. Logs MUST be ordered by timestamp descending (newest first)
    2. Page size MUST NOT exceed 100
    3. Default page size is 1 (show only latest entry)
    4. Page numbers are 1-indexed
    """

    agent_name: str
    logs: list[LogEntry] = Field(default_factory=list)
    total_count: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    page_size: int = Field(default=1, ge=1, le=100)

    @field_validator("page_size")
    @classmethod
    def validate_page_size(cls, v: int) -> int:
        """Validate page size does not exceed 100."""
        if v > 100:
            raise ValueError("Page size cannot exceed 100")
        return v

    @property
    def has_next_page(self) -> bool:
        """Check if more pages are available."""
        return (self.page * self.page_size) < self.total_count

    @property
    def has_previous_page(self) -> bool:
        """Check if previous pages exist."""
        return self.page > 1
