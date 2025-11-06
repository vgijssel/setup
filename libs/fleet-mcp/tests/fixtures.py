"""Pytest fixtures for fleet-mcp tests

Utilities for loading VCR cassettes and version-aware caching.
Respx-based mock fixtures to be completed in follow-up work.

See REFACTORING_STATUS.md for details.
"""

import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any, Dict

import pytest
import yaml
from fleet_mcp.coder.client import CoderClient
from httpx import Response

# ============================================================================
# Version-Aware Caching
# ============================================================================


def get_coder_version() -> str:
    """Get Coder version for cache key

    Returns:
        Version string (e.g., "v2.27.1")
    """
    try:
        result = subprocess.run(
            ["coder", "--version"], capture_output=True, text=True, timeout=5
        )
        match = re.search(r"Coder (v[\d.]+)", result.stdout)
        if match:
            return match.group(1)
    except Exception:
        pass
    return "unknown"


@pytest.fixture(scope="session")
def coder_version():
    """Fixture providing Coder version for version-aware caching"""
    return get_coder_version()


@pytest.fixture(scope="session")
def cassette_dir():
    """Fixture providing cassette directory path"""
    return Path(__file__).parent / "cassettes"


def get_cassette_path(cassette_dir: Path, cassette_name: str) -> Path:
    """Get version-aware cassette path

    Args:
        cassette_dir: Directory containing cassettes
        cassette_name: Name of cassette (without .yaml)
        version: Coder version for cache key

    Returns:
        Path to cassette file (version-aware if it exists, otherwise base)
    """
    version = get_coder_version()
    # Try version-specific cassette first
    version_cassette = cassette_dir / f"{cassette_name}_{version}.yaml"
    if version_cassette.exists():
        return version_cassette

    # Fall back to base cassette
    base_cassette = cassette_dir / f"{cassette_name}.yaml"
    return base_cassette


# ============================================================================
# Cassette Loading Utilities
# ============================================================================


def load_cassette_response(
    cassette_path: Path, interaction_index: int = 0
) -> Dict[str, Any]:
    """Load a response from a VCR cassette file

    Args:
        cassette_path: Path to cassette file
        interaction_index: Index of the interaction to load (default: 0)

    Returns:
        Dictionary containing the response data
    """
    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path, "r") as f:
        cassette_data = yaml.safe_load(f)

    interactions = cassette_data.get("interactions", [])
    if interaction_index >= len(interactions):
        raise IndexError(
            f"Interaction index {interaction_index} out of range "
            f"(cassette has {len(interactions)} interactions)"
        )

    interaction = interactions[interaction_index]
    response = interaction.get("response", {})

    # Parse body if it's JSON
    body = response.get("body", {}).get("string", "")
    if body:
        try:
            response["parsed_body"] = json.loads(body)
        except json.JSONDecodeError:
            response["parsed_body"] = body

    return response


def load_all_cassette_responses(cassette_path: Path) -> list[Dict[str, Any]]:
    """Load all responses from a cassette

    Args:
        cassette_path: Path to cassette file

    Returns:
        List of all response dictionaries
    """
    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path, "r") as f:
        cassette_data = yaml.safe_load(f)

    interactions = cassette_data.get("interactions", [])
    responses = []

    for interaction in interactions:
        response = interaction.get("response", {})
        body = response.get("body", {}).get("string", "")
        if body:
            try:
                response["parsed_body"] = json.loads(body)
            except json.JSONDecodeError:
                response["parsed_body"] = body
        responses.append(response)

    return responses


# ============================================================================
# Helper Functions for Tests
# ============================================================================


def parse_tool_result(result):
    """Helper to parse JSON result from MCP tool call"""
    assert len(result.content) > 0, "Tool result has no content"
    content = result.content[0]
    assert hasattr(content, "text"), "Content has no text attribute"
    return json.loads(content.text)


# ============================================================================
# Base Configuration Fixtures
# ============================================================================


@pytest.fixture
def coder_base_url():
    """Base URL for Coder API from environment"""
    return os.getenv("CODER_URL")


@pytest.fixture
def coder_token():
    """Coder API token from environment"""
    return os.getenv("CODER_SESSION_TOKEN")


@pytest.fixture
def coder_client(coder_base_url, coder_token):
    return CoderClient(base_url=coder_base_url, token=coder_token)


# ============================================================================
# NOTE: Respx-based mock fixtures to be added in follow-up work
# See REFACTORING_STATUS.md for details on respx API pattern needed
# ============================================================================


@pytest.fixture
def mock_create_workspace(respx_mock, coder_base_url, cassette_dir):
    """Mock for create_workspace test

    Mocks the full workspace creation flow:
    1. GET /api/v2/templates - list templates
    2. GET /api/v2/templates/{id} - get template details
    3. GET /api/v2/templateversions/{id}/presets - get workspace presets
    4. GET /api/v2/templateversions/{id}/rich-parameters - get parameters
    5. GET /api/v2/users/me/organizations - get user's organizations
    6. POST /api/v2/organizations/{id}/members/me/workspaces - create workspace
    """
    # Get version-aware cassette path
    cassette_path = get_cassette_path(cassette_dir, "test_create_workspace")

    # Load all responses from cassette
    responses = load_all_cassette_responses(cassette_path)

    # Mock each endpoint explicitly with regex for dynamic IDs
    # 1. GET /api/v2/templates
    route = respx_mock.get(f"{coder_base_url}/api/v2/templates")
    route.mock(return_value=Response(200, json=responses[0]["parsed_body"]))

    # 2. GET /api/v2/templates/{id} - using regex to match any template ID
    route = respx_mock.get(url__regex=f"^{coder_base_url}/api/v2/templates/[a-f0-9-]+$")
    route.mock(return_value=Response(200, json=responses[1]["parsed_body"]))

    # 3. GET /api/v2/templateversions/{id}/presets
    route = respx_mock.get(
        url__regex=f"^{coder_base_url}/api/v2/templateversions/[a-f0-9-]+/presets$"
    )
    route.mock(return_value=Response(200, json=responses[2]["parsed_body"]))

    # 4. GET /api/v2/templateversions/{id}/rich-parameters
    route = respx_mock.get(
        url__regex=f"^{coder_base_url}/api/v2/templateversions/[a-f0-9-]+/rich-parameters$"
    )
    route.mock(return_value=Response(200, json=responses[3]["parsed_body"]))

    # 5. GET /api/v2/users/me/organizations
    route = respx_mock.get(f"{coder_base_url}/api/v2/users/me/organizations")
    route.mock(return_value=Response(200, json=responses[4]["parsed_body"]))

    # 6. POST /api/v2/organizations/{id}/members/me/workspaces
    route = respx_mock.post(
        url__regex=f"^{coder_base_url}/api/v2/organizations/[a-f0-9-]+/members/me/workspaces$"
    )
    route.mock(return_value=Response(201, json=responses[5]["parsed_body"]))

    # Return the created workspace data
    return responses[5]["parsed_body"]
