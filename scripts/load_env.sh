#!/bin/bash

set -Eeou pipefail

source .envrc

VARS=$(compgen -v)

# from: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/development-tools-for-github-actions#set-an-environment-variable-set-env
# setting environment variables in github actions

for var in $VARS; do
    # from: https://stackoverflow.com/a/30205555
    # if the variable $var does not exist
  if [ -z ${!var+x} ]; then
      # set an empty environment variable
      echo "::set-env name=$var::"
  else
      # set the value of $var in the env
      echo "::set-env name=$var::${!var}"
  fi
done
