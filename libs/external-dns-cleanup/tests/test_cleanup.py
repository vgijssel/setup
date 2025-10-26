"""Tests for the cleanup module."""

import os

import pytest
from external_dns_cleanup.cleanup import cleanup_dns_records


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
