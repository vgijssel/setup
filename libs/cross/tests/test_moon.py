"""Tests for Moon integration."""

import os
from pathlib import Path

import pytest
from cross.moon import MoonError, find_moon_root, is_moon_repo


class TestFindMoonRoot:
    """Tests for find_moon_root function."""

    def test_finds_moon_root_in_current_dir(self, mock_moon_repo: Path) -> None:
        """Test finding Moon root when .moon is in current directory."""
        os.chdir(mock_moon_repo)
        result = find_moon_root()
        assert result == mock_moon_repo

    def test_finds_moon_root_in_parent_dir(self, mock_moon_repo: Path) -> None:
        """Test finding Moon root when .moon is in parent directory."""
        subdir = mock_moon_repo / "libs" / "myproject"
        subdir.mkdir(parents=True)
        result = find_moon_root(subdir)
        assert result == mock_moon_repo

    def test_finds_moon_root_from_deep_nested(self, mock_moon_repo: Path) -> None:
        """Test finding Moon root from deeply nested directory."""
        deep_dir = mock_moon_repo / "a" / "b" / "c" / "d" / "e"
        deep_dir.mkdir(parents=True)
        result = find_moon_root(deep_dir)
        assert result == mock_moon_repo

    def test_raises_error_when_not_in_moon_repo(self, tmp_path: Path) -> None:
        """Test that MoonError is raised when not in a Moon repo."""
        # Create a directory without .moon
        non_moon_dir = tmp_path / "not-moon"
        non_moon_dir.mkdir()

        with pytest.raises(MoonError) as exc_info:
            find_moon_root(non_moon_dir)

        assert "Not within a Moon repository" in str(exc_info.value)
        assert ".moon/" in str(exc_info.value)


class TestIsMoonRepo:
    """Tests for is_moon_repo function."""

    def test_returns_true_for_moon_repo(self, mock_moon_repo: Path) -> None:
        """Test that is_moon_repo returns True for Moon repositories."""
        assert is_moon_repo(mock_moon_repo) is True

    def test_returns_true_for_subdirectory(self, mock_moon_repo: Path) -> None:
        """Test that is_moon_repo returns True for subdirectories."""
        subdir = mock_moon_repo / "libs"
        subdir.mkdir()
        assert is_moon_repo(subdir) is True

    def test_returns_false_for_non_moon_dir(self, tmp_path: Path) -> None:
        """Test that is_moon_repo returns False for non-Moon directories."""
        non_moon_dir = tmp_path / "not-moon"
        non_moon_dir.mkdir()
        assert is_moon_repo(non_moon_dir) is False
