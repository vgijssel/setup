#!/usr/bin/env python3
"""
Convert VCR cassettes to RESPX fixture factories.

This script converts existing VCR cassette YAML files (which contain real,
already-sanitized API responses) into Python fixture factories.

Usage:
    python scripts/convert_cassettes.py

Reads all cassettes from: tests/cassettes/*.yaml
Writes fixtures to: tests/fixtures/generated.py

This is much simpler than recording from scratch:
- Uses existing 34 cassettes with real API data
- Secrets already sanitized by VCR configuration
- Multi-step flows already captured
- Just need YAML → Python conversion

Total: ~150 lines vs 800+ for custom recording infrastructure
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml


def convert_all_cassettes():
    """Process all cassettes and generate fixtures."""
    cassettes_dir = Path(__file__).parent.parent / "tests" / "cassettes"
    output_file = Path(__file__).parent.parent / "tests" / "fixtures" / "generated.py"

    print(f"Scanning for cassettes in {cassettes_dir}...")

    cassette_files = sorted(cassettes_dir.glob("*.yaml"))
    if not cassette_files:
        print(f"⚠ No cassettes found in {cassettes_dir}")
        return

    print(f"Found {len(cassette_files)} cassette file(s)")

    fixtures = []
    for cassette_file in cassette_files:
        print(f"\nProcessing: {cassette_file.name}")
        try:
            fixture_funcs = convert_cassette(cassette_file)
            fixtures.extend(fixture_funcs)
            print(f"  + Generated {len(fixture_funcs)} fixture(s)")
        except Exception as e:
            print(f"  ✗ Error: {e}")

    # Write all fixtures to generated.py
    write_fixtures_file(output_file, fixtures)
    print(f"\n✓ Generated {len(fixtures)} fixtures to {output_file}")


def convert_cassette(cassette_path: Path) -> list[str]:
    """
    Convert one cassette to fixture function(s).

    Args:
        cassette_path: Path to VCR cassette YAML file

    Returns:
        List of fixture function code strings
    """
    with open(cassette_path) as f:
        cassette = yaml.safe_load(f)

    interactions = cassette.get("interactions", [])
    if not interactions:
        return []

    fixture_functions = []

    # For cassettes with a single interaction, create one fixture
    if len(interactions) == 1:
        interaction = interactions[0]
        func_code = create_fixture_function(
            cassette_path.stem, interaction, cassette_path.name, 1, 1
        )
        if func_code:
            fixture_functions.append(func_code)

    # For cassettes with multiple interactions, create fixture for each
    else:
        for idx, interaction in enumerate(interactions, 1):
            func_code = create_fixture_function(
                cassette_path.stem,
                interaction,
                cassette_path.name,
                idx,
                len(interactions),
            )
            if func_code:
                fixture_functions.append(func_code)

    return fixture_functions


def create_fixture_function(
    base_name: str,
    interaction: dict,
    source_file: str,
    interaction_num: int,
    total_interactions: int,
) -> str | None:
    """
    Create a single fixture function from an interaction.

    Args:
        base_name: Base name from cassette filename
        interaction: VCR interaction dict
        source_file: Source cassette filename
        interaction_num: Interaction number (1-indexed)
        total_interactions: Total number of interactions

    Returns:
        Python function code string or None if invalid
    """
    try:
        response = interaction["response"]
        request = interaction["request"]

        # Extract response data
        body_string = response["body"]["string"]
        if not body_string or body_string.strip() == "":
            return None

        # Parse JSON response
        try:
            body_data = json.loads(body_string)
        except json.JSONDecodeError:
            # Not JSON, skip
            return None

        # Determine function name
        if total_interactions == 1:
            function_name = f"make_{base_name}"
        else:
            function_name = f"make_{base_name}_interaction_{interaction_num}"

        # Infer return type
        return_type = infer_return_type(body_data)

        # Get request details for docstring
        method = request.get("method", "GET")
        uri = request.get("uri", "")
        status_code = response["status"]["code"]

        # Format data as pretty Python
        formatted_data = format_python_data(body_data, indent=1)

        # Generate function
        docstring_parts = [
            f"Fixture from VCR cassette: {source_file}",
            f"",
            f"Original: {method} {uri}",
            f"Status: {status_code}",
        ]
        if total_interactions > 1:
            docstring_parts.append(
                f"Interaction: {interaction_num}/{total_interactions}"
            )

        docstring = "\n    ".join(docstring_parts)

        return f'''
def {function_name}() -> {return_type}:
    """
    {docstring}
    """
    return {formatted_data}
'''

    except (KeyError, TypeError) as e:
        print(f"    Warning: Could not process interaction: {e}")
        return None


def infer_return_type(data: Any) -> str:
    """Infer Python type annotation from data."""
    if isinstance(data, dict):
        return "dict[str, Any]"
    elif isinstance(data, list):
        return "list[Any]"
    elif isinstance(data, str):
        return "str"
    elif isinstance(data, (int, float)):
        return "int | float"
    elif isinstance(data, bool):
        return "bool"
    else:
        return "Any"


def format_python_data(data: Any, indent: int = 0) -> str:
    """
    Format data structure as pretty Python code.

    Args:
        data: Data to format
        indent: Indentation level

    Returns:
        Formatted Python code string
    """
    # Use json.dumps for pretty formatting, then convert to Python syntax
    json_str = json.dumps(data, indent=4)

    # Convert JSON to Python
    python_str = (
        json_str.replace("true", "True")
        .replace("false", "False")
        .replace("null", "None")
    )

    # Add indentation if needed
    if indent > 0:
        lines = python_str.split("\n")
        indented_lines = ["    " * indent + line for line in lines]
        return "\n".join(indented_lines).lstrip()

    return python_str


def write_fixtures_file(output_file: Path, fixtures: list[str]):
    """
    Write all fixture functions to the generated.py file.

    Args:
        output_file: Path to write generated.py
        fixtures: List of fixture function code strings
    """
    header = f'''"""
Auto-generated fixture factories from VCR cassettes.

DO NOT EDIT THIS FILE MANUALLY!
Generated by: scripts/convert_cassettes.py
Last updated: {datetime.now().isoformat()}

These fixtures are generated from existing VCR cassettes which contain real,
already-sanitized API responses from Coder.

Usage:
    from tests.fixtures import generated

    # Use in tests
    workspace = generated.make_test_list_workspaces()
    templates = generated.make_test_get_template_version_rich_parameters()
"""

from typing import Any


'''

    content = header + "\n".join(fixtures)

    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w") as f:
        f.write(content)


if __name__ == "__main__":
    convert_all_cassettes()
