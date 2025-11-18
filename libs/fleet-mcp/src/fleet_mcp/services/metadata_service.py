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

            # Execute all metadata tasks
            metadata_fields = {}
            for task_name, task_def in metadata_tasks.items():
                field = await self._execute_task(task_name, task_def)
                metadata_fields[task_name] = field

            return WorkspaceMetadata(data=metadata_fields)

        except Exception as e:
            logger.error(f"Error collecting metadata: {e}")
            return WorkspaceMetadata(data={})

    async def _execute_task(self, task_name: str, task_def: dict) -> MetadataField:
        """Execute a single metadata task.

        Args:
            task_name: Name of the task
            task_def: Task definition from Taskfile

        Returns:
            MetadataField with value or error
        """
        # Extract schema from task definition
        description = task_def.get("desc", "No description")
        include_in_list = task_def["meta"]["include_in_list"]
        schema = MetadataSchema(
            description=description, include_in_list=include_in_list
        )

        try:
            # Execute task using Task CLI
            # Use the directory containing the Taskfile as the working directory
            taskfile_dir = self.taskfile_path.parent
            result = await asyncio.create_subprocess_exec(
                "task",
                task_name,
                "--silent",
                "--parallel",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=taskfile_dir,
            )

            stdout, stderr = await asyncio.wait_for(result.communicate(), timeout=5.0)

            if result.returncode == 0:
                # Success: capture output as value
                value = stdout.decode().strip()
                return MetadataField(
                    value=value if value else None, error=None, schema=schema
                )
            else:
                # Task failed: capture error
                error_msg = (
                    stderr.decode().strip()
                    or f"Task exited with code {result.returncode}"
                )
                return MetadataField(value=None, error=error_msg, schema=schema)

        except asyncio.TimeoutError:
            logger.warning(f"Task '{task_name}' timed out after 5 seconds")
            return MetadataField(
                value=None, error="Task execution timeout (5s)", schema=schema
            )

        except FileNotFoundError:
            logger.error("Task CLI not found - is go-task/task installed?")
            return MetadataField(
                value=None, error="Task CLI not available", schema=schema
            )

        except Exception as e:
            logger.error(f"Error executing task '{task_name}': {e}")
            return MetadataField(value=None, error=str(e), schema=schema)
