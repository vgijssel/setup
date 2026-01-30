"""Jinja2 template variable substitution for command arguments."""

from jinja2 import Template


def render_command(command_parts: list[str], os: str, arch: str) -> list[str]:
    """Render Jinja2 template variables in command arguments.

    Args:
        command_parts: List of command arguments (e.g., ['pex', '.', '-o', 'dist/{{ os }}_{{ arch }}/out.pex'])
        os: Target operating system (e.g., 'linux')
        arch: Target architecture (e.g., 'amd64')

    Returns:
        List of command arguments with variables substituted.

    Examples:
        >>> render_command(['echo', '{{ os }}'], os='linux', arch='amd64')
        ['echo', 'linux']
        >>> render_command(['path/{{ os }}_{{ arch }}/file'], os='linux', arch='arm64')
        ['path/linux_arm64/file']
    """
    context = {"os": os, "arch": arch}
    return [Template(part).render(context) for part in command_parts]
