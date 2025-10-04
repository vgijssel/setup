import atexit
import os
from shlex import quote

from deepdiff import DeepDiff

old_env = os.environ.copy()
task_env_file = os.environ["TASK_ENV_FILE"]


@atexit.register
def write_changed_env():
    new_env = os.environ.copy()
    diff = DeepDiff(old_env, new_env, ignore_order=True)

    changed_env = {}

    for key in diff.affected_root_keys:
        changed_env[key] = new_env[key]

    with open(task_env_file, "w") as file:
        results = []

        for key, value in changed_env.items():
            results.append(f"export {key}={quote(value)}")

        file.write("\n".join(results))


def main():
    {{python_code}}


if __name__ == "__main__":
    main()
