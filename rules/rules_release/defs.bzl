load("@aspect_rules_js//js:defs.bzl", "js_binary", "js_test")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

ReleaseInfo = provider(
    doc = "Release Info",
    fields = {
        "name": "Name of the release",
    },
)

def _release_impl(ctx):
    release_info = ReleaseInfo(
        name = ctx.label.name,
    )

    return [
        release_info,
        DefaultInfo(),
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

def _release_manager_script_impl(ctx):
    print(ctx.attr.deps[0][ReleaseInfo])

    script_file = ctx.actions.declare_file("script.js")

    ctx.actions.write(
        output = script_file,
        content = """
        console.log("kerk")
        """,
    )

    return [
        DefaultInfo(files = depset([script_file])),
    ]

_release_manager_script = rule(
    implementation = _release_manager_script_impl,
    attrs = {
        "deps": attr.label_list(providers = [ReleaseInfo]),
    },
)

def release_manager(name, deps):
    generate_name = "{}.generate".format(name)
    script_name = "{}.script".format(name)

    _release_manager_script(
        name = script_name,
        deps = deps,
    )

    native.alias(
        name = generate_name,
        actual = "@rules_release//:generate",
    )

    js_binary(
        name = name,
        entry_point = script_name,
    )
