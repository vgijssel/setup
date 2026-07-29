"""Read-only-rootfs ``rw``/``ro`` discipline for PiKVM, as a context manager.

PiKVM mounts ``/`` read-only and ships ``rw`` / ``ro`` shell helpers that remount it
read-write / read-only. Because those helpers are opaque shell (pyinfra cannot tell
they are no-ops), remounting unconditionally would show a change on every run and touch
the rootfs needlessly. Instead the caller passes ``changed_if`` -- true only when some
file in the wrapped block is actually out of sync -- and the remounts are queued only
then. A converged box queues nothing, so ``--dry`` stays empty.

Usage::

    from pyinfra_custom.operations import rootfs

    with rootfs.writable(changed_if=authorized_keys_out_of_sync):
        files.directory(name="ensure /root/.ssh", path="/root/.ssh", mode="700")
        files.put(name="write authorized_keys", src=..., dest=...)

The idempotent ``files.*`` operations inside the block are always queued; they
self-verify and report no change when converged.
"""

from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from pyinfra.api import operation


@operation(is_idempotent=False)
def remount(read_write: bool):
    """Remount the PiKVM rootfs read-write (``rw``) or read-only (``ro``).

    Not idempotent (the ``rw``/``ro`` helpers are opaque shell). Prefer the
    :func:`writable` context manager, which gates the remount on real changes.
    """
    yield "rw" if read_write else "ro"


@operation(is_idempotent=False)
def remount_usr(read_write: bool):
    """Remount the separate ``/usr`` partition read-write or read-only.

    On current PiKVM images ``/usr`` is its own partition mounted ``ro``, and the stock
    ``rw``/``ro`` helpers only touch ``/`` and ``/boot`` -- so writing under
    ``/usr/local`` (e.g. installing a binary to ``/usr/local/bin``) needs an explicit
    ``/usr`` remount. Not idempotent (a bare ``mount -o remount``); prefer the
    :func:`writable_usr` context manager, which gates the remount on real changes.
    """
    yield f"mount -o remount,{'rw' if read_write else 'ro'} /usr"


@contextmanager
def writable(changed_if: bool) -> Iterator[None]:
    """Group rootfs writes; remount ``rw`` before and ``ro`` after **iff** ``changed_if``.

    Args:
        changed_if: whether the wrapped block will actually change the rootfs. When
            ``False`` (converged), no remount is queued and the block runs against the
            still-``ro`` rootfs (the ``files.*`` ops inside are no-ops), keeping ``--dry``
            empty.
    """
    if changed_if:
        remount(name="Remount rootfs read-write", read_write=True)
    try:
        yield
    finally:
        if changed_if:
            remount(name="Remount rootfs read-only", read_write=False)


@contextmanager
def writable_usr(changed_if: bool) -> Iterator[None]:
    """Group ``/usr`` writes; remount ``/usr`` ``rw`` before and ``ro`` after **iff** ``changed_if``.

    The ``/usr`` companion to :func:`writable`, for the separate ``ro`` ``/usr`` partition
    that the stock ``rw``/``ro`` helpers do not cover. Same ``changed_if`` discipline: a
    converged box queues no remount and keeps ``--dry`` empty.
    """
    if changed_if:
        remount_usr(name="Remount /usr read-write", read_write=True)
    try:
        yield
    finally:
        if changed_if:
            remount_usr(name="Remount /usr read-only", read_write=False)
