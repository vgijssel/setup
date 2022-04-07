from pyinfra.operations import apt, server
from pyinfra_docker import deploy_docker

server.sysctl(
    name='Enable ip4 forwarding',
    key='net.ipv4.ip_forward',
    value=1,
    persist=True,
)

apt.packages(
    name="Ensure ignite dependencies are installed",
    packages=["mount", "tar", "e2fsprogs", "binutils", "dmsetup", "openssh-client", "git", "cpu-checker"],
)

deploy_docker()

# - Install Ignire dependencies
# - Install Ignite
# --- packer specific
# - Remove packer user
# - Reset cloud init