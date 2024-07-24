import os

from helpers.symlink import home_link
from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.facts.server import Command, User
from pyinfra.operations import brew, files, server


@deploy("Install Terminal")
def install_terminal():
    brew.casks(
        name="Install Apps",
        casks=[
            "warp",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )

    brew.packages(
        name="Install dependencies",
        packages=[
            "zsh",
            "bash",
            "zoxide",
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    terminal_files = [
        ".bash_profile",
        ".bashrc",
        ".zshrc",
        ".zprofile",
        ".profile",
        ".terminal_env",
    ]

    for terminal_file in terminal_files:
        home_link(
            source_file=f"deploys/terminal/files/{terminal_file}",
            target_file=terminal_file,
        )

    homebrew_zsh_path = os.path.join(
        host.get_fact(Command, "brew --prefix"), "bin", "zsh"
    )
    current_user = host.get_fact(User)

    files.line(
        name=f"Add ZSH from Homebrew to acceptable shells {homebrew_zsh_path}",
        path="/etc/shells",
        line=homebrew_zsh_path,
        _sudo=True,
    )

    server.shell(
        name=f"Set default shell to ZSH for {current_user}",
        commands=f"chsh -s {homebrew_zsh_path} {current_user}",
        _sudo=True,
    )

    files.directory(
        name="Set proper permissions for ZSH share directory",
        path="/usr/local/share/zsh",
        present=True,
        mode="0755",
        _sudo=True,
        user=current_user,
        group="admin",
        recursive=True,
    )
