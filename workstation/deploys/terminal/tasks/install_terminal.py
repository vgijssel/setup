import os
from pyinfra.operations import brew
from pyinfra.api.deploy import deploy
from workstation.helpers.home_link import home_link


@deploy("Install Terminal")
def install_terminal():
    # TODO: force?
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
        "shell_snippets/asdf.sh",
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
