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
        "before_record_response": _redact_secrets,
        "before_record_request": _redact_secrets_from_request,
        "record_mode": "once",  # Only record once, don't overwrite
        "match_on": ["method", "scheme", "host", "port", "path"],
        "cassette_library_dir": "tests/cassettes",
    }


def _redact_secrets(response):
    """Redact sensitive environment variables from VCR response"""
    # Define all secrets to redact
    secrets_to_redact = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "NX_KEY": os.getenv("NX_KEY", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_TOKEN", ""),  # Note: CODER_TOKEN is the env var
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Also redact hostname from CODER_URL
    coder_url = os.getenv("CODER_URL", "")
    if coder_url:
        # Extract hostname from URL (e.g., macbook-pro-van-maarten.tail2c33e2.ts.net)
        from urllib.parse import urlparse
        parsed = urlparse(coder_url)
        if parsed.hostname:
            secrets_to_redact["CODER_HOSTNAME"] = parsed.hostname

    # Redact from response body
    if 'body' in response and 'string' in response['body']:
        body = response['body']['string']

        # Convert bytes to string if needed
        if isinstance(body, bytes):
            body = body.decode('utf-8')

        # Redact each secret
        for secret_name, secret_value in secrets_to_redact.items():
            if secret_value and secret_value in body:
                body = body.replace(secret_value, f'***{secret_name}_REDACTED***')

        # Convert back to original format
        if isinstance(response['body']['string'], bytes):
            response['body']['string'] = body.encode('utf-8')
        else:
            response['body']['string'] = body

    return response


def _redact_secrets_from_request(request):
    """Redact sensitive environment variables from VCR request"""
    secrets_to_redact = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "NX_KEY": os.getenv("NX_KEY", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_TOKEN", ""),
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Redact hostname
    coder_url = os.getenv("CODER_URL", "")
    hostname_to_redact = None
    if coder_url:
        from urllib.parse import urlparse
        parsed = urlparse(coder_url)
        if parsed.hostname:
            hostname_to_redact = parsed.hostname
            secrets_to_redact["CODER_HOSTNAME"] = hostname_to_redact

    # Redact from request body if present
    if hasattr(request, 'body') and request.body:
        body = request.body
        if isinstance(body, bytes):
            body = body.decode('utf-8')

        for secret_name, secret_value in secrets_to_redact.items():
            if secret_value and secret_value in body:
                body = body.replace(secret_value, f'***{secret_name}_REDACTED***')

        if isinstance(request.body, bytes):
            request.body = body.encode('utf-8')
        else:
            request.body = body

    # Redact hostname from URI
    if hostname_to_redact and request.uri:
        request.uri = request.uri.replace(hostname_to_redact, "coder.example.com")

    # Redact hostname from headers
    if hostname_to_redact and hasattr(request, 'headers'):
        if 'host' in request.headers:
            request.headers['host'] = request.headers['host'].replace(hostname_to_redact, "coder.example.com")

    return request


@pytest.fixture
def coder_base_url():
    """Coder API base URL from environment"""
    return os.getenv("CODER_URL", "https://coder.example.com")


@pytest.fixture
def coder_token():
    """Coder API token from environment"""
    return os.getenv("CODER_TOKEN", "test-token-placeholder")