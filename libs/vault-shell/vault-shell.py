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
    vault-shell <vault-name>

Environment:
    VAULT_SECRETS_DIR: Directory containing vault token files (required)
                       Default in .envrc: $SETUP_DIR/secrets/vault-logins
    SETUP_DIR:         Path to the setup repository (required)

The CLI looks for *.op.tpl template files in the current directory. Inside the
namespace, `op inject` processes these templates and writes resolved secrets
to /secrets/{vault_name}/ (a dedicated namespace-isolated tmpfs).

Example:
    # With a .env.op.tpl file containing:
    #   DATABASE_URL=postgres://user:{{ op://my-vault/db/password }}@localhost/app
    # After running:
    vault-shell my-vault
    # Inside shell: cat /secrets/my-vault/.env  (secrets resolved)
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
    vault_name: str,
    templates: list[Path],
    cwd: Path,
    setup_dir: Path,
) -> list[str]:
    """Build the bubblewrap command with proper isolation flags.

    The command runs an init script inside the namespace that:
    1. Creates /secrets/{vault_name} inside the isolated /secrets tmpfs
    2. Processes templates with `op inject` directly into that directory
    3. Execs the user's shell

    This ensures secrets are ONLY written inside the namespace - they never
    exist outside the namespace boundary. We use /secrets/{vault_name} as a
    dedicated tmpfs mount, avoiding issues with virtiofs/bind-mounted working
    directories where tmpfs mounts may not isolate properly.
    """
    home = os.environ.get("HOME", "/home/user")
    shell = os.environ.get("SHELL", "/bin/bash")
    # Use /secrets/{vault_name} - a dedicated tmpfs for secrets
    # The vault_name in the path makes it clear which vault is active
    secrets_path = f"/secrets/{vault_name}"

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
        vault_name,
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

    # Mount SETUP_DIR if it differs from cwd
    # This ensures hermit-managed binaries (starship, etc.) remain accessible
    # when running from a subdirectory
    setup_path = setup_dir.resolve()
    cwd_resolved = cwd.resolve()
    # Mount SETUP_DIR if cwd is within it (subdirectory) or completely separate
    # Only skip if cwd IS setup_dir or setup_dir is within cwd
    if setup_path != cwd_resolved and not setup_path.is_relative_to(cwd_resolved):
        cmd.extend(["--bind", str(setup_path), str(setup_path)])

    # Conditionally add /lib64 if it exists (some distros don't have it)
    if Path("/lib64").exists():
        cmd.extend(["--ro-bind", "/lib64", "/lib64"])

    # Working directory
    cmd.extend(["--chdir", str(cwd)])

    # Build and run the init script that processes templates inside the namespace
    # The script runs `op inject` for each template, writing to /tmp/vault-shell-secrets,
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
            "  VAULT_SECRETS_DIR  Directory containing vault token files (required)\n"
            "  SETUP_DIR          Path to the setup repository (required)\n"
            "\n"
            "Templates:\n"
            "  Place *.op.tpl files in the current directory. They will be processed\n"
            "  with 'op inject' and available at /secrets/<vault>/<name> inside the\n"
            "  shell. This path is inside an isolated tmpfs that only exists within\n"
            "  the vault-shell namespace.\n"
            "\n"
            "Example:\n"
            "  # With .env.op.tpl in current directory:\n"
            "  vault-shell my-vault\n"
            "  # Inside shell: cat /secrets/my-vault/.env  (secrets resolved)\n"
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

    # Get required directories
    setup_dir = get_setup_dir()
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
    # Secrets are stored in /secrets/{vault_name} inside the isolated namespace
    # This is a dedicated tmpfs that only exists within the namespace
    secrets_path = f"/secrets/{vault_name}"

    if templates:
        print(f"Found {len(templates)} template(s) to process:")
        for t in templates:
            output_name = get_output_name(t)
            print(f"  - {t.name} -> {secrets_path}/{output_name}")
    else:
        print("No *.op.tpl templates found in current directory")

    # Build bwrap command
    # Templates are processed INSIDE the namespace by the init script,
    # ensuring secrets never exist outside the namespace boundary
    cmd = build_bwrap_command(token, vault_name, templates, cwd, setup_dir)

    # Show shell info
    print(f"\nStarting isolated shell (vault: {vault_name})")
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
