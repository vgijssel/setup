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


def _get_instruction(cmd):
    if isinstance(cmd, str):
        return f"{cmd}"

    if isinstance(cmd, list):
        cmd_list = [_get_instruction(c) for c in cmd]
        return "\n".join(cmd_list)

    elif isinstance(cmd, dict):
        if cmd["type"] not in ["shell", "location"]:
            raise ValueError("Invalid command type: {}".format(cmd["type"]))

        if cmd["type"] == "shell":
            return "\n" + _get_instruction(cmd["args"]) + "\n"

        if cmd["type"] == "location":
            return _get_location(cmd["label"])
    else:
        raise ValueError("Invalid command: {}".format(cmd))


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
        if isinstance(cmd, str):
            bash_cmd += cmd + "\n"

        elif cmd["type"] == "location":
            bash_cmd += _get_location(cmd["label"]) + "\n"

        elif cmd["type"] == "shell":
            result = []
            for arg in cmd["args"]:
                if isinstance(arg, str):
                    result.append(arg)

                elif arg["type"] == "location":
                    result.append(_get_location(arg["label"]))

            bash_cmd += " ".join(result) + "\n"

    result = subprocess.run(["bash", "-c", bash_cmd], capture_output=True)

    sys.stdout.write(result.stdout.decode("utf-8"))
    sys.stderr.write(result.stderr.decode("utf-8"))

    if result.returncode != 0:
        sys.exit(result.returncode)


if __name__ == "__main__":
    main()
