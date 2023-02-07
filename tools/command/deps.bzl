load("@rules_python//python:pip.bzl", "pip_parse")
load("@python3//:defs.bzl", "interpreter")

def deps():
    pip_parse(
        name = "command-requirements",
        python_interpreter_target = interpreter,
        requirements_lock = "@//tools/command:requirements.lock",
    )
