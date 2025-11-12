#!/bin/bash

set -euo pipefail

# Parse command line arguments
DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --dryRun=*)
      VALUE="${1#*=}"
      if [[ "${VALUE}" == "true" ]]; then
        DRY_RUN=true
      elif [[ "${VALUE}" == "false" ]]; then
        DRY_RUN=false
      else
        echo "Invalid value for --dryRun: ${VALUE} (expected true or false)"
        exit 1
      fi
      shift
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Extract version from package.json
VERSION=$(jq -r .version < "${SCRIPT_DIR}/package.json")

if [[ -z "${VERSION}" ]] || [[ "${VERSION}" = "null" ]]; then
  echo "Error: Could not extract version from package.json"
  exit 1
fi

echo "Publishing fleet-mcp version ${VERSION}"

if [[ "${DRY_RUN}" = true ]]; then
  echo "[DRY RUN] Would run:"
  echo "[DRY RUN]   uv version --dry-run ${VERSION}"
  echo "[DRY RUN]   uv publish --dry-run --trusted-publishing=always"

  uv version --dry-run "${VERSION}"
  uv publish --dry-run --trusted-publishing=always
else
  echo "Running release commands..."
  uv version "${VERSION}"
  uv publish --trusted-publishing=always

  echo "Successfully published fleet-mcp ${VERSION}"
fi
