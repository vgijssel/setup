import os
import subprocess
from shlex import quote

from ansible.errors import AnsibleError
from ansible.plugins.vars import BaseVarsPlugin
from ansible.utils.display import Display

display = Display()

DOCUMENTATION = """
    name: op
    version_added: "0.0.0"
    short_description: 1Password secret reference variable files
    description:
    - This plugin allows you to define 1Password secret references in dedicated variable files.
    - For example for the group `web` you can create a file `group_vars/web.op.yml` with the following content:
    - >
        ```
        my_secret_variable: op://my-vault/some-secret/password
        ```
    - Benefit over using `lookup` plugin is that the secret is only fetched once and cached for the entire playbook run.
    requirements:
    - The `op` command line tool must be installed and available in the PATH.
"""

VAR_CACHE = {}
LOGIN_CACHE = {}


class VarsModule(BaseVarsPlugin):
    def get_vars(self, loader, path, entities):
        result = {}

        self._assert_login()

        for entity in entities:
            result.update(self._get_secrets(path, entity, loader))

        return result

    def _assert_login(self):
        if "whoami" in LOGIN_CACHE:
            display.v("Using cached login data for key: whoami")

        else:
            command = ["op", "whoami", "--format", "json"]
            result = self._run_command(command)
            display.v("Caching login data with key: whoami")
            LOGIN_CACHE["whoami"] = result

        return LOGIN_CACHE["whoami"]

    def _get_secrets(self, path, entity, loader):
        op_environment_file = os.path.join(path, "group_vars", f"{entity}.op.yml")

        if op_environment_file in VAR_CACHE:
            display.v(f"Returning cached variable data for key: {op_environment_file}")
            return VAR_CACHE[op_environment_file]

        if os.path.exists(op_environment_file):
            display.v(f"Found variable file: {op_environment_file}")
            result = self._get_environment_file_data(op_environment_file)
            result = loader.load(result)

        else:
            display.v(f"Variable file not found: {op_environment_file}. Skipping.")
            result = {}

        display.v(f"Caching variable data with key: {op_environment_file}")
        VAR_CACHE[op_environment_file] = result
        return result

    def _get_environment_file_data(self, path):
        safe_path = quote(path)
        command = ["op", "inject", "--force", f"--in-file={safe_path}"]
        return self._run_command(command)

    def _run_command(self, command):
        command_str = " ".join(command)
        display.v(f"Executing command: {command_str}")

        result = subprocess.run(command, text=True, capture_output=True)

        if result.returncode != 0:
            raise AnsibleError(
                f"Error executing command `{command_str}` with return code {result.returncode}: {result.stderr.strip()}"
            )

        result = result.stdout.strip()
        return result
