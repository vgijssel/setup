#!/bin/bash

# Steps:
# 1. Install homebrew if does not yet exists
# 2. Install bazelisk
# 3. Run bazel //workstation:provision
#
# TODOs:
# - how to have a long running sudo session? make the sudo not expire?
# From https://apple.stackexchange.com/questions/23494/what-option-should-i-give-the-sudo-command-to-have-the-password-asked-through-a/23514#23514
# 1. Ask for sudo password using macOS prompt
# 2. Store the answer in a temporary file 
#    - setup a descructor to remove the file upon script exit (success or failure)
# 3. chmod +x the file to make it executable
# 4. set the SUDO_ASKPASS variable and point it to out temporary file
# 5. install homebrew
# 6. install bazelisk
# 7. the rest

set -Eeoux pipefail

DEVELOPMENT_DIR="$HOME/Development"
SETUP_DIR="$DEVELOPMENT_DIR/setup"
CHECKOUT_BRANCH="${BRANCH:-master}"

# create temporary ssh askpass binary
SUDO_ASKPASS_BINARY=$(mktemp)
chmod +x "$SUDO_ASKPASS_BINARY"

# From https://stackoverflow.com/questions/8122779/is-it-necessary-to-specify-traps-other-than-exit
# remove temporary file once script is done, updating exit code if something goes wrong.
trap "rm -f $SUDO_ASKPASS_BINARY" 0
trap "exit 1" HUP INT QUIT PIPE TERM

# Prompt user for sudo password
SUDO_PASSWORD="$(osascript -e 'Tell application "System Events" to display dialog "Sudo password:" default answer "" with hidden answer' -e 'text returned of result' 2>/dev/null)"

# Setup our custom askpass binary
cat << EOF > $SUDO_ASKPASS_BINARY
#!/bin/bash
echo "$SUDO_PASSWORD"
EOF
export SUDO_ASKPASS="$SUDO_ASKPASS_BINARY"

# Check if whoami works now
sudo -A whoami


# set +x
# echo "Password: "
# read -s PASSWORD

# # TODO: make the sudo session not expire?
# # Immediately check if the password given is correct
# echo "$PASSWORD" | sudo -S whoami
# set -x

# if test ! $(which brew); then
#   echo "Installing homebrew..."

#   # Doing a call with sudo before the homebrew installation makes sure that homebrew doesn't ask for a password
#   set +x
#   echo "$PASSWORD" | sudo -S whoami
#   set -x

#   # The empty echo makes sure we don't need to press RETURN when installing homebrew
#   echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
# else
#     echo "Homebrew found. Skipping installation"
# fi

# # Install git and ansible which we use to install the rest
# brew install git || true
# brew install ansible || true

# if [[ ! -e "$SETUP_DIR" ]]; then
#   echo "Setup directory not found, cloning."
#   git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$SETUP_DIR"

# else
#   echo "Setup directory found '$SETUP_DIR'. Pulling instead"

#   cd "$SETUP_DIR"

#   git pull origin "$CHECKOUT_BRANCH"
# fi

# cd "$SETUP_DIR"

# # Load the environment
# source "$SETUP_DIR/.envrc"

# # Navigate to the dotfiles directory
# cd "$SETUP_DOTFILES_DIR"

# # Ensure that the ansible tmp directory is readable by removing it
# set +x
# echo "$PASSWORD" | sudo -S rm -vrf ~/.ansible/tmp
# set -x

# # Install ansible dependencies
# ansible-galaxy collection install -r ./requirements.yml

# # Not running homebrew on the CI because that takes too long
# if [[ "$CI" = true ]]; then
#   EXTRA_ANSIBLE_ARGS="--skip-tags homebrew"
# fi

# # Run the complete ansible playbook
# set +x
# ansible-playbook -i inventory $EXTRA_ANSIBLE_ARGS --extra-vars "ansible_sudo_pass=$PASSWORD" main.yml
# set -x

# # Load env for the current shell
# source "$HOME/.bash_profile"

# # Next steps
# echo "Sync vault secrets using: 'op_sync sync'"
