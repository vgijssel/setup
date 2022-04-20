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
kerk_txt = r.Rlocation("setup/infrastructure/kerk.txt")

v = vagrant.Vagrant(vagrantfile_dir, quiet_stdout=False, quiet_stderr=False)
pulumi.info(v.keyfile())

private_key = open(v.keyfile(), 'r').read()
connection = remote.ConnectionArgs(
    host=v.hostname(),
    port=int(v.port()),
    private_key=private_key,
    user=v.user(),
)

remote.CopyFile("kerk", connection=connection, local_path=kerk_txt, remote_path="/tmp/kerk.txt")