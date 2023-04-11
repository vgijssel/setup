load("@command-requirements//:requirements.bzl", "requirement")
load("@bazel_skylib//rules:native_binary.bzl", "native_test")

def _find_executable_runfiles_path(paths, target):
    for path in paths:
        if target.endswith(path) or path.endswith(target):
            return path

    fail("Could not find runfiles path for target {} within {}".format(target, paths))

def _command_impl(ctx):
    expand_targets = [ctx.attr.command_src] + ctx.attr.data

    command_output = ctx.actions.declare_file(ctx.label.name)
    runfiles_paths = ctx.expand_location("$(rlocationpaths {})".format(ctx.attr.command_src.label), targets = [ctx.attr.command_src]).split(" ")
    executable_path = ctx.executable.command_src.path.replace(ctx.executable.command_src.root.path, "")
    executable_runfiles_path = _find_executable_runfiles_path(runfiles_paths, executable_path)

    env_string = ""

    for key, value in ctx.attr.env.items():
        expanded_value = ctx.expand_location(value, targets = expand_targets)
        env_string += "    os.environ['{}'] = jinja_render_string('{}')\n".format(key, expanded_value)

    arg_string = "["

    for arg in ctx.attr.args:
        expanded_arg = ctx.expand_location(arg, targets = expand_targets)
        arg_string += "\n'{}',".format(expanded_arg)

    arg_string += "\n]"

    ctx.actions.expand_template(
        template = ctx.file._command_tpl,
        output = command_output,
        is_executable = True,
        substitutions = {
            "{{CMD}}": executable_runfiles_path,
            "{{CWD}}": ctx.expand_location(ctx.attr.cwd, targets = expand_targets),
            "{{BEFORE_CMD}}": ctx.expand_location(ctx.attr.before_cmd, targets = expand_targets),
            "{{AFTER_CMD}}": ctx.expand_location(ctx.attr.after_cmd, targets = expand_targets),
            "{{ENV}}": env_string,
            "{{ARGS}}": arg_string,
        },
    )

    return [DefaultInfo(
        files = depset([command_output]),
    )]

_command = rule(
    implementation = _command_impl,
    attrs = {
        "command_src": attr.label(
            mandatory = True,
            allow_files = True,
            executable = True,
            cfg = "target",
        ),
        "cwd": attr.string(mandatory = False),
        "args": attr.string_list(mandatory = False),
        "data": attr.label_list(allow_files = True),
        "env": attr.string_dict(),
        "before_cmd": attr.string(mandatory = False, default = "pass"),
        "after_cmd": attr.string(mandatory = False, default = "pass"),
        "_command_tpl": attr.label(
            default = Label("//tools/command:command.py.tpl"),
            allow_single_file = True,
        ),
    },
)

# The goal we want to achieve is to create a directory structure a tool expects, relative to the root of some config file.
# For Meltano this is "meltano.yml", for Tilt this is "Tiltfile", for Pulumi this is "Pulumi.yaml" and so on.
# All regular files linked in a command are symlinked with their origin package structure,
# This means if we "cd" to the root config file inside the runfiles dir, all the files are relative to that root config as if they are in the workspace.
# For other deps we can create a mapping starting from root config to the dep, currently this is a custom build rule for meltano.

# Setup the args to pass to the command
# TODO: need to escape the data that is passed in args, env so we can use any sort of quoting without breaking the script
# TODO: ensure right indentiation in before_cmd and after_cmd
# TODO: if after_cmd is not set, don't use subprocess.run but os.execvpe(...)
# TODO: implement similar behavior as multirun, ability to run multiple commands?
def command(name, command_src, cwd = None, args = [], deps = [], data = [], env = {}, before_cmd = None, after_cmd = None, **kwargs):
    command_name = "{}_command.py".format(name)

    _command(
        name = command_name,
        command_src = command_src,
        cwd = cwd,
        args = args,
        data = data,
        env = env,
        before_cmd = before_cmd,
        after_cmd = after_cmd,
        **kwargs
    )

    native.py_binary(
        name = name,
        srcs = [
            command_name,
        ],
        main = command_name,
        data = [
            command_src,
        ] + data,
        deps =  [requirement("bazel-runfiles"), requirement("jinja2")] + deps,
        **kwargs
    )

def command_test(name, tags = [], size = None, **kwargs):
    command_name = "{}_command".format(name)

    command(
        name = command_name,
        tags = tags,
        testonly = True,
        **kwargs
    )

    native_test(
        name = name,
        src = command_name,
        out = "{}.out".format(name),
        tags = tags,
        size = size,
    )
