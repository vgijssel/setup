# See https://github.com/bazelbuild/bazel/blob/master/tools/python/runfiles/runfiles.py
import os
import sys
from rules_python.python.runfiles import runfiles
import jinja2
from pathlib import Path
import subprocess
import atexit
import signal


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


environment = jinja2.Environment(undefined=jinja2.StrictUndefined)


def jinja_render_string(string):
    template = environment.from_string(string)
    return template.render(os=os, runfiles_path=runfiles_path)


# Setup the command to run
cmd = runfiles_path(cmd_sub)

# Setup the working directory of the command
cwd = jinja_render_string(cwd_sub)

inline_args_raw = {{ARGS}}
inline_args = []

for inline_arg_raw in inline_args_raw:
    inline_args.append(jinja_render_string(inline_arg_raw))

external_args = sys.argv[1:]
args = [cmd] + inline_args + external_args


# Prevent a SIGINT and regular exit firing the after_cmd hook twice.
handle_exit_executed = False

# When process exists and exit code is 0 the command is a success,
# all other cases of exit is considered failure.
successful_exit = False


def handle_exit(*exit_args):
    global handle_exit_executed

    if handle_exit_executed:
        return

    handle_exit_executed = True

    after_cmd()


def before_cmd():
    {{BEFORE_CMD}}


def after_cmd():
    {{AFTER_CMD}}


def main():
    {{ENV}}

    if cwd:
        os.chdir(cwd)

    atexit.register(handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)
    signal.signal(signal.SIGINT, handle_exit)

    before_cmd()

    result = subprocess.run(args, env=os.environ)
    global successful_exit
    successful_exit = result.returncode == 0
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
