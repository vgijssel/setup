import argparse
import importlib.resources
import json
import logging
import os
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

LOGGER = logging.getLogger(__name__)


def get_server_path() -> Path:
    with importlib.resources.path("delegator", "server.pex") as server_path:
        LOGGER.debug(f"Server path: {server_path}")

        if not server_path.is_file():
            print("Server binary not found.")
            exit(1)

        return server_path


def _run(command: list[str]) -> subprocess.CompletedProcess[str]:
    LOGGER.debug("Run command: %s", " ".join(command))

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit(1)

    LOGGER.debug("Command stdout: %s. stderr: %s", result.stdout, result.stderr)

    return result


def _exec(command: list[str]) -> None:
    LOGGER.debug("Exec command: %s", " ".join(command))
    os.execvp(command[0], command)


@dataclass
class Settings:
    name: str
    volumes: list[str]
    timeout: str
    image: str
    server_log_level: str
    server_poll_interval: int
    server_executable: str
    mount_prefix: str = "/opt/delegator"
    server_command: list[str] = field(init=False)

    def __post_init__(self):
        command = [
            "docker",
            "run",
            "--name",
            self.name,
            "--detach",
        ]

        for volume in self.volumes:
            volume_mapping = f"{volume}:{self.mount_prefix}{volume}"
            command = command + ["--volume", volume_mapping]

        command = command + [
            self.image,
            f"{self.mount_prefix}{self.server_executable}",
            "--timeout",
            self.timeout,
            "--poll-interval",
            str(self.server_poll_interval),
            "--log-level",
            self.server_log_level,
        ]

        self.server_command = command


def is_container_running(settings: Settings) -> bool:
    result = _run(
        [
            "docker",
            "ps",
            "-a",
            "--format",
            "{{json .}}",
            "--filter",
            "name={}".format(settings.name),
        ],
    )

    # container does not exist, need to create it
    if len(result.stdout) == 0:
        return False

    # if there are multiple matches then break
    lines = result.stdout.splitlines()

    if len(lines) > 1:
        print(
            "Multiple containers found with the same name which should not be possible."
        )
        exit(1)

    container_state = json.loads(lines[0])

    if container_state["State"] == "running":
        return True

    # If the container is in another state, remove it
    _run(
        ["docker", "rm", "-f", settings.name],
    )

    return False


def create_container(settings: Settings) -> None:
    _run(settings.server_command)


def execute_command(settings: Settings, remote_command: str) -> None:
    # if the output is a tty then we want to add the tty/interactive flags
    if sys.stdout.isatty():
        tty_flags = ["--tty", "--interactive"]
    else:
        tty_flags = []

    command = [
        "docker",
        "exec",
        "--workdir",
        f"{settings.mount_prefix}{os.environ['PWD']}",
        *tty_flags,
        settings.name,
        "/bin/sh",
        "-c",
        remote_command,
    ]

    _exec(command)


def main():
    parser = argparse.ArgumentParser(description="Delegator tool.")
    parser.add_argument(
        "command",
        help="The command to delegate to the container",
    )
    parser.add_argument(
        "--name",
        required=True,
        help="Name of the delegator container.",
    )
    parser.add_argument(
        "--volume",
        required=False,
        help="Map a local directory into the delegator container.",
        action="append",
    )
    parser.add_argument(
        "--timeout",
        required=False,
        help="Set a timeout when the delegator container self destructs.",
    )
    parser.add_argument(
        "--image",
        required=True,
        help="Name of the base image to use for the delegator container.",
    )
    parser.add_argument(
        "--log-level",
        choices=["none", "debug", "info", "warning", "error", "critical"],
        default="none",
        help="Log level for the client.",
    )
    parser.add_argument(
        "--server-log-level",
        choices=["none", "debug", "info", "warning", "error", "critical"],
        default="debug",
        help="Log level for the server.",
    )
    parser.add_argument(
        "--server-poll-interval",
        required=False,
        default=1,
        help="How often the server should poll for new pids.",
        type=int,
    )

    args = parser.parse_args()

    log_level_map = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
        "none": None,
    }

    log_level = log_level_map[args.log_level]

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s.%(msecs)02d [%(levelname)s] %(message)s",
        datefmt="%I:%M:%S",
        handlers=[logging.StreamHandler(sys.stderr)],  # Log to stderr
    )

    volumes = args.volume + [get_server_path().parent]

    settings = Settings(
        name=args.name,
        volumes=volumes,
        timeout=args.timeout,
        image=args.image,
        server_log_level=args.server_log_level,
        server_poll_interval=args.server_poll_interval,
        server_executable=str(get_server_path()),
    )

    is_running = is_container_running(settings)

    if not is_running:
        create_container(settings)

    execute_command(
        settings,
        args.command,
    )


if __name__ == "__main__":
    main()