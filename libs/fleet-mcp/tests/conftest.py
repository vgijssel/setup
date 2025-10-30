import pytest
import vcr
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)


@pytest.fixture(scope="module")
def vcr_config():
    """Configure VCR for all tests"""
    return {
        "filter_headers": ["authorization", "cookie", "x-coder-session-token", "coder-session-token"],
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "cassette_library_dir": "tests/cassettes",
    }


@pytest.fixture
def coder_base_url():
    """Coder API base URL from environment"""
    return os.getenv("CODER_URL", "https://coder.example.com")


@pytest.fixture
def coder_token():
    """Coder API token from environment"""
    return os.getenv("CODER_TOKEN", "test-token-placeholder")
