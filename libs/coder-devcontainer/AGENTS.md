# AGENTS.md - Coder Devcontainer

This library provides the Terraform configuration for Coder workspaces using devcontainers.

## Overview

The `coder-devcontainer` library deploys Docker-based development environments through Coder, providing:
- Persistent home and workspace volumes
- Git repository cloning
- VS Code integration
- Claude Code AI assistant integration
- Development environment configuration

## Architecture

### Core Components
- **Terraform Provider**: Uses Coder and Docker providers
- **Docker Container**: Based on custom devcontainer image
- **Persistent Storage**: Separate volumes for home and workspaces
- **Agent Setup**: Coder agent for workspace management

### Key Features
- Automatic Git setup with user credentials
- Resource monitoring (CPU, RAM, disk usage)
- AI assistant integration with customizable prompts
- Docker-in-Docker support via privileged containers

## Configuration

### Environment Variables
The following environment variables are passed to the container:
- `CODER_AGENT_TOKEN`: Authentication token for Coder agent

### Parameters
- `system_prompt`: System prompt for AI assistant
- `ai_prompt`: Task-specific AI prompt (mutable)

## Development Workflow

### Making Changes
1. Edit the Terraform configuration files
2. Validate changes with `terraform validate`
3. Format code using `trunk fmt`
4. Run linting with `trunk check`

### Testing Changes
1. Build and test locally if possible
2. Deploy to a test workspace
3. Verify functionality

### Deploying Templates
Push changes to Coder with:
```bash
coder templates push
```

### Inspecting Terraform State
View the Terraform state of a workspace:
```bash
coder state pull <workspace_name>
```

## File Structure
- `main.tf`: Primary Terraform configuration
- `package.json`: Version management for devcontainer image
- Module integrations for VS Code, Claude Code, and Git

## Dependencies
- Coder provider (2.11.0)
- Docker provider (3.6.2)
- Custom devcontainer image from ghcr.io/vgijssel/setup/devcontainer

## Best Practices
- Always validate Terraform before pushing
- Keep image versions synchronized via package.json
- Preserve volume lifecycle to prevent data loss
- Use proper labeling for resource tracking