subinclude("//tools/terragrunt")

terragrunt_root(
    name = "terragrunt",
    modules = [
        "//provisioner-env:terragrunt",
        "//provisioner:terragrunt",
    ],
    toolchain = "//third_party/terragrunt",
)

# TODO: maybe the backend dir is too long???
text_file(
    name = "backend",
    out = "backend.hcl",
    content = f"""
    remote_state {{
        backend = "local"
        generate = {{
            path = "backend.tf"
            if_exists = "overwrite_terragrunt"
        }}
        config = {{
            path = "${get_env("PLEASE_ROOT")}/{CONFIG.TERRAFORM_STATE}/${replace(get_terragrunt_dir(), "/", "_")}/terraform.tfstate"
        }}
    }}
    """,
    visibility = ["PUBLIC"],
)
