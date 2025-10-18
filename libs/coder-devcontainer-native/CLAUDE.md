@AGENTS.md

# Development Guidelines for AI Assistants - Coder Devcontainer Native

## Critical Workflow Requirements

### Before Making ANY Changes
1. **ALWAYS** validate Terraform syntax first:
   ```bash
   terraform validate
   ```

### After Making Changes
1. **Format** the code:
   ```bash
   trunk fmt
   ```

2. **Lint** the changes:
   ```bash
   trunk check
   ```

3. **Validate** Terraform configuration:
   ```bash
   terraform validate
   ```

### Deploying Changes
Only after validation passes:
```bash
coder templates push
```

## Important Conventions

### Terraform Best Practices
- Use consistent formatting (enforced by trunk fmt)
- Keep resource names descriptive and follow naming patterns
- Always use lifecycle blocks for persistent resources
- Document complex expressions with inline comments

### Native Devcontainer Integration
- Uses the `coder_devcontainer` resource to automatically start devcontainers
- Requires the `devcontainers-cli` module for CLI support
- Relies on `coder_script` to initialize Docker-in-Docker with proper networking
- The workspace image must support Docker-in-Docker for devcontainers to work

### Environment Variable Handling
- Access host environment variables using `env()` function
- Pass required variables explicitly via `coder_env` resources
- Never hardcode sensitive values - use 1Password integration
- Git configuration is automatically set from workspace owner details

### Module Version Management
- Pin module versions for stability
- Use exact versions (e.g., `1.0.0`) for critical dependencies
- Document breaking changes in commit messages

## Common Tasks

### Adding New Environment Variables
1. Create a `coder_env` resource
2. Use format: `coder_env "var_name" { agent_id = coder_agent.main.id; name = "VAR_NAME"; value = local.var_value }`
3. Document the variable in AGENTS.md

### Updating Container Image Version
1. Update version in `package.json` under `dependencies.workspace`
2. The main.tf automatically reads this version via `local.image_version`
3. Validate and push the template

### Adding New Coder Parameters
1. Define using `data.coder_parameter`
2. Create corresponding `coder_env` resource if needed for agent access
3. Update documentation

### Working with 1Password Integration
- All secrets are fetched from the "setup-devenv" vault
- Use `try()` function for graceful handling of missing credentials
- Add postconditions to validate secret existence
- Never commit actual secrets to the repository

## Debugging Tips
- Check container logs in Coder UI for startup issues
- Verify environment variables are set correctly in the agent
- Test Docker-in-Docker initialization script separately if needed
- Validate devcontainer.json in the target repository
- Check that the git repository contains a valid devcontainer configuration
- Monitor the devcontainer startup logs via Coder's script execution UI

## Security Considerations
- Never commit secrets to the repository
- Use 1Password for all sensitive data
- Ensure proper volume permissions for Docker-in-Docker
- Keep container privileges minimal (only use privileged for Docker-in-Docker)
- The privileged flag is required for devcontainers to work with nested Docker

## Differences from coder-devcontainer
This library uses the **native devcontainer integration** introduced in Coder's early access program:
- Uses `coder_devcontainer` resource instead of custom container entrypoints
- Relies on `devcontainers-cli` module for devcontainer management
- Automatically detects and starts devcontainers from `.devcontainer/devcontainer.json`
- Better compatibility with the Dev Containers specification
- Cleaner separation between workspace container and devcontainer
