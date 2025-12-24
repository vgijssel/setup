#!/usr/bin/env bash
set -euo pipefail

# Install direnv
( curl -sfL https://direnv.net/install.sh | bash ) >&2

# Install direnv into the Bash shell
# shellcheck disable=SC2016
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Allow the current project
direnv allow >&2

# Ensure Trunk CLI is installed (use absolute path since trunk is managed by Hermit)
# Get the project root directory (2 levels up from apps/codex)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
direnv exec . "$PROJECT_ROOT/bin/trunk" install --ci --verbose >&2

# Print direnv hook to stdout to be eval'ed by the calling process
direnv hook bash

# Print current envrc variables to stdout to be eval'ed by the calling process
direnv exec / direnv export bash
