"""Docker build and extraction logic for cross-platform builds."""

import subprocess
from pathlib import Path

from .moon import MoonError, get_task_output_files

# Path to the Dockerfile relative to this module
_DOCKERFILE_PATH = Path(__file__).parent.parent.parent / "Dockerfile"


class DockerError(Exception):
    """Error related to Docker operations."""

    pass


def get_dockerfile_path() -> Path:
    """Get the path to the cross-build Dockerfile.

    Returns:
        Path to the Dockerfile.

    Raises:
        DockerError: If the Dockerfile is not found.
    """
    if not _DOCKERFILE_PATH.exists():
        raise DockerError(f"Dockerfile not found at {_DOCKERFILE_PATH}")
    return _DOCKERFILE_PATH


def build_image(
    workspace_root: Path,
    platform: str,
    project_id: str,
    task_id: str,
    image_tag: str,
) -> None:
    """Build a Docker image for the target platform.

    Args:
        workspace_root: Path to the Moon workspace root.
        platform: Target platform (e.g., 'linux/amd64').
        project_id: Moon project identifier.
        task_id: Moon task identifier.
        image_tag: Tag for the built image.

    Raises:
        DockerError: If the Docker build fails.
    """
    dockerfile_path = get_dockerfile_path()

    cmd = [
        "docker",
        "buildx",
        "build",
        "--progress=plain",  # Show build progress in plain text
        "--platform",
        platform,
        "--build-arg",
        f"CROSS_MOON_PROJECT_ID={project_id}",
        "--build-arg",
        f"CROSS_MOON_TASK_ID={task_id}",
        "-f",
        str(dockerfile_path),
        "-t",
        image_tag,
        "--load",
        str(workspace_root),
    ]

    # Stream output in real-time to stdout/stderr
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,  # Line buffered
    )

    # Stream output line by line
    output_lines = []
    if process.stdout:
        for line in process.stdout:
            print(line, end="", flush=True)
            output_lines.append(line)

    returncode = process.wait()

    if returncode != 0:
        raise DockerError(f"Docker build failed with exit code {returncode}")


def extract_output_files(
    image_tag: str,
    project_id: str,
    task_id: str,
    project_root: Path,
    workspace_root: Path,
) -> list[Path]:
    """Extract output files from a Docker image to the host.

    Args:
        image_tag: Tag of the built Docker image.
        project_id: Moon project identifier.
        task_id: Moon task identifier.
        project_root: Path to the project root (relative to workspace).
        workspace_root: Path to the Moon workspace root.

    Returns:
        List of paths to extracted files.

    Raises:
        DockerError: If extraction fails.
        MoonError: If unable to get task output files.
    """
    output_files = get_task_output_files(project_id, task_id)

    if not output_files:
        return []

    extracted_paths = []

    # Create a temporary container from the image
    try:
        create_result = subprocess.run(
            ["docker", "create", image_tag],
            capture_output=True,
            text=True,
            check=True,
        )
        container_id = create_result.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise DockerError(f"Failed to create container: {e.stderr}") from e

    try:
        for output_file in output_files:
            # Output files are relative to project root in the container
            container_path = f"/app/{project_root}/{output_file}"
            host_path = workspace_root / project_root / output_file

            # Ensure parent directory exists on host
            host_path.parent.mkdir(parents=True, exist_ok=True)

            try:
                subprocess.run(
                    [
                        "docker",
                        "cp",
                        f"{container_id}:{container_path}",
                        str(host_path),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                extracted_paths.append(host_path)
            except subprocess.CalledProcessError as e:
                # Log warning but continue with other files
                print(f"Warning: Failed to extract {output_file}: {e.stderr}")

    finally:
        # Clean up container
        subprocess.run(
            ["docker", "rm", container_id],
            capture_output=True,
            check=False,
        )

    return extracted_paths


def run_cross_build(
    workspace_root: Path,
    platform: str,
    project_id: str,
    task_id: str,
    project_root: Path,
) -> list[Path]:
    """Run a complete cross-platform build.

    Args:
        workspace_root: Path to the Moon workspace root.
        platform: Target platform (e.g., 'linux/amd64').
        project_id: Moon project identifier.
        task_id: Moon task identifier.
        project_root: Path to the project root (relative to workspace).

    Returns:
        List of paths to extracted output files.

    Raises:
        DockerError: If the build or extraction fails.
    """
    # Generate a unique image tag
    safe_platform = platform.replace("/", "-")
    image_tag = f"cross-{project_id}-{task_id}-{safe_platform}:latest"

    # Build the image
    build_image(workspace_root, platform, project_id, task_id, image_tag)

    # Extract output files
    extracted = extract_output_files(
        image_tag, project_id, task_id, project_root, workspace_root
    )

    return extracted
