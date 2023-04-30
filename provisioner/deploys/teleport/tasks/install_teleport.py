from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt
from pyinfra import host


@deploy("Install Teleport")
def install_teleport():
    apt.packages(
        name="Install wget so we can install .deb directly",
        packages=["wget"],
        _sudo=True,
    )

    # TODO: branch on architecture
    # TODO: open port 443 for teleport in ufw
    # https://goteleport.com/download/#install-links
    TELEPORT_VERSION = "12.2.5"

    apt.deb(
        name="Install Teleport via deb",
        src=f"https://cdn.teleport.dev/teleport_{TELEPORT_VERSION}_arm64.deb",
        _sudo=True,
    )
