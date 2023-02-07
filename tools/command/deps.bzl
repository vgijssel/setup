load("@rules_python//python:pip.bzl", "pip_parse")

def deps(python_interpreter_target = None):
    pip_parse(
        name = "command-requirements",
        python_interpreter_target = python_interpreter_target,
        requirements_lock = "@//tools/command:requirements.lock",
    )
