from pyinfra.api.deploy import deploy
from pyinfra.operations import brew, server


@deploy("Install Utilities")
def install_utilities():
    utilities = [
        "whatsapp",
        "spotify",
        "todoist",
        "raspberry-pi-imager",
        "balenaetcher",
        "orbstack",
        "arc",
        "steam",
        "1password",
        "discord",
        "slack",
        "obsidian",
        "gimp",
        "utm",
        "cirruslabs/cli/tart",
    ]

    for utility in utilities:
        brew.casks(
            name=f"Install {utility}",
            casks=[
                utility,
            ],
            present=True,
            latest=False,
            upgrade=False,
            # Ignore errors because some apps might be installed by IT
            _ignore_errors=True,
        )

    brew.packages(
        name="Install defaultbrowser",
        packages=[
            "defaultbrowser",
            # client for interacting with incus host
            "incus",
            "hermit",
            "whalebrew",
            "lima",
        ],
        present=True,
        update=False,
        upgrade=False,
    )

    server.shell(
        name="Set default browser to Arc",
        commands="defaultbrowser browser",
    )
