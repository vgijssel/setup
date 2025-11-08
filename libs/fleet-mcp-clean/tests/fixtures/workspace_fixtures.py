"""Workspace-related test fixtures using respx mocks.

These fixtures provide reusable mock responses for workspace-related API calls.
All mocks are based on recorded VCR cassettes to ensure realistic test data.

The fixtures dynamically load cassette content so they stay in sync when cassettes
are re-recorded.
"""

import pytest
import respx
from httpx import Response

from .helpers import load_cassette_response


@pytest.fixture
def mock_list_workspaces_success(respx_mock):
    """Mock successful workspace listing from Coder API.

    Based on cassette: list_workspaces_success.yaml
    Automatically loads response from cassette file.
    """
    status_code, body = load_cassette_response("list_workspaces_success")

    route = respx_mock.get(
        url__regex=r".*/api/v2/workspaces$"
    ).mock(
        return_value=Response(status_code, json=body)
    )
    return route


@pytest.fixture
def mock_get_workspace_success(respx_mock):
    """Mock successful workspace retrieval from Coder API.

    Based on cassette: get_workspace_success.yaml
    Automatically loads response from cassette file.
    """
    status_code, body = load_cassette_response("get_workspace_success")

    route = respx_mock.get(
        url__regex=r".*/api/v2/workspaces/[a-f0-9-]+$"
    ).mock(
        return_value=Response(status_code, json=body)
    )
    return route


@pytest.fixture
def mock_get_workspace_applications_success(respx_mock):
    """Mock successful workspace applications retrieval.

    Based on cassette: get_workspace_applications_success.yaml
    Automatically loads response from cassette file.
    """
    status_code, body = load_cassette_response("get_workspace_applications_success")

    route = respx_mock.get(
        url__regex=r".*/api/v2/workspaces/[a-f0-9-]+$"
    ).mock(
        return_value=Response(status_code, json=body)
    )
    return route
