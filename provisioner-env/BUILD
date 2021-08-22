subinclude("//tools/terraform")

terraform_root(
    name = "deploy",
    providers = [
        "//third_party/terraform:providers",
    ],
    subs = {
        "backend": CONFIG.TERRAFORM_BACKEND,
    },
    tf_srcs = [
        "./main.tf",
    ],
    toolchain = "//third_party/terraform:terraform_1_0_3",
)

