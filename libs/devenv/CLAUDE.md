@AGENTS.md

# AI Assistant guidelines for libs/devenv

## Critical rules for Chezmoi templates

### Template syntax
- Use Go template syntax: `{{ .variable }}`
- Always check if variables exist: `{{ if .variable }}{{ .variable }}{{ end }}`
- Use pipeline for defaults: `{{ .variable | default "value" }}`

### File naming conventions
**NEVER modify these prefixes - they have special meaning in chezmoi:**
- `dot_` → `.` (dot_gitconfig → ~/.gitconfig)
- `private_` → Sets 600 permissions
- `run_onchange_` → Executes when content hash changes
- `run_once_` → Executes only once
- `.tmpl` suffix → Process as template

### Platform-specific logic
Always use environment variables for platform conditionals:
```go
{{ if eq (env "IS_MACOS") "true" }}
  # macOS specific
{{ else if eq (env "IS_LINUX") "true" }}
  # Linux specific
{{ end }}
```
**Note:** these environment variables are defined in `.envrc` and provide consistent platform detection across all tools in the setup repository.

## Working with configuration files

### Before modifying
1. Check if file exists in `files/` directory
2. Verify template variables in `.chezmoidata/`
3. Test changes with `chezmoi diff` before applying

### Adding new files
1. NEVER create arbitrary files in `files/`
2. Follow exact naming pattern (see conventions preceding)
3. Add corresponding goss tests if introducing new requirements

### Testing changes
Always run in this order:
```bash
chezmoi diff    # Preview changes
nx test devenv  # Apply and validate
```

## Backup script guidelines

### `chezmoi_backup.py` modifications
- Maintain three-tier backup strategy
- Use `uv` for Python execution
- Preserve timestamp format—YYYYMMDD-HHMMSS
- Never modify backup paths without updating documentation

### Path structure
```
~/.setup/
├── backup/           # Timestamped managed file backups
│   └── YYYYMMDD-HHMMSS/
└── unmanaged/        # Original untracked files
```

## Common pitfalls to avoid

### Never do the following
- Rename files without understanding chezmoi prefix meanings
- Add files directly to user's home - always use chezmoi
- Modify `.chezmoiignore.tmpl` without testing on both platforms
- Assume environment variables exist - always provide defaults
- Create new run scripts without `run_onchange_` or `run_once_` prefix

### Always do the following
- Test on both macOS and Linux when modifying platform logic
- Validate with goss after changes
- Use `.tmpl` extension for any file needing variables
- Check existing patterns in `files/` before adding new ones
- Preserve idempotency in run scripts

## Goss test modifications

When updating `goss.yaml`:
- Keep version constraints semantic (use semver-constraint)
- Add `meta.url` for documentation references
- Use appropriate timeout values (default: 60000 ms)
- Test both stdout and stderr when relevant

## Environment-specific considerations

### Development on macOS
- Homebrew packages in `run_onchange_darwin-install-packages.sh.tmpl`
- System preferences in `run_onchange_darwin-macos-preferences.sh.tmpl`
- VS Code extensions shared with Linux

### Linux/devcontainer
- APT packages in `run_onchange_linux-install-packages.sh.tmpl`
- Container-optimized configurations
- Lighter system requirements than macOS

## Variable management

### Adding new variables
1. Define in `.chezmoidata/values.yaml`
2. Document purpose and expected values
3. Provide sensible defaults in templates
4. Update AGENTS.md with new variable documentation

### Using variables
```go
# Safe usage with default
{{ .myvar | default "fallback" }}

# Conditional usage
{{ if .settings.feature }}
  {{ .settings.feature.value }}
{{ end }}

# OS-specific with variable
{{ if and (eq (env "IS_MACOS") "true") .darwin.specific }}
  {{ .darwin.specific }}
{{ end }}
```
