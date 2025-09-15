# libs/devenv

Development environment configuration using [chezmoi](https://www.chezmoi.io/) for dotfile management and [goss](https://github.com/goss-org/goss) for environment validation.

## Purpose

Manages developer workstation setup through templated configuration files, ensuring consistent development environments across team members. This library handles both macOS and Linux (devcontainer) environments.

## Architecture

### Chezmoi Integration
- **Template Files**: Located in `files/` directory with `.tmpl` extension
- **Data-Driven**: Uses `.chezmoidata/` for variable configuration
- **Run Scripts**: `run_onchange_*.sh.tmpl` scripts execute on configuration changes
- **Ignore Patterns**: `.chezmoiignore.tmpl` controls which files are managed

### Environment Support
- **macOS**: Native development with Homebrew packages, VS Code extensions, system preferences
- **Linux**: Devcontainer support with APT packages and container-specific configurations
- **Cross-Platform**: Shared configurations for git, SSH, shell (zsh/zim), and developer tools

## Key Components

### Configuration Files (`files/`)
- `dot_*`: Maps to home directory dotfiles (e.g., `dot_gitconfig` → `~/.gitconfig`)
- `private_*`: Files with restricted permissions (600)
- `run_onchange_*`: Scripts that execute when their hash changes
- `.chezmoidata/`: Variables and configuration data for templates

### Validation (`goss.yaml`)
Validates environment prerequisites:
- Git ≥2.34.0 (SSH commit signing support)
- SSH client availability
- Shell tools (zsh, curl, wget)
- Developer tools (fzf ≥0.51.0 for zoxide)

### Backup System (`chezmoi_backup.py`)
Three-tier backup strategy:
1. **Managed Files Backup**: Timestamp-versioned backups in `~/.setup/backup/`
2. **Untracked Files**: Preserved in `~/.setup/unmanaged/` before chezmoi manages them
3. **State Reconciliation**: Restores or cleans missing managed files

## Testing

```bash
nx test devenv
```

Runs:
1. `chezmoi apply` - Applies configuration to home directory
2. `goss validate` - Verifies environment meets requirements

## Common Workflows

### Adding New Dotfiles
1. Add template to `files/` with appropriate prefix (`dot_`, `private_`, etc.)
2. Use `.tmpl` extension if templating is needed
3. Add variables to `.chezmoidata/` if required
4. Update `goss.yaml` if new prerequisites are introduced

### Platform-Specific Configuration
- Use environment variable conditionals: `{{ if eq (env "IS_MACOS") "true" }}` or `{{ if eq (env "IS_LINUX") "true" }}`
- Separate run scripts: `run_onchange_darwin-*.sh.tmpl` vs `run_onchange_linux-*.sh.tmpl`
- Configure ignore patterns in `.chezmoiignore.tmpl` using IS_MACOS and IS_LINUX environment variables

### Environment Variables
Available in templates:
- `{{ env "IS_MACOS" }}`: "true" when running on macOS, "false" otherwise
- `{{ env "IS_LINUX" }}`: "true" when running on Linux, "false" otherwise
- `{{ env "SETUP_DIR" }}`: Path to the setup repository
- `{{ env "SETUP_BIN_DIR" }}`: Path to the setup bin directory
- `{{ .chezmoi.arch }}`: Architecture (amd64, arm64)
- `{{ .chezmoi.hostname }}`: Machine hostname
- Custom variables from `.chezmoidata/`

## Dependencies

- **chezmoi**: Dotfile management tool (installed via hermit)
- **goss**: Environment validation tool (installed via hermit)
- **uv**: Python launcher for backup script