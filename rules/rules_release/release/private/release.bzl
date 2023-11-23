load(":release_info.bzl", "ReleaseInfo")
load("@aspect_rules_js//js:defs.bzl", "js_run_binary")
load(":utils.bzl", "get_executable_from_target")

def _to_label_string(label):
    if label.workspace_name == "":
        workspace_name = ""
    else:
        # TODO: Wonder if there is a better way to get the workspace name of a locally overriden external repository
        workspace_name = "@" + label.workspace_name.removesuffix("~override")

    return workspace_name + "//" + label.package + ":" + label.name

def _release_impl(ctx):
    release_config_file = ctx.actions.declare_file(ctx.label.name + ".json")
    release_name = ctx.attr.release_name or ctx.label.name

    publish_cmds_paths = []

    for cmd in ctx.attr.publish_cmds:
        executable = get_executable_from_target(cmd)
        publish_cmds_paths.append(executable.short_path)

    release_config_data = {
        "name": release_name,
        "target_name": ctx.label.name,
        "label": _to_label_string(ctx.label),
        "version_file": ctx.file.version_file.short_path,
        "changelog_file": ctx.file.changelog_file.short_path,
        "publish_cmds": publish_cmds_paths,
        "deps": [dep[ReleaseInfo].name for dep in ctx.attr.deps],
    }

    ctx.actions.write(
        output = release_config_file,
        content = json.encode(release_config_data),
    )

    release_info = ReleaseInfo(
        name = release_name,
    )

    runfiles = ctx.runfiles(files = ctx.files.version_file + ctx.files.target + ctx.files.publish_cmds + ctx.files.deps + [ctx.file.changelog_file])
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in (ctx.attr.publish_cmds + [ctx.attr.target] + ctx.attr.deps)
    ])

    return [
        release_info,
        DefaultInfo(files = depset([release_config_file]), runfiles = runfiles),
    ]

_release = rule(
    implementation = _release_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "target": attr.label(mandatory = True),
        "version_file": attr.label(allow_single_file = True, mandatory = True),
        "publish_cmds": attr.label_list(cfg = "target"),
        "release_name": attr.string(),
        "changelog_file": attr.label(allow_single_file = True, mandatory = True),
    },
)

def release(**kwargs):
    name = kwargs.get("name")
    version_changelog_name = "{}.version_changelog".format(name)
    version_changelog_out_file = "{}.out".format(version_changelog_name)

    _release(**kwargs)

    js_run_binary(
        name = version_changelog_name,
        tool = "@rules_release//release/private:version_changelog",
        srcs = [
            kwargs.get("version_file"),
            kwargs.get("changelog_file"),
        ],
        outs = [
            version_changelog_out_file,
        ],
        args = [
            "$(location {})".format(kwargs.get("version_file")),
            "$(location {})".format(kwargs.get("changelog_file")),
            "$(rootpath {})".format(version_changelog_out_file),
        ],
    )
