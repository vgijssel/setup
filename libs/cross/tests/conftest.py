"""Shared pytest fixtures for cross tests."""

import os
from pathlib import Path

import pytest


@pytest.fixture
def mock_moon_repo(tmp_path: Path) -> Path:
    """Create a mock Moon repository structure.

    Returns:
        Path to the mock Moon workspace root.
    """
    moon_dir = tmp_path / ".moon"
    moon_dir.mkdir()
    return tmp_path


@pytest.fixture
def mock_moon_project(mock_moon_repo: Path) -> Path:
    """Create a mock Moon project within the mock repo.

    Returns:
        Path to the mock project directory.
    """
    project_dir = mock_moon_repo / "libs" / "test-project"
    project_dir.mkdir(parents=True)

    # Create a moon.yml file
    moon_yml = project_dir / "moon.yml"
    moon_yml.write_text("""\
language: python
tasks:
  build:
    command: echo "building"
    outputs:
      - dist/output.txt
""")

    return project_dir


@pytest.fixture
def clean_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """Remove cross-related environment variables."""
    for var in ["CROSS_PLATFORM", "CROSS_MOON", "MOON_PROJECT_ID", "MOON_TASK_ID"]:
        monkeypatch.delenv(var, raising=False)


@pytest.fixture
def cross_moon_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """Set CROSS_MOON=true to simulate running inside a cross container."""
    monkeypatch.setenv("CROSS_MOON", "true")
