from provisioner.deploys.network.tasks.install_network import install_network
from provisioner.deploys.microk8s.tasks.install_microk8s import install_microk8s
from pyinfra import host

# TODO: prevent reboot
# TODO: disable setting hostname
# TODO: install proper kernel modules microk8s needs

if host.data.get("install_network"):
    install_network()

if host.data.get("install_microk8s"):
    install_microk8s()
