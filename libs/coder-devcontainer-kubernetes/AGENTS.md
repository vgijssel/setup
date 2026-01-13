# AGENTS.md - Coder Devcontainer Kubernetes

This library provides the Terraform configuration for Coder workspaces using Kubernetes and the devcontainer CLI.

## Overview

The `coder-devcontainer-kubernetes` library deploys Kubernetes-based development environments through Coder, providing:
- Devcontainer CLI-based builds with Docker-in-Docker support
- Local registry caching for devcontainer layers
- Persistent workspace volumes on Kubernetes
- GitHub OAuth integration for private repository access
- 1Password Connect integration for secrets management
- Claude Code AI assistant with Fleet MCP integration
- VS Code Desktop integration
- Git commit signing support

## Architecture

### Core Components
- **Terraform Providers**: Coder, Kubernetes, 1Password
- **Kubernetes Deployment**: Pod-based workspace with Docker-in-Docker (privileged mode)
- **Devcontainer CLI**: Builds devcontainer images using standard Docker daemon
- **Local Registry**: Cluster-local registry cache for fast rebuilds
- **Fleet MCP**: Model Context Protocol server for Claude Code integration

### Key Features
- Kubernetes-native workspace deployment
- Docker-in-Docker for proper symlink handling (fixes Kaniko limitations)
- Automatic devcontainer image caching via local registry
- Integration with 1Password Connect for secrets
- GitHub external authentication for git push operations
- Role-based AI presets (Coder, Operator, Researcher)
- Resource monitoring and workspace metadata

## Configuration

### Environment Variables (via coder_env)
- `GH_TOKEN`: GitHub token from external auth
- `CLAUDE_CODE_OAUTH_TOKEN`: Claude Code authentication
- `PERPLEXITY_API_KEY`: Perplexity AI research capabilities
- `HA_TOKEN`: Home Assistant API token
- `FLEET_MCP_AUTH_TOKEN`: Fleet MCP server authentication

### Parameters
- `cpu`: Number of CPU cores for workspace
- `memory`: Memory allocation in GiB
- `workspaces_volume_size`: PVC size for /workspaces
- `git_branch`: Git branch to checkout
- `system_prompt`: AI assistant system prompt
- `ai_prompt`: Task-specific AI prompt

### Workspace Presets
- **Coder**: Software development and implementation
- **Operator**: SRE and incident response
- **Researcher**: Deep analysis and investigation

## Development Workflow

### Making Changes
1. Edit the Terraform configuration files
2. Validate changes with `terraform validate`
3. Format code using `terraform fmt`
4. Run linting with `trunk check`

### Testing Changes
1. Initialize terraform: `terraform init -backend=false`
2. Validate configuration: `terraform validate`
3. Deploy to a test workspace via Coder

### Deploying Templates
Push changes to Coder with:
```bash
coder templates push
```

## File Structure
- `main.tf`: Primary Terraform configuration
- `supervisord.conf`: Fleet MCP server management
- `Taskfile.yml`: Workspace metadata tasks
- `version.txt`: Template version tracking

## Dependencies
- Coder provider (2.11.0)
- Kubernetes provider (2.35.1)
- 1Password provider (2.1.2)
- Random provider (3.6.3)
- Git Clone module (~> 1.0)
- Devcontainers CLI module (~> 1.0)
- Claude Code module (3.4.4)
- Coder Login module (1.1.0)
- VS Code Desktop module (1.1.1)
- Git Commit Signing module (1.0.31)

## Infrastructure Requirements

### Kubernetes Cluster
- coder-workspace namespace
- kubevirt StorageClass for PVCs
- Registry deployment in coder namespace

### 1Password Connect
- Connect server at http://onepassword-connect.1password.svc.cluster.local:8080
- OP_CONNECT_TOKEN from Coder deployment

### Required Secrets in 1Password (setup-devenv vault)
- `claude-code`: Claude Code OAuth token
- `perplexity`: Perplexity API key
- `haos-api`: Home Assistant API token

## Best Practices
- Always validate Terraform before pushing
- Use workspace presets for consistent AI behavior
- Monitor devcontainer build cache performance via local registry
- Preserve PVC lifecycle to prevent data loss
- Use proper labeling for resource tracking

## Migration from Envbuilder

This template has been migrated from Envbuilder to devcontainer CLI for better symlink support:
- **Reason**: Kaniko (used by Envbuilder) doesn't properly handle symlinks, breaking Hermit bin/internal symlinks
- **Solution**: Docker-in-Docker with standard Docker daemon handles symlinks correctly
- **Caching**: Configured via devcontainer.json `build.cacheFrom` and `build.options` for registry-based caching
