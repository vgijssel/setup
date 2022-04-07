from pyinfra.operations import apt, server

server.shell(
    name='Run an ad-hoc command',  # optional name for the operation
    commands='echo "hello world"',
)

# Define some state - this operation will do nothing on subsequent runs
apt.packages(
    name='Ensure the vim apt package is installed',
    packages=['vim'],
    sudo=True,  # use sudo when installing the packages
)