load(":release_info.bzl", "ReleaseInfo")
load("@aspect_rules_js//js:defs.bzl", "js_binary")

def _release_manager_impl(ctx):
    executable = ctx.actions.declare_file(ctx.label.name)
    runner_path = ctx.executable._runner.short_path

    args = [runner_path]

    for dep in ctx.attr.deps:
        for file in dep[DefaultInfo].files.to_list():
            args.append("--config")
            args.append(file.short_path)

    command = " ".join(args)

    runfiles = ctx.runfiles()
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + ctx.attr.deps)
    ])

    ctx.actions.write(
        output = executable,
        content = command,
    )

    return [
        DefaultInfo(executable = executable, runfiles = runfiles),
    ]

_release_manager = rule(
    implementation = _release_manager_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "_runner": attr.label(executable = True, default = Label("@rules_release//:runner"), cfg = "target"),
    },
    executable = True,
)

def release_manager(name, deps):
    _release_manager(
        name = name,
        deps = deps,
    )
