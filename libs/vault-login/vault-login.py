#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "click==8.1.8",
#     "pytimeparse2==1.7.1",
# ]
# ///
"""Generate 1Password service account tokens for vaults with names starting with 'setup-'."""

import json
import os
import subprocess
import sys
from pathlib import Path

import click
import pytimeparse2

VAULT_PREFIX = "setup-"
MIN_EXPIRATION_SECONDS = 3600  # 1 hour


def run_op_command(args: list[str]) -> subprocess.CompletedProcess:
    """Run an op CLI command and return the result."""
    try:
        return subprocess.run(
            ["op", *args],
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        click.echo("Error: 1Password CLI ('op') not found.", err=True)
        click.echo(
            "Install it from: https://developer.1password.com/docs/cli/", err=True
        )
        sys.exit(1)


def check_op_authenticated() -> bool:
    """Check if the user is authenticated with the 1Password CLI."""
    result = run_op_command(["account", "list", "--format=json"])
    if result.returncode != 0:
        return False
    try:
        accounts = json.loads(result.stdout)
        return len(accounts) > 0
    except json.JSONDecodeError:
        return False


def get_setup_vaults() -> list[dict]:
    """Get all vaults that start with the setup- prefix."""
    result = run_op_command(["vault", "list", "--format=json"])
    if result.returncode != 0:
        click.echo(f"Error listing vaults: {result.stderr}", err=True)
        sys.exit(1)

    try:
        vaults = json.loads(result.stdout)
        return [v for v in vaults if v.get("name", "").startswith(VAULT_PREFIX)]
    except json.JSONDecodeError:
        click.echo("Error: Could not parse vault list output.", err=True)
        sys.exit(1)


def vault_exists(vault_name: str, setup_vaults: list[dict]) -> bool:
    """Check if a vault with the given name exists in the setup vaults."""
    return any(v.get("name") == vault_name for v in setup_vaults)


def get_vault_id(vault_name: str, setup_vaults: list[dict]) -> str | None:
    """Get the vault ID for a given vault name."""
    for v in setup_vaults:
        if v.get("name") == vault_name:
            return v.get("id")
    return None


def format_duration_for_op(seconds: int) -> str:
    """Format duration in seconds to a format acceptable by op CLI (e.g., '1h', '2h30m')."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    if minutes == 0:
        return f"{hours}h"
    return f"{hours}h{minutes}m"


def parse_expiration(expiration: str) -> int:
    """Parse expiration string and return seconds, or exit with error."""
    seconds = pytimeparse2.parse(expiration)
    if seconds is None:
        click.echo(f"Error: Invalid duration format: '{expiration}'", err=True)
        click.echo(
            "Valid formats: '1h', '1 hour', '2hours', '90 minutes', '1h30m'", err=True
        )
        sys.exit(1)

    if seconds < MIN_EXPIRATION_SECONDS:
        click.echo(
            f"Error: Expiration must be at least 1 hour. Got: '{expiration}' ({seconds} seconds)",
            err=True,
        )
        click.echo(
            "Examples of valid durations: '1h', '2 hours', '90min', '1h30m'", err=True
        )
        sys.exit(1)

    return seconds


def get_secrets_dir() -> Path:
    """Get the secrets directory from environment variable."""
    secrets_dir = os.environ.get("VAULT_LOGIN_SECRETS_DIR")
    if not secrets_dir:
        click.echo(
            "Error: VAULT_LOGIN_SECRETS_DIR environment variable not set.", err=True
        )
        click.echo(
            'Add to your .envrc: export VAULT_LOGIN_SECRETS_DIR="$SETUP_DIR/secrets/vault-logins"',
            err=True,
        )
        sys.exit(1)
    return Path(secrets_dir)


def create_service_account(
    vault_name: str, vault_id: str, expiration_seconds: int
) -> str:
    """Create a service account for the given vault and return the token."""
    expiration_str = format_duration_for_op(expiration_seconds)
    service_account_name = f"vault-login-{vault_name}"

    result = run_op_command(
        [
            "service-account",
            "create",
            service_account_name,
            f"--vault={vault_id}:read_items,write_items",
            f"--expires-in={expiration_str}",
            "--raw",
        ]
    )

    if result.returncode != 0:
        click.echo(f"Error creating service account: {result.stderr}", err=True)
        sys.exit(1)

    # The token is returned in stdout
    token = result.stdout.strip()
    if not token:
        click.echo("Error: No token returned from service account creation.", err=True)
        sys.exit(1)

    return token


@click.command()
@click.argument("vault_name")
@click.option(
    "--expiration",
    "-e",
    default="1h",
    help="Token expiration duration (default: 1h). Must be >= 1 hour.",
)
@click.option(
    "--dry-run",
    is_flag=True,
    help="Show what would be done without creating the token.",
)
def main(vault_name: str, expiration: str, dry_run: bool) -> None:
    """Generate a 1Password service account token for a vault.

    VAULT_NAME must start with 'setup-' prefix. The generated token will be
    saved to $VAULT_LOGIN_SECRETS_DIR/<vault-name>.token
    """
    # Check authentication
    if not check_op_authenticated():
        click.echo("Error: Not authenticated with 1Password CLI.", err=True)
        click.echo("Run 'op signin' to authenticate first.", err=True)
        sys.exit(1)

    # Validate vault name prefix
    if not vault_name.startswith(VAULT_PREFIX):
        click.echo(
            f"Error: Vault name must start with '{VAULT_PREFIX}' prefix.", err=True
        )
        click.echo(f"Got: '{vault_name}'", err=True)
        click.echo()
        setup_vaults = get_setup_vaults()
        if setup_vaults:
            click.echo(f"Available '{VAULT_PREFIX}' vaults:")
            for v in setup_vaults:
                click.echo(f"  - {v.get('name')}")
        else:
            click.echo(f"No vaults found with '{VAULT_PREFIX}' prefix.", err=True)
        sys.exit(1)

    # Parse and validate expiration
    expiration_seconds = parse_expiration(expiration)

    # Get setup vaults and check if the requested vault exists
    setup_vaults = get_setup_vaults()
    if not vault_exists(vault_name, setup_vaults):
        click.echo(f"Error: Vault '{vault_name}' not found.", err=True)
        click.echo()
        if setup_vaults:
            click.echo(f"Available '{VAULT_PREFIX}' vaults:")
            for v in setup_vaults:
                click.echo(f"  - {v.get('name')}")
        else:
            click.echo(f"No vaults found with '{VAULT_PREFIX}' prefix.", err=True)
        sys.exit(1)

    vault_id = get_vault_id(vault_name, setup_vaults)
    if not vault_id:
        click.echo(f"Error: Could not get ID for vault '{vault_name}'.", err=True)
        sys.exit(1)

    # Get secrets directory
    secrets_dir = get_secrets_dir()
    token_file = secrets_dir / f"{vault_name}.token"

    if dry_run:
        click.echo("Dry run - would perform the following actions:")
        click.echo(f"  1. Create service account 'vault-login-{vault_name}'")
        click.echo(
            f"  2. Grant read_items,write_items access to vault '{vault_name}' (ID: {vault_id})"
        )
        click.echo(
            f"  3. Set expiration to {format_duration_for_op(expiration_seconds)}"
        )
        click.echo(f"  4. Save token to: {token_file}")
        return

    # Create service account and get token
    click.echo(f"Creating service account for vault '{vault_name}'...")
    token = create_service_account(vault_name, vault_id, expiration_seconds)

    # Ensure secrets directory exists
    secrets_dir.mkdir(parents=True, exist_ok=True)

    # Write token to file
    token_file.write_text(token)
    token_file.chmod(0o600)

    click.echo(f"Token saved to: {token_file}")
    click.echo(f"Expiration: {format_duration_for_op(expiration_seconds)}")
    click.echo()
    click.echo("To use this token:")
    click.echo(f"  export OP_SERVICE_ACCOUNT_TOKEN=$(cat {token_file})")


if __name__ == "__main__":
    main()
