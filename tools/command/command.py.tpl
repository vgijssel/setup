# See https://github.com/bazelbuild/bazel/blob/master/tools/python/runfiles/runfiles.py
import os
import sys
from rules_python.python.runfiles import runfiles
import jinja2
from pathlib import Path


cmd_sub = "{{CMD}}"
cwd_sub = "{{CWD}}"

# During "bazel build" the RUNFILES_DIR variable will be set and we can return this directly.
# During "bazel run" the RUNFILES_MANIFEST_FILE variable will be set which we cannot consume directly using
# the runfiles library, because we'll get back file references which are not within the runfiles tree.
# We need files to be within the runfiles tree for two reasons:
# 1. Isolation. The runfiles tree ensures we only have access to the files we depend on.
# 2. Reproducability. The output tree can contain dead symlinks which result in breakage.
def runfiles_dir():
    if "RUNFILES_DIR" in os.environ:
        return os.environ["RUNFILES_DIR"]

    manifest_path = os.environ["RUNFILES_MANIFEST_FILE"]
    manifest_base_name = os.path.basename(manifest_path)
    manifest_directory = os.path.dirname(manifest_path)
    manifest_stem = Path(manifest_base_name).stem
    runfiles_dir = os.path.join(manifest_directory, manifest_stem + ".runfiles")
    return runfiles_dir


r = runfiles.CreateDirectoryBased(runfiles_dir())


def runfiles_path(path):
    p = r.Rlocation(path)

    if not p:
        raise Exception("Unable to find runfile: {}".format(path))

    return p


def before_script():
    {{BEFORE_SCRIPT}}


# Setup the command to run
cmd = runfiles_path(cmd_sub)

# Setup the working directory of the command
environment = jinja2.Environment(undefined=jinja2.StrictUndefined)
template = environment.from_string(cwd_sub)
cwd = template.render(os=os, runfiles_path=runfiles_path)

# Setup the args to pass to the command
inline_args = []
external_args = sys.argv[1:]
args = [cmd] + inline_args + external_args


def main():
    {{ENV}}

    before_script()

    if cwd:
        os.chdir(cwd)

    os.execvpe(cmd, args, os.environ)


if __name__ == "__main__":
    main()
