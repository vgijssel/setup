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


class TeleportClient:
    def __init__(self, state, host):
        self.state = state
        self.host = host

        self.tsh_binary = "tsh"
        self.teleport_hostname = host.data.get(DATA_KEYS.hostname)
        self.teleport_user = host.data.get(DATA_KEYS.user)

    def ssh(self, command):
        args = [
            self.tsh_binary,
            "ssh",
            self._get_remote(),
            command,
        ]

        return StringCommand(*args)

    def scp_upload(self, file):
        pass

    def scp_download(self, file):
        pass

    def _get_remote(self):
        if self.teleport_user:
            return self.teleport_user + "@" + self.teleport_hostname

        return self.teleport_hostname


def make_names_data(hostname):
    yield (
        "@teleport/{0}".format(hostname),
        {DATA_KEYS.hostname: hostname},
        ["@teleport"],
    )


# TODO: remove this
import os

del os.environ["RUNFILES_MANIFEST_FILE"]


def connect(state: "State", host: "Host"):
    teleport_client = TeleportClient(state, host)

    try:
        with progress_spinner({"connecting to teleport"}):
            local.shell(
                teleport_client.ssh(command="ls").get_raw_value(), splitlines=True
            )
    except PyinfraError as e:
        raise ConnectError(e.args[0])

    host.connector_data["teleport_client"] = TeleportClient(state, host)
    return True


def disconnect(state, host):
    return


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
    teleport_client = host.connector_data["teleport_client"]
    command = make_unix_command_for_host(state, host, command, **command_kwargs)
    command = QuoteString(command)
    teleport_command = teleport_client.ssh(command=command)

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


def _put_file(host, filename_or_io, temp_file):
    local.shell(teleport_client.scp_upload(filename_or_io, temp_file))


# Inspired by https://github.com/Fizzadar/pyinfra/blob/6eca1a52d955a0497cd33c02cb9a94176f93583d/pyinfra/connectors/ssh.py#L493
def put_file(
    state: "State",
    host: "Host",
    filename_or_io,
    remote_filename,
    remote_temp_filename=None,
    sudo: bool = False,
    sudo_user=None,
    doas: bool = False,
    doas_user=None,
    su_user=None,
    print_output: bool = False,
    print_input: bool = False,
    **command_kwargs,
):
    """
    Upload file-ios to the specified host using SCP. Supports uploading files
    with sudo by uploading to a temporary directory then moving & chowning.
    """
    teleport_client = host.connector_data["teleport_client"]

    # sudo/su are a little more complicated, as you can only sftp with the SSH
    # user connected, so upload to tmp and copy/chown w/sudo and/or su_user
    if sudo or doas or su_user:
        # Get temp file location
        temp_file = remote_temp_filename or state.get_temp_filename(remote_filename)
        _put_file(host, filename_or_io, temp_file)

        # Make sure our sudo/su user can access the file
        if su_user:
            command = StringCommand(
                "setfacl", "-m", "u:{0}:r".format(su_user), temp_file
            )
        elif sudo_user:
            command = StringCommand(
                "setfacl", "-m", "u:{0}:r".format(sudo_user), temp_file
            )
        elif doas_user:
            command = StringCommand(
                "setfacl", "-m", "u:{0}:r".format(doas_user), temp_file
            )

        if su_user or sudo_user or doas_user:
            status, _, stderr = run_shell_command(
                state,
                host,
                command,
                sudo=False,
                print_output=print_output,
                print_input=print_input,
                **command_kwargs,
            )

            if status is False:
                logger.error(
                    "Error on handover to sudo/su user: {0}".format("\n".join(stderr))
                )
                return False

        # Execute run_shell_command w/sudo and/or su_user
        command = StringCommand("cp", temp_file, QuoteString(remote_filename))

        status, _, stderr = run_shell_command(
            state,
            host,
            command,
            sudo=sudo,
            sudo_user=sudo_user,
            doas=doas,
            doas_user=doas_user,
            su_user=su_user,
            print_output=print_output,
            print_input=print_input,
            **command_kwargs,
        )

        if status is False:
            logger.error("File upload error: {0}".format("\n".join(stderr)))
            return False

        # Delete the temporary file now that we've successfully copied it
        command = StringCommand("rm", "-f", temp_file)

        status, _, stderr = run_shell_command(
            state,
            host,
            command,
            sudo=False,
            doas=False,
            print_output=print_output,
            print_input=print_input,
            **command_kwargs,
        )

        if status is False:
            logger.error(
                "Unable to remove temporary file: {0}".format("\n".join(stderr))
            )
            return False

    # No sudo and no su_user, so just upload it!
    else:
        _put_file(host, filename_or_io, remote_filename)

    if print_output:
        click.echo(
            "{0}file uploaded: {1}".format(host.print_prefix, remote_filename),
            err=True,
        )

    return True


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
