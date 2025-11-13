"""Taskfile parser for extracting metadata task definitions.

Parses Taskfile.yml files to extract tasks with a 'meta' key that define
workspace metadata fields. The meta key must contain only 'include_in_list'.
"""

from pathlib import Path
from typing import Any

import yaml


class TaskfileParser:
    """Parser for Taskfile.yml to extract metadata task definitions.

    Metadata tasks are identified by the presence of a 'meta' key with
    structure: { "include_in_list": boolean }

    Schema validation ensures:
    - meta.include_in_list is required
    - no additional properties are allowed in meta
    """

    def parse_metadata_tasks(self, taskfile_path: str) -> dict[str, dict[str, Any]]:
        """Parse Taskfile and extract tasks with meta key.

        Args:
            taskfile_path: Path to Taskfile.yml

        Returns:
            Dictionary mapping task name to task definition (with desc, meta, cmds)

        Raises:
            FileNotFoundError: If Taskfile doesn't exist
            yaml.YAMLError: If Taskfile is malformed
            ValueError: If meta key structure is invalid
        """
        path = Path(taskfile_path)
        if not path.exists():
            raise FileNotFoundError(f"Taskfile not found: {taskfile_path}")

        with open(taskfile_path, "r") as f:
            content = f.read()

        return self.parse_metadata_tasks_from_string(content)

    def parse_metadata_tasks_from_string(self, content: str) -> dict[str, dict[str, Any]]:
        """Parse Taskfile content string and extract tasks with meta key.

        Args:
            content: YAML content of Taskfile

        Returns:
            Dictionary mapping task name to task definition

        Raises:
            yaml.YAMLError: If content is malformed
            ValueError: If meta key structure is invalid
        """
        try:
            data = yaml.safe_load(content)
        except yaml.YAMLError as e:
            raise yaml.YAMLError(f"Failed to parse Taskfile YAML: {e}")

        if not data or "tasks" not in data:
            return {}

        tasks = data.get("tasks", {})
        if not tasks:
            return {}

        metadata_tasks = {}

        for task_name, task_def in tasks.items():
            if not isinstance(task_def, dict):
                continue

            if "meta" not in task_def:
                continue

            # Validate meta key structure
            meta = task_def["meta"]
            if not isinstance(meta, dict):
                raise ValueError(f"Task '{task_name}': meta must be a dictionary")

            if "include_in_list" not in meta:
                raise ValueError(
                    f"Task '{task_name}': meta.include_in_list is required "
                    "(per taskfile-meta-schema.json contract)"
                )

            # Check for additional properties (only include_in_list is allowed)
            allowed_keys = {"include_in_list"}
            extra_keys = set(meta.keys()) - allowed_keys
            if extra_keys:
                raise ValueError(
                    f"Task '{task_name}': meta contains additional properties {extra_keys}. "
                    "Only 'include_in_list' is allowed per taskfile-meta-schema.json"
                )

            # Validate include_in_list is boolean
            if not isinstance(meta["include_in_list"], bool):
                raise ValueError(
                    f"Task '{task_name}': meta.include_in_list must be boolean, "
                    f"got {type(meta['include_in_list']).__name__}"
                )

            metadata_tasks[task_name] = task_def

        return metadata_tasks
