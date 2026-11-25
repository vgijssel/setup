#!/usr/bin/env python3
"""Fail unless the Home Assistant version agrees across all three places it is written.

Offline and fast, so it runs in `moon ci` on every pull request. The three sources and why they
cannot be collapsed into one are documented in _versions.py; the short version is that renovate,
a human, and release-please each need to write a different one.

This is the forcing function for the handover between those owners. Renovate bumps only the
upstream version in moon.yml, so after its pull request lands, `release_please_version` here and
`release-as` in release-please-config.json are both stale -- and nothing else would notice.
Without this check release-please would quietly re-cut the OLD version, and the publish task
would attach an asset named for the new image to a release tagged with the old one.
"""

from __future__ import annotations

import sys

import _versions


def main() -> int:
    versions = _versions.verify()
    print(
        "ok  upstream={upstream}  release_please_version={rp}  release-as={ra}".format(
            upstream=versions.upstream,
            rp=versions.release_please,
            ra=versions.release_as,
        )
    )
    print(f"    tag=haos-image@{versions.release_please}")
    print(f"    asset=haos_ova-{versions.upstream}.qcow2")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except _versions.VersionError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
