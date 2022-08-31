from pyinfra.operations import brew
from pyinfra.api.deploy import deploy


@deploy("Install Utilities")
def install_utilities():
    brew.casks(
        name="Install Apps",
        casks=[
            "whatsapp",
            # "slack", # cannot do Slack as this is provisioned by IT
            "notion",
            "spotify",
            "viscosity",
            "docker",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )