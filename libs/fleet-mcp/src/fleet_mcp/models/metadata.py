"""Metadata domain models.

Defines workspace metadata structure for the fleet-mcp system.
Metadata fields are dynamically defined via Taskfile tasks with a 'meta' key.
"""

from typing import Any, Optional

from pydantic import BaseModel, Field


class MetadataSchema(BaseModel):
    """Schema definition for a metadata field.

    Describes the metadata field's purpose and display rules without
    containing the actual value.
    """

    description: str = Field(
        ...,
        min_length=1,
        description="Human-readable description of what this field represents",
    )
    include_in_list: bool = Field(
        default=False,
        description="Whether to include this field in list_agents response",
    )


class MetadataField(BaseModel):
    """A single metadata field with its value, error, and schema.

    Represents one piece of workspace metadata (e.g., git branch, PR number).
    The value may be null if the metadata could not be collected.
    The error field is populated when collection fails.

    Business Rules:
    - value=None AND error=None: Field was not collected (Taskfile missing)
    - value=None AND error!=None: Collection failed with error
    - value!=None AND error=None: Successful collection
    - value can be any JSON-serializable type (str, int, bool, list, dict)
    """

    value: Optional[Any] = Field(
        default=None, description="The actual metadata value, or null if unavailable"
    )
    error: Optional[str] = Field(
        default=None, description="Error message if collection failed, null on success"
    )
    schema: MetadataSchema = Field(..., description="Schema describing this field")


class WorkspaceMetadata(BaseModel):
    """Complete metadata for a workspace.

    Contains all metadata fields collected from the workspace's Taskfile.
    Fields are dynamically defined by the Taskfile, not hardcoded.

    Business Rules:
    - Field names (dict keys) MUST match Taskfile task names
    - Empty `data` dict indicates no metadata available (Taskfile missing/failed)
    - `meta.version` tracks metadata schema version for future compatibility
    """

    data: dict[str, MetadataField] = Field(
        default_factory=dict, description="Map of field names to metadata fields"
    )
    meta: dict[str, str] = Field(
        default_factory=lambda: {"version": "1.0"},
        description="Metadata about the metadata (version, etc.)",
    )
