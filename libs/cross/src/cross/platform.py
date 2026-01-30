"""Platform detection and matching logic."""

import platform
import struct
from dataclasses import dataclass


@dataclass
class Platform:
    """Represents a target platform (OS and architecture)."""

    os: str
    arch: str

    def __str__(self) -> str:
        return f"{self.os}/{self.arch}"


def detect_host_platform() -> Platform:
    """Detect the current host platform.

    Returns:
        Platform object with detected OS and architecture.
    """
    system = platform.system().lower()

    # Map Python platform names to Docker platform names
    os_map = {
        "linux": "linux",
        "darwin": "darwin",
        "windows": "windows",
    }
    current_os = os_map.get(system, system)

    # Detect architecture
    machine = platform.machine().lower()

    # Map Python machine names to Docker architecture names
    arch_map = {
        "x86_64": "amd64",
        "amd64": "amd64",
        "aarch64": "arm64",
        "arm64": "arm64",
        "armv7l": "arm/v7",
        "armv6l": "arm/v6",
        "i386": "386",
        "i686": "386",
    }

    # Fallback: use pointer size to determine 32-bit vs 64-bit
    if machine not in arch_map:
        bits = struct.calcsize("P") * 8
        arch = "amd64" if bits == 64 else "386"
    else:
        arch = arch_map[machine]

    return Platform(os=current_os, arch=arch)


def parse_platform(platform_str: str) -> Platform:
    """Parse a platform string in the format 'os/arch'.

    Args:
        platform_str: Platform string like 'linux/amd64' or 'linux/arm64'

    Returns:
        Platform object.

    Raises:
        ValueError: If the platform string is not in the correct format.
    """
    parts = platform_str.split("/")
    if len(parts) != 2:
        raise ValueError(
            f"Invalid platform format: '{platform_str}'. "
            "Expected format: 'os/arch' (e.g., 'linux/amd64')"
        )

    return Platform(os=parts[0], arch=parts[1])


def platforms_match(host: Platform, target: Platform) -> bool:
    """Check if the host platform matches the target platform.

    Args:
        host: The current host platform.
        target: The target platform for the build.

    Returns:
        True if platforms match and native execution is possible.
    """
    return host.os == target.os and host.arch == target.arch
