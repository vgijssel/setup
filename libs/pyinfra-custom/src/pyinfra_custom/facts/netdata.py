"""netdata agent state, read from the ``netdata`` CLI as a pyinfra fact.

Guarded by ``requires_command('netdata')`` so a host without netdata installed returns
the fact's default silently (rather than erroring), letting the install gate run during
the slice that first places the binary.
"""

from __future__ import annotations

from pyinfra.api import FactBase

#: Absolute path to the netdata binary from the pinned static build (NETDATA_PREFIX in
#: apps/pikvm/deploy.py). The static installer does NOT put ``netdata`` on PATH, so the
#: fact must invoke it by absolute path -- otherwise it would silently return the empty
#: default on an installed box and the version-gated install would re-run every apply.
NETDATA_BIN = "/opt/netdata/bin/netdata"


class NetdataVersion(FactBase[str]):
    """Installed netdata version string (empty if not installed).

    Drives the install gate against the pinned ``NETDATA_VERSION``: netdata prints
    ``netdata v2.10.4``, whose ``2.10.4`` substring the gate matches. Invoked by absolute
    path (:data:`NETDATA_BIN`) because the static build is not on PATH.
    """

    default = str

    def requires_command(self, *args, **kwargs) -> str:
        return NETDATA_BIN

    def command(self) -> str:
        return f"{NETDATA_BIN} -v"

    def process(self, output: list[str]) -> str:
        return "\n".join(output).strip()
