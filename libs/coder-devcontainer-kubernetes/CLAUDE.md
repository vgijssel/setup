@AGENTS.md

# Development Guidelines for AI Assistants - Coder Devcontainer Kubernetes

## Critical Workflow Requirements

### Before Making ANY Changes
1. **ALWAYS** validate Terraform syntax first:
   ```bash
   terraform validate
   ```

### After Making Changes
1. **Format** the code:
   ```bash
   terraform fmt
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
- Use consistent formatting (enforced by terraform fmt)
- Keep resource names descriptive and follow naming patterns
- Always use lifecycle blocks for persistent resources
- Document complex expressions with inline comments
- Pin all provider and module versions

### Environment Variable Handling
- Use 1Password Connect for secret retrieval
- Pass required variables via coder_env resources
- Never hardcode sensitive values

### Kubernetes Resource Management
- All workspace resources go in `coder-workspace` namespace
- Use consistent labels for resource tracking
- Configure resource requests and limits appropriately
- Use kubevirt StorageClass for PVCs

### Module Version Management
- Pin module versions for stability
- Use semantic versioning constraints
- Document breaking changes in commit messages

## Common Tasks

### Adding New Environment Variables
1. Add 1Password item data source if needed
2. Extract value in locals block
3. Create coder_env resource

### Updating Envbuilder Configuration
1. Modify envbuilder_cached_image resource
2. Ensure cache_repo points to local registry
3. Configure git credentials if needed

### Adding New Workspace Presets
1. Define new coder_workspace_preset data source
2. Configure system_prompt parameter
3. Test with workspace creation

## Debugging Tips
- Check pod logs in coder-workspace namespace
- Verify 1Password Connect connectivity
- Test envbuilder cache hit by checking metadata
- Validate Kubernetes RBAC permissions
- Check Fleet MCP server logs via supervisord

## Security Considerations
- Never commit secrets to the repository
- Use 1Password Connect for all secret management
- Ensure proper RBAC for workspace namespace
- Keep container privileges minimal
- Review GitHub OAuth scopes
