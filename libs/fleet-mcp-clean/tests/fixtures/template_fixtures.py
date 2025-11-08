"""Template-related test fixtures using respx mocks.

These fixtures provide reusable mock responses for template-related API calls.
All mocks are based on recorded VCR cassettes to ensure realistic test data.

The fixtures dynamically load cassette content so they stay in sync when cassettes
are re-recorded.
"""

import pytest
import respx
from httpx import Response

from .helpers import load_cassette_response


@pytest.fixture
def mock_list_templates_success(respx_mock):
    """Mock successful template listing from Coder API.

    Based on cassette: list_templates_success.yaml
    Automatically loads response from cassette file.
    """
    status_code, body = load_cassette_response("list_templates_success")

    route = respx_mock.get(
        url__regex=r".*/api/v2/templates$"
    ).mock(
        return_value=Response(status_code, json=body)
    )
    return route


@pytest.fixture
def mock_get_template_parameters_success(respx_mock):
    """Mock successful template parameters retrieval.

    Based on cassette: get_template_parameters_success.yaml
    Automatically loads response from cassette file.

    This fixture mocks two endpoints:
    1. get_template() - returns template with active_version_id
    2. get_template_parameters() - returns rich parameters for the version
    """
    # First interaction: get_template()
    status_code_1, body_1 = load_cassette_response("get_template_parameters_success", interaction_index=0)
    respx_mock.get(
        url__regex=r".*/api/v2/templates/[a-f0-9-]+$"
    ).mock(
        return_value=Response(status_code_1, json=body_1)
    )

    # Second interaction: get template parameters
    status_code_2, body_2 = load_cassette_response("get_template_parameters_success", interaction_index=1)
    route = respx_mock.get(
        url__regex=r".*/api/v2/templateversions/[a-f0-9-]+/rich-parameters$"
    ).mock(
        return_value=Response(status_code_2, json=body_2)
    )
    return route


@pytest.fixture
def mock_list_workspace_presets_success(respx_mock):
    """Mock successful workspace presets listing.

    Based on cassette: list_workspace_presets_success.yaml
    Automatically loads response from cassette file.

    This fixture mocks two endpoints:
    1. get_template() - returns template with active_version_id
    2. list_workspace_presets() - returns workspace presets for the version
    """
    # First interaction: get_template()
    status_code_1, body_1 = load_cassette_response("list_workspace_presets_success", interaction_index=0)
    respx_mock.get(
        url__regex=r".*/api/v2/templates/[a-f0-9-]+$"
    ).mock(
        return_value=Response(status_code_1, json=body_1)
    )

    # Second interaction: list workspace presets
    status_code_2, body_2 = load_cassette_response("list_workspace_presets_success", interaction_index=1)
    route = respx_mock.get(
        url__regex=r".*/api/v2/templateversions/[a-f0-9-]+/presets$"
    ).mock(
        return_value=Response(status_code_2, json=body_2)
    )
    return route
