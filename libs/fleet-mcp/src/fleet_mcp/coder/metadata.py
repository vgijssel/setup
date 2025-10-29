"""Metadata helper functions"""
from typing import Any


def filter_fleet_metadata(metadata: dict[str, Any]) -> dict[str, str]:
    """
    Filter workspace metadata to only fleet_mcp_* fields

    Args:
        metadata: Full workspace metadata dictionary

    Returns:
        Filtered metadata with only fleet_mcp_* keys (excluding None values)
    """
    return {
        key: value
        for key, value in metadata.items()
        if key.startswith("fleet_mcp_") and value is not None
    }
