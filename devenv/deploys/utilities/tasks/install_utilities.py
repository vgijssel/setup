import os

from pyinfra.api.deploy import deploy
from pyinfra.operations import brew


@deploy("Install Utilities")
def install_utilities():
    utilities = [
        "whatsapp",
        # "slack", # cannot do Slack as this is provisioned by IT
        "notion",
        "spotify",
        "viscosity",
        "todoist",
        "raspberry-pi-imager",
    ]

    # Currently unable to install docker in the CI
    if os.environ.get("CI", "false") == "false":
        utilities = utilities + ["docker"]

    brew.casks(
        name="Install Apps",
        casks=utilities,
        present=True,
        latest=False,
        upgrade=False,
    )

    brew.packages(
        name="Install tools",
        packages=[
            "awscli",
            "dive",  # to check contents of docker layers
            "mkcert",
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )
