"""Tests for platform detection and matching."""

import pytest
from cross.platform import (
    Platform,
    detect_host_platform,
    parse_platform,
    platforms_match,
)


class TestPlatform:
    """Tests for the Platform dataclass."""

    def test_str_representation(self) -> None:
        """Test string representation of Platform."""
        platform = Platform(os="linux", arch="amd64")
        assert str(platform) == "linux/amd64"

    def test_equality(self) -> None:
        """Test Platform equality."""
        p1 = Platform(os="linux", arch="amd64")
        p2 = Platform(os="linux", arch="amd64")
        p3 = Platform(os="linux", arch="arm64")

        assert p1.os == p2.os
        assert p1.arch == p2.arch
        assert p1.arch != p3.arch


class TestDetectHostPlatform:
    """Tests for detect_host_platform function."""

    def test_returns_platform_object(self) -> None:
        """Test that detect_host_platform returns a Platform object."""
        platform = detect_host_platform()
        assert isinstance(platform, Platform)
        assert platform.os in ["linux", "darwin", "windows"]
        assert platform.arch in ["amd64", "arm64", "arm/v7", "arm/v6", "386"]


class TestParsePlatform:
    """Tests for parse_platform function."""

    def test_parse_linux_amd64(self) -> None:
        """Test parsing linux/amd64 platform string."""
        platform = parse_platform("linux/amd64")
        assert platform.os == "linux"
        assert platform.arch == "amd64"

    def test_parse_linux_arm64(self) -> None:
        """Test parsing linux/arm64 platform string."""
        platform = parse_platform("linux/arm64")
        assert platform.os == "linux"
        assert platform.arch == "arm64"

    def test_parse_darwin_arm64(self) -> None:
        """Test parsing darwin/arm64 platform string."""
        platform = parse_platform("darwin/arm64")
        assert platform.os == "darwin"
        assert platform.arch == "arm64"

    def test_parse_invalid_format_no_slash(self) -> None:
        """Test that invalid format without slash raises ValueError."""
        with pytest.raises(ValueError) as exc_info:
            parse_platform("linuxamd64")
        assert "Invalid platform format" in str(exc_info.value)
        assert "os/arch" in str(exc_info.value)

    def test_parse_invalid_format_multiple_slashes(self) -> None:
        """Test that invalid format with multiple slashes raises ValueError."""
        with pytest.raises(ValueError) as exc_info:
            parse_platform("linux/arm/v7")
        assert "Invalid platform format" in str(exc_info.value)

    def test_parse_empty_string(self) -> None:
        """Test that empty string raises ValueError."""
        with pytest.raises(ValueError):
            parse_platform("")


class TestPlatformsMatch:
    """Tests for platforms_match function."""

    def test_matching_platforms(self) -> None:
        """Test that identical platforms match."""
        host = Platform(os="linux", arch="amd64")
        target = Platform(os="linux", arch="amd64")
        assert platforms_match(host, target) is True

    def test_different_arch(self) -> None:
        """Test that different architectures don't match."""
        host = Platform(os="linux", arch="amd64")
        target = Platform(os="linux", arch="arm64")
        assert platforms_match(host, target) is False

    def test_different_os(self) -> None:
        """Test that different operating systems don't match."""
        host = Platform(os="darwin", arch="arm64")
        target = Platform(os="linux", arch="arm64")
        assert platforms_match(host, target) is False

    def test_different_os_and_arch(self) -> None:
        """Test that different OS and arch don't match."""
        host = Platform(os="darwin", arch="arm64")
        target = Platform(os="linux", arch="amd64")
        assert platforms_match(host, target) is False
