"""Integration tests for metadata extraction - User Story 1"""

from fleet_mcp.models.agent import Agent


# T041: Test metadata extraction from workspace
def test_metadata_extraction_from_workspace():
    """Test Agent.from_workspace correctly extracts fleet_mcp_* metadata"""
    # Mock workspace data from Coder API
    workspace = {
        "id": "workspace-123",
        "name": "agent-test",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "running"},
    }

    # Mock agent metadata from watch-metadata endpoint
    agent_metadata = {
        "15_agent_name": "test",
        "13_agent_role": "coder",
        "14_agent_project": "Setup",
        "11_agent_spec": "Test specification",
        "12_current_task": "Working on feature",
        "8_pull_request_url": "https://github.com/org/repo/pull/123",
        "0_cpu_usage": "10%",  # Should be filtered out (not in key_mapping)
    }

    agent = Agent.from_workspace(workspace, agent_metadata)

    # Verify core fields
    assert agent.name == "test"
    assert agent.workspace_id == "workspace-123"
    assert agent.role == "coder"
    assert agent.project == "Setup"
    assert agent.spec == "Test specification"
    assert agent.current_task == "Working on feature"

    # Verify status derivation (running + current_task = busy)
    assert agent.status == "busy"

    # Verify metadata filtering (only fleet_mcp_* fields)
    assert "fleet_mcp_agent_name" in agent.metadata
    assert "fleet_mcp_role" in agent.metadata
    assert "fleet_mcp_pull_request_url" in agent.metadata
    assert "0_cpu_usage" not in agent.metadata  # Filtered out


def test_metadata_extraction_idle_agent():
    """Test status derivation for idle agent (no current_task)"""
    workspace = {
        "id": "workspace-456",
        "name": "agent-idle",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "running"},
        "metadata": {
            "fleet_mcp_agent_name": "idle-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Test specification",
            "fleet_mcp_current_task": None,  # No current task
        },
    }

    agent = Agent.from_workspace(workspace)

    # Idle agent: running workspace + no current_task
    assert agent.status == "idle"
    assert agent.current_task is None


def test_metadata_extraction_offline_agent():
    """Test status derivation for offline agent (stopped workspace)"""
    workspace = {
        "id": "workspace-789",
        "name": "agent-offline",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "stopped"},
        "metadata": {
            "fleet_mcp_agent_name": "offline-agent",
            "fleet_mcp_role": "operator",
            "fleet_mcp_project": "DataOne",
            "fleet_mcp_agent_spec": "Test specification",
        },
    }

    agent = Agent.from_workspace(workspace)

    # Offline agent: workspace not running
    assert agent.status == "stopped"


# ============================================================================
# User Story 3: PR Integration Tests
# ============================================================================


# T072: Test reading PR metadata from workspace
def test_pr_metadata_extraction():
    """Test that PR-related metadata is correctly extracted from workspace"""
    workspace = {
        "id": "workspace-pr-test",
        "name": "agent-with-pr",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "running"},
    }

    # Mock agent metadata from watch-metadata endpoint
    agent_metadata = {
        "15_agent_name": "pr-agent",
        "13_agent_role": "coder",
        "14_agent_project": "Setup",
        "11_agent_spec": "Implement feature X",
        "12_current_task": "Creating PR for feature X",
        "8_pull_request_url": "https://github.com/org/repo/pull/456",
        "9_pull_request_status": "open",
        "10_pull_request_check_status": "passing",
    }

    agent = Agent.from_workspace(workspace, agent_metadata)

    # Verify PR metadata is present in agent.metadata
    assert "fleet_mcp_pull_request_url" in agent.metadata
    assert (
        agent.metadata["fleet_mcp_pull_request_url"]
        == "https://github.com/org/repo/pull/456"
    )
    assert agent.metadata["fleet_mcp_pull_request_status"] == "open"
    assert agent.metadata["fleet_mcp_pull_request_check_status"] == "passing"


# T073: Test filtering metadata by fleet_mcp_ prefix
def test_metadata_filtering_with_pr_fields():
    """Test that only fleet_mcp_* fields are included in metadata"""
    from fleet_mcp.coder.metadata import filter_fleet_metadata

    workspace_metadata = {
        "fleet_mcp_agent_name": "test-agent",
        "fleet_mcp_role": "coder",
        "fleet_mcp_pull_request_url": "https://github.com/org/repo/pull/789",
        "fleet_mcp_pull_request_status": "merged",
        "coder_workspace_owner": "user123",  # Should be filtered out
        "random_field": "value",  # Should be filtered out
        "fleet_mcp_custom_field": "custom",  # Should be included
    }

    filtered = filter_fleet_metadata(workspace_metadata)

    # Only fleet_mcp_* fields should be present
    assert "fleet_mcp_agent_name" in filtered
    assert "fleet_mcp_role" in filtered
    assert "fleet_mcp_pull_request_url" in filtered
    assert "fleet_mcp_pull_request_status" in filtered
    assert "fleet_mcp_custom_field" in filtered

    # Non-fleet_mcp fields should be excluded
    assert "coder_workspace_owner" not in filtered
    assert "random_field" not in filtered


# T075: Test metadata field inclusion in Agent model
def test_agent_model_metadata_field():
    """Test that Agent model includes metadata field with all fleet_mcp_* keys"""
    workspace = {
        "id": "workspace-metadata-test",
        "name": "agent-metadata",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "running"},
    }

    agent_metadata = {
        "15_agent_name": "metadata-agent",
        "13_agent_role": "operator",
        "14_agent_project": "DataOne",
        "11_agent_spec": "Test spec",
        "8_pull_request_url": "https://github.com/org/repo/pull/111",
    }

    agent = Agent.from_workspace(workspace, agent_metadata)

    # Verify metadata field exists and is a dict
    assert hasattr(agent, "metadata")
    assert isinstance(agent.metadata, dict)

    # Verify all fleet_mcp_* fields are in metadata
    assert agent.metadata["fleet_mcp_agent_name"] == "metadata-agent"
    assert agent.metadata["fleet_mcp_role"] == "operator"
    assert (
        agent.metadata["fleet_mcp_pull_request_url"]
        == "https://github.com/org/repo/pull/111"
    )


# T076: Test agent spec metadata visibility
def test_agent_spec_visibility_in_metadata():
    """Test that agent spec is visible in metadata dict"""
    workspace = {
        "id": "workspace-spec-test",
        "name": "agent-spec",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {"status": "running"},
    }

    agent_metadata = {
        "15_agent_name": "spec-agent",
        "13_agent_role": "manager",
        "14_agent_project": "Setup",
        "11_agent_spec": "Coordinate team and review PRs",
        "12_current_task": "Reviewing PR #123",
    }

    agent = Agent.from_workspace(workspace, agent_metadata)

    # Verify spec is accessible both as field and in metadata
    assert agent.spec == "Coordinate team and review PRs"
    assert agent.metadata["fleet_mcp_agent_spec"] == "Coordinate team and review PRs"
