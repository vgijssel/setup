from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.operations import snap, server, files, apt
from pyinfra.facts.server import Users


# From https://microk8s.io/docs/getting-started
@deploy("Install Microk8s")
def install_microk8s():
    if not host.data.get("inside_docker"):
        # From https://microk8s.io/docs/install-raspberry-pi
        apt.packages(
            name="Ensure all kernel modules are available",
            packages=["linux-modules-extra-raspi"],
            update=True,
            present=True,
            _sudo=True,
        )

    # From https://microk8s.io/docs/install-raspberry-pi
    config_file = files.put(
        name="Copy cmdline",
        src="provisioner/deploys/microk8s/files/cmdline.txt",
        dest="/boot/firmware/cmdline.txt",
        create_remote_dir=True,
        _sudo=True,
    )

    if config_file.changed and not host.data.get("inside_docker"):
        server.reboot(
            name="Reboot the server and wait to reconnect",
            delay=60,
            reboot_timeout=600,
            _sudo=True,
        )

    snap.package(
        name="Install MicroK8S",
        packages="microk8s",
        classic=True,
        present=True,
        _sudo=True,
    )

    server.shell(
        name="Update firewall rules",
        commands=[
            "ufw allow in on cni0",
            "ufw allow out on cni0",
            "ufw default allow routed",
        ],
        _sudo=True,
    )

    existing_groups = host.get_fact(Users)["ubuntu"]["groups"]
    new_groups = existing_groups + ["microk8s"]

    server.user(
        name="Add ubuntu to microk8s group",
        user="ubuntu",
        groups=new_groups,
        present=True,
        _sudo=True,
    )

    files.directory(
        name="Create and own .kube directory",
        present=True,
        user="ubuntu",
        group="ubuntu",
        path="/home/ubuntu/.kube",
        _sudo=True,
    )

    if not host.data.get("inside_docker"):
        server.shell(
            name="Start Microk8s",
            commands=[
                "microk8s start",
            ],
        )

        server.shell(
            name="Enable DNS addon",
            # From here https://microk8s.io/docs/addons
            commands=[
                "microk8s enable dns",
                "microk8s enable helm",
                "microk8s enable hostpath-storage",
            ],
        )
