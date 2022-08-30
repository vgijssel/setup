from pyinfra.api.deploy import deploy
from pyinfra.operations import brew
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
            "buildifier", # Necessary for Bazel autoformatting
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
