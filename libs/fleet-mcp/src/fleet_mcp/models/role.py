"""Role data model"""

from pydantic import BaseModel, Field


class Role(BaseModel):
    """Role model representing an agent role configuration"""

    name: str = Field(min_length=1)
    display_name: str
    description: str
    template_id: str
