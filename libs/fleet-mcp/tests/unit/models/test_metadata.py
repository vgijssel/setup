"""Unit tests for metadata models.

TDD Approach: These tests are written FIRST, before the models are implemented.
Expected to FAIL until models are created in fleet_mcp/models/metadata.py
"""

import pytest
from pydantic import ValidationError


def test_metadata_schema_creation():
    """Test MetadataSchema model creation with required fields."""
    from fleet_mcp.models.metadata import MetadataSchema

    schema = MetadataSchema(
        description="The number of the current pull request on GitHub",
        include_in_list=True,
    )

    assert schema.description == "The number of the current pull request on GitHub"
    assert schema.include_in_list is True


def test_metadata_schema_defaults():
    """Test MetadataSchema defaults - include_in_list should default to False."""
    from fleet_mcp.models.metadata import MetadataSchema

    schema = MetadataSchema(description="Git branch name")

    assert schema.description == "Git branch name"
    assert schema.include_in_list is False


def test_metadata_schema_validation_empty_description():
    """Test MetadataSchema validation fails with empty description."""
    from fleet_mcp.models.metadata import MetadataSchema

    with pytest.raises(ValidationError) as exc_info:
        MetadataSchema(description="", include_in_list=True)

    assert "description" in str(exc_info.value)


def test_metadata_field_creation_success():
    """Test MetadataField with successful value collection."""
    from fleet_mcp.models.metadata import MetadataField, MetadataSchema

    schema = MetadataSchema(description="PR number", include_in_list=True)
    field = MetadataField(value=819, error=None, schema=schema)

    assert field.value == 819
    assert field.error is None
    assert field.schema.description == "PR number"


def test_metadata_field_creation_with_error():
    """Test MetadataField with collection error."""
    from fleet_mcp.models.metadata import MetadataField, MetadataSchema

    schema = MetadataSchema(description="PR status", include_in_list=False)
    field = MetadataField(
        value=None, error="Command 'gh pr view' failed: not found", schema=schema
    )

    assert field.value is None
    assert field.error == "Command 'gh pr view' failed: not found"
    assert field.schema.description == "PR status"


def test_metadata_field_null_values():
    """Test MetadataField with both null value and null error (not collected)."""
    from fleet_mcp.models.metadata import MetadataField, MetadataSchema

    schema = MetadataSchema(description="Optional field", include_in_list=False)
    field = MetadataField(value=None, error=None, schema=schema)

    assert field.value is None
    assert field.error is None


def test_metadata_field_various_value_types():
    """Test MetadataField accepts various JSON-serializable value types."""
    from fleet_mcp.models.metadata import MetadataField, MetadataSchema

    schema = MetadataSchema(description="Test field", include_in_list=False)

    # String value
    field_str = MetadataField(value="main", schema=schema)
    assert field_str.value == "main"

    # Integer value
    field_int = MetadataField(value=123, schema=schema)
    assert field_int.value == 123

    # Boolean value
    field_bool = MetadataField(value=True, schema=schema)
    assert field_bool.value is True

    # List value
    field_list = MetadataField(value=["tag1", "tag2"], schema=schema)
    assert field_list.value == ["tag1", "tag2"]

    # Dict value
    field_dict = MetadataField(value={"key": "value"}, schema=schema)
    assert field_dict.value == {"key": "value"}


def test_metadata_field_requires_schema():
    """Test MetadataField requires schema field."""
    from fleet_mcp.models.metadata import MetadataField

    with pytest.raises(ValidationError) as exc_info:
        MetadataField(value="test")

    assert "schema" in str(exc_info.value)


def test_workspace_metadata_creation_empty():
    """Test WorkspaceMetadata with no data (empty metadata)."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    metadata = WorkspaceMetadata()

    assert metadata.data == {}
    assert metadata.meta == {"version": "1.0"}


def test_workspace_metadata_creation_with_data():
    """Test WorkspaceMetadata with metadata fields."""
    from fleet_mcp.models.metadata import (
        MetadataField,
        MetadataSchema,
        WorkspaceMetadata,
    )

    pr_schema = MetadataSchema(description="PR number", include_in_list=True)
    branch_schema = MetadataSchema(description="Git branch", include_in_list=False)

    metadata = WorkspaceMetadata(
        data={
            "pull_request_number": MetadataField(value=819, schema=pr_schema),
            "git_branch": MetadataField(
                value="005-workspace-metadata", schema=branch_schema
            ),
        }
    )

    assert len(metadata.data) == 2
    assert metadata.data["pull_request_number"].value == 819
    assert metadata.data["git_branch"].value == "005-workspace-metadata"
    assert metadata.meta == {"version": "1.0"}


def test_workspace_metadata_with_partial_failures():
    """Test WorkspaceMetadata with some failed fields."""
    from fleet_mcp.models.metadata import (
        MetadataField,
        MetadataSchema,
        WorkspaceMetadata,
    )

    pr_schema = MetadataSchema(description="PR number", include_in_list=True)
    status_schema = MetadataSchema(description="PR status", include_in_list=True)

    metadata = WorkspaceMetadata(
        data={
            "pull_request_number": MetadataField(
                value=819, error=None, schema=pr_schema
            ),
            "pull_request_status": MetadataField(
                value=None, error="Command timeout", schema=status_schema
            ),
        }
    )

    assert metadata.data["pull_request_number"].value == 819
    assert metadata.data["pull_request_number"].error is None
    assert metadata.data["pull_request_status"].value is None
    assert metadata.data["pull_request_status"].error == "Command timeout"


def test_workspace_metadata_serialization():
    """Test WorkspaceMetadata JSON serialization."""
    from fleet_mcp.models.metadata import (
        MetadataField,
        MetadataSchema,
        WorkspaceMetadata,
    )

    schema = MetadataSchema(description="PR number", include_in_list=True)
    metadata = WorkspaceMetadata(
        data={"pull_request_number": MetadataField(value=819, schema=schema)}
    )

    json_data = metadata.model_dump()

    assert "data" in json_data
    assert "pull_request_number" in json_data["data"]
    assert json_data["data"]["pull_request_number"]["value"] == 819
    assert json_data["meta"]["version"] == "1.0"


def test_workspace_metadata_custom_meta_version():
    """Test WorkspaceMetadata with custom meta version."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    metadata = WorkspaceMetadata(meta={"version": "2.0", "custom": "field"})

    assert metadata.meta["version"] == "2.0"
    assert metadata.meta["custom"] == "field"


def test_metadata_field_schema_include_in_list_filtering():
    """Test filtering metadata fields by include_in_list flag."""
    from fleet_mcp.models.metadata import (
        MetadataField,
        MetadataSchema,
        WorkspaceMetadata,
    )

    pr_schema = MetadataSchema(description="PR number", include_in_list=True)
    branch_schema = MetadataSchema(description="Git branch", include_in_list=False)
    sha_schema = MetadataSchema(description="Commit SHA", include_in_list=True)

    metadata = WorkspaceMetadata(
        data={
            "pull_request_number": MetadataField(value=819, schema=pr_schema),
            "git_branch": MetadataField(value="main", schema=branch_schema),
            "git_commit_sha": MetadataField(value="abc123", schema=sha_schema),
        }
    )

    # Filter for list view (only include_in_list=True)
    list_fields = {
        name: field
        for name, field in metadata.data.items()
        if field.schema.include_in_list
    }

    assert len(list_fields) == 2
    assert "pull_request_number" in list_fields
    assert "git_commit_sha" in list_fields
    assert "git_branch" not in list_fields
