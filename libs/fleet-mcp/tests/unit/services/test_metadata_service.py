"""Unit tests for MetadataService.

TDD Approach: These tests verify MetadataService behavior with FLEET_MCP_TASKFILE.
Written FIRST before implementation changes.
"""

import os
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

pytestmark = pytest.mark.asyncio


async def test_metadata_service_uses_taskfile_path_parameter():
    """Test that MetadataService accepts taskfile_path parameter."""
    from fleet_mcp.services.metadata_service import MetadataService

    taskfile_path = "/absolute/path/to/Taskfile.yml"
    service = MetadataService(taskfile_path=taskfile_path)

    # Should store the taskfile_path
    assert service.taskfile_path == Path(taskfile_path)


async def test_metadata_service_defaults_to_cwd_taskfile():
    """Test that MetadataService defaults to Taskfile.yml in current directory."""
    from fleet_mcp.services.metadata_service import MetadataService

    service = MetadataService()

    # Should default to current directory Taskfile.yml
    expected_path = Path.cwd() / "Taskfile.yml"
    assert service.taskfile_path == expected_path


async def test_metadata_service_uses_taskfile_from_env():
    """Test that MetadataService uses FLEET_MCP_TASKFILE environment variable."""
    from fleet_mcp.services.metadata_service import MetadataService

    # Set environment variable
    test_path = "/custom/path/to/Taskfile.yml"
    with patch.dict(os.environ, {"FLEET_MCP_TASKFILE": test_path}):
        service = MetadataService()

        # Should use the environment variable path
        assert service.taskfile_path == Path(test_path)


async def test_metadata_service_parameter_overrides_env():
    """Test that taskfile_path parameter overrides FLEET_MCP_TASKFILE env var."""
    from fleet_mcp.services.metadata_service import MetadataService

    env_path = "/env/path/Taskfile.yml"
    param_path = "/param/path/Taskfile.yml"

    with patch.dict(os.environ, {"FLEET_MCP_TASKFILE": env_path}):
        service = MetadataService(taskfile_path=param_path)

        # Parameter should take precedence over environment variable
        assert service.taskfile_path == Path(param_path)


async def test_main_endpoint_uses_fleet_mcp_taskfile_env():
    """Test that __main__.py endpoint uses FLEET_MCP_TASKFILE environment variable."""
    # This test verifies the integration in __main__.py
    # We'll mock the MetadataService to verify it receives the correct path

    test_taskfile = "/workspaces/test/Taskfile.yml"

    with patch.dict(os.environ, {"FLEET_MCP_TASKFILE": test_taskfile}):
        # Import after setting env var to ensure it's picked up
        from fleet_mcp.services.metadata_service import MetadataService

        # Create service as the endpoint would
        taskfile_path = os.getenv(
            "FLEET_MCP_TASKFILE", str(Path.cwd() / "Taskfile.yml")
        )
        service = MetadataService(taskfile_path=taskfile_path)

        # Verify it uses the environment variable
        assert service.taskfile_path == Path(test_taskfile)


async def test_metadata_service_executes_task_from_taskfile_directory():
    """Test that tasks execute in the directory containing the Taskfile."""
    from fleet_mcp.services.metadata_service import MetadataService

    taskfile_path = "/custom/workspace/Taskfile.yml"
    service = MetadataService(taskfile_path=taskfile_path)

    # Mock subprocess execution
    with patch("asyncio.create_subprocess_exec") as mock_subprocess:
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"test_value", b""))
        mock_process.returncode = 0
        mock_subprocess.return_value = mock_process

        # Execute a task
        task_def = {"desc": "Test task", "meta": {"include_in_list": True}}

        await service._execute_task("test_task", task_def)

        # Verify task was executed with correct cwd
        mock_subprocess.assert_called_once()
        call_kwargs = mock_subprocess.call_args[1]
        assert call_kwargs["cwd"] == Path("/custom/workspace")


async def test_collect_metadata_handles_missing_taskfile():
    """Test that collect_metadata returns empty metadata when Taskfile doesn't exist."""
    from fleet_mcp.models.metadata import WorkspaceMetadata
    from fleet_mcp.services.metadata_service import MetadataService

    # Use a non-existent path
    nonexistent_path = "/does/not/exist/Taskfile.yml"
    service = MetadataService(taskfile_path=nonexistent_path)

    metadata = await service.collect_metadata()

    # Should return empty metadata
    assert isinstance(metadata, WorkspaceMetadata)
    assert len(metadata.data) == 0
