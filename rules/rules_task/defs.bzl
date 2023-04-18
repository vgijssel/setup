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

def _visit_method(node, visitor):
    if type(node) != "dict":
        fail("Node should be a dict, got value '{}' of type {}".format(node, type(node)))

    method_key = "visit_" + node["type"]

    if method_key not in visitor:
        fail("Unknown node type: %s" % node["type"])

    return visitor[method_key]

def _visit_root(ctx, visitor, node):
    result = []
    for item in node:
        result.append(
            _visit_method(item, visitor)(ctx, visitor, item),
        )
    return result

def _visit_shell(ctx, visitor, node):
    result = []
    for arg in node["args"]:
        result.append(_visit_method(arg, visitor)(ctx, visitor, arg))
    return result

def _visit_string(_ctx, _visitor, node):
    return node

def _visit_file(_ctx, _visitor, node):
    return node

def _label_to_jinja_path(ctx, label):
    rlocation = ctx.expand_location("$(rlocationpath {})".format(label), ctx.attr.data)
    rlocation = "{{ rlocation_to_path('%s') }}" % rlocation
    return rlocation

_serializer = {
    "visit_shell": lambda ctx, node, visitor: " ".join(_visit_shell(ctx, node, visitor)),
    "visit_string": lambda ctx, node, visitor: _visit_string(ctx, node, visitor)["value"],
    "visit_file": lambda ctx, node, visitor: _label_to_jinja_path(ctx, _visit_file(ctx, node, visitor)["label"]),
}

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file] + ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + ctx.attr.data)
    ])

    cmd_nodes = json.decode(ctx.attr.cmd_json)
    cmds = _visit_root(ctx, _serializer, cmd_nodes)

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
