"""Test fixtures generated from VCR cassettes

This module provides utilities to load responses from VCR cassettes
and create pytest fixtures for use in tests without VCR.
"""

import json
from pathlib import Path
from typing import Any, Dict

import yaml


def load_cassette_response(
    cassette_name: str, interaction_index: int = 0
) -> Dict[str, Any]:
    """Load a response from a VCR cassette file

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)
        interaction_index: Index of the interaction to load (default: 0)

    Returns:
        Dictionary containing the response data
    """
    cassette_path = Path(__file__).parent / "cassettes" / f"{cassette_name}.yaml"

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


def get_response_body(cassette_name: str, interaction_index: int = 0) -> Any:
    """Get the parsed response body from a cassette

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)
        interaction_index: Index of the interaction to load (default: 0)

    Returns:
        Parsed JSON body or raw string
    """
    response = load_cassette_response(cassette_name, interaction_index)
    return response.get("parsed_body")


def get_all_responses(cassette_name: str) -> list[Dict[str, Any]]:
    """Get all responses from a cassette

    Args:
        cassette_name: Name of the cassette file (without .yaml extension)

    Returns:
        List of all response dictionaries
    """
    cassette_path = Path(__file__).parent / "cassettes" / f"{cassette_name}.yaml"

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


# Pre-generated fixtures for common test scenarios


def workspace_list_response() -> list[Dict[str, Any]]:
    """Fixture: Response from list_workspaces"""
    return get_response_body("test_list_workspaces")


def workspace_create_response() -> Dict[str, Any]:
    """Fixture: Response from create_workspace"""
    responses = get_all_responses("test_create_workspace")
    # The create response is typically the second interaction (after templates list)
    for response in responses:
        body = response.get("parsed_body")
        if isinstance(body, dict) and "id" in body and "name" in body:
            return body
    return responses[-1].get("parsed_body")


def template_list_response() -> list[Dict[str, Any]]:
    """Fixture: Response from list_templates"""
    responses = get_all_responses("test_create_workspace")
    # Templates list is the first interaction
    return responses[0].get("parsed_body")


def template_rich_parameters_response() -> list[Dict[str, Any]]:
    """Fixture: Response from get_template_version_rich_parameters"""
    responses = get_all_responses("test_get_template_version_rich_parameters")
    # Rich parameters are in the last response
    return responses[-1].get("parsed_body")


def agent_list_response() -> Dict[str, Any]:
    """Fixture: Response from list_agents tool"""
    return get_response_body("test_list_agents_success", -1)


def agent_create_response() -> Dict[str, Any]:
    """Fixture: Response from create_agent tool"""
    responses = get_all_responses("test_create_agent_success")
    # Find the create workspace response
    for response in responses:
        body = response.get("parsed_body")
        if isinstance(body, dict) and "id" in body and "name" in body:
            return body
    return responses[-1].get("parsed_body")


def agent_show_response() -> Dict[str, Any]:
    """Fixture: Response from show_agent tool"""
    responses = get_all_responses("test_show_agent_success")
    # Get workspace details response
    for response in responses:
        body = response.get("parsed_body")
        if isinstance(body, dict) and "latest_build" in body:
            return body
    return responses[-1].get("parsed_body")


def project_list_response() -> Dict[str, Any]:
    """Fixture: Response from list_agent_projects tool"""
    responses = get_all_responses("test_list_agent_projects_success")
    # Templates are in the first response
    return responses[0].get("parsed_body")


def role_list_response() -> Dict[str, Any]:
    """Fixture: Response from list_agent_roles tool"""
    responses = get_all_responses("test_list_agent_roles_success")
    # Rich parameters are in the last response
    return responses[-1].get("parsed_body")


def task_history_response() -> Dict[str, Any]:
    """Fixture: Response from show_agent_task_history tool"""
    return get_response_body("test_show_agent_task_history_success", -1)


def agent_log_response() -> Dict[str, Any]:
    """Fixture: Response from show_agent_log tool"""
    return get_response_body("test_show_agent_log_success", -1)
