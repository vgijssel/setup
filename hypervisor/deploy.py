from pyinfra.operations import apt, server, files
from pyinfra_docker import deploy_docker
from pyinfra import host

server.sysctl(
    name='Enable ip4 forwarding',
    key='net.ipv4.ip_forward',
    value=1,
    persist=True,
)

apt.packages(
    name="Ensure ignite dependencies are installed",
    packages=["mount", "tar", "e2fsprogs", "binutils", "dmsetup", "openssh-client", "git", "cpu-checker", "uuid-runtime"],
)

deploy_docker()

# Installation instructions from https://github.com/weaveworks/ignite/blob/main/docs/installation.md
cni_version = 'v0.9.1'
arch = 'amd64' if host.fact.arch == 'x86_64' else 'arm64'

files.download(
    name = 'Download CNI binaries',
    src = f"https://github.com/containernetworking/plugins/releases/download/{cni_version}/cni-plugins-linux-{arch}-{cni_version}.tgz",
    dest = "/tmp/cni-plugins.tgz",
)

files.directory(
    name = 'Create CNI directory',
    present = True,
    path = '/opt/cni/bin',
)

server.shell(
    name='Unpack CNI binaries',
    commands=['tar -xf /tmp/cni-plugins.tgz -C /opt/cni/bin'],
)

ignite_version = 'v0.10.0'

for binary in ['ignite', 'ignited']:
    files.download(
        name = f'Download {binary} binary',
        src = f'https://github.com/weaveworks/ignite/releases/download/{ignite_version}/{binary}-{arch}',
        dest = f'/usr/local/bin/{binary}',
        mode = '755',
    )