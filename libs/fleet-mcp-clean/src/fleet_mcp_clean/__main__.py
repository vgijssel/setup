"""FastMCP server entry point for fleet-mcp-clean."""

import os
from dotenv import load_dotenv
from fastmcp import FastMCP

# Load environment variables
load_dotenv()

# Initialize FastMCP server
mcp = FastMCP("Fleet MCP Clean", version="0.1.0")

# Coder API configuration
CODER_URL = os.getenv("CODER_URL")
CODER_SESSION_TOKEN = os.getenv("CODER_SESSION_TOKEN")

if not CODER_URL or not CODER_SESSION_TOKEN:
    raise ValueError(
        "CODER_URL and CODER_SESSION_TOKEN environment variables are required"
    )

# Initialize clients, repositories, and services
# These will be imported and initialized when tools are registered
# from .clients import CoderClient
# from .repositories import AgentRepository, TaskRepository, ProjectRepository
# from .services import AgentService, TaskService, ProjectService

# Tools will be registered here as they are implemented
# Example:
# @mcp.tool()
# async def list_agents(...):
#     pass

# For now, register a health check tool
@mcp.tool()
async def health_check() -> dict:
    """Check if the fleet-mcp-clean server is running."""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "coder_url": CODER_URL,
    }


# Entry point for uv run
if __name__ == "__main__":
    mcp.run()
