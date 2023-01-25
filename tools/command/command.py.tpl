# See https://github.com/bazelbuild/bazel/blob/master/tools/python/runfiles/runfiles.py
import os
import sys
from rules_python.python.runfiles import runfiles
import jinja2

cmd_sub = "{{CMD}}"
cwd_sub = "{{CWD}}"

r = runfiles.Create()


def runfiles_path(path):
    p = r.Rlocation(path)

    if not p:
        raise Exception("Unable to find runfile: {}".format(path))

    return p


# Setup the command to run
cmd = runfiles_path(cmd_sub)

# Setup the working directory of the command
# cwd = cwd_sub
environment = jinja2.Environment(undefined=jinja2.StrictUndefined)
template = environment.from_string(cwd_sub)
cwd = template.render(os=os, runfiles_path=runfiles_path)

# Setup the args to pass to the command
inline_args = []
external_args = sys.argv[1:]
args = [cmd] + inline_args + external_args

print(cmd_sub)
print(cmd)
print(cwd_sub)
print(cwd)
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
