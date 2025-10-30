import pytest
import vcr
import os
import uuid
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.workspaces import get_workspace_by_name

# Load .env file from project root
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)


@pytest.fixture(scope="module")
def vcr_config():
    """Configure VCR for all tests with environment variable redaction"""
    return {
        "filter_headers": ["authorization", "cookie", "x-coder-session-token", "coder-session-token"],
        "filter_post_data_parameters": [
            "GH_TOKEN",
            "HA_TOKEN",
            "NX_KEY",
            "OP_SERVICE_ACCOUNT_TOKEN",
            "CLAUDE_CODE_OAUTH_TOKEN",
            "CODER_SESSION_TOKEN",
            "CODER_AGENT_TOKEN"
        ],
        "before_record_response": lambda response: _redact_env_vars(response),
        "record_mode": "new_episodes",  # Allow new recordings while replaying existing
        "match_on": ["method", "scheme", "host", "port", "path"],  # Removed query to allow parameter variations
        "cassette_library_dir": "tests/cassettes",
    }


def _redact_env_vars(response):
    """Redact sensitive environment variables from VCR cassettes"""
    sensitive_env_vars = [
        "GH_TOKEN",
        "HA_TOKEN",
        "NX_KEY",
        "OP_SERVICE_ACCOUNT_TOKEN",
        "CLAUDE_CODE_OAUTH_TOKEN",
        "CODER_SESSION_TOKEN",
        "CODER_AGENT_TOKEN"
    ]

    # Redact from response body if it's text
    if hasattr(response, 'text'):
        body = response['body']['string'].decode('utf-8') if isinstance(response['body']['string'], bytes) else response['body']['string']
        for env_var in sensitive_env_vars:
            env_value = os.getenv(env_var, '')
            if env_value and env_value in body:
                body = body.replace(env_value, f'***{env_var}_REDACTED***')
        if isinstance(response['body']['string'], bytes):
            response['body']['string'] = body.encode('utf-8')
        else:
            response['body']['string'] = body

    return response


@pytest.fixture
def coder_base_url():
    """Coder API base URL from environment"""
    return os.getenv("CODER_URL", "https://coder.example.com")


@pytest.fixture
def coder_token():
    """Coder API token from environment"""
    return os.getenv("CODER_TOKEN", "test-token-placeholder")


@pytest.fixture
def unique_agent_name():
    """Generate unique agent name for test isolation"""
    return f"test-{uuid.uuid4().hex[:8]}"


@pytest.fixture
async def cleanup_agent(coder_base_url, coder_token):
    """Fixture to track and cleanup created agents after tests"""
    created_agents = []

    def register(agent_name):
        created_agents.append(agent_name)

    yield register

    # Cleanup after test
    if created_agents:
        client = CoderClient(base_url=coder_base_url, token=coder_token)
        async with client:
            for agent_name in created_agents:
                try:
                    # Try to delete the agent
                    workspace_name = f"agent-{agent_name}"
                    workspace = await get_workspace_by_name(client, workspace_name)
                    if workspace:
                        await client.delete_workspace(workspace["id"])
                        # Wait a bit for deletion to complete
                        await asyncio.sleep(1)
                except Exception as e:
                    # Ignore cleanup errors
                    print(f"Warning: Failed to cleanup agent {agent_name}: {e}")
                    pass
