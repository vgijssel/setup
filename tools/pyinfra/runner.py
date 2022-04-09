import os
import sys
import runner_env

# We trick Pyinfra to think it's being called from the command line
# by setting the argv to the neessary arguments.
current_file = sys.argv[0]
inventory_file = runner_env.inventory_file
deploy_file = runner_env.deploy_file
sys.argv = [
    current_file,
    inventory_file,
    deploy_file,
]

from pyinfra_cli.__main__ import execute_pyinfra

if __name__ == "__main__":
    rc = execute_pyinfra()
    sys.exit(execute_pyinfra())