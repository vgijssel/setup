"""HACS Frontend"""
from .version import VERSION

__all__ = ["VERSION", "locate_dir"]


def locate_dir():
    return __path__[0]
