from pyinfra.operations import apt, files, server
from pyinfra import host
from pyinfra.facts.server import Arch
from pyinfra.api.deploy import deploy


@deploy("Install Nomad")
def install_nomad(version):
    nomad_version = version
    arch = "amd64" if host.get_fact(Arch) == "x86_64" else "arm64"

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
        commands=["unzip /tmp/nomad.zip -d /usr/local/bin"],
    )

    files.file(
        name="Ensure Nomad binary is executable",
        mode="",
        path="/usr/local/bin/nomad",
    )
