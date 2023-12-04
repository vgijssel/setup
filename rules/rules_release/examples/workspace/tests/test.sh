#!/usr/bin/env bash
set -euo pipefail

export GENERATE=$1
export VERSION=$2
export PUBLISH=$3

$GENERATE
$VERSION
$PUBLISH

exit 1