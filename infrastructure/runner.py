from rules_python.python.runfiles import runfiles
import subprocess
import sys
import os

r = runfiles.Create()

pulumi_args = sys.argv[1:]
pulumi_binary = r.Rlocation("pulumi/pulumi")
# TODO: config and main need to be copied using a custom bazel rule to
# a stable output directory. Then we are sture the invocation of pulumi will always work
pulumi_config = r.Rlocation("setup/infrastructure/Pulumi.yaml")
pulumi_main = r.Rlocation("setup/infrastructure/__main__.py")
pulumi_cwd = os.path.dirname(pulumi_main)

# Force the Pulumi backend to be the standard managed Pulumi backend.
os.environ["PULUMI_BACKEND_URL"] = "https://api.pulumi.com"

subprocess.run([pulumi_binary, "--cwd", pulumi_cwd] + pulumi_args)
