from pyinfra.api.deploy import deploy
from pyinfra.operations import brew
from workstation.helpers.home_link import home_link

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
