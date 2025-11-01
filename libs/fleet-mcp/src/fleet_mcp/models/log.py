"""Log data model for agent conversation logs"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class Log(BaseModel):
    """Log entry model representing a single message in agent conversation"""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    time: datetime = Field(alias="time")
    type: str  # "input" or "output"
    content: str
