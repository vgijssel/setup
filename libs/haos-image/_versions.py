"""Read and reconcile the three places the Home Assistant OS version is written.

There is no single file holding it, and that is deliberate rather than an oversight. Each of the
three has a different owner, so each has to live where its owner can write it:

``moon.yml`` ``project.metadata.dependencies``
    The UPSTREAM version, ``18.2``. Renovate owns it, through the jsonata customManager in
    renovate.json that already reads that block out of every moon.yml.

``moon.yml`` ``project.metadata.release_please_version``
    The same release expressed as semver, ``18.2.0``. A human owns it.

``release-please-config.json`` ``packages["libs/haos-image"].release-as``
    The version release-please tags. release-please owns the file; the pin is hand-written.

Home Assistant's stable tags are two-part (``18.5``, ``18.4``, ``17.3``) and its prereleases are
``18.5.rc1``, which is not semver at all, so the upstream version can never be handed to
release-please unchanged. The ``.0`` patch is the whole of the mapping.

``verify()`` is what stops the three drifting apart, and ``version_test.py`` runs it in CI.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[1]
MOON_YML = HERE / "moon.yml"
RELEASE_PLEASE_CONFIG = REPO_ROOT / "release-please-config.json"

PACKAGE_PATH = "libs/haos-image"
UPSTREAM_DEP = "home-assistant/operating-system"

# Two-part and nothing else: this is the same shape renovate.json pins with
# `versioning: regex:^(?<major>\d+)\.(?<minor>\d+)$`, which is what keeps `18.5.rc1` from ever
# being proposed.
UPSTREAM_RE = re.compile(r"^\d+\.\d+$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")


class VersionError(RuntimeError):
    """A version could not be read, or the three sources disagree."""


@dataclass(frozen=True)
class Versions:
    upstream: str
    release_please: str
    release_as: str


def _read_moon_metadata() -> tuple[str, str]:
    """Pull the two versions out of moon.yml without a YAML dependency.

    The file is hand-written and shallow, so a line scan is honest here and avoids making this
    project depend on PyYAML, which is not otherwise installed. The scan is anchored on the
    dependency key and on the metadata-level indentation so a comment mentioning either name
    cannot satisfy it.
    """
    text = MOON_YML.read_text()

    upstream = None
    in_dep = False
    for raw in text.splitlines():
        line = raw.rstrip()
        stripped = line.strip()
        if stripped.startswith("#"):
            continue
        if stripped == f"{UPSTREAM_DEP}:":
            in_dep = True
            continue
        if in_dep:
            match = re.match(r"^\s+version:\s*\"?([^\"\s]+)\"?\s*$", line)
            if match:
                upstream = match.group(1)
                break
            # Left the dependency's own block without finding a version.
            if stripped and not line.startswith(" " * 8):
                in_dep = False

    release_please = None
    for raw in text.splitlines():
        match = re.match(
            r"^\s+release_please_version:\s*\"?([^\"\s]+)\"?\s*$", raw.rstrip()
        )
        if match and not raw.strip().startswith("#"):
            release_please = match.group(1)
            break

    if upstream is None:
        raise VersionError(
            f"{MOON_YML} declares no version for {UPSTREAM_DEP} under "
            "project.metadata.dependencies. Renovate writes that value; if it is gone, the "
            "jsonata customManager in renovate.json has nothing to track."
        )
    if release_please is None:
        raise VersionError(
            f"{MOON_YML} declares no project.metadata.release_please_version. It must be the "
            "upstream version with a .0 patch, and must match release-as in "
            "release-please-config.json."
        )
    return upstream, release_please


def _read_release_as() -> str:
    config = json.loads(RELEASE_PLEASE_CONFIG.read_text())
    try:
        package = config["packages"][PACKAGE_PATH]
    except KeyError as exc:
        raise VersionError(
            f"{RELEASE_PLEASE_CONFIG} has no packages entry for {PACKAGE_PATH}, so release-please "
            "would never cut a release for it."
        ) from exc
    release_as = package.get("release-as")
    if not release_as:
        raise VersionError(
            f'{RELEASE_PLEASE_CONFIG} packages["{PACKAGE_PATH}"] has no "release-as". Without it '
            "release-please decides the version from conventional commits and invents its own "
            "semver bump, which loses the correspondence to the Home Assistant version."
        )
    return str(release_as)


def load() -> Versions:
    upstream, release_please = _read_moon_metadata()
    return Versions(
        upstream=upstream,
        release_please=release_please,
        release_as=_read_release_as(),
    )


def verify(versions: Versions | None = None) -> Versions:
    """Raise unless all three versions describe the same Home Assistant release."""
    versions = versions or load()
    problems: list[str] = []

    if not UPSTREAM_RE.match(versions.upstream):
        problems.append(
            f"upstream version {versions.upstream!r} in moon.yml is not a two-part Home Assistant "
            "stable tag. Prereleases look like 18.5.rc1 and must never be pinned; the renovate "
            "versioning regex exists to keep them out."
        )
    if not SEMVER_RE.match(versions.release_please):
        problems.append(
            f"release_please_version {versions.release_please!r} in moon.yml is not semver."
        )
    if not SEMVER_RE.match(versions.release_as):
        problems.append(f"release-as {versions.release_as!r} is not semver.")

    expected = f"{versions.upstream}.0"
    if not problems:
        if versions.release_please != expected:
            problems.append(
                f"release_please_version is {versions.release_please}, expected {expected} "
                f"(upstream {versions.upstream} with a .0 patch)."
            )
        if versions.release_as != versions.release_please:
            problems.append(
                f"release-as in release-please-config.json is {versions.release_as}, but "
                f"moon.yml says release_please_version is {versions.release_please}. "
                "release-please tags release-as, so the asset would be named for one version and "
                "attached to a release tagged with another."
            )

    if problems:
        raise VersionError(
            "the Home Assistant version is inconsistent across its three sources:\n  - "
            + "\n  - ".join(problems)
            + "\n\nAfter renovate bumps the upstream version in libs/haos-image/moon.yml, both "
            "release_please_version there and release-as in release-please-config.json have to "
            "move with it. This check is what makes that visible rather than silent."
        )
    return versions
