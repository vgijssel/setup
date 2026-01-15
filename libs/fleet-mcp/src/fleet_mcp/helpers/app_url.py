"""Helper functions for constructing Coder app URLs."""

from urllib.parse import urlparse


def construct_app_url(
    base_url: str, workspace: dict, app: dict, workspace_id: str
) -> str:
    """Construct app URL based on subdomain configuration.

    Args:
        base_url: Coder server base URL (e.g., "https://coder.example.com")
        workspace: Workspace data from Coder API
        app: App configuration with subdomain field
        workspace_id: Workspace UUID

    Returns:
        App base URL (with trailing slash)

    Example:
        Subdomain format:
            https://8000--main--workspace--owner.coder.example.com/

        Path format:
            https://coder.example.com/@owner/workspace.id/apps/fleet-mcp/
    """
    owner_name = workspace.get("owner_name", "me")
    workspace_name = workspace.get("name", "unknown")
    app_slug = app.get("slug", "")
    uses_subdomain = app.get("subdomain", False)

    if uses_subdomain:
        # Subdomain format: {port}--{agent}--{workspace}--{owner}.{wildcard_domain}/
        # Extract port from app URL (e.g., "http://127.0.0.1:8000" -> "8000")
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
        base_parsed = urlparse(base_url)
        wildcard_domain = base_parsed.netloc

        # Construct subdomain URL
        subdomain_url = f"{base_parsed.scheme}://{port}--{agent_name}--{workspace_name}--{owner_name}.{wildcard_domain}/"
        return subdomain_url
    else:
        # Path-based format: {base_url}/@{owner}/{workspace}.{workspace_id}/apps/{slug}/
        return (
            f"{base_url}/@{owner_name}/{workspace_name}.{workspace_id}/apps/{app_slug}/"
        )
