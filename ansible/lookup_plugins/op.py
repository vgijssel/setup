from ansible.errors import AnsibleError
from ansible.plugins.lookup import LookupBase
from ansible.utils.display import Display

display = Display()

import subprocess


class LookupModule(LookupBase):
    def run(self, terms, variables=None, **kwargs):
        # Validate input
        if not terms:
            raise AnsibleError("No terms provided to the custom lookup plugin")

        results = []
        for term in terms:
            try:
                command = ["op", "read", term]
                display.v(f"Executing command: {command}")

                result = subprocess.run(
                    command, check=True, text=True, capture_output=True
                )

            except subprocess.CalledProcessError as e:
                raise AnsibleError(
                    f"Error executing 'op read {term}': {e.stderr.strip()}"
                )

            result = result.stdout.strip()
            results.append(result)

        return results
