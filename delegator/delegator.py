import argparse
import json
import os
import subprocess
import sys

# TODO: add logging
# TODO: write pid to the settings file
# TODO: implement server polling to check pids still active

# delegator \
#     --name nixos-rebuild \
#     --volume $HOME \
#     --volume $(realpath TMPDIR) \
#     --timout 10m \
#     --image image-builder:dev \
#     nixos-rebuild $@


class Settings:
    def __init__(self, name: str, volumes: list[str], timeout: str, image: str) -> None:
        self.name = name
        self.volumes = volumes
        self.timeout = timeout
        self.image = image
        self.mount_prefix = "/opt/delegator"


def is_container_running(settings: Settings) -> bool:
    result = subprocess.run(
        [
            "docker",
            "ps",
            "-a",
            "--format",
            "{{json .}}",
            "--filter",
            "name={}".format(settings.name),
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        exit(1)

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
    subprocess.run(
        ["docker", "rm", "-f", settings.name],
        capture_output=True,
        text=True,
    )

    return False


def create_container(settings: Settings) -> None:
    command = [
        "docker",
        "run",
        "--name",
        settings.name,
        "--detach",
    ]

    for volume in settings.volumes:
        volume_mapping = f"{volume}:{settings.mount_prefix}{volume}"
        command = command + ["--volume", volume_mapping]

    command = command + [settings.image, "sleep", "infinity"]

    subprocess.run(
        command,
        capture_output=True,
        text=True,
    )


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

    os.execvp("docker", command)


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

    args = parser.parse_args()
    settings = Settings(
        name=args.name,
        volumes=args.volume,
        timeout=args.timeout,
        image=args.image,
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
