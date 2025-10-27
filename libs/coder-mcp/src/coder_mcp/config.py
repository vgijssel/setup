"""Configuration module for Coder MCP server.

Loads configuration from environment variables using python-dotenv.
Validates required settings and provides defaults where appropriate.
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


class ConfigValidationError(Exception):
    """Raised when configuration validation fails."""

    pass


class Config:
    """Configuration for Coder MCP server.

    Loads settings from environment variables with .env file support.
    Validates required settings and provides sensible defaults.
    """

    def __init__(self, env_file: Optional[str] = None):
        """Initialize configuration from environment.

        Args:
            env_file: Optional path to .env file. If not provided, searches for .env
                     in current directory and parent directories.

        Raises:
            ConfigValidationError: If required configuration is missing or invalid.
        """
        # Load from .env file if it exists
        if env_file:
            load_dotenv(env_file)
        else:
            # Search for .env in current and parent directories
            load_dotenv(dotenv_path=self._find_env_file())

        # Load and validate configuration
        self.session_token = self._get_required("CODER_SESSION_TOKEN")
        self.base_url = self._get_required("CODER_URL")

        # Normalize URL format
        self.base_url = self._normalize_url(self.base_url)

        # Timeout configuration (in seconds)
        self.timeout = int(self._get_optional("CODER_TIMEOUT", "30"))

        # Retry configuration
        self.max_retries = int(self._get_optional("CODER_MAX_RETRIES", "3"))

    def _find_env_file(self) -> Optional[Path]:
        """Search for .env file in current and parent directories.

        Returns:
            Path to .env file if found, None otherwise.
        """
        current = Path.cwd()
        for parent in [current] + list(current.parents):
            env_file = parent / ".env"
            if env_file.exists():
                return env_file
        return None

    def _get_required(self, key: str) -> str:
        """Get required environment variable.

        Args:
            key: Environment variable name.

        Returns:
            Environment variable value.

        Raises:
            ConfigValidationError: If variable is not set.
        """
        value = os.environ.get(key)
        if not value:
            raise ConfigValidationError(
                f"Required environment variable {key} is not set. "
                f"Run 'nx secrets coder-mcp' to generate .env file."
            )
        return value

    def _get_optional(self, key: str, default: str) -> str:
        """Get optional environment variable with default.

        Args:
            key: Environment variable name.
            default: Default value if not set.

        Returns:
            Environment variable value or default.
        """
        return os.environ.get(key, default)

    def _normalize_url(self, url: str) -> str:
        """Normalize URL format.

        Ensures URL starts with http:// or https://.

        Args:
            url: URL to normalize.

        Returns:
            Normalized URL.
        """
        if not url.startswith("http://") and not url.startswith("https://"):
            # Assume https if no protocol specified
            url = f"https://{url}"

        # Remove trailing slash
        return url.rstrip("/")

    def __repr__(self) -> str:
        """String representation of config (without sensitive data)."""
        return (
            f"Config(base_url='{self.base_url}', "
            f"timeout={self.timeout}, "
            f"max_retries={self.max_retries})"
        )
