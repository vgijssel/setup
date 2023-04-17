import sys
import json
import subprocess


def main() -> None:
    _, instructions_file = sys.argv

    with open(instructions_file) as f:
        instructions = json.load(f)

    for cmd in instructions["cmds"]:
        bash_cmd = ["bash", "-c", cmd]
        result = subprocess.run(bash_cmd, capture_output=True)

        sys.stdout.write(result.stdout.decode("utf-8"))
        sys.stderr.write(result.stderr.decode("utf-8"))

        if result.returncode != 0:
            sys.exit(result.returncode)


if __name__ == "__main__":
    main()
