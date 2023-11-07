load(":release_info.bzl", "ReleaseInfo")
load("@aspect_rules_js//js:defs.bzl", "js_binary")

def _common(ctx, extra_args):
    executable = ctx.actions.declare_file(ctx.label.name)
    runner_path = ctx.executable._runner.short_path

    args = [runner_path]

    for dep in ctx.attr.deps:
        for file in dep[DefaultInfo].files.to_list():
            args.append("--config")
            args.append(file.short_path)

    command = " ".join(args + extra_args)

    runfiles = ctx.runfiles(files = ctx.files.deps)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + [ctx.attr._bazel_diff] + ctx.attr.deps)
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
    extra_args = extra_args + ["--bazel-diff-args", ctx.attr.bazel_diff_args]
    return _common(ctx, extra_args)

_generate = rule(
    implementation = _generate_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_runner": attr.label(executable = True, default = Label("@rules_release//:runner"), cfg = "target"),
        "_bazel_diff": attr.label(executable = True, default = Label("@rules_release//:bazel-diff"), cfg = "target"),
        "bazel_diff_args": attr.string(),
    },
    executable = True,
)

def _version_impl(ctx):
    extra_args = ["version"]
    return _common(ctx, extra_args)

_version = rule(
    implementation = _version_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_runner": attr.label(executable = True, default = Label("@rules_release//:runner"), cfg = "target"),
        "_bazel_diff": attr.label(executable = True, default = Label("@rules_release//:bazel-diff"), cfg = "target"),
    },
    executable = True,
)

def release_manager(name, deps, bazel_diff_args = ""):
    generate_name = "{}.generate".format(name)
    version_name = "{}.version".format(name)

    _generate(
        name = generate_name,
        deps = deps,
        bazel_diff_args = bazel_diff_args,
    )

    version_name = "{}.version".format(name)
    _version(
        name = version_name,
        deps = deps,
    )
