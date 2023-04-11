 #!/usr/bin/env bash

set -Eeou pipefail

cd "$BUILD_WORKSPACE_DIRECTORY"

# Set these settings to an empty value
echo "build --disk_cache=" > "ci.bazelrc"
echo "build --repository_cache=" >> "ci.bazelrc"
echo "startup --output_base=" >> "ci.bazelrc"

cat "ci.bazelrc"