"""Moon integration: repo detection and task metadata."""

import json
import subprocess
from pathlib import Path


class MoonError(Exception):
    """Error related to Moon operations."""

    pass


def find_moon_root(start_path: Path | None = None) -> Path:
    """Find the Moon workspace root directory.

    Args:
        start_path: Starting directory to search from. Defaults to cwd.

    Returns:
        Path to the Moon workspace root (directory containing .moon/).

    Raises:
        MoonError: If not within a Moon repository.
    """
    if start_path is None:
        start_path = Path.cwd()

    current = start_path.resolve()

    while current != current.parent:
        if (current / ".moon").is_dir():
            return current
        current = current.parent

    # Check root directory as well
    if (current / ".moon").is_dir():
        return current

    raise MoonError(
        "Not within a Moon repository. "
        "Could not find .moon/ directory in current or parent directories."
    )


def is_moon_repo(start_path: Path | None = None) -> bool:
    """Check if the current directory is within a Moon repository.

    Args:
        start_path: Starting directory to search from. Defaults to cwd.

    Returns:
        True if within a Moon repository, False otherwise.
    """
    try:
        find_moon_root(start_path)
        return True
    except MoonError:
        return False


def get_task_output_files(project_id: str, task_id: str) -> list[str]:
    """Get the output files defined for a Moon task.

    Args:
        project_id: Moon project identifier.
        task_id: Moon task identifier.

    Returns:
        List of output file paths relative to the project directory.

    Raises:
        MoonError: If unable to query Moon or parse the output.
    """
    try:
        result = subprocess.run(
            ["moon", "task", f"{project_id}:{task_id}", "--json"],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as e:
        raise MoonError(
            f"Failed to query Moon task {project_id}:{task_id}: {e.stderr}"
        ) from e
    except FileNotFoundError:
        raise MoonError("Moon CLI not found. Is Moon installed?")

    try:
        task_data = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        raise MoonError(f"Failed to parse Moon task output: {e}") from e

    # Extract output files from the task metadata
    output_files = task_data.get("outputFiles", {})

    # outputFiles is a dict with file paths as keys
    return list(output_files.keys())


def get_project_root(project_id: str) -> Path:
    """Get the root directory of a Moon project.

    Args:
        project_id: Moon project identifier.

    Returns:
        Path to the project root directory.

    Raises:
        MoonError: If unable to query Moon or parse the output.
    """
    try:
        result = subprocess.run(
            ["moon", "project", project_id, "--json"],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as e:
        raise MoonError(f"Failed to query Moon project {project_id}: {e.stderr}") from e
    except FileNotFoundError:
        raise MoonError("Moon CLI not found. Is Moon installed?")

    try:
        project_data = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        raise MoonError(f"Failed to parse Moon project output: {e}") from e

    return Path(project_data.get("root", "."))
