#!/usr/bin/env bash

# --- begin runfiles.bash initialization v2 ---
# Copy-pasted from the Bazel Bash runfiles library v2.
set -uo pipefail; f=bazel_tools/tools/bash/runfiles/runfiles.bash
source "${RUNFILES_DIR:-/dev/null}/$f" 2>/dev/null || \
source "$(grep -sm1 "^$f " "${RUNFILES_MANIFEST_FILE:-/dev/null}" | cut -f2- -d' ')" 2>/dev/null || \
source "$0.runfiles/$f" 2>/dev/null || \
source "$(grep -sm1 "^$f " "$0.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
source "$(grep -sm1 "^$f " "$0.exe.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
{ echo>&2 "ERROR: cannot find $f"; exit 1; }; f=; set -e
# --- end runfiles.bash initialization v2 ---

set -e

PYINFRA_BINARY={pyinfra_binary}
SETUP_RLOCATION=$(rlocation setup)

if [ -z "$SETUP_RLOCATION" ]; then
    COMBINED="$PYINFRA_BINARY"
else
    COMBINED="$SETUP_RLOCATION/$PYINFRA_BINARY"
fi

echo "BINARY: $PYINFRA_BINARY"
echo "RLOCATION: $(rlocation setup)"
echo "COMBINED: $COMBINED"

{env_string}

$COMBINED