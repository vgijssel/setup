#!/usr/bin/env bash
set -euo pipefail

export GENERATE=$1
export VERSION=$2
export PUBLISH=$3

function convert_to_actual_file() {
    local file=$1
    cat $file > $file.tmp
    rm $file
    mv $file.tmp $file
}

# Convert the changelog and version into actual files,
# because the files referenced by the Bazel symlinks are readonly
convert_to_actual_file CHANGELOG_foo.md
convert_to_actual_file VERSION_foo.txt
convert_to_actual_file CHANGELOG_bar.md
convert_to_actual_file VERSION_bar.txt

$GENERATE
$VERSION
$PUBLISH