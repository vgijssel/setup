from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from pyinfra.facts.deb import DebPackage, DebArch
from provisioner.utils import wait_for_reconnect


@deploy("Install Teleport")
def install_teleport():
    server.shell(
        name="Allow HTTPS access",
        commands=[
            "ufw allow https",
        ],
        _sudo=True,
    )

    files.directory(
        name="Ensure teleport directory exists",
        path="/opt/teleport",
        user="root",
        group="root",
        mode="700",
        _sudo=True,
    )

    docker_compose = files.put(
        name="Copy the docker-compose file",
        src="provisioner/deploys/teleport/files/docker-compose.yaml",
        dest="/opt/teleport/docker-compose.yaml",
        mode="600",
        _sudo=True,
        user="root",
        group="root",
    )

    teleport_config = files.template(
        name="Create Teleport config",
        src="provisioner/deploys/teleport/files/teleport.yaml.j2",
        dest="/opt/teleport/teleport.yaml",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="644",
        teleport_public_addr=host.data.teleport_public_addr,
        teleport_acme_enabled=host.data.teleport_acme_enabled,
        teleport_acme_email=host.data.teleport_acme_email,
    )

    if docker_compose.changed or teleport_config.changed:
        server.shell(
            name="Start the teleport service",
            commands=[
                "docker compose -f /opt/teleport/docker-compose.yaml up -d --force-recreate",
            ],
            _sudo=True,
            _ignore_errors=True,  # restarting the service will disconnect us and result in error
        )

        wait_for_reconnect(
            name="Wait for teleport to reconnect",
        )

    health_check_config = files.put(
        name="Copy telegraf config",
        src="provisioner/deploys/teleport/files/teleport_health_check.conf",
        dest="/etc/telegraf/telegraf.d/teleport_health_check.conf",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    if health_check_config.changed:
        systemd.service(
            name="Restart the telegraf service",
            service="telegraf.service",
            restarted=True,
            _sudo=True,
        )
