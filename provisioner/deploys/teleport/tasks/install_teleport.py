from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from pyinfra.facts.deb import DebPackage, DebArch


TELEPORT_VERSION = "v12.3.3"


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
    current_teleport_version = TELEPORT_VERSION.replace("v", "")

    needs_update = not teleport or teleport["version"] != current_teleport_version

    if needs_update:
        # https://goteleport.com/download/#install-links
        # https://cdn.teleport.dev/teleport_12.3.3_arm64.deb
        apt.deb(
            name="Install Teleport via deb",
            src=f"https://cdn.teleport.dev/teleport_{current_teleport_version}_{arch}.deb",
            _sudo=True,
        )

        systemd.daemon_reload(
            name="Reload systemd daemon in case service file changed",
            _sudo=True,
        )

    files.template(
        name="Create Teleport config",
        src="provisioner/deploys/teleport/files/teleport.yaml.j2",
        dest="/etc/teleport.yaml",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="644",
        teleport_public_addr=host.data.teleport_public_addr,
    )

    systemd.service(
        name="Restart and enable the teleport service",
        service="teleport.service",
        running=True,
        restarted=True,
        enabled=True,
        _sudo=True,
    )
