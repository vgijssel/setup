"""Tests for app URL construction helper."""

from fleet_mcp.helpers.app_url import construct_app_url


class TestConstructAppUrl:
    """Test construct_app_url helper function."""

    def test_subdomain_url_construction(self):
        """Test subdomain-based URL construction."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-123",
            "name": "test-workspace",
            "owner_name": "alice",
            "latest_build": {
                "resources": [
                    {
                        "agents": [
                            {
                                "name": "main",
                            }
                        ]
                    }
                ]
            },
        }
        app = {
            "slug": "fleet-mcp",
            "url": "http://127.0.0.1:8000",
            "subdomain": True,
        }
        workspace_id = "ws-123"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        assert result == "https://8000--main--test-workspace--alice.coder.example.com/"

    def test_path_based_url_construction(self):
        """Test path-based URL construction (legacy)."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-123",
            "name": "test-workspace",
            "owner_name": "alice",
        }
        app = {
            "slug": "fleet-mcp",
            "url": "http://127.0.0.1:8000",
            "subdomain": False,
        }
        workspace_id = "ws-123"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        assert (
            result
            == "https://coder.example.com/@alice/test-workspace.ws-123/apps/fleet-mcp/"
        )

    def test_subdomain_url_with_default_port(self):
        """Test subdomain URL construction when port is not specified."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-456",
            "name": "workspace",
            "owner_name": "bob",
            "latest_build": {
                "resources": [
                    {
                        "agents": [
                            {
                                "name": "dev",
                            }
                        ]
                    }
                ]
            },
        }
        app = {
            "slug": "ccw",
            "url": "http://localhost",  # No port specified
            "subdomain": True,
        }
        workspace_id = "ws-456"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        # Should default to port 80
        assert result == "https://80--dev--workspace--bob.coder.example.com/"

    def test_subdomain_url_with_custom_agent_name(self):
        """Test subdomain URL construction with custom agent name."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-789",
            "name": "prod-workspace",
            "owner_name": "charlie",
            "latest_build": {
                "resources": [
                    {
                        "agents": [
                            {
                                "name": "production",
                            }
                        ]
                    }
                ]
            },
        }
        app = {
            "slug": "ccw",
            "url": "http://localhost:3284",
            "subdomain": True,
        }
        workspace_id = "ws-789"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        assert (
            result
            == "https://3284--production--prod-workspace--charlie.coder.example.com/"
        )

    def test_subdomain_url_with_no_agent_defaults_to_main(self):
        """Test subdomain URL defaults to 'main' agent when no agents found."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-999",
            "name": "empty-workspace",
            "owner_name": "dave",
            "latest_build": {"resources": []},  # No agents
        }
        app = {
            "slug": "fleet-mcp",
            "url": "http://127.0.0.1:8000",
            "subdomain": True,
        }
        workspace_id = "ws-999"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        # Should default to "main" agent
        assert result == "https://8000--main--empty-workspace--dave.coder.example.com/"

    def test_path_url_with_missing_owner_defaults_to_me(self):
        """Test path-based URL defaults to 'me' when owner_name is missing."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-111",
            "name": "test",
            # owner_name missing
        }
        app = {
            "slug": "app",
            "url": "http://localhost:8080",
            "subdomain": False,
        }
        workspace_id = "ws-111"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        assert result == "https://coder.example.com/@me/test.ws-111/apps/app/"

    def test_subdomain_url_with_missing_owner_defaults_to_me(self):
        """Test subdomain URL defaults to 'me' when owner_name is missing."""
        base_url = "https://coder.example.com"
        workspace = {
            "id": "ws-222",
            # name and owner_name missing
            "latest_build": {
                "resources": [
                    {
                        "agents": [
                            {
                                "name": "main",
                            }
                        ]
                    }
                ]
            },
        }
        app = {
            "slug": "app",
            "url": "http://localhost:8080",
            "subdomain": True,
        }
        workspace_id = "ws-222"

        result = construct_app_url(base_url, workspace, app, workspace_id)

        assert result == "https://8080--main--unknown--me.coder.example.com/"
