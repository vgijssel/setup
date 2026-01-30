"""Tests for Docker build logic."""

from cross.docker import get_dockerfile_path


class TestGetDockerfilePath:
    """Tests for get_dockerfile_path function."""

    def test_returns_path(self) -> None:
        """Test that get_dockerfile_path returns a Path object."""
        result = get_dockerfile_path()
        assert result.name == "Dockerfile"

    def test_dockerfile_exists(self) -> None:
        """Test that the Dockerfile exists."""
        result = get_dockerfile_path()
        assert result.exists()


class TestDockerfileContent:
    """Tests for Dockerfile content."""

    def test_dockerfile_has_base_stage(self) -> None:
        """Test that Dockerfile has base stage."""
        content = get_dockerfile_path().read_text()
        assert "FROM ubuntu:22.04 AS base" in content

    def test_dockerfile_has_skeleton_stage(self) -> None:
        """Test that Dockerfile has skeleton stage."""
        content = get_dockerfile_path().read_text()
        assert "FROM base AS skeleton" in content

    def test_dockerfile_has_build_stage(self) -> None:
        """Test that Dockerfile has build stage."""
        content = get_dockerfile_path().read_text()
        assert "FROM base AS build" in content

    def test_dockerfile_installs_moon(self) -> None:
        """Test that Dockerfile installs Moon."""
        content = get_dockerfile_path().read_text()
        assert "moonrepo.dev/install/moon.sh" in content

    def test_dockerfile_sets_cross_moon_env(self) -> None:
        """Test that Dockerfile sets CROSS_MOON=true."""
        content = get_dockerfile_path().read_text()
        assert "ENV CROSS_MOON=true" in content

    def test_dockerfile_has_build_args(self) -> None:
        """Test that Dockerfile has required build args."""
        content = get_dockerfile_path().read_text()
        assert "ARG CROSS_MOON_PROJECT_ID" in content
        assert "ARG CROSS_MOON_TASK_ID" in content

    def test_dockerfile_scaffolds_project(self) -> None:
        """Test that Dockerfile scaffolds the project."""
        content = get_dockerfile_path().read_text()
        assert "moon docker scaffold $CROSS_MOON_PROJECT_ID" in content

    def test_dockerfile_runs_task(self) -> None:
        """Test that Dockerfile runs the Moon task."""
        content = get_dockerfile_path().read_text()
        assert "moon run $CROSS_MOON_PROJECT_ID:$CROSS_MOON_TASK_ID" in content

    def test_dockerfile_copies_workspace(self) -> None:
        """Test that Dockerfile copies workspace configs."""
        content = get_dockerfile_path().read_text()
        assert "COPY --from=skeleton /app/.moon/docker/workspace" in content

    def test_dockerfile_copies_sources(self) -> None:
        """Test that Dockerfile copies project sources."""
        content = get_dockerfile_path().read_text()
        assert "COPY --from=skeleton /app/.moon/docker/sources" in content

    def test_dockerfile_runs_setup(self) -> None:
        """Test that Dockerfile runs moon docker setup."""
        content = get_dockerfile_path().read_text()
        assert "RUN moon docker setup" in content
