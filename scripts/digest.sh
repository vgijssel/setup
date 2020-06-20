#!/bin/bash

set -Eeoux pipefail

IMAGE_CONFIG_FILE="$1"
source "${IMAGE_CONFIG_FILE}"

function convert_elements_to_local_dirs {
  DIR=$1
  ELEMENTS=$2
  RESULT=()

  for ELEMENT in $ELEMENTS; do
    ELEMENT_DIR="${DIR}/${ELEMENT}"

    if [[ -d "${ELEMENT_DIR}" ]]; then
      RESULT+=("${ELEMENT_DIR}")
    fi
  done

  echo ${RESULT[@]+"${RESULT[@]}"}
}

DIRS=()
DIRS+=($(convert_elements_to_local_dirs $LOCAL_ELEMENTS_DIR "${ELEMENTS}"))
DIRS+=($(convert_elements_to_local_dirs $SETUP_ELEMENTS_DIR "${ELEMENTS}"))

THIS_SCRIPT="$0"
LIST="${DIRS[@]}"

# Adding the digest.sh script into the file list as well
LIST="${THIS_SCRIPT} ${LIST}"

# Strategy generating digest from this answer
# https://unix.stackexchange.com/a/35847

# tar arguments to make it idempotent
# https://stackoverflow.com/questions/32997526/how-to-create-a-tar-file-that-omits-timestamps-for-its-contents

# Get the files from the files/directories passed in here
# which are part of git, others are ignored
# Sort the files in a consistent manner
FILES=($(git ls-files $(echo "${LIST[@]}") | LC_ALL=C sort ))

# Make sure to make all the files have the same owner, group and modification time
# --no-recursion ensures directories are not expanded as all files are already provided
# --format=gnu to use the old deterministic format
CHECKSUM=($(printf "%s\n" "${FILES[@]}" | tar --sort=name --owner=root:0 --group=root:0 --mtime='UTC 2019-01-01' --no-recursion --format=gnu -cf - -T - | sha256sum))

# calculating the relative dir path, the digest works for different systems
RELATIVE_IMAGE_DIR=$(realpath --relative-to=$SETUP_ROOT_DIR $SETUP_IMAGE_DIR)

# sha256sum returns the checksum and a placeholder "-" to represent
# that no file in the input. We're only interested in the checksum so only getting that at index 0
echo "${RELATIVE_IMAGE_DIR}/${IMAGE_NAME}-${CHECKSUM[0]}"
