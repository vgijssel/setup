subinclude("//build_helpers/defs:packer")

subinclude("//tools/template")

subinclude("//tools/qcow_to_vagrant")

subinclude("//tools/terraform")

packer(
    name = "image",
    ansible_playbook = "playbook.yml",
    # TODO: we can just provide a directory!
    # TODO: maybe just inject these in packer since they are only
    # used for ssh access and removed later on. For security purposes
    # maybe even random generate a SSH keypair.
    cd_files = [
        "./cloud-init/dev/user-data",
        "./cloud-init/meta-data",
        "./cloud-init/vendor-data",
    ],
    deps = [
        "./cloud-init",
        "//digitalrebar:digitalrebar_build",
    ],
)

qcow_to_vagrant(
    name = "box",
    src = ":image|image",
)

terraform_root(
    name = "deploy",
    files = [
        "./Vagrantfile",
        ":box",
    ],
    modules = [
        "//terraform/vagrant",
    ],
    providers = [
        "//third_party/terraform:providers",
    ],
    subs = {
        "backend": CONFIG.TERRAFORM_STATE,
    },
    tf_srcs = [
        "./main.tf",
    ],
    toolchain = "//third_party/terraform:terraform_1_0_3",
)

