subinclude("//build_helpers/defs:packer")

subinclude("//tools/template")

template(
    name = "vars",
    srcs = ["vars.yml"],
    subs = {
        "digitalrebar_image": "//digitalrebar:digitalrebar_build",
        "digitalrebar_fqn": "//digitalrebar:digitalrebar_fqn",
    },
    deps = [
        "//digitalrebar:digitalrebar_build",
        "//digitalrebar:digitalrebar_fqn",
    ],
)

packer(
    name = "image",
    ansible_arguments = [
        "--extra-vars",
        "@$(location :vars)",
    ],
    ansible_playbook = "playbook.yml",
    # TODO: we can just provide a directory!
    # TODO: maybe just inject these in packer since they are only
    # used for ssh access and removed later on. For security purposes
    # maybe even random generate a SSH keypair.
    cd_files = [
        "./cloud-init/dev/user-data",
        "./cloud-init/dev/meta-data",
        "./cloud-init/dev/vendor-data",
    ],
    deps = [
        "./cloud-init",
        ":vars",
        "//digitalrebar:digitalrebar_build",
    ],
)
