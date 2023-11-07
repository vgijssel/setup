load(":release_info.bzl", "ReleaseInfo")

def _release_impl(ctx):
    release_config_file = ctx.actions.declare_file(ctx.label.name + ".json")
    release_name = ctx.attr.release_name or ctx.label.name

    publish_cmds_paths = []

    for cmd in ctx.attr.publish_cmds:
        executable = cmd[DefaultInfo].files_to_run.executable
        if not executable:
            fail("publish_cmd {} is not an executable".format(cmd))

        publish_cmds_paths.append(executable.path)

    if ctx.label.workspace_name == "":
        workspace_name = ""
    else:
        # TODO: Wonder if there is a better way to get the workspace name of a locally overriden external repository
        workspace_name = "@" + ctx.label.workspace_name.rstrip("~override")

    release_config_data = {
        "name": release_name,
        "target_name": ctx.label.name,
        "label": workspace_name + "//" + ctx.label.package + ":" + ctx.label.name,
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

release = rule(
    implementation = _release_impl,
    attrs = {
        "src": attr.label(allow_single_file = True),
        "target": attr.label(mandatory = True),
        "version_file": attr.label(allow_single_file = True, mandatory = True),
        "publish_cmds": attr.label_list(),
        "release_name": attr.string(),
    },
)
