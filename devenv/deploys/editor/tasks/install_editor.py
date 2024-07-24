from pyinfra.api.deploy import deploy
from pyinfra.operations import brew, server

from workstation.helpers import macos
from workstation.helpers.home_link import home_link


@deploy("Install Editor")
def install_editor():
    brew.casks(
        name="Install VSCode",
        casks=[
            "visual-studio-code",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )

    brew.packages(
        name="Install dependencies",
        packages=[
            "buildifier",  # Necessary for Bazel autoformatting
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    editor_config_files = [
        "settings.json",
        "keybindings.json",
    ]

    for file in editor_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/editor/files/{file}",
            target_file=f"Library/Application Support/Code/User/{file}",
        )

    for vscode_app_name in [
        "com.microsoft.VSCode",
        "com.microsoft.VSCodeInsiders",
        "com.visualstudio.code.oss",
    ]:
        macos.default(
            name=f"Disable 'Press and hold' for {vscode_app_name}",
            domain=vscode_app_name,
            setting="ApplePressAndHoldEnabled",
            value=False,
        )

    server.shell(
        name="Stop VSCode",
        commands=["osascript -e 'quit app \"Visual Studio Code\"'"],
    )
