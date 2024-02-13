"""Implementation of the pycross_target_environment rule."""

load(":internal_repo.bzl", "exec_internal_tool")

def _target_python_impl(ctx):
    f = ctx.actions.declare_file(ctx.attr.name + ".json")

    args = ctx.actions.args().use_param_file("--flagfile=%s")
    args.add("create")
    args.add("--name", ctx.attr.name)
    args.add("--output", f)
    args.add("--implementation", ctx.attr.implementation)
    args.add("--version", ctx.attr.version)

    for abi in ctx.attr.abis:
        args.add("--abi", abi)

    for platform in ctx.attr.platforms:
        args.add("--platform", platform)

    for constraint in ctx.attr.python_compatible_with:
        args.add("--python-compatible-with", str(constraint.label))

    for flag, value in ctx.attr.flag_values.items():
        args.add_all("--flag-value", [str(flag.label), value])

    for key, val in ctx.attr.envornment_markers.items():
        args.add_all("--environment-marker", [key, val])

    if ctx.attr.config_setting:
        args.add("--config-setting-target", str(ctx.attr.config_setting.label))

    ctx.actions.run(
        outputs = [f],
        executable = ctx.executable._tool,
        arguments = [args],
    )

    return [
        DefaultInfo(
            files = depset([f]),
        ),
    ]

pycross_target_environment = rule(
    implementation = _target_python_impl,
    attrs = {
        "implementation": attr.string(
            doc = (
                "The PEP 425 implementation abbreviation. " +
                "Defaults to 'cp' for CPython."
            ),
            default = "cp",
        ),
        "version": attr.string(
            doc = "The python version.",
            mandatory = True,
        ),
        "abis": attr.string_list(
            doc = "A list of PEP 425 abi tags. Defaults to ['none'].",
            default = ["none"],
        ),
        "platforms": attr.string_list(
            doc = "A list of PEP 425 platform tags. Defaults to ['any'].",
            default = ["any"],
        ),
        "python_compatible_with": attr.label_list(
            doc = (
                "A list of constraints that, when satisfied, indicates this " +
                "target_platform should be selected (together with flag_values)."
            ),
        ),
        "flag_values": attr.label_keyed_string_dict(
            doc = (
                "A list of flag values that, when satisfied, indicates this " +
                "target_platform should be selected (together with python_compatible_with)."
            ),
        ),
        "envornment_markers": attr.string_dict(
            doc = "Environment marker overrides.",
        ),
        "config_setting": attr.label(
            doc = "Optional config_setting target to select this environment.",
        ),
        "_tool": attr.label(
            default = Label("//pycross/private/tools:target_environment_generator"),
            cfg = "exec",
            executable = True,
        ),
    },
)

def repo_batch_create_target_environments(rctx, env_settings_list):
    """
    Create many target environment JSON files.

    Args:
      rctx: repository_ctx
      env_settings_list: a list of dicts containing fields described in target_environment_generator.py's Input.
    """

    env_file = rctx.path("_env_input.json")
    rctx.file(env_file, json.encode(env_settings_list))

    exec_internal_tool(
        rctx,
        Label("//pycross/private/tools:target_environment_generator.py"),
        ["batch-create", "--input", str(env_file)],
    )

    rctx.delete(env_file)
