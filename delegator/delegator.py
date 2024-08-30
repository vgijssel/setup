import argparse
import importlib.resources
import json
import logging
import os
import shlex
import subprocess
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path

from deepdiff import DeepDiff

from .utils import setup_logging, validate_timeout

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
    exclude_env: list[str]
    server_log_level: str
    server_poll_interval: int
    server_executable: str
    mount_prefix: str = "/opt/delegator"
    server_command: list[str] = field(init=False)
    docker_command: list[str] = field(init=False)
    settings_label: str = "com.delegator"

    def __post_init__(self):
        docker_command = [
            "docker",
            "run",
            "--rm",
            "--name",
            self.name,
            "--detach",
        ]

        for volume in self.volumes:
            volume_mapping = f"{volume}:{self.mount_prefix}{volume}"
            docker_command = docker_command + ["--volume", volume_mapping]

        self.docker_command = docker_command

        self.server_command = [
            f"{self.mount_prefix}{self.server_executable}",
            "--timeout",
            self.timeout,
            "--poll-interval",
            str(self.server_poll_interval),
            "--log-level",
            self.server_log_level,
        ]


def is_container_running(settings: Settings) -> bool:
    format = (
        '{"name": "{{.Names}}", "state": "{{.State}}", "settings": {{.Label "%s"}}}'
        % settings.settings_label
    )

    result = _run(
        [
            "docker",
            "ps",
            "-a",
            "--format",
            format,
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

    if container_state["state"] != "running":
        LOGGER.info("Container is not running. Removing.")
        remove_container(settings)
        return False

    # Cannot compare Settings class to Settings class, because maybe the settings have changed.
    # Therefore comparing the dicts to see if there is any difference
    container_settings_data = json.loads(container_state["settings"])
    LOGGER.debug("Current settings:\n%s", container_settings_data)

    settings_data = asdict(settings)
    LOGGER.debug("New settings:\n%s", settings_data)

    diff = DeepDiff(container_settings_data, settings_data)

    if len(diff) > 0:
        LOGGER.info("Container settings have changed. Removing.")
        LOGGER.debug("Diff\n" + diff.pretty())
        remove_container(settings)
        return False

    return True


def create_container(settings: Settings) -> None:
    server_command = settings.server_command
    docker_command = settings.docker_command
    docker_image = settings.image
    settings_json = json.dumps(json.dumps(asdict(settings)))

    command = (
        docker_command
        + ["--label", f"{settings.settings_label}={settings_json}"]
        + [docker_image]
        + server_command
    )
    _run(command)


def remove_container(settings: Settings) -> None:
    _run(
        ["docker", "rm", "-f", settings.name],
    )


def execute_command(settings: Settings, remote_command: list[str]) -> None:
    # if the output is a tty then we want to add the tty/interactive flags
    if sys.stdout.isatty():
        tty_flags = ["--tty", "--interactive"]
    else:
        tty_flags = []

    command = [
        "docker",
        "exec",
        settings.name,
        "bash",
        "-l",
        "-c",
        "compgen -e",
    ]

    result = _run(command)
    container_variables = set(result.stdout.splitlines())
    host_variables = set(os.environ.keys())
    missing_variables = host_variables - container_variables
    env_args = []

    for host_var in missing_variables:
        if host_var in settings.exclude_env:
            continue

        env_args += ["--env", host_var]

    remote_command_string = shlex.join(remote_command)

    command = [
        "docker",
        "exec",
        *env_args,
        "--workdir",
        f"{settings.mount_prefix}{os.environ['PWD']}",
        *tty_flags,
        settings.name,
        "/bin/sh",
        "-c",
        remote_command_string,
    ]

    _exec(command)


def main():
    parser = argparse.ArgumentParser(description="Delegator tool.")
    parser.add_argument(
        "--name",
        required=True,
        help="Name of the delegator container.",
    )
    parser.add_argument(
        "--volume",
        required=False,
        help="Map a local directory into the delegator container.",
        default=[],
        action="append",
    )
    parser.add_argument(
        "--exclude-env",
        required=False,
        help="Exclude host environment variables from being forwarded to the container.",
        action="append",
        default=["TMPDIR", "SHELL", "_", "LANG", "OLDPWD", "LC_ALL", "LC_CTYPE"],
    )
    parser.add_argument(
        "--timeout",
        required=False,
        help="Set a timeout when the delegator container self destructs.",
        default="10m",
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
    parser.add_argument(
        "command",
        nargs=argparse.REMAINDER,
        help="The command to delegate to the container",
    )

    args = parser.parse_args()

    setup_logging(args.log_level)

    LOGGER.debug("Arguments: %s", args)

    validate_timeout(args.timeout)

    server_path = get_server_path()

    volumes = args.volume + [str(server_path.parent)]

    settings = Settings(
        name=args.name,
        volumes=volumes,
        timeout=args.timeout,
        image=args.image,
        exclude_env=args.exclude_env,
        server_log_level=args.server_log_level,
        server_poll_interval=args.server_poll_interval,
        server_executable=str(server_path),
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
