"""Unit tests for configuration module."""

import os

import pytest
from coder_mcp.config import Config, ConfigValidationError


def test_config_loads_from_environment(monkeypatch):
    """Test that Config loads environment variables correctly."""
    monkeypatch.setenv("CODER_SESSION_TOKEN", "test-token-123")
    monkeypatch.setenv("CODER_URL", "https://test.coder.com")

    config = Config()

    assert config.session_token == "test-token-123"
    assert config.base_url == "https://test.coder.com"


def test_config_validates_missing_token(monkeypatch, tmp_path):
    """Test that Config raises error when session token is missing."""
    # Change to temp directory to avoid loading .env from project
    monkeypatch.chdir(tmp_path)
    monkeypatch.delenv("CODER_SESSION_TOKEN", raising=False)
    monkeypatch.delenv(
        "CODER_URL", raising=False
    )  # Also delete CODER_URL to avoid any .env loading

    # Explicitly pass an env_file that doesn't exist to prevent auto-discovery
    with pytest.raises(ConfigValidationError, match="CODER_SESSION_TOKEN"):
        Config(env_file=str(tmp_path / ".env.nonexistent"))


def test_config_requires_coder_url(monkeypatch, tmp_path):
    """Test that Config requires CODER_URL to be set."""
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("CODER_SESSION_TOKEN", "test-token-123")
    monkeypatch.delenv("CODER_URL", raising=False)

    # Use non-existent env file to prevent auto-discovery
    with pytest.raises(ConfigValidationError, match="CODER_URL"):
        Config(env_file=str(tmp_path / ".env.nonexistent"))


def test_config_loads_from_dotenv_file(tmp_path, monkeypatch):
    """Test that Config loads from .env file."""
    env_file = tmp_path / ".env"
    env_file.write_text(
        "CODER_SESSION_TOKEN=from-file-token\nCODER_URL=https://from-file.com"
    )

    monkeypatch.chdir(tmp_path)
    monkeypatch.delenv("CODER_SESSION_TOKEN", raising=False)
    monkeypatch.delenv("CODER_URL", raising=False)

    config = Config()

    assert config.session_token == "from-file-token"
    assert config.base_url == "https://from-file.com"


def test_config_timeout_defaults():
    """Test that Config provides sensible timeout defaults."""
    os.environ["CODER_SESSION_TOKEN"] = "test-token"
    config = Config()

    assert hasattr(config, "timeout")
    assert config.timeout > 0
    assert config.timeout <= 60


def test_config_validates_url_format(monkeypatch):
    """Test that Config validates URL format."""
    monkeypatch.setenv("CODER_SESSION_TOKEN", "test-token-123")
    monkeypatch.setenv("CODER_URL", "not-a-valid-url")

    # Should either validate or accept and normalize
    config = Config()
    assert config.base_url.startswith("http")
