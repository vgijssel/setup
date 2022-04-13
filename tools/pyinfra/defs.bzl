def _extract_rlocation(ctx, label):
    return "{workspace_name}/{package}/{name}".format(
        workspace_name = label.workspace_name or ctx.workspace_name,
        package = label.package,
        name = label.name,
    )

def _create_runner_env_impl(ctx):
    ctx.actions.expand_template(
        template = ctx.file._runner_env_tpl,
        substitutions = {
            "{deploy_file}": _extract_rlocation(ctx, ctx.file.deploy.owner),
            "{inventory_file}": _extract_rlocation(ctx, ctx.file.inventory.owner),
        },
        output = ctx.outputs.output,
    )

_create_runner_env = rule(
    implementation = _create_runner_env_impl,
    attrs = {
        "deploy": attr.label(mandatory = True, allow_single_file = True),
        "inventory": attr.label(mandatory = True, allow_single_file = True),
        "data": attr.label_list(allow_files = True),
        "output": attr.output(mandatory = True),
        "_runner_env_tpl": attr.label(
            default = Label("//tools/pyinfra:runner_env.py.tpl"),
            allow_single_file = True,
        ),
    },
)

def pyinfra_run(name, deploy, inventory, pyinfra_runtime, deps = [], data = []):
    runner_env_label = "{}_runner_env".format(name)

    _create_runner_env(
        name = runner_env_label,
        deploy = deploy,
        inventory = inventory,
        data = data,
        output = "{}_files/runner_env.py".format(name),
    )

    native.py_binary(
        name = name,
        srcs = [
            "//tools/pyinfra:runner.py",
            runner_env_label,
        ],
        main = "runner.py",
        deps = [
            "@rules_python//python/runfiles",
            pyinfra_runtime,
        ] + deps,
        imports = ["{}_files".format(name)],
        data = [
            deploy,
            inventory,
        ] + data,
    )
