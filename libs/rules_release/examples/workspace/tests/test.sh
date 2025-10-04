#!/usr/bin/env bash
set -euo pipefail

source ./tests/unittest.bash || exit 1

export GENERATE=$1
export VERSION=$2
export PUBLISH=$3

function convert_to_actual_file() {
    local file=$1
    cat "${file}" > "${file}".tmp
    rm "${file}"
    mv "${file}".tmp "${file}"
}

# Convert the changelog and version into actual files,
# because the files referenced by the Bazel symlinks are readonly
convert_to_actual_file CHANGELOG_foo.md
convert_to_actual_file VERSION_foo.txt
convert_to_actual_file CHANGELOG_bar.md
convert_to_actual_file VERSION_bar.txt

${GENERATE}
${VERSION}
${PUBLISH} 2>&1 | tee publish_output.txt

function test_foo_updated_version() {
  assert_contains "0.0.1" "VERSION_foo.txt" 
}

function test_foo_changelog_contains_new_version() {
  assert_contains "0.0.1" "CHANGELOG_foo.md" 
}

function test_foo_publish_is_called() {
  assert_contains "Publishing foo!" "publish_output.txt" 
}

function test_final_publish_is_called() {
    assert_contains "This runs after all other releases have been published." "publish_output.txt" 
}

function test_bar_version_did_not_update() {
  assert_contains "0.0.0" "VERSION_bar.txt" 
}

function test_bar_changelog_contains_new_version() {
  assert_not_contains "0.0.0" "CHANGELOG_bar.md" 
}

run_suite "workspace test suite"