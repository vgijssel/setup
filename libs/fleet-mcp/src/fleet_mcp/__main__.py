"""Entry point for running the Fleet MCP server"""

import os

from dotenv import load_dotenv

from fleet_mcp.server import create_mcp_server


def main():
    """Run the Fleet MCP server"""
    # Load environment variables
    load_dotenv()

    # Get configuration from environment
    base_url = os.getenv("CODER_URL")
    token = os.getenv("CODER_TOKEN")

    if not base_url or not token:
        raise ValueError("CODER_URL and CODER_TOKEN must be set in .env file")

    # Create and run the MCP server
    mcp = create_mcp_server(base_url, token)
    mcp.run()


if __name__ == "__main__":
    main()
