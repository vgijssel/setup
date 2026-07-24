"""Custom pyinfra operations.

- :mod:`~pyinfra_custom.operations.rootfs` — read-only-rootfs ``rw``/``ro`` discipline
  as a context manager.
- :mod:`~pyinfra_custom.operations.netbird` — ``netbird up`` registration.
- :mod:`~pyinfra_custom.operations.pikvm` — PiKVM helpers (``kvmd-htpasswd``).
"""

from pyinfra_custom.operations import netbird, pikvm, rootfs

__all__ = ["netbird", "pikvm", "rootfs"]
