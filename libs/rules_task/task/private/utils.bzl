"""Utility functions for task rules."""

def _fq_label(string):
    """Convert a label string to a fully qualified label string."""
    return str(native.package_relative_label(string))

# Public alias for backwards compatibility
fq_label = _fq_label
