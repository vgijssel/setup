import os
import subprocess

import ruamel.yaml

# generate yaml based on helm call
# From https://www.talos.dev/v1.9/kubernetes-guides/network/deploying-cilium/


def wrap(s):  # literal if multi-line
    return ruamel.yaml.scalarstring.LiteralScalarString(s)


helm_script = """
helm template \
    cilium \
    cilium/cilium \
    --version 1.15.6 \
    --namespace kube-system \
    --set ipam.mode=kubernetes \
    --set kubeProxyReplacement=true \
    --set securityContext.capabilities.ciliumAgent="{CHOWN,KILL,NET_ADMIN,NET_RAW,IPC_LOCK,SYS_ADMIN,SYS_RESOURCE,DAC_OVERRIDE,FOWNER,SETGID,SETUID}" \
    --set securityContext.capabilities.cleanCiliumState="{NET_ADMIN,SYS_ADMIN,SYS_RESOURCE}" \
    --set cgroup.autoMount.enabled=false \
    --set cgroup.hostRoot=/sys/fs/cgroup \
    --set k8sServiceHost=localhost \
    --set k8sServicePort=7445
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
script_dir = os.path.join(os.environ["SETUP_DIR"], "stacks", "enigma")

# Write out file_content to cilium.patch.yaml in the same directory as the script
output_file = os.path.join(script_dir, "cilium.patch.yaml")
with open(output_file, "w") as file:
    yaml.dump(patch, file)

print(f"Patch file written to {output_file}")
