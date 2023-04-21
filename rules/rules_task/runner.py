import sys
import json
import subprocess
import os
import runfiles
import jinja2
import sys

r = runfiles.Create()
environment = jinja2.Environment(undefined=jinja2.StrictUndefined)


def _rlocation_to_path(rlocation):
    p = r.Rlocation(rlocation)

    if not p:
        raise Exception("Unable to find runfile: {}".format(rlocation))

    return p


def jinja_render_string(string):
    template = environment.from_string(string)
    return template.render(os=os, rlocation_to_path=_rlocation_to_path)


def main() -> None:
    _, instructions_file = sys.argv

    # Making sure the current Python executable is in front of the PATH
    # so python based cmds can use this Python as well.
    os.environ["PATH"] = (
        os.path.dirname(sys.executable) + os.pathsep + os.environ["PATH"]
    )

    with open(instructions_file) as f:
        instructions = json.load(f)

    cwd = instructions["cwd"] or "$PWD"
    bash_cmd = f"""
    set -Eeou pipefail
    cd {cwd}
    """

    for cmd in instructions["cmds"]:
        bash_cmd += cmd + "\n"

    bash_cmd = jinja_render_string(bash_cmd)

    result = subprocess.run(["bash", "-c", bash_cmd], capture_output=True)

    sys.stdout.write(result.stdout.decode("utf-8"))
    sys.stderr.write(result.stderr.decode("utf-8"))

    if result.returncode != 0:
        sys.exit(result.returncode)


if __name__ == "__main__":
    main()
