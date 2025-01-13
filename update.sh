#!/bin/bash
set -euo pipefail
set -x

NEW_SHA="$1"

echo "echo $NEW_SHA" >> 3rdparty/kerk.sh

# Remove old symlinks
rm -f bin/kerk
rm -f bin/.kerk*

pushd "./bin";

HERMIT_PACKAGE=".kerk-0-$NEW_SHA.pkg"

ln -s hermit $HERMIT_PACKAGE 
ln -s $HERMIT_PACKAGE  kerk 

popd;
# ln -s bin/kerk $HERMIT_PACKAGE