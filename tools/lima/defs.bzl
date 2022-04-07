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
            "{limactl_binary}": ctx.attr.lima_runtime.files_to_run.executable.short_path,
            "{image_template}": template.short_path,
            "{vm_name}": ctx.label.name,
        },
        output = lima_runner,
        is_executable = True,
    )

    # Ensure the limactl binary and associated files are available when the lima_runner script
    # is being run by Bazel.
    runfiles = ctx.runfiles(files = ctx.files.lima_runtime + [template] + ctx.files.deps)

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
        "lima_runtime": attr.label(executable = True, cfg = "exec"),
    },
)

def _lima_runtime_impl(ctx):
    output_files = []
    limactl_output_file = None

    # We are copying all the files from lima to the output directory
    # and we keep the same structure as downloaded from the remote.
    # this to make sure the "share" directory is in the right place
    # relative to the limactl binary.
    for file in ctx.files.files:
        # file.owner.name is the original file name
        output_file_name = "{label}/{file_name}".format(label = ctx.label.name, file_name = file.owner.name)
        output_file = ctx.actions.declare_file(output_file_name)
        ctx.actions.run(
            outputs = [output_file],
            inputs = [file],
            arguments = [file.path, output_file.path],
            executable = "cp",
            mnemonic = "CopyFile",
        )
        output_files.append(output_file)

        if file.basename == "limactl":
            limactl_output_file = output_file

    if limactl_output_file == None:
        fail("limactl not found in the runtime")

    return [DefaultInfo(
        executable = limactl_output_file,
        files = depset(output_files),
    )]

lima_runtime = rule(
    implementation = _lima_runtime_impl,
    executable = True,
    attrs = {
        "files": attr.label(mandatory = True),
    },
)
