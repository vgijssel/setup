load("@aspect_rules_js//js:defs.bzl", "js_binary", "js_test")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def release(name, publish_cmds, target, version_file):
    pass

def release_manager(name, deps):
    write_file(
        name = name + "_file",
        out = name + "_file.js",
        content = [
            "console.log('kerk')",
        ],
    )

    js_binary(
        name = name,
        entry_point = name + "_file.js",
    )
