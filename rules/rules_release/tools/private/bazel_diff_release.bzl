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

    args = [bazel_diff_cli_path, "--bazel-diff-path", bazel_diff_path]

    if ctx.attr.generate_hashes_extra_args:
        args += ["--generate_hashes_extra_args", " ".join(ctx.attr.generate_hashes_extra_args)]

    if ctx.attr.get_impacted_targets_extra_args:
        args += ["--get_impacted_targets_extra_args", " ".join(ctx.attr.get_impacted_targets_extra_args)]

    args.append(_to_label_string(ctx.attr.target.label))

    command = " ".join(args)

    runfiles = ctx.runfiles(files = ctx.files._bazel_diff + ctx.files._bazel_diff_cli)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._bazel_diff] + [ctx.attr._bazel_diff_cli])
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
        "_bazel_diff_cli": attr.label(executable = True, cfg = "target", default = Label("//tools:bazel-diff_cli")),
        "generate_hashes_extra_args": attr.string_list(default = []),
        "get_impacted_targets_extra_args": attr.string_list(default = []),
        "target": attr.label(mandatory = True),
    },
    executable = True,
)

def bazel_diff_release(**kwargs):
    name = kwargs.get("name")
    change_cmd_name = "{}.change_cmd".format(name)
    target = kwargs.pop("target")
    generate_hashes_extra_args = kwargs.pop("generate_hashes_extra_args", [])
    get_impacted_targets_extra_args = kwargs.pop("get_impacted_targets_extra_args", [])

    _bazel_diff_release(
        name = change_cmd_name,
        generate_hashes_extra_args = generate_hashes_extra_args,
        get_impacted_targets_extra_args = get_impacted_targets_extra_args,
        target = target,
    )

    release(change_cmd = change_cmd_name, **kwargs)
