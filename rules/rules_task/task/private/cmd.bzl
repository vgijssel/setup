load(":utils.bzl", "fq_label")

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

def _wrap_env_file(node):
    if type(node) == "string":
        node = cmd.string(node)

    return node

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

cmd = struct(
    root = lambda args: {
        "type": "root",
        "args": _wrap_root_args(args),
    },
    env = lambda env: {
        "type": "env",
        "env": _wrap_env(env),
    },
    env_file = lambda node: {
        "type": "env_file",
        "node": _wrap_env_file(node),
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
        "label": fq_label(label),
    },
    version_file = lambda: {
        "type": "version_file",
    },
    info_file = lambda: {
        "type": "info_file",
    },
    files = lambda label: {
        "type": "files",
        "label": fq_label(label),
    },
    executable = lambda label: {
        "type": "executable",
        "label": fq_label(label),
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
