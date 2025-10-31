"""Task data model"""

from datetime import datetime

from pydantic import BaseModel, Field


class Task(BaseModel):
    """Task model representing work assigned to an agent"""

    message: str = Field(min_length=1)
    uri: str
    needs_user_attention: bool
    created_at: datetime
