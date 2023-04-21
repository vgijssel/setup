import runfiles
import subprocess
import os

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


def test_cwd_jinja():
    result = _run_task("cwd_jinja")
    assert result.returncode == 0
    assert result.stdout.strip() == result.stderr.strip()


def test_file():
    result = _run_task("file")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content in test file"


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


def test_filegroup():
    result = _run_task("filegroup")
    assert result.returncode == 0
    assert result.stdout.strip() == b"content in test filecontent in test second file"


def test_python():
    result = _run_task("python")
    assert result.returncode == 0
    assert result.stdout.strip() == b"somevalue"


def test_python_entry_point():
    result = _run_task("python_entry_point")
    assert result.returncode == 0
    assert "23.3.0 (compiled:" in result.stdout.strip().decode("utf-8")


def test_env():
    result = _run_task("env")
    assert result.returncode == 0
    assert result.stdout.strip() == b"BAR\nHello, world!\nsomevalue"


def test_defer():
    result = _run_task("defer")
    assert result.returncode == 2
    assert result.stdout.strip() == b"first\nsecond\nfirst defer\nsecond defer"


def test_cli_args():
    result = _run_task("cli_args", ["get", "this", "value", "back"])
    assert result.returncode == 0
    assert result.stdout.strip() == b"get this value back"
