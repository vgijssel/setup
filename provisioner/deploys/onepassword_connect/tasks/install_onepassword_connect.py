from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server
from pyinfra import host
from io import StringIO


@deploy("Install 1Password Connect")
def install_onepassword_connect():
    files.directory(
        name="Ensure onepassword_connect directory exists",
        path="/opt/onepassword_connect",
        user="root",
        group="root",
        mode="700",
        _sudo=True,
    )

    onepassword_connect_credentials_path = (
        "/opt/onepassword_connect/1password-credentials.json"
    )

    files.put(
        name="Upload 1password credentials",
        src=StringIO(host.data.onepassword_connect_credentials),
        dest=onepassword_connect_credentials_path,
        mode="444",
        _sudo=True,
        user="root",
        group="root",
    )

    files.template(
        name="Copy the docker-compose file",
        src="provisioner/deploys/onepassword_connect/files/docker-compose.yaml.j2",
        dest="/opt/onepassword_connect/docker-compose.yaml",
        mode="600",
        _sudo=True,
        user="root",
        group="root",
        onepassword_connect_credentials_path=onepassword_connect_credentials_path,
    )

    server.shell(
        name="Start the docker-compose service",
        commands=[
            "docker compose -f /opt/onepassword_connect/docker-compose.yaml up -d --force-recreate",
        ],
        _sudo=True,
    )
