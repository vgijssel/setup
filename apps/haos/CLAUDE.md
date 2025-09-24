# haos - Home Assistant OS Configuration

Home Assistant OS configuration and automation project with YAML-based automations, scripts, scenes, and core configuration.

## Important Commands

### Sync and Deploy
```bash
nx run haos:sync
```
Syncs files between local and remote environment using unison, then automatically runs update.

### Update Configuration
```bash
nx run haos:update
```
Reloads Home Assistant configuration if validation passes. Requires `HA_TOKEN` environment variable.

### Validate Configuration
```bash
nx run haos:validate
```
Tests Home Assistant configuration endpoint using Goss validation.

## Configuration Files

- `configuration.yaml` - Main Home Assistant configuration
- `automations.yaml` - Home automation rules
- `scripts.yaml` - Reusable script sequences
- `scenes.yaml` - Predefined device states
- `secrets.yaml` - Sensitive configuration values
- `goss.yaml` - Goss validation tests

## Environment Requirements

- `HA_TOKEN` - Home Assistant API token for remote configuration updates
- Home Assistant instance accessible at `192.168.1.32:8123`