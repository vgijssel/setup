from provisioner.deploys.network.tasks.install_network import install_network
from provisioner.deploys.microk8s.tasks.install_microk8s import install_microk8s
from pyinfra import host

if host.data.get("install_network"):
    install_network()

if host.data.get("install_microk8s"):
    install_microk8s()
