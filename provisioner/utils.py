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
