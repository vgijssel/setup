# How this should work:
# 1. Load the given identity file and split the private key by searching for "-----END RSA PRIVATE KEY-----"
# 2. Generate the SSH config for the buildbuddy user with tsh
# 3. Parse the config and remove "CertificateFile"
# 4. Update "IdentityFile" in the ssh config with the private key from step 1
# 5. Update the ProxyCommand to include the user and the identity
# 6. Write the ssh config to a file
# 7. Run the command with the ssh config: ssh -F ssh_config ubuntu@provisioner.provisioner


import paramiko
import os
import subprocess
from shlex import quote

tsh_binary = os.environ["TELEPORT_TSH_BINARY"]

result = subprocess.run(
    [tsh_binary, "config"],
    capture_output=True,
    universal_newlines=True,
    check=True,
)

config = result.stdout

ssh_config = paramiko.SSHConfig()
ssh_config = ssh_config.from_text(text=config)

host_config = ssh_config.lookup("ubuntu@provisioner.provisioner")
host_config["ControlPath"] = "$HOME/.ssh/cm-%r@%h:%p"
host_config["ControlMaster"] = "auto"
host_config["ControlPersist"] = "10m"

ssh_command = ["ssh"]

for key, value in host_config.items():
    ssh_command.append("-o")
    ssh_command.append(quote(f"{key}={value}"))


print(ssh_command)


result = subprocess.run(
    ssh_command,
    capture_output=True,
    universal_newlines=True,
    check=True,
)

import pdb

pdb.set_trace()
