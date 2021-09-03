subinclude("//build_helpers/defs:packer")

subinclude("//tools/template")

subinclude("//tools/qcow_to_vagrant")

subinclude("//tools/terraform")

subinclude("//tools/terragrunt")

packer(
    name = "image",
    ansible_playbook = "build.yml",
    # TODO: we can just provide a directory!
    # TODO: maybe just inject these in packer since they are only
    # used for ssh access and removed later on. For security purposes
    # maybe even semi-random generate a SSH keypair.
    cd_files = [
        "./cloud-init/dev/user-data",
        "./cloud-init/meta-data",
        "./cloud-init/vendor-data",
    ],
    deps = [
        "./cloud-init",
    ],
)

qcow_to_vagrant(
    name = "box",
    src = ":image|image",
)

sh_cmd(
    name = "provision",
    cmd = """
    PLAYBOOK="$PLEASE_ROOT/$(out_location provision.yml)"

    $PLEASE_ROOT/$(out_location //third_party/ansible|ansible-playbook) -i provisioner, $PLAYBOOK
    """,
    paths = [
        "//tools/ssh",
    ],
    deps = [
        "//third_party/ansible",
    ],
)

terraform_root(
    name = "deploy",
    files = [
        "./Vagrantfile",
        ":box",
        ":provision",
    ],
    modules = [
        "//terraform/vagrant",
    ],
    providers = [
        "//third_party/terraform:providers",
    ],
    tf_srcs = [
        "./main.tf",
    ],
    toolchain = "//third_party/terraform:terraform_1_0_3",
    visibility = ["PUBLIC"],
)

terragrunt_module(
    name = "terragrunt",
    includes = [
        "//terragrunt:backend",
    ],
    terraform_root = ":deploy",
    visibility = ["PUBLIC"],
)