"""1Password integration helpers for Bazel."""

load("@rules_task//task:defs.bzl", "cmd")

def secrets(data):
    """Generates a command to load secrets from 1Password into environment variables.

    Args:
        data: Dict mapping environment variable names to 1Password item paths
    """
    json_data = json.encode(data)

    code = """
    import json
    import os
    from tools.onepassword.lib import get_item_path

    json_data = '{json_data}'
    data = json.loads(json_data)

    for key, value in data.items():
        os.environ[key] = get_item_path(value)

    """.format(json_data = json_data)

    return cmd.python(code)
