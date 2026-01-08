#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""
vault-shell: Secure shell with 1Password secrets in a namespace-isolated tmpfs.

Creates an isolated shell environment using bubblewrap where secrets are stored in
a kernel-managed tmpfs that is ONLY visible inside the namespace. Secrets are
automatically cleaned up when the shell exits, including on SIGKILL or OOM killer.

Security model:
    - Secrets are injected INSIDE the bubblewrap namespace using `op inject`
    - The tmpfs at ./secrets.tmpfs only contains files inside the namespace
    - From outside the namespace, ./secrets.tmpfs appears as an empty directory
    - Secrets NEVER exist outside the namespace boundary
    - All cleanup is handled by the kernel when the namespace terminates

Usage:
    vault-shell <service-account-name> [--dir <directory>]

Environment:
    VAULT_SECRETS_DIR: Directory containing service account token files (required)
                       Default in .envrc: $SETUP_DIR/tmp/secrets
    SETUP_DIR:         Path to the setup repository (required)

The CLI looks for *.op.tpl template files in the current directory (or the directory
specified with --dir). Inside the namespace, `op inject` processes these templates
and writes resolved secrets to /secrets/{service_account_name}/ (a dedicated
namespace-isolated tmpfs).

Example:
    # With a .env.op.tpl file containing:
    #   DATABASE_URL=postgres://user:{{ op://my-vault/db/password }}@localhost/app
    # After running:
    vault-shell gateway-prod --dir apps/gateway-prod
    # Inside shell: cat /secrets/gateway-prod/.env  (secrets resolved)
    # From outside: /secrets/ doesn't exist (namespace isolation)
"""

import argparse
import json
import os
import shlex
import shutil
import sys
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


def get_setup_dir() -> Path:
    """Get the setup directory from environment variable."""
    setup_dir = os.environ.get("SETUP_DIR")
    if not setup_dir:
        error(
            "SETUP_DIR environment variable not set.",
            "This should be set by direnv. Run 'direnv allow' in the setup directory.",
        )
    return Path(setup_dir)


def get_secrets_dir() -> Path:
    """Get the secrets directory from environment variable."""
    secrets_dir = os.environ.get("VAULT_SECRETS_DIR")
    if not secrets_dir:
        error(
            "VAULT_SECRETS_DIR environment variable not set.",
            'Add to your .envrc: export VAULT_SECRETS_DIR="$SETUP_DIR/tmp/secrets"',
        )
    return Path(secrets_dir)


def list_available_service_accounts(secrets_dir: Path) -> list[str]:
    """List available service account names based on token files."""
    if not secrets_dir.exists():
        return []
    # Service account tokens are stored as files without extensions
    # Also support legacy .json and .token file extensions for compatibility
    service_accounts = []
    for f in secrets_dir.iterdir():
        if f.is_file():
            # Include files without extension (new format) and legacy formats
            if f.suffix == "" or f.suffix in (".json", ".token"):
                service_accounts.append(f.stem if f.suffix else f.name)
    return sorted(set(service_accounts))


def print_available_service_accounts(secrets_dir: Path) -> None:
    """Print list of available service accounts."""
    service_accounts = list_available_service_accounts(secrets_dir)
    if service_accounts:
        print("Available service accounts:", file=sys.stderr)
        for sa in service_accounts:
            print(f"  - {sa}", file=sys.stderr)
    else:
        print(f"No service account token files found in {secrets_dir}", file=sys.stderr)
        print(
            "Create tokens with: vault-login <service-account-name> --vault <vault-name>",
            file=sys.stderr,
        )


def load_token(secrets_dir: Path, service_account_name: str) -> str:
    """Load the service account token for the given service account."""
    # Try new format first (no extension), then legacy formats
    token_file = secrets_dir / service_account_name
    json_file = secrets_dir / f"{service_account_name}.json"
    legacy_token_file = secrets_dir / f"{service_account_name}.token"

    if token_file.exists() and token_file.is_file():
        # New format: raw token, no extension
        token = token_file.read_text().strip()
        if not token:
            error(f"Token file {token_file} is empty.")
        return token
    elif json_file.exists():
        # Legacy format: JSON with token field
        try:
            data = json.loads(json_file.read_text())
            token = data.get("token")
            if not token:
                error(f"Token file {json_file} has no 'token' field.")
            return token
        except json.JSONDecodeError:
            error(f"Invalid JSON in {json_file}")
    elif legacy_token_file.exists():
        # Legacy format: raw token with .token extension
        token = legacy_token_file.read_text().strip()
        if not token:
            error(f"Token file {legacy_token_file} is empty.")
        return token
    else:
        print(
            f"Error: No token file found for service account '{service_account_name}'",
            file=sys.stderr,
        )
        print(
            f"Looked for: {token_file}, {json_file}, or {legacy_token_file}",
            file=sys.stderr,
        )
        print(file=sys.stderr)
        print_available_service_accounts(secrets_dir)
        sys.exit(1)


def find_templates(directory: Path) -> list[Path]:
    """Find all *.op.tpl files in the given directory (non-recursive)."""
    if not directory.exists():
        error(f"Directory does not exist: {directory}")
    if not directory.is_dir():
        error(f"Not a directory: {directory}")
    return sorted(directory.glob("*.op.tpl"))


def get_output_name(template_path: Path) -> str:
    """Get the output filename by removing .op.tpl suffix."""
    name = template_path.name
    if name.endswith(".op.tpl"):
        return name[:-7]  # Remove .op.tpl
    return name


def build_init_script(
    templates: list[Path],
    secrets_dir_path: str,
    shell: str,
) -> str:
    """Build the shell script that runs inside the namespace.

    This script:
    1. Creates the secrets directory inside /secrets (a dedicated isolated tmpfs)
    2. Runs op inject for each template to populate the secrets directory
    3. Execs the user's shell

    The script runs inside the bubblewrap namespace where:
    - OP_SERVICE_ACCOUNT_TOKEN is set in the environment
    - /secrets is a namespace-isolated tmpfs (secrets never leak outside)
    - Template files are accessible (cwd is bind-mounted)
    """
    lines = [
        "set -e",  # Exit on first error
    ]

    # Create secrets directory inside the isolated /tmp tmpfs
    if templates:
        lines.append(f"mkdir -p {shlex.quote(secrets_dir_path)}")

    for template in templates:
        output_name = get_output_name(template)
        output_path = f"{secrets_dir_path}/{output_name}"
        # Use shlex.quote for safe shell escaping of paths
        lines.append(
            f"op inject -i {shlex.quote(str(template))} "
            f"-o {shlex.quote(output_path)}"
        )

    # Exec the user's shell as a login shell
    lines.append(f"exec {shlex.quote(shell)} -l")

    return "\n".join(lines)


def build_bwrap_command(
    token: str,
    service_account_name: str,
    templates: list[Path],
    template_dir: Path,
    setup_dir: Path,
) -> list[str]:
    """Build the bubblewrap command with proper isolation flags.

    The command runs an init script inside the namespace that:
    1. Creates /secrets/{service_account_name} inside the isolated /secrets tmpfs
    2. Processes templates with `op inject` directly into that directory
    3. Execs the user's shell

    This ensures secrets are ONLY written inside the namespace - they never
    exist outside the namespace boundary. We use /secrets/{service_account_name} as a
    dedicated tmpfs mount, avoiding issues with virtiofs/bind-mounted working
    directories where tmpfs mounts may not isolate properly.
    """
    home = os.environ.get("HOME", "/home/user")
    shell = os.environ.get("SHELL", "/bin/bash")
    # Use /secrets/{service_account_name} - a dedicated tmpfs for secrets
    # The service account name in the path makes it clear which service account is active
    secrets_path = f"/secrets/{service_account_name}"

    cmd = [
        "bwrap",
        # Cleanup guarantees
        "--die-with-parent",
        "--unshare-pid",
        "--unshare-ipc",
        # User namespace for proper mount isolation in container environments
        "--unshare-user-try",
        # Vault-shell specific environment variables
        "--setenv",
        "OP_SERVICE_ACCOUNT_TOKEN",
        token,
        "--setenv",
        "VAULT_SHELL_ACTIVE",
        "1",
        "--setenv",
        "VAULT_SHELL_NAME",
        service_account_name,
        "--setenv",
        "VAULT_SHELL_SERVICE_ACCOUNT",
        service_account_name,
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
        # Template directory (where *.op.tpl files are located)
        "--bind",
        str(template_dir),
        str(template_dir),
        # /secrets as dedicated isolated tmpfs for secrets
        # This is more reliable than mounting tmpfs on a virtiofs-backed path
        "--tmpfs",
        "/secrets",
        # /tmp as isolated tmpfs (needed by tools like trunk)
        "--tmpfs",
        "/tmp",
        # Device and proc filesystems
        "--dev",
        "/dev",
        "--proc",
        "/proc",
    ]

    # Mount SETUP_DIR - always mount it as this is the working directory inside the shell
    # This ensures hermit-managed binaries (starship, etc.) and all project files
    # remain accessible regardless of where templates are located
    setup_path = setup_dir.resolve()
    template_dir_resolved = template_dir.resolve()

    # Always bind SETUP_DIR
    cmd.extend(["--bind", str(setup_path), str(setup_path)])

    # Also bind template_dir if it's outside SETUP_DIR
    if not template_dir_resolved.is_relative_to(setup_path):
        cmd.extend(["--bind", str(template_dir_resolved), str(template_dir_resolved)])

    # Conditionally add /lib64 if it exists (some distros don't have it)
    if Path("/lib64").exists():
        cmd.extend(["--ro-bind", "/lib64", "/lib64"])

    # Pass through /var/run for Docker socket and other runtime state
    if Path("/var/run").exists():
        cmd.extend(["--bind", "/var/run", "/var/run"])

    # Working directory is always SETUP_DIR (project root)
    cmd.extend(["--chdir", str(setup_path)])

    # Build and run the init script that processes templates inside the namespace
    # The script runs `op inject` for each template, writing to /secrets/{service_account_name},
    # then execs the user's shell
    init_script = build_init_script(templates, secrets_path, shell)
    cmd.extend(["/bin/bash", "-c", init_script])

    return cmd


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Secure shell with 1Password secrets in namespace-isolated tmpfs.",
        epilog=(
            "Environment variables:\n"
            "  VAULT_SECRETS_DIR  Directory containing service account token files (required)\n"
            "  SETUP_DIR          Path to the setup repository (required)\n"
            "\n"
            "Templates:\n"
            "  Place *.op.tpl files in the current directory or use --dir to specify\n"
            "  a different directory. Templates will be processed with 'op inject' and\n"
            "  available at /secrets/<service-account>/<name> inside the shell.\n"
            "  This path is inside an isolated tmpfs that only exists within the\n"
            "  vault-shell namespace.\n"
            "\n"
            "Example:\n"
            "  # With .env.op.tpl in apps/gateway-prod:\n"
            "  vault-shell gateway-prod --dir apps/gateway-prod\n"
            "  # Inside shell: cat /secrets/gateway-prod/.env  (secrets resolved)\n"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "service_account_name",
        nargs="?",
        help="Name of the service account to use for secrets",
    )
    parser.add_argument(
        "--dir",
        "-d",
        dest="template_dir",
        type=Path,
        default=None,
        help="Directory containing *.op.tpl template files (default: current directory)",
    )

    args = parser.parse_args()

    # Platform and tool checks
    check_platform()
    check_bwrap_available()
    check_op_available()

    # Get required directories
    setup_dir = get_setup_dir()
    secrets_dir = get_secrets_dir()

    # Handle missing service account name
    if not args.service_account_name:
        print("Error: service account name is required", file=sys.stderr)
        print(file=sys.stderr)
        print_available_service_accounts(secrets_dir)
        sys.exit(1)

    service_account_name = args.service_account_name

    # Load token (will exit with helpful message if not found)
    token = load_token(secrets_dir, service_account_name)

    # Determine template directory
    template_dir = args.template_dir if args.template_dir else Path.cwd()
    template_dir = template_dir.resolve()

    # Find templates in the specified directory
    templates = find_templates(template_dir)
    # Secrets are stored in /secrets/{service_account_name} inside the isolated namespace
    # This is a dedicated tmpfs that only exists within the namespace
    secrets_path = f"/secrets/{service_account_name}"

    if templates:
        print(f"Found {len(templates)} template(s) to process:")
        for t in templates:
            output_name = get_output_name(t)
            print(f"  - {t.name} -> {secrets_path}/{output_name}")
    else:
        print(f"No *.op.tpl templates found in {template_dir}")

    # Build bwrap command
    # Templates are processed INSIDE the namespace by the init script,
    # ensuring secrets never exist outside the namespace boundary
    cmd = build_bwrap_command(
        token, service_account_name, templates, template_dir, setup_dir
    )

    # Show shell info
    print(f"\nStarting isolated shell (service account: {service_account_name})")
    print(f"Working directory: {setup_dir}")
    print(f"Secrets available at: {secrets_path}/")
    print("Type 'exit' to leave and cleanup secrets\n")

    # Replace current process with bwrap
    # The init script inside bwrap will:
    # 1. Run `op inject` for each template, writing to the namespace-isolated tmpfs
    # 2. Exec the user's shell
    # Secrets are written directly to the tmpfs inside the namespace and are
    # completely invisible from outside. Cleanup is automatic when the namespace exits.
    os.execvp("bwrap", cmd)


if __name__ == "__main__":
    main()
