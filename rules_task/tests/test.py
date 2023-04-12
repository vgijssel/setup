import runfiles
import subprocess
import os

r = runfiles.Create()

print(os.getcwd())


def _runfiles_path(path):
    p = r.Rlocation(path)

    if not p:
        raise Exception("Unable to find runfile: {}".format(path))

    return p


def _run_task(name):
    binary = _runfiles_path(f"setup/rules_task/tests/{name}")
    return subprocess.run([binary], capture_output=True)


def test_hello():
    result = _run_task("hello")
    assert result.returncode == 0
    assert result.stdout.strip() == b"Hello, world!"
