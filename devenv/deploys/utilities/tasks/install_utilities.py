import os

from pyinfra.api.deploy import deploy
from pyinfra.operations import brew


@deploy("Install Utilities")
def install_utilities():
    utilities = [
        "whatsapp",
        "notion",
        "spotify",
        "todoist",
        "raspberry-pi-imager",
        "orbstack",
        "arc",
        "steam",
        "sunsama",
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
