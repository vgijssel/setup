load("@command_deps//:requirements.bzl", "all_requirements")

def _find_executable_runfiles_path(paths, target):
    for path in paths:
        if target.endswith(path):
            return path

    fail("no friendo")

def _command_impl(ctx):
    # TODO: cannot we input the short_path path into the rlocationpath method to get the right answer? That way we don't have to search
    command_output = ctx.actions.declare_file(ctx.label.name)
    runfiles_paths = ctx.expand_location("$(rlocationpaths {})".format(ctx.attr.cmd.label), targets = [ctx.attr.cmd]).split(" ")
    executable_path = ctx.executable.cmd.path.replace(ctx.executable.cmd.root.path, "")
    executable_runfiles_path = _find_executable_runfiles_path(runfiles_paths, executable_path)

    ctx.actions.expand_template(
        template = ctx.file._command_tpl,
        output = command_output,
        is_executable = True,
        substitutions = {
            "{{CMD}}": executable_runfiles_path,
            "{{CWD}}": ctx.expand_location(ctx.attr.cwd, targets = [ctx.attr.cmd] + ctx.attr.data),
            # TODO: maybe correct indent the content of before_script?
            "{{BEFORE_SCRIPT}}": ctx.expand_location(ctx.attr.before_script, targets = [ctx.attr.cmd] + ctx.attr.data),
        },
    )

    return [DefaultInfo(
        files = depset([command_output]),
    )]

# Are we generating a template
# And putting that into a py_binary?
_command = rule(
    implementation = _command_impl,
    attrs = {
        "cmd": attr.label(
            mandatory = True,
            allow_files = True,
            executable = True,
            cfg = "target",
        ),
        "cwd": attr.string(mandatory = False),
        "data": attr.label_list(allow_files = True),
        "env": attr.string_dict(),
        "before_script": attr.string(mandatory = False, default = "pass"),
        "_command_tpl": attr.label(
            default = Label("//tools/command:command.py.tpl"),
            allow_single_file = True,
        ),
    },
)

# TODO: in genrule "cmd" stands for an inline script, let's use that convention as well?
#       before_cmd - inline script before cmd
#       command_src - source of the command (either file or target)
#
# using runfiles during "run" results in absolute path to file in the workspace directory (not inside the runfiles dir) Runfiles mode is RUNFILES_MANIFEST_FILE
# using runfiles during "build" results in absolute path to file in the runfiles dir. Runfiles mode is RUNFILES_DIR
# Is there a bazel setting that maybe changes the behaviour of the runfiles manifest file?

# The goal we want to achieve is to create a directory structure a tool expects, relative to the root of some config file.
# For Meltano this is "meltano.yml", for Tilt this is "Tiltfile", for Pulumi this is "Pulumi.yaml" and so on.
# All regular files linked in command are symlinked with their origin package structure,
# This means if we "cd" to the root config file inside the runfiles dir, all the files are relative to that root config as if they are in the workspace.
# For other deps we can create a mapping starting from root config to the dep, currently this is a custom build rule for meltano
# but maybe this can be generalized for other tools.
def command(name, cmd, cwd = None, data = [], env = {}, before_script = None):
    command_name = "{}_command.py".format(name)

    _command(
        name = command_name,
        cmd = cmd,
        cwd = cwd,
        data = data,
        env = env,
        before_script = before_script,
    )

    native.py_binary(
        name = name,
        srcs = [
            command_name,
        ],
        main = command_name,
        data = [
            cmd,
        ] + data,
        deps = ["@rules_python//python/runfiles"] + all_requirements,
    )
