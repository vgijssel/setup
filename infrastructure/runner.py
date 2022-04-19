from rules_python.python.runfiles import runfiles
import subprocess
import sys
import os

r = runfiles.Create()

pulumi_args = sys.argv[1:]
pulumi_binary = r.Rlocation("pulumi/pulumi")
pulumi_config = r.Rlocation("setup/infrastructure/Pulumi.yaml")
pulumi_main = r.Rlocation("setup/infrastructure/__main__.py")
pulumi_cwd = os.path.dirname(pulumi_main)

subprocess.run([pulumi_binary, "--cwd", pulumi_cwd] + pulumi_args)