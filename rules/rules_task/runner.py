import sys
import json
import subprocess
import os
import runfiles

r = runfiles.Create()


def _get_location(label):
    p = r.Rlocation(label)

    if not p:
        raise Exception("Unable to find runfile: {}".format(label))

    return p


def main() -> None:
    _, instructions_file = sys.argv

    with open(instructions_file) as f:
        instructions = json.load(f)

    cwd = instructions["cwd"] or "$PWD"

    bash_cmd = f"""
    set -e
    cd {cwd}
    """

    for cmd in instructions["cmds"]:
        bash_cmd += cmd + "\n"

    # TODO: jinja eval the bash_cmd

    print(bash_cmd)

    result = subprocess.run(["bash", "-c", bash_cmd], capture_output=True)

    sys.stdout.write(result.stdout.decode("utf-8"))
    sys.stderr.write(result.stderr.decode("utf-8"))

    if result.returncode != 0:
        sys.exit(result.returncode)


if __name__ == "__main__":
    main()
