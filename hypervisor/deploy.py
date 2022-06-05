# Structure pyinfra according to:
# https://docs.pyinfra.com/en/1.x/deploys.html#layout

from pyinfra.operations import apt, server, files, systemd
from pyinfra import host
from pyinfra.facts.server import Arch, OsVersion
from hypervisor.tasks.install_docker import install_docker
from hypervisor.tasks.install_cni import install_cni
from hypervisor.tasks.install_nomad import install_nomad
from hypervisor.tasks.install_consul import install_consul
from hypervisor.tasks.install_qemu import install_qemu

apt.packages(
    name="Ensure all kernel modules are available",
    packages=[f"linux-modules-{host.get_fact(OsVersion)}"],
    update=True,
)

install_docker()
install_cni(version="0.9.1")
install_nomad(version="1.3.0")
install_consul(version="1.12.2")
install_qemu()

server.shell(
    name="Enable firewall for SSH",
    commands=['ufw allow "OpenSSH"'],
)

server.shell(
    name="Enable the firewall",
    commands=["ufw --force enable"],
)
