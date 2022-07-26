#!/bin/bash

# For development on a particular branch can be run as follows:
#
#    BRANCH=mg/95/create-workstation-provisioning ./workstation/bootstrap.sh
#

set -Eeou pipefail

DEVELOPMENT_DIR="$HOME/Development"
SETUP_DIR="$DEVELOPMENT_DIR/setup"
CHECKOUT_BRANCH="${BRANCH:-master}"

if [ ! -f '.env.bootstrap' ]
then
  echo "Please create a .env.bootstrap file in $(pwd)"
  exit 1
fi

# create temporary ssh askpass binary
SUDO_ASKPASS_BINARY=$(mktemp)
chmod +x "$SUDO_ASKPASS_BINARY"

# From https://stackoverflow.com/questions/8122779/is-it-necessary-to-specify-traps-other-than-exit
# remove temporary file once script is done, updating exit code if something goes wrong.
trap "rm -f $SUDO_ASKPASS_BINARY" 0
trap "exit 1" HUP INT QUIT PIPE TERM

# From https://apple.stackexchange.com/questions/23494/what-option-should-i-give-the-sudo-command-to-have-the-password-asked-through-a/23514#23514
# Prompt user for sudo password
SUDO_PASSWORD="$(osascript -e 'Tell application "System Events" to display dialog "Sudo password:" default answer "" with hidden answer' -e 'text returned of result' 2>/dev/null)"

# Setup our custom askpass binary
cat << EOF > $SUDO_ASKPASS_BINARY
#!/bin/bash
echo "$SUDO_PASSWORD"
EOF
export SUDO_ASKPASS="$SUDO_ASKPASS_BINARY"

# Check if whoami works without prompting for a password
sudo -A whoami

if test ! $(which brew); then
  echo "Installing homebrew..."
  # The empty echo makes sure we don't need to press RETURN when installing homebrew
  echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
else
    echo "Homebrew found. Skipping installation"
fi

# Prevent homebrew updating all existing packages before installing the requested packages
export HOMEBREW_NO_AUTO_UPDATE=1

if test ! $(which bazelisk); then
    echo "Installing bazelisk"
    brew install bazelisk
else
    echo "Bazelisk found. Skipping installation"
fi

if [[ ! -e "$SETUP_DIR" ]]; then
  echo "Setup directory not found, cloning."
  git clone -b "$CHECKOUT_BRANCH" https://github.com/mvgijssel/setup.git "$SETUP_DIR"
else
  echo "Setup directory found '$SETUP_DIR'. Pulling instead"
  cd "$SETUP_DIR"
  git pull origin "$CHECKOUT_BRANCH"
fi

echo "Running workstation provisioning"
bazel run //workstation:provision