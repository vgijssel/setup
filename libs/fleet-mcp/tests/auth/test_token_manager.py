"""Tests for TokenManager."""

import json
import os
import stat
from datetime import datetime
from pathlib import Path
from unittest.mock import patch

import pytest

from fleet_mcp.auth.models import AccessToken
from fleet_mcp.auth.token_manager import TokenManager


class TestTokenManager:
    """Tests for TokenManager class."""

    def test_generate_token(self, tmp_path):
        """Test token generation produces 43-character URL-safe token."""
        token_file = tmp_path / "auth_token"
        manager = TokenManager(token_file_path=token_file)

        token = manager._generate_token()

        assert len(token) == 43
        assert all(c in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-" for c in token)

    def test_ensure_token_directory_creates_with_correct_permissions(self, tmp_path):
        """Test directory creation with 0700 permissions."""
        token_file = tmp_path / "subdir" / "auth_token"
        manager = TokenManager(token_file_path=token_file)

        manager._ensure_token_directory()

        assert token_file.parent.exists()
        assert token_file.parent.is_dir()
        # Check permissions: 0o700 = rwx------
        assert stat.S_IMODE(token_file.parent.stat().st_mode) == 0o700

    def test_save_token_creates_file_with_correct_permissions(self, tmp_path):
        """Test token file creation with 0600 permissions."""
        token_file = tmp_path / "auth_token"
        manager = TokenManager(token_file_path=token_file)
        token_value = "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"

        manager._save_token(token_value)

        assert token_file.exists()
        # Check permissions: 0o600 = rw-------
        assert stat.S_IMODE(token_file.stat().st_mode) == 0o600

    def test_save_token_atomic_write(self, tmp_path):
        """Test token save uses atomic write (temp file + rename)."""
        token_file = tmp_path / "auth_token"
        manager = TokenManager(token_file_path=token_file)
        token_value = "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"

        # Save token
        manager._save_token(token_value)

        # Verify file exists with correct content
        assert token_file.exists()
        data = json.loads(token_file.read_text())
        assert data["value"] == token_value
        assert "created_at" in data

        # Verify no temp files left behind
        temp_files = list(tmp_path.glob("*.tmp"))
        assert len(temp_files) == 0

    def test_load_token_from_file(self, tmp_path):
        """Test loading token from existing file."""
        token_file = tmp_path / "auth_token"
        token_value = "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"
        created_at = datetime(2025, 11, 11, 10, 30, 0)

        # Create token file manually
        token_file.write_text(json.dumps({
            "value": token_value,
            "created_at": created_at.isoformat()
        }))
        token_file.chmod(0o600)

        manager = TokenManager(token_file_path=token_file)
        token = manager._load_token()

        assert isinstance(token, AccessToken)
        assert token.value == token_value
        assert token.created_at == created_at

    def test_load_token_invalid_json_raises_error(self, tmp_path):
        """Test loading invalid JSON raises error."""
        token_file = tmp_path / "auth_token"
        token_file.write_text("invalid json{{{")
        token_file.chmod(0o600)

        manager = TokenManager(token_file_path=token_file)

        with pytest.raises(ValueError, match="Invalid JSON"):
            manager._load_token()

    def test_load_token_invalid_token_format_raises_error(self, tmp_path):
        """Test loading malformed token raises error."""
        token_file = tmp_path / "auth_token"
        token_file.write_text(json.dumps({
            "value": "invalid_short",  # Too short
            "created_at": datetime.now().isoformat()
        }))
        token_file.chmod(0o600)

        manager = TokenManager(token_file_path=token_file)

        with pytest.raises(Exception):  # Pydantic ValidationError
            manager._load_token()

    def test_get_or_create_token_generates_when_absent(self, tmp_path):
        """Test get_or_create_token generates new token when file doesn't exist."""
        token_file = tmp_path / "auth_token"
        manager = TokenManager(token_file_path=token_file)

        token = manager.get_or_create_token()

        assert isinstance(token, AccessToken)
        assert len(token.value) == 43
        assert token_file.exists()

    def test_get_or_create_token_loads_when_present(self, tmp_path):
        """Test get_or_create_token loads existing token."""
        token_file = tmp_path / "auth_token"
        token_value = "NU7DLFd8TmGe5BnNKPq9exHlKB3OO8Z7xnXw6_zGsh0"
        created_at = datetime(2025, 11, 11, 10, 30, 0)

        # Create existing token file
        token_file.write_text(json.dumps({
            "value": token_value,
            "created_at": created_at.isoformat()
        }))
        token_file.chmod(0o600)

        manager = TokenManager(token_file_path=token_file)
        token = manager.get_or_create_token()

        # Should load existing token, not generate new one
        assert token.value == token_value
        assert token.created_at == created_at

    def test_custom_token_file_path(self, tmp_path):
        """Test TokenManager respects custom token file path."""
        custom_path = tmp_path / "custom_dir" / "my_token"
        manager = TokenManager(token_file_path=custom_path)

        token = manager.get_or_create_token()

        assert custom_path.exists()
        assert custom_path.parent.exists()
        assert isinstance(token, AccessToken)

    def test_token_logged_on_generation(self, tmp_path, caplog):
        """Test token is logged to stdout on first generation."""
        token_file = tmp_path / "auth_token"
        manager = TokenManager(token_file_path=token_file)

        with caplog.at_level("INFO"):
            token = manager.get_or_create_token()

        # Verify token value is in logs
        assert token.value in caplog.text
        assert "Generated new access token" in caplog.text or "Token:" in caplog.text
