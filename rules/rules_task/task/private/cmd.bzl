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
        "args": _wrap_root_args(args),
        "type": "root",
    },
    env = lambda env: {
        "env": _wrap_env(env),
        "type": "env",
    },
    env_file = lambda node: {
        "node": _wrap_env_file(node),
        "type": "env_file",
    },
    defer = lambda node: {
        "node": _wrap_defer(node),
        "type": "defer",
    },
    shell = lambda *args: {
        "args": _wrap_shell_args(args),
        "type": "shell",
    },
    file = lambda label: {
        "label": fq_label(label),
        "type": "file",
    },
    version_file = lambda: {
        "type": "version_file",
    },
    info_file = lambda: {
        "type": "info_file",
    },
    files = lambda label: {
        "label": fq_label(label),
        "type": "files",
    },
    executable = lambda label: {
        "label": fq_label(label),
        "type": "executable",
    },
    string = lambda string: {
        "type": "string",
        "value": string,
    },
    python = lambda code, *args: {
        "args": _wrap_python_args(args),
        "code": code,
        "label": None,
        "type": "python",
    },
    python_entry_point = lambda entry_point, *args: _python_entry_point(entry_point, args),
)
