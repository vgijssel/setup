#!/usr/bin/env bash
set -e

# devcontainer-install-extensions - Install VSCode extensions from devcontainer.json
#
# Usage: devcontainer-install-extensions.sh --file <path-to-devcontainer.json> [--output <extensions-dir>]
#
# This script reads a devcontainer.json file and installs all VSCode extensions
# specified in customizations.vscode.extensions using the VSCode CLI.

# Parse command line arguments
DEVCONTAINER_FILE=""
OUTPUT_DIR="${HOME}/.vscode-server/extensions"

while [[ $# -gt 0 ]]; do
  case $1 in
    --file)
      DEVCONTAINER_FILE="$2"
      shift 2
      ;;
    --output)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    *)
      echo "Error: Unknown option $1" >&2
      echo "Usage: devcontainer-install-extensions.sh --file <path-to-devcontainer.json> [--output <extensions-dir>]" >&2
      exit 1
      ;;
  esac
done

# Validate arguments
if [[ -z "${DEVCONTAINER_FILE}" ]]; then
  echo "Error: --file argument is required" >&2
  echo "Usage: devcontainer-install-extensions.sh --file <path-to-devcontainer.json> [--output <extensions-dir>]" >&2
  exit 1
fi

if [[ ! -f "${DEVCONTAINER_FILE}" ]]; then
  echo "Error: File not found: ${DEVCONTAINER_FILE}" >&2
  exit 1
fi

echo "Installing VSCode extensions from ${DEVCONTAINER_FILE}..."
echo "Output directory: ${OUTPUT_DIR}"

# Extract extensions list using jq
EXTENSIONS=$(jq -r '.customizations.vscode.extensions[]?' "${DEVCONTAINER_FILE}" 2>/dev/null || true)

if [[ -z "${EXTENSIONS}" ]]; then
  echo "No extensions found in ${DEVCONTAINER_FILE}"
  exit 0
fi

EXTENSION_COUNT=$(echo "${EXTENSIONS}" | wc -l | tr -d ' ' || true)
echo "Found ${EXTENSION_COUNT} extensions to install"

# Create extensions directory
mkdir -p "${OUTPUT_DIR}"

# Install each extension
echo "${EXTENSIONS}" | while read -r extension; do
  if [[ -n "${extension}" ]]; then
    echo "Installing extension: ${extension}"
    if code --extensions-dir "${OUTPUT_DIR}" --install-extension "${extension}"; then
      echo "✓ Successfully installed ${extension}"
    else
      echo "⚠ Warning: Failed to install ${extension}" >&2
    fi
  fi
done

echo "VSCode extension installation complete"
