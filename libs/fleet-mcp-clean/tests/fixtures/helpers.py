"""Test helper functions for loading VCR cassettes and responses.

These utilities ensure DRY (Don't Repeat Yourself) principles across test fixtures.
All cassette loading logic is centralized here to maintain consistency.
"""

import json
from pathlib import Path
from typing import Any

import yaml

# Path to cassettes directory
CASSETTE_DIR = Path(__file__).parent.parent / "cassettes"


def load_cassette_response(
    cassette_name: str, interaction_index: int = 0
) -> tuple[int, dict | list | str]:
    """Load response data from a VCR cassette file.

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)
        interaction_index: Index of the interaction to load (default: 0 for first interaction)

    Returns:
        Tuple of (status_code, response_body)

    Raises:
        FileNotFoundError: If cassette file doesn't exist
        IndexError: If interaction_index is out of range
        KeyError: If cassette structure is invalid
    """
    cassette_path = CASSETTE_DIR / f"{cassette_name}.yaml"

    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path) as f:
        cassette_data = yaml.safe_load(f)

    # Extract specified interaction's response
    interactions = cassette_data.get("interactions", [])
    if interaction_index >= len(interactions):
        raise IndexError(
            f"Interaction index {interaction_index} out of range. "
            f"Cassette has {len(interactions)} interactions."
        )

    interaction = interactions[interaction_index]
    response = interaction["response"]

    status_code = response["status"]["code"]
    body_string = response["body"]["string"]

    # Parse JSON body
    try:
        body = json.loads(body_string)
    except json.JSONDecodeError:
        # Return raw string if not valid JSON
        body = body_string

    return status_code, body


def load_cassette_request(
    cassette_name: str, interaction_index: int = 0
) -> dict[str, Any]:
    """Load request data from a VCR cassette file.

    Useful for verifying request parameters in tests.

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)
        interaction_index: Index of the interaction to load (default: 0)

    Returns:
        Dictionary containing request data (method, uri, headers, body)

    Raises:
        FileNotFoundError: If cassette file doesn't exist
        IndexError: If interaction_index is out of range
    """
    cassette_path = CASSETTE_DIR / f"{cassette_name}.yaml"

    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path) as f:
        cassette_data = yaml.safe_load(f)

    interactions = cassette_data.get("interactions", [])
    if interaction_index >= len(interactions):
        raise IndexError(
            f"Interaction index {interaction_index} out of range. "
            f"Cassette has {len(interactions)} interactions."
        )

    return interactions[interaction_index]["request"]


def get_cassette_interaction_count(cassette_name: str) -> int:
    """Get the number of interactions in a cassette.

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)

    Returns:
        Number of interactions in the cassette

    Raises:
        FileNotFoundError: If cassette file doesn't exist
    """
    cassette_path = CASSETTE_DIR / f"{cassette_name}.yaml"

    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path) as f:
        cassette_data = yaml.safe_load(f)

    return len(cassette_data.get("interactions", []))
