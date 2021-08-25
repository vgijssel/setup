subinclude("//tools/terraform")

terraform_root(
    name = "deploy",
    files = [
        "//digitalrebar:digitalrebar_build",
        "//digitalrebar:digitalrebar_fqn",
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


