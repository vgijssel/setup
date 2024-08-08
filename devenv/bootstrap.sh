#!/usr/bin/env bash

# For development on a particular branch can be run as follows:
#
#    BRANCH=mg/feat/update-workstation-setup ./devenv/bootstrap.sh
#

set -Eeou pipefail

export DEVELOPMENT_DIR="${HOME}/Development"
export SETUP_DIR="${DEVELOPMENT_DIR}/setup"

function setup_gum() {
	if [[ ! -f /tmp/bin/gum ]]; then
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
	export GUM_SPIN_SHOW_ERROR=true
	export GUM_SPIN_SPINNER=dot

	gum log -l info --time TimeOnly "Done setting up gum."
}

function setup_sudo_askpass() {
	# Create temporary sudo askpass binary
	SUDO_ASKPASS_BINARY=$(mktemp)
	chmod +x "${SUDO_ASKPASS_BINARY}"

	# From https://stackoverflow.com/questions/8122779/is-it-necessary-to-specify-traps-other-than-exit
	# remove temporary file once script is done, updating exit code if something goes wrong.
	trap 'rm -f ${SUDO_ASKPASS_BINARY}' 0
	trap "exit 1" HUP INT QUIT PIPE TERM

	# Collect the sudo password until it's correct
	while true; do
		SUDO_PASSWORD=$(gum input --password --placeholder="Enter sudo password")

		# Setup our custom askpass binary
		cat <<EOF >"${SUDO_ASKPASS_BINARY}"
#!/bin/bash
echo "${SUDO_PASSWORD}"
EOF
		export SUDO_ASKPASS="${SUDO_ASKPASS_BINARY}"

		set +e
		sudo --askpass whoami >/dev/null
		STATUS=$?
		set -e

		# check exit code
		if [[ ${STATUS} -ne 0 ]]; then
			gum log -l error "Incorrect sudo password, please try again."
		else
			break
		fi
	done

	gum log -l info --time TimeOnly "Done setting up sudo askpass."
}

function setup_homebrew() {
	# Prevent homebrew updating all existing packages before installing the requested packages
	export HOMEBREW_NO_AUTO_UPDATE=1

	if test ! "$(command -v brew || true)"; then
		HOMEBREW_SCRIPT="$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
		gum spin --title "Installing homebrew..." -- /bin/bash -c "${HOMEBREW_SCRIPT}"
		gum log -l info --time TimeOnly "Homebrew installed."
	fi

	# Ensure brew binaries are in the PATH
	export PATH="/opt/homebrew/bin:${PATH}"

	gum log -l info --time TimeOnly "Done setting up homebrew"
}

function setup_repository() {
	export CHECKOUT_BRANCH="${BRANCH:-master}"

	if [[ ! -e ${SETUP_DIR} ]]; then
		gum spin --title "Closing repository..." -- git clone -b "${CHECKOUT_BRANCH}" https://github.com/mvgijssel/setup.git "${SETUP_DIR}"
		cd "${SETUP_DIR}"
	else
		cd "${SETUP_DIR}"
		gum spin --title "Repository found, pulling..." -- git pull origin "${CHECKOUT_BRANCH}"
	fi

	gum log -l info --time TimeOnly "Done setting up repository."
}

function setup_trunk() {
	gum spin --title "Installing Trunk CLI..." -- brew install --cask trunk-io
	gum spin --title "Installing Trunk CLI dependencies..." -- trunk install
	# Ensure Trunk CLI tools are in the PATH
	export PATH="${SETUP_DIR}/.trunk/tools:${PATH}"

	gum log -l info --time TimeOnly "Done setting up Trunk CLI."
}

function provision() {
	gum spin --title "Provisioning workstation..." -- task devenv:provision

	gum log -l info --time TimeOnly "Done provisioning workstation."
}

function next_steps() {
	gum pager <"${SETUP_DIR}/devenv/README.md"
}

setup_gum
setup_sudo_askpass
setup_homebrew
setup_repository
setup_trunk
provision
next_steps
