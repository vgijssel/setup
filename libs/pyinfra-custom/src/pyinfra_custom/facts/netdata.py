"""netdata agent state, read from the ``netdata`` CLI as a pyinfra fact.

Guarded by ``requires_command('netdata')`` so a host without netdata installed returns
the fact's default silently (rather than erroring), letting the install gate run during
the slice that first places the binary.
"""

from __future__ import annotations

from pyinfra.api import FactBase


class NetdataVersion(FactBase[str]):
    """Installed netdata version string (empty if not installed).

    Drives the install gate against the pinned ``NETDATA_VERSION``: netdata prints
    ``netdata v2.10.3``, whose ``2.10.3`` substring the gate matches.
    """

    default = str

    def requires_command(self, *args, **kwargs) -> str:
        return "netdata"

    def command(self) -> str:
        return "netdata -v"

    def process(self, output: list[str]) -> str:
        return "\n".join(output).strip()
