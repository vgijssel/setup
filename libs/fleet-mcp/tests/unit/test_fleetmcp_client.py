"""Unit tests for Fleet-MCP client methods"""

import pytest
from fleet_mcp.coder.client import CoderClient


class TestFleetMCPURL:
    """Test Fleet-MCP URL construction from workspace data"""

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_constructs_correct_url(self, monkeypatch):
        """Test that Fleet-MCP URL is correctly constructed from workspace resources"""
        client = CoderClient("https://coder.example.com", "fake-token")

        # Mock workspace data
        workspace = {
            "id": "workspace-uuid-1234",
            "name": "agent-test",
            "owner_name": "testuser",
            "latest_build": {"id": "build-uuid-5678"},
        }

        # Mock workspace build resources response
        mock_resources = [
            {
                "agents": [
                    {
                        "id": "agent-1",
                        "apps": [
                            {"slug": "fleet-mcp", "display_name": "Fleet MCP"},
                            {"slug": "ccw", "display_name": "Claude Code Web"},
                        ],
                    }
                ]
            }
        ]

        async def mock_get_resources(build_id):
            return mock_resources

        monkeypatch.setattr(client, "get_workspace_build_resources", mock_get_resources)

        url = await client.get_fleetmcp_url(workspace)

        assert url is not None
        assert (
            url
            == "https://coder.example.com/@testuser/agent-test.workspace-uuid-1234/apps/fleet-mcp/"
        )

        await client.client.aclose()

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_finds_mcp_slug(self, monkeypatch):
        """Test that Fleet-MCP URL works with 'mcp' in slug"""
        client = CoderClient("https://coder.example.com", "fake-token")

        workspace = {
            "id": "ws-123",
            "name": "test-ws",
            "owner_name": "user1",
            "latest_build": {"id": "build-123"},
        }

        mock_resources = [
            {
                "agents": [
                    {"apps": [{"slug": "mcp-server", "display_name": "MCP Server"}]}
                ]
            }
        ]

        async def mock_get_resources(build_id):
            return mock_resources

        monkeypatch.setattr(client, "get_workspace_build_resources", mock_get_resources)

        url = await client.get_fleetmcp_url(workspace)

        assert url == "https://coder.example.com/@user1/test-ws.ws-123/apps/mcp-server/"

        await client.client.aclose()

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_finds_fleet_slug(self, monkeypatch):
        """Test that Fleet-MCP URL works with 'fleet' in slug"""
        client = CoderClient("https://coder.example.com", "fake-token")

        workspace = {
            "id": "ws-456",
            "name": "fleet-workspace",
            "owner_name": "user2",
            "latest_build": {"id": "build-456"},
        }

        mock_resources = [
            {
                "agents": [
                    {"apps": [{"slug": "fleet-server", "display_name": "Fleet Server"}]}
                ]
            }
        ]

        async def mock_get_resources(build_id):
            return mock_resources

        monkeypatch.setattr(client, "get_workspace_build_resources", mock_get_resources)

        url = await client.get_fleetmcp_url(workspace)

        assert (
            url
            == "https://coder.example.com/@user2/fleet-workspace.ws-456/apps/fleet-server/"
        )

        await client.client.aclose()

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_returns_none_if_not_found(self, monkeypatch):
        """Test that get_fleetmcp_url returns None if no matching app is found"""
        client = CoderClient("https://coder.example.com", "fake-token")

        workspace = {
            "id": "ws-789",
            "name": "no-fleet-ws",
            "owner_name": "user3",
            "latest_build": {"id": "build-789"},
        }

        # No matching app slugs
        mock_resources = [
            {"agents": [{"apps": [{"slug": "code-server", "display_name": "VS Code"}]}]}
        ]

        async def mock_get_resources(build_id):
            return mock_resources

        monkeypatch.setattr(client, "get_workspace_build_resources", mock_get_resources)

        url = await client.get_fleetmcp_url(workspace)

        assert url is None

        await client.client.aclose()

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_raises_on_invalid_workspace(self):
        """Test that get_fleetmcp_url raises ValueError for invalid workspace data"""
        client = CoderClient("https://coder.example.com", "fake-token")

        # Missing required fields
        invalid_workspace = {"id": "ws-999"}

        with pytest.raises(ValueError, match="Invalid workspace data"):
            await client.get_fleetmcp_url(invalid_workspace)

        await client.client.aclose()

    @pytest.mark.asyncio
    async def test_get_fleetmcp_url_raises_on_missing_build_id(self):
        """Test that get_fleetmcp_url raises ValueError if build ID is missing"""
        client = CoderClient("https://coder.example.com", "fake-token")

        # latest_build exists but has no id
        workspace = {
            "id": "ws-100",
            "name": "test",
            "owner_name": "user",
            "latest_build": {},  # Missing 'id'
        }

        with pytest.raises(ValueError, match="latest_build"):
            await client.get_fleetmcp_url(workspace)

        await client.client.aclose()
