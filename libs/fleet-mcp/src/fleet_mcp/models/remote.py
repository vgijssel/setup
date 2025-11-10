"""Remote models representing Coder API responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkspaceBuildRemote(BaseModel):
    """Remote model for Coder API workspace build responses."""

    id: str
    status: str
    template_version_id: str
    template_version_preset_id: Optional[str] = None
    created_at: datetime


class WorkspaceRemote(BaseModel):
    """Remote model for Coder API workspace responses.

    Maps to Agent infrastructure - each workspace represents one agent.
    """

    id: str
    name: str
    template_id: str
    template_name: str
    owner_id: str
    latest_build: WorkspaceBuildRemote
    created_at: datetime
    updated_at: datetime


class TemplateParameterRemote(BaseModel):
    """Remote model for Coder API template parameter responses."""

    name: str
    description: Optional[str] = None
    type: str
    default: Optional[str] = None
    required: bool = False


class WorkspacePresetRemote(BaseModel):
    """Remote model for Coder API workspace preset responses."""

    id: str
    name: str
    template_id: str


class TemplateRemote(BaseModel):
    """Remote model for Coder API template responses.

    Maps to Project entity - templates that can create agents.
    """

    id: str
    name: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    organization_id: str
    active_version_id: str
    created_at: datetime
    updated_at: datetime
