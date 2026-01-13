"""Service for collecting workspace metadata from Taskfile execution.

This service reads Taskfile.yml, identifies metadata tasks, executes them,
and returns structured metadata.
"""

import asyncio
import logging
from pathlib import Path
from typing import Optional

from ..models.metadata import MetadataField, MetadataSchema, WorkspaceMetadata
from ..services.taskfile_parser import TaskfileParser

logger = logging.getLogger(__name__)


class MetadataService:
    """Service for collecting workspace metadata by executing Taskfile tasks.

    This service:
    1. Reads Taskfile.yml from workspace
    2. Parses tasks with 'meta' key
    3. Executes each metadata task
    4. Returns WorkspaceMetadata with results
    """

    def __init__(self, taskfile_path: Optional[str] = None):
        """Initialize MetadataService.

        Args:
            taskfile_path: Absolute path to Taskfile.yml (defaults to FLEET_MCP_TASKFILE env var or ./Taskfile.yml)
        """
        import os

        # Priority: parameter > env var > default
        if taskfile_path:
            self.taskfile_path = Path(taskfile_path)
        else:
            env_taskfile = os.getenv("FLEET_MCP_TASKFILE")
            if env_taskfile:
                self.taskfile_path = Path(env_taskfile)
            else:
                self.taskfile_path = Path.cwd() / "Taskfile.yml"

        self.parser = TaskfileParser()

    async def collect_metadata(self) -> WorkspaceMetadata:
        """Collect all metadata from Taskfile execution.

        Returns:
            WorkspaceMetadata with all collected fields

        Note:
            Returns empty metadata if Taskfile missing or all tasks fail
        """
        # Check if Taskfile exists
        if not self.taskfile_path.exists():
            logger.info(f"No Taskfile found at {self.taskfile_path}")
            return WorkspaceMetadata(data={})

        try:
            # Parse metadata tasks
            metadata_tasks = self.parser.parse_metadata_tasks(str(self.taskfile_path))

            if not metadata_tasks:
                logger.info("No metadata tasks found in Taskfile")
                return WorkspaceMetadata(data={})

            # Execute all metadata tasks in a single invocation
            metadata_fields = await self._execute_all_tasks(metadata_tasks)

            return WorkspaceMetadata(data=metadata_fields)

        except Exception as e:
            logger.error(f"Error collecting metadata: {e}")
            return WorkspaceMetadata(data={})

    async def _execute_all_tasks(
        self, metadata_tasks: dict[str, dict]
    ) -> dict[str, MetadataField]:
        """Execute all metadata tasks in a single Task CLI invocation.

        Args:
            metadata_tasks: Dictionary of task names to task definitions

        Returns:
            Dictionary of task names to MetadataField results
        """
        if not metadata_tasks:
            return {}

        # Build schemas for all tasks
        task_schemas = {}
        for task_name, task_def in metadata_tasks.items():
            description = task_def.get("desc", "No description")
            include_in_list = task_def["meta"]["include_in_list"]
            task_schemas[task_name] = MetadataSchema(
                description=description, include_in_list=include_in_list
            )

        try:
            # Execute all tasks in a single invocation
            # Use the directory containing the Taskfile as the working directory
            taskfile_dir = self.taskfile_path.parent
            task_names = list(metadata_tasks.keys())

            result = await asyncio.create_subprocess_exec(
                "task",
                "--silent",
                "--parallel",
                *task_names,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=taskfile_dir,
            )

            stdout, stderr = await asyncio.wait_for(result.communicate(), timeout=5.0)

            # Parse output - each task should output one line
            output_lines = stdout.decode().strip().split("\n") if stdout else []

            # Build result dictionary
            metadata_fields = {}
            for i, task_name in enumerate(task_names):
                schema = task_schemas[task_name]

                if result.returncode != 0:
                    # If any task failed, capture error from stderr
                    error_msg = (
                        stderr.decode().strip()
                        or f"Task exited with code {result.returncode}"
                    )
                    metadata_fields[task_name] = MetadataField(
                        value=None, error=error_msg, schema=schema
                    )
                elif i < len(output_lines) and output_lines[i]:
                    # Success: capture output value for this task
                    metadata_fields[task_name] = MetadataField(
                        value=output_lines[i], error=None, schema=schema
                    )
                else:
                    # No output for this task
                    metadata_fields[task_name] = MetadataField(
                        value=None, error=None, schema=schema
                    )

            return metadata_fields

        except asyncio.TimeoutError:
            logger.warning("Task execution timed out after 5 seconds")
            # Return all tasks with timeout error
            return {
                name: MetadataField(
                    value=None,
                    error="Task execution timeout (5s)",
                    schema=task_schemas[name],
                )
                for name in metadata_tasks.keys()
            }

        except FileNotFoundError:
            logger.error("Task CLI not found - is go-task/task installed?")
            # Return all tasks with CLI not available error
            return {
                name: MetadataField(
                    value=None,
                    error="Task CLI not available",
                    schema=task_schemas[name],
                )
                for name in metadata_tasks.keys()
            }

        except Exception as e:
            logger.error(f"Error executing tasks: {e}")
            # Return all tasks with generic error
            return {
                name: MetadataField(value=None, error=str(e), schema=task_schemas[name])
                for name in metadata_tasks.keys()
            }
