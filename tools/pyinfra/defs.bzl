load("//tools/bazel:defs.bzl", "runner_binary")

def pyinfra_run(name, deploy, inventory, pyinfra_runtime, env = {}):
    env_string = ""
    for key, value in env.items():
        env_string += 'export {}="{}"\n'.format(key, value)

    runner_binary(
        name = name,
        cmd = """
        {env_string}

        DEPLOY_PATH=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {deploy}))
        INVENTORY_PATH=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {inventory}))
        PYINFRA_BINARY=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {pyinfra_binary}))

        $$PYINFRA_BINARY $$INVENTORY_PATH $$DEPLOY_PATH
        """.format(
            env_string = env_string,
            deploy = deploy,
            inventory = inventory,
            pyinfra_binary = pyinfra_runtime,
        ),
        out = "{}_runner.sh".format(name),
        deps = [
            deploy,
            inventory,
            pyinfra_runtime,
        ],
    )
    pass
