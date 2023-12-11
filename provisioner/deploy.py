from provisioner.deploys.network.tasks.install_network import install_network
from provisioner.deploys.microk8s.tasks.install_microk8s import install_microk8s
from provisioner.deploys.teleport.tasks.install_teleport import install_teleport
from provisioner.deploys.monitoring.tasks.install_monitoring import install_monitoring
from provisioner.deploys.docker.tasks.install_docker import install_docker
from provisioner.deploys.bunq2ynab.tasks.install_bunq2ynab import install_bunq2ynab
from provisioner.utils import wait_for_reconnect

from pyinfra import host
from pyinfra.facts.files import File
from pyinfra.operations import server

if host.get_fact(File, "/var/run/reboot-required"):
    server.reboot(
        name="Reboot required. Rebooting the server and wait to reconnect",
        delay=60,
        reboot_timeout=600,
        _sudo=True,
        _ignore_errors=True,  # restarting the service will disconnect us and result in error
    )

    wait_for_reconnect(
        name="Wait for teleport to reconnect",
    )

if host.data.get("install_network"):
    install_network()

if host.data.get("install_docker"):
    install_docker()

if host.data.get("install_monitoring"):
    install_monitoring()

if host.data.get("install_teleport"):
    install_teleport()

if host.data.get("install_microk8s"):
    install_microk8s()

if host.data.get("install_bunq2ynab"):
    install_bunq2ynab()
