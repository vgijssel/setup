subinclude("//tools/terraform")

terraform_root(
    name = "deploy",
    files = [
        "//digitalrebar|archive",
        "//digitalrebar|tag",
        "//third_party/skopeo:bin",
    ],
    providers = [
        "//third_party/terraform:providers",
    ],
    requires = [CONFIG.PROVISIONER_PLATFORM],
    subs = {
        "backend": CONFIG.TERRAFORM_STATE,
    },
    tf_srcs = [
        "./main.tf",
    ],
    toolchain = "//third_party/terraform:terraform_1_0_3",
)