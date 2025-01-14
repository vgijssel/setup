python_requirements(
    name = "reqs",
    source = "requirements.txt",
)

# Copied from https://github.com/ansible/ansible/blob/devel/pyproject.toml
pex_binary(
    name = "ansible",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.adhoc:main",
)

pex_binary(
    name = "ansible-config",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.config:main",
)

pex_binary(
    name = "ansible-console",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.console:main",
)

pex_binary(
    name = "ansible-doc",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.doc:main",
)

pex_binary(
    name = "ansible-galaxy",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.galaxy:main",
)

pex_binary(
    name = "ansible-inventory",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.inventory:main",
)

pex_binary(
    name = "ansible-playbook",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.playbook:main",
)

pex_binary(
    name = "ansible-pull",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible.cli.pull:main",
)

pex_binary(
    name = "ansible-test",
    dependencies = [
        "3rdparty/python:reqs#ansible",
    ],
    entry_point = "ansible_test._util.target.cli.ansible_test_cli_stub:main",
)
