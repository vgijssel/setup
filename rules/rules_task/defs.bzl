load("@bazel_skylib//lib:shell.bzl", "shell")

def _callback_with_results(node, parent, callback):
    callback_result = callback(node, parent)

    if type(callback_result) == "list":
        return callback_result
    elif callback_result != None:
        return [callback_result]
    else:
        return []

def _iterate(tree, callback):
    results = []

    for node in tree:
        if type(node) == "string":
            node = cmd.shell(node)

        if type(node) != "dict":
            fail("Unknown command type: %s" % type(node))

        results = results + _callback_with_results(node, None, callback)

        if node["type"] == "shell":
            for arg in node["args"]:
                if type(arg) == "string":
                    arg = cmd.string(arg)

                if type(arg) != "dict":
                    fail("Unknown command arg type: %s" % type(arg))

                if arg["type"] in ["file", "string"]:
                    results = results + _callback_with_results(arg, node, callback)
                else:
                    fail("Child level nodes can only be of type 'file' or 'string'. Given: %s" % arg["type"])

        else:
            fail("Top level nodes can only be of type 'shell'. Given: %s" % node["type"])

    return results

# TODO: replace with aspect skylib implementation
# def _rlocation_path(ctx, file):
#     """Produce the rlocation lookup path for the given file.
#     See https://github.com/bazelbuild/bazel-skylib/issues/303.
#     """
#     if file.short_path.startswith("../"):
#         return file.short_path[3:]
#     else:
#         return ctx.workspace_name + "/" + file.short_path

# Given: string / file / shell node
def _serialize_cmd(ctx, node, parent):
    result = []

    if node["type"] == "file":
        result.append(ctx.expand_location("$(rlocationpath {})".format(node["label"]), ctx.attr.data))

    elif node["type"] == "string":
        result.append(node["value"])

    elif node["type"] == "shell":
        pass

    else:
        fail("Unknown command node to serialize: %s" % node["type"])

    if parent == None:
        result.append("\n")
    else:
        result.append(" ")

    return result

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file] + ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + ctx.attr.data)
    ])

    cmd_nodes = json.decode(ctx.attr.cmd_json)
    cmds = _iterate(cmd_nodes, lambda node, parent: _serialize_cmd(ctx, node, parent))

    print(cmds)

    runner_exe = ctx.executable._runner
    instructions = {
        "cmds": cmds,
        "workspace": ctx.workspace_name,
        "cwd": ctx.attr.cwd,
    }

    ctx.actions.write(
        output = instructions_file,
        content = json.encode(instructions),
    )

    script = "#!/usr/bin/env bash\n"
    script += 'exec ./%s %s "$@"\n' % (shell.quote(runner_exe.short_path), shell.quote(instructions_file.short_path))

    ctx.actions.write(
        output = out_file,
        content = script,
        is_executable = True,
    )

    return [
        DefaultInfo(
            executable = out_file,
            files = depset([out_file, instructions_file]),
            runfiles = runfiles,
        ),
    ]

_task = rule(
    implementation = _task_impl,
    executable = True,
    attrs = {
        "cmd_json": attr.string(mandatory = True),
        "cwd": attr.string(),
        "data": attr.label_list(allow_files = True, cfg = "exec"),
        "_runner": attr.label(
            default = Label("//:runner"),
            cfg = "exec",
            executable = True,
        ),
    },
)

def task(**kwargs):
    data = kwargs.pop("data", [])
    cmds = kwargs.pop("cmds")

    if "cmd_json" in kwargs:
        fail('The "cmd_json" attribute is reserved for internal use.')

    cmd_data = _iterate(cmds, lambda node, parent: node["label"] if node["type"] == "file" else None)
    cmd_json = json.encode(cmds)

    _task(
        data = data + cmd_data,
        cmd_json = cmd_json,
        **kwargs
    )

# TODO: make it faster by evaluating and validating members of shell when instantiating the "rule"!
# TODO: make more generic nodes, no type checking but assume members are present? All nodes have a data member?
cmd = struct(
    shell = lambda *args: {
        "type": "shell",
        "args": args,
    },
    file = lambda label: {
        "type": "file",
        "label": str(native.package_relative_label(label)),
    },
    string = lambda string: {
        "type": "string",
        "value": string,
    },
)
