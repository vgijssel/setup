"""pyinfra deploy for the PiKVM Tailscale -> NetBird migration.

Host operations are added incrementally per ``apps/pikvm/tasks/plan.md``. This is the
single source of operations shared by both inventories (``inventories/production.py``
and ``inventories/local.py``); the inventories only change how the host is reached.

Secrets (NetBird setup key, PiKVM admin password, system root password) are read at
runtime from OpenBao via ``secrets.py`` -- never committed or logged.
"""
