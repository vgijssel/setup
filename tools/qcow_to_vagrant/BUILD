export_file(
    name = "box.ovf",
    src = "box.ovf",
)

filegroup(
    name = "qcow_to_vagrant_script",
    srcs = [
        "qcow_to_vagrant.sh",
    ],
    binary = True,
    visibility = ["PUBLIC"],
    deps = [
        ":box.ovf",
    ],
)

filegroup(
    name = "qcow_to_vagrant",
    srcs = ["qcow_to_vagrant.build_defs"],
    visibility = ["PUBLIC"],
)
