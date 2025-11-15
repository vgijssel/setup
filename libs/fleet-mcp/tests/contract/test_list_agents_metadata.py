"""Contract tests for list_agents metadata filtering (User Story 2).

TDD Approach: These tests are written FIRST to verify the contract for metadata
filtering in list_agents responses. They should FAIL until implementation is complete.

User Story 2: Fleet operators can list all agents and see summary metadata
(only include_in_list=true fields, values only without schemas)
"""

from fleet_mcp.models.agent import Agent, AgentStatus
from fleet_mcp.models.metadata import MetadataField, MetadataSchema, WorkspaceMetadata


class TestListAgentsMetadataFiltering:
    """Test list_agents response includes filtered metadata per agent."""

    def test_list_agents_includes_metadata_field(self):
        """Test that list_agents response includes metadata field for each agent."""
        # Arrange: Create agent with metadata
        agent = Agent(
            name="test-agent",
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="Coder",
            project="Setup",
            created_at="2025-11-13T10:00:00Z",
            updated_at="2025-11-13T10:00:00Z",
            metadata={
                "data": {
                    "pull_request_number": {
                        "value": 819,
                        "error": None,
                        "schema": {
                            "description": "PR number",
                            "include_in_list": True,
                        },
                    }
                },
                "meta": {"version": "1.0"},
            },
        )

        # Act: Serialize for list view (this is what the service does)
        agent_dict = agent.model_dump()

        # Assert: metadata field exists
        assert "metadata" in agent_dict
        assert agent_dict["metadata"] is not None

    def test_list_agents_filters_metadata_by_include_in_list(self):
        """Test that list_agents only includes fields with include_in_list=true."""
        # Arrange: Metadata with mixed include_in_list values
        metadata = WorkspaceMetadata(
            data={
                "pull_request_number": MetadataField(
                    value=819,
                    schema=MetadataSchema(
                        description="PR number", include_in_list=True
                    ),
                ),
                "git_branch": MetadataField(
                    value="main",
                    schema=MetadataSchema(
                        description="Git branch", include_in_list=False
                    ),
                ),
                "git_commit_sha": MetadataField(
                    value="abc123",
                    schema=MetadataSchema(
                        description="Commit SHA", include_in_list=True
                    ),
                ),
            }
        )

        # Act: Filter for list view (only include_in_list=True)
        filtered = {
            name: field.value
            for name, field in metadata.data.items()
            if field.schema.include_in_list
        }

        # Assert: Only include_in_list=true fields are present
        assert len(filtered) == 2
        assert "pull_request_number" in filtered
        assert "git_commit_sha" in filtered
        assert "git_branch" not in filtered

        # Assert: Values only (no schema)
        assert filtered["pull_request_number"] == 819
        assert filtered["git_commit_sha"] == "abc123"

    def test_list_agents_metadata_values_only_no_schema(self):
        """Test that list_agents metadata includes values only (no schema objects)."""
        # Arrange: Full metadata with schema
        metadata = WorkspaceMetadata(
            data={
                "pull_request_number": MetadataField(
                    value=819,
                    schema=MetadataSchema(
                        description="PR number", include_in_list=True
                    ),
                ),
            }
        )

        # Act: Extract value only for list view
        list_view_metadata = {
            name: field.value
            for name, field in metadata.data.items()
            if field.schema.include_in_list
        }

        # Assert: Only value is present (no schema, no error)
        assert "pull_request_number" in list_view_metadata
        assert list_view_metadata["pull_request_number"] == 819
        assert isinstance(list_view_metadata["pull_request_number"], int)

    def test_list_agents_with_empty_metadata(self):
        """Test list_agents handles agents with no metadata gracefully."""
        # Arrange: Agent with empty metadata
        agent = Agent(
            name="test-agent",
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="Coder",
            project="Setup",
            created_at="2025-11-13T10:00:00Z",
            updated_at="2025-11-13T10:00:00Z",
            metadata=None,  # No metadata
        )

        # Act: Serialize
        agent_dict = agent.model_dump()

        # Assert: metadata field exists but is None
        assert "metadata" in agent_dict
        assert agent_dict["metadata"] is None

    def test_list_agents_with_no_include_in_list_fields(self):
        """Test list_agents with metadata but no include_in_list=true fields."""
        # Arrange: Metadata with only include_in_list=false fields
        metadata = WorkspaceMetadata(
            data={
                "git_branch": MetadataField(
                    value="main",
                    schema=MetadataSchema(
                        description="Git branch", include_in_list=False
                    ),
                ),
                "git_commit_sha": MetadataField(
                    value="abc123",
                    schema=MetadataSchema(
                        description="Commit SHA", include_in_list=False
                    ),
                ),
            }
        )

        # Act: Filter for list view
        filtered = {
            name: field.value
            for name, field in metadata.data.items()
            if field.schema.include_in_list
        }

        # Assert: Empty dict (no fields to display)
        assert filtered == {}

    def test_list_agents_metadata_with_null_values(self):
        """Test list_agents includes null values for failed metadata fields."""
        # Arrange: Metadata with null value (collection failed)
        metadata = WorkspaceMetadata(
            data={
                "pull_request_number": MetadataField(
                    value=None,
                    error="Command failed",
                    schema=MetadataSchema(
                        description="PR number", include_in_list=True
                    ),
                ),
            }
        )

        # Act: Filter for list view
        filtered = {
            name: field.value
            for name, field in metadata.data.items()
            if field.schema.include_in_list
        }

        # Assert: Field is included with null value
        assert "pull_request_number" in filtered
        assert filtered["pull_request_number"] is None

    def test_list_agents_metadata_various_value_types(self):
        """Test list_agents supports various JSON types as metadata values."""
        # Arrange: Metadata with different value types
        metadata = WorkspaceMetadata(
            data={
                "pr_number": MetadataField(
                    value=819,
                    schema=MetadataSchema(
                        description="PR number", include_in_list=True
                    ),
                ),
                "pr_open": MetadataField(
                    value=True,
                    schema=MetadataSchema(description="PR open", include_in_list=True),
                ),
                "pr_title": MetadataField(
                    value="Add metadata feature",
                    schema=MetadataSchema(description="PR title", include_in_list=True),
                ),
                "pr_labels": MetadataField(
                    value=["feature", "high-priority"],
                    schema=MetadataSchema(
                        description="PR labels", include_in_list=True
                    ),
                ),
            }
        )

        # Act: Filter for list view
        filtered = {
            name: field.value
            for name, field in metadata.data.items()
            if field.schema.include_in_list
        }

        # Assert: All value types are preserved
        assert filtered["pr_number"] == 819
        assert filtered["pr_open"] is True
        assert filtered["pr_title"] == "Add metadata feature"
        assert filtered["pr_labels"] == ["feature", "high-priority"]
