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
        "./cloud-init/dev/meta-data",
        "./cloud-init/dev/vendor-data",
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

template(
    name = "vars",
    srcs = ["deploy.auto.tfvars"],
    subs = {
        "provisioner_box": ":box",
    },
    deps = [
        ":box",
    ],
)

# TODO: the vagrant box terraform module should set an environment variable for
# VAGRANT_DOTFILE_PATH to not lose the vagrant state when rebuilding
# see https://www.vagrantup.com/docs/other/environmental-variables
# terraform_module(
#     name = "vagrant_machine",
#     srcs = [
#         "Vagrantfile",
#         "vagrant_machine.tf",
#         ":box",
#     ],
# )

terraform_root(
    name = "deploy",
    files = [
        "./Vagrantfile",
        ":box",
    ],
    # modules = [
    #     "//terraform/vagrant",
    # ],
    providers = [
        "//third_party/terraform:providers",
    ],
    tf_srcs = [
        "./main.tf",
        ":vars",
    ],
    toolchain = "//third_party/terraform:terraform_1_0_3",
)

