import sys
import json
import subprocess


def main() -> None:
    print(sys.argv, file=sys.stderr)

    _, instructions_file = sys.argv

    with open(instructions_file) as f:
        instructions = json.load(f)

    print(instructions, file=sys.stderr)

    for cmd in instructions["cmds"]:
        bash_cmd = ["bash", "-c", cmd]
        result = subprocess.run(bash_cmd, capture_output=True)
        print(result.stdout.decode("utf-8"))


if __name__ == "__main__":
    main()
