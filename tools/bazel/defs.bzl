def _runner_binary_impl(ctx):
    runner_binary_executable = ctx.actions.declare_file(ctx.label.name)
    cmd = ctx.expand_location(ctx.attr.cmd)
    cmd_header = """
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
    """

    full_cmd = cmd_header + cmd
    ctx.actions.write(runner_binary_executable, full_cmd, is_executable = True)

    runfiles = ctx.runfiles(
        files = ctx.files.deps + [ctx.file._rlocation],
    )

    runfiles = runfiles.merge_all([
        ctx.attr._rlocation[DefaultInfo].default_runfiles,
    ])

    return [DefaultInfo(
        executable = runner_binary_executable,
        files = runfiles.files,
        runfiles = runfiles,
    )]

runner_binary = rule(
    implementation = _runner_binary_impl,
    executable = True,
    attrs = {
        "cmd": attr.string(mandatory = True),
        "deps": attr.label_list(allow_files = True),
        "_rlocation": attr.label(allow_single_file = True, default = Label("@bazel_tools//tools/bash/runfiles")),
    },
)
