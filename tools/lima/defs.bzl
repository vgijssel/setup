def _lima_run_impl(ctx):
    template = ctx.actions.declare_file("{}.template".format(ctx.label.name))
    substitutions = {}

    for name, value in ctx.attr.substitutions.items():
        substitutions[name] = ctx.expand_location(value)

    ctx.actions.expand_template(
        template = ctx.file.template,
        substitutions = substitutions,
        output = template,
    )

    # Create the lima runner script which can be executed by Bazel.
    lima_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    ctx.actions.expand_template(
        template = ctx.file._runner_tpl,
        substitutions = {
            "{limactl_binary}": ctx.attr._limactl_binary.files_to_run.executable.short_path,
            "{image_template}": template.short_path,
            "{vm_name}": ctx.label.name,
        },
        output = lima_runner,
        is_executable = True,
    )

    # Ensure the limactl binary is available when the lima_runner script
    # is being run by Bazel.
    runfiles = ctx.runfiles(files = [ctx.attr._limactl_binary.files_to_run.executable, template] + ctx.files.deps)

    return [DefaultInfo(
        runfiles = runfiles,
        executable = lima_runner,
    )]

lima_run = rule(
    implementation = _lima_run_impl,
    executable = True,
    attrs = {
        "template": attr.label(mandatory = True, allow_single_file = True),
        "substitutions": attr.string_dict(),
        "deps": attr.label_list(allow_files = True),
        "_runner_tpl": attr.label(
            default = Label("//tools/lima:runner.sh.tpl"),
            allow_single_file = True,
        ),
        "_limactl_binary": attr.label(default = Label("@lima//:limactl"), executable = True, cfg = "exec"),
    },
)
