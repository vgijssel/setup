load(":release_info.bzl", "ReleaseInfo")

def _release_impl(ctx):
    release_config_file = ctx.actions.declare_file(ctx.label.name + ".json")

    publish_cmds_paths = []

    for cmd in ctx.attr.publish_cmds:
        executable = cmd[DefaultInfo].files_to_run.executable
        if not executable:
            fail("publish_cmd {} is not an executable".format(cmd))

        publish_cmds_paths.append(executable.path)

    release_config_data = {
        "name": ctx.label.name,
        "version_file": ctx.file.version_file.short_path,
        "publish_cmds": publish_cmds_paths,
    }

    ctx.actions.write(
        output = release_config_file,
        content = json.encode(release_config_data),
    )

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
        DefaultInfo(files = depset([release_config_file]), runfiles = runfiles),
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

def release(name, target, version_file, publish_cmds = []):
    _release(
        name = name,
        publish_cmds = publish_cmds,
        target = target,
        version_file = version_file,
    )
