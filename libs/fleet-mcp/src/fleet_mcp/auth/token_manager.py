"""Token generation and persistence."""

import json
import logging
import secrets
import tempfile
from datetime import datetime
from pathlib import Path

from fleet_mcp.auth.models import AccessToken

logger = logging.getLogger(__name__)


class TokenManager:
    """Manages access token generation, persistence, and loading."""

    def __init__(self, token_file_path: Path | str):
        """Initialize TokenManager with token file path.

        Args:
            token_file_path: Path to token file (e.g., ~/.fleet-mcp/auth_token)
        """
        self.token_file_path = Path(token_file_path)
        self._cached_token: AccessToken | None = None

    def _generate_token(self) -> str:
        """Generate cryptographically secure 43-character URL-safe token.

        Returns:
            43-character URL-safe base64-encoded token (256-bit entropy)
        """
        return secrets.token_urlsafe(32)

    def _ensure_token_directory(self) -> None:
        """Create token directory with 0700 permissions if it doesn't exist."""
        if not self.token_file_path.parent.exists():
            self.token_file_path.parent.mkdir(parents=True, mode=0o700, exist_ok=True)

    def _save_token(self, token_value: str) -> None:
        """Save token to file with atomic write and 0600 permissions.

        Args:
            token_value: The token string to save

        Uses atomic write (temp file + rename) to prevent corruption.
        """
        self._ensure_token_directory()

        token_data = {
            "value": token_value,
            "created_at": datetime.now().isoformat(),
        }

        # Atomic write: write to temp file, then rename
        fd, temp_path = tempfile.mkstemp(
            dir=self.token_file_path.parent, prefix=".auth_token_", suffix=".tmp"
        )
        try:
            # Write data to temp file
            with open(fd, "w") as f:
                json.dump(token_data, f, indent=2)

            # Set permissions on temp file before rename
            Path(temp_path).chmod(0o600)

            # Atomic rename
            Path(temp_path).rename(self.token_file_path)
        except Exception:
            # Clean up temp file on error
            Path(temp_path).unlink(missing_ok=True)
            raise

    def _load_token(self) -> AccessToken:
        """Load token from file and validate.

        Returns:
            AccessToken: Validated token object

        Raises:
            FileNotFoundError: If token file doesn't exist
            ValueError: If JSON is invalid
            ValidationError: If token format is invalid
        """
        if not self.token_file_path.exists():
            raise FileNotFoundError(f"Token file not found: {self.token_file_path}")

        try:
            data = json.loads(self.token_file_path.read_text())
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in token file: {e}") from e

        # Pydantic will validate token format
        return AccessToken(
            value=data["value"], created_at=datetime.fromisoformat(data["created_at"])
        )

    def get_or_create_token(self) -> AccessToken:
        """Get existing token or generate new one.

        Returns:
            AccessToken: Existing or newly generated token

        This is the main entry point for token management:
        - First call: Generates and persists new token
        - Subsequent calls: Loads token from file
        - Token is cached in memory after first load
        """
        # Return cached token if available
        if self._cached_token is not None:
            return self._cached_token

        # Try to load existing token
        if self.token_file_path.exists():
            logger.info(f"Loading token from {self.token_file_path}")
            self._cached_token = self._load_token()
            return self._cached_token

        # Generate new token
        logger.info("Generating new access token")
        token_value = self._generate_token()

        # Log token to stdout for distribution
        logger.info(f"Token: {token_value}")

        # Save to file
        self._save_token(token_value)
        logger.info(f"Token saved to {self.token_file_path}")

        # Create and cache AccessToken object
        self._cached_token = self._load_token()
        return self._cached_token
