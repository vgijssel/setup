"""Public API for task tools."""

load("@bazel_skylib//rules:diff_test.bzl", "diff_test")
load("@pip//:requirements.bzl", "requirement")
load("@rules_task//task:defs.bzl", "cmd", "task")

def compile_pip_requirements(name, requirements_in, requirements_txt, extra_args = [], hidden_args = []):
    """Compile pip requirements using pip-compile.

    Args:
        name: Name of the target
        requirements_in: Input requirements file
        requirements_txt: Output requirements file
        extra_args: Additional arguments for pip-compile
        hidden_args: Hidden arguments for pip-compile
    """
    pip_compile_name = name
    pip_compile_update_name = "{}.update".format(name)
    pip_compile_compare_name = "{}_compare".format(name)
    pip_compile_test_name = "{}_test".format(name)
    pip_compile_hidden_args = hidden_args

    pip_compile_shared_args = extra_args + [
        "--generate-hashes",
    ]

    pip_compile_header_args = ["pip-compile"] + pip_compile_shared_args + [
        requirements_in,
    ]

    pip_compile_args = pip_compile_shared_args + pip_compile_hidden_args + [
        "--output-file",
        "$REQUIREMENTS_TXT",
        requirements_in,
    ]

    task(
        name = pip_compile_name,
        deps = [
            requirement("pip-tools"),
        ],
        cmds = [
            cmd.python_entry_point("piptools.scripts.compile:cli", "$CLI_ARGS"),
        ],
    )

    # NOTE: we copy the requirements.in into the current directory so that
    # the "via" paths inside of requirements.txt only reference the requirements.in
    # We do this because inside the genrule we cannot change directory as this
    # will break all pythonpath references as those are not absolute.
    task(
        name = pip_compile_update_name,
        deps = [
            requirement("pip-tools"),
        ],
        cmds = [
            'export REQUIREMENTS_TXT="${REQUIREMENTS_TXT_OVERRIDE:-$REQUIREMENTS_TXT}"',
            cmd.shell("cp", "-bf", cmd.file(requirements_in), requirements_in),
            cmd.python_entry_point("piptools.scripts.compile:cli", *pip_compile_args),
        ],
        env = {
            "CUSTOM_COMPILE_COMMAND": " ".join(pip_compile_header_args),
            "REQUIREMENTS_IN": cmd.file(requirements_in),
            "REQUIREMENTS_TXT": cmd.file(requirements_txt),
        },
    )

    native.genrule(
        name = pip_compile_compare_name,
        outs = ["requirements.txt.compare"],
        cmd = """
        cat $(location :requirements.txt) > $@
        export REQUIREMENTS_TXT_OVERRIDE=$@
        $(location {name}) 1> /dev/null 2> /dev/null
        """.format(name = pip_compile_update_name),
        srcs = [
            requirements_txt,
        ],
        tools = [
            pip_compile_update_name,
        ],
    )

    diff_test(
        name = pip_compile_test_name,
        file1 = requirements_txt,
        file2 = pip_compile_compare_name,
    )
