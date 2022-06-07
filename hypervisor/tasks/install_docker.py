from pyinfra.operations import apt
from pyinfra import host
from pyinfra.facts.server import LsbRelease
from pyinfra.api.deploy import deploy


@deploy("Install Docker")
def install_docker():
    """
    Install Docker on the target machine.
    """

    apt.packages(
        name="Install apt requirements to use HTTPS",
        packages=["apt-transport-https", "ca-certificates"],
        update=True,
        cache_time=3600,
    )

    lsb_release = host.get_fact(LsbRelease)
    lsb_id = lsb_release["id"].lower()

    apt.key(
        name="Download the Docker apt key",
        src="https://download.docker.com/linux/{0}/gpg".format(lsb_id),
    )

    add_apt_repo = apt.repo(
        name="Add the Docker apt repo",
        src=(
            "deb [arch=amd64] https://download.docker.com/linux/{0} {1} stable"
        ).format(lsb_id, lsb_release["codename"]),
        filename="docker-ce-stable",
    )

    apt.packages(
        name="Install Docker via apt",
        packages=[
            "docker-ce",
            "docker-ce-cli",
            "containerd.io",
        ],
        update=add_apt_repo.changed,  # update if we added the repo
    )
