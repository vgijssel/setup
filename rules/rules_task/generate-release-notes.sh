#!/usr/bin/env bash

set -Eeou pipefail

export VERSION="v$1"

export PREFIX="rules_task-$VERSION"
export ARCHIVE="rules_task-$VERSION.tar.gz"

git archive --format=tar --prefix=${PREFIX}/ HEAD | gzip > $ARCHIVE

export SHA=$(shasum -a 256 $ARCHIVE | awk '{print $1}')

cat << EOF
## Using WORKSPACE:

\`\`\`starlark

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_task",
    sha256 = "${SHA}",
    strip_prefix = "${PREFIX}",
    url = "https://github.com/vgijssel/setup/releases/download/${PREFIX}/${ARCHIVE}",
)
EOF

echo "\`\`\`" 