def _esphome_build_impl(ctx):
    output_dir_name = "{}_files".format(ctx.label.name)
    output_dir = ctx.actions.declare_directory(output_dir_name)

    ctx.actions.run_shell(
        outputs = [output_dir],
        tools = [ctx.executable.toolchain],
        use_default_shell_env = True,
        inputs = [ctx.file.src],
        command = """
set -e

COMPILE_DIR=$(dirname {config})/output
{esphome_toolchain} compile {config}
ls -la $COMPILE_DIR
cp -R $COMPILE_DIR/. {output_dir}
        """.format(
            output_dir = output_dir.path,
            esphome_toolchain = ctx.executable.toolchain.path,
            config = ctx.file.src.path,
        ),
    )

    runfiles = ctx.runfiles(
        files = [output_dir],
    )

    return [DefaultInfo(
        files = runfiles.files,
        runfiles = runfiles,
    )]

_esphome_build = rule(
    implementation = _esphome_build_impl,
    attrs = {
        "src": attr.label(mandatory = True, allow_single_file = True),
        "_setup_debug_flag": attr.label(
            default = Label("//:setup_debug_flag"),
        ),
        "toolchain": attr.label(
            executable = True,
            allow_files = True,
            mandatory = True,
            cfg = "exec",
        ),
    },
)

def esphome_build(**kwargs):
    return _esphome_build(
        **kwargs
    )
