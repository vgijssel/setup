# import deluge
# import jackett
# import radarr
# import sonarr
# import bazarr
# import plex
# import rclone

# import debugpy
# debugpy.listen(("0.0.0.0", 5678))
# pulumi.info("debugpy is listening, attach by pressing F5 or ►")
# debugpy.wait_for_client()
# pulumi.info("Attached to debugpy!")

import os
from rules_python.python.runfiles import runfiles
import vagrant
import pulumi
from pulumi_command import remote

r = runfiles.Create()
vagrantfile_dir = os.path.join(r.Rlocation("setup/hypervisor/.kitchen"), "kitchen-vagrant", "default-ubuntu-focal")

v = vagrant.Vagrant(vagrantfile_dir, quiet_stdout=False, quiet_stderr=False)

private_key = open(v.keyfile(), 'r').read()
connection = remote.ConnectionArgs(
    host=v.hostname(),
    port=int(v.port()),
    private_key=private_key,
    user=v.user(),
)

def ignite_vm(name, template_file, connection):
    template_file_path = r.Rlocation(template_file)
    template_file_content =  open(template_file_path, 'r').read()
    remote_path = os.path.join("/etc/firecracker/manifests", os.path.basename(template_file_path))

    remote.CopyFile(
        name, 
        connection=connection,
        local_path=template_file_path,
        remote_path=remote_path,
        triggers=[template_file_content]
    )


ignite_vm(
    "control-plane",
    template_file="setup/infrastructure/k8s-control-plane.yaml",
    connection = connection,
)

ignite_vm(
    "worker",
    template_file="setup/infrastructure/k8s-worker.yaml",
    connection = connection,
)