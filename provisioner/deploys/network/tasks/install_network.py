from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server


@deploy("Install Network")
def install_network():
    files.put(
        name="Copy netplan config",
        src="provisioner/deploys/network/files/99_config.yaml",
        dest="/etc/netplan/99_config.yaml",
        add_deploy_dir=True,
        create_remote_dir=True,
        _sudo=True,
    )

    server.shell(
        name="Generate netplan",
        commands=["netplan generate"],
        _sudo=True,
    )

    server.shell(
        name="Apply the netplan configuration",
        commands=["netplan apply"],
        _sudo=True,
    )
