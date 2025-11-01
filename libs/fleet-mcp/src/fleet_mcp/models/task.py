"""Task data model"""

from datetime import datetime

from pydantic import BaseModel, Field


class Task(BaseModel):
    """Task model representing work assigned to an agent"""

    message: str
    uri: str
    needs_user_attention: bool
    created_at: datetime
