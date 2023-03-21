from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.operations import snap, server, files
from pyinfra.facts.server import Users


# From https://microk8s.io/docs/getting-started
# TODO: maybe enable addons? https://ubuntu.com/tutorials/install-a-local-kubernetes-with-microk8s#3-enable-addons
@deploy("Install Microk8s")
def install_microk8s():
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

    server.shell(
        name="Enable DNS addon",
        commands=["microk8s enable dns"],
    )
