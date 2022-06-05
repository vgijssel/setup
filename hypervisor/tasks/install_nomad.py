from pyinfra.operations import apt, files, server, systemd
from pyinfra import host
from pyinfra.facts.server import Arch
from pyinfra.api.deploy import deploy

# https://www.nomadproject.io/docs/install/production/requirements
@deploy("Install Nomad")
def install_nomad(version):
    nomad_version = version
    arch = "amd64" if host.get_fact(Arch) == "x86_64" else "arm64"

    server.sysctl(
        name="Ensure OS dynamic port does not conflict with Nomad",
        key="net.ipv4.ip_local_port_range",
        value="49152 65535",
        persist=True,
        persist_file="/etc/sysctl.conf",
    )

    for setting in [
        "net.bridge.bridge-nf-call-arptables",
        "net.bridge.bridge-nf-call-ip6tables",
        "net.bridge.bridge-nf-call-iptables",
    ]:
        server.sysctl(
            name=f"Optimize network for guest traffic {setting}",
            key=setting,
            value=1,
            persist=True,
            persist_file="/etc/sysctl.conf",
        )

    files.download(
        name="Download Nomad binary",
        src=f"https://releases.hashicorp.com/nomad/{nomad_version}/nomad_{nomad_version}_linux_{arch}.zip",
        dest="/tmp/nomad.zip",
    )

    apt.packages(
        name="Install Nomad dependencies",
        packages=["unzip"],
    )

    server.shell(
        name="Unpack Nomad Binary",
        commands=["unzip -o /tmp/nomad.zip -d /usr/local/bin"],
    )

    files.file(
        name="Ensure Nomad binary is executable",
        mode="0755",
        user="root",
        group="root",
        path="/usr/local/bin/nomad",
    )

    files.directory(
        name="Create Nomad configuration directory",
        present=True,
        path="/etc/nomad.d",
    )

    files.put(
        name="Copy the Nomad agent configuration",
        src="hypervisor/files/nomad.hcl",
        dest="/etc/nomad.d/nomad.hcl",
    )

    files.put(
        name="Upload Nomad service file",
        src="hypervisor/files/nomad.service",
        dest="/etc/systemd/system/nomad.service",
        mode="644",
        user="root",
        group="root",
    )

    systemd.service(
        name="Restart and enable the Nomad service",
        service="nomad.service",
        running=True,
        restarted=True,
        enabled=True,
        daemon_reload=True,
    )
