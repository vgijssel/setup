#!/bin/bash

# See https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/ for what this `set` means
set -Eeou pipefail

source ../.envrc

PRIVATE_KEY_PATH="${SETUP_RAZOR_SERVER_DIR}/keys/id_rsa"
DISABLE_HOST_CHECKING="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
ARGS="$@"

ssh -v -i ${PRIVATE_KEY_PATH} ${DISABLE_HOST_CHECKING} -o ProxyCommand="ssh -v ${DISABLE_HOST_CHECKING} -i ${PRIVATE_KEY_PATH} -l vagrant -p ${VAGRANT_BASTION_HOST_PORT} -W '[%h]:%p' 127.0.0.1" ${ARGS}
