#!/bin/bash

set -Eeoux pipefail

# echo "---------- BEFORE ---------"
# compgen -v
# echo "---------- BEFORE ---------"

source .envrc

# echo "---------- AFTER ---------"
# compgen -v
# echo "---------- AFTER ---------"

echo "---------- AFTER ---------"
echo $BASE_IMAGE
echo $IMAGE_BUILDER_IMAGE
echo $RAZOR_SERVER_IMAGE
echo "---------- AFTER ---------"


echo "::set-env name=BASE_IMAGE::yellow"
