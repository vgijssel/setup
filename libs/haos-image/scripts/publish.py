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

A MISSING RELEASE IS AN ERROR, not a state to tolerate. release.yaml runs the release-please step
BEFORE this one in the same job, so by the time this runs the release for the committed version
either exists or was never going to: the version committed here is the version release-please has
already tagged. If the repository declares 18.2.0 and no haos-image@18.2.0 release exists, the two
have diverged and the only honest thing to do is say so -- skipping would leave the declared
version silently unpublished, which is the exact failure mode release.yaml's convergence model
exists to prevent.

There is also no wait or retry, for the same reason: ordering is guaranteed by step order, so
polling could only ever burn time.

The window to know about: between merging a bump of release_please_version/release-as and merging
the release PR that release-please then opens, the declared version genuinely has no release. This
step is red for that interval. That is intended -- it is a visible prompt to merge the release PR.
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
        raise RuntimeError(
            f"no release tagged {tag} exists, but the repository declares "
            f"{versions.release_please}.\n"
            "  release-please runs before this step in the same job, so a declared version with no\n"
            "  release means the two have diverged. Either:\n"
            "    - release-please has opened a release PR that is not merged yet, in which case\n"
            "      merge it and this goes green; or\n"
            "    - it opened none, which means no releasable commit (feat/fix) has touched\n"
            "      libs/haos-image since .release-please-manifest.json's recorded version, so the\n"
            "      release-as pin can never be reached; or\n"
            "    - the release PR merged but no tag appeared, which is usually a stuck\n"
            "      'autorelease: pending' label on the merged PR."
        )

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
