globals {
  terraform_version = "~> 1.0"
  local_tfstate_path = "${terramate.root.path.fs.absolute}/tmp/terraform/${terramate.stack.path.relative}/terraform.tfstate"
}