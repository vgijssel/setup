#!/usr/bin/env bash
# NOTE: this is a modification of the original pre-commit pre-push hook which you can generate with:
# `pre-commit install --hook-type pre-push`

ARGS=(hook-impl --config=.pre-commit-config.yaml --hook-type=pre-push)
HERE="/workspaces/setup"
ARGS+=(--hook-dir "${HERE}" -- "$@")
DEVCONTAINER="setup-devcontainer"
COMMAND="aspect run //tools/pre-commit -- --color always ${ARGS[@]}"

if [ "$( docker container inspect -f '{{.State.Running}}' $DEVCONTAINER )" == "true" ]; then
    docker exec -t -w $HERE $DEVCONTAINER /bin/bash -l -c $COMMAND
else
   echo "${DEVCONTAINER} is not running, skipping pre-commit." 
   exit 0
fi