"""Contract tests for /metadata endpoint response schema.

TDD Approach: These tests verify the HTTP endpoint returns data matching
the WorkspaceMetadata model schema. Written FIRST before endpoint implementation.
"""

import pytest
import respx
from httpx import AsyncClient, Response

# Mark all tests in this module as asyncio
pytestmark = pytest.mark.asyncio


async def test_metadata_endpoint_success_response_schema():
    """Test /metadata endpoint returns valid WorkspaceMetadata schema on success."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    # This test assumes the /metadata endpoint will be available at a specific URL
    # For now, we'll test the response parsing rather than the actual endpoint

    mock_response_data = {
        "data": {
            "pull_request_number": {
                "value": 819,
                "error": None,
                "schema": {
                    "description": "The number of the current pull request on GitHub",
                    "include_in_list": True,
                },
            },
            "git_branch": {
                "value": "005-workspace-metadata",
                "error": None,
                "schema": {
                    "description": "The name of the current git branch",
                    "include_in_list": False,
                },
            },
        },
        "meta": {"version": "1.0"},
    }

    # Validate response data matches WorkspaceMetadata schema
    metadata = WorkspaceMetadata.model_validate(mock_response_data)

    assert len(metadata.data) == 2
    assert "pull_request_number" in metadata.data
    assert "git_branch" in metadata.data
    assert metadata.data["pull_request_number"].value == 819
    assert metadata.data["git_branch"].value == "005-workspace-metadata"
    assert metadata.meta["version"] == "1.0"


async def test_metadata_endpoint_empty_response_schema():
    """Test /metadata endpoint returns valid schema when no metadata available."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    mock_response_data = {"data": {}, "meta": {"version": "1.0"}}

    metadata = WorkspaceMetadata.model_validate(mock_response_data)

    assert len(metadata.data) == 0
    assert metadata.meta["version"] == "1.0"


async def test_metadata_endpoint_partial_failure_schema():
    """Test /metadata endpoint schema when some fields fail."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    mock_response_data = {
        "data": {
            "pull_request_number": {
                "value": 819,
                "error": None,
                "schema": {
                    "description": "PR number",
                    "include_in_list": True,
                },
            },
            "pull_request_status": {
                "value": None,
                "error": "Command 'gh pr view' timed out",
                "schema": {
                    "description": "PR status",
                    "include_in_list": True,
                },
            },
        },
        "meta": {"version": "1.0"},
    }

    metadata = WorkspaceMetadata.model_validate(mock_response_data)

    assert metadata.data["pull_request_number"].value == 819
    assert metadata.data["pull_request_number"].error is None
    assert metadata.data["pull_request_status"].value is None
    assert (
        metadata.data["pull_request_status"].error == "Command 'gh pr view' timed out"
    )


async def test_metadata_endpoint_serialization():
    """Test /metadata endpoint response can be serialized to JSON."""
    from fleet_mcp.models.metadata import (
        MetadataField,
        MetadataSchema,
        WorkspaceMetadata,
    )

    schema = MetadataSchema(description="PR number", include_in_list=True)
    metadata = WorkspaceMetadata(
        data={"pull_request_number": MetadataField(value=819, schema=schema)}
    )

    # Serialize to dict (simulating JSON response)
    response_data = metadata.model_dump()

    assert "data" in response_data
    assert "meta" in response_data
    assert response_data["data"]["pull_request_number"]["value"] == 819
    assert response_data["meta"]["version"] == "1.0"


async def test_metadata_endpoint_field_value_types():
    """Test /metadata endpoint supports various value types."""
    from fleet_mcp.models.metadata import WorkspaceMetadata

    mock_response_data = {
        "data": {
            "string_field": {
                "value": "main",
                "error": None,
                "schema": {"description": "String value", "include_in_list": True},
            },
            "int_field": {
                "value": 123,
                "error": None,
                "schema": {"description": "Integer value", "include_in_list": True},
            },
            "bool_field": {
                "value": True,
                "error": None,
                "schema": {"description": "Boolean value", "include_in_list": False},
            },
            "list_field": {
                "value": ["tag1", "tag2"],
                "error": None,
                "schema": {"description": "List value", "include_in_list": False},
            },
        },
        "meta": {"version": "1.0"},
    }

    metadata = WorkspaceMetadata.model_validate(mock_response_data)

    assert metadata.data["string_field"].value == "main"
    assert metadata.data["int_field"].value == 123
    assert metadata.data["bool_field"].value is True
    assert metadata.data["list_field"].value == ["tag1", "tag2"]
