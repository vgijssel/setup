load("@aspect_bazel_lib//lib:base64.bzl", "base64")
load("@aspect_bazel_lib//lib:paths.bzl", "to_rlocation_path")
load("@bazel_skylib//lib:new_sets.bzl", "sets")
load("@bazel_skylib//lib:shell.bzl", "shell")
load("@bazel_skylib//rules:native_binary.bzl", "native_test")
load("@pip//:requirements.bzl", "requirement")
load("@rules_python//python:defs.bzl", "py_binary")
load(":cmd.bzl", "cmd")
load(":py_binary_cmd.bzl", "py_binary_cmd")
load(":utils.bzl", "fq_label")

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

def _visit_env_file(context, node):
    return _visit_method(context, node["node"])(context, node["node"])

def _serialize_env(context, node):
    env_string = ""

    for key, value in node["env"].items():
        env_value = _visit_method(context, value)(context, value)
        env_string += "export {}=${}\n".format(key, shell.quote(env_value))

    return env_string

def _serialize_env_file(context, node):
    node = _visit_method(context, node["node"])(context, node["node"])

    return """
    source {node}
    """.format(node = node)

def _jinja_rlocation(rlocation):
    return '{{ rlocation_to_path("%s") }}' % rlocation

def _file_label_to_jinja_path(ctx, label):
    rlocation = ctx.expand_location("$(rlocationpath {})".format(label), ctx.attr.data)
    rlocation = _jinja_rlocation(rlocation)
    return rlocation

def _files_label_to_jinja_path(ctx, label):
    rlocations = ctx.expand_location("$(rlocationpaths {})".format(label), ctx.attr.data).split(" ")

    result = []

    for rlocation in rlocations:
        result.append(_jinja_rlocation(rlocation))

    return " ".join(result)

def _file_to_jinja_path(ctx, file):
    rlocation = to_rlocation_path(ctx, file)
    return _jinja_rlocation(rlocation)

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
    return _jinja_rlocation(rlocation)

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
    node["label"] = fq_label(target_name)

def _set_use_info_file(context):
    context.state["info_file"] = True

def _get_use_info_file(context):
    return context.state.get("info_file", False)

def _set_use_version_file(context):
    context.state["version_file"] = True

def _get_use_version_file(context):
    return context.state.get("version_file", False)

_serializer = {
    "visit_defer": lambda context, node: _serialize_defer(context, node),
    "visit_env": lambda context, node: _serialize_env(context, node),
    "visit_env_file": lambda context, node: _serialize_env_file(context, node),
    "visit_executable": lambda context, node: _executable_label_to_jinja_path(context.ctx, _visit_executable(context, node)["label"]),
    "visit_file": lambda context, node: _file_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_files": lambda context, node: _files_label_to_jinja_path(context.ctx, _visit_file(context, node)["label"]),
    "visit_info_file": lambda context, node: _file_to_jinja_path(context.ctx, context.info_file),
    "visit_python": lambda context, node: _serialize_python(context, node),
    "visit_root": lambda context, node: _visit_root(context, node),
    "visit_shell": lambda context, node: " ".join(_visit_shell(context, node)),
    "visit_string": lambda context, node: _visit_string(context, node)["value"],
    "visit_version_file": lambda context, node: _file_to_jinja_path(context.ctx, context.version_file),
}

_data_collector = {
    "visit_defer": lambda context, node: _visit_defer(context, node),
    "visit_env": lambda context, node: _compact(_flatten(_visit_env(context, node))),
    "visit_env_file": lambda context, node: _visit_env_file(context, node),
    "visit_executable": lambda context, node: _visit_executable(context, node)["label"],
    "visit_file": lambda context, node: _visit_file(context, node)["label"],
    "visit_files": lambda context, node: _visit_files(context, node)["label"],
    "visit_info_file": lambda context, node: None,
    "visit_python": lambda context, node: _compact(_flatten(_visit_python(context, node))) + [node["label"]],
    "visit_root": lambda context, node: _compact(_flatten(_visit_root(context, node))),
    "visit_shell": lambda context, node: _visit_shell(context, node),
    "visit_string": lambda context, node: None,
    "visit_version_file": lambda context, node: None,
}

_target_generator = {
    "visit_defer": lambda context, node: _visit_defer(context, node),
    "visit_env": lambda context, node: _visit_env(context, node),
    "visit_env_file": lambda context, node: _visit_env_file(context, node),
    "visit_executable": lambda context, node: None,
    "visit_file": lambda context, node: None,
    "visit_files": lambda context, node: None,
    "visit_info_file": lambda context, node: _set_use_info_file(context),
    "visit_python": lambda context, node: _generate_py_binary_cmd(context, node),
    "visit_root": lambda context, node: _visit_root(context, node),
    "visit_shell": lambda context, node: _visit_shell(context, node),
    "visit_string": lambda context, node: None,
    "visit_version_file": lambda context, node: _set_use_version_file(context),
}

def _visitor_context(ctx, visitor, name, info_file = None, version_file = None):
    return struct(
        ctx = ctx,
        visitor = visitor,
        name = name,
        state = {
            "defer_index": 0,
            "target_index": 0,
        },
        info_file = info_file,
        version_file = version_file,
    )

def _task_impl(ctx):
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in (ctx.attr.data + ctx.attr.deps)
    ])

    extra_files = []
    info_out_file = None
    version_out_file = None

    if ctx.attr.stamp_stable:
        info_out_file = ctx.actions.declare_file("{}_info_file.out".format(ctx.label.name))
        ctx.actions.run(
            outputs = [info_out_file],
            inputs = [ctx.info_file] + runfiles.files.to_list(),
            arguments = [ctx.info_file.path, info_out_file.path],
            executable = ctx.executable._dotenv_convert,
            env = {
                "cmd_json": ctx.attr.cmd_json,
            },
        )

        extra_files.append(info_out_file)

    if ctx.attr.stamp_volatile:
        version_out_file = ctx.actions.declare_file("{}_version_file.out".format(ctx.label.name))
        ctx.actions.run(
            outputs = [version_out_file],
            inputs = [ctx.version_file] + runfiles.files.to_list(),
            arguments = [ctx.version_file.path, version_out_file.path],
            executable = ctx.executable._dotenv_convert,
            env = {
                "cmd_json": ctx.attr.cmd_json,
            },
        )

        extra_files.append(version_out_file)

    extra_runfiles = ctx.runfiles(files = extra_files)
    runfiles = runfiles.merge(extra_runfiles)

    cmd_nodes = json.decode(ctx.attr.cmd_json)
    visitor_context = _visitor_context(ctx, _serializer, ctx.label.name, info_out_file, version_out_file)
    cmds = _visit(visitor_context, cmd_nodes)

    instructions = {
        "cmds": cmds,
        "workspace": ctx.workspace_name,
    }

    instructions = base64.encode(
        data = json.encode(instructions),
    )

    script = """
import json
import base64
from task.private.runner import main

INSTRUCTIONS = \"\"\"
{instructions}
\"\"\"

instructions = base64.b64decode(INSTRUCTIONS)
instructions = json.loads(instructions)

main(instructions)
    """.format(
        instructions = instructions,
    )

    ctx.actions.write(
        output = out_file,
        content = script,
    )

    return [
        DefaultInfo(
            files = depset([out_file]),
            runfiles = runfiles,
        ),
    ]

_task = rule(
    implementation = _task_impl,
    attrs = {
        "cmd_json": attr.string(mandatory = True),
        "data": attr.label_list(allow_files = True, cfg = "target"),
        # cfg = "target" makes sure the deps, data and runner use the target platform toolchain
        # in case of Python this means we can leverage an alternative toolchain for example for inside a container.
        "deps": attr.label_list(cfg = "target"),  # TODO: only allow Python here?
        "stamp_stable": attr.bool(default = False),
        "stamp_volatile": attr.bool(default = False),
        # cfg = "exec" makes sure the dotenv_convert target is built with the host toolchain
        "_dotenv_convert": attr.label(default = Label("//task/private:dotenv_convert"), executable = True, cfg = "exec"),
    },
)

def _task_rule_prep(name, kwargs, testonly = False):
    if "cmd_json" in kwargs:
        fail('The "cmd_json" attribute is reserved for internal use.')

    cmds = kwargs.pop("cmds")
    env = kwargs.pop("env", {})
    deps = kwargs.pop("deps", [])
    cwd = cmd.shell("cd", kwargs.pop("cwd", "$PWD"))
    data = kwargs.pop("data", [])
    stamp_stable = kwargs.pop("stamp_stable", False)
    stamp_volatile = kwargs.pop("stamp_volatile", False)
    root_nodes = []

    # Convenience keyword args to add the info_file and version_file to the task
    if stamp_stable:
        root_nodes.append(cmd.env_file(cmd.info_file()))

    if stamp_volatile:
        root_nodes.append(cmd.env_file(cmd.version_file()))

    root_nodes.append(cmd.env(env))
    root_nodes.append(cwd)

    cmds = cmd.root(root_nodes + cmds)

    # Generate targets and set labels for all the nodes
    visitor_context = _visitor_context(None, _target_generator, name)
    _visit(visitor_context, cmds)

    # Collect stamp_stable boolean from the AST, should be enabled if any info_file is used
    ast_stamp_stable = _get_use_info_file(visitor_context)
    ast_stamp_volatile = _get_use_version_file(visitor_context)

    if stamp_stable and not ast_stamp_stable:
        fail("`stamp_stable` is set to True, but no info_file is used in the task")

    if stamp_volatile and not ast_stamp_volatile:
        fail("`stamp_volatile` is set to True, but no version_file is used in the task")

    # Collect all the labels from the nodes
    visitor_context = _visitor_context(None, _data_collector, name)

    cmd_data = _visit(visitor_context, cmds) + data

    # make sure we de-duplicate the labels
    cmd_data = sets.to_list(sets.make(cmd_data))

    cmd_json = json.encode(cmds)

    script_name = "{}_runner.py".format(name)

    _task(
        name = script_name,
        data = cmd_data,
        cmd_json = cmd_json,
        stamp_stable = ast_stamp_stable,
        stamp_volatile = ast_stamp_volatile,
    )

    py_binary(
        name = name,
        main = script_name,
        srcs = [script_name, Label("//task/private:runner.py")],
        testonly = testonly,
        deps = [
            requirement("bazel-runfiles"),
            requirement("jinja2"),
        ] + deps,
        **kwargs
    )

def task(**kwargs):
    name = kwargs.pop("name")
    _task_rule_prep(name, kwargs)

def task_test(size = None, timeout = None, flaky = False, shard_count = None, local = False, **kwargs):
    name = kwargs.pop("name")
    out = "{}.out".format(name)
    task_name = "{}_task".format(name)

    _task_rule_prep(task_name, kwargs, testonly = True)

    native_test(
        name = name,
        src = task_name,
        out = out,
        size = size,
        timeout = timeout,
        flaky = flaky,
        shard_count = shard_count,
        local = local,
        **kwargs
    )
