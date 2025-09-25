load("@aspect_rules_js//js:defs.bzl", "js_run_binary")
load(":release_info.bzl", "ReleaseInfo")
load(":utils.bzl", "get_executable_from_target")

def _release_impl(ctx):
    release_config_file = ctx.actions.declare_file(ctx.label.name + ".json")
    release_name = ctx.attr.release_name

    publish_cmds_paths = []

    for cmd in ctx.attr.publish_cmds:
        executable = get_executable_from_target(cmd)
        publish_cmds_paths.append(executable.short_path)

    release_config_data = {
        "change_cmd": get_executable_from_target(ctx.attr.change_cmd).short_path,
        "changelog_file": ctx.file.changelog_file.short_path,
        "deps": [dep[ReleaseInfo].name for dep in ctx.attr.deps],
        "name": release_name,
        "publish_cmds": publish_cmds_paths,
        "version_file": ctx.file.version_file.short_path,
    }

    ctx.actions.write(
        output = release_config_file,
        content = json.encode(release_config_data),
    )

    release_info = ReleaseInfo(
        name = release_name,
    )

    runfiles = ctx.runfiles(files = ctx.files.version_file + ctx.files.publish_cmds + ctx.files.deps + [ctx.file.changelog_file] + ctx.files.change_cmd)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in (ctx.attr.publish_cmds + ctx.attr.deps + [ctx.attr.change_cmd])
    ])

    return [
        release_info,
        DefaultInfo(files = depset([release_config_file]), runfiles = runfiles),
    ]

_release = rule(
    implementation = _release_impl,
    attrs = {
        "change_cmd": attr.label(cfg = "target", mandatory = True),
        "changelog_file": attr.label(allow_single_file = True, mandatory = True),
        "deps": attr.label_list(providers = [ReleaseInfo]),
        "publish_cmds": attr.label_list(cfg = "target"),
        "release_name": attr.string(mandatory = True),
        "version_file": attr.label(allow_single_file = True, mandatory = True),
    },
)

def release(**kwargs):
    name = kwargs.get("name")
    release_name = kwargs.pop("release_name") or name

    version_changelog_name = "{}.version_changelog".format(name)
    version_changelog_out_file = "{}.out".format(version_changelog_name)

    version_name = "{}.version".format(name)
    version_out_file = "{}.out".format(version_name)

    release_file_name = "{}.release_name".format(name)
    release_file_out_file = "{}.out".format(release_name)

    changelog_name = "{}.changelog".format(name)
    changelog_out_file = "{}.out".format(changelog_name)

    _release(release_name = release_name, **kwargs)

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

    native.genrule(
        name = version_name,
        srcs = [
            kwargs.get("version_file"),
        ],
        outs = [
            version_out_file,
        ],
        cmd = "cat $(location {}) > $(OUTS)".format(kwargs.get("version_file")),
    )

    native.genrule(
        name = release_file_name,
        outs = [
            release_file_out_file,
        ],
        cmd = "echo {} > $(OUTS)".format(release_name),
    )

    native.genrule(
        name = changelog_name,
        srcs = [
            kwargs.get("changelog_file"),
        ],
        outs = [
            changelog_out_file,
        ],
        cmd = "cat $(location {}) > $(OUTS)".format(kwargs.get("changelog_file")),
    )
