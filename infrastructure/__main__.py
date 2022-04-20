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

r = runfiles.Create()
vagrantfile_dir = os.path.join(r.Rlocation("setup/hypervisor/.kitchen"), "kitchen-vagrant", "default-ubuntu-focal")

v = vagrant.Vagrant(vagrantfile_dir, quiet_stdout=False, quiet_stderr=False)
print(v.status())
print(v.ssh_config())
print(v.keyfile())



