"""
Public API for defining tasks.
"""

load("@bazel_skylib//lib:shell.bzl", "shell")
load("@aspect_bazel_lib//lib:paths.bzl", "to_rlocation_path")

def _visit(ctx, visitor, node):
    return _visit_method(node, visitor)(ctx, visitor, node)

def _visit_method(node, visitor):
    if type(node) != "dict":
        fail("Node should be a dict, got value '{}' of type {}".format(node, type(node)))

    method_key = "visit_" + node["type"]

    if method_key not in visitor:
        fail("Unknown node type: %s" % node["type"])

    return visitor[method_key]

def _visit_root(ctx, visitor, node):
    result = []
    for item in node["args"]:
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

def _visit_files(_ctx, _visitor, node):
    return node

def _visit_executable(_ctx, _visitor, node):
    return node

def _visit_python_entry_point(ctx, visitor, node):
    print(node)
    result = []

    for arg in node["args"]:
        result.append(_visit_method(arg, visitor)(ctx, visitor, arg))
    return result

def _file_label_to_jinja_path(ctx, label):
    rlocation = ctx.expand_location("$(rlocationpath {})".format(label), ctx.attr.data)
    rlocation = "{{ rlocation_to_path('%s') }}" % rlocation
    return rlocation

def _files_label_to_jinja_path(ctx, label):
    rlocations = ctx.expand_location("$(rlocationpaths {})".format(label), ctx.attr.data).split(" ")

    result = []

    for rlocation in rlocations:
        result.append("{{ rlocation_to_path('%s') }}" % rlocation)

    return " ".join(result)

def _executable_label_to_jinja_path(ctx, label):
    target_matches_label = []

    for d in ctx.attr.data:
        if d.label == Label(label):
            target_matches_label.append(d)

    if len(target_matches_label) == 0:
        fail("Could not find target matching label: %s" % label)

    if len(target_matches_label) > 1:
        fail("Found multiple targets (%s) matching label: %s" % len(label), label)

    target = target_matches_label[0]
    executable = target[DefaultInfo].files_to_run.executable
    rlocation = to_rlocation_path(ctx, executable)
    rlocation = "{{ rlocation_to_path('%s') }}" % rlocation
    return rlocation

def _flatten(list):
    result = []

    for item in list:
        if type(item) == "list":
            result = result + item
        else:
            result.append(item)

    return result

def _compact(list):
    return [item for item in list if item != None]

_serializer = {
    "visit_root": lambda ctx, visitor, node: _visit_root(ctx, visitor, node),
    "visit_shell": lambda ctx, visitor, node: " ".join(_visit_shell(ctx, visitor, node)),
    "visit_string": lambda ctx, visitor, node: _visit_string(ctx, visitor, node)["value"],
    "visit_file": lambda ctx, visitor, node: _file_label_to_jinja_path(ctx, _visit_file(ctx, visitor, node)["label"]),
    "visit_files": lambda ctx, visitor, node: _files_label_to_jinja_path(ctx, _visit_file(ctx, visitor, node)["label"]),
    "visit_executable": lambda ctx, visitor, node: _executable_label_to_jinja_path(ctx, _visit_executable(ctx, visitor, node)["label"]),
    "visit_python_entry_point": lambda ctx, visitor, node: " ".join([node["entry_point"]] + _visit_shell(ctx, visitor, node)),
}

_data_collector = {
    "visit_root": lambda ctx, visitor, node: _flatten(_visit_root(ctx, visitor, node)),
    "visit_shell": lambda ctx, visitor, node: _compact(_visit_shell(ctx, visitor, node)),
    "visit_string": lambda ctx, visitor, node: None,
    "visit_file": lambda ctx, visitor, node: _visit_file(ctx, visitor, node)["label"],
    "visit_files": lambda ctx, visitor, node: _visit_files(ctx, visitor, node)["label"],
    "visit_executable": lambda ctx, visitor, node: _visit_executable(ctx, visitor, node)["label"],
    "visit_python_entry_point": lambda ctx, visitor, node: _compact(_visit_python_entry_point(ctx, visitor, node)),
}

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file] + ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + ctx.attr.data + ctx.attr.deps)
    ])

    cmd_nodes = json.decode(ctx.attr.cmd_json)
    cmds = _visit(ctx, _serializer, cmd_nodes)

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
        "deps": attr.label_list(cfg = "exec"),  # TODO: only allow Python here?
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

    cmds = cmd.root(cmds)
    cmd_data = _visit(None, _data_collector, cmds)
    cmd_json = json.encode(cmds)

    _task(
        data = data + cmd_data,
        cmd_json = cmd_json,
        **kwargs
    )

def _wrap_root_args(args):
    result = []

    for arg in args:
        # Turn all reguluar string nodes into a cmd.shell nodes
        if type(arg) == "string":
            arg = cmd.shell(arg)

        if type(arg) != "dict":
            fail("Argument passed to root should either be string or dict, got value '{}' of type {}".format(arg, type(arg)))

        result.append(arg)

    return result

def _wrap_shell_args(args):
    result = []

    for arg in args:
        # Turn all reguluar string nodes into a cmd.string nodes
        if type(arg) == "string":
            arg = cmd.string(arg)

        if type(arg) != "dict":
            fail("Argument passed to shell should either be string or dict, got value '{}' of type {}".format(arg, type(arg)))

        result.append(arg)

    return result

def _wrap_python_entry_point_args(args):
    result = []

    for arg in args:
        # Turn all reguluar string nodes into a cmd.string nodes
        if type(arg) == "string":
            arg = cmd.string(arg)

        if type(arg) != "dict":
            fail("Argument passed to python_entry_point should either be string or dict, got value '{}' of type {}".format(arg, type(arg)))

        result.append(arg)

    return result

cmd = struct(
    root = lambda args: {
        "type": "root",
        "args": _wrap_root_args(args),
    },
    shell = lambda *args: {
        "type": "shell",
        "args": _wrap_shell_args(args),
    },
    file = lambda label: {
        "type": "file",
        "label": str(native.package_relative_label(label)),
    },
    files = lambda label: {
        "type": "files",
        "label": str(native.package_relative_label(label)),
    },
    executable = lambda label: {
        "type": "executable",
        "label": str(native.package_relative_label(label)),
    },
    string = lambda string: {
        "type": "string",
        "value": string,
    },
    python_entry_point = lambda entry_point, *args: {
        "type": "python_entry_point",
        "entry_point": entry_point,
        "args": _wrap_python_entry_point_args(args),
    },
)
