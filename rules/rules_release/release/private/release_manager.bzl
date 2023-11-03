load(":release_info.bzl", "ReleaseInfo")
load("@aspect_rules_js//js:defs.bzl", "js_binary")

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

    # TODO: turn this into an attribute of the release manager as a "runner"
    # then the rule needs to output executables which run those runners
    js_binary(
        name = name,
        entry_point = script_name,
    )
