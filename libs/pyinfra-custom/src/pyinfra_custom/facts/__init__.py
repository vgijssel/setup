"""Custom pyinfra facts.

- :class:`~pyinfra_custom.facts.openbao.OpenBaoSecret` — one OpenBao KV field, fetched
  via the ``hvac`` SDK on the control machine (never transmitted to the target host).
- :mod:`~pyinfra_custom.facts.netbird` — NetBird client state (version / connected /
  DNS / SSH server / SSH root), each guarded by ``requires_command('netbird')``.
- :class:`~pyinfra_custom.facts.pacman.PacmanUpgradablePackages` — upgradable packages,
  guarded by ``requires_command('pacman')``.
- :class:`~pyinfra_custom.facts.goss.GossVersion` — installed goss version, guarded by
  ``requires_command('goss')``.
- :class:`~pyinfra_custom.facts.netdata.NetdataVersion` — installed netdata version,
  guarded by ``requires_command('netdata')``.
"""

from pyinfra_custom.facts.goss import GossVersion
from pyinfra_custom.facts.netbird import (
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdServerSshAllowed,
    NetbirdSshRootEnabled,
    NetbirdVersion,
)
from pyinfra_custom.facts.netdata import NetdataVersion
from pyinfra_custom.facts.openbao import OpenBaoSecret, SecretsError
from pyinfra_custom.facts.pacman import PacmanUpgradablePackages

__all__ = [
    "GossVersion",
    "NetbirdConnected",
    "NetbirdDnsDisabled",
    "NetbirdServerSshAllowed",
    "NetbirdSshRootEnabled",
    "NetbirdVersion",
    "NetdataVersion",
    "OpenBaoSecret",
    "PacmanUpgradablePackages",
    "SecretsError",
]
