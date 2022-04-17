load("@bazel_skylib//rules:copy_file.bzl", "copy_file")
load("//tools/bazel:defs.bzl", "runner_binary")

def qcow_to_vagrant_box(name, src, src_sha, tags = []):
    native.genrule(
        name = name,
        outs = [
            "{}.box".format(name),
        ],
        cmd = """
        $(execpath //tools/vagrant:qcow_to_vagrant_box) $(execpath //tools/vagrant:box.ovf) $(execpath {src}) $(OUTS) $$(cat $(execpath {src_sha}))
        """.format(src = src, src_sha = src_sha),
        srcs = [
            src,
            src_sha,
            "//tools/vagrant:box.ovf",
        ],
        tools = [
            "//tools/vagrant:qcow_to_vagrant_box",
        ],
        tags = tags,
    )
