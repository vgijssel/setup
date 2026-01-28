#!/bin/bash
# Coder agent initialization script
# Called by devcontainer.json postStartCommand
# Executes the CODER_INIT_SCRIPT environment variable if set

set -euo pipefail

if [ -z "${CODER_INIT_SCRIPT:-}" ]; then
    echo "CODER_INIT_SCRIPT not set, skipping Coder agent initialization"
    exit 0
fi

echo "Starting Coder agent initialization..."

# Debug: show the raw content
echo "DEBUG: CODER_INIT_SCRIPT length: ${#CODER_INIT_SCRIPT}"
echo "DEBUG: CODER_INIT_SCRIPT hex dump:"
echo "$CODER_INIT_SCRIPT" | head -5 | xxd || echo "$CODER_INIT_SCRIPT" | head -5 | od -c
echo "DEBUG: End of hex dump"

# Write script to temp file and execute (safer than eval for multiline scripts)
INIT_SCRIPT_FILE=$(mktemp)
printf '%s' "$CODER_INIT_SCRIPT" > "$INIT_SCRIPT_FILE"
chmod +x "$INIT_SCRIPT_FILE"

echo "DEBUG: Script file content:"
cat "$INIT_SCRIPT_FILE"
echo "DEBUG: End of script file content"

exec "$INIT_SCRIPT_FILE"
