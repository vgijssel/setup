import os
from pyinfra.api.deploy import deploy
from workstation.helpers.home_link import home_link
from workstation.helpers import onepassword
from onepasswordconnectsdk.client import new_client, new_client
from pyinfra.facts.server import Home
from pyinfra.operations import brew
from pyinfra import host

onepassword_client = new_client(
    os.environ["ONEPASSWORD_CONNECT_HOST"],
    os.environ["ONEPASSWORD_CONNECT_TOKEN"],
)
onepassword_vault_id = os.environ["ONEPASSWORD_CONNECT_VAULT_ID"]

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