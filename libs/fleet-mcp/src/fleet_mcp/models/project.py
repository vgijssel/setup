"""Project data model"""

from pydantic import BaseModel, Field


class Project(BaseModel):
    """Project model representing a project that agents can work on"""

    name: str = Field(min_length=1)
    display_name: str
    description: str
    template_id: str
    template_name: str
