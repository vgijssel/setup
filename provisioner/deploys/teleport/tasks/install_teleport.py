from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from pyinfra.facts.deb import DebPackage, DebArch
from provisioner.utils import wait_for_reconnect


TELEPORT_VERSION = "v14.0.1"


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
    current_teleport_version = teleport["version"] if teleport else None
    wanted_teleport_version = TELEPORT_VERSION.replace("v", "")
    needs_update = current_teleport_version != wanted_teleport_version

    if needs_update:
        # https://goteleport.com/download/#install-links
        # https://cdn.teleport.dev/teleport_12.3.3_arm64.deb
        apt.deb(
            name=f"Install Teleport version {wanted_teleport_version} via deb (previously {current_teleport_version})",
            src=f"https://cdn.teleport.dev/teleport_{wanted_teleport_version}_{arch}.deb",
            _sudo=True,
        )

        systemd.daemon_reload(
            name="Reload systemd daemon in case service file changed",
            _sudo=True,
        )

    teleport_config = files.template(
        name="Create Teleport config",
        src="provisioner/deploys/teleport/files/teleport.yaml.j2",
        dest="/etc/teleport.yaml",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="644",
        teleport_public_addr=host.data.teleport_public_addr,
        teleport_acme_enabled=host.data.teleport_acme_enabled,
        teleport_acme_email=host.data.teleport_acme_email,
    )

    systemd.service(
        name="Enable the teleport service",
        service="teleport.service",
        running=True,
        enabled=True,
        _sudo=True,
    )

    if needs_update or teleport_config.changed:
        systemd.service(
            name="Restart the teleport service",
            service="teleport.service",
            restarted=True,
            _sudo=True,
            _ignore_errors=True,  # restarting the service will disconnect us and result in error
        )

        wait_for_reconnect(
            name="Wait for teleport to reconnect",
        )
