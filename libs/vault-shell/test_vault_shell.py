#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pytest==8.3.4",
# ]
# ///
"""Tests for the vault-shell CLI tool."""

import sys
from pathlib import Path
from unittest.mock import patch

import pytest

# Import the module under test
sys.path.insert(0, str(Path(__file__).parent))
import importlib.util

spec = importlib.util.spec_from_file_location(
    "vault_shell", Path(__file__).parent / "vault-shell.py"
)
vault_shell = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vault_shell)


class TestPlatformChecks:
    """Tests for platform and dependency checks."""

    def test_check_platform_linux(self):
        """Platform check passes on Linux."""
        with patch("sys.platform", "linux"):
            # Should not raise
            vault_shell.check_platform()

    def test_check_platform_macos_fails(self):
        """Platform check fails on macOS."""
        with patch("sys.platform", "darwin"):
            with pytest.raises(SystemExit) as exc_info:
                vault_shell.check_platform()
            assert exc_info.value.code == 1

    def test_check_bwrap_available(self):
        """Check bwrap availability detection."""
        with patch("shutil.which", return_value="/usr/bin/bwrap"):
            # Should not raise
            vault_shell.check_bwrap_available()

    def test_check_bwrap_missing(self):
        """Check bwrap missing error."""
        with patch("shutil.which", return_value=None):
            with pytest.raises(SystemExit) as exc_info:
                vault_shell.check_bwrap_available()
            assert exc_info.value.code == 1

    def test_check_op_available(self):
        """Check op CLI availability detection."""
        with patch("shutil.which", return_value="/usr/bin/op"):
            # Should not raise
            vault_shell.check_op_available()

    def test_check_op_missing(self):
        """Check op CLI missing error."""
        with patch("shutil.which", return_value=None):
            with pytest.raises(SystemExit) as exc_info:
                vault_shell.check_op_available()
            assert exc_info.value.code == 1


class TestEnvironmentVariables:
    """Tests for environment variable handling."""

    def test_get_setup_dir_set(self, monkeypatch, tmp_path):
        """Get SETUP_DIR when set."""
        monkeypatch.setenv("SETUP_DIR", str(tmp_path))
        result = vault_shell.get_setup_dir()
        assert result == tmp_path

    def test_get_setup_dir_not_set(self, monkeypatch):
        """Error when SETUP_DIR not set."""
        monkeypatch.delenv("SETUP_DIR", raising=False)
        with pytest.raises(SystemExit) as exc_info:
            vault_shell.get_setup_dir()
        assert exc_info.value.code == 1

    def test_get_secrets_dir_set(self, monkeypatch, tmp_path):
        """Get VAULT_SECRETS_DIR when set."""
        monkeypatch.setenv("VAULT_SECRETS_DIR", str(tmp_path))
        result = vault_shell.get_secrets_dir()
        assert result == tmp_path

    def test_get_secrets_dir_not_set(self, monkeypatch):
        """Error when VAULT_SECRETS_DIR not set."""
        monkeypatch.delenv("VAULT_SECRETS_DIR", raising=False)
        with pytest.raises(SystemExit) as exc_info:
            vault_shell.get_secrets_dir()
        assert exc_info.value.code == 1


class TestServiceAccountListing:
    """Tests for listing available service accounts."""

    def test_list_service_accounts_new_format(self, tmp_path):
        """List service accounts in new format (no extension)."""
        (tmp_path / "gateway-prod").write_text("token123")
        (tmp_path / "enigma-cozy").write_text("token456")

        result = vault_shell.list_available_service_accounts(tmp_path)
        assert result == ["enigma-cozy", "gateway-prod"]

    def test_list_service_accounts_legacy_token_format(self, tmp_path):
        """List service accounts in legacy .token format."""
        (tmp_path / "setup-ci.token").write_text("token123")
        (tmp_path / "setup-prod.token").write_text("token456")

        result = vault_shell.list_available_service_accounts(tmp_path)
        assert result == ["setup-ci", "setup-prod"]

    def test_list_service_accounts_legacy_json_format(self, tmp_path):
        """List service accounts in legacy .json format."""
        (tmp_path / "setup-ci.json").write_text('{"token": "token123"}')

        result = vault_shell.list_available_service_accounts(tmp_path)
        assert result == ["setup-ci"]

    def test_list_service_accounts_mixed_formats(self, tmp_path):
        """List service accounts with mixed formats."""
        (tmp_path / "gateway-prod").write_text("token123")
        (tmp_path / "setup-ci.token").write_text("token456")
        (tmp_path / "setup-prod.json").write_text('{"token": "token789"}')

        result = vault_shell.list_available_service_accounts(tmp_path)
        assert result == ["gateway-prod", "setup-ci", "setup-prod"]

    def test_list_service_accounts_empty_dir(self, tmp_path):
        """Empty directory returns empty list."""
        result = vault_shell.list_available_service_accounts(tmp_path)
        assert result == []

    def test_list_service_accounts_nonexistent_dir(self, tmp_path):
        """Nonexistent directory returns empty list."""
        result = vault_shell.list_available_service_accounts(tmp_path / "nonexistent")
        assert result == []


class TestTokenLoading:
    """Tests for loading service account tokens."""

    def test_load_token_new_format(self, tmp_path):
        """Load token from new format (no extension)."""
        token_file = tmp_path / "gateway-prod"
        token_file.write_text("ops_token_12345")

        result = vault_shell.load_token(tmp_path, "gateway-prod")
        assert result == "ops_token_12345"

    def test_load_token_legacy_token_format(self, tmp_path):
        """Load token from legacy .token format."""
        token_file = tmp_path / "setup-ci.token"
        token_file.write_text("ops_token_67890")

        result = vault_shell.load_token(tmp_path, "setup-ci")
        assert result == "ops_token_67890"

    def test_load_token_legacy_json_format(self, tmp_path):
        """Load token from legacy .json format."""
        json_file = tmp_path / "setup-ci.json"
        json_file.write_text('{"token": "ops_token_json"}')

        result = vault_shell.load_token(tmp_path, "setup-ci")
        assert result == "ops_token_json"

    def test_load_token_strips_whitespace(self, tmp_path):
        """Token is stripped of whitespace."""
        token_file = tmp_path / "gateway-prod"
        token_file.write_text("ops_token_12345\n  ")

        result = vault_shell.load_token(tmp_path, "gateway-prod")
        assert result == "ops_token_12345"

    def test_load_token_not_found(self, tmp_path):
        """Error when token file not found."""
        with pytest.raises(SystemExit) as exc_info:
            vault_shell.load_token(tmp_path, "nonexistent")
        assert exc_info.value.code == 1

    def test_load_token_empty_file(self, tmp_path):
        """Error when token file is empty."""
        token_file = tmp_path / "gateway-prod"
        token_file.write_text("")

        with pytest.raises(SystemExit) as exc_info:
            vault_shell.load_token(tmp_path, "gateway-prod")
        assert exc_info.value.code == 1

    def test_load_token_prefers_new_format(self, tmp_path):
        """New format is preferred over legacy formats."""
        (tmp_path / "gateway-prod").write_text("new_token")
        (tmp_path / "gateway-prod.token").write_text("legacy_token")
        (tmp_path / "gateway-prod.json").write_text('{"token": "json_token"}')

        result = vault_shell.load_token(tmp_path, "gateway-prod")
        assert result == "new_token"


class TestTemplateFinding:
    """Tests for finding template files."""

    def test_find_templates_single_file(self, tmp_path):
        """Find single .op.tpl file."""
        (tmp_path / ".env.op.tpl").write_text(
            "DB_PASSWORD={{ op://vault/db/password }}"
        )

        result = vault_shell.find_templates(tmp_path)
        assert len(result) == 1
        assert result[0].name == ".env.op.tpl"

    def test_find_templates_multiple_files(self, tmp_path):
        """Find multiple .op.tpl files."""
        (tmp_path / ".env.op.tpl").write_text("content1")
        (tmp_path / "config.yaml.op.tpl").write_text("content2")
        (tmp_path / "secrets.json.op.tpl").write_text("content3")

        result = vault_shell.find_templates(tmp_path)
        assert len(result) == 3
        assert sorted([t.name for t in result]) == [
            ".env.op.tpl",
            "config.yaml.op.tpl",
            "secrets.json.op.tpl",
        ]

    def test_find_templates_no_files(self, tmp_path):
        """Empty list when no .op.tpl files found."""
        (tmp_path / "regular.txt").write_text("not a template")

        result = vault_shell.find_templates(tmp_path)
        assert result == []

    def test_find_templates_nonexistent_directory(self, tmp_path):
        """Error when directory doesn't exist."""
        with pytest.raises(SystemExit) as exc_info:
            vault_shell.find_templates(tmp_path / "nonexistent")
        assert exc_info.value.code == 1

    def test_find_templates_not_a_directory(self, tmp_path):
        """Error when path is not a directory."""
        file_path = tmp_path / "file.txt"
        file_path.write_text("content")

        with pytest.raises(SystemExit) as exc_info:
            vault_shell.find_templates(file_path)
        assert exc_info.value.code == 1


class TestOutputName:
    """Tests for getting output filenames from templates."""

    def test_get_output_name_removes_op_tpl(self):
        """Output name removes .op.tpl suffix."""
        template = Path(".env.op.tpl")
        result = vault_shell.get_output_name(template)
        assert result == ".env"

    def test_get_output_name_yaml_file(self):
        """Output name for YAML template."""
        template = Path("config.yaml.op.tpl")
        result = vault_shell.get_output_name(template)
        assert result == "config.yaml"

    def test_get_output_name_json_file(self):
        """Output name for JSON template."""
        template = Path("secrets.json.op.tpl")
        result = vault_shell.get_output_name(template)
        assert result == "secrets.json"


class TestInitScriptGeneration:
    """Tests for init script generation."""

    def test_build_init_script_no_templates(self):
        """Init script with no templates."""
        result = vault_shell.build_init_script([], "/secrets/test", "/bin/bash")
        assert "set -e" in result
        assert "exec /bin/bash -l" in result
        assert "op inject" not in result

    def test_build_init_script_single_template(self, tmp_path):
        """Init script with single template."""
        template = tmp_path / ".env.op.tpl"
        template.write_text("content")

        result = vault_shell.build_init_script([template], "/secrets/test", "/bin/bash")
        assert "set -e" in result
        assert "mkdir -p /secrets/test" in result
        assert "op inject" in result
        assert str(template) in result
        assert "/secrets/test/.env" in result
        assert "exec /bin/bash -l" in result

    def test_build_init_script_multiple_templates(self, tmp_path):
        """Init script with multiple templates."""
        template1 = tmp_path / ".env.op.tpl"
        template2 = tmp_path / "config.yaml.op.tpl"
        template1.write_text("content1")
        template2.write_text("content2")

        result = vault_shell.build_init_script(
            [template1, template2], "/secrets/test", "/bin/bash"
        )
        assert result.count("op inject") == 2
        assert str(template1) in result
        assert str(template2) in result


class TestBwrapCommandBuilding:
    """Tests for building bubblewrap commands."""

    def test_build_bwrap_command_basic(self, tmp_path):
        """Build basic bwrap command."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        cmd = vault_shell.build_bwrap_command(
            "ops_token_test", "gateway-prod", [], template_dir, setup_dir
        )

        assert cmd[0] == "bwrap"
        assert "--die-with-parent" in cmd
        assert "--unshare-pid" in cmd
        assert "--unshare-ipc" in cmd
        assert "OP_SERVICE_ACCOUNT_TOKEN" in cmd
        assert "ops_token_test" in cmd
        assert "VAULT_SHELL_NAME" in cmd
        assert "gateway-prod" in cmd
        assert "VAULT_SHELL_SERVICE_ACCOUNT" in cmd

    def test_build_bwrap_command_environment_variables(self, tmp_path):
        """Verify environment variables are set correctly."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        cmd = vault_shell.build_bwrap_command(
            "test_token", "test-sa", [], template_dir, setup_dir
        )

        # Find OP_SERVICE_ACCOUNT_TOKEN
        token_idx = cmd.index("OP_SERVICE_ACCOUNT_TOKEN")
        assert cmd[token_idx + 1] == "test_token"

        # Find VAULT_SHELL_NAME
        name_idx = cmd.index("VAULT_SHELL_NAME")
        assert cmd[name_idx + 1] == "test-sa"

        # Find VAULT_SHELL_SERVICE_ACCOUNT
        sa_idx = cmd.index("VAULT_SHELL_SERVICE_ACCOUNT")
        assert cmd[sa_idx + 1] == "test-sa"

        # Find VAULT_SHELL_ACTIVE
        active_idx = cmd.index("VAULT_SHELL_ACTIVE")
        assert cmd[active_idx + 1] == "1"

    def test_build_bwrap_command_mounts_setup_dir(self, tmp_path):
        """Verify SETUP_DIR is always mounted."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        cmd = vault_shell.build_bwrap_command(
            "test_token", "test-sa", [], template_dir, setup_dir
        )

        # Should contain bind mount for setup_dir
        assert "--bind" in cmd
        assert str(setup_dir) in cmd

    def test_build_bwrap_command_working_directory(self, tmp_path):
        """Verify working directory is SETUP_DIR."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        cmd = vault_shell.build_bwrap_command(
            "test_token", "test-sa", [], template_dir, setup_dir
        )

        # Find --chdir
        chdir_idx = cmd.index("--chdir")
        assert cmd[chdir_idx + 1] == str(setup_dir)

    def test_build_bwrap_command_tmp_bind_mount(self, tmp_path):
        """Verify /tmp is bind-mounted from host (for SSH agent sockets)."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        cmd = vault_shell.build_bwrap_command(
            "test_token", "test-sa", [], template_dir, setup_dir
        )

        # /tmp should be bind-mounted, not tmpfs
        # Find the bind mount for /tmp
        tmp_bind_found = False
        for i, arg in enumerate(cmd):
            if arg == "--bind" and i + 2 < len(cmd):
                if cmd[i + 1] == "/tmp" and cmd[i + 2] == "/tmp":
                    tmp_bind_found = True
                    break

        assert (
            tmp_bind_found
        ), "/tmp should be bind-mounted from host for SSH agent sockets"

        # Ensure /tmp is NOT mounted as tmpfs
        for i, arg in enumerate(cmd):
            if arg == "--tmpfs" and i + 1 < len(cmd):
                assert cmd[i + 1] != "/tmp", "/tmp should not be mounted as tmpfs"


class TestMainCLI:
    """Tests for the main CLI entry point."""

    @pytest.fixture
    def mock_environment(self, monkeypatch, tmp_path):
        """Set up mock environment for CLI tests."""
        secrets_dir = tmp_path / "secrets"
        secrets_dir.mkdir()
        setup_dir = tmp_path / "setup"
        setup_dir.mkdir()

        monkeypatch.setenv("VAULT_SECRETS_DIR", str(secrets_dir))
        monkeypatch.setenv("SETUP_DIR", str(setup_dir))
        monkeypatch.setattr("sys.platform", "linux")

        return {"secrets_dir": secrets_dir, "setup_dir": setup_dir}

    def test_main_missing_service_account_name(
        self, monkeypatch, mock_environment, capsys
    ):
        """Error when service account name is missing."""
        monkeypatch.setattr("sys.argv", ["vault-shell"])

        with patch.object(vault_shell, "check_platform"):
            with patch.object(vault_shell, "check_bwrap_available"):
                with patch.object(vault_shell, "check_op_available"):
                    with pytest.raises(SystemExit) as exc_info:
                        vault_shell.main()
                    assert exc_info.value.code == 1

    def test_main_service_account_not_found(
        self, monkeypatch, mock_environment, capsys
    ):
        """Error when service account token not found."""
        monkeypatch.setattr("sys.argv", ["vault-shell", "nonexistent-sa"])

        with patch.object(vault_shell, "check_platform"):
            with patch.object(vault_shell, "check_bwrap_available"):
                with patch.object(vault_shell, "check_op_available"):
                    with pytest.raises(SystemExit) as exc_info:
                        vault_shell.main()
                    assert exc_info.value.code == 1

    def test_main_with_dir_flag(self, monkeypatch, mock_environment, tmp_path):
        """Test --dir flag specifies template directory."""
        secrets_dir = mock_environment["secrets_dir"]

        # Create token
        (secrets_dir / "test-sa").write_text("ops_token_test")

        # Create template directory
        template_dir = tmp_path / "app-templates"
        template_dir.mkdir()
        (template_dir / ".env.op.tpl").write_text(
            "DB_PASSWORD={{ op://vault/db/password }}"
        )

        monkeypatch.setattr(
            "sys.argv", ["vault-shell", "test-sa", "--dir", str(template_dir)]
        )

        with patch.object(vault_shell, "check_platform"):
            with patch.object(vault_shell, "check_bwrap_available"):
                with patch.object(vault_shell, "check_op_available"):
                    with patch("os.execvp") as mock_execvp:
                        vault_shell.main()

                        # Verify execvp was called with bwrap
                        assert mock_execvp.called
                        call_args = mock_execvp.call_args[0]
                        assert call_args[0] == "bwrap"
                        cmd = call_args[1]
                        assert "bwrap" in cmd
                        assert str(template_dir) in cmd

    def test_main_default_current_directory(
        self, monkeypatch, mock_environment, tmp_path
    ):
        """Test default behavior uses current directory for templates."""
        secrets_dir = mock_environment["secrets_dir"]

        # Create token
        (secrets_dir / "test-sa").write_text("ops_token_test")

        # Create template in current directory
        cwd = tmp_path / "cwd"
        cwd.mkdir()
        (cwd / ".env.op.tpl").write_text("DB_PASSWORD={{ op://vault/db/password }}")

        monkeypatch.setattr("sys.argv", ["vault-shell", "test-sa"])
        monkeypatch.chdir(cwd)

        with patch.object(vault_shell, "check_platform"):
            with patch.object(vault_shell, "check_bwrap_available"):
                with patch.object(vault_shell, "check_op_available"):
                    with patch("os.execvp") as mock_execvp:
                        vault_shell.main()

                        # Verify execvp was called
                        assert mock_execvp.called
                        call_args = mock_execvp.call_args[0]
                        cmd = call_args[1]
                        assert "bwrap" in cmd


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
