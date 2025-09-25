"""
Bazel macro to make it easy to run Pyinfra.
"""

load("@pdm-setup//:requirements.bzl", "requirement")
load("@rules_python//python:defs.bzl", "py_binary")
load("@rules_task//task:defs.bzl", "cmd", "task")

def pyinfra_run(name, deploy, inventory, env = {}, srcs = [], deps = [], args = [], data = []):
    python_binary = "{name}_env".format(name = name)

    py_binary(
        name = python_binary,
        srcs = [
            "//tools/pyinfra:main.py",
        ] + srcs,
        main = "main.py",
        deps = [requirement("bazel-runfiles"), requirement("pyinfra")] + deps,
    )

    task(
        name = name,
        cmds = [
            "ARGS=${CLI_ARGS:-$default_args}",
            "PYINFRA_RUN_ARGS=${PYINFRA_RUN_ARGS:-\"\"}",
            "$pyinfra $PYINFRA_RUN_ARGS $ARGS $inventory_file $deploy_file",
        ],
        env = {
            "default_args": " ".join(args),
            "deploy_file": cmd.file(deploy),
            "inventory_file": cmd.file(inventory),
            "pyinfra": cmd.executable(python_binary),
        } | env,
        data = data,
        deps = deps,
    )
