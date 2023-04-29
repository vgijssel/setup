from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt
from pyinfra import host


@deploy("Install Teleport")
def install_teleport():
    pass
    # apt.packages(
    #     name="Install teleport",
    #     packages=["teleport"],
    #     latest=True,
    #     _sudo=True,
    # )
