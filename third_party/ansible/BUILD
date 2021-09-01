package(default_visibility = ["PUBLIC"])

subinclude("//tools/python")

pex_binary(
    name = "ansible",
    packages = [
        "ansible==4.5.0",
    ],
    pex_toolchain = "//third_party/pex",
    python_toolchain = "//third_party/python",
    scripts = [
        "ansible",
        "ansible-config",
        "ansible-connection",
        "ansible-console",
        "ansible-doc",
        "ansible-galaxy",
        "ansible-inventory",
        "ansible-playbook",
        "ansible-pull",
        "ansible-test",
        "ansible-vault",
    ],
)