import os
import subprocess

import ruamel.yaml


def wrap(s):  # literal if multi-line
    return ruamel.yaml.scalarstring.LiteralScalarString(s)


cilium_values = os.path.join(os.environ["SERVICES_DIR"], "cilium", "values.yaml")
cilium_chart = os.path.join(os.environ["_3RDPARTY_DIR"], "charts", "cilium")

helm_script = f"""
helm template \
    cilium \
    {cilium_chart} \
    --namespace kube-system \
    --values {cilium_values}
"""

result = subprocess.run([helm_script], text=True, shell=True, capture_output=True)

if result.returncode != 0:
    raise Exception(
        "Failed to generate yaml for Cilium for script\n{}\nError\n{}".format(
            helm_script, result.stderr
        )
    )

cilium_config = result.stdout

patch = {
    "cluster": {
        "inlineManifests": [{"name": "cilium", "contents": wrap(cilium_config)}]
    }
}

yaml = ruamel.yaml.YAML()

# Get the directory of the current script
script_dir = os.path.join(os.environ["STACKS_DIR"], "enigma")

# Write out file_content to cilium.patch.yaml in the same directory as the script
output_file = os.path.join(script_dir, "cilium.patch.yaml")
with open(output_file, "w") as file:
    yaml.dump(patch, file)

print(f"Patch file written to {output_file}")
