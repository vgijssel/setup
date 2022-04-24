# Structure pyinfra according to:
# https://docs.pyinfra.com/en/1.x/deploys.html#layout

from pyinfra.operations import apt, server, files, systemd
from pyinfra import host
from pyinfra.facts.server import Arch, LsbRelease
from pyinfra.api.deploy import deploy


# @deploy('Deploy Docker')
# def deploy_docker(state=None, host=None):
#     '''
#     Install Docker on the target machine.
#     '''

#     apt.packages(
#         name='Install apt requirements to use HTTPS',
#         packages=['apt-transport-https', 'ca-certificates'],
#         update=True,
#         cache_time=3600,
#         state=state,
#         host=host,
#     )

#     lsb_release = host.get_fact(LsbRelease)
#     lsb_id = lsb_release['id'].lower()

#     apt.key(
#         name='Download the Docker apt key',
#         src='https://download.docker.com/linux/{0}/gpg'.format(lsb_id),
#         state=state,
#         host=host,
#     )

#     add_apt_repo = apt.repo(
#         name='Add the Docker apt repo',
#         src=(
#             'deb [arch=amd64] https://download.docker.com/linux/{0} {1} stable'
#         ).format(lsb_id, lsb_release['codename']),
#         filename='docker-ce-stable',
#         state=state,
#         host=host,
#     )

#     apt.packages(
#         name='Install Docker via apt',
#         packages=[
#             'docker-ce',
#             'docker-ce-cli',
#             'containerd.io',
#         ],
#         update=add_apt_repo.changed,  # update if we added the repo
#         state=state,
#         host=host,
#     )

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

files.download(
    name = f'Download kubefire binary',
    src = f'https://github.com/innobead/kubefire/releases/download/v0.3.6/kubefire-linux-amd64',
    dest = f'/usr/local/bin/kubefire',
    mode = '755',
)

# server.shell(
#     name='Install kubefire depdenencies',
#     commands=['kubefire install'],
# )


# deploy_docker()

# # Installation instructions from https://github.com/weaveworks/ignite/blob/main/docs/installation.md
# cni_version = 'v0.9.1'
# arch = 'amd64' if host.get_fact(Arch) == 'x86_64' else 'arm64'

# files.download(
#     name = 'Download CNI binaries',
#     src = f"https://github.com/containernetworking/plugins/releases/download/{cni_version}/cni-plugins-linux-{arch}-{cni_version}.tgz",
#     dest = "/tmp/cni-plugins.tgz",
# )

# files.directory(
#     name = 'Create CNI directory',
#     present = True,
#     path = '/opt/cni/bin',
# )

# server.shell(
#     name='Unpack CNI binaries',
#     commands=['tar -xf /tmp/cni-plugins.tgz -C /opt/cni/bin'],
# )

# ignite_version = 'v0.10.0'

# for binary in ['ignite', 'ignited']:
#     files.download(
#         name = f'Download {binary} binary',
#         src = f'https://github.com/weaveworks/ignite/releases/download/{ignite_version}/{binary}-{arch}',
#         dest = f'/usr/local/bin/{binary}',
#         mode = '755',
#     )

# files.put(
#     name = "Upload ingited service file",
#     src = "hypervisor/files/ignited.service",
#     dest = "/etc/systemd/system/ignited.service",
#     mode = '644',
#     user = 'root',
#     group = 'root',
# )

# server.group(
#     name = "Create the ignite group",
#     group = "ignite",
#     present=True,
#     system=False,
# )

# files.directory(
#     name = "Create firecracker manifest directory",
#     path = "/etc/firecracker/manifests",
#     present = True,
#     user = "root",
#     group = "ignite",
#     mode = "775"
# )

# systemd.service(
#     name='Restart and enable the ignited service',
#     service='ignited.service',
#     running=True,
#     restarted=True,
#     enabled=True,
#     daemon_reload=True,
# )

server.shell(
    name='Enable firewall for SSH',
    commands=['ufw allow "OpenSSH"'],
)

server.shell(
    name='Enable the firewall',
    commands=['ufw --force enable'],
)