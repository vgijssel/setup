from pyinfra.operations import apt
from pyinfra.api.deploy import deploy


@deploy("Install Qemu")
def install_qemu():
    apt.packages(
        name="Install Qemu",
        packages=[
            "qemu",
            "qemu-utils",
            "qemu-kvm",
        ],
        update=True,
    )
