"""Entry point for running the Fleet MCP server"""

from dotenv import load_dotenv
from fleet_mcp import config
from fleet_mcp.server import create_mcp_server


def main():
    """Run the Fleet MCP server"""
    # Load environment variables
    load_dotenv()

    # Validate configuration
    if not config.CODER_BASE_URL or config.CODER_BASE_URL == "https://coder.example.com":
        raise ValueError(
            "CODER_URL must be set in .env file or environment. "
            "Example: CODER_URL=https://coder.example.com"
        )

    if not config.CODER_TOKEN or config.CODER_TOKEN == "changeme":
        raise ValueError(
            "CODER_TOKEN must be set in .env file or environment. "
            "Get your token from: https://<coder-url>/settings/tokens"
        )

    # Create and run the MCP server
    mcp = create_mcp_server()
    mcp.run()


if __name__ == "__main__":
    main()
