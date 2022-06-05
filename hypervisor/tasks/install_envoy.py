from pyinfra.operations import apt, files, server, systemd
from pyinfra import host
from pyinfra.facts.server import Arch
from pyinfra.api.deploy import deploy

# https://learn.hashicorp.com/tutorials/envoy/deployment-guide#install-envoy
@deploy("Install envoy")
def install_envoy(version):
    envoy_version = version
    arch = "amd64" if host.get_fact(Arch) == "x86_64" else "arm64"

    # https://github.com/tetratelabs/archive-envoy/releases/download/v1.22.0/envoy-v1.22.0-linux-amd64.tar.xz
    files.download(
        name="Download envoy binary",
        src=f"https://github.com/tetratelabs/archive-envoy/releases/download/v{envoy_version}/envoy-v{envoy_version}-linux-{arch}.tar.xz",
        dest="/tmp/envoy.tar.xz",
    )

    server.shell(
        name="Unpack envoy Binary",
        commands=["tar -C /tmp --extract --file=/tmp/envoy.tar.gz"],
    )

    server.shell(
        name="Move envoy binary to /usr/local/bin",
        commands=[
            f"mv /tmp/envoy-v{envoy_version}-linux-{arch}/bin/envoy /usr/local/bin/envoy"
        ],
    )

    files.file(
        name="Ensure envoy binary is executable",
        mode="0755",
        user="root",
        group="root",
        path="/usr/local/bin/envoy",
    )
