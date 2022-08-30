from pyinfra.api.deploy import deploy
from workstation.helpers.home_link import home_link
from workstation.helpers import onepassword
from pyinfra.facts.server import Home
from pyinfra.operations import brew
from pyinfra import host

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