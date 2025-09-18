@AGENTS.md

# Development Guidelines for AI Assistants - Coder Devcontainer

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

### Environment Variable Handling
- Access host environment variables using `env()` function
- Pass required variables explicitly in container `env` list
- Never hardcode sensitive values

### Module Version Management
- Pin module versions for stability
- Use semantic versioning constraints (e.g., `~> 1.0`)
- Document breaking changes in commit messages

## Common Tasks

### Adding New Environment Variables
1. Add to the `env` list in `docker_container` resource
2. Use format: `"VAR_NAME=${env("VAR_NAME")}"`
3. Document the variable in AGENTS.md

### Updating Container Image Version
1. Update version in `package.json`
2. The main.tf automatically reads this version
3. Validate and push the template

### Adding New Coder Parameters
1. Define using `data.coder_parameter`
2. Create corresponding `coder_env` resource if needed
3. Update documentation

## Debugging Tips
- Check container logs in Coder UI
- Verify environment variables are set correctly
- Test Docker socket connectivity if issues arise
- Validate Terraform state consistency

## Security Considerations
- Never commit secrets to the repository
- Use environment variables for sensitive data
- Ensure proper volume permissions
- Keep container privileges minimal (only use privileged when necessary)