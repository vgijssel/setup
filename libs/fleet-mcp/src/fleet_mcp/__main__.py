"""Entry point for running the Fleet MCP server as an ASGI application"""

import os

from dotenv import load_dotenv
from fleet_mcp.server import create_mcp_server

# Load environment variables
load_dotenv()

# Get configuration from environment
base_url = os.getenv("CODER_URL")
token = os.getenv("CODER_SESSION_TOKEN")

if not base_url or not token:
    raise ValueError("CODER_URL and CODER_SESSION_TOKEN must be set")

# Create the MCP server and export the ASGI application
mcp = create_mcp_server(base_url, token)
app = mcp.http_app()
