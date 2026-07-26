"""NetBird client state, read from the ``netbird`` CLI as pyinfra facts.

Each fact is guarded by ``requires_command('netbird')`` so a host without NetBird
installed returns the fact's default silently (rather than erroring), letting change
detection run during the install slice that precedes registration.
"""

from __future__ import annotations

from pyinfra.api import FactBase


class NetbirdVersion(FactBase[str]):
    """Installed NetBird version string (empty if not installed).

    Drives the install gate against the pinned ``NETBIRD_VERSION``.
    """

    default = str

    def requires_command(self, *args, **kwargs) -> str:
        return "netbird"

    def command(self) -> str:
        return "netbird version"

    def process(self, output: list[str]) -> str:
        return "\n".join(output).strip()


class NetbirdConnected(FactBase[bool]):
    """``True`` when the NetBird management connection is up.

    Selects first-bring-up (register with a setup key) vs reconcile.
    """

    default = bool  # bool() -> False

    def requires_command(self, *args, **kwargs) -> str:
        return "netbird"

    def command(self) -> str:
        # `netbird status` exits non-zero when the daemon is down; keep the fact truthy
        # so `process` still runs and reports "not connected".
        return "netbird status 2>/dev/null || true"

    def process(self, output: list[str]) -> bool:
        return any("Management: Connected" in line for line in output)


class NetbirdDnsDisabled(FactBase[bool]):
    """``True`` when NetBird's persisted config has ``DisableDNS: true``.

    Drives the DNS-enable reconcile. Returns ``False`` before registration (the config
    file does not exist yet), matching "DNS not disabled".
    """

    default = bool  # bool() -> False

    def requires_command(self, *args, **kwargs) -> str:
        return "netbird"

    def command(self) -> str:
        return (
            "grep -o '\"DisableDNS\"[^,]*' /var/lib/netbird/default.json "
            "2>/dev/null || true"
        )

    def process(self, output: list[str]) -> bool:
        return any("true" in line.lower() for line in output)


class NetbirdServerSshAllowed(FactBase[bool]):
    """``True`` when NetBird's persisted config has ``ServerSSHAllowed: true``.

    Drives the SSH-server-enable reconcile. Returns ``False`` before registration (the
    config file does not exist yet), matching "SSH server not allowed".
    """

    default = bool  # bool() -> False

    def requires_command(self, *args, **kwargs) -> str:
        return "netbird"

    def command(self) -> str:
        return (
            "grep -o '\"ServerSSHAllowed\"[^,]*' /var/lib/netbird/default.json "
            "2>/dev/null || true"
        )

    def process(self, output: list[str]) -> bool:
        return any("true" in line.lower() for line in output)


class NetbirdSshRootEnabled(FactBase[bool]):
    """``True`` when NetBird's persisted config has ``EnableSSHRoot: true``.

    Drives the SSH-root-enable reconcile. Returns ``False`` before registration (the
    config file does not exist yet), matching "root login not enabled".
    """

    default = bool  # bool() -> False

    def requires_command(self, *args, **kwargs) -> str:
        return "netbird"

    def command(self) -> str:
        return (
            "grep -o '\"EnableSSHRoot\"[^,]*' /var/lib/netbird/default.json "
            "2>/dev/null || true"
        )

    def process(self, output: list[str]) -> bool:
        return any("true" in line.lower() for line in output)
