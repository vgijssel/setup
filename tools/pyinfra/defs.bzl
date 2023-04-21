"""
Bazel macro to make it easy to run Pyinfra.
"""

load("@rules_task//:defs.bzl", "cmd", "task")
load("@rules_python//python:defs.bzl", "py_binary")
load("@hypervisor_deps//:requirements.bzl", "requirement")

# TODO: move pyinfra dependencies into separate requirements file
def pyinfra_run(name, deploy, inventory, env = {}, srcs = [], deps = [], args = [], data = []):
    python_binary = "{name}_env".format(name = name)

    py_binary(
        name = python_binary,
        srcs = [
            "//tools/pyinfra:main.py",
        ] + srcs,
        main = "main.py",
        deps = ["@rules_python//python/runfiles", requirement("pyinfra")],
    )

    task(
        name = name,
        cmds = [
            "ARGS=${CLI_ARGS:-$default_args}",
            "$pyinfra $ARGS $inventory_file $deploy_file",
        ],
        env = {
            "pyinfra": cmd.executable(python_binary),
            "deploy_file": cmd.file(deploy),
            "inventory_file": cmd.file(inventory),
            "default_args": "'" + " ".join(args) + "'",
        } | env,
        data = data,
        deps = deps,
    )
