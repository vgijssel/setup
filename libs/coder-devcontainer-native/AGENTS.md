# AGENTS.md - Coder Devcontainer Native

This library provides the Terraform configuration for Coder workspaces using **native devcontainer integration** (early access feature).

## Overview

The `coder-devcontainer-native` library deploys Docker-based development environments through Coder with native devcontainer support, providing:
- Automatic devcontainer detection and startup from `.devcontainer/devcontainer.json`
- Native integration with the Dev Containers specification
- Persistent home and docker volumes for caching
- Git repository cloning with SSH support
- VS Code Desktop integration
- Claude Code AI assistant integration with Coder MCP
- Docker-in-Docker with proper networking for nested containers
- 1Password integration for secure credential management

## Architecture

### Core Components
- **Terraform Providers**: Coder (2.11.0), Docker (3.6.2), 1Password (2.1.2)
- **Docker Container**: Based on custom workspace image with Docker-in-Docker support
- **Persistent Storage**: Separate volumes for home directory and Docker daemon data
- **Agent Setup**: Coder agent for workspace management
- **Native Devcontainer**: Uses `coder_devcontainer` resource for automatic container management

### Key Features
- **Native Devcontainer Integration**: Uses the new `coder_devcontainer` resource (early access)
- **Devcontainers CLI**: Automatically installed via module for CLI operations
- **Docker-in-Docker**: Properly configured with DNS and networking for nested containers
- **Automatic Git Setup**: Configures user credentials and commit signing
- **Resource Monitoring**: CPU, RAM, disk usage, load average, and swap metrics
- **AI Assistant**: Claude Code integration with customizable prompts and task reporting
- **Secure Credentials**: 1Password integration for GitHub tokens, API keys, and service accounts

## Configuration

### Environment Variables
The following environment variables are configured via `coder_env` resources:
- `GH_TOKEN`: GitHub personal access token for repository operations
- `HA_TOKEN`: Home Assistant API token
- `NX_KEY`: Nx Cloud access token
- `OP_SERVICE_ACCOUNT_TOKEN`: 1Password service account token
- `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`: Automatically set from workspace owner
- `GIT_COMMITTER_NAME`, `GIT_COMMITTER_EMAIL`: Automatically set from workspace owner

### Parameters
- `system_prompt`: System prompt for Claude Code AI assistant (immutable)
- `ai_prompt`: Task-specific AI prompt (mutable)
- `repo_url`: Git repository URL to clone (default: git@github.com:vgijssel/setup.git)
- `docker_socket`: Optional Docker socket URI override

### 1Password Integration
All sensitive credentials are fetched from the "setup-devenv" vault:
- `claude-code`: OAuth token for Claude Code authentication
- `github-devcontainer-agent`: GitHub token for repository access
- `haos-api`: Home Assistant API token
- `NX_KEY`: Nx Cloud access key
- `Service Account Auth Token: devenv`: 1Password service account token

## Native Devcontainer Integration

### How It Works
1. The workspace starts with a base image supporting Docker-in-Docker
2. The `coder_script` initializes Docker with proper networking for `host.docker.internal`
3. The `git-clone` module clones the specified repository
4. The `devcontainers-cli` module installs the Dev Containers CLI
5. The `coder_devcontainer` resource automatically:
   - Detects `.devcontainer/devcontainer.json` in the cloned repository
   - Builds or pulls the devcontainer image
   - Starts the devcontainer with proper configuration
   - Connects it to the Coder agent

### Devcontainer Requirements
Your repository should contain either:
- `.devcontainer/devcontainer.json` (recommended)
- `.devcontainer.json` (root level)

The devcontainer configuration will be automatically detected and applied.

## Development Workflow

### Making Changes
1. Edit the Terraform configuration files
2. Validate changes with `terraform validate`
3. Format code using `trunk fmt`
4. Run linting with `trunk check`

### Testing Changes
1. Initialize Terraform: `cd libs/coder-devcontainer-native && terraform init`
2. Validate configuration: `terraform validate`
3. Deploy to Coder: `coder templates push`
4. Create a test workspace to verify functionality

### Deploying Templates
Push changes to Coder with:
```bash
cd libs/coder-devcontainer-native
coder templates push
```

### Inspecting Terraform State
View the Terraform state of a workspace:
```bash
coder state pull <workspace_name>
```

## File Structure
- `main.tf`: Primary Terraform configuration
- `package.json`: Version management for workspace image
- `scripts/init-docker-in-docker.sh`: Docker networking setup script
- `CLAUDE.md`: Development guidelines for AI assistants
- `AGENTS.md`: This file - architecture and usage documentation

## Dependencies

### Terraform Providers
- Coder provider: 2.11.0
- Docker provider: 3.6.2
- 1Password provider: 2.1.2

### Coder Modules
- `devcontainers-cli`: 1.0.0 - Dev Containers CLI installation
- `git-clone`: 1.1.1 - Git repository cloning
- `claude-code`: 3.0.0 - Claude Code AI assistant
- `coder-login`: 1.1.0 - Coder CLI authentication
- `vscode-desktop`: 1.1.1 - VS Code Desktop integration
- `git-commit-signing`: 1.0.31 - SSH commit signing

### Container Images
- Base workspace image: `ghcr.io/vgijssel/setup/devcontainer:{version}`
  - Must support Docker-in-Docker (privileged mode)
  - Should include `sudo`, networking tools, and basic dev tools

## Best Practices

### Devcontainer Configuration
- Always include a `.devcontainer/devcontainer.json` in your repository
- Use `appPort` to expose ports from your devcontainer
- Leverage devcontainer features for tool installation
- Test devcontainers locally before deploying to Coder

### Security
- Always validate Terraform before pushing
- Keep provider and module versions pinned
- Use 1Password for all secrets
- Never commit credentials to the repository
- Review devcontainer configurations for security implications

### Performance
- Keep image versions synchronized via package.json
- Use volume lifecycle policies to prevent data loss
- Leverage Docker layer caching for faster rebuilds
- Clean up unused Docker resources in shutdown scripts

### Monitoring
- Check script execution logs in Coder UI
- Monitor resource usage via agent metadata
- Review Docker-in-Docker initialization logs
- Validate devcontainer startup success

## Differences from coder-devcontainer

| Feature | coder-devcontainer | coder-devcontainer-native |
|---------|-------------------|---------------------------|
| Devcontainer Method | Custom entrypoint | Native `coder_devcontainer` |
| Specification Support | Partial | Full Dev Containers spec |
| Container Management | Manual via Docker | Automatic via Coder |
| CLI Support | Not included | Included via module |
| Configuration | Environment variables | devcontainer.json |
| Startup Process | Single container | Workspace + devcontainer |
| Flexibility | High customization | Standards-based |

## Troubleshooting

### Devcontainer Not Starting
1. Verify `.devcontainer/devcontainer.json` exists and is valid
2. Check Docker-in-Docker initialization script logs
3. Ensure base image supports Docker (check for `docker` command)
4. Verify repository was cloned successfully

### Networking Issues
1. Check `host.docker.internal` resolution
2. Review Docker daemon configuration in `/etc/docker/daemon.json`
3. Verify DNS configuration via `init-docker-in-docker.sh` logs
4. Test connectivity from devcontainer to Coder agent

### Performance Issues
1. Check Docker volume usage: `docker system df`
2. Review container resource limits
3. Clean up unused images: `docker system prune`
4. Verify sufficient host resources

### Authentication Failures
1. Verify 1Password vault and items exist
2. Check `OP_SERVICE_ACCOUNT_TOKEN` is set correctly
3. Validate GitHub token has required permissions
4. Test Claude Code OAuth token validity
