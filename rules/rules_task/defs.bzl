"""
Public API for defining tasks.
"""

load("@bazel_skylib//lib:shell.bzl", "shell")
load("@bazel_skylib//rules:expand_template.bzl", "expand_template")
load("@aspect_bazel_lib//lib:paths.bzl", "to_rlocation_path")
load("@pip//:requirements.bzl", "requirement")
load("@rules_python//python:defs.bzl", "py_binary")

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

def _visit_python(context, node):
    result = []
    for arg in node["args"]:
        result.append(_visit_method(context, arg)(context, arg))
    return result

def _visit_env(context, node):
    result = []

    for _key, value in node["env"].items():
        result.append(_visit_method(context, value)(context, value))

    return result

def _visit_defer(context, node):
    return _visit_method(context, node["node"])(context, node["node"])

def _serialize_env(context, node):
    env_string = ""

    for key, value in node["env"].items():
        env_value = _visit_method(context, value)(context, value)
        env_string += "export {}='{}'\n".format(key, env_value)

    return env_string

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

def _python_entry_point(entry_point, args):
    # Translate
    # tap_gitlab:Tap.cli
    # into
    # from tap_gitlab import Tap
    # Tap.cli()
    python_import, python_method = entry_point.split(":")
    python_class = python_method.split(".")[0]
    python_import = "from {} import {}".format(python_import, python_class)
    python_method = "{}()".format(python_method)

    python_code = """
    import sys
    {python_import}
    sys.exit({python_method})
    """.format(python_import = python_import, python_method = python_method)

    return cmd.python(python_code, *args)

def _serialize_python(context, node):
    args = " ".join(_visit_python(context, node))
    label = _executable_label_to_jinja_path(context.ctx, node["label"])

    code = """
    export TASK_ENV_FILE=$(mktemp)
    {label} {args}
    source $TASK_ENV_FILE
    rm $TASK_ENV_FILE
    unset TASK_ENV_FILE
    """.format(label = label, args = args)

    return code

def _serialize_defer(context, node):
    defer_code = _visit_method(context, node["node"])(context, node["node"])
    defer_function_name = "{}_{}".format(context.name, context.state["defer_index"])

    code = """
    function {defer_function_name} {{
    {defer_code}
    }}
    trap_add {defer_function_name} EXIT

    """.format(defer_code = defer_code, defer_function_name = defer_function_name)

    context.state["defer_index"] += 1

    return code

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
    "visit_env": lambda context, node: _serialize_env(context, node),
    "visit_defer": lambda context, node: _serialize_defer(context, node),
    "visit_shell": lambda context, node: " ".join(_visit_shell(context, node)),
    "visit_string": lambda context, node: _visit_string(context, node)["value"],
    "visit_file": lambda context, node: _file_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_files": lambda context, node: _files_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_executable": lambda context, node: _executable_label_to_jinja_path(context.ctx, _visit_executable(context, node)["label"]),
    "visit_python": lambda context, node: _serialize_python(context, node),
}

_data_collector = {
    "visit_root": lambda context, node: _compact(_flatten(_visit_root(context, node))),
    "visit_env": lambda context, node: _compact(_flatten(_visit_env(context, node))),
    "visit_defer": lambda context, node: _visit_defer(context, node),
    "visit_shell": lambda context, node: _visit_shell(context, node),
    "visit_string": lambda context, node: None,
    "visit_file": lambda context, node: _visit_file(context, node)["label"],
    "visit_files": lambda context, node: _visit_files(context, node)["label"],
    "visit_executable": lambda context, node: _visit_executable(context, node)["label"],
    "visit_python": lambda context, node: node["label"],
}

_target_generator = {
    "visit_root": lambda context, node: _visit_root(context, node),
    "visit_env": lambda context, node: _visit_env(context, node),
    "visit_defer": lambda context, node: _visit_defer(context, node),
    "visit_shell": lambda context, node: None,
    "visit_string": lambda context, node: None,
    "visit_file": lambda context, node: None,
    "visit_files": lambda context, node: None,
    "visit_executable": lambda context, node: None,
    "visit_python": lambda context, node: _generate_py_binary_cmd(context, node),
}

def _visitor_context(ctx, visitor, name):
    return struct(
        ctx = ctx,
        visitor = visitor,
        name = name,
        state = {
            "target_index": 0,
            "defer_index": 0,
        },
    )

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file, ctx.file._rlocation] + ctx.files.data)
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

    script = "#!/usr/bin/env bash"

    script += """
set +e

# --- begin runfiles.bash initialization v2 ---
# Copy-pasted from the Bazel Bash runfiles library v2.
set -uo pipefail; f=bazel_tools/tools/bash/runfiles/runfiles.bash
source "${RUNFILES_DIR:-/dev/null}/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$(dirname $(pwd))/MANIFEST" | cut -f2- -d' ')" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "${RUNFILES_MANIFEST_FILE:-/dev/null}" | cut -f2- -d' ')" 2>/dev/null || \
  source "$0.runfiles/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.exe.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  { echo>&2 "ERROR: cannot find $f"; exit 1; }; f=; set -e
# --- end runfiles.bash initialization v2 ---

set -Eeou pipefail
    """

    script += """
    runner=$(rlocation {runner})
    instructions=$(rlocation {instructions})
    exec $runner $instructions "$@"
    """.format(
        runner = to_rlocation_path(ctx, runner_exe),
        instructions = to_rlocation_path(ctx, instructions_file),
    )

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

_shared_attrs = {
    "cmd_json": attr.string(mandatory = True),
    "cwd": attr.string(),
    "deps": attr.label_list(cfg = "exec"),  # TODO: only allow Python here?
    "data": attr.label_list(allow_files = True, cfg = "exec"),
    "runner": attr.label(
        mandatory = True,
        cfg = "exec",
        executable = True,
    ),
    "_rlocation": attr.label(allow_single_file = True, default = Label("@bazel_tools//tools/bash/runfiles")),
}

def _task_rule_prep(kwargs, testonly = False):
    if "cmd_json" in kwargs:
        fail('The "cmd_json" attribute is reserved for internal use.')

    cmds = kwargs.pop("cmds")
    env = kwargs.pop("env", {})
    deps = kwargs.pop("deps", [])
    data = kwargs.pop("data", [])
    name = kwargs["name"]

    runner_name = "{}_runner".format(name)

    py_binary(
        name = runner_name,
        main = "@rules_task//:runner.py",
        srcs = ["@rules_task//:runner.py"],
        testonly = testonly,
        deps = [
            requirement("bazel-runfiles"),
            requirement("jinja2"),
        ] + deps,
    )

    cmds = cmd.root([cmd.env(env)] + cmds)

    # Generate targets and set labels for all the nodes
    visitor_context = _visitor_context(None, _target_generator, name)
    _visit(visitor_context, cmds)

    # Collect all the labels from the nodes
    visitor_context = _visitor_context(None, _data_collector, name)
    cmd_data = _visit(visitor_context, cmds) + data
    cmd_json = json.encode(cmds)
    return runner_name, cmd_data, cmd_json

_task = rule(
    implementation = _task_impl,
    executable = True,
    attrs = _shared_attrs,
)

_task_test = rule(
    implementation = _task_impl,
    executable = True,
    attrs = _shared_attrs,
    test = True,
)

def task(**kwargs):
    runner_name, data, cmd_json = _task_rule_prep(kwargs)

    _task(
        runner = runner_name,
        data = data,
        cmd_json = cmd_json,
        **kwargs
    )

def task_test(**kwargs):
    runner_name, data, cmd_json = _task_rule_prep(kwargs, testonly = True)

    _task_test(
        runner = runner_name,
        data = data,
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

        if "defer" in arg:
            arg = cmd.defer(arg["defer"])

        result.append(arg)

    return result

def _wrap_env(env):
    for key, value in env.items():
        if type(value) == "string":
            env[key] = cmd.string(value)
    return env

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

def _wrap_python_args(args):
    result = []

    for arg in args:
        # Turn all reguluar string nodes into a cmd.string nodes
        if type(arg) == "string":
            arg = cmd.string(arg)

        if type(arg) != "dict":
            fail("Argument passed to python_entry_point should either be string or dict, got value '{}' of type {}".format(arg, type(arg)))

        result.append(arg)

    return result

def _wrap_defer(node):
    if type(node) == "string":
        node = cmd.string(node)

    return node

cmd = struct(
    root = lambda args: {
        "type": "root",
        "args": _wrap_root_args(args),
    },
    env = lambda env: {
        "type": "env",
        "env": _wrap_env(env),
    },
    defer = lambda node: {
        "type": "defer",
        "node": _wrap_defer(node),
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
    python = lambda code, *args: {
        "type": "python",
        "code": code,
        "args": _wrap_python_args(args),
        "label": None,
    },
    python_entry_point = lambda entry_point, *args: _python_entry_point(entry_point, args),
)

def py_binary_cmd(name, code):
    main_name = "{}_main".format(name)
    main_name_file = "{}.py".format(main_name)

    expand_template(
        name = main_name,
        template = "@rules_task//:py_binary_cmd_main.tpl.py",
        out = main_name_file,
        substitutions = {
            "{{python_code}}": code,
        },
    )

    py_binary(
        name = name,
        srcs = [main_name_file],
        main = main_name_file,
        deps = [requirement("deepdiff")],
    )
