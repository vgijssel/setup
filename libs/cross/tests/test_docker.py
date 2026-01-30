"""Tests for Docker build logic."""

from cross.docker import DOCKERFILE_TEMPLATE, generate_dockerfile


class TestGenerateDockerfile:
    """Tests for generate_dockerfile function."""

    def test_generates_dockerfile(self) -> None:
        """Test that generate_dockerfile returns the template."""
        result = generate_dockerfile()
        assert result == DOCKERFILE_TEMPLATE

    def test_dockerfile_has_base_stage(self) -> None:
        """Test that Dockerfile has base stage."""
        result = generate_dockerfile()
        assert "FROM ubuntu:22.04 AS base" in result

    def test_dockerfile_has_skeleton_stage(self) -> None:
        """Test that Dockerfile has skeleton stage."""
        result = generate_dockerfile()
        assert "FROM base AS skeleton" in result

    def test_dockerfile_has_build_stage(self) -> None:
        """Test that Dockerfile has build stage."""
        result = generate_dockerfile()
        assert "FROM base AS build" in result

    def test_dockerfile_installs_moon(self) -> None:
        """Test that Dockerfile installs Moon."""
        result = generate_dockerfile()
        assert "moonrepo.dev/install/moon.sh" in result

    def test_dockerfile_sets_cross_moon_env(self) -> None:
        """Test that Dockerfile sets CROSS_MOON=true."""
        result = generate_dockerfile()
        assert "ENV CROSS_MOON=true" in result

    def test_dockerfile_has_build_args(self) -> None:
        """Test that Dockerfile has required build args."""
        result = generate_dockerfile()
        assert "ARG CROSS_MOON_PROJECT_ID" in result
        assert "ARG CROSS_MOON_TASK_ID" in result

    def test_dockerfile_scaffolds_project(self) -> None:
        """Test that Dockerfile scaffolds the project."""
        result = generate_dockerfile()
        assert "moon docker scaffold $CROSS_MOON_PROJECT_ID" in result

    def test_dockerfile_runs_task(self) -> None:
        """Test that Dockerfile runs the Moon task."""
        result = generate_dockerfile()
        assert "moon run $CROSS_MOON_PROJECT_ID:$CROSS_MOON_TASK_ID" in result

    def test_dockerfile_copies_workspace(self) -> None:
        """Test that Dockerfile copies workspace configs."""
        result = generate_dockerfile()
        assert "COPY --from=skeleton /app/.moon/docker/workspace" in result

    def test_dockerfile_copies_sources(self) -> None:
        """Test that Dockerfile copies project sources."""
        result = generate_dockerfile()
        assert "COPY --from=skeleton /app/.moon/docker/sources" in result

    def test_dockerfile_runs_setup(self) -> None:
        """Test that Dockerfile runs moon docker setup."""
        result = generate_dockerfile()
        assert "RUN moon docker setup" in result
