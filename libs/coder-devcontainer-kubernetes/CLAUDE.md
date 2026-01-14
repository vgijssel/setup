# Coder Devcontainer Kubernetes

## Development Workflow

1. Make changes to Terraform template
2. Run `terraform validate` to check syntax
3. Push template to Coder with `coder templates push`
4. Create test workspace with `coder create`
5. Monitor workspace startup and app health with `coder list` and `coder apps`
6. Validate logs with `kubectl logs` if needed
7. Delete workspace with `coder delete` if issues found
8. Repeat until working correctly

## Debugging

Use `coder ssh` and check files in `/tmp` directory.

## Envbuilder Symlink Caveat

Envbuilder images handle symlinks differently than Docker images. Always copy directories with symlinks to a location outside the workspace, then copy them into place using a `RUN` statement.
