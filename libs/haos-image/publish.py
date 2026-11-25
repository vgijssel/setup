#!/usr/bin/env python3
"""Attach the uncompressed Home Assistant OS image to its release, or skip if it is already there.

Selected by .github/workflows/publish.yaml through `moon run :publish --query "tag=publish"`. The
image itself is produced by build.py, which this task depends on.

IDEMPOTENT, and the three states are deliberate, mirroring bin/registry-tag-exists:

    asset present  -> skip
    asset absent   -> upload
    anything else  -> fail

An unexplained failure must never be read as permission to upload. A release asset cannot be
replaced atomically, and a half-written one is indistinguishable from a good one to the cluster
that consumes it.

THE RELEASE MAY NOT EXIST YET, and that is a normal state rather than an error. publish.yaml runs
on push to main; merging a release-please PR *is* such a push, and release-please is still
deciding whether to cut the tag at that moment. So this waits briefly for the release to appear
and then skips loudly rather than failing, because failing would make publish.yaml red for as
long as a release PR sits unmerged. The nightly run picks it up once the tag exists.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

import _versions
from build import asset_name

HERE = Path(__file__).resolve().parent
DIST = HERE / "dist"

TAG_PREFIX = "haos-image@"
# How long to let release-please finish cutting the tag when both workflows were started by the
# same push. Generous enough for a cold release-please run, short enough not to hold a job open.
WAIT_SECONDS = 180
POLL_SECONDS = 15


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

    deadline = time.monotonic() + WAIT_SECONDS
    assets = _release_assets(tag)
    while assets is None and time.monotonic() < deadline:
        print(f"    release {tag} does not exist yet, waiting for release-please")
        time.sleep(POLL_SECONDS)
        assets = _release_assets(tag)

    if assets is None:
        print(
            f"==> SKIPPING: no release tagged {tag}.\n"
            f"    release-as in release-please-config.json declares {versions.release_please}, so\n"
            "    release-please will cut this tag when its release PR merges. Until then there is\n"
            "    nothing to attach to. This run is a no-op on purpose; the nightly publish will\n"
            "    pick it up. If the release PR has already merged and no tag appeared, check the\n"
            "    Release Please workflow for a stuck 'autorelease: pending' label."
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
