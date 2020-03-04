#!/bin/bash

set -Eeoux pipefail

RUN_ID="$1"
export ARTIFACT_NAME="$2"

curl -v -L -u mvgijssel:$REGISTRY_GITHUB_TOKEN https://api.github.com/repos/mvgijssel/setup/actions/runs/$RUN_ID/artifacts -o run_artifacts.json

URL=$(cat run_artifacts.json | jq --raw-output '.artifacts | .[] | select(.name == env.ARTIFACT_NAME) | .archive_download_url')

echo $URL
