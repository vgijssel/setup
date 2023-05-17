"""
The ``@teleport`` connector allows you to build teleport images, or modify running
teleport containers, using ``pyinfra``. You can pass either an image name or
existing container ID:

+ Image - will create a container from the image, execute operations and save
    into a new image
+ Existing container ID - will simply execute operations against the container,
    leaving it up afterwards


.. code:: shell

    # A teleport base image must be provided
    pyinfra @teleport/alpine:3.8 ...

    # pyinfra can run on multiple teleport images in parallel
    pyinfra @teleport/alpine:3.8,@teleport/ubuntu:bionic ...

    # Execute against a running container
    pyinfra @teleport/2beb8c15a1b1 ...
"""

import json
import os
from tempfile import mkstemp
from typing import TYPE_CHECKING

import click

from pyinfra import local, logger
from pyinfra.api import QuoteString, StringCommand
from pyinfra.api.connectors import BaseConnectorMeta
from pyinfra.api.exceptions import ConnectError, InventoryError, PyinfraError
from pyinfra.api.util import get_file_io
from pyinfra.progress import progress_spinner

from pyinfra.connectors.local import run_shell_command as run_local_shell_command
from pyinfra.connectors.util import make_unix_command_for_host

if TYPE_CHECKING:
    from pyinfra.api.host import Host
    from pyinfra.api.state import State


class Meta(BaseConnectorMeta):
    handles_execution: bool = True
    keys_prefix: str = "teleport"

    class DataKeys:
        hostname = "SSH hostname"
        user = "SSH user"


DATA_KEYS = Meta.keys()


def make_names_data(hostname):
    yield (
        "@teleport/{0}".format(hostname),
        {DATA_KEYS.hostname: hostname},
        ["@teleport"],
    )

tsh_binary = "tsh"

import os
del os.environ["RUNFILES_MANIFEST_FILE"]

def connect(state: "State", host: "Host"):
    teleport_hostname = host.data.get(DATA_KEYS.hostname)
    teleport_username = host.data.get(DATA_KEYS.user)

    teleport_args = [tsh_binary, "ssh"]

    if teleport_username:
        teleport_args.append(teleport_username + "@" + teleport_hostname)
    else:
        teleport_args.append(teleport_hostname)

    try:
        with progress_spinner({"connecting to teleport"}):
            local.shell(
                " ".join(teleport_args + ["ls"]),
                splitlines=True,
            )
    except PyinfraError as e:
        raise ConnectError(e.args[0])

    host.connector_data["teleport_args"] = teleport_args

    return True


def disconnect(state, host):
    return
    # container_id = host.connector_data["teleport_container_id"]

    # if host.connector_data.get("teleport_container_no_disconnect"):
    #     logger.info(
    #         "{0}teleport build complete, container left running: {1}".format(
    #             host.print_prefix,
    #             click.style(container_id, bold=True),
    #         ),
    #     )
    #     return

    # with progress_spinner({"teleport commit"}):
    #     image_id = local.shell(
    #         "teleport commit {0}".format(container_id), splitlines=True
    #     )[-1][
    #         7:19
    #     ]  # last line is the image ID, get sha256:[XXXXXXXXXX]...

    # with progress_spinner({"teleport rm"}):
    #     local.shell(
    #         "teleport rm -f {0}".format(container_id),
    #     )

    # logger.info(
    #     "{0}teleport build complete, image ID: {1}".format(
    #         host.print_prefix,
    #         click.style(image_id, bold=True),
    #     ),
    # )


def run_shell_command(
    state: "State",
    host: "Host",
    command,
    get_pty=False,
    timeout=None,
    stdin=None,
    success_exit_codes=None,
    print_output=False,
    print_input=False,
    return_combined_output=False,
    **command_kwargs,
):
    teleport_args = host.connector_data["teleport_args"]

    command = make_unix_command_for_host(state, host, command, **command_kwargs)
    command = QuoteString(command)
    command_args = teleport_args + [command]
    teleport_command = StringCommand(*command_args)

    return run_local_shell_command(
        state,
        host,
        teleport_command,
        timeout=timeout,
        stdin=stdin,
        success_exit_codes=success_exit_codes,
        print_output=print_output,
        print_input=print_input,
        return_combined_output=return_combined_output,
    )


def put_file(
    state: "State",
    host: "Host",
    filename_or_io,
    remote_filename,
    remote_temp_filename=None,  # ignored
    print_output=False,
    print_input=False,
    **kwargs,  # ignored (sudo/etc)
):
    """
    Upload a file/IO object to the target teleport container by copying it to a
    temporary location and then uploading it into the container using ``teleport cp``.
    """

    fd, temp_filename = mkstemp()

    try:
        # Load our file or IO object and write it to the temporary file
        with get_file_io(filename_or_io) as file_io:
            with open(temp_filename, "wb") as temp_f:
                data = file_io.read()

                if isinstance(data, str):
                    data = data.encode()

                temp_f.write(data)

        teleport_id = host.connector_data["teleport_container_id"]
        teleport_command = "teleport cp {0} {1}:{2}".format(
            temp_filename,
            teleport_id,
            remote_filename,
        )

        status, _, stderr = run_local_shell_command(
            state,
            host,
            teleport_command,
            print_output=print_output,
            print_input=print_input,
        )
    finally:
        os.close(fd)
        os.remove(temp_filename)

    if not status:
        raise IOError("\n".join(stderr))

    if print_output:
        click.echo(
            "{0}file uploaded to container: {1}".format(
                host.print_prefix,
                remote_filename,
            ),
            err=True,
        )

    return status


def get_file(
    state: "State",
    host: "Host",
    remote_filename,
    filename_or_io,
    remote_temp_filename=None,  # ignored
    print_output=False,
    print_input=False,
    **kwargs,  # ignored (sudo/etc)
):
    """
    Download a file from the target teleport container by copying it to a temporary
    location and then reading that into our final file/IO object.
    """

    fd, temp_filename = mkstemp()

    try:
        teleport_id = host.connector_data["teleport_container_id"]
        teleport_command = "teleport cp {0}:{1} {2}".format(
            teleport_id,
            remote_filename,
            temp_filename,
        )

        status, _, stderr = run_local_shell_command(
            state,
            host,
            teleport_command,
            print_output=print_output,
            print_input=print_input,
        )

        # Load the temporary file and write it to our file or IO object
        with open(temp_filename, encoding="utf-8") as temp_f:
            with get_file_io(filename_or_io, "wb") as file_io:
                data = temp_f.read()
                data_bytes: bytes

                if isinstance(data, str):
                    data_bytes = data.encode()
                else:
                    data_bytes = data

                file_io.write(data_bytes)
    finally:
        os.close(fd)
        os.remove(temp_filename)

    if not status:
        raise IOError("\n".join(stderr))

    if print_output:
        click.echo(
            "{0}file downloaded from container: {1}".format(
                host.print_prefix,
                remote_filename,
            ),
            err=True,
        )

    return status
