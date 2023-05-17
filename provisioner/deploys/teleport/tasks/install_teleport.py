from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd, python
from pyinfra import host
from pyinfra.facts.deb import DebPackage, DebArch
from time import sleep



TELEPORT_VERSION = "v12.3.1"

# Inspired by https://github.com/Fizzadar/pyinfra/blob/2.x/pyinfra/operations/server.py#LL51C12-L51C52
def _wait_for_reconnect(state, host, delay=10, interval=1, reboot_timeout=300):
    sleep(delay)
    max_retries = round(reboot_timeout / interval)

    host.connection = None  # remove the connection object
    retries = 0

    while True:
        host.connect(show_errors=False)
        if host.connection:
            break

        if retries > max_retries:
            raise Exception(
                ("Server did not reboot in time (reboot_timeout={0}s)").format(reboot_timeout),
            )

        sleep(interval)
        retries += 1

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

    if needs_update or teleport_config.changed:
        systemd.service(
            name="Restart and enable the teleport service",
            service="teleport.service",
            running=True,
            restarted=True,
            enabled=True,
            _sudo=True,
            _success_exit_codes=[0, 1] # 1 happens when teleport disconnects the currently running session
        )

        python.call(
            name="Wait for teleport to reconnect",
            function=_wait_for_reconnect,
        )
