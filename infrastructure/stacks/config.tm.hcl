globals {
  terraform_version = "1.4.2"
  cloud_workspace_name = tm_replace(terramate.stack.path.relative, "/", "-")
}