#!/usr/bin/env python3
"""Download the Home Assistant OS image and decompress it into dist/.

Separate from publish.py so the expensive, cacheable half is a `build` task moon can skip, and so
a failure to produce a usable qcow2 is attributed to the build rather than to the upload.

WHY THIS EXISTS AT ALL. Nothing in the Harvester storage path reads a compressed source, and
upstream declined to add it: longhorn/longhorn#3988 ("Support backing image with common
compression formats") was closed 2024-08-26 with "we won't support uploading compressed backing
image". harvester/harvester#681 is closed as though delivered, but it closed in Feb 2024 while
that dependency was still open, which is why the Harvester tracker appears to promise support
that does not exist. Measured on the cluster, a `.qcow2.xz` URL downloads, lands as a backing
image with virtualSize=0 because `qemu-img info` cannot parse it, and the volume built on it binds
and then fails to attach -- a silent, useless disk rather than an error.

So the decompression has to happen once, here, and the result has to be served from somewhere
stable. Home Assistant publishes no uncompressed artifact; every asset is .xz, .ova or .zip.
"""

from __future__ import annotations

import lzma
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

import _versions

PROJECT = Path(__file__).resolve().parent.parent
DIST = PROJECT / "dist"

# qcow2 magic bytes. Checked rather than trusting the filename, because this is exactly the
# property a compressed artifact fails and the one Longhorn fails silently on.
QCOW2_MAGIC = b"QFI\xfb"


def asset_name(upstream: str) -> str:
    return f"haos_ova-{upstream}.qcow2"


def source_url(upstream: str) -> str:
    return (
        "https://github.com/home-assistant/operating-system/releases/download/"
        f"{upstream}/haos_ova-{upstream}.qcow2.xz"
    )


def main() -> int:
    versions = _versions.verify()
    upstream = versions.upstream
    url = source_url(upstream)
    target = DIST / asset_name(upstream)

    if target.exists() and target.stat().st_size > 0:
        print(f"==> {target.relative_to(PROJECT)} already built, skipping download")
        _describe(target)
        return 0

    DIST.mkdir(parents=True, exist_ok=True)
    compressed = DIST / f"{asset_name(upstream)}.xz"

    print(f"==> downloading {url}")
    try:
        with urllib.request.urlopen(url) as response, compressed.open("wb") as handle:
            shutil.copyfileobj(response, handle, length=1024 * 1024)
    except urllib.error.HTTPError as exc:
        print(
            f"ERROR: {url} returned HTTP {exc.code}.\n"
            "  The most likely cause is a BOARD-SPECIFIC release that ships no OVA image: 18.5,\n"
            "  for example, published only rpi3-64/rpi4-64/rpi5-64/yellow and no qcow2 at all.\n"
            "  The github-releases datasource sees release tags, not their assets, so renovate\n"
            "  can propose such a version. Pin the newest release that actually carries\n"
            "  haos_ova-<version>.qcow2.xz instead.",
            file=sys.stderr,
        )
        return 1
    except urllib.error.URLError as exc:
        print(f"ERROR: could not reach {url}: {exc.reason}", file=sys.stderr)
        return 1

    print("==> decompressing")
    # Written to a temporary name and moved into place only once complete, so an interrupted run
    # cannot leave a truncated image that looks built to the preceding check.
    partial = target.with_suffix(".qcow2.partial")
    with lzma.open(compressed, "rb") as src, partial.open("wb") as dst:
        shutil.copyfileobj(src, dst, length=1024 * 1024)
    compressed.unlink()

    magic = partial.read_bytes()[:4] if partial.stat().st_size >= 4 else b""
    if magic != QCOW2_MAGIC:
        partial.unlink(missing_ok=True)
        print(
            f"ERROR: decompressed output is not a qcow2 (magic {magic!r}, "
            f"expected {QCOW2_MAGIC!r}).",
            file=sys.stderr,
        )
        return 1

    partial.replace(target)
    _describe(target)
    return 0


def _describe(target: Path) -> None:
    print(f"==> {target.name}  {target.stat().st_size} bytes")
    qemu_img = shutil.which("qemu-img")
    if not qemu_img:
        return
    # Advisory only. The preceding magic-byte check is the gate; this prints the virtual size,
    # which is the number Longhorn records as 0 when it cannot parse the file.
    result = subprocess.run(
        [qemu_img, "info", "--output=json", str(target)],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode == 0:
        print("    qemu-img:", " ".join(result.stdout.split()))


if __name__ == "__main__":
    try:
        sys.exit(main())
    except _versions.VersionError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
