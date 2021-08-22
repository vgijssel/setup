subinclude("//tools/terraform")

terraform_module(
    name = "vagrant",
    tf_srcs = [
        "main.tf",
        "output.tf",
        "variables.tf",
    ],
    subs = {
        "ssh_config_dir": CONFIG.SSH_CONFIG_DIR,
    },
    visibility = ["PUBLIC"],
)