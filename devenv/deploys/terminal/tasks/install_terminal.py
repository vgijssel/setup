import os

from pyinfra import host
from pyinfra.api.deploy import deploy
from pyinfra.facts.server import Command, User
from pyinfra.operations import brew, files, server

# from workstation.helpers.home_link import home_link


@deploy("Install Terminal")
def install_terminal():
    brew.casks(
        name="Install Apps",
        casks=[
            "warp",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )
