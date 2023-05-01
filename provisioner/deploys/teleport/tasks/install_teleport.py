from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt
from pyinfra import host
from pyinfra.facts.deb import DebPackage, DebArch


@deploy("Install Teleport")
def install_teleport():
    apt.packages(
        name="Install wget so we can install .deb directly",
        packages=["wget"],
        _sudo=True,
    )

    server.shell(
        name="Allow HTTPS access",
        commands=[
            "ufw allow https",
        ],
        _sudo=True,
    )

    arch = host.get_fact(DebArch)
    teleport = host.get_fact(DebPackage, "teleport")

    TELEPORT_VERSION = "12.2.5"

    if not teleport or teleport["version"] != TELEPORT_VERSION:
        # https://goteleport.com/download/#install-links
        apt.deb(
            name="Install Teleport via deb",
            src=f"https://cdn.teleport.dev/teleport_{TELEPORT_VERSION}_{arch}.deb",
            _sudo=True,
        )
