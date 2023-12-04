load("//release:defs.bzl", "release")
load("@rules_task//task:defs.bzl", "task")

def bazel_diff_release(**kwargs):
    name = kwargs.get("name")
    change_cmd_name = "{}_change_cmd".format(name)

    task(
        name = change_cmd_name,
        cmds = [
            "echo true",
        ],
    )

    release(change_cmd = change_cmd_name, **kwargs)
