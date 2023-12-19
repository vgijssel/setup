load("//release:defs.bzl", "release")
load("@rules_task//task:defs.bzl", "task")

def _to_label_string(label):
    if label.workspace_name == "":
        workspace_name = ""
    else:
        # TODO: Wonder if there is a better way to get the workspace name of a locally overriden external repository
        workspace_name = "@" + label.workspace_name.removesuffix("~override")

    return workspace_name + "//" + label.package + ":" + label.name

def _bazel_diff_release_impl(ctx):
    executable = ctx.actions.declare_file(ctx.label.name)
    bazel_diff_cli_path = ctx.executable._bazel_diff_cli.short_path
    bazel_diff_path = ctx.executable._bazel_diff.short_path
    previous_revision_path = ctx.executable.previous_revision_cmd.short_path
    final_revision_path = ctx.executable.final_revision_cmd.short_path

    args = [bazel_diff_cli_path, "--bazel-diff-path", bazel_diff_path, "--previous-revision-cmd", previous_revision_path, "--final-revision-cmd", final_revision_path]

    if ctx.attr.generate_hashes_extra_args:
        args.append("--generate-hashes-extra-args \'" + " ".join(ctx.attr.generate_hashes_extra_args) + "\'")

    if ctx.attr.get_impacted_targets_extra_args:
        args.append("--get-impacted-targets-extra-args \'" + " ".join(ctx.attr.get_impacted_targets_extra_args) + "\'")

    args.append(_to_label_string(ctx.attr.target.label))

    command = " ".join(args)

    runfiles = ctx.runfiles(files = ctx.files._bazel_diff + ctx.files._bazel_diff_cli + ctx.files.previous_revision_cmd + ctx.files.final_revision_cmd)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._bazel_diff] + [ctx.attr._bazel_diff_cli] + [ctx.attr.previous_revision_cmd] + [ctx.attr.final_revision_cmd])
    ])

    ctx.actions.write(
        output = executable,
        content = command,
    )

    return [
        DefaultInfo(executable = executable, runfiles = runfiles),
    ]

_bazel_diff_release = rule(
    implementation = _bazel_diff_release_impl,
    attrs = {
        "_bazel_diff": attr.label(executable = True, cfg = "target", default = Label("//tools:bazel-diff")),
        "_bazel_diff_cli": attr.label(executable = True, cfg = "target", default = Label("//tools:bazel-diff-change-cli")),
        "generate_hashes_extra_args": attr.string_list(default = []),
        "get_impacted_targets_extra_args": attr.string_list(default = []),
        "target": attr.label(mandatory = True),
        "previous_revision_cmd": attr.label(executable = True, cfg = "target", mandatory = True),
        "final_revision_cmd": attr.label(executable = True, cfg = "target", mandatory = True),
    },
    executable = True,
)

def bazel_diff_release(previous_revision_cmd = None, final_revision_cmd = None, **kwargs):
    name = kwargs.get("name")
    change_cmd_name = "{}.change_cmd".format(name)
    previous_revision_cmd_name = previous_revision_cmd
    final_revision_cmd_name = final_revision_cmd
    target = kwargs.pop("target")
    generate_hashes_extra_args = kwargs.pop("generate_hashes_extra_args", [])
    get_impacted_targets_extra_args = kwargs.pop("get_impacted_targets_extra_args", [])

    if not previous_revision_cmd_name:
        previous_revision_cmd_name = "{}.previous_revision_cmd".format(name)

        task(
            name = previous_revision_cmd_name,
            cmds = [
                "git rev-parse master",
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

    _bazel_diff_release(
        name = change_cmd_name,
        generate_hashes_extra_args = generate_hashes_extra_args,
        get_impacted_targets_extra_args = get_impacted_targets_extra_args,
        target = target,
        previous_revision_cmd = previous_revision_cmd_name,
        final_revision_cmd = final_revision_cmd_name,
    )

    release(change_cmd = change_cmd_name, **kwargs)
