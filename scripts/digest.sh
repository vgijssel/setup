#!/bin/bash

set -Eeou pipefail

THIS_SCRIPT="$0"
LIST="$@"

# Adding the digest.sh script into the file list as well
LIST="${THIS_SCRIPT} ${LIST}"

# Get the files from the files/directories passed in here
# which are part of git, others are ignored
FILES=$(git ls-files $(echo "${LIST}"))

# add this digest script to the list
# LIST="${LIST} ${SETUP_SCRIPTS_DIR}/digest.sh"

# Strategy generating digest from this answer
# https://unix.stackexchange.com/a/35847

# get the files which are in git
# sort them deterministicly
# archive them
# generate the digest from the archive
RESULT=($(git ls-files $FILES | LC_ALL=C sort | pax -w -d | sha256sum))

# sha256sum returns the checksum and a placeholder "-" to represent
# that no file in the input. We're only interested in the checksum so only getting that at index 0
echo ${RESULT[0]}
