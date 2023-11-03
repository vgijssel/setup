load(":release_info.bzl", "ReleaseInfo")

def _release_impl(ctx):
    release_info = ReleaseInfo(
        name = ctx.label.name,
    )

    runfiles = ctx.runfiles(files = ctx.files.version_file + ctx.files.target + ctx.files.publish_cmds)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in (ctx.attr.publish_cmds + [ctx.attr.target])
    ])

    return [
        release_info,
        DefaultInfo(runfiles = runfiles),
    ]

_release = rule(
    implementation = _release_impl,
    attrs = {
        "src": attr.label(allow_single_file = True),
        "target": attr.label(mandatory = True),
        "version_file": attr.label(allow_single_file = True, mandatory = True),
        "publish_cmds": attr.label_list(),
    },
)

def release(name, publish_cmds, target, version_file):
    _release(
        name = name,
        publish_cmds = publish_cmds,
        target = target,
        version_file = version_file,
    )
