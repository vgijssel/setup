#!/bin/bash

set -Eeoux pipefail

DEVELOPMENT_DIRECTORY="$HOME/Development"
SETUP_DIRECTORY="$DEVELOPMENT_DIRECTORY/setup"
CHECKOUT_BRANCH="$BRANCH"

echo "Password: "
read -s PASSWORD

if test ! $(which brew); then
  echo "Installing homebrew..."

  # Doing a call with sudo before the homebrew installation makes sure that homebrew doesn't ask for a password
  echo "$PASSWORD" | sudo -S exit 0

  # The empty echo makes sure we don't need to press RETURN when installing homebrew
  echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
else
    echo "Homebrew found. Skipping installation"
fi

# Install git and ansible which we use to install the rest
brew install git ansible

# Create the Development directory
mkdir -vp "$DEVELOPMENT_DIRECTORY"

if [[ ! -e "$SETUP_DIRECTORY" ]]; then
  echo "Setup directory not found, cloning."
  git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$DEVELOPMENT_DIRECTORY"
else
  echo "Setup directory found '$SETUP_DIRECTORY'. Skipping clone"
fi

cd "$SETUP_DIRECTORY"

# Load the environment
source .envrc

# Navigate to the dotfiles directory
cd "$SETUP_DOTFILES_DIR"

# Run the complete ansible playbook
echo "$PASSWORD" | sudo -S ansible-playbook -i inventory main.yml
