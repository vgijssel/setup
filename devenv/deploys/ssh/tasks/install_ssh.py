from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.facts.server import Home
from pyinfra.operations import brew, files

from workstation.helpers import onepassword
from workstation.helpers.home_link import home_link


@deploy("Install SSH")
def install_ssh():
    brew.packages(
        name="Install latest version of git",
        packages=[
            "git",
        ],
        present=True,
        update=False,
        latest=True,
        upgrade=False,
    )

    ssh_config_files = [
        "ssh/config",
        "gitconfig",
        "config/1Password/ssh/agent.toml",
    ]

    for file in ssh_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/ssh/files/{file}",
            target_file=f".{file}",
        )

    home_dir = host.get_fact(Home)
    onepassword.sync(
        name="Sync 1Password user_config",
        local_file=f"{home_dir}/.ssh/user_config",
        remote_file=f"~/.ssh/user_config",
        vault="Workstation",
    )

    files.line(
        name="Ensure macOS is only reachable using SSH from localhost",
        path="/etc/ssh/sshd_config",
        line="AllowUsers *@127.0.0.1",
        present=True,
        _sudo=True,
    )
