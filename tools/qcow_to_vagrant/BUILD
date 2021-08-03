export_file(
    name = "box.ovf",
    src = "box.ovf",
    visibility = ["PUBLIC"],
)

export_file(
    name = "qcow_to_vagrant_script",
    src = "qcow_to_vagrant.sh",
    binary = True,
    visibility = ["PUBLIC"],
)

filegroup(
    name = "qcow_to_vagrant",
    srcs = ["qcow_to_vagrant.build_defs"],
    visibility = ["PUBLIC"],
)
