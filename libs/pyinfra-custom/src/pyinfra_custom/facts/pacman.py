"""Pacman state as pyinfra facts (beyond what ``pyinfra.facts.pacman`` ships)."""

from __future__ import annotations

from pyinfra.api import FactBase


class PacmanUpgradablePackages(FactBase[list]):
    """List of upgradable packages (``pacman -Qu``), one ``name old -> new`` per line.

    Empty when the system is up to date. Drives the OS-update gate. Guarded by
    ``requires_command('pacman')`` so non-Arch hosts return ``[]`` silently.
    """

    default = list

    def requires_command(self, *args, **kwargs) -> str:
        return "pacman"

    def command(self) -> str:
        # `pacman -Qu` exits non-zero when nothing is upgradable; `|| true` keeps the
        # fact truthy so an empty list is reported instead of a load failure.
        return "pacman -Qu 2>/dev/null || true"

    def process(self, output: list[str]) -> list:
        return [line for line in output if line.strip()]
