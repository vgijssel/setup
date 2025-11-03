"""Entry point for running the Fleet MCP server as an ASGI application"""

import os

from dotenv import load_dotenv
from fleet_mcp.server import create_mcp_server

# Load environment variables
load_dotenv()

# Get configuration from environment
base_url = os.getenv("FLEET_MCP_CODER_URL")
token = os.getenv("FLEET_MCP_CODER_TOKEN")

if not base_url or not token:
    raise ValueError(
        "FLEET_MCP_CODER_URL and FLEET_MCP_CODER_TOKEN must be set in .env file"
    )

# Create the MCP server and export the ASGI application
mcp = create_mcp_server(base_url, token)
app = mcp.http_app()

# For development: run with uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "fleet_mcp.__main__:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
