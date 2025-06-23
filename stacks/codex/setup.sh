#!/usr/bin/env bash
set -e

# Install direnv
( curl -sfL https://direnv.net/install.sh | bash ) >&2

# Install direnv into the Bash shell
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Allow the current project
direnv allow >&2

# Ensure Trunk CLI is installed
( trunk install ) >&2

# Print direnv hook to stdout to be eval'ed by the calling process
echo "$(direnv hook bash)"

# Print current envrc variables to stdout to be eval'ed by the calling process
echo "$(direnv exec / direnv export bash)"
