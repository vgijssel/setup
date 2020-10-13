#!/bin/bash

set -Eeoux pipefail

DEVELOPMENT_DIRECTORY="$HOME/Development"
SETUP_DIRECTORY="$DEVELOPMENT_DIRECTORY/setup"
CHECKOUT_BRANCH="${BRANCH:-master}"

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

if [[ ! -e "$SETUP_DIRECTORY" ]]; then
  echo "Setup directory not found, cloning."
  git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$SETUP_DIRECTORY"

else
  echo "Setup directory found '$SETUP_DIRECTORY'. Pulling instead"

  cd "$SETUP_DIRECTORY"

  git pull
fi

cd "$SETUP_DIRECTORY"

# Load the environment
source .envrc

# Navigate to the dotfiles directory
cd "$SETUP_DOTFILES_DIR"

# Ensure that the ansible tmp directory is readable by removing it
set +x
echo "$PASSWORD" | sudo -S rm -vrf ~/.ansible/tmp
set -x

# Install ansible dependencies
ansible-galaxy install -r ./requirements.yml

# Run the complete ansible playbook
set +x
echo "$PASSWORD" | sudo -S ansible-playbook -i inventory main.yml
set -x

# Next steps
echo "Now signin with 1password: 'eval \$(op signin my.1password.com)'"
echo "And run: 'op_sync sync'"
