from helpers.symlink import home_link, symlink
from pyinfra.api.deploy import deploy
from pyinfra.operations import brew


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
        ".ssh/config",
        ".gitconfig",
        ".config/1Password/ssh/agent.toml",
    ]

    for file in ssh_config_files:
        home_link(
            source_file=f"deploys/ssh/files/{file}",
            target_file=file,
        )

    symlink(
        source_file="deploys/ssh/files/etc/ssh/sshd_config.d/200-devenv.conf",
        target_file="/etc/ssh/sshd_config.d/200-devenv.conf",
        _sudo=True,
    )
