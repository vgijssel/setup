#!/bin/bash

set -Eeou pipefail

source .envrc

# get a list of all the environment variable names
VARS=$(compgen -v)

# from: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/development-tools-for-github-actions#set-an-environment-variable-set-env
# setting environment variables in github actions

# skip the following variables
SKIP_VARS=(SHELLOPTS PPID PIPESTATUS OPTIND OPTERR IFS HISTCMD BASH_ARGC BASH_ARGV BASH_COMMAND BASH_LINENO BASH_SOURCE BASH_SUBSHELL)

for var in $VARS; do
  # if var is inside SKIP_VARS array
  if [[ " ${SKIP_VARS[@]} " =~ " ${var} " ]]; then
    # Skip rest of this particular loop iteration.
    echo "SKIPPING: ${var}"
    continue
  fi

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

if [[ $GITHUB_REF = "refs/heads/HEAD" ]]; then
  echo "GITHUB_REF value is not correct: '$GITHUB_REF', " \
       "please check if .envrc sourcing is done correctly."

  exit 1
fi
