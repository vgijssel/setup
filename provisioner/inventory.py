import os
import pkg_resources

import pyinfra.api.connectors
import provisioner.connectors.teleport
from pyinfra.api.connectors import get_all_connectors
import pyinfra.api.inventory

original_get_all_connectors = pyinfra.api.connectors.get_all_connectors


def patched_get_all_connectors():
    data = original_get_all_connectors()
    data["teleport"] = provisioner.connectors.teleport
    return data


pyinfra.api.connectors.get_all_connectors = patched_get_all_connectors
pyinfra.api.inventory.get_all_connectors = patched_get_all_connectors

setup_env = os.environ.get("SETUP_ENV", "dev")


if setup_env == "prod":
    if (
        "TELEPORT_IDENTITY" in os.environ
        and os.stat(os.environ["TELEPORT_IDENTITY"]).st_size > 0
    ):
        teleport_identity = os.environ["TELEPORT_IDENTITY"]
        teleport_user = "buildbuddy"
    else:
        teleport_identity = None
        teleport_user = "teleport-admin"

    prod = [
        (
            "@teleport/provisioner",
            {
                "teleport_login": "ubuntu",
                "teleport_tsh_binary": os.environ["TELEPORT_TSH_BINARY"],
                "teleport_proxy": "tele.vgijssel.nl",
                "teleport_user": teleport_user,
                "teleport_identity": teleport_identity,
            },
        ),
    ]

elif setup_env == "test":
    container_id = os.environ["CONTAINER_ID"]
    test = [
        (f"@docker/{container_id}", {}),
    ]

else:
    container_id = "provisioner-dev"
    dev = [
        (f"@docker/{container_id}", {}),
    ]
