# upload local file to the remote for the credentials
# deploy a onepassword_connect docker container to hypervisor

import pulumi_docker as docker
import pulumi
from pulumi_docker.outputs import ContainerPort, ContainerVolume
import pulumi_command as command

connect_api = docker.RemoteImage("connect-api", name="1password/connect-api")
connect_sync = docker.RemoteImage("connect-sync", name="1password/connect-sync")

onepassword_credentials_host_path = "/data/1password/1password-credentials.json"

onepassword_credentials_command = command.local.Command(
    "1password-credentials",
    create=f"scp ../1password/1password-credentials.json hypervisor:{onepassword_credentials_host_path}",
    delete=f"ssh hypervisor 'rm {onepassword_credentials_host_path}'",
)

onepassword_data_volume = docker.Volume("1password-data-volume", driver="local")

volumes = [
    ContainerVolume(
        container_path="/home/opuser/.op/1password-credentials.json",
        host_path=onepassword_credentials_host_path,
        read_only=True,
    ),
    ContainerVolume(
        container_path="/home/opuser/.op/data",
        volume_name=onepassword_data_volume.name,
    ),
]

docker.Container(
    "connect-api",
    image=connect_api.latest,
    restart="always",
    start=True,
    volumes=volumes,
    ports=[ContainerPort(internal=8080, external=8070, ip="0.0.0.0", protocol="tcp")],
    opts=pulumi.ResourceOptions(depends_on=[onepassword_credentials_command]),
)

docker.Container(
    "connect-sync",
    image=connect_sync.latest,
    restart="always",
    start=True,
    volumes=volumes,
    ports=[ContainerPort(internal=8080, external=8071, ip="127.0.0.1", protocol="tcp")],
    opts=pulumi.ResourceOptions(depends_on=[onepassword_credentials_command]),
)
