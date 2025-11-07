"""Project and Role domain models."""

from typing import Optional

from pydantic import BaseModel, Field


class Project(BaseModel):
    """Project entity representing a template configuration for creating agents.

    Business Rules:
    1. A Coder template is only considered a valid project if it has a display_name set
    2. The project name field maps directly to the Coder template's display_name
    3. Projects MUST have ai_prompt and system_prompt rich parameters to be valid fleet-mcp projects
    """

    id: str = Field(..., description="Coder template UUID")
    name: str = Field(..., description="Project name from Coder template display_name")
    description: Optional[str] = Field(None, description="Project description")


class Role(BaseModel):
    """Role entity representing a workspace preset that defines agent capabilities.

    Business Rules:
    1. Roles are defined per-project as coder_workspace_preset resources
    2. The role name field maps directly to the coder_workspace_preset name
    3. Role names MUST exist in the project's template definition
    4. Each role may have different resource allocations or permissions
    """

    id: str = Field(..., description="Coder workspace preset UUID")
    name: str = Field(..., description="Role name from coder_workspace_preset name")
    project_id: str = Field(..., description="Associated project (template) UUID")
    project_name: str = Field(..., description="Associated project name")
