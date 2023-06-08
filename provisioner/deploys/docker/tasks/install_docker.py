from pyinfra.operations import apt, server, systemd
from pyinfra import host
from pyinfra.facts.server import LsbRelease
from pyinfra.api.deploy import deploy
from pyinfra.facts.deb import DebArch
from pyinfra.facts.server import Users


@deploy("Install Docker")
def install_docker():
    """
    Install Docker on the target machine.
    """

    # From https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

    apt.packages(
        name="Install apt requirements to use HTTPS",
        packages=["curl", "ca-certificates", "gnupg"],
        update=True,
        cache_time=24 * 60 * 60,
        _sudo=True,
    )

    server.shell(
        name="Add Docker’s official GPG key",
        commands=[
            "install -m 0755 -d /etc/apt/keyrings",
            "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --yes --dearmor -o /etc/apt/keyrings/docker.gpg",
            "chmod a+r /etc/apt/keyrings/docker.gpg",
        ],
        _sudo=True,
    )

    lsb = host.get_fact(LsbRelease)
    version_codename = lsb["codename"]
    distro = lsb["id"].lower()
    arch = host.get_fact(DebArch)

    add_apt_repo = apt.repo(
        name="Add the Docker apt repo",
        src=(
            "deb [arch={arch} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/{distro} {version_codename} stable"
        ).format(arch=arch, distro=distro, version_codename=version_codename),
        filename="docker-ce-stable",
        _sudo=True,
    )

    apt.packages(
        name="Install Docker via apt",
        packages=[
            "docker-ce",
            "docker-ce-cli",
            "containerd.io",
            "docker-buildx-plugin",
            "docker-compose-plugin",
        ],
        update=True,
        cache_time=0 if add_apt_repo.changed else 24 * 60 * 60,
        _sudo=True,
    )

    existing_groups = host.get_fact(Users)["ubuntu"]["groups"]

    if "docker" not in existing_groups:
        server.shell(
            name="Add ubuntu to docker group",
            commands=[
                "usermod -a -G docker ubuntu",
            ],
            _sudo=True,
        )

    systemd.service(
        name="Enable the docker service",
        service="docker.service",
        running=True,
        enabled=True,
        _sudo=True,
    )

    apt.packages(
        name="Install cron",
        packages=["cron"],
        update=True,
        cache_time=24 * 60 * 60,
        _sudo=True,
    )

    server.crontab(
        name="Prune Docker every day at 00:00",
        command="docker system prune -a -f --volumes",
        minute="0",
        hour="0",
    )
