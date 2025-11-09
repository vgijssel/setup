"""Test fixtures for task-related API responses.

These fixtures provide reusable mock responses for task history and logs
based on recorded VCR cassettes.
"""

import pytest
import respx
from httpx import Response

from .helpers import load_cassette_response


@pytest.fixture
def mock_get_task_history_success(coder_base_url: str) -> dict:
    """Mock successful task history retrieval.

    Task history is extracted from workspace.latest_build.resources[].agents[].apps[]
    where app.slug == "ccw". The app.statuses[] array contains task history items.

    Returns:
        Workspace dict containing Claude Code app with task statuses
    """
    # Load from get_workspace_success cassette which has task history
    status_code, workspace_data = load_cassette_response("get_workspace_success")

    return workspace_data


@pytest.fixture
def mock_get_conversation_logs_success(coder_base_url: str) -> dict:
    """Mock successful conversation logs retrieval.

    Returns:
        Response dict with logs array containing conversation entries
    """
    # Load from get_task_logs cassette
    status_code, logs_data = load_cassette_response("get_task_logs_empty")

    return logs_data


@pytest.fixture
def mock_get_task_history_empty(coder_base_url: str) -> dict:
    """Mock workspace with no task history (empty statuses array).

    Returns:
        Workspace dict with Claude Code app but empty statuses
    """
    # Load workspace and remove task history
    status_code, workspace_data = load_cassette_response("get_workspace_success")

    # Find Claude Code app and clear its statuses
    if workspace_data.get("latest_build", {}).get("resources"):
        for resource in workspace_data["latest_build"]["resources"]:
            if resource.get("agents"):
                for agent in resource["agents"]:
                    if agent.get("apps"):
                        for app in agent["apps"]:
                            if app.get("slug") == "ccw" or app.get("display_name") == "Claude Code":
                                app["statuses"] = []
                                break

    return workspace_data
