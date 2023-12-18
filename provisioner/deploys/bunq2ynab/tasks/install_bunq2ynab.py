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

    op_service_account_token = get_item_path(
        "1password_service_account_token.credential"
    )

    docker_compose = files.template(
        name="Copy the docker-compose file",
        src="provisioner/deploys/bunq2ynab/files/docker-compose.yml.j2",
        dest="/opt/bunq2ynab/docker-compose.yml",
        mode="0600",
        _sudo=True,
        user="root",
        group="root",
        op_service_account_token=op_service_account_token,
        setup_env=host.data.setup_env,
        bunq2ynab_image_tag=host.data.bunq2ynab_image_tag,
    )

    if docker_compose.changed:
        server.shell(
            name="Start the bunq2ynab service",
            commands=[
                "docker compose -f /opt/bunq2ynab/docker-compose.yml up -d --force-recreate --remove-orphans",
            ],
            _sudo=True,
        )
