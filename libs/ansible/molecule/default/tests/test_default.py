"""Molecule tests for Ansible roles using testinfra."""

import pytest


def test_timezone_configured(host):
    """Verify timezone is set correctly."""
    cmd = host.run("cat /etc/timezone")
    assert cmd.rc == 0
    assert "UTC" in cmd.stdout or cmd.stdout.strip() == "Etc/UTC"


def test_locale_configured(host):
    """Verify locale is generated."""
    cmd = host.run("locale -a")
    assert cmd.rc == 0
    # Check for en_US locale (with or without UTF-8 suffix)
    assert "en_US" in cmd.stdout or "en_US.utf8" in cmd.stdout


def test_python_installed(host):
    """Verify Python is available."""
    python = host.package("python3")
    assert python.is_installed


class TestRoleStructure:
    """Test that role files are properly structured."""

    @pytest.fixture(autouse=True)
    def setup(self, host):
        """Setup test fixtures."""
        self.host = host

    def test_ansible_available(self):
        """Verify ansible is accessible from the test environment."""
        # This test runs on the control node, not the target
        import subprocess

        result = subprocess.run(
            ["ansible", "--version"], capture_output=True, text=True, check=False
        )
        assert result.returncode == 0
        assert "ansible" in result.stdout.lower()
