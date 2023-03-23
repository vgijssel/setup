stack {
  name = "provisioner"

  after = [
    "/infrastructure/stacks/base"
  ]
}

globals {
  cloud_workspace_name = global.provisioner_workspace_name
}