#!/bin/bash

set -Eeoux pipefail
DEVELOPMENT_DIR="$HOME/Development"
SETUP_DIR="$DEVELOPMENT_DIR/setup"
CHECKOUT_BRANCH="${BRANCH:-master}"
EXTRA_ANSIBLE_ARGS=''

set +x
echo "Password: "
read -s PASSWORD

# Immediately check if the password given is correct
echo "$PASSWORD" | sudo -S whoami
set -x

if test ! $(which brew); then
  echo "Installing homebrew..."

  # Doing a call with sudo before the homebrew installation makes sure that homebrew doesn't ask for a password
  set +x
  echo "$PASSWORD" | sudo -S whoami
  set -x

  # The empty echo makes sure we don't need to press RETURN when installing homebrew
  echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
else
    echo "Homebrew found. Skipping installation"
fi

# Install git and ansible which we use to install the rest
brew install git ansible || true

if [[ ! -e "$SETUP_DIR" ]]; then
  echo "Setup directory not found, cloning."
  git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$SETUP_DIR"

else
  echo "Setup directory found '$SETUP_DIR'. Pulling instead"

  cd "$SETUP_DIR"

  git pull origin "$CHECKOUT_BRANCH"
fi

cd "$SETUP_DIR"

# Load the environment
source "$SETUP_DIR/.envrc"

# Navigate to the dotfiles directory
cd "$SETUP_DOTFILES_DIR"

# Ensure that the ansible tmp directory is readable by removing it
set +x
echo "$PASSWORD" | sudo -S rm -vrf ~/.ansible/tmp
set -x

# Install ansible dependencies
ansible-galaxy install -r ./requirements.yml

# We're disabling mas here, because that requires being signed in to the Apple Store
# Which is not possible on the CI.
if [[ "$CI" = true ]]; then
  # EXTRA_ANSIBLE_ARGS="--skip-tags ci,homebrew"
  EXTRA_ANSIBLE_ARGS="-t git,files,shell"
fi

# Run the complete ansible playbook
set +x
ansible-playbook -i inventory $EXTRA_ANSIBLE_ARGS --extra-vars "ansible_sudo_pass=$PASSWORD" main.yml
set -x

# Load env for the current shell
source "$HOME/.bash_profile"

# Next steps
echo "Sync vault secrets using: 'op_sync sync'"
