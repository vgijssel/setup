from pyinfra.operations import brew
from pyinfra.api.deploy import deploy


@deploy("Install Utilities")
def install_utilities():
    brew.casks(
        name="Install Apps",
        casks=[
            "whatsapp",
            # "slack",
            "notion",
            "spotify",
            "viscosity",
            "docker",
            "Alfred",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )