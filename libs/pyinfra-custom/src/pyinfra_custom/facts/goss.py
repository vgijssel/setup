"""goss (system-health) client state, read from the ``goss`` CLI as a pyinfra fact.

Guarded by ``requires_command('goss')`` so a host without goss installed returns the
fact's default silently (rather than erroring), letting the install gate run during the
slice that first places the binary.
"""

from __future__ import annotations

from pyinfra.api import FactBase


class GossVersion(FactBase[str]):
    """Installed goss version string (empty if not installed).

    Drives the install gate against the pinned ``GOSS_VERSION``: goss prints
    ``goss version v0.4.10 (linux/arm64)``, whose ``0.4.10`` substring the gate matches.
    """

    default = str

    def requires_command(self, *args, **kwargs) -> str:
        return "goss"

    def command(self) -> str:
        return "goss --version"

    def process(self, output: list[str]) -> str:
        return "\n".join(output).strip()
