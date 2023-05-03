from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt
from pyinfra import host


@deploy("Install Network")
def install_network():
    apt.packages(
        name="Install netplan",
        packages=["netplan.io"],
        latest=True,
        _sudo=True,
    )

    config_file = files.put(
        name="Copy netplan config",
        src="provisioner/deploys/network/files/99_config.yaml",
        dest="/etc/netplan/99_config.yaml",
        add_deploy_dir=True,
        create_remote_dir=True,
        _sudo=True,
    )

    if config_file.changed:
        server.shell(
            name="Generate netplan",
            commands=["netplan generate"],
            _sudo=True,
        )

        if not host.data.get("inside_docker"):
            server.shell(
                name="Apply the netplan configuration",
                commands=["netplan apply"],
                _sudo=True,
            )

    apt.packages(
        name="Install Uncomplicated Firewall (ufw)",
        packages=["ufw"],
        latest=True,
        _sudo=True,
    )

    server.shell(
        name="Allow SSH access",
        commands=[
            "ufw allow ssh",
        ],
        _sudo=True,
    )

    if not host.data.get("inside_docker"):
        server.shell(
            name="Enable firewall",
            commands=[
                "yes | ufw enable",
            ],
            _sudo=True,
        )

    if not host.data.get("inside_docker"):
        server.hostname(
            name="Set hostname",
            hostname="provisioner",
            _sudo=True,
        )
