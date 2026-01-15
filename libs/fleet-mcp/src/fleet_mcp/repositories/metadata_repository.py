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
        coder_session_token: str,
        metadata_client: Optional[MetadataClient] = None,
    ):
        """Initialize MetadataRepository.

        Args:
            coder_client: CoderClient for workspace API calls
            coder_session_token: Coder session token for authenticated metadata requests.
                Required for fetching metadata from Coder proxy URLs.
            metadata_client: Optional MetadataClient (creates new if not provided)
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

            # Get workspace applications to find fleet-mcp app
            applications = await self.coder_client.get_workspace_applications(
                workspace_id
            )

            # Find fleet-mcp app
            fleet_mcp_app = next(
                (app for app in applications if app.get("slug") == "fleet-mcp"), None
            )

            if not fleet_mcp_app:
                logger.warning(
                    f"fleet-mcp app not found for workspace {workspace_id}, using fallback URL construction"
                )
                # Fallback to path-based URL construction
                owner_name = workspace.get("owner_name", "me")
                workspace_name = workspace.get("name", "unknown")
                agent_api_url = (
                    f"{self.coder_client.base_url}/@{owner_name}/"
                    f"{workspace_name}.{workspace_id}/apps/fleet-mcp/"
                )
            else:
                # Construct URL based on app configuration
                agent_api_url = self._construct_app_url(
                    workspace, fleet_mcp_app, workspace_id
                )

            metadata_url = f"{agent_api_url}metadata"

            logger.info(f"Collecting metadata from {metadata_url}")

            # Call agent's /metadata endpoint via MetadataClient
            metadata = await self.metadata_client.get_metadata(metadata_url)

            return metadata

        except Exception as e:
            logger.error(f"Error collecting metadata for workspace {workspace_id}: {e}")
            return WorkspaceMetadata(data={})

    def _construct_app_url(self, workspace: dict, app: dict, workspace_id: str) -> str:
        """Construct app URL based on subdomain configuration.

        Args:
            workspace: Workspace data from Coder API
            app: App configuration with subdomain field
            workspace_id: Workspace UUID

        Returns:
            App base URL (with trailing slash)
        """
        owner_name = workspace.get("owner_name", "me")
        workspace_name = workspace.get("name", "unknown")
        app_slug = app.get("slug", "")
        uses_subdomain = app.get("subdomain", False)

        if uses_subdomain:
            # Subdomain format: {port}--{agent}--{workspace}--{owner}.{wildcard_domain}/
            # Extract port from app URL (e.g., "http://127.0.0.1:8000" -> "8000")
            from urllib.parse import urlparse

            app_url = app.get("url", "")
            parsed = urlparse(app_url)
            port = parsed.port or 80

            # Extract agent name from workspace resources (typically "main")
            agent_name = "main"
            latest_build = workspace.get("latest_build", {})
            resources = latest_build.get("resources", [])
            for resource in resources:
                agents = resource.get("agents", [])
                if agents:
                    agent_name = agents[0].get("name", "main")
                    break

            # Extract wildcard domain from base URL
            # e.g., "https://coder.enigma.vgijssel.nl" -> "coder.enigma.vgijssel.nl"
            base_parsed = urlparse(self.coder_client.base_url)
            wildcard_domain = base_parsed.netloc

            # Construct subdomain URL
            subdomain_url = f"{base_parsed.scheme}://{port}--{agent_name}--{workspace_name}--{owner_name}.{wildcard_domain}/"
            return subdomain_url
        else:
            # Path-based format: {base_url}/@{owner}/{workspace}.{workspace_id}/apps/{slug}/
            return (
                f"{self.coder_client.base_url}/@{owner_name}/"
                f"{workspace_name}.{workspace_id}/apps/{app_slug}/"
            )
