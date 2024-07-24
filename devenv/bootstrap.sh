#!/usr/bin/env bash

# For development on a particular branch can be run as follows:
#
#    BRANCH=mg/feat/update-workstation-setup ./devenv/bootstrap.sh
#

set -Eeou pipefail

DEVELOPMENT_DIR="$HOME/Development"
SETUP_DIR="$DEVELOPMENT_DIR/setup"
CHECKOUT_BRANCH="${BRANCH:-master}"

if test ! $(which brew); then
	echo "Installing homebrew..."
	# The empty echo makes sure we don't need to press RETURN when installing homebrew
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
	echo "Homebrew found. Skipping installation"
fi

# Ensure brew binaries are in the PATH
export PATH="/opt/homebrew/bin:$PATH"

# Prevent homebrew updating all existing packages before installing the requested packages
export HOMEBREW_NO_AUTO_UPDATE=1

if [[ ! -e $SETUP_DIR ]]; then
	echo "Setup directory not found, cloning."
	git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$SETUP_DIR"
	cd "$SETUP_DIR"
else
	echo "Setup directory found '$SETUP_DIR'. Pulling instead"
	cd "$SETUP_DIR"
	git pull origin "$CHECKOUT_BRANCH"
fi

brew install --cask trunk-io
trunk install

# Ensure Trunk CLI tools are in the PATH
export PATH="$SETUP_DIR/.trunk/tools:$PATH"

task devenv:provision
