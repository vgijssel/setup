from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from tools.onepassword.lib import get_item_path
from pyinfra.facts.server import LsbRelease
from pyinfra.facts.deb import DebArch


@deploy("Install bunq2ynab")
def install_bunq2ynab():
    files.directory(
        name="Ensure bunq2ynab directory exists",
        path="/opt/bunq2ynab",
        user="root",
        group="root",
        mode="0700",
        _sudo=True,
    )

    # new_relic_license_key = get_item_path("new_relic_license_key.password")
    # github_exporter_token = get_item_path("github_exporter_token.password")

    docker_compose = files.template(
        name="Copy the docker-compose file",
        src="provisioner/deploys/bunq2ynab/files/docker-compose.yml.j2",
        dest="/opt/bunq2ynab/docker-compose.yml",
        mode="0600",
        _sudo=True,
        user="root",
        group="root",
        # github_exporter_token=github_exporter_token,
        # new_relic_license_key=new_relic_license_key,
        setup_env=host.data.setup_env,
        is_arm=host.get_fact(DebArch) == "arm64",
    )

    if docker_compose.changed:
        server.shell(
            name="Start the bunq2ynab service",
            commands=[
                "docker compose -f /opt/bunq2ynab/docker-compose.yml up -d --force-recreate --remove-orphans",
            ],
            _sudo=True,
        )
