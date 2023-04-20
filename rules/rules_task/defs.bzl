"""
Public API for defining tasks.
"""

load("@bazel_skylib//lib:shell.bzl", "shell")
load("@bazel_skylib//rules:write_file.bzl", "write_file")
load("@aspect_bazel_lib//lib:paths.bzl", "to_rlocation_path")
load("@pip//:requirements.bzl", "requirement")
load("@rules_python//python:defs.bzl", "py_binary")

# TODO: merge _visit and _visit_method
def _visit(context, node):
    return _visit_method(context, node)(context, node)

def _visit_method(context, node):
    if type(node) != "dict":
        fail("Node should be a dict, got value '{}' of type {}".format(node, type(node)))

    method_key = "visit_" + node["type"]

    if method_key not in context.visitor:
        fail("Unknown node type: %s" % node["type"])

    return context.visitor[method_key]

def _visit_root(context, node):
    result = []
    for item in node["args"]:
        result.append(
            _visit_method(context, item)(context, item),
        )
    return result

def _visit_shell(context, node):
    result = []
    for arg in node["args"]:
        result.append(_visit_method(context, arg)(context, arg))
    return result

def _visit_string(_context, node):
    return node

def _visit_file(_context, node):
    return node

def _visit_files(_context, node):
    return node

def _visit_executable(_context, node):
    return node

def _visit_python_entry_point(context, node):
    result = []

    for arg in node["args"]:
        result.append(_visit_method(context, arg)(context, arg))
    return result

def _visit_python(_context, node):
    return node

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

def _serialize_python_entry_point(context, node):
    args = " ".join(_visit_python_entry_point(context, node))

    # Translate
    # tap_gitlab:Tap.cli
    # into
    # from tap_gitlab import Tap
    # Tap.cli()
    entry_point = node["entry_point"]
    python_import, python_method = entry_point.split(":")
    python_class = python_method.split(".")[0]
    python_import = "from {} import {}".format(python_import, python_class)
    python_method = "{}()".format(python_method)

    python_code = """
import sys
{python_import}
sys.exit({python_method})
    """.format(python_import = python_import, python_method = python_method)

    inline_python = """
python3 - <<EOF {args}
{python_code}
EOF
    """.format(args = args, python_code = python_code)

    return inline_python

def _fq_label(string):
    return str(native.package_relative_label(string))

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

def _generate_py_binary_cmd(context, node):
    target_name = "{}_python_{}".format(context.name, context.state["target_index"])
    py_binary_cmd(
        name = target_name,
        code = node["code"],
    )
    context.state["target_index"] += 1
    node["label"] = _fq_label(target_name)

_serializer = {
    "visit_root": lambda context, node: _visit_root(context, node),
    "visit_shell": lambda context, node: " ".join(_visit_shell(context, node)),
    "visit_string": lambda context, node: _visit_string(context, node)["value"],
    "visit_file": lambda context, node: _file_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_files": lambda context, node: _files_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_executable": lambda context, node: _executable_label_to_jinja_path(context.ctx, _visit_executable(context, node)["label"]),
    "visit_python_entry_point": lambda context, node: _serialize_python_entry_point(context, node),
    "visit_python": lambda context, node: _executable_label_to_jinja_path(context.ctx, _visit_python(context, node)["label"]),
}

_data_collector = {
    "visit_root": lambda context, node: _compact(_flatten(_visit_root(context, node))),
    "visit_shell": lambda context, node: _visit_shell(context, node),
    "visit_string": lambda context, node: None,
    "visit_file": lambda context, node: _visit_file(context, node)["label"],
    "visit_files": lambda context, node: _visit_files(context, node)["label"],
    "visit_executable": lambda context, node: _visit_executable(context, node)["label"],
    "visit_python_entry_point": lambda context, node: _visit_python_entry_point(context, node),
    "visit_python": lambda context, node: _visit_python(context, node)["label"],
}

_target_generator = {
    "visit_root": lambda context, node: _visit_root(context, node),
    "visit_shell": lambda context, node: None,
    "visit_string": lambda context, node: None,
    "visit_file": lambda context, node: None,
    "visit_files": lambda context, node: None,
    "visit_executable": lambda context, node: None,
    "visit_python_entry_point": lambda context, node: None,
    "visit_python": lambda context, node: _generate_py_binary_cmd(context, node),
}

def _visitor_context(ctx, visitor, name):
    return struct(
        ctx = ctx,
        visitor = visitor,
        name = name,
        state = {
            "target_index": 0,
        },
    )

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file] + ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr.runner] + ctx.attr.data + ctx.attr.deps)
    ])

    cmd_nodes = json.decode(ctx.attr.cmd_json)
    visitor_context = _visitor_context(ctx, _serializer, ctx.label.name)
    cmds = _visit(visitor_context, cmd_nodes)

    runner_exe = ctx.executable.runner
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
        "runner": attr.label(
            mandatory = True,
            cfg = "exec",
            executable = True,
        ),
    },
)

def task(name, deps = [], **kwargs):
    data = kwargs.pop("data", [])
    cmds = kwargs.pop("cmds")
    runner_name = "{}_runner".format(name)

    py_binary(
        name = runner_name,
        main = "//:runner.py",
        srcs = ["//:runner.py"],
        deps = [
            requirement("bazel-runfiles"),
            requirement("jinja2"),
        ] + deps,
    )

    if "cmd_json" in kwargs:
        fail('The "cmd_json" attribute is reserved for internal use.')

    cmds = cmd.root(cmds)

    # Generate targets and set labels for all the nodes
    visitor_context = _visitor_context(None, _target_generator, name)
    _visit(visitor_context, cmds)

    # Collect all the labels from the nodes
    visitor_context = _visitor_context(None, _data_collector, name)
    cmd_data = _visit(visitor_context, cmds)

    print(cmd_data)

    cmd_json = json.encode(cmds)

    _task(
        runner = runner_name,
        name = name,
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
        "label": _fq_label(label),
    },
    files = lambda label: {
        "type": "files",
        "label": _fq_label(label),
    },
    executable = lambda label: {
        "type": "executable",
        "label": _fq_label(label),
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
    python = lambda code: {
        "type": "python",
        "code": code,
        "label": None,
    },
)

def py_binary_cmd(name, code):
    main_name = "{}_main".format(name)
    main_name_file = "{}.py".format(main_name)
    python_code = """
# store the current os.environ
# setup a at exit handler
# on exit compare the os.environ
# if changed print the diff

def main():
    {python_code}

if __name__ == "__main__":
    main()
""".format(python_code = code)

    write_file(
        name = main_name,
        out = main_name_file,
        content = [python_code],
    )

    py_binary(
        name = name,
        srcs = [main_name_file],
        main = main_name_file,
    )
