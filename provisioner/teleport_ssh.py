# How this should work:
# 2. Generate the SSH config for the buildbuddy user with tsh
# 3. Parse the config and remove "CertificateFile"
# 4. Update "IdentityFile" in the ssh config with the private key from step 1
# 5. Update the ProxyCommand to include the user and the identity
# 6. Write the ssh config to a file
# 7. Run the command with the ssh config: ssh -F ssh_config ubuntu@provisioner.provisioner

import sys
import paramiko
import os
import subprocess
from shlex import quote
from pathlib import Path

# tsh_binary = os.environ["TELEPORT_TSH_BINARY"]
tsh_binary = "tsh"
teleport_identity = os.environ["TELEPORT_IDENTITY"]
teleport_user = os.environ["TELEPORT_USER"]
teleport_proxy = os.environ["TELEPORT_PROXY"]
teleport_cluster = os.environ["TELEPORT_CLUSTER"]
ssh_host = os.environ["SSH_HOST"]

_, target_ssh_config = sys.argv
target_identity_file = f"{target_ssh_config}.identity_file"

# TODO: also extract public key, right after private key!
teleport_identity_content = Path(teleport_identity).read_text()
private_key_start_index = teleport_identity_content.index(
    "-----BEGIN RSA PRIVATE KEY-----"
)
end_private_key_string = "-----END RSA PRIVATE KEY-----"
private_key_end_index = teleport_identity_content.rindex(end_private_key_string) + len(
    end_private_key_string
)

private_key_content = teleport_identity_content[
    private_key_start_index:private_key_end_index
]

with open(target_identity_file, "w") as f:
    f.write(private_key_content)

os.chmod(target_identity_file, 0o600)


result = subprocess.run(
    [
        tsh_binary,
        "config",
        f"--identity={teleport_identity}",
        f"--user={teleport_user}",
        f"--proxy={teleport_proxy}",
    ],
    capture_output=True,
    universal_newlines=True,
)

if result.returncode != 0:
    print(result.stderr)
    print(result.stdout)
    result.check_returncode()

config = result.stdout

ssh_config = paramiko.SSHConfig()
ssh_config = ssh_config.from_text(text=config)


host_config = ssh_config.lookup(ssh_host)
host_config["ControlPath"] = "~/.ssh/cm-%r@%h:%p"
host_config["ControlMaster"] = "auto"
host_config["ControlPersist"] = "10m"

del host_config["certificatefile"]
del host_config["hostname"]

host_config["identityfile"] = target_identity_file

host_config["proxycommand"] = " ".join(
    [
        tsh_binary,
        "proxy",
        "ssh",
        f"--cluster={teleport_cluster}",
        f"--user={teleport_user}",
        f"--proxy={teleport_proxy}",
        f"--identity={teleport_identity}",
        "%r@%h:%p",
    ]
)


new_ssh_config = f"Host *.{teleport_cluster}\n"

for key, value in host_config.items():
    if not type(value) is list:
        value = [value]

    for v in value:
        new_ssh_config += f"    {key} {v}\n"

with open(target_ssh_config, "w") as f:
    f.write(new_ssh_config)

print(new_ssh_config)
