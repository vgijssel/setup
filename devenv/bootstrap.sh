#!/usr/bin/env bash

# For development on a particular branch can be run as follows:
#
#    BRANCH=mg/feat/update-workstation-setup ./devenv/bootstrap.sh
#

set -Eeou pipefail

function setup_gum() {
	if [ ! -f /tmp/bin/gum ]; then
		GUM_VERSION="0.14.3"
		GUM_OS="Darwin"
		GUM_CPU="arm64"

		# Download gum
		curl -L "https://github.com/charmbracelet/gum/releases/download/v${GUM_VERSION}/gum_${GUM_VERSION}_${GUM_OS}_${GUM_CPU}.tar.gz" --output /tmp/gum.tar.gz

		# Extract gum
		tar -xzf /tmp/gum.tar.gz -C /tmp

		# Rename gum
		mkdir -p /tmp/bin
		cp -vf "/tmp/gum_${GUM_VERSION}_${GUM_OS}_${GUM_CPU}/gum" /tmp/bin/gum
	fi

	export PATH="/tmp/bin:${PATH}"
}

function setup_sudo_askpass() {
	# Create temporary sudo askpass binary
	SUDO_ASKPASS_BINARY=$(mktemp)
	chmod +x "$SUDO_ASKPASS_BINARY"

	# From https://stackoverflow.com/questions/8122779/is-it-necessary-to-specify-traps-other-than-exit
	# remove temporary file once script is done, updating exit code if something goes wrong.
	trap "rm -f $SUDO_ASKPASS_BINARY" 0
	trap "exit 1" HUP INT QUIT PIPE TERM

	# Collect the sudo password until it's correct
	while true; do
		SUDO_PASSWORD=$(gum input --password --placeholder="Enter sudo password")

		# Setup our custom askpass binary
		cat <<EOF >$SUDO_ASKPASS_BINARY
#!/bin/bash
echo "$SUDO_PASSWORD"
EOF
		export SUDO_ASKPASS="$SUDO_ASKPASS_BINARY"

		set +e
		sudo --askpass whoami
		STATUS=$?
		set -e

		# check exit code
		if [ $STATUS -ne 0 ]; then
			gum log -l error "Incorrect sudo password, please try again."
		else
			break
		fi
	done
}

function setup_homebrew() {
	# Prevent homebrew updating all existing packages before installing the requested packages
	export HOMEBREW_NO_AUTO_UPDATE=1

	if test ! $(which brew); then
		gum spin --spinner dot --title "Installing homebrew..." --show-error -- /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
		gum log -l info "Homebrew installed."
	else
		gum log -l info "Homebrew found, skipping installation."
	fi

	# Ensure brew binaries are in the PATH
	export PATH="/opt/homebrew/bin:${PATH}"
}

function setup_repository() {
	export DEVELOPMENT_DIR="${HOME}/Development"
	export SETUP_DIR="${DEVELOPMENT_DIR}/setup"
	export CHECKOUT_BRANCH="${BRANCH:-master}"

	if [[ ! -e ${SETUP_DIR} ]]; then
		gum spin --spinner dot --title "Closing repository..." --show-error -- git clone -b "${CHECKOUT_BRANCH}" https://github.com/mvgijssel/setup.git "${SETUP_DIR}"
		cd "${SETUP_DIR}"
	else
		cd "${SETUP_DIR}"
		gum spin --spinner dot --title "Repository found, pulling..." --show-error -- git pull origin "${CHECKOUT_BRANCH}"
	fi
}

function setup_trunk() {
	gum spin --spinner dot --title "Installing Trunk CLI..." --show-error -- brew install --cask trunk-io
	gum spin --spinner dot --title "Installing Trunk dependencies..." --show-error -- trunk install
	# Ensure Trunk CLI tools are in the PATH
	export PATH="${SETUP_DIR}/.trunk/tools:${PATH}"
}

setup_gum
setup_sudo_askpass
# setup_homebrew
setup_repository
setup_trunk

task devenv:provision
