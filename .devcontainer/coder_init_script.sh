#!/bin/bash
# Coder agent initialization script
# Called by devcontainer.json postStartCommand
# Executes the CODER_INIT_SCRIPT environment variable if set
#
# IMPORTANT: When using POD_MANIFEST_TEMPLATE with DevPod, CODER_INIT_SCRIPT
# must use quoted strings with explicit \n escapes, NOT YAML literal blocks (|).
# Example: value: "#!/bin/bash\necho hello\n..."
# YAML literal blocks get truncated by DevPod.

set -euo pipefail

if [ -z "${CODER_INIT_SCRIPT:-}" ]; then
    echo "CODER_INIT_SCRIPT not set, skipping Coder agent initialization"
    exit 0
fi

echo "Starting Coder agent initialization..."

# Write script to temp file and execute (safer than eval for multiline scripts)
INIT_SCRIPT_FILE=$(mktemp)
printf '%s' "$CODER_INIT_SCRIPT" > "$INIT_SCRIPT_FILE"
chmod +x "$INIT_SCRIPT_FILE"

exec "$INIT_SCRIPT_FILE"
