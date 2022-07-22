from pyinfra.operations import brew

brew.packages(
    name="Install vim",
    packages=["vim"],
    update=False,
    latest=False,
    upgrade=False,
)
