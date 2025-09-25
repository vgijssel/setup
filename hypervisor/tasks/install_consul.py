from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.facts.server import Arch
from pyinfra.operations import apt, files, server, systemd


# https://learn.hashicorp.com/tutorials/consul/deployment-guide#install-consul
@deploy("Install Consul")
def install_consul(version):
    consul_version = version
    arch = "amd64" if host.get_fact(Arch) == "x86_64" else "arm64"

    files.download(
        name="Download consul binary",
        src=f"https://releases.hashicorp.com/consul/{consul_version}/consul_{consul_version}_linux_{arch}.zip",
        dest="/tmp/consul.zip",
    )

    apt.packages(
        name="Install consul dependencies",
        packages=["unzip"],
    )

    server.shell(
        name="Unpack consul Binary",
        commands=["unzip -o /tmp/consul.zip -d /usr/local/bin"],
    )

    files.file(
        name="Ensure consul binary is executable",
        mode="0755",
        user="root",
        group="root",
        path="/usr/local/bin/consul",
    )

    files.directory(
        name="Create consul configuration directory",
        present=True,
        path="/etc/consul.d",
    )

    files.put(
        name="Copy the consul agent configuration",
        src="hypervisor/files/consul.hcl",
        dest="/etc/consul.d/consul.hcl",
    )

    files.put(
        name="Upload consul service file",
        src="hypervisor/files/consul.service",
        dest="/etc/systemd/system/consul.service",
        mode="644",
        user="root",
        group="root",
    )

    systemd.service(
        name="Restart and enable the consul service",
        service="consul.service",
        running=True,
        restarted=True,
        enabled=True,
        daemon_reload=True,
    )
