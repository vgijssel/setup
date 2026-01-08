#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "click==8.1.8",
#     "pytimeparse2==1.7.1",
#     "pytest==8.3.4",
# ]
# ///
"""Tests for the vault-login CLI tool."""

import json
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Import the module under test
sys.path.insert(0, str(Path(__file__).parent))
import importlib.util

spec = importlib.util.spec_from_file_location(
    "vault_login", Path(__file__).parent / "vault-login.py"
)
vault_login = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vault_login)


class TestDurationParsing:
    """Tests for duration parsing functionality."""

    def test_parse_1h(self):
        """Parse '1h' duration."""
        result = vault_login.parse_expiration("1h")
        assert result == 3600

    def test_parse_1_hour(self):
        """Parse '1 hour' duration."""
        result = vault_login.parse_expiration("1 hour")
        assert result == 3600

    def test_parse_2_hours(self):
        """Parse '2 hours' duration."""
        result = vault_login.parse_expiration("2 hours")
        assert result == 7200

    def test_parse_90_minutes(self):
        """Parse '90 minutes' duration."""
        result = vault_login.parse_expiration("90 minutes")
        assert result == 5400

    def test_parse_90min(self):
        """Parse '90min' duration."""
        result = vault_login.parse_expiration("90min")
        assert result == 5400

    def test_parse_1h30m(self):
        """Parse '1h30m' duration."""
        result = vault_login.parse_expiration("1h30m")
        assert result == 5400

    def test_parse_invalid_duration_exits(self):
        """Invalid duration format should exit with error."""
        with pytest.raises(SystemExit) as exc_info:
            vault_login.parse_expiration("invalid")
        assert exc_info.value.code == 1

    def test_parse_duration_under_1_hour_exits(self):
        """Duration under 1 hour should exit with error."""
        with pytest.raises(SystemExit) as exc_info:
            vault_login.parse_expiration("30min")
        assert exc_info.value.code == 1

    def test_parse_duration_59_minutes_exits(self):
        """59 minutes should exit with error (just under 1 hour)."""
        with pytest.raises(SystemExit) as exc_info:
            vault_login.parse_expiration("59min")
        assert exc_info.value.code == 1

    def test_parse_duration_exactly_1_hour_succeeds(self):
        """Exactly 1 hour should succeed."""
        result = vault_login.parse_expiration("60min")
        assert result == 3600


class TestDurationFormatting:
    """Tests for duration formatting for op CLI."""

    def test_format_1_hour(self):
        """Format 3600 seconds as '1h'."""
        result = vault_login.format_duration_for_op(3600)
        assert result == "1h"

    def test_format_2_hours(self):
        """Format 7200 seconds as '2h'."""
        result = vault_login.format_duration_for_op(7200)
        assert result == "2h"

    def test_format_90_minutes(self):
        """Format 5400 seconds as '1h30m'."""
        result = vault_login.format_duration_for_op(5400)
        assert result == "1h30m"

    def test_format_2h15m(self):
        """Format 8100 seconds as '2h15m'."""
        result = vault_login.format_duration_for_op(8100)
        assert result == "2h15m"


class TestVaultValidation:
    """Tests for vault name validation."""

    def test_vault_exists_found(self):
        """Vault exists in list."""
        vaults = [{"name": "setup-test", "id": "abc123"}]
        assert vault_login.vault_exists("setup-test", vaults) is True

    def test_vault_exists_not_found(self):
        """Vault does not exist in list."""
        vaults = [{"name": "setup-other", "id": "abc123"}]
        assert vault_login.vault_exists("setup-test", vaults) is False

    def test_vault_exists_empty_list(self):
        """Empty vault list."""
        assert vault_login.vault_exists("setup-test", []) is False

    def test_get_vault_id_found(self):
        """Get vault ID when vault exists."""
        vaults = [{"name": "setup-test", "id": "abc123"}]
        assert vault_login.get_vault_id("setup-test", vaults) == "abc123"

    def test_get_vault_id_not_found(self):
        """Get vault ID when vault does not exist."""
        vaults = [{"name": "setup-other", "id": "abc123"}]
        assert vault_login.get_vault_id("setup-test", vaults) is None


class TestSecretsDir:
    """Tests for secrets directory handling."""

    def test_get_secrets_dir_set(self, monkeypatch, tmp_path):
        """Get secrets dir when environment variable is set."""
        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))
        result = vault_login.get_secrets_dir()
        assert result == tmp_path

    def test_get_secrets_dir_not_set(self, monkeypatch):
        """Exit with error when environment variable is not set."""
        monkeypatch.delenv("VAULT_LOGIN_SECRETS_DIR", raising=False)
        with pytest.raises(SystemExit) as exc_info:
            vault_login.get_secrets_dir()
        assert exc_info.value.code == 1


class TestCLI:
    """Tests for CLI behavior using click's test runner."""

    @pytest.fixture
    def runner(self):
        """Create a click test runner."""
        from click.testing import CliRunner

        return CliRunner()

    @pytest.fixture
    def mock_vaults(self):
        """Mock vault list response."""
        return [
            {"name": "setup-ci", "id": "vault-id-ci"},
            {"name": "setup-prod", "id": "vault-id-prod"},
        ]

    def test_help(self, runner):
        """CLI --help works."""
        result = runner.invoke(vault_login.main, ["--help"])
        assert result.exit_code == 0
        assert "Generate a 1Password service account token" in result.output

    def test_no_vault_specified(self, runner):
        """Error when no --vault options are provided."""
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            result = runner.invoke(vault_login.main, ["my-service-account"])
            assert result.exit_code == 2  # Click validation error
            assert "--vault" in result.output or "required" in result.output.lower()

    def test_invalid_vault_prefix(self, runner, mock_vaults):
        """Vault without setup- prefix is rejected."""
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main, ["my-sa", "--vault", "invalid-vault"]
                )
                assert result.exit_code == 1
                assert "must start with 'setup-'" in result.output
                assert "setup-ci" in result.output
                assert "setup-prod" in result.output

    def test_nonexistent_vault(self, runner, mock_vaults, monkeypatch, tmp_path):
        """Non-existent setup- vault shows available vaults."""
        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main, ["my-sa", "--vault", "setup-nonexistent"]
                )
                assert result.exit_code == 1
                assert "not found" in result.output
                assert "setup-ci" in result.output

    def test_expiration_too_short(self, runner, mock_vaults, monkeypatch, tmp_path):
        """Expiration under 1 hour is rejected."""
        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main,
                    ["my-sa", "--vault", "setup-ci", "--expiration", "30min"],
                )
                assert result.exit_code == 1
                assert "at least 1 hour" in result.output

    def test_dry_run_single_vault(self, runner, mock_vaults, monkeypatch, tmp_path):
        """Dry run shows planned actions without creating token (single vault)."""
        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main, ["my-sa", "--vault", "setup-ci", "--dry-run"]
                )
                assert result.exit_code == 0
                assert "Dry run" in result.output
                assert "vault-login-my-sa" in result.output
                assert "vault-id-ci" in result.output

    def test_dry_run_multiple_vaults(self, runner, mock_vaults, monkeypatch, tmp_path):
        """Dry run shows all vaults being granted access."""
        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main,
                    [
                        "gateway-prod",
                        "--vault",
                        "setup-ci",
                        "--vault",
                        "setup-prod",
                        "--dry-run",
                    ],
                )
                assert result.exit_code == 0
                assert "Dry run" in result.output
                assert "vault-login-gateway-prod" in result.output
                assert "setup-ci" in result.output
                assert "vault-id-ci" in result.output
                assert "setup-prod" in result.output
                assert "vault-id-prod" in result.output

    def test_not_authenticated(self, runner):
        """Error when not authenticated with op CLI."""
        with patch.object(vault_login, "check_op_authenticated", return_value=False):
            result = runner.invoke(vault_login.main, ["my-sa", "--vault", "setup-ci"])
            assert result.exit_code == 1
            assert "Not authenticated" in result.output

    def test_missing_secrets_dir_env(self, runner, mock_vaults, monkeypatch):
        """Error when VAULT_LOGIN_SECRETS_DIR is not set."""
        monkeypatch.delenv("VAULT_LOGIN_SECRETS_DIR", raising=False)
        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                result = runner.invoke(
                    vault_login.main, ["my-sa", "--vault", "setup-ci"]
                )
                assert result.exit_code == 1
                assert "VAULT_LOGIN_SECRETS_DIR" in result.output


class TestOpAuthentication:
    """Tests for 1Password CLI authentication checks."""

    def test_check_authenticated_success(self):
        """Authentication check succeeds with valid accounts."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = json.dumps([{"email": "test@example.com"}])

        with patch.object(vault_login, "run_op_command", return_value=mock_result):
            assert vault_login.check_op_authenticated() is True

    def test_check_authenticated_no_accounts(self):
        """Authentication check fails with empty accounts."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "[]"

        with patch.object(vault_login, "run_op_command", return_value=mock_result):
            assert vault_login.check_op_authenticated() is False

    def test_check_authenticated_command_fails(self):
        """Authentication check fails when command fails."""
        mock_result = MagicMock()
        mock_result.returncode = 1

        with patch.object(vault_login, "run_op_command", return_value=mock_result):
            assert vault_login.check_op_authenticated() is False


class TestServiceAccountCreation:
    """Tests for service account creation and token handling."""

    def test_create_service_account_uses_raw_flag(self):
        """Verify --raw flag is used to get clean token output."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "ops_fake_token_for_testing"

        with patch.object(
            vault_login, "run_op_command", return_value=mock_result
        ) as mock_cmd:
            vault_login.create_service_account(
                "test-sa", [("setup-test", "vault-id")], 3600
            )

            # Verify --raw flag is in the command
            call_args = mock_cmd.call_args[0][0]
            assert "--raw" in call_args
            assert "service-account" in call_args
            assert "create" in call_args
            assert "vault-login-test-sa" in call_args

    def test_create_service_account_multiple_vaults(self):
        """Verify multiple vault grants are added to command."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_result.stdout = "ops_fake_token_for_testing"

        with patch.object(
            vault_login, "run_op_command", return_value=mock_result
        ) as mock_cmd:
            vault_login.create_service_account(
                "gateway-prod",
                [("setup-gateway", "vault-id-1"), ("setup-cozy", "vault-id-2")],
                3600,
            )

            # Verify both vault grants are in the command
            call_args = mock_cmd.call_args[0][0]
            assert "--vault=vault-id-1:read_items,write_items" in call_args
            assert "--vault=vault-id-2:read_items,write_items" in call_args
            assert "vault-login-gateway-prod" in call_args

    def test_create_service_account_returns_clean_token(self):
        """Token should be stripped of whitespace."""
        mock_result = MagicMock()
        mock_result.returncode = 0
        # Simulate token with trailing newline
        mock_result.stdout = "ops_fake_token_blablabla\n"

        with patch.object(vault_login, "run_op_command", return_value=mock_result):
            token = vault_login.create_service_account(
                "test-sa", [("setup-test", "vault-id")], 3600
            )
            assert token == "ops_fake_token_blablabla"
            assert "\n" not in token

    def test_token_file_contains_only_token(self, monkeypatch, tmp_path):
        """Regression test: token file must contain only the token, no stderr or extra output."""
        from click.testing import CliRunner

        runner = CliRunner()
        mock_vaults = [{"name": "setup-ci", "id": "vault-id-ci"}]
        expected_token = "ops_fake_clean_token_only"

        monkeypatch.setenv("VAULT_LOGIN_SECRETS_DIR", str(tmp_path))

        # Mock the op command to return a clean token
        mock_create_result = MagicMock()
        mock_create_result.returncode = 0
        mock_create_result.stdout = expected_token

        with patch.object(vault_login, "check_op_authenticated", return_value=True):
            with patch.object(
                vault_login, "get_setup_vaults", return_value=mock_vaults
            ):
                with patch.object(
                    vault_login, "run_op_command", return_value=mock_create_result
                ):
                    result = runner.invoke(
                        vault_login.main, ["my-sa", "--vault", "setup-ci"]
                    )
                    assert result.exit_code == 0

        # Verify the token file contains exactly the token (new path: service account name)
        token_file = tmp_path / "my-sa"
        assert token_file.exists()
        file_contents = token_file.read_text()
        assert file_contents == expected_token
        # Ensure no stderr or extra content leaked into the file
        assert "Error" not in file_contents
        assert "Creating" not in file_contents
        assert "\n" not in file_contents


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
