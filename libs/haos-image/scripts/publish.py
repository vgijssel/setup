#!/usr/bin/env python3
"""Attach the uncompressed Home Assistant OS image to its release, or skip if it is already there.

Selected by .github/workflows/release.yaml through `moon run :publish --query "tag=publish"`. The
image itself is produced by build.py, which this task depends on.

IDEMPOTENT, and the three states are deliberate, mirroring bin/registry-tag-exists:

    asset present  -> skip
    asset absent   -> upload
    anything else  -> fail

An unexplained failure must never be read as permission to upload. A release asset cannot be
replaced atomically, and a half-written one is indistinguishable from a good one to the cluster
that consumes it.

THE RELEASE MAY NOT EXIST YET, and that is a normal state rather than an error: a release PR can
sit open for days, and until it merges release-please has created no tag and no release. Failing
would make the workflow red for that whole time, so this skips loudly instead.

There is no wait or retry here. release.yaml runs the release-please step BEFORE this one in the
same job, so if this push merged a release PR the record provably already exists. Polling would
only ever burn time in the common case, where the release PR is simply still open.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

import _versions
from build import asset_name

PROJECT = Path(__file__).resolve().parent.parent
DIST = PROJECT / "dist"

TAG_PREFIX = "haos-image@"


def _gh(*args: str) -> subprocess.CompletedProcess[str]:
    gh = shutil.which("gh")
    if not gh:
        raise RuntimeError("'gh' is required but not found")
    return subprocess.run([gh, *args], capture_output=True, text=True, check=False)


def _release_assets(tag: str) -> list[str] | None:
    """Asset names for `tag`, or None when the release does not exist.

    Raises on any other failure, so a transient API error is never mistaken for an absent asset.
    """
    result = _gh("release", "view", tag, "--json", "assets")
    if result.returncode == 0:
        payload = json.loads(result.stdout)
        return [asset["name"] for asset in payload.get("assets", [])]

    combined = f"{result.stdout}\n{result.stderr}".lower()
    if "release not found" in combined or "not found" in combined:
        return None
    raise RuntimeError(
        f"could not read release {tag}, and not because it is absent. Refusing to publish on an "
        f"unexplained failure. GitHub said: {result.stderr.strip() or result.stdout.strip()}"
    )


def main() -> int:
    versions = _versions.verify()
    tag = f"{TAG_PREFIX}{versions.release_please}"
    asset = asset_name(versions.upstream)

    print(f"==> release {tag} should carry asset {asset}")

    assets = _release_assets(tag)
    if assets is None:
        print(
            f"==> SKIPPING: no release tagged {tag}.\n"
            f"    release-as in release-please-config.json declares {versions.release_please}, so\n"
            "    release-please will cut this tag when its release PR merges. Until then there is\n"
            "    nothing to attach to. This run is a no-op on purpose; the next push or the nightly\n"
            "    run picks it up. If the release PR HAS merged and no tag appeared, check the\n"
            "    release-please step for a stuck 'autorelease: pending' label."
        )
        return 0

    if asset in assets:
        print(f"==> {asset} is already attached to {tag}, skipping")
        return 0

    source = DIST / asset
    if not source.exists() or source.stat().st_size == 0:
        print(
            f"ERROR: {source} is missing. The publish task depends on build, which downloads and\n"
            "  decompresses the image; run `moon run haos-image:build` first.",
            file=sys.stderr,
        )
        return 1

    print(f"==> {asset} is absent from {tag}, uploading {source.stat().st_size} bytes")
    result = _gh("release", "upload", tag, str(source), "--clobber")
    if result.returncode != 0:
        print(
            f"ERROR: upload to {tag} failed: {result.stderr.strip()}",
            file=sys.stderr,
        )
        return 1

    print(f"==> published {asset}")
    print(f"    url: https://github.com/vgijssel/setup/releases/download/{tag}/{asset}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (_versions.VersionError, RuntimeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
