"""Repository for collecting workspace metadata from agents.

This repository orchestrates metadata collection by calling agent-specific
/metadata endpoints via HTTP.
"""

import logging
from typing import Optional

from ..clients.coder_client import CoderClient
from ..clients.metadata_client import MetadataClient
from ..models.metadata import WorkspaceMetadata

logger = logging.getLogger(__name__)


class MetadataRepository:
    """Repository for collecting workspace metadata from agent endpoints.

    Orchestrates the metadata collection flow:
    1. Get workspace info from Coder API
    2. Construct agent-specific app URL
    3. Call agent's /metadata endpoint via MetadataClient
    4. Return WorkspaceMetadata

    Architecture:
    Main fleet-mcp server → MetadataRepository → MetadataClient → Agent's /metadata endpoint
    """

    def __init__(
        self,
        coder_client: CoderClient,
        metadata_client: Optional[MetadataClient] = None,
        coder_session_token: Optional[str] = None,
    ):
        """Initialize MetadataRepository.

        Args:
            coder_client: CoderClient for workspace API calls
            metadata_client: Optional MetadataClient (creates new if not provided)
            coder_session_token: Optional Coder session token for authenticated metadata requests.
                If not provided and metadata_client is None, MetadataClient will be created without auth.
        """
        self.coder_client = coder_client
        self.metadata_client = metadata_client or MetadataClient(
            coder_session_token=coder_session_token
        )

    async def collect_metadata(self, workspace_id: str) -> WorkspaceMetadata:
        """Collect metadata from agent's /metadata endpoint.

        Args:
            workspace_id: Coder workspace UUID

        Returns:
            WorkspaceMetadata (empty on failure)

        Note:
            Never raises exceptions - returns empty metadata on errors
            for graceful degradation (FR-007 requirement)
        """
        try:
            # Get workspace info from Coder API
            workspace = await self.coder_client.get_workspace(workspace_id)

            # Construct agent-specific app URL (same pattern as TaskRepository)
            # URL format: {coder_url}/@{owner}/{workspace_name}.{workspace_id}/apps/fleet-mcp/
            owner_name = workspace.get("owner_name", "me")
            workspace_name = workspace.get("name", "unknown")
            agent_api_url = (
                f"{self.coder_client.base_url}/@{owner_name}/"
                f"{workspace_name}.{workspace_id}/apps/fleet-mcp/"
            )
            metadata_url = f"{agent_api_url}metadata"

            logger.info(f"Collecting metadata from {metadata_url}")

            # Call agent's /metadata endpoint via MetadataClient
            metadata = await self.metadata_client.get_metadata(metadata_url)

            return metadata

        except Exception as e:
            logger.error(f"Error collecting metadata for workspace {workspace_id}: {e}")
            return WorkspaceMetadata(data={})
