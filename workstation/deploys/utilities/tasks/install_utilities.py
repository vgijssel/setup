from pyinfra.operations import brew
from pyinfra.api.deploy import deploy
import os


@deploy("Install Utilities")
def install_utilities():
    utilities = [
        "whatsapp",
        # "slack", # cannot do Slack as this is provisioned by IT
        "notion",
        "spotify",
        "viscosity",
        "todoist",
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
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )
