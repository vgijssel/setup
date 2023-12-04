#!/usr/bin/env bash
set -euo pipefail

export GENERATE=$1
export VERSION=$2
export PUBLISH=$3

git init
echo "external" > .gitignore
git config user.email "bazel@server.bot"
git config user.name "Bazel Bot"
git add .
git commit -m "Initial commit"

echo "create foo file" > foo.foo

git add .
git commit -m "Updated foo"

echo "current dir: $(pwd)"

$GENERATE

# git log
# echo $GENERATE
# echo $VERSION
# echo $PUBLISH

exit 1