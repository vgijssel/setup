subinclude("//tools/terraform")

subinclude("//tools/terragrunt")

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
    tf_srcs = [
        "./main.tf",
    ],
    toolchain = "//third_party/terraform:terraform",
)

terragrunt_module(
    name = "terragrunt",
    dependencies = [
        "//provisioner:terragrunt",
    ],
    includes = [
        "//terragrunt:backend",
    ],
    terraform_root = ":deploy",
    visibility = ["PUBLIC"],
)
