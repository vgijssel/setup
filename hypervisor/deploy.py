# Structure pyinfra according to:
# https://docs.pyinfra.com/en/1.x/deploys.html#layout

from pyinfra.operations import apt, server, files, systemd
from pyinfra import host
from pyinfra.facts.server import Arch, OsVersion
from hypervisor.tasks.install_docker import install_docker
from hypervisor.tasks.install_cni import install_cni

apt.packages(
    name="Ensure all kernel modules are available",
    packages=[f"linux-modules-{host.get_fact(OsVersion)}"],
    update=True,
)

server.sysctl(
    name="Enable ip4 forwarding",
    key="net.ipv4.ip_forward",
    value=1,
    persist=True,
)

install_docker()
install_cni()

server.shell(
    name="Enable firewall for SSH",
    commands=['ufw allow "OpenSSH"'],
)

server.shell(
    name="Enable the firewall",
    commands=["ufw --force enable"],
)
