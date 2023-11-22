load(":release_info.bzl", "ReleaseInfo")
load(":utils.bzl", "get_executable_from_target")

def _common(ctx, extra_args, extra_runfiles = []):
    executable = ctx.actions.declare_file(ctx.label.name)
    cli_path = ctx.executable._cli.short_path

    args = [cli_path]

    for dep in ctx.attr.deps:
        for file in dep[DefaultInfo].files.to_list():
            args.append("--config")
            args.append(file.short_path)

    command = " ".join(args + extra_args)

    runfiles = ctx.runfiles(files = ctx.files.deps)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._cli] + ctx.attr.deps + extra_runfiles)
    ])

    ctx.actions.write(
        output = executable,
        content = command,
    )

    return [
        DefaultInfo(executable = executable, runfiles = runfiles),
    ]

def _generate_impl(ctx):
    extra_args = ["generate"]
    extra_args = extra_args + ["--bazel-diff-path", ctx.executable._bazel_diff.short_path]

    if ctx.attr.bazel_diff_args:
        extra_args = extra_args + ["--bazel-diff-args", ctx.attr.bazel_diff_args]
    extra_runfiles = [ctx.attr._bazel_diff]
    return _common(ctx, extra_args, extra_runfiles)

_generate = rule(
    implementation = _generate_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_cli": attr.label(executable = True, default = Label("@rules_release//:cli"), cfg = "target"),
        "_bazel_diff": attr.label(executable = True, default = Label("@rules_release//:bazel-diff"), cfg = "target"),
        "bazel_diff_args": attr.string(),
    },
    executable = True,
)

def _version_impl(ctx):
    extra_args = ["version"]
    extra_args = extra_args + ["--changesets-path", ctx.executable._changesets_cli.short_path]
    extra_runfiles = [ctx.attr._changesets_cli]
    return _common(ctx, extra_args, extra_runfiles)

_version = rule(
    implementation = _version_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_cli": attr.label(executable = True, default = Label("@rules_release//:cli"), cfg = "target"),
        "_changesets_cli": attr.label(executable = True, default = Label("@rules_release//:changesets_cli"), cfg = "target"),
    },
    executable = True,
)

def _publish_impl(ctx):
    extra_args = ["publish"]
    extra_runfiles = []

    for cmd in ctx.attr.publish_cmds:
        executable = get_executable_from_target(cmd)
        extra_args = extra_args + ["--publish-cmd", executable.short_path]
        extra_runfiles = extra_runfiles + [cmd]

    return _common(ctx, extra_args, extra_runfiles)

_publish = rule(
    implementation = _publish_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_cli": attr.label(executable = True, default = Label("@rules_release//:cli"), cfg = "target"),
        "publish_cmds": attr.label_list(cfg = "target"),
    },
    executable = True,
)

def release_manager(name, deps, publish_cmds = [], bazel_diff_args = ""):
    generate_name = "{}.generate".format(name)
    version_name = "{}.version".format(name)
    publish_name = "{}.publish".format(name)

    _generate(
        name = generate_name,
        deps = deps,
        bazel_diff_args = bazel_diff_args,
    )

    _version(
        name = version_name,
        deps = deps,
    )

    _publish(
        name = publish_name,
        deps = deps,
        publish_cmds = publish_cmds,
    )
