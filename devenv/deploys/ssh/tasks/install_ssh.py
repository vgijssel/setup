from helpers.home_link import home_link
from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.operations import brew, files


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

    files.link(
        name=f"Ensure macOS is only reachable using SSH from localhost",
        path="/etc/ssh/sshd_config.d/200-devenv.conf",
        target="deploys/ssh/files/etc/ssh/sshd_config.d/200-devenv.conf",
        present=True,
        symbolic=True,
        force=True,
        create_remote_dir=True,
        # _sudo=True,
    )
