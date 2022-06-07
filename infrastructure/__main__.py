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

import pulumi
import pulumi_nomad as nomad

with open("test-job.hcl", "r") as f:
    jobspec = f.read()

job = nomad.Job(
    "test-job",
    jobspec=jobspec,
    deregister_on_destroy=True,
    deregister_on_id_change=True,
    detach=False,
    purge_on_destroy=True,
)
