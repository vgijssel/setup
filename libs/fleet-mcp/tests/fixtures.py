"""Pytest fixtures for fleet-mcp tests

Utilities for loading VCR cassettes and version-aware caching.
Respx-based mock fixtures to be completed in follow-up work.

See REFACTORING_STATUS.md for details.
"""

import json
import re
import subprocess
from pathlib import Path
from typing import Any, Dict

import pytest
import yaml

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


def get_cassette_path(cassette_dir: Path, cassette_name: str, version: str) -> Path:
    """Get version-aware cassette path

    Args:
        cassette_dir: Directory containing cassettes
        cassette_name: Name of cassette (without .yaml)
        version: Coder version for cache key

    Returns:
        Path to cassette file (version-aware if it exists, otherwise base)
    """
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
    """Base URL for Coder API (used in mocks)"""
    return "https://coder.example.com"


@pytest.fixture
def coder_token():
    """Coder API token (placeholder for mocked requests)"""
    return "test-token"


# ============================================================================
# NOTE: Respx-based mock fixtures to be added in follow-up work
# See REFACTORING_STATUS.md for details on respx API pattern needed
# ============================================================================
