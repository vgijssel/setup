"""Coder API HTTP client.

Provides async HTTP client for communicating with Coder's REST API.
Handles authentication, retries, and error responses.
"""

import httpx
from typing import Any, Dict, Optional
from coder_mcp.config import Config


class CoderAPIClient:
    """Async HTTP client for Coder API.

    Wraps httpx.AsyncClient with Coder-specific authentication and error handling.
    Supports automatic retries for transient failures.
    """

    def __init__(self, config: Config):
        """Initialize Coder API client.

        Args:
            config: Configuration object with API URL and credentials.
        """
        self.base_url = config.base_url
        self.session_token = config.session_token
        self.timeout = config.timeout
        self.max_retries = config.max_retries

        # Create httpx client with authentication headers
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Coder-Session-Token": self.session_token,
                "Content-Type": "application/json",
            },
            timeout=httpx.Timeout(self.timeout),
        )

    async def get(
        self, path: str, params: Optional[Dict[str, Any]] = None, **kwargs
    ) -> httpx.Response:
        """Perform GET request to Coder API.

        Args:
            path: API endpoint path (e.g., '/api/v2/users/me').
            params: Optional query parameters.
            **kwargs: Additional arguments passed to httpx.get.

        Returns:
            HTTP response object.

        Raises:
            httpx.HTTPStatusError: If response status indicates error.
            httpx.RequestError: If request fails (network, timeout, etc.).
        """
        retries = 0
        last_exception = None

        while retries <= self.max_retries:
            try:
                response = await self._client.get(path, params=params, **kwargs)
                return response
            except (httpx.ConnectError, httpx.TimeoutException) as e:
                last_exception = e
                retries += 1
                if retries > self.max_retries:
                    raise

        # Should not reach here, but satisfy type checker
        if last_exception:
            raise last_exception
        raise RuntimeError("Unexpected retry loop exit")

    async def post(
        self,
        path: str,
        json: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        **kwargs,
    ) -> httpx.Response:
        """Perform POST request to Coder API.

        Args:
            path: API endpoint path.
            json: Optional JSON body.
            data: Optional form data.
            **kwargs: Additional arguments passed to httpx.post.

        Returns:
            HTTP response object.

        Raises:
            httpx.HTTPStatusError: If response status indicates error.
            httpx.RequestError: If request fails.
        """
        retries = 0
        last_exception = None

        while retries <= self.max_retries:
            try:
                response = await self._client.post(path, json=json, data=data, **kwargs)
                return response
            except (httpx.ConnectError, httpx.TimeoutException) as e:
                last_exception = e
                retries += 1
                if retries > self.max_retries:
                    raise

        if last_exception:
            raise last_exception
        raise RuntimeError("Unexpected retry loop exit")

    async def delete(self, path: str, **kwargs) -> httpx.Response:
        """Perform DELETE request to Coder API.

        Args:
            path: API endpoint path.
            **kwargs: Additional arguments passed to httpx.delete.

        Returns:
            HTTP response object.

        Raises:
            httpx.HTTPStatusError: If response status indicates error.
            httpx.RequestError: If request fails.
        """
        response = await self._client.delete(path, **kwargs)
        return response

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()

    async def close(self):
        """Close the HTTP client and cleanup resources."""
        await self._client.aclose()

    def __repr__(self) -> str:
        """String representation of client."""
        return f"CoderAPIClient(base_url='{self.base_url}')"
