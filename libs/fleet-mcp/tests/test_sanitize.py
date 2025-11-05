"""Unit tests for secret sanitization."""

import json

import pytest
from scripts.sanitize import SecretSanitizer, sanitize_response


class TestSecretSanitizer:
    """Tests for SecretSanitizer class."""

    def test_sanitize_coder_session_token(self):
        """Test that Coder session tokens are sanitized."""
        sanitizer = SecretSanitizer()

        data = {
            "token": "coder_session_abc123def456",
            "auth": "Bearer coder_session_xyz789",
        }

        result = sanitizer.sanitize(data)

        assert result["token"] == "test-token-placeholder"
        assert "coder_session_abc123def456" not in str(result)

    def test_sanitize_bearer_token(self):
        """Test that Bearer tokens are sanitized."""
        sanitizer = SecretSanitizer()

        data = {"authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}

        result = sanitizer.sanitize(data)

        assert result["authorization"] == "Bearer test-token"
        assert "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" not in str(result)

    def test_sanitize_ssh_key(self):
        """Test that SSH keys are sanitized."""
        sanitizer = SecretSanitizer()

        data = {"public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC... user@host"}

        result = sanitizer.sanitize(data)

        assert "ssh-rsa AAAAB3NzaC1yc2ETEST" in result["public_key"]
        assert "AAAAB3NzaC1yc2EAAAADAQABAAABgQC" not in result["public_key"]

    def test_sanitize_tailscale_domain(self):
        """Test that Tailscale domains are sanitized."""
        sanitizer = SecretSanitizer()

        data = {
            "url": "https://my-workspace.ts.net/apps/agentapi",
            "hostname": "my-workspace.ts.net",
        }

        result = sanitizer.sanitize(data)

        assert ".ts.net" not in str(result)
        assert "example.com" in result["url"]
        assert "example.com" in result["hostname"]

    def test_sanitize_url(self):
        """Test that URLs are sanitized to example.com."""
        sanitizer = SecretSanitizer(base_url="https://coder.example.com")

        data = {
            "url": "https://coder.internal.company.com/api/v2/workspaces",
            "link": "https://coder.internal.company.com:8080/workspaces/123",
        }

        result = sanitizer.sanitize(data)

        assert "https://coder.example.com/api/v2/workspaces" in result["url"]
        assert "https://coder.example.com/workspaces/123" in result["link"]
        assert "internal.company.com" not in str(result)

    def test_sanitize_uuid(self):
        """Test that UUIDs are replaced with deterministic test IDs."""
        sanitizer = SecretSanitizer()

        data = {
            "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "workspace_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "template_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        }

        result = sanitizer.sanitize(data)

        # Same UUID should get same test ID
        assert result["id"] == result["workspace_id"]
        assert result["id"].startswith("test-uuid-")

        # Different UUID should get different test ID
        assert result["template_id"] != result["id"]
        assert result["template_id"].startswith("test-uuid-")

        # Original UUIDs should be gone
        assert "f47ac10b-58cc-4372-a567-0e02b2c3d479" not in str(result)

    def test_sanitize_timestamp(self):
        """Test that timestamps are normalized."""
        sanitizer = SecretSanitizer()

        data = {
            "created_at": "2024-11-04T19:35:42.123456Z",
            "updated_at": "2024-11-04T20:00:00+00:00",
            "deleted_at": "2024-11-04T21:30:00.456Z",
        }

        result = sanitizer.sanitize(data)

        # All timestamps should be normalized to test date
        assert result["created_at"] == "2025-01-01T00:00:00Z"
        assert result["updated_at"] == "2025-01-01T00:00:00Z"
        assert result["deleted_at"] == "2025-01-01T00:00:00Z"

    def test_sanitize_email(self):
        """Test that email addresses are sanitized."""
        sanitizer = SecretSanitizer()

        data = {
            "email": "real.user@company.com",
            "owner_email": "another.user@example.org",
        }

        result = sanitizer.sanitize(data)

        assert result["email"] == "test@example.com"
        assert result["owner_email"] == "test@example.com"
        assert "company.com" not in str(result)

    def test_sanitize_nested_structure(self):
        """Test sanitization of nested data structures."""
        sanitizer = SecretSanitizer()

        data = {
            "workspace": {
                "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "owner": {
                    "email": "user@company.com",
                    "token": "coder_session_secret123",
                },
                "metadata": {
                    "url": "https://internal.company.com/workspace",
                    "created_at": "2024-11-04T19:35:42Z",
                },
            },
            "agents": [
                {
                    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                    "hostname": "agent.ts.net",
                }
            ],
        }

        result = sanitizer.sanitize(data)

        # Check nested sanitization
        assert result["workspace"]["id"].startswith("test-uuid-")
        assert result["workspace"]["owner"]["email"] == "test@example.com"
        assert result["workspace"]["owner"]["token"] == "test-token-placeholder"
        assert "example.com" in result["workspace"]["metadata"]["url"]
        assert result["workspace"]["metadata"]["created_at"] == "2025-01-01T00:00:00Z"

        # Check list sanitization
        assert result["agents"][0]["id"].startswith("test-uuid-")
        assert "example.com" in result["agents"][0]["hostname"]

    def test_verify_no_secrets_passes(self):
        """Test that verification passes for clean data."""
        sanitizer = SecretSanitizer()

        data = json.dumps(
            {
                "id": "test-uuid-001",
                "token": "test-token-placeholder",
                "url": "https://coder.example.com/workspace",
            }
        )

        # Should not raise
        sanitizer.verify_no_secrets(data)

    def test_verify_no_secrets_fails_on_token(self):
        """Test that verification fails if tokens remain."""
        sanitizer = SecretSanitizer()

        data = json.dumps(
            {
                "token": "coder_session_real_secret_123",
            }
        )

        with pytest.raises(ValueError, match="Coder session token leaked"):
            sanitizer.verify_no_secrets(data)

    def test_verify_no_secrets_fails_on_tailscale(self):
        """Test that verification fails if Tailscale domains remain."""
        sanitizer = SecretSanitizer()

        data = json.dumps(
            {
                "url": "https://my-workspace.ts.net",
            }
        )

        with pytest.raises(ValueError, match=r"Secret leaked.*\.ts\.net"):
            sanitizer.verify_no_secrets(data)

    def test_sanitize_response_convenience_function(self):
        """Test the convenience function."""
        data = {
            "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "token": "coder_session_abc123",
            "email": "user@company.com",
            "created_at": "2024-11-04T19:35:42Z",
        }

        result = sanitize_response(data)

        # Should be sanitized
        assert result["id"].startswith("test-uuid-")
        assert result["token"] == "test-token-placeholder"
        assert result["email"] == "test@example.com"
        assert result["created_at"] == "2025-01-01T00:00:00Z"

        # Should have verified (no exception raised)

    def test_real_world_workspace_response(self):
        """Test sanitization of realistic workspace response."""
        data = {
            "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "fleet-agent-test",
            "owner_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "owner_name": "john.doe",
            "template_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "template_name": "Setup",
            "latest_build": {
                "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
                "status": "running",
                "created_at": "2024-11-04T19:35:42.123456Z",
                "updated_at": "2024-11-04T19:36:15.789012Z",
                "job": {
                    "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
                    "worker_id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
                },
            },
            "metadata": {
                "fleet_mcp_agent_name": "test-agent",
                "fleet_mcp_project": "Setup",
                "fleet_mcp_created_at": "2024-11-04T19:35:00Z",
            },
            "created_at": "2024-11-04T19:35:42.123456Z",
            "updated_at": "2024-11-04T19:36:15.789012Z",
        }

        result = sanitize_response(data)

        # Check all UUIDs are sanitized consistently
        assert result["id"].startswith("test-uuid-")
        assert result["owner_id"].startswith("test-uuid-")
        assert result["template_id"].startswith("test-uuid-")
        assert result["latest_build"]["id"].startswith("test-uuid-")
        assert result["latest_build"]["job"]["id"].startswith("test-uuid-")

        # Check timestamps are normalized
        assert result["created_at"] == "2025-01-01T00:00:00Z"
        assert result["updated_at"] == "2025-01-01T00:00:00Z"
        assert result["latest_build"]["created_at"] == "2025-01-01T00:00:00Z"
        assert result["metadata"]["fleet_mcp_created_at"] == "2025-01-01T00:00:00Z"

        # Check no secrets leaked
        result_str = json.dumps(result)
        assert "f47ac10b" not in result_str
        assert "2024-11-04" not in result_str
