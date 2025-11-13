"""Unit tests for Taskfile parser.

TDD Approach: These tests are written FIRST, before the parser is implemented.
Expected to FAIL until parser is created in fleet_mcp/services/taskfile_parser.py
"""

import pytest
import yaml
from pathlib import Path
from tempfile import NamedTemporaryFile


def test_parse_taskfile_with_metadata_tasks():
    """Test parsing Taskfile with tasks that have meta key."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  pull_request_number:
    desc: "The number of the current pull request on GitHub"
    meta:
      include_in_list: true
    cmds:
      - echo "819"

  git_branch:
    desc: "The name of the current git branch"
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --abbrev-ref HEAD
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()
        metadata_tasks = parser.parse_metadata_tasks(taskfile_path)

        assert len(metadata_tasks) == 2
        assert "pull_request_number" in metadata_tasks
        assert "git_branch" in metadata_tasks

        pr_task = metadata_tasks["pull_request_number"]
        assert pr_task["desc"] == "The number of the current pull request on GitHub"
        assert pr_task["meta"]["include_in_list"] is True

        branch_task = metadata_tasks["git_branch"]
        assert branch_task["desc"] == "The name of the current git branch"
        assert branch_task["meta"]["include_in_list"] is False
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_filters_non_metadata_tasks():
    """Test that tasks without meta key are filtered out."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  pull_request_number:
    desc: "PR number"
    meta:
      include_in_list: true
    cmds:
      - echo "819"

  regular_task:
    desc: "Regular task without meta key"
    cmds:
      - echo "hello"
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()
        metadata_tasks = parser.parse_metadata_tasks(taskfile_path)

        assert len(metadata_tasks) == 1
        assert "pull_request_number" in metadata_tasks
        assert "regular_task" not in metadata_tasks
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_empty():
    """Test parsing Taskfile with no tasks."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks: {}
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()
        metadata_tasks = parser.parse_metadata_tasks(taskfile_path)

        assert len(metadata_tasks) == 0
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_missing_file():
    """Test parsing non-existent Taskfile raises appropriate error."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    parser = TaskfileParser()

    with pytest.raises(FileNotFoundError):
        parser.parse_metadata_tasks("/non/existent/Taskfile.yml")


def test_parse_taskfile_malformed_yaml():
    """Test parsing malformed YAML raises appropriate error."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"
tasks:
  bad_yaml: [unclosed bracket
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()

        with pytest.raises(yaml.YAMLError):
            parser.parse_metadata_tasks(taskfile_path)
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_no_tasks_key():
    """Test parsing Taskfile without tasks key."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()
        metadata_tasks = parser.parse_metadata_tasks(taskfile_path)

        assert len(metadata_tasks) == 0
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_meta_without_include_in_list():
    """Test that meta key must have include_in_list field."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  task_with_empty_meta:
    desc: "Task with empty meta"
    meta: {}
    cmds:
      - echo "test"
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()

        # Should raise validation error because include_in_list is required
        with pytest.raises(ValueError) as exc_info:
            parser.parse_metadata_tasks(taskfile_path)

        assert "include_in_list" in str(exc_info.value)
    finally:
        Path(taskfile_path).unlink()


def test_parse_taskfile_from_string():
    """Test parsing Taskfile from string content."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  pr_number:
    desc: "PR number"
    meta:
      include_in_list: true
    cmds:
      - echo "123"
"""

    parser = TaskfileParser()
    metadata_tasks = parser.parse_metadata_tasks_from_string(taskfile_content)

    assert len(metadata_tasks) == 1
    assert "pr_number" in metadata_tasks
    assert metadata_tasks["pr_number"]["meta"]["include_in_list"] is True


def test_parse_taskfile_with_complex_meta():
    """Test that meta key only accepts include_in_list (no additional properties)."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  task_with_extra_meta:
    desc: "Task with extra meta fields"
    meta:
      include_in_list: true
      extra_field: "should fail"
    cmds:
      - echo "test"
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()

        # Should raise validation error because only include_in_list is allowed
        with pytest.raises(ValueError) as exc_info:
            parser.parse_metadata_tasks(taskfile_path)

        assert "additional properties" in str(exc_info.value).lower() or "extra" in str(
            exc_info.value
        ).lower()
    finally:
        Path(taskfile_path).unlink()


def test_get_metadata_task_names():
    """Test getting list of metadata task names."""
    from fleet_mcp.services.taskfile_parser import TaskfileParser

    taskfile_content = """
version: "3"

tasks:
  pr_number:
    desc: "PR number"
    meta:
      include_in_list: true
    cmds:
      - echo "123"

  git_branch:
    desc: "Git branch"
    meta:
      include_in_list: false
    cmds:
      - git branch

  regular_task:
    desc: "Regular task"
    cmds:
      - echo "hello"
"""

    with NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
        f.write(taskfile_content)
        taskfile_path = f.name

    try:
        parser = TaskfileParser()
        metadata_tasks = parser.parse_metadata_tasks(taskfile_path)
        task_names = list(metadata_tasks.keys())

        assert len(task_names) == 2
        assert "pr_number" in task_names
        assert "git_branch" in task_names
        assert "regular_task" not in task_names
    finally:
        Path(taskfile_path).unlink()
