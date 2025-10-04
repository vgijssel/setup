import os
import subprocess

import runfiles

r = runfiles.Create()


def _runfiles_path(path):
    p = r.Rlocation(path)

    if not p:
        raise Exception("Unable to find runfile: {}".format(path))

    return p


def _run_task(name, args=[]):
    binary = _runfiles_path(os.path.join(os.environ["WORKSPACE_NAME"], "tests", name))
    return subprocess.run([binary] + args, capture_output=True)


def _get_output(name):
    output = _runfiles_path(os.path.join(os.environ["WORKSPACE_NAME"], "tests", name))

    with open(output, "r") as file:
        return file.read()


def test_hello():
    result = _run_task("hello")
    assert result.returncode == 0
    assert result.stdout.strip() == b"Hello, world!"


def test_broken():
    result = _run_task("broken")
    assert result.returncode == 1
    assert result.stdout.strip() == b""
    assert result.stderr.strip() == b"Some error!"


def test_cwd():
    result = _run_task("cwd")
    assert result.returncode == 0
    assert result.stdout.strip() == result.stderr.strip()


def test_cwd_with_env():
    result = _run_task("cwd_with_env")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content in test file"


def test_cwd_jinja():
    result = _run_task("cwd_jinja")
    assert result.returncode == 0
    assert result.stdout.strip() == result.stderr.strip()


def test_file():
    result = _run_task("file")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content in test filecontent in test file"


def test_py_binary():
    result = _run_task("py_binary")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content from py_binary"


def test_py_binary_with_runfile():
    result = _run_task("py_binary_with_runfile")
    assert result.returncode == 0
    assert result.stdout.strip() == b"from python: content in test file"


def test_genrule():
    result = _get_output("genrule_output.txt")
    assert result == "from genrule\nfrom python: content in test file\n"


def test_genrule_with_cwd():
    result = _get_output("genrule_with_cwd_output.txt")
    assert result == "content in test file"


def test_filegroup():
    result = _run_task("filegroup")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content in test filecontent in test second file"


def test_python():
    result = _run_task("python")
    assert result.returncode == 0
    assert result.stdout.strip() == b"some value"


def test_python_entry_point():
    result = _run_task("python_entry_point")
    assert result.returncode == 0
    assert "23.3.0 (compiled:" in result.stdout.strip().decode("utf-8")


def test_env():
    result = _run_task("env")
    assert result.returncode == 0
    assert (
        result.stdout.strip()
        == b"BAR's value\nHello, world!\nsome value\nsome inline shell"
    )


# TODO: https://github.com/mvgijssel/setup/issues/485
# def test_defer():
#     result = _run_task("defer")
#     assert result.returncode == 2
#     assert result.stdout.strip() == b"first\nsecond\nfirst defer\nsecond defer"


def test_cli_args():
    result = _run_task("cli_args", ["get", "this", "value", "back"])
    assert result.returncode == 0
    assert result.stdout.strip() == b"get this value back"


def test_capture_stdin():
    result = _run_task("capture_stdin")
    assert result.returncode == 0
    assert result.stdout.strip() == b"hello from stdin"


def test_info_file():
    result = _run_task("info_file")
    assert result.returncode == 0
    assert (
        b"STABLE_RULES_TASK_TEST_FLAG=${STABLE_RULES_TASK_TEST_FLAG:-FOO}"
        in result.stdout.strip()
    )
    assert b"VOLATILE_RULES_TASK_TEST_FLAG" not in result.stdout.strip()


def test_version_file():
    result = _run_task("version_file")
    assert result.returncode == 0
    assert (
        b"VOLATILE_RULES_TASK_TEST_FLAG=${VOLATILE_RULES_TASK_TEST_FLAG:-BAR}"
        in result.stdout.strip()
    )
    assert b"STABLE_RULES_TASK_TEST_FLAG" not in result.stdout.strip()


def test_stamp_stable():
    result = _run_task("stamp_stable")
    assert result.returncode == 0
    assert result.stdout.strip() == b"FOO"


def test_stamp_volatile():
    result = _run_task("stamp_volatile")
    assert result.returncode == 0
    assert result.stdout.strip() == b"BAR"


def test_stamp_nested():
    result = _run_task("stamp_nested")
    assert result.returncode == 0
    assert result.stdout.strip() == b"parent_value"
