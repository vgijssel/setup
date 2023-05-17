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
    prod = [
        (
            "@teleport/provisioner",
            {"teleport_tsh_binary": os.environ["TELEPORT_TSH_BINARY"]},
        ),
    ]

elif setup_env == "test":
    container_id = os.environ["CONTAINER_ID"]
    test = [
        (f"@docker/{container_id}"),
    ]

else:
    container_id = "provisioner_dev"
    dev = [
        (f"@docker/{container_id}"),
    ]
