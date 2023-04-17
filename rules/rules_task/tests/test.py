import runfiles
import subprocess
import os

r = runfiles.Create()


def _runfiles_path(path):
    p = r.Rlocation(path)

    if not p:
        raise Exception("Unable to find runfile: {}".format(path))

    return p


def _run_task(name):
    print(os.environ["WORKSPACE_NAME"])
    binary = _runfiles_path(os.path.join(os.environ["WORKSPACE_NAME"], "tests", name))
    return subprocess.run([binary], capture_output=True)


def test_hello():
    result = _run_task("hello")
    assert result.returncode == 0
    assert result.stdout.strip() == b"Hello, world!"


def test_broken():
    result = _run_task("broken")
    assert result.returncode == 1
    assert result.stdout.strip() == b""
    assert result.stderr.strip() == b"Some error!"
