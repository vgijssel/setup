from pyinfra.operations import files, server
from pyinfra import host
from pyinfra.facts.server import Arch
from pyinfra.api.deploy import deploy


@deploy("Install CNI")
def install_cni():
    # Installation instructions from https://github.com/weaveworks/ignite/blob/main/docs/installation.md
    cni_version = "v0.9.1"
    arch = "amd64" if host.get_fact(Arch) == "x86_64" else "arm64"

    files.download(
        name="Download CNI binaries",
        src=f"https://github.com/containernetworking/plugins/releases/download/{cni_version}/cni-plugins-linux-{arch}-{cni_version}.tgz",
        dest="/tmp/cni-plugins.tgz",
    )

    files.directory(
        name="Create CNI directory",
        present=True,
        path="/opt/cni/bin",
    )

    server.shell(
        name="Unpack CNI binaries",
        commands=["tar -xf /tmp/cni-plugins.tgz -C /opt/cni/bin"],
    )
