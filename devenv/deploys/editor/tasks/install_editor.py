from helpers import macos
from helpers.home_link import home_link
from pyinfra.api.deploy import deploy
from pyinfra.operations import brew, server


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

    home_link(
        source_file="deploys/editor/files/settings.json",
        target_file="Library/Application Support/Code/User/settings.json",
    )

    home_link(
        source_file="deploys/editor/files/keybindings.json",
        target_file="Library/Application Support/Code/User/keybindings.json",
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
