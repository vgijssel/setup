#!/usr/bin/env bash
set -Eeou pipefail

export VERSION=$1

export PREFIX="rules_task-$VERSION"
export ARCHIVE="rules_task-$VERSION.tar.gz"

git archive --format=tar --prefix=${PREFIX}/ HEAD | gzip > $ARCHIVE