"""HTTP client for fetching metadata from agent workspaces.

This client makes HTTP GET requests to agent-specific /metadata endpoints
to retrieve workspace metadata (git branch, PR number, etc.).
"""

import logging
from typing import Optional

import httpx
from pydantic import ValidationError

from ..models.metadata import WorkspaceMetadata

logger = logging.getLogger(__name__)


class MetadataClient:
    """HTTP client for fetching workspace metadata from agent endpoints.

    Each agent workspace runs its own fleet-mcp app instance that exposes
    a /metadata endpoint. This client fetches metadata from those endpoints.

    Error Handling:
    - HTTP 404: Returns empty metadata (agent app not running)
    - HTTP 5xx: Returns empty metadata (server error)
    - Timeout: Returns empty metadata (agent not responding)
    - Connection error: Returns empty metadata (network issue)
    - Invalid JSON: Returns empty metadata (malformed response)
    """

    def __init__(
        self, timeout: float = 10.0, coder_session_token: Optional[str] = None
    ):
        """Initialize MetadataClient.

        Args:
            timeout: Request timeout in seconds (default: 10.0)
            coder_session_token: Optional Coder session token for authenticated requests.
                Required when fetching metadata from Coder proxy URLs to avoid 303 redirects.
        """
        self.timeout = timeout
        self.coder_session_token = coder_session_token

    async def get_metadata(self, url: str) -> WorkspaceMetadata:
        """Fetch metadata from agent's /metadata endpoint.

        Args:
            url: Full URL to the /metadata endpoint
                Example: https://coder.example.com/@alice/ws.123/apps/fleet-mcp/metadata

        Returns:
            WorkspaceMetadata object (empty on failure)

        Note:
            This method never raises exceptions - it returns empty metadata on all errors
            to ensure graceful degradation per FR-007 requirement.
        """
        try:
            # Build headers with authentication if token is provided
            headers = {}
            if self.coder_session_token:
                headers["Coder-Session-Token"] = self.coder_session_token

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=headers)

                # Check for HTTP errors
                if response.status_code == 404:
                    logger.warning(f"Metadata endpoint not found: {url}")
                    return WorkspaceMetadata(data={})

                if response.status_code >= 500:
                    logger.error(
                        f"Server error from metadata endpoint {url}: {response.status_code}"
                    )
                    return WorkspaceMetadata(data={})

                if response.status_code != 200:
                    logger.warning(
                        f"Unexpected status code from metadata endpoint {url}: {response.status_code}"
                    )
                    return WorkspaceMetadata(data={})

                # Parse JSON response
                try:
                    data = response.json()
                except Exception as e:
                    logger.error(
                        f"Failed to parse JSON from metadata endpoint {url}: {e}"
                    )
                    return WorkspaceMetadata(data={})

                # Validate against WorkspaceMetadata model
                try:
                    return WorkspaceMetadata.model_validate(data)
                except ValidationError as e:
                    logger.error(f"Invalid metadata schema from {url}: {e}")
                    return WorkspaceMetadata(data={})

        except httpx.TimeoutException:
            logger.warning(f"Timeout fetching metadata from {url}")
            return WorkspaceMetadata(data={})

        except httpx.ConnectError as e:
            logger.warning(f"Connection error fetching metadata from {url}: {e}")
            return WorkspaceMetadata(data={})

        except Exception as e:
            logger.error(f"Unexpected error fetching metadata from {url}: {e}")
            return WorkspaceMetadata(data={})
