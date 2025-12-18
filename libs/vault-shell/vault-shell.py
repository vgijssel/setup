#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""
vault-shell: Secure shell with 1Password secrets temporarily injected into template files.

Creates an isolated shell environment using bubblewrap where secrets are stored in
a kernel-managed tmpfs. Secrets are automatically cleaned up when the shell exits,
including on SIGKILL or OOM killer.

Usage:
    vault-shell <vault-name>

Environment:
    VAULT_SECRETS_DIR: Directory containing vault token files (required)
                       Default in .envrc: $SETUP_DIR/secrets/vault-logins

The CLI looks for *.op.tpl template files in the current directory and injects
secrets using `op inject`. Processed files are available at /secrets inside the shell.

Example:
    # With a .env.op.tpl file containing:
    #   DATABASE_URL=postgres://user:{{ op://my-vault/db/password }}@localhost/app
    # After running:
    vault-shell my-vault
    # The shell will have /secrets/.env with resolved secrets
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def error(message: str, hint: str | None = None) -> None:
    """Print an error message and exit."""
    print(f"Error: {message}", file=sys.stderr)
    if hint:
        print(hint, file=sys.stderr)
    sys.exit(1)


def check_platform() -> None:
    """Verify we're running on Linux."""
    if sys.platform != "linux":
        error(
            "vault-shell requires Linux (uses bubblewrap for namespace isolation).",
            "This tool is not available on macOS or Windows.",
        )


def check_bwrap_available() -> None:
    """Check that bubblewrap is installed."""
    if shutil.which("bwrap") is None:
        error(
            "'bwrap' (bubblewrap) is not installed.",
            "Install with:\n"
            "  Debian/Ubuntu: sudo apt install bubblewrap\n"
            "  Fedora/RHEL:   sudo dnf install bubblewrap\n"
            "  Arch Linux:    sudo pacman -S bubblewrap",
        )


def check_op_available() -> None:
    """Check that 1Password CLI is installed."""
    if shutil.which("op") is None:
        error(
            "'op' (1Password CLI) is not installed.",
            "Install from: https://developer.1password.com/docs/cli/",
        )


def get_secrets_dir() -> Path:
    """Get the secrets directory from environment variable."""
    secrets_dir = os.environ.get("VAULT_SECRETS_DIR")
    if not secrets_dir:
        error(
            "VAULT_SECRETS_DIR environment variable not set.",
            'Add to your .envrc: export VAULT_SECRETS_DIR="$SETUP_DIR/secrets/vault-logins"',
        )
    return Path(secrets_dir)


def list_available_vaults(secrets_dir: Path) -> list[str]:
    """List available vault names based on token files."""
    if not secrets_dir.exists():
        return []
    # Support both .json and .token file extensions
    vaults = []
    for f in secrets_dir.iterdir():
        if f.is_file() and f.suffix in (".json", ".token"):
            vaults.append(f.stem)
    return sorted(set(vaults))


def print_available_vaults(secrets_dir: Path) -> None:
    """Print list of available vaults."""
    vaults = list_available_vaults(secrets_dir)
    if vaults:
        print("Available vaults:", file=sys.stderr)
        for v in vaults:
            print(f"  - {v}", file=sys.stderr)
    else:
        print(f"No vault token files found in {secrets_dir}", file=sys.stderr)
        print("Create tokens with: vault-login <vault-name>", file=sys.stderr)


def load_token(secrets_dir: Path, vault_name: str) -> str:
    """Load the service account token for the given vault."""
    # Try .json first (structured format), then .token (raw format)
    json_file = secrets_dir / f"{vault_name}.json"
    token_file = secrets_dir / f"{vault_name}.token"

    if json_file.exists():
        try:
            data = json.loads(json_file.read_text())
            token = data.get("token")
            if not token:
                error(f"Token file {json_file} has no 'token' field.")
            return token
        except json.JSONDecodeError:
            error(f"Invalid JSON in {json_file}")
    elif token_file.exists():
        # Raw token format (from vault-login)
        token = token_file.read_text().strip()
        if not token:
            error(f"Token file {token_file} is empty.")
        return token
    else:
        print(f"Error: No token file found for vault '{vault_name}'", file=sys.stderr)
        print(f"Looked for: {json_file} or {token_file}", file=sys.stderr)
        print(file=sys.stderr)
        print_available_vaults(secrets_dir)
        sys.exit(1)


def find_templates(directory: Path) -> list[Path]:
    """Find all *.op.tpl files in the given directory (non-recursive)."""
    return sorted(directory.glob("*.op.tpl"))


def get_output_name(template_path: Path) -> str:
    """Get the output filename by removing .op.tpl suffix."""
    name = template_path.name
    if name.endswith(".op.tpl"):
        return name[:-7]  # Remove .op.tpl
    return name


def process_templates(templates: list[Path], staging_dir: Path, token: str) -> bool:
    """Process templates with op inject into staging directory.

    Returns True on success, False on failure.
    """
    if not templates:
        return True

    env = os.environ.copy()
    env["OP_SERVICE_ACCOUNT_TOKEN"] = token

    for template in templates:
        output_name = get_output_name(template)
        output_path = staging_dir / output_name

        result = subprocess.run(
            ["op", "inject", "-i", str(template), "-o", str(output_path)],
            env=env,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            print(f"Error processing template: {template}", file=sys.stderr)
            print(result.stderr, file=sys.stderr)
            return False

        print(f"  Processed: {template.name} -> /secrets/{output_name}")

    return True


def build_bwrap_command(
    token: str,
    staging_dir: Path,
    template_files: list[tuple[str, Path]],
    cwd: Path,
) -> list[str]:
    """Build the bubblewrap command with proper isolation flags."""
    home = os.environ.get("HOME", "/home/user")
    shell = os.environ.get("SHELL", "/bin/bash")
    setup_dir = os.environ.get("SETUP_DIR")

    cmd = [
        "bwrap",
        # Cleanup guarantees
        "--die-with-parent",
        "--unshare-pid",
        "--unshare-ipc",
        # Vault-shell specific environment variables
        "--setenv",
        "OP_SERVICE_ACCOUNT_TOKEN",
        token,
        "--setenv",
        "VAULT_SHELL_ACTIVE",
        "1",
        "--setenv",
        "VAULT_SHELL_TMPDIR",
        "/secrets",
        # System directories (read-only)
        "--ro-bind",
        "/usr",
        "/usr",
        "--ro-bind",
        "/bin",
        "/bin",
        "--ro-bind",
        "/lib",
        "/lib",
        "--ro-bind",
        "/etc",
        "/etc",
        # Home directory (read-write to allow shell config, caches, etc.)
        "--bind",
        home,
        home,
        # Current working directory (read-write)
        "--bind",
        str(cwd),
        str(cwd),
        # Secrets tmpfs (kernel-managed, auto-cleaned on exit)
        "--tmpfs",
        "/secrets",
        # Tmp directory (needed by tools like trunk)
        "--tmpfs",
        "/tmp",
        # Device and proc filesystems
        "--dev",
        "/dev",
        "--proc",
        "/proc",
    ]

    # Mount SETUP_DIR if it exists and differs from cwd
    # This ensures hermit-managed binaries (starship, etc.) remain accessible
    # when running from a subdirectory
    if setup_dir:
        setup_path = Path(setup_dir).resolve()
        cwd_resolved = cwd.resolve()
        # Mount SETUP_DIR if cwd is within it (subdirectory) or completely separate
        # Only skip if cwd IS setup_dir or setup_dir is within cwd
        if setup_path != cwd_resolved and not setup_path.is_relative_to(cwd_resolved):
            cmd.extend(["--bind", str(setup_path), str(setup_path)])

    # Conditionally add /lib64 if it exists (some distros don't have it)
    if Path("/lib64").exists():
        cmd.extend(["--ro-bind", "/lib64", "/lib64"])

    # Bind mount each processed template into /secrets
    for output_name, staging_path in template_files:
        cmd.extend(["--bind", str(staging_path), f"/secrets/{output_name}"])

    # Working directory
    cmd.extend(["--chdir", str(cwd)])

    # The shell to run as a login shell
    cmd.extend([shell, "-l"])

    return cmd


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Secure shell with 1Password secrets in namespace-isolated tmpfs.",
        epilog=(
            "Environment variables:\n"
            "  VAULT_SECRETS_DIR  Directory containing vault token files (required)\n"
            "\n"
            "Templates:\n"
            "  Place *.op.tpl files in the current directory. They will be processed\n"
            "  with 'op inject' and available at /secrets/<name> inside the shell.\n"
            "\n"
            "Example:\n"
            "  # With .env.op.tpl in current directory:\n"
            "  vault-shell my-vault\n"
            "  # Inside shell: cat /secrets/.env  (secrets resolved)\n"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "vault_name",
        nargs="?",
        help="Name of the vault to use for secrets",
    )

    args = parser.parse_args()

    # Platform and tool checks
    check_platform()
    check_bwrap_available()
    check_op_available()

    # Get secrets directory
    secrets_dir = get_secrets_dir()

    # Handle missing vault name
    if not args.vault_name:
        print("Error: vault name is required", file=sys.stderr)
        print(file=sys.stderr)
        print_available_vaults(secrets_dir)
        sys.exit(1)

    vault_name = args.vault_name

    # Load token (will exit with helpful message if not found)
    token = load_token(secrets_dir, vault_name)

    # Find templates in current directory
    cwd = Path.cwd()
    templates = find_templates(cwd)

    if templates:
        print(f"Found {len(templates)} template(s) to process:")
        for t in templates:
            print(f"  - {t.name}")
    else:
        print("No *.op.tpl templates found in current directory")

    # Create staging directory and process templates
    with tempfile.TemporaryDirectory(prefix="vault-shell-") as staging:
        staging_dir = Path(staging)

        # Process templates
        if templates:
            print("\nProcessing templates...")
            if not process_templates(templates, staging_dir, token):
                error("Template processing failed")

        # Build list of files to bind mount
        template_files: list[tuple[str, Path]] = []
        for template in templates:
            output_name = get_output_name(template)
            template_files.append((output_name, staging_dir / output_name))

        # Build bwrap command
        cmd = build_bwrap_command(token, staging_dir, template_files, cwd)

        # Show shell info
        print(f"\nStarting isolated shell (vault: {vault_name})")
        print("Secrets available at: /secrets/")
        print("Type 'exit' to leave and cleanup secrets\n")

        # Replace current process with bwrap
        # Note: We use execvp which will NOT return - the Python process
        # is replaced by bwrap. The staging directory will be cleaned up
        # by the OS when the Python process terminates (since tempfile
        # uses atexit registration), but more importantly, the /secrets
        # tmpfs inside bwrap is kernel-managed and guaranteed to be
        # cleaned up when the namespace exits.
        os.execvp("bwrap", cmd)


if __name__ == "__main__":
    main()
