load("//tools/bazel:defs.bzl", "runner_binary")
load("@rules_python//python:defs.bzl", "py_binary")

def pyinfra_run(name, deploy, inventory, env = {}, deps = [], args = [], data = []):
    python_binary = "{name}_env".format(name = name)
    python_binary_target = ":{python_binary}".format(python_binary = python_binary)

    py_binary(
        name = python_binary,
        srcs = [
            "@hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra",
        ],
        main = "@hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra.py",
    )

    runner_binary(
        name = name,
        cmd = """
        DEPLOY_PATH=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {deploy}))
        INVENTORY_PATH=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {inventory}))
        PYINFRA_BINARY=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {pyinfra_binary}))

        $$PYINFRA_BINARY {args} $$INVENTORY_PATH $$DEPLOY_PATH
        """.format(
            deploy = deploy,
            inventory = inventory,
            pyinfra_binary = python_binary_target,
            args = " ".join(args),
        ),
        out = "{}_runner.sh".format(name),
        deps = [
            deploy,
            inventory,
            python_binary_target,
        ] + deps,
        data = data,
        env = env,
    )
