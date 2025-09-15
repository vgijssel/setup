# Coder Devcontainer Template

A Coder template that automatically provisions development environments using the devcontainer specification from the vgijssel/setup repository.

## Overview

This template uses [Coder's envbuilder provider](https://registry.terraform.io/providers/coder/envbuilder/latest/docs) to build and run devcontainers, ensuring consistent development environments with full Docker-in-Docker support.

## Features

- **Automatic Devcontainer Build**: Uses envbuilder to build containers from `.devcontainer/devcontainer.json`
- **Git Repository Integration**: Clones https://github.com/vgijssel/setup to `/workspaces/setup`
- **Docker-in-Docker Support**: Full Docker socket access for container development
- **Workspace Persistence**: Volumes preserve workspace data across rebuilds
- **IDE Support**: Integrated code-server and JetBrains Gateway support
- **Caching**: Optional container registry caching for faster builds

## Configuration

### Repository Settings
- **Default Repository**: https://github.com/vgijssel/setup
- **Workspace Path**: `/workspaces/setup` (required for devcontainer internals)
- **Devcontainer Location**: `.devcontainer/devcontainer.json`

### Build Settings
- **Builder Image**: ghcr.io/coder/envbuilder:latest
- **Fallback Image**: codercom/enterprise-base:ubuntu

### Optional Features
- **Cache Repository**: Configure a container registry for build caching
- **Custom Repository**: Override the default repository URL

## Environment Variables

The template sets these key environment variables for envbuilder:
- `ENVBUILDER_WORKSPACE_FOLDER`: `/workspaces/setup`
- `ENVBUILDER_DEVCONTAINER_DIR`: `/workspaces/setup/.devcontainer`
- `ENVBUILDER_GIT_URL`: Repository URL
- `ENVBUILDER_FALLBACK_IMAGE`: Fallback container image

## Testing

```bash
nx test coder-devcontainer
```

## Deployment

Upload this template to your Coder instance:

```bash
coder template push coder-devcontainer \
  --directory libs/coder-devcontainer \
  --yes
```

## Requirements

- Coder v2.0+
- Docker daemon access
- Network access to GitHub and container registries