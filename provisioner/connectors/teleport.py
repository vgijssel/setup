"""
The ``@teleport`` connector allows you to use teleport to connect to remotes.

.. code:: shell

    # Pyinfra will connect to the provisioner remote via teleport
    pyinfra @teleport/provisioner ...

"""

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
        login = "Remote host login"
        host = "Remote host address"

        tsh_binary = "Teleport tsh binary path"

        proxy = "Teleport proxy address"
        user = "Teleport user, defaults to current local user"
        identity = "Teleport identity file path"


DATA_KEYS = Meta.keys()


class TeleportClient:
    def __init__(self, state, host):
        self.state = state
        self.host = host

        self.teleport_login = host.data.get(DATA_KEYS.login)
        self.teleport_host = host.data.get(DATA_KEYS.host)

        self.tsh_binary = host.data.get(DATA_KEYS.tsh_binary, "tsh")

        self.teleport_proxy = host.data.get(DATA_KEYS.proxy)
        self.teleport_user = host.data.get(DATA_KEYS.user)
        self.teleport_identity = host.data.get(DATA_KEYS.identity)

    def ssh(self, command):
        args = [
            *self._get_connection_args(),
            "ssh",
            self.teleport_host,
            command,
        ]
        return StringCommand(*args)

    def _get_connection_args(self):
        args = [self.tsh_binary]

        if self.teleport_proxy:
            args.append("--proxy")
            args.append(self.teleport_proxy)

        if self.teleport_user:
            args.append("--user")
            args.append(self.teleport_user)

        if self.teleport_identity:
            args.append("--identity")
            args.append(self.teleport_identity)

        if self.teleport_login:
            args.append("--login")
            args.append(self.teleport_login)

        return args


def make_names_data(host):
    yield (
        "@teleport/{0}".format(host),
        {DATA_KEYS.host: host},
        ["@teleport"],
    )


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


def _put_file(host, state, filename_or_io, temp_file):
    teleport_client = host.connector_data["teleport_client"]

    with get_file_io(filename_or_io) as file_io:
        stdin = file_io.read()

        if isinstance(stdin, bytes):
            stdin = stdin.decode("utf-8")

        teleport_command = teleport_client.ssh(
            command=f"'cat > {temp_file}'"
        ).get_raw_value()

        run_local_shell_command(
            state,
            host,
            teleport_command,
            timeout=10,
            stdin=stdin,
            success_exit_codes=[0],
            print_output=False,
            print_input=False,
            return_combined_output=False,
        )


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

    # sudo/su are a little more complicated, as you can only sftp with the SSH
    # user connected, so upload to tmp and copy/chown w/sudo and/or su_user
    if sudo or doas or su_user:
        # Get temp file location
        temp_file = remote_temp_filename or state.get_temp_filename(remote_filename)
        _put_file(host, state, filename_or_io, temp_file)

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
    remote_filename: str,
    filename_or_io,
    remote_temp_filename=None,
    sudo: bool = False,
    sudo_user=None,
    su_user=None,
    print_output: bool = False,
    print_input: bool = False,
    **command_kwargs,
):
    raise NotImplementedError
