#!/usr/bin/env bash
set -Eeou pipefail

set -x

SETUP_ROOT="${BUILD_WORKSPACE_DIRECTORY}"
SECRETS_DIR="${SETUP_ROOT}/tmp/remote_key"
AUTHORIZED_KEYS="${HOME}/.ssh/authorized_keys"

mkdir -p "${SECRETS_DIR}"

# if there is no private key in the secrets directory, generate one
if [[ ! -f "${SECRETS_DIR}/id_rsa" ]]; then
  ssh-keygen -t rsa -b 4096 -C "setup@setup" -N "" -f "${SECRETS_DIR}/id_rsa"
fi

# if authorized_keys does not exist, create it
if [[ ! -f "${AUTHORIZED_KEYS}" ]]; then
  touch "${AUTHORIZED_KEYS}"
fi

# Ensure the right permissions are set for SSH
chmod 600 "${AUTHORIZED_KEYS}"
chmod 700 "${HOME}/.ssh"

# add the public key to the authorized_keys file if it is not already there
PUBLIC_KEY=$(cat "${SECRETS_DIR}"/id_rsa.pub)
if ! grep -q "${PUBLIC_KEY}" "${AUTHORIZED_KEYS}"; then
  echo "${PUBLIC_KEY}" >> "${AUTHORIZED_KEYS}"
fi

# if localhost is not listening to port 22, enable macos remote login
if ! nc -z localhost 22; then
  sudo systemsetup -setremotelogin on
fi
