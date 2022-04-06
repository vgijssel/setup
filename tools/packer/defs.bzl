def _packer_image_impl(ctx):
    packer_info = ctx.toolchains["//tools/packer:toolchain_type"].packer_info
    template_dir = "{}.templates".format(ctx.label.name)
    output_files = []

    # Copy all of the template files to the same directory
    # so we can point packer to a folder instead to combine multiple templates.
    for template in ctx.files.templates:
        file_name = "{dir}/{file}".format(dir = template_dir, file = template.basename)
        output_file = ctx.actions.declare_file(file_name)
        ctx.actions.run(
            outputs = [output_file],
            inputs = [template],
            arguments = [template.path, output_file.path],
            executable = "cp",
            mnemonic = "CopyFile",
        )
        output_files.append(output_file)

    # stores the full path for the runtime to the directory containing the template files
    template_dir_path = output_files[0].dirname

    # Create a wrapper for packer so we can set
    # necessary binaries in the environment PATH.
    packer_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    ctx.actions.expand_template(
        template = ctx.file._runner_tpl,
        substitutions = {
            "{packer_binary}": packer_info.packer_binary.files_to_run.executable.path,
        },
        output = packer_runner,
        is_executable = True,
    )

    # Convert the passed variables to environment variables
    # replacing possible $(location ...) statements with their actual values.
    # Also set the "output_image" variable to let packer know
    # where Bazel expects the output image to be.
    env = {}
    for key, value in ctx.attr.variables.items():
        env["PKR_VAR_{}".format(key)] = ctx.expand_location(value)

    for key, value in ctx.attr.env.items():
        env[key] = value
    env["PKR_VAR_output_image"] = ctx.outputs.output_image.path

    args = ["build", "-debug", "-force", "-on-error=ask", template_dir_path]

    ctx.actions.run(
        inputs = output_files + [packer_info.packer_binary.files_to_run.executable] + ctx.files.deps,
        outputs = [ctx.outputs.output_image],
        arguments = args,
        progress_message = "Building packer image: %s" % ctx.outputs.output_image.path,
        executable = packer_runner,
        env = env,
    )

    return [DefaultInfo(
        files = depset([ctx.outputs.output_image]),
    )]

packer_image = rule(
    implementation = _packer_image_impl,
    attrs = {
        "templates": attr.label_list(mandatory = True, allow_files = True),
        "deps": attr.label_list(allow_files = True),
        "variables": attr.string_dict(),
        "env": attr.string_dict(),
        "output_image": attr.output(mandatory = True),
        "_runner_tpl": attr.label(
            default = Label("//tools/packer:runner.sh.tpl"),
            allow_single_file = True,
        ),
    },
    toolchains = ["//tools/packer:toolchain_type"],
)
