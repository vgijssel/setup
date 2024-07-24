import os

from pyinfra.api.deploy import deploy
from pyinfra.operations import brew


@deploy("Install Utilities")
def install_utilities():
    brew.casks(
        name="Install Apps",
        casks=[
            "whatsapp",
            "notion",
            "spotify",
            "todoist",
            "raspberry-pi-imager",
            "orbstack",
            "arc",
            "steam",
            "sunsama",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )
