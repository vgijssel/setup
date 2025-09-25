from pyinfra.api.deploy import deploy
from pyinfra.operations import apt


@deploy("Install Qemu")
def install_qemu():
    apt.packages(
        name="Install Qemu",
        packages=[
            "qemu",
            "qemu-utils",
            "qemu-kvm",
            "cpu-checker",
        ],
        update=True,
    )
