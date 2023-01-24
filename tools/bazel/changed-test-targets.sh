#!/usr/bin/env bash
# copied from https://github.com/Tinder/bazel-diff/blob/master/bazel-diff-example.sh

set -Eeou pipefail

current_branch=$(git rev-parse --abbrev-ref HEAD)
current_commit=$(git rev-parse HEAD)

if [[ "$current_branch" == "master" ]]; then
  previous_commit=$(git rev-parse $current_commit^)
else
  # from https://stackoverflow.com/questions/1527234/finding-a-branch-point-with-git/71193866#71193866
  current_branch_first_commit=$(git rev-list --exclude-first-parent-only ^origin/master $current_branch | tail -1)
  previous_commit=$(git rev-parse $current_branch_first_commit^)
fi

# Path to your Bazel WORKSPACE directory
workspace_path="$BUILD_WORKSPACE_DIRECTORY"

# # Path to your Bazel executable
bazel_path="$(which bazel)"

# Starting Revision SHA
previous_revision=$previous_commit
# Final Revision SHA
final_revision=$current_commit

starting_hashes_json="/tmp/starting_hashes.json"
final_hashes_json="/tmp/final_hashes.json"
impacted_targets_path="/tmp/impacted_targets.txt"
impacted_test_targets_path="/tmp/impacted_test_targets.txt"
bazel_diff="/tmp/bazel_diff"

shared_flags=""

cd $workspace_path

# Uncomment the line below to see debug information
# shared_flags="--config=verbose"

$bazel_path run //tools/bazel:bazel-diff $shared_flags --script_path="$bazel_diff"

git -C $workspace_path checkout $previous_revision --quiet

echo "Generating Hashes for Revision '$previous_revision'"
$bazel_diff generate-hashes -w $workspace_path -b $bazel_path $starting_hashes_json

git -C $workspace_path checkout $final_revision --quiet

echo "Generating Hashes for Revision '$final_revision'"
$bazel_diff generate-hashes -w $workspace_path -b $bazel_path $final_hashes_json

echo "Determining Impacted Targets"
$bazel_diff get-impacted-targets -sh $starting_hashes_json -fh $final_hashes_json -o $impacted_targets_path

echo "Impacted Targets between $previous_revision and $final_revision:"
echo "$(cat $impacted_targets_path)"
echo ""

function print_output {
  TARGET="$1"
  OUTPUT="$2"

  if grep -q "^$TARGET$" "$impacted_targets_path"; then
    RESULT="true"
  else
    RESULT="false"
  fi

  echo "For target $TARGET setting output $OUTPUT to $RESULT"
  echo "::set-output name=$OUTPUT::$RESULT"
}

print_output "//workstation:test" "workstation-test"
print_output "//hypervisor:kitchen" "hypervisor-test"
print_output "//occupancy_component:test" "occupancy_component-test"
