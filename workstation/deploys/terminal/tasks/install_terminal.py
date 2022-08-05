import os
from turtle import home
from pyinfra.operations import brew, server, files
from pyinfra.facts.server import User, Home
from pyinfra.api.deploy import deploy
from pyinfra import host
from workstation.helpers.home_link import home_link


@deploy("Install Terminal")
def install_terminal():
    brew.casks(
        name="Install iTerm2",
        casks=[
            "iterm2",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )

    brew.packages(
        name="Install dependencies",
        packages=[
            "coreutils",
            "diffutils",
            "findutils",
            "gawk",
            "rename",
            "gnu-indent",
            "gnu-sed",
            "gnu-tar",
            "gnu-which",
            "gnutls",
            "grep",
            "gzip",
            "screen",
            "watch",
            "wdiff",
            "wget",
            "fzf",
            "fd",
            "zsh",
            "bash",
            "jq",
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    terminal_config_files = [
        "profile",
        "bashrc",
        "bash_profile",
        "zshrc",
        "zshenv",
        "iterm2/Snazzy.json",
        "shell_snippets/benchmark.sh",
        "shell_snippets/direnv.sh",
        "shell_snippets/fzf.zsh",
        "shell_snippets/gpg.sh",
        "shell_snippets/direnv.sh",
    ]

    for file in terminal_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/terminal/files/{file}",
            target_file=f".{file}",
        )

    # TODO: use homebrew --prefx to generate this
    homebrew_zsh_path = "/opt/homebrew/bin/zsh"
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

    home_dir = host.get_fact(Home)

    # server.shell(
    #    name=f"Install ZPlugin",
    #    commands=f"source {home_dir}/.zshrc",
    #    _shell_executable=homebrew_zsh_path,
    # )
