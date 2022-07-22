from pyinfra.operations import brew

brew.packages(
    name="Install vim",
    packages=["vim"],
    present=True,
    update=False,
    latest=False,
    upgrade=False,
)
