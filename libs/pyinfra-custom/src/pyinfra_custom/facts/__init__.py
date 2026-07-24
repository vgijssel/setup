"""Custom pyinfra facts.

- :class:`~pyinfra_custom.facts.openbao.OpenBaoSecret` — one OpenBao KV field, fetched
  via the ``hvac`` SDK on the control machine (never transmitted to the target host).
- :mod:`~pyinfra_custom.facts.netbird` — NetBird client state (version / connected /
  DNS), each guarded by ``requires_command('netbird')``.
- :class:`~pyinfra_custom.facts.pacman.PacmanUpgradablePackages` — upgradable packages,
  guarded by ``requires_command('pacman')``.
"""

from pyinfra_custom.facts.netbird import (
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdVersion,
)
from pyinfra_custom.facts.openbao import OpenBaoSecret, SecretsError
from pyinfra_custom.facts.pacman import PacmanUpgradablePackages

__all__ = [
    "NetbirdConnected",
    "NetbirdDnsDisabled",
    "NetbirdVersion",
    "OpenBaoSecret",
    "PacmanUpgradablePackages",
    "SecretsError",
]
