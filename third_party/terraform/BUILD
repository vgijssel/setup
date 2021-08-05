subinclude("@pleasings//terraform")

subinclude("//tools/terraform")

terraform_toolchain(
    name = "terraform_1_0_3",
    hashes = [
        "1de66203cf7f62ad990b6d8b583bc2caaadf8594150323f4d632a869448b85b9",  # darwin
        "99c4866ffc4d3a749671b1f74d37f907eda1d67d7fc29ed5485aeff592980644",  # linux
    ],
    version = "1.0.3",
    visibility = ["PUBLIC"],
)

terraform_lock(
    name = "providers_lock",
    providers_file = "providers.tf",
    toolchain = ":terraform_1_0_3",
    visibility = ["PUBLIC"],
)

terraform_providers(
    name = "providers",
    lock_file = ".terraform.lock.hcl",
    providers_file = "providers.tf",
    toolchain = ":terraform_1_0_3",
    visibility = ["PUBLIC"],
)