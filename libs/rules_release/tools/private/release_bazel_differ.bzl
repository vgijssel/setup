"""Bazel-differ utilities for release tooling."""

load("@rules_task//task:defs.bzl", "task")
load("//release:defs.bzl", "release")
load("//release/private:utils.bzl", "label_to_string")

def _release_bazel_differ_impl(ctx):
    executable = ctx.actions.declare_file(ctx.label.name)
    bazel_differ_cli_path = ctx.executable._bazel_differ_cli.short_path
    bazel_differ_path = ctx.executable._bazel_differ.short_path
    previous_revision_path = ctx.executable.previous_revision_cmd.short_path
    final_revision_path = ctx.executable.final_revision_cmd.short_path

    args = [bazel_differ_cli_path, "--bazel-differ-path", bazel_differ_path, "--previous-revision-cmd", previous_revision_path, "--final-revision-cmd", final_revision_path]

    if ctx.attr.generate_hashes_extra_args:
        args.append("--generate-hashes-extra-args \'" + " ".join(ctx.attr.generate_hashes_extra_args) + "\'")

    if ctx.attr.diff_extra_args:
        args.append("--diff-extra-args \'" + " ".join(ctx.attr.diff_extra_args) + "\'")

    args.append(label_to_string(ctx.attr.target.label))

    command = " ".join(args)

    runfiles = ctx.runfiles(files = ctx.files._bazel_differ + ctx.files._bazel_differ_cli + ctx.files.previous_revision_cmd + ctx.files.final_revision_cmd)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._bazel_differ] + [ctx.attr._bazel_differ_cli] + [ctx.attr.previous_revision_cmd] + [ctx.attr.final_revision_cmd])
    ])

    ctx.actions.write(
        output = executable,
        content = command,
    )

    return [
        DefaultInfo(executable = executable, runfiles = runfiles),
    ]

_release_bazel_differ = rule(
    implementation = _release_bazel_differ_impl,
    attrs = {
        "diff_extra_args": attr.string_list(default = []),
        "final_revision_cmd": attr.label(executable = True, cfg = "target", mandatory = True),
        "generate_hashes_extra_args": attr.string_list(default = []),
        "previous_revision_cmd": attr.label(executable = True, cfg = "target", mandatory = True),
        "target": attr.label(mandatory = True),
        "_bazel_differ": attr.label(executable = True, cfg = "target", default = Label("//tools/bazel-differ")),
        "_bazel_differ_cli": attr.label(executable = True, cfg = "target", default = Label("//tools/bazel-differ:bazel-differ-change-cli")),
    },
    executable = True,
)

def release_bazel_differ(previous_revision_cmd = None, final_revision_cmd = None, **kwargs):
    """Create a release target that uses bazel-differ to detect changes.

    Args:
        previous_revision_cmd: Command to determine the previous revision
        final_revision_cmd: Command to determine the final revision
        **kwargs: Additional arguments passed to the release rule
    """
    name = kwargs.get("name")
    change_cmd_name = "{}.change_cmd".format(name)
    previous_revision_cmd_name = previous_revision_cmd
    final_revision_cmd_name = final_revision_cmd
    target = kwargs.pop("target")
    generate_hashes_extra_args = kwargs.pop("generate_hashes_extra_args", [])
    diff_extra_args = kwargs.pop("diff_extra_args", [])

    if not previous_revision_cmd_name:
        previous_revision_cmd_name = "{}.previous_revision_cmd".format(name)

        task(
            name = previous_revision_cmd_name,
            cmds = [
                "git rev-parse main",
            ],
            cwd = "$BUILD_WORKSPACE_DIRECTORY",
        )

    if not final_revision_cmd_name:
        final_revision_cmd_name = "{}.final_revision_cmd".format(name)

        task(
            name = final_revision_cmd_name,
            cmds = [
                "git rev-parse HEAD",
            ],
            cwd = "$BUILD_WORKSPACE_DIRECTORY",
        )

    _release_bazel_differ(
        name = change_cmd_name,
        generate_hashes_extra_args = generate_hashes_extra_args,
        diff_extra_args = diff_extra_args,
        target = target,
        previous_revision_cmd = previous_revision_cmd_name,
        final_revision_cmd = final_revision_cmd_name,
    )

    release(change_cmd = change_cmd_name, **kwargs)
