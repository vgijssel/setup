from pyinfra.operations import python
from time import sleep
from pyinfra import host
from pyinfra import local
import json
import os


# Inspired by https://github.com/Fizzadar/pyinfra/blob/2.x/pyinfra/operations/server.py#LL51C12-L51C52
def _wait_for_reconnect(delay=10, interval=1, reboot_timeout=300):
    sleep(delay)
    max_retries = round(reboot_timeout / interval)

    host.connection = None  # remove the connection object
    retries = 0

    while True:
        host.connect(show_errors=False)
        if host.connection:
            break

        if retries > max_retries:
            raise Exception(
                ("Server did not reboot in time (reboot_timeout={0}s)").format(
                    reboot_timeout
                ),
            )

        sleep(interval)
        retries += 1


def wait_for_reconnect(name):
    python.call(
        name=name,
        function=_wait_for_reconnect,
    )


def one_password_item(
    item_title,
    onepassword_vault_id=None,
    onepassword_service_account_token=None,
):
    if onepassword_vault_id is None:
        onepassword_vault_id = host.data.onepassword_vault_id

    if onepassword_service_account_token is None:
        onepassword_service_account_token = host.data.onepassword_service_account_token

    command = "op item get '{item_title}' --vault='{onepassword_vault_id}' --format=json".format(
        item_title=item_title,
        onepassword_vault_id=onepassword_vault_id,
        onepassword_service_account_token=onepassword_service_account_token,
    )

    try:
        # NOTE: this environ hackery is so that if the command fail the secret is not printed to stdout/stderr.
        os.environ["OP_SERVICE_ACCOUNT_TOKEN"] = onepassword_service_account_token
        json_string = local.shell(command, print_input=False)
    finally:
        del os.environ["OP_SERVICE_ACCOUNT_TOKEN"]
        print("An exception occurred")

    raw_data = json.loads(json_string)

    data = {}

    for field in raw_data["fields"]:
        data[field["id"]] = field.get("value", None)

    return data
