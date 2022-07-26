import os
from pyinfra.api.deploy import deploy
from pyinfra.operations import brew
from workstation.helpers.home_link import home_link
from onepasswordconnectsdk.client import new_client, new_client

onepassword_client = new_client(
    os.environ["ONEPASSWORD_CONNECT_HOST"],
    os.environ["ONEPASSWORD_CONNECT_TOKEN"],
)
onepassword_vault_id = os.environ["ONEPASSWORD_CONNECT_VAULT_ID"]


# install ssh
# - copy user_config from 1password
# - copy ssh keys from 1password
# - gpg
# - download secrets from 1password


@deploy("Install SSH")
def install_ssh():
    brew.packages(
        name="Install dependencies",
        packages=["gpg2", "pinentry-mac"],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    ssh_config_files = [
        "ssh/config",
        "gnupg/dirmngr.conf",
        "gnupg/gpg-agent.conf",
        "gnupg/gpg.conf",
    ]

    for file in ssh_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/ssh/files/{file}",
            target_file=f".{file}",
        )

    ssh_secret_config_files = [".ssh/user_config"]

    for file in ssh_secret_config_files:
        onepassword_client.get_item_by_title(file, onepassword_vault_id)
        import pdb

        pdb.set_trace()
