"""Custom pyinfra facts.

- :class:`~pyinfra_custom.facts.openbao.OpenBaoSecret` — one OpenBao KV field, fetched
  via the ``hvac`` SDK on the control machine (never transmitted to the target host).
- :mod:`~pyinfra_custom.facts.netbird` — NetBird client state (version / connected /
  DNS / SSH server / SSH root), each guarded by ``requires_command('netbird')``.
- :class:`~pyinfra_custom.facts.pacman.PacmanUpgradablePackages` — upgradable packages,
  guarded by ``requires_command('pacman')``.
"""

from pyinfra_custom.facts.netbird import (
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdServerSshAllowed,
    NetbirdSshRootEnabled,
    NetbirdVersion,
)
from pyinfra_custom.facts.openbao import OpenBaoSecret, SecretsError
from pyinfra_custom.facts.pacman import PacmanUpgradablePackages

__all__ = [
    "NetbirdConnected",
    "NetbirdDnsDisabled",
    "NetbirdServerSshAllowed",
    "NetbirdSshRootEnabled",
    "NetbirdVersion",
    "OpenBaoSecret",
    "PacmanUpgradablePackages",
    "SecretsError",
]
