load("@bazel_skylib//lib:paths.bzl", "paths")

def qcow_to_vagrant_box(name, src):
    native.genrule(
        name = name,
        outs = [
            "{}.box".format(name),
        ],
        cmd = """
        $(execpath //tools/vagrant:qcow_to_vagrant_box) $(execpath //tools/vagrant:box.ovf) $(execpath {src}) $(OUTS)
        """.format(src = src),
        srcs = [
            src,
            "//tools/vagrant:box.ovf",
        ],
        tools = [
            "//tools/vagrant:qcow_to_vagrant_box",
        ],
    )

def _vagrant_run_impl(ctx):
    env_string = ""
    for key, value in ctx.attr.env.items():
        env_string += 'export {}="{}"\n'.format(key, ctx.expand_location(value))

    vagrantfile_output = ctx.actions.declare_file("{}/Vagrantfile".format(ctx.label.name))
    ctx.actions.run(
        outputs = [vagrantfile_output],
        inputs = [ctx.file.vagrantfile],
        arguments = [ctx.file.vagrantfile.path, vagrantfile_output.path],
        executable = "cp",
        mnemonic = "CopyFile",
    )

    vagrant_runner = ctx.actions.declare_file("{}/runner.sh".format(ctx.label.name))
    ctx.actions.expand_template(
        template = ctx.file._runner_tpl,
        substitutions = {
            "{vagrant_binary}": ctx.executable.vagrant_runtime.short_path,
            "{output_dir}": paths.dirname(vagrant_runner.short_path),
            "{env_string}": env_string,
        },
        is_executable = True,
        output = vagrant_runner,
    )

    runfiles = ctx.runfiles(files = [ctx.executable.vagrant_runtime] + ctx.files.deps)

    return [DefaultInfo(
        executable = vagrant_runner,
        files = depset([vagrantfile_output]),
        runfiles = runfiles,
    )]

vagrant_run = rule(
    implementation = _vagrant_run_impl,
    executable = True,
    attrs = {
        "env": attr.string_dict(),
        "vagrant_runtime": attr.label(executable = True, cfg = "exec"),
        "vagrantfile": attr.label(mandatory = True, allow_single_file = True),
        "deps": attr.label_list(allow_files = True),
        "_runner_tpl": attr.label(
            default = Label("//tools/vagrant:runner.sh.tpl"),
            allow_single_file = True,
        ),
    },
)
