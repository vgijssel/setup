"""
DEPRECATED: runner_binary to make it easy to run things. Superseded by command.bzl
"""

def _runner_binary_impl(ctx):
    make_variables = {
        "OUT": ctx.outputs.out.short_path,
        "WORKSPACE_NAME": ctx.workspace_name,
    }

    cmd = ctx.expand_make_variables(
        "cmd",
        ctx.expand_location(ctx.attr.cmd),
        make_variables,
    )

    env_string = ""
    for key, value in ctx.attr.env.items():
        env_string += 'export {}="{}"\n'.format(key, value)

    env_string = ctx.expand_make_variables(
        "env",
        ctx.expand_location(env_string),
        make_variables,
    )

    # Added the following line to the runfiles.bash script:
    # source "$(grep -sm1 "^$f " "$(dirname $(pwd))/MANIFEST" | cut -f2- -d' ')" 2>/dev/null || \
    # to deal with the case where the runner_binary is not called directly but
    # called by another bazel rule. Because in that case $0 will be different
    # and cannot be used to resolve the location of the runfiles manifest.
    cmd_header = """
#!/usr/bin/env bash

set +e

# --- begin runfiles.bash initialization v2 ---
# Copy-pasted from the Bazel Bash runfiles library v2.
set -uo pipefail; f=bazel_tools/tools/bash/runfiles/runfiles.bash
source "${RUNFILES_DIR:-/dev/null}/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$(dirname $(pwd))/MANIFEST" | cut -f2- -d' ')" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "${RUNFILES_MANIFEST_FILE:-/dev/null}" | cut -f2- -d' ')" 2>/dev/null || \
  source "$0.runfiles/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.exe.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  { echo>&2 "ERROR: cannot find $f"; exit 1; }; f=; set -e
# --- end runfiles.bash initialization v2 ---

set -Eeou pipefail
    """

    cmd_header += "\n{}\n".format(env_string)

    full_cmd = cmd_header + cmd
    ctx.actions.write(ctx.outputs.out, full_cmd, is_executable = True)

    runfiles = ctx.runfiles(
        files = [ctx.file._rlocation] + ctx.files.data + ctx.files.deps + [ctx.outputs.out],
    )

    for dep in ctx.attr.deps:
        runfiles = runfiles.merge_all([
            dep[DefaultInfo].default_runfiles,
            dep[DefaultInfo].data_runfiles,
        ])

    for dat in ctx.attr.data:
        runfiles = runfiles.merge_all([
            dat[DefaultInfo].default_runfiles,
            dat[DefaultInfo].data_runfiles,
        ])

    return [DefaultInfo(
        executable = ctx.outputs.out,
        files = runfiles.files,
        runfiles = runfiles,
    )]

runner_binary = rule(
    implementation = _runner_binary_impl,
    executable = True,
    attrs = {
        "cmd": attr.string(mandatory = True),
        "data": attr.label_list(allow_files = True),
        "deps": attr.label_list(allow_files = True),
        "env": attr.string_dict(),
        "out": attr.output(mandatory = True),
        "_rlocation": attr.label(allow_single_file = True, default = Label("@bazel_tools//tools/bash/runfiles")),
    },
)
