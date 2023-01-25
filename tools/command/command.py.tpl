# See https://github.com/bazelbuild/bazel/blob/master/tools/python/runfiles/runfiles.py
import os
import sys
from rules_python.python.runfiles import runfiles

cmd_sub = "{{CMD}}"
cwd_sub = "{{CWD}}"

# Setup the command to run
r = runfiles.Create()
cmd = r.Rlocation(cmd_sub)

# Setup the working directory of the command
# TODO: run Jinja2
# cwd = cwd_sub
cwd = None

# Setup the args to pass to the command
inline_args = []
external_args = sys.argv[1:]
args = [cmd] + inline_args + external_args

print(cmd_sub)
print(cmd)
print(args)


def main():
    # os.chdir(pulumi_cwd)
    # os.execvpe(pulumi_command[0], pulumi_command, pulumi_env)

    # pulumi_env = os.environ.copy()

    # pulumi_env = os.environ.copy()
    # pulumi_env = pulumi_env | envconsul_secrets
    # pulumi_args = sys.argv[1:]
    # pulumi_command = [pulumi_binary] + pulumi_args

    if cwd:
        os.chdir(cwd)

    os.execvpe(cmd, args, os.environ)


if __name__ == "__main__":
    main()
