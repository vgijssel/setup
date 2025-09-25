# Structure pyinfra according to:
# https://docs.pyinfra.com/en/1.x/deploys.html#layout

from hypervisor.tasks.install_cni import install_cni
from hypervisor.tasks.install_consul import install_consul
from hypervisor.tasks.install_docker import install_docker
from hypervisor.tasks.install_envoy import install_envoy
from hypervisor.tasks.install_nomad import install_nomad
from hypervisor.tasks.install_qemu import install_qemu
from pyinfra import host
from pyinfra.facts.server import OsVersion
from pyinfra.operations import apt, server

apt.packages(
    name="Ensure all kernel modules are available",
    packages=[f"linux-modules-{host.get_fact(OsVersion)}"],
    update=True,
)

install_docker()
install_cni(version="0.9.1")
install_nomad(version="1.3.0")
install_consul(version="1.12.2")
# Envoy needs to be compatible with consul, supported version can be found here:
# https://www.consul.io/docs/connect/proxies/envoy
install_envoy(version="1.22.0")
install_qemu()

server.shell(
    name="Enable firewall for SSH",
    commands=['ufw allow "OpenSSH"'],
)

server.shell(
    name="Enable the firewall",
    commands=["ufw --force enable"],
)
