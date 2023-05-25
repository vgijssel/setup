from pyinfra.operations import python
from time import sleep
from pyinfra import host
from onepasswordconnectsdk.client import Client, new_client


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


# TODO: this is run within the context of Pyinfra, not of the host.
# This means we need to provide a host/port to connect to which is hard when using docker
# This is also when using Teleport/ssh as the connect server port will not be exposed?
def get_onepassword_secret(item_title, host=None, token=None, vault_id=None):
    if host is None:
        host = host.data.onepassword_connect_host

    if token is None:
        token = host.data.onepassword_connect_token

    if vault_id is None:
        vault_id = host.data.onepassword_vault_id

    client: Client = new_client(
        host=host,
        token=token,
        vault_id=vault_id,
        item_title=item_title,
    )
    client.get_item_by_title(item_title, vault_id)
