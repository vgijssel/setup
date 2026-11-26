#!/usr/bin/env python3
"""Point the HAOS VirtualMachineImage at the artifact libs/haos-image publishes.

Writes `spec.url` and `spec.checksum` in src/haos-image/virtualmachineimage-haos.yaml and nothing
else. It does NOT commit, branch, or open a pull request: `release:self_upgrade` depends on this
task and on apps/secret's equivalent, and does the git work once so every pin lands in ONE commit
on ONE pull request. Splitting the write from the commit is what lets a second consumer be added
by writing a script, rather than by teaching the release tooling about it.

WHY THE URL CANNOT BE HARDCODED HERE. It is built from the release-please tag, which is
`<component><tag-separator><version>` -- all three of which live in release-please-config.json.
libs/haos-image derives it there and writes it to dist/pin.json as a build output; this reads that
file. Re-deriving it here would be a second place to get the tag format wrong, and the format is
load-bearing: with release-please's default `@` separator the URL carries a percent-encoded
`haos-image%4018.2.0`.

WHY THE CHECKSUM COMES FROM THE SAME FILE. Harvester validates the downloaded image against
`spec.checksum`, so the value has to describe the exact bytes that were published. Only the build
has seen them. Computing it here would mean downloading a gibibyte to learn something the build
already knew.

A MISSING pin.json IS AN ERROR, not a skip. This task declares a dependency on haos-image:build,
so the file is either there or the dependency is broken -- and silently leaving a stale URL in
place is precisely the failure this exists to prevent.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
REPO_ROOT = PROJECT.parents[1]
MANIFEST = PROJECT / "src" / "haos-image" / "virtualmachineimage-haos.yaml"
PIN = REPO_ROOT / "libs" / "haos-image" / "dist" / "pin.json"


def main() -> int:
    if not PIN.exists():
        print(
            f"ERROR: {PIN} is missing.\n"
            "  This task depends on haos-image:build, which writes it. Run\n"
            "  `moon run haos-image:build` first, or check that the dependency is still declared.",
            file=sys.stderr,
        )
        return 1

    pin = json.loads(PIN.read_text())
    url, checksum = pin["url"], pin["sha256"]

    # Written unquoted: a sha256 is hex, so YAML needs no quotes and yamllint rejects redundant
    # ones. Harvester validates the value, so a malformed checksum fails loudly at import.

    text = MANIFEST.read_text()
    updated, url_n = re.subn(r"(?m)^(  url: ).*$", lambda m: m.group(1) + url, text)
    updated, sum_n = re.subn(
        r"(?m)^(  checksum: ).*$", lambda m: m.group(1) + checksum, updated
    )

    if url_n != 1 or sum_n != 1:
        print(
            f"ERROR: expected exactly one `url:` and one `checksum:` at spec level in {MANIFEST}, "
            f"found {url_n} and {sum_n}.\n"
            "  Refusing to guess which to rewrite.",
            file=sys.stderr,
        )
        return 1

    if updated == text:
        print(
            f"==> {MANIFEST.relative_to(REPO_ROOT)} already pins {pin['tag']}; nothing to do"
        )
        return 0

    MANIFEST.write_text(updated)
    print(f"==> pinned {pin['tag']} in {MANIFEST.relative_to(REPO_ROOT)}")
    print(f"    url:      {url}")
    print(f"    checksum: {checksum}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
