import pulumi
from sshtunnel import SSHTunnelForwarder
from pulumi_command import local
import atexit
import signal
import tempfile
import os
import pulumi_command as command

provisioner_ssh_key = os.environ["PROVISIONER_SSH_KEY"]
provisioner_host = os.environ["PROVISIONER_HOST"]
provisioner_port = os.environ["PROVISIONER_PORT"]

kubeconfig = command.remote.Command(
    "fetch-kubeconfig",
    connection={
        "host": provisioner_host,
        "user": "ubuntu",
        "privateKey": provisioner_ssh_key,
        "port": float(provisioner_port),
    },
    create="microk8s config",
)


# fp = tempfile.NamedTemporaryFile()
# fp.write(provisioner_ssh_key.encode("utf-8"))

# We need two things:
# 1. Download the kubeconfig file from provisioner microk8s
# 2. Forward the microk8s management port to local port

# server = SSHTunnelForwarder(
#     provisioner_host,
#     ssh_port=provisioner_port,
#     ssh_username="ubuntu",
#     ssh_pkey=fp.name,
#     remote_bind_address=("127.0.0.1", 22),
# )

# server.start()

# print(f"THE SERVER PORT {server.local_bind_port}")  # show assigned local port
# work with `SECRET SERVICE` through `server.local_bind_port`.

# import pulumiverse_unifi as unifi

# unifi.port.Forward(
#     "provisioner-ssh",
#     dst_port=22,
#     enabled=True,
#     fwd_ip="192.168.1.31",
#     protocol="tcp",
#     src_ip="any",
# )
handle_exit_executed = False


def handle_exit(*exit_args):
    print("HANDLING EXIT")
    global handle_exit_executed

    if handle_exit_executed:
        return

    # server.stop()
    # fp.close()

    handle_exit_executed = True


atexit.register(handle_exit)
signal.signal(signal.SIGTERM, handle_exit)
signal.signal(signal.SIGINT, handle_exit)