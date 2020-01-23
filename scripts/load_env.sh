#!/bin/bash

set -Eeoux pipefail

echo "---------- BEFORE ---------"
compgen -v
echo "---------- BEFORE ---------"

source .envrc

echo "---------- AFTER ---------"
compgen -v
echo "---------- AFTER ---------"

echo "::set-env name=BASE_IMAGE::yellow"
