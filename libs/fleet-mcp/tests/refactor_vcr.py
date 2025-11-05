#!/usr/bin/env python3
"""
Script to refactor pytest-vcr tests to use VCR.py directly.

This script:
1. Removes @pytest.mark.vcr decorators
2. Adds my_vcr and vcr_cassette_dir fixtures to test function parameters
3. Wraps test body with VCR cassette context manager
4. Removes vcr_cassette parameter and is_recording checks
5. Removes asyncio.sleep() calls that were conditional on is_recording
"""

import re
import sys
from pathlib import Path


def refactor_test_function(content: str) -> str:
    """Refactor a single test function"""

    # Remove @pytest.mark.vcr decorator
    content = re.sub(r"@pytest\.mark\.vcr\n", "", content)

    # Find test function signatures and add fixtures if needed
    def add_fixtures_to_signature(match):
        indent = match.group(1)
        func_type = match.group(2)
        func_name = match.group(3)
        params = match.group(4)

        # Check if fixtures already present
        if "my_vcr" in params and "vcr_cassette_dir" in params:
            return match.group(0)

        # Skip if no params at all (shouldn't happen in our tests)
        if not params.strip():
            new_params = "my_vcr, vcr_cassette_dir"
        else:
            # Add fixtures to end
            new_params = params + ", my_vcr, vcr_cassette_dir"

        return f"{indent}{func_type} {func_name}({new_params}):"

    content = re.sub(
        r"^(\s*)(async def|def) (test_\w+)\((.*?)\):",
        add_fixtures_to_signature,
        content,
        flags=re.MULTILINE,
    )

    return content


def add_vcr_context_manager(content: str, test_name: str) -> str:
    """Add VCR context manager to test body"""

    # Find the test function
    pattern = rf'(async def {test_name}\(.*?\):)\n(    """.*?"""\n)?'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        return content

    # Get the docstring if present
    func_start = match.group(1)
    docstring = match.group(2) if match.group(2) else ""

    # Find where to insert the cassette context
    insertion_point = match.end()

    # Build the cassette setup
    cassette_setup = f"""    cassette_path = str(vcr_cassette_dir / "{test_name}.yaml")
    with my_vcr.use_cassette(cassette_path):
"""

    # Get the rest of the function
    rest_of_function = content[insertion_point:]

    # Find the next function or end of file
    next_func_match = re.search(r"\n(async def |def |class |\Z)", rest_of_function)
    if next_func_match:
        func_body = rest_of_function[: next_func_match.start()]
        after_func = rest_of_function[next_func_match.start() :]
    else:
        func_body = rest_of_function
        after_func = ""

    # Indent the function body by 4 spaces
    func_body_lines = func_body.split("\n")
    indented_body = "\n".join(
        ("    " + line if line.strip() else line) for line in func_body_lines
    )

    # Reconstruct
    new_content = (
        content[: match.start()]
        + func_start
        + "\n"
        + docstring
        + cassette_setup
        + indented_body
        + after_func
    )

    return new_content


def remove_is_recording_checks(content: str) -> str:
    """Remove is_recording checks and conditional sleeps"""

    # Remove is_recording variable assignments
    content = re.sub(r"\s+is_recording = not vcr_cassette\.rewound\n", "", content)

    # Remove conditional asyncio.sleep calls
    content = re.sub(
        r"\s+if is_recording:\n\s+await asyncio\.sleep\(\d+\)\n", "", content
    )

    # Remove import asyncio if it's only used for sleep
    # (This is conservative - only removes if asyncio isn't used elsewhere)
    if "asyncio.sleep" not in content and "asyncio." not in content:
        content = re.sub(r"\s+import asyncio\n", "", content)

    return content


def remove_vcr_cassette_param(content: str) -> str:
    """Remove vcr_cassette parameter from test signatures"""

    # Remove vcr_cassette parameter
    content = re.sub(r"(\(.*?), vcr_cassette(.*?\))", r"\1\2", content)

    # Clean up double commas
    content = re.sub(r",\s*,", ",", content)

    # Clean up trailing commas before closing paren
    content = re.sub(r",\s*\)", ")", content)

    return content


def main():
    """Main refactoring function"""
    test_file = Path(__file__).parent / "contract" / "test_mcp_tools.py"

    if not test_file.exists():
        print(f"Error: {test_file} not found")
        sys.exit(1)

    print(f"Refactoring {test_file}...")

    # Read the file
    content = test_file.read_text()

    # Apply refactorings
    print("1. Removing @pytest.mark.vcr decorators and adding fixtures...")
    content = refactor_test_function(content)

    print("2. Removing vcr_cassette parameters...")
    content = remove_vcr_cassette_param(content)

    print("3. Removing is_recording checks...")
    content = remove_is_recording_checks(content)

    # Find all test functions
    test_functions = re.findall(r"async def (test_\w+)\(", content)

    print(f"4. Adding VCR context managers to {len(test_functions)} tests...")
    for test_name in test_functions:
        content = add_vcr_context_manager(content, test_name)

    # Write back
    test_file.write_text(content)

    print("✓ Refactoring complete!")
    print("\nNext steps:")
    print(f"1. Review the changes: git diff {test_file}")
    print("2. Run the tests: uv run pytest tests/contract/test_mcp_tools.py")
    print("3. Fix any remaining issues manually")


if __name__ == "__main__":
    main()
