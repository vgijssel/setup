from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt
from pyinfra import host
from io import StringIO
from pyinfra.facts.server import LsbRelease
from pyinfra.facts.deb import DebArch

ONEPASSWORD_CLI_VERSION = "v2.17.0"


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

    # From https://developer.1password.com/docs/cli/get-started/
    apt.packages(
        name="Install dependencies for 1password-cli",
        packages=["wget", "unzip"],
        update=True,
        cache_time=24 * 60 * 60,
        _sudo=True,
    )

    arch = host.get_fact(DebArch)

    server.shell(
        name="Install 1password-cli",
        commands=[
            f'wget "https://cache.agilebits.com/dist/1P/op2/pkg/{ONEPASSWORD_CLI_VERSION}/op_linux_{arch}_{ONEPASSWORD_CLI_VERSION}.zip" -O /tmp/op.zip',
            "unzip -d /tmp/op /tmp/op.zip",
            "mv /tmp/op/op /usr/local/bin",
            "rm -rf /tmp/op /tmp/op.zip",
        ],
        _sudo=True,
    )

    # TODO: turn this into a pyinfra fact
    # export OP_CONNECT_HOST=http://localhost:8080
    # export OP_CONNECT_TOKEN=token
    # op item get 'kerk' --vault='vgijssel-dev' --format=json
