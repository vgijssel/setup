globals {
  terraform_version = "~> 1.0"
  local_tfstate_path = "${terramate.root.path.fs.absolute}/tmp/${terramate.stack.path.relative}/terraform.tfstate"
}