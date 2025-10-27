"""Tests for the cleanup functionality."""

import os
import sys

import pytest

# Add parent directory to path to import the script
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import the script as a module by using exec
script_path = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "external-dns-cleanup"
)
with open(script_path) as f:
    script_code = f.read()
    # Remove shebang and script metadata for import
    lines = script_code.split("\n")
    code_start = 0
    for i, line in enumerate(lines):
        if line.strip() and not line.startswith("#"):
            code_start = i
            break
    clean_code = "\n".join(lines[code_start:])
    exec(clean_code, globals())  # noqa: S102

# Tell ruff that cleanup_dns_records is defined via exec above
cleanup_dns_records = globals()["cleanup_dns_records"]  # type: ignore  # noqa: F821


@pytest.fixture
def api_token():
    """Get API token from environment."""
    token = os.getenv("CF_API_TOKEN")
    if not token:
        pytest.skip("CF_API_TOKEN not set")
    return token


@pytest.mark.vcr()
def test_cleanup_dns_records_dry_run(api_token):
    """Test cleanup in dry-run mode."""
    # This test will be recorded with VCR
    deleted_count = cleanup_dns_records(
        api_token=api_token,
        domain_filter="vgijssel-dev.nl",
        txt_owner_id="internal-dns",
        txt_prefix="_externaldns-",
        dry_run=True,
        verbose=True,
    )

    # Should return a count (could be 0 if no records match)
    assert isinstance(deleted_count, int)
    assert deleted_count >= 0


@pytest.mark.vcr()
def test_cleanup_dns_records_invalid_domain(api_token):
    """Test cleanup with invalid domain."""
    with pytest.raises(ValueError, match="No zone found for domain"):
        cleanup_dns_records(
            api_token=api_token,
            domain_filter="invalid-domain-that-does-not-exist.example",
            txt_owner_id="internal-dns",
            txt_prefix="_externaldns-",
            dry_run=True,
            verbose=False,
        )


def test_cleanup_dns_records_invalid_token():
    """Test cleanup with invalid API token."""
    # This should fail with an authentication error from Cloudflare SDK
    from cloudflare import APIError

    with pytest.raises((APIError, ValueError)):
        cleanup_dns_records(
            api_token="invalid-token",
            domain_filter="vgijssel-dev.nl",
            txt_owner_id="internal-dns",
            txt_prefix="_externaldns-",
            dry_run=True,
            verbose=False,
        )
