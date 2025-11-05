"""
Secret sanitization for test fixtures.

This module removes sensitive information from recorded API responses
to ensure no secrets are committed to the repository.
"""

import json
import re
from typing import Any
from urllib.parse import urlparse


class SecretSanitizer:
    """Sanitizes secrets from recorded HTTP responses."""

    def __init__(self, base_url: str = "https://coder.example.com"):
        """
        Initialize sanitizer with base URL for normalization.

        Args:
            base_url: Normalized base URL to use in sanitized output
        """
        self.base_url = base_url.rstrip("/")
        self.hostname = urlparse(base_url).netloc

        # Forbidden patterns that should never appear in sanitized output
        self.forbidden_patterns = [
            r"coder_session_[a-zA-Z0-9_-]+",  # Coder session tokens
            r"[a-f0-9]{32,}",  # Long hex strings (potential tokens)
            r"\.ts\.net",  # Tailscale domains
            r"Bearer [a-zA-Z0-9_-]+",  # Bearer tokens
            r"ssh-[a-z0-9]+\s+AAAA[a-zA-Z0-9+/=]+",  # SSH keys
        ]

        # UUID mapping for deterministic replacement
        self.uuid_map: dict[str, str] = {}
        self.uuid_counter = 0

    def sanitize(self, data: Any) -> Any:
        """
        Recursively sanitize data structure.

        Args:
            data: Data to sanitize (dict, list, str, etc.)

        Returns:
            Sanitized copy of data
        """
        if isinstance(data, dict):
            return {key: self.sanitize(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [self.sanitize(item) for item in data]
        elif isinstance(data, str):
            return self._sanitize_string(data)
        else:
            return data

    def _sanitize_string(self, value: str) -> str:
        """
        Sanitize a string value.

        Args:
            value: String to sanitize

        Returns:
            Sanitized string
        """
        # Replace tokens
        value = re.sub(r"coder_session_[a-zA-Z0-9_-]+", "test-token-placeholder", value)

        # Replace bearer tokens
        value = re.sub(r"Bearer [a-zA-Z0-9_-]+", "Bearer test-token", value)

        # Replace SSH keys
        value = re.sub(
            r"ssh-[a-z0-9]+\s+AAAA[a-zA-Z0-9+/=]+",
            "ssh-rsa AAAAB3NzaC1yc2ETEST",
            value,
        )

        # Replace Tailscale domains
        value = re.sub(r"([a-z0-9-]+)\.ts\.net", r"\1.example.com", value)

        # Replace any actual Coder URLs with example.com
        value = self._sanitize_url(value)

        # Replace UUIDs with deterministic test IDs
        value = self._sanitize_uuid(value)

        # Normalize timestamps
        value = self._sanitize_timestamp(value)

        # Replace email addresses
        value = re.sub(
            r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "test@example.com",
            value,
        )

        return value

    def _sanitize_url(self, value: str) -> str:
        """
        Sanitize URLs in string.

        Args:
            value: String potentially containing URLs

        Returns:
            String with sanitized URLs
        """
        # Replace full URLs
        url_pattern = r"https?://[a-zA-Z0-9.-]+(:[0-9]+)?(/[^\s]*)?"
        matches = re.finditer(url_pattern, value)

        for match in matches:
            original_url = match.group(0)
            parsed = urlparse(original_url)

            # Skip if already example.com
            if "example.com" in parsed.netloc:
                continue

            # Reconstruct with example.com
            sanitized_url = f"{self.base_url}{parsed.path}"
            if parsed.query:
                sanitized_url += f"?{parsed.query}"
            if parsed.fragment:
                sanitized_url += f"#{parsed.fragment}"

            value = value.replace(original_url, sanitized_url)

        return value

    def _sanitize_uuid(self, value: str) -> str:
        """
        Replace UUIDs with deterministic test IDs.

        Args:
            value: String potentially containing UUIDs

        Returns:
            String with sanitized UUIDs
        """
        # Match UUIDs (with or without hyphens)
        uuid_pattern = (
            r"\b[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}\b"
        )
        matches = re.finditer(uuid_pattern, value, re.IGNORECASE)

        for match in matches:
            original_uuid = match.group(0)

            # Skip if already a test ID
            if original_uuid.startswith("test-"):
                continue

            # Get or create deterministic replacement
            if original_uuid not in self.uuid_map:
                self.uuid_counter += 1
                self.uuid_map[original_uuid] = f"test-uuid-{self.uuid_counter:03d}"

            value = value.replace(original_uuid, self.uuid_map[original_uuid])

        return value

    def _sanitize_timestamp(self, value: str) -> str:
        """
        Normalize ISO8601 timestamps to fixed test date.

        Args:
            value: String potentially containing timestamps

        Returns:
            String with normalized timestamps
        """
        # Match ISO8601 timestamps
        timestamp_pattern = (
            r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?"
        )
        matches = re.finditer(timestamp_pattern, value)

        test_date = "2025-01-01T00:00:00Z"

        for match in matches:
            original_ts = match.group(0)
            value = value.replace(original_ts, test_date, 1)

        return value

    def verify_no_secrets(self, data: str) -> None:
        """
        Verify that no secrets remain in sanitized data.

        Args:
            data: Sanitized data to verify

        Raises:
            ValueError: If forbidden patterns are found
        """
        # Check for common secret indicators first (more specific errors)
        if "tailscale" in data.lower() and ".ts.net" in data:
            raise ValueError("Tailscale domain leaked!")

        if "coder_session_" in data and "test-token" not in data:
            raise ValueError("Coder session token leaked!")

        # Check forbidden patterns
        for pattern in self.forbidden_patterns:
            matches = re.findall(pattern, data)
            if matches:
                # Special case: allow test tokens
                if all("test-token" in m or "test-uuid" in m for m in matches):
                    continue
                raise ValueError(
                    f"Secret leaked! Found pattern '{pattern}': {matches[:3]}"
                )


def sanitize_response(data: dict, base_url: str = "https://coder.example.com") -> dict:
    """
    Convenience function to sanitize a response dictionary.

    Args:
        data: Response data to sanitize
        base_url: Normalized base URL to use

    Returns:
        Sanitized response data
    """
    sanitizer = SecretSanitizer(base_url=base_url)
    sanitized = sanitizer.sanitize(data)

    # Verify no secrets leaked
    sanitizer.verify_no_secrets(json.dumps(sanitized))

    return sanitized
