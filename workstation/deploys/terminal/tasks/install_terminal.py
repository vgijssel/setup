from pyinfra.operations import brew, server, files
from pyinfra.facts.server import User
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
            "atuin",
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

    brew.tap(name="Tap brew installable fonts", src="homebrew/cask-fonts", present=True)

    brew.packages(
        name="Install svn necessary for some fonts",
        packages=[
            "svn",
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    brew.casks(
        name="Install fonts for terminal",
        casks=[
            "font-menlo-for-powerline",
            "font-droid-sans-mono-for-powerline",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )

    terminal_config_files = [
        "profile",
        "bashrc",
        "bash_profile",
        "zshrc",
        "shell_snippets/benchmark.sh",
        "config/atuin/config.toml",
    ]

    for file in terminal_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/terminal/files/{file}",
            target_file=f".{file}",
        )

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

    server.shell(
        name=f"Install Fig dotfiles",
        commands=f"fig source",
        _shell_executable=homebrew_zsh_path,
    )