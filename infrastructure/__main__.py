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
test_vm = r.Rlocation("setup/infrastructure/test-vm.yaml")
test_vm_content =  open(test_vm, 'r').read()

v = vagrant.Vagrant(vagrantfile_dir, quiet_stdout=False, quiet_stderr=False)

private_key = open(v.keyfile(), 'r').read()
connection = remote.ConnectionArgs(
    host=v.hostname(),
    port=int(v.port()),
    private_key=private_key,
    user=v.user(),
)

remote.CopyFile("test-vm", connection=connection, local_path=test_vm, remote_path=f"/etc/firecracker/manifests/test-vm.yaml", triggers=[test_vm_content])