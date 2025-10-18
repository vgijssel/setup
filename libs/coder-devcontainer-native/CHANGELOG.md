# Changelog

All notable changes to the coder-devcontainer-native library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-18

### Added
- Initial implementation of native devcontainer integration for Coder workspaces
- Native `coder_devcontainer` resource for automatic devcontainer detection and startup
- `devcontainers-cli` module integration for CLI support
- Docker-in-Docker initialization script with proper networking for `host.docker.internal`
- 1Password integration for secure credential management
  - GitHub token support
  - Home Assistant API token
  - Nx Cloud key
  - 1Password service account token
  - Claude Code OAuth token
- Git repository cloning with configurable URL parameter
- Claude Code AI assistant integration with:
  - Customizable system and AI prompts
  - Task reporting via Coder MCP
  - Automatic workspace folder detection
- VS Code Desktop integration
- Git commit signing with SSH keys
- Persistent volumes for home directory and Docker daemon data
- Resource monitoring (CPU, RAM, disk, load, swap)
- Home Assistant external app integration
- Automatic Git configuration from workspace owner details

### Features
- Full Dev Containers specification support
- Automatic detection of `.devcontainer/devcontainer.json`
- Docker layer caching via persistent Docker volume
- Privileged mode for Docker-in-Docker support
- Custom DNS configuration for nested Docker networks
- IPtables rules for proper port forwarding
- Workspace cleanup on shutdown

### Documentation
- Comprehensive AGENTS.md with architecture and usage guide
- CLAUDE.md with development guidelines for AI assistants
- Comparison table with coder-devcontainer library
- Troubleshooting section for common issues

### Dependencies
- Terraform >= 1.0
- Coder provider 2.11.0
- Docker provider 3.6.2
- 1Password provider 2.1.2
- devcontainers-cli module 1.0.0
- git-clone module 1.1.1
- claude-code module 3.0.0
- coder-login module 1.1.0
- vscode-desktop module 1.1.1
- git-commit-signing module 1.0.31

[0.1.0]: https://github.com/vgijssel/setup/releases/tag/coder-devcontainer-native-0.1.0
