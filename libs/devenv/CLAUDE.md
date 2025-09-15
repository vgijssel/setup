@AGENTS.md

# AI Assistant Guidelines for libs/devenv

## Critical Rules for Chezmoi Templates

### Template Syntax
- Use Go template syntax: `{{ .variable }}`
- Always check if variables exist: `{{ if .variable }}{{ .variable }}{{ end }}`
- Use pipeline for defaults: `{{ .variable | default "value" }}`

### File Naming Conventions
**NEVER modify these prefixes - they have special meaning in chezmoi:**
- `dot_` → `.` (dot_gitconfig → ~/.gitconfig)
- `private_` → Sets 600 permissions
- `run_onchange_` → Executes when content hash changes
- `run_once_` → Executes only once
- `.tmpl` suffix → Process as template

### Platform-Specific Logic
Always use environment variables for platform conditionals:
```go
{{ if eq (env "IS_MACOS") "true" }}
  # macOS specific
{{ else if eq (env "IS_LINUX") "true" }}
  # Linux specific
{{ end }}
```
**Note:** These environment variables are defined in `.envrc` and provide consistent platform detection across all tools in the setup repository.

## Working with Configuration Files

### Before Modifying
1. Check if file exists in `files/` directory
2. Verify template variables in `.chezmoidata/`
3. Test changes with `chezmoi diff` before applying

### Adding New Files
1. NEVER create arbitrary files in `files/`
2. Follow exact naming pattern (see conventions above)
3. Add corresponding goss tests if introducing new requirements

### Testing Changes
Always run in this order:
```bash
chezmoi diff    # Preview changes
nx test devenv  # Apply and validate
```

## Backup Script Guidelines

### chezmoi_backup.py Modifications
- Maintain three-tier backup strategy
- Use `uv` for Python execution
- Preserve timestamp format: YYYYMMDD-HHMMSS
- Never modify backup paths without updating documentation

### Path Structure
```
~/.setup/
├── backup/           # Timestamped managed file backups
│   └── YYYYMMDD-HHMMSS/
└── unmanaged/        # Original untracked files
```

## Common Pitfalls to Avoid

### DO NOT:
- Rename files without understanding chezmoi prefix meanings
- Add files directly to user's home - always use chezmoi
- Modify `.chezmoiignore.tmpl` without testing on both platforms
- Assume environment variables exist - always provide defaults
- Create new run scripts without `run_onchange_` or `run_once_` prefix

### ALWAYS:
- Test on both macOS and Linux when modifying platform logic
- Validate with goss after changes
- Use `.tmpl` extension for any file needing variables
- Check existing patterns in `files/` before adding new ones
- Preserve idempotency in run scripts

## Goss Test Modifications

When updating `goss.yaml`:
- Keep version constraints semantic (use semver-constraint)
- Add `meta.url` for documentation references
- Use appropriate timeout values (default: 60000ms)
- Test both stdout and stderr when relevant

## Environment-Specific Considerations

### macOS Development
- Homebrew packages in `run_onchange_darwin-install-packages.sh.tmpl`
- System preferences in `run_onchange_darwin-macos-preferences.sh.tmpl`
- VS Code extensions shared with Linux

### Linux/Devcontainer
- APT packages in `run_onchange_linux-install-packages.sh.tmpl`
- Container-optimized configurations
- Lighter system requirements than macOS

## Variable Management

### Adding New Variables
1. Define in `.chezmoidata/values.yaml`
2. Document purpose and expected values
3. Provide sensible defaults in templates
4. Update AGENTS.md with new variable documentation

### Using Variables
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